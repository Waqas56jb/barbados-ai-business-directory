# Barbados Explorer Admin

Premium administration frontend for the Barbados Explorer tourism marketplace demo.

This application lives in `admin/` only. It uses local mock data and typed service abstractions until `server/` provides real APIs.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- React Router
- TanStack Query
- React Hook Form + Zod
- Zustand
- Lucide React
- Recharts
- Vitest

## Quick start

```bash
cd admin
npm install
npm run dev
```

Open [http://localhost:5175](http://localhost:5175).

## Demo login

1. Open `/login`
2. Use **Use demo administrator access**, or submit the prefilled form:
   - Email: `admin@barbadosexplorer.demo`
   - Password: any value with at least 6 characters (frontend validation only)

Authentication is frontend-only. No real session or password storage is implemented.

## Demo role switching

Use the profile menu in the top header. The role selector is labeled as a development/demo feature and changes visible navigation and actions through frontend permission checks only.

Available demo roles:

- Super Admin
- Listing Moderator
- Advertising Manager
- AI Manager
- Support Agent
- Analytics Viewer

## Scripts

```bash
npm run dev          # development server on port 5175
npm run build        # typecheck + production build
npm run preview      # preview production build
npm run typecheck    # TypeScript project build check
npm run lint         # oxlint
npm run test         # vitest
npm run test:watch   # vitest watch mode
```

## What is mocked

- Business owners, listings, approvals, categories, locations
- Reviews, reports, notifications, audit logs
- AI chatbot settings, knowledge records, conversations, evaluation suite
- Advertising campaigns and placements
- Analytics charts and CSV exports
- Administrator accounts and role matrix

Demo changes persist in `localStorage` for convenience. Use **Reset local demo data** in Settings to restore the seed state.

## Important boundaries

- No OpenAI API keys in the frontend
- No real authentication or authorization
- No production RAG indexing or embeddings
- No payment processing or live ad delivery
- Frontend permissions are not a security boundary

Future integration points are defined in `src/services/` and `src/config/site.ts` (`VITE_API_BASE_URL`).

## Environment

Copy `.env.example` to `.env` if you need local overrides:

```bash
cp .env.example .env
```

## Production build

```bash
npm run build
npm run preview
```
