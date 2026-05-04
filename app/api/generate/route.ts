import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { APP_CONFIG } from '@/lib/config';
import { buildUserPrompt, OUTPUT_SCHEMA, SYSTEM_PROMPT } from '@/lib/prompts';
import type { StrategicMessagingOutput } from '@/lib/types';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body.message || '');
    if (!message.trim()) return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    if (message.length > APP_CONFIG.maxMessageChars) return NextResponse.json({ error: `Message must be ${APP_CONFIG.maxMessageChars} characters or fewer.` }, { status: 400 });
    // TODO: add IP/user-based rate limiting before broader public launch.

    const prompt = buildUserPrompt(body);

    const response = await client.responses.create({
      model: APP_CONFIG.model,
      temperature: APP_CONFIG.temperature,
      max_output_tokens: APP_CONFIG.maxOutputTokens,
      input: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'strategic_messaging_output',
          schema: OUTPUT_SCHEMA,
          strict: true,
        },
      },
    });

    const parsed = JSON.parse(response.output_text) as StrategicMessagingOutput;
    return NextResponse.json({ output: parsed });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to generate a strategic rewrite right now. Please try again.' }, { status: 500 });
  }
}
