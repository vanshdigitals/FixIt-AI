# Fix-It

Fix-It is an agentic code-review demo for the **Agentic Coding** track. It accepts a unified git diff, visibly walks through plan → analyse → patch → verify → summary, then gives developers a concrete findings list, unified patch and Markdown report.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The intentionally risky sample diff is pre-filled and works with **no login and no API key**. Click **Review & Fix** to see the replayed agent run, suggested repair and simulated green result.

```bash
npm test
npm run typecheck
npm run build
# optional after installing browser binaries: npx playwright install && npm run test:e2e
```

## Prerequisites and modes

- **Demo (default):** `DEMO_MODE=true` replays `data/demo-run.json`; no account, login or key is needed.
- **Live (optional):** copy `.env.example` to `.env.local`, set `DEMO_MODE=false` and add only `OPENAI_API_KEY`. `OPENAI_MODEL` is configurable.
- The OpenAI SDK is used only by `app/api/review/route.ts`; the browser never sees the key. `.env*` is ignored by Git, except the safe example.
- **Important:** the “Run tests” phase is deliberately a **SIMULATED/heuristic result in both modes**. Vercel has no checkout of an arbitrary pasted diff and server functions have a short (~10 s) limit. Fix-It never runs `npm test` or any pasted code on Vercel.

The sample diff concretely applies to `data/fixture/src/auth.ts`. Demo results follow the required data shape in `data/demo-run.json`.

## Deploy to Vercel in five minutes

1. Push this folder to a GitHub repository.
2. In [Vercel](https://vercel.com/new), import that repository and keep the detected Next.js settings.
3. Deploy immediately for demo mode (no environment variables needed).
4. For live mode, add `OPENAI_API_KEY`, `OPENAI_MODEL` (optional), and `DEMO_MODE=false` under Project Settings → Environment Variables.
5. Redeploy, then paste a diff and review it. Keep the key server-side only.

## How Codex built this

1. Created a TypeScript Next.js App Router application with a mobile-first, keyboard-accessible interface.
2. Added a deterministic no-key agent replay for a real auth fixture, plus a safe heuristic fallback.
3. Added a server-only optional OpenAI review route and explicit guardrails against executing diffs.
4. Added unit tests for parsing, review heuristics and patch application, with a Playwright smoke test.
5. Added deployment notes, environment template, plan milestones, license and agent instructions.

## Assumptions

- A pasted diff is untrusted text, not code that Fix-It may run.
- “Patch” in live mode is model-proposed and must be reviewed before applying.
- The app prioritizes a transparent demo over claiming CI-level verification.
