# MockForge Web App

The visual frontend for MockForge, built with Next.js App Router and Zustand.

## Features

- **Language Agnostic Editor**: Uses Monaco Editor to provide a sleek, fast, and familiar typing experience. Paste code models from any language to create mock scenarios.
- **Interactive Scenarios**: View generated objects via dynamic "Cards".
- **Formatting Playground**: Copy or download fixtures automatically transcompiled to your preferred standard format.
- **Custom Local Inference**: Settings panel to inject your personal OpenAI-compatible API credentials to route AI inferences locally.

## Getting Started

```bash
pnpm dev
```

The application runs independently as a monorepo workspace package, consuming `@mockforge/core` internally.
