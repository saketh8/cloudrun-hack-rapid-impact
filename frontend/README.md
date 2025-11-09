# Frontend – Rapid Impact Partner Assistant UI

## Overview

This package delivers a simple web experience for nonprofit staff to:

1. Enter event highlights (date, volunteers, outcomes, stories).
2. Click “Generate” to call the backend `/generate` endpoint.
3. View copy for newsletters, social posts, and internal action items.
4. Copy/share/download the generated text.

## Planned Stack

- Next.js 14 with App Router (TypeScript)
- Tailwind CSS for fast styling
- Optional components: react-hook-form, SWR/fetch wrapper

## Setup (to be implemented)

```bash
cd frontend
npm install
npm run dev
```

Environment variables (`.env.local`) will define the backend base URL:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Structure (planned)

```
frontend/
  app/
    page.tsx
    layout.tsx
  components/
    InputForm.tsx
    OutputCard.tsx
  lib/
    api.ts
  styles/
    globals.css
```

## TODO

- [ ] Scaffold Next.js project with Tailwind.
- [ ] Build responsive form and output sections.
- [ ] Integrate with backend `/generate`.
- [ ] Polish UX (loading states, copy buttons, optional export).

