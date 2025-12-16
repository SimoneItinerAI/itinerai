import OpenAI from 'openai';
import { env } from '../utils/env.js';

export interface LlmMessage {
  role: 'system' | 'user';
  content: string;
}

export async function callLlmJson(messages: LlmMessage[], jsonSchema: any): Promise<any> {
  if (!env.OPENAI_API_KEY) {
    throw Object.assign(new Error('OPENAI_API_KEY not configured'), { status: 500 });
  }

  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const responseFormat = jsonSchema?.schema
    ? { type: 'json_schema', json_schema: { name: 'ItinerarySchema', schema: jsonSchema.schema, strict: false } }
    : { type: 'json_object' };
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: responseFormat as any,
    temperature: 0.7,
    messages: messages.map(m => ({ role: m.role, content: m.content }))
  });

  const content = completion.choices?.[0]?.message?.content ?? '{}';
  let data: unknown;
  try {
    data = JSON.parse(content);
  } catch {
    const retry = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: responseFormat as any,
      temperature: 0.1,
      messages: [
        ...messages,
        { role: 'system', content: 'Return ONLY valid JSON. No markdown fences, no comments, no explanations.' }
      ]
    });
    const contentR = retry.choices?.[0]?.message?.content ?? '{}';
    try {
      data = JSON.parse(contentR);
    } catch {
      throw Object.assign(new Error('LLM returned invalid JSON'), { status: 502 });
    }
  }

  if (jsonSchema?.safeParse) {
    const parsed = jsonSchema.safeParse(data);
    if (!parsed.success) {
      const retry = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: responseFormat as any,
        temperature: 0.2,
        messages: [
          ...messages,
          { role: 'system', content: 'The previous output did not validate. Return ONLY valid JSON that strictly matches the expected schema. No comments, no explanations.' }
        ]
      });
      const content2 = retry.choices?.[0]?.message?.content ?? '{}';
      let data2: unknown;
      try {
        data2 = JSON.parse(content2);
      } catch {
        throw Object.assign(new Error('LLM returned invalid JSON'), { status: 502 });
      }
      const parsed2 = jsonSchema.safeParse(data2);
      if (!parsed2.success) {
        return data2 as any;
      }
      return parsed2.data;
    }
    return parsed.data;
  }
  return data;
}
