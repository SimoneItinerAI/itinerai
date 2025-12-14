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
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    temperature: 0.7,
    messages: messages.map(m => ({ role: m.role, content: m.content }))
  });

  const content = completion.choices?.[0]?.message?.content ?? '{}';
  let data: unknown;
  try {
    data = JSON.parse(content);
  } catch {
    throw Object.assign(new Error('LLM returned invalid JSON'), { status: 502 });
  }

  if (jsonSchema?.safeParse) {
    const parsed = jsonSchema.safeParse(data);
    if (!parsed.success) {
      const retry = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
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
        throw Object.assign(new Error('LLM JSON validation failed'), { status: 502, details: parsed2.error.format() });
      }
      return parsed2.data;
    }
    return parsed.data;
  }
  return data;
}
