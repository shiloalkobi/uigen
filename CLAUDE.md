# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup          # Install deps + generate Prisma client + run migrations (first time)
npm run dev            # Start dev server (Turbopack)
npm run build          # Production build
npm run lint           # ESLint
npm run test           # Run all Vitest tests
npm run db:reset       # Reset database (destructive)
```

Run a single test file:
```bash
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx
```

## Environment

- `.env` must have `ANTHROPIC_API_KEY` for real AI responses; omitting it falls back to a static `MockLanguageModel` that returns hardcoded examples.
- Database is SQLite at `prisma/dev.db`.

## Architecture

**UIGen** is an AI-powered React component generator with live preview. Users describe components in chat; Claude generates files in a virtual filesystem; Babel compiles and renders them in an iframe.

### Request flow

1. User sends a message in `ChatInterface` → POST `/api/chat`
2. `/api/chat/route.ts` calls Claude (via Vercel AI SDK `streamText`) with the current virtual FS state
3. Claude uses two tools to modify files:
   - `str_replace_editor` — create/edit file content (`src/lib/tools/str-replace.ts`)
   - `file_manager` — rename/delete files (`src/lib/tools/file-manager.ts`)
4. Streaming response is returned; the client's `FileSystemContext` is updated
5. `PreviewFrame` recompiles JSX via `@babel/standalone` in the browser and renders in a sandboxed iframe
6. For authenticated users, the project (messages + serialized FS) is saved to SQLite via Prisma

### Key layers

| Layer | Location | Notes |
|-------|----------|-------|
| UI layout | `src/app/main-content.tsx` | Resizable panels: chat / preview / code editor |
| Chat state | `src/lib/contexts/chat-context.tsx` | Wraps Vercel AI SDK `useChat` |
| Virtual FS | `src/lib/file-system.ts` + `src/lib/contexts/file-system-context.tsx` | In-memory only; serialized to JSON for DB |
| AI endpoint | `src/app/api/chat/route.ts` | `streamText`, tool calls, project persistence |
| Provider | `src/lib/provider.ts` | Returns Anthropic model or MockLanguageModel |
| System prompt | `src/lib/prompts/generation.tsx` | Instructions Claude receives on every request |
| Auth | `src/lib/auth.ts` + `src/actions/index.ts` | JWT in httpOnly cookies, bcrypt passwords |
| DB schema | `prisma/schema.prisma` | `User` and `Project` models; `Project.data` stores serialized FS as JSON string |

### Path alias

All source imports use `@/` → `src/`. (e.g., `import { FileSystem } from "@/lib/file-system"`)

### AI model

Currently uses `claude-haiku-4-5` with prompt caching (`cacheControl: { type: "ephemeral" }`) on the system prompt. Max tokens: 10,000; max tool-calling steps: 40.

### Testing

Vitest with jsdom + React Testing Library. Test files live in `__tests__/` subdirectories next to the code they test.

## Code Style

Use comments sparingly. Only comment complex code.

## Database

The database schema is defined in prisma/schema.prisma. Reference it anytime you need to understand the structure of data stored in the database.

