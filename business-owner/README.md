# Barbados Explorer Business — Owner Dashboard

Premium business-owner dashboard frontend for managing Barbados tourism listings, media, AI knowledge profiles, promotions, analytics, reviews, and inquiries.

This folder is independent from `user/`, `admin/`, and `server/`.

## Quick start

```bash
cd business-owner
npm install
npm run dev
```

Default local URL: `http://localhost:5174`

## Demo access

1. Open `/login`
2. Click **Continue with demo account**, or sign in with:
   - Email: `sarah@coralbreeze.demo`
   - Password: any value with 6+ characters (frontend validation only)

The demo loads three fictional businesses:

- Coral Breeze Catamaran Tours
- Ocean Pearl Beach Lounge
- Island Link Transfers

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server on port 5174 |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run test` | Unit tests |
| `npm run lint` | Oxlint |
| `npm run typecheck` | TypeScript project check |

## What is mocked

- Authentication / sessions / password reset
- Business, listing, media, service, FAQ, promotion, inquiry, review, notification data
- Analytics charts and CSV export
- AI knowledge chatbot preview (deterministic local grounding)
- Support form submissions
- Image “uploads” via browser object URLs

Local demo state persists in `localStorage` and can be reset from **Settings → Preferences**.

## Future backend requirements

The separate `server/` app will eventually provide:

- Real authentication and authorization
- Persistent database records and moderation workflows
- Image hosting
- Advertising approvals and payments
- True analytics ingestion
- Email delivery for inquiries/support
- RAG indexing / embeddings / OpenAI calls for the public chatbot

Service adapters live under `src/services/` and can later call `VITE_API_BASE_URL`.

## Suggested demo walkthrough

1. Sign in with demo access
2. Review dashboard KPIs and setup checklist
3. Edit Coral Breeze contact/services and save draft
4. Open AI Knowledge Profile and ask about location/phone/services
5. Add an FAQ and confirm the preview updates
6. Create a promotion request
7. Change an inquiry status in Messages
8. Reset demo data from Settings when finished
