# MockForge

**Smart scenario mocking for complex code models. Stop writing fixtures by hand.**

Instead of generating a completely random JSON object that makes no semantic sense, MockForge uses LLM intelligence to analyze your schemas, types, and classes in any language format. It identifies relationships, nullable fields, and enumerations, generating realistic mock JSON scenarios automatically.

With MockForge, you can simply paste a `TypeScript` interface, a `Java` class, or a `Prisma` model into the Monaco editor, and it will compute all edge cases, happy paths, and error scenarios.

## Monorepo Architecture

- `apps/web`: Next.js Web IDE using Monaco Editor. Handles language-agnostic input.
- `packages/core`: Pure AI generator pipeline and OpenAI-compatible dynamic provider routing.
- `packages/formatters`: Transforming arrays of objects into JSON, TS code, etc.

## How to run

Requirements: **Node >= 20**, **pnpm** (with Turborepo)

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` to start editing schemas.
Click ⚙️ **Settings** to input your own custom OpenAI-compatible endpoint (e.g., OpenRouter, Groq, Cerebras) if you haven't set up the `.env.local` server defaults!
