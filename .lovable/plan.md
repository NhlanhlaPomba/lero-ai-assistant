
# LERO Workplace Assistant — Build Plan

A polished, dark-themed, responsive SaaS dashboard with three AI-powered tools. No auth, no database — client state only. AI calls go through Lovable AI Gateway (server functions), which I'll enable as part of the build.

## Design direction

- **Aesthetic**: dark/gray corporate SaaS (Linear/Notion polish). Soft dark neutrals (near-black background, elevated card surfaces), one indigo accent, generous whitespace, subtle borders + shadows, rounded corners, modern sans-serif (Inter or similar loaded via `<link>` in `__root.tsx`).
- **Tokens**: defined in `src/styles.css` under `:root`, `.dark`, and `@theme inline` — no hardcoded colors in components. App forces the `dark` class on `<html>`.
- **Typography**: display + body pairing, tight tracking on headings.

## Layout & navigation

- `src/routes/__root.tsx`: sets real title/description/OG metadata ("LERO Workplace Assistant — AI tools for everyday work"), loads font via `<link>`, forces dark mode, renders the app shell.
- App shell using shadcn `Sidebar` (`collapsible="icon"`):
  - **Header**: LERO logo/wordmark + tagline ("Your AI copilot for everyday work"), `SidebarTrigger`.
  - **Sidebar**: Dashboard, Email Generator, Task Planner, Research Assistant (Lucide icons + labels). Active state via `useRouterState`. Collapsible on desktop/tablet; on mobile it becomes an offcanvas sheet triggered by a hamburger in the header (shadcn Sidebar handles this natively).
  - **Footer disclaimer**: persistent, amber/warning-styled banner: "⚠ AI-generated content may contain errors — please review before use." Visible on every page.

## Routes

```
src/routes/
  __root.tsx          shell + providers + metadata
  index.tsx           Dashboard: 3 clickable feature cards + welcome
  email.tsx           Smart Email Generator
  tasks.tsx           AI Task Planner
  research.tsx        AI Research Assistant
  api/
    ai.email.ts       server route or via createServerFn
    ai.tasks.ts
    ai.research.ts
```

I'll use `createServerFn` (in `src/lib/ai.functions.ts`) for the three AI calls — one-shot generations, not streaming chat. Each function:
- Reads `LOVABLE_API_KEY` inside the handler.
- Builds a structured prompt (system + user) with the tone/plan-type/etc. options.
- Calls `openai/gpt-5.5` via the Lovable AI Gateway provider helper (`src/lib/ai-gateway.server.ts`).
- Returns `{ output: string, promptUsed: string }` so the UI can show the "Prompt used" collapsible.

## Feature pages

Each page shares a common structure: heading, input card, options, Generate button, output card with editable `<Textarea>` + Copy button, and a `<Collapsible>` "Prompt used" panel showing the exact system+user prompt sent.

1. **Email Generator (`/email`)**
   - Inputs: Purpose/context textarea, Tone select (Formal / Informal / Persuasive).
   - Server fn `generateEmail({ context, tone })` → returns draft + prompt used.
   - Output: editable textarea, Copy button.

2. **Task Planner (`/tasks`)**
   - Inputs: tasks/goals textarea, Plan type (Daily/Weekly), Priority style (Urgency/Importance).
   - Server fn `generatePlan(...)` → returns a markdown table of prioritized tasks with suggested time slots.
   - Output: editable textarea (preserving the table), Copy button. Rendered as markdown preview above the editable source, or just editable text — I'll go with editable textarea + a rendered preview toggle for readability.

3. **Research Assistant (`/research`)**
   - Inputs: topic/text textarea + file attach (`<input type="file">`, accepts `.txt`, `.md`, `.pdf`, images). PDFs are inlined as base64 `file` blocks; images as `image_url`; plain text is read client-side and appended to the prompt. All handled in one `researchSummarize` server fn using multimodal chat input (`openai/gpt-5.5` accepts image + file).
   - Prompt instructs the model to include a "Sources" section with links when it can cite them.
   - Output: editable summary textarea, Copy button.

## Global elements

- **"Prompt used" collapsible** on each tool page — shows the literal system + user prompt strings returned by the server fn. Demonstrates prompt engineering.
- **Editable outputs** — all AI outputs render into a controlled `<Textarea>` so the user can tweak before copying.
- **Copy-to-clipboard** via `navigator.clipboard.writeText` with a toast confirmation (`sonner`).
- **Responsible AI footer disclaimer** — sticky at the bottom of the main content area on every route, with a warning icon and amber tone (using semantic destructive/warning tokens).
- **Loading states**: skeleton or spinner while server fn runs; disabled Generate button.
- **Error handling**: toast for 429 (rate limit) / 402 (credits exhausted) / generic errors surfaced from the gateway.

## Backend / infra

- Enable **Lovable Cloud** is NOT needed (no DB, no auth). But I do need **Lovable AI Gateway** for `LOVABLE_API_KEY` — I'll provision it via the AI Gateway setup.
- Add AI SDK deps: `ai`, `@ai-sdk/openai-compatible`, `zod`.
- Provider helper `src/lib/ai-gateway.server.ts` posts to `https://ai.gateway.lovable.dev/v1` with `Lovable-API-Key` header.

## Technical details

- Router: existing TanStack Start setup preserved. Replace placeholder `src/routes/index.tsx` with dashboard content.
- Sidebar wired inside `__root.tsx` around `<Outlet />` via `SidebarProvider` + `AppSidebar` component (in `src/components/app-sidebar.tsx`).
- All colors via semantic tokens (`bg-background`, `bg-card`, `text-foreground`, `border-border`, `bg-primary`, custom `--warning` for the disclaimer).
- Responsive: sidebar `collapsible="offcanvas"` on mobile (auto via shadcn), `icon` on desktop.
- No hardcoded `text-white`/`bg-black`.
- Meta: each route sets its own `head()` with title + description + og:title/description.

## Deliverables (files)

- `src/styles.css` — dark palette, indigo accent, warning token.
- `src/routes/__root.tsx` — metadata, font link, dark class, SidebarProvider shell, disclaimer footer.
- `src/routes/index.tsx` — dashboard with 3 feature cards.
- `src/routes/email.tsx`, `src/routes/tasks.tsx`, `src/routes/research.tsx` — the tools.
- `src/components/app-sidebar.tsx` — nav.
- `src/components/tool-page.tsx` — shared layout for the 3 tools (header, prompt-used collapsible, disclaimer).
- `src/components/ai-disclaimer.tsx` — sticky warning footer.
- `src/lib/ai-gateway.server.ts` — provider helper.
- `src/lib/ai.functions.ts` — `generateEmail`, `generatePlan`, `researchSummarize` server functions.

I'll enable Lovable AI Gateway, install deps, then build the files in parallel batches.
