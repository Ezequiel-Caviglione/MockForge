import { NextResponse } from 'next/server';
import {
  generateMocks,
  ProviderRouter,
  createOpenRouterProvider,
  createGroqProvider,
  createCerebrasProvider,
  OpenAICompatibleProvider
} from '@mockforge/core';
import type { LLMProvider } from '@mockforge/core';

export async function POST(req: Request) {
  try {
    const { schema, customProvider } = await req.json();

    if (!schema) {
      return NextResponse.json({ error: 'Code/Schema input is required' }, { status: 400 });
    }

    const providers: LLMProvider[] = [];

    // 1. Highest priority: User's custom provider
    if (customProvider?.apiKey) {
      const baseURL = customProvider.baseURL || 'https://openrouter.ai/api/v1';
      const model = customProvider.model || 'openrouter/free';

      const customConf = new OpenAICompatibleProvider({
        name: 'custom-user-provider',
        baseURL,
        apiKey: customProvider.apiKey,
        model,
        maxRPM: 30
      });
      providers.push(customConf);
    }

    // 2. Server default fallbacks
    if (process.env.CEREBRAS_API_KEY) {
      providers.push(createCerebrasProvider(
        process.env.CEREBRAS_API_KEY,
        'llama3.1-8b'
      ));
    }
    if (process.env.GROQ_API_KEY) {
      providers.push(createGroqProvider(
        process.env.GROQ_API_KEY,
        'llama-3.3-70b-versatile'
      ));
    }
    if (process.env.OPENROUTER_API_KEY) {
      providers.push(createOpenRouterProvider(
        process.env.OPENROUTER_API_KEY,
        'openrouter/free'
      ));
    }

    if (providers.length === 0) {
      return NextResponse.json(
        { error: 'No LLM providers configured. Add an API key or configure server variables.' },
        { status: 400 }
      );
    }

    const router = new ProviderRouter(providers);

    // 3. Generate Mocks pipeline (Pure AI)
    const result = await generateMocks(schema, { router });

    return NextResponse.json({
      scenarios: result.scenarios,
      metadata: {
        count: result.scenarios.length,
        aiUsed: true,
        duration: result.duration
      }
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
