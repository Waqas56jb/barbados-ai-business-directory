# Barbados AI Business Directory

AI-powered tourism directory demo for Barbados with visitor, business-owner, and admin frontends.

## Applications

- [`user/`](./user) — public visitor frontend (directory + AI chatbot demo)
- [`business-owner/`](./business-owner) — business owner dashboard (listings, media, AI knowledge, ads)
- [`admin/`](./admin) — platform administration dashboard (moderation, AI, advertising, analytics)
- `server/` — future APIs, auth, RAG, and OpenAI integration

## Getting started

### Visitor site

```bash
cd user
npm install
npm run dev
```

Runs on [http://localhost:5173](http://localhost:5173).

### Business owner dashboard

```bash
cd business-owner
npm install
npm run dev
```

Runs on [http://localhost:5174](http://localhost:5174).

### Admin panel

```bash
cd admin
npm install
npm run dev
```

Runs on [http://localhost:5175](http://localhost:5175).

Demo login: use **Use demo administrator access** on `/login`.

See each folder’s README for demo walkthroughs and mock-vs-backend notes.
