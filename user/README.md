# Barbados Explorer — User Frontend

Premium public visitor website for the Barbados tourism directory and AI marketplace demo.

This folder contains **only** the `user/` frontend. It is architecturally ready for a future `server/` API, but currently runs entirely on local mock data.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- React Router
- TanStack Query
- React Hook Form + Zod
- Zustand
- Lucide React
- Vitest

## Quick start

```bash
cd user
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run Oxlint |
| `npm run test` | Run unit tests |
| `npm run typecheck` | TypeScript project build check |

## Environment

Copy `.env.example` to `.env` if you want to override defaults:

- `VITE_SITE_URL` — public site origin for canonical helpers
- `VITE_API_BASE_URL` — reserved for future backend integration (unused by default)
- `VITE_USE_MOCK_DATA` — keep `true` for this demo
- `VITE_DEMO_MODE` — show the demo listing update control

Never put OpenAI keys or other secrets in `VITE_*` variables.

## What is mocked

These features use local fictional data and frontend adapters:

- Business directory listings, search, filters, sorting, pagination
- Business detail pages and related listings
- Favorites and recently viewed (browser `localStorage`)
- Newsletter and contact form success states (validated locally only)
- Barbados AI Guide chatbot answers (deterministic retrieval over mock listings)
- Demo listing updates (shared Zustand store + `localStorage` overrides)

## What still needs the future backend

The separate `server/` application will eventually provide:

- Persistent database of real listings
- Authentication and roles
- Business-owner and admin workflows
- Real RAG retrieval, embeddings, and OpenAI calls
- Email delivery, advertising, payments, and verification

Service entry points already exist in:

- `src/services/businessService.ts`
- `src/services/chatService.ts`

## Demo walkthrough

1. Search from the homepage for `snorkeling` or `airport transfers`.
2. Open **Blue Horizon Snorkeling** or **Coral Breeze Catamaran Tours**.
3. Use **Ask AI about this business**.
4. Open the bottom-left **Demo tools** control.
5. Update Coral Breeze’s location, then ask the chatbot again where it is located.
6. Ask for a missing phone number on a listing that has none and confirm the fallback response.

All sample businesses are fictional and marked as demo records.

## SEO note

This is a client-rendered SPA. Production indexing may later need prerendering or SSR when the broader platform is productionized.

## Project structure

See `src/app`, `src/pages`, `src/components`, `src/data`, `src/services`, `src/lib`, and `src/store` for the main application layers.
