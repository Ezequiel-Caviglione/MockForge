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

// ---------------------------------------------------------------------------
// Error classification
// ---------------------------------------------------------------------------

type ErrorCode = 'RATE_LIMITED' | 'AUTH_ERROR' | 'NO_PROVIDERS' | 'PARSE_ERROR' | 'NETWORK_ERROR' | 'UNKNOWN';

function classifyError(err: unknown): { message: string; code: ErrorCode; status: number } {
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();

  if (lower.includes('rate limit') || lower.includes('429') || lower.includes('too many requests')) {
    return {
      message: 'Rate limit reached. Wait a moment or add your own API key in Settings.',
      code: 'RATE_LIMITED',
      status: 429,
    };
  }
  if (lower.includes('401') || lower.includes('invalid api key') || lower.includes('unauthorized') || lower.includes('authentication')) {
    return {
      message: 'Invalid API key. Check your credentials in Settings.',
      code: 'AUTH_ERROR',
      status: 401,
    };
  }
  if (lower.includes('parse') || lower.includes('json') || lower.includes('unexpected token')) {
    return {
      message: 'The AI returned an unexpected response format. Try again.',
      code: 'PARSE_ERROR',
      status: 502,
    };
  }
  if (lower.includes('network') || lower.includes('econnrefused') || lower.includes('fetch failed') || lower.includes('enotfound')) {
    return {
      message: 'Network error reaching the AI provider. Check your connection.',
      code: 'NETWORK_ERROR',
      status: 503,
    };
  }

  return { message: msg || 'Internal Server Error', code: 'UNKNOWN', status: 500 };
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  try {
    const { schema, customProvider } = await req.json();

    if (!schema) {
      return NextResponse.json(
        { error: 'Code/Schema input is required', code: 'UNKNOWN' },
        { status: 400 }
      );
    }

    const providers: LLMProvider[] = [];

    // 1. Highest priority: User's custom provider
    if (customProvider?.apiKey) {
      const baseURL = customProvider.baseURL || 'https://openrouter.ai/api/v1';
      const model = customProvider.model || 'openrouter/free';
      providers.push(new OpenAICompatibleProvider({
        name: 'custom-user-provider',
        baseURL,
        apiKey: customProvider.apiKey,
        model,
        maxRPM: 30,
      }));
    }

    // 2. Server default providers
    if (process.env.CEREBRAS_API_KEY) {
      providers.push(createCerebrasProvider(process.env.CEREBRAS_API_KEY, 'llama3.1-8b'));
    }
    if (process.env.GROQ_API_KEY) {
      providers.push(createGroqProvider(process.env.GROQ_API_KEY, 'llama-3.3-70b-versatile'));
    }
    if (process.env.OPENROUTER_API_KEY) {
      providers.push(createOpenRouterProvider(process.env.OPENROUTER_API_KEY, 'openrouter/free'));
    }

    if (providers.length === 0) {
      return NextResponse.json(
        {
          error: 'No LLM providers configured. Add a provider API key in Settings or set server environment variables.',
          code: 'NO_PROVIDERS',
        },
        { status: 400 }
      );
    }

    const router = new ProviderRouter(providers);
    const result = await generateMocks(schema, { router });

    return NextResponse.json({
      scenarios: result.scenarios,
      metadata: {
        count: result.scenarios.length,
        aiUsed: true,
        duration: result.duration,
      },
    });

  } catch (error: unknown) {
    console.error('[MockForge API] Generation error:', error);
    const { message, code, status } = classifyError(error);
    return NextResponse.json({ error: message, code }, { status });
  }
}
