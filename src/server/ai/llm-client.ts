import OpenAI from 'openai';

export interface LlmMessage {
  role: 'system' | 'user';
  content: string;
}

export async function callLlmJson(messages: LlmMessage[], jsonSchema: any): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error('OPENAI_API_KEY not configured'), { status: 500 });
  }

  const client = new OpenAI({ apiKey });
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
      throw Object.assign(new Error('LLM JSON validation failed'), { status: 502, details: parsed.error.format() });
    }
    return parsed.data;
  }
  return data;
}
