# Quiz API

Node.js + Express backend for the quiz app.

## Prerequisites

- Node.js 18+
- MongoDB
- OpenAI API key

## Setup

```bash
npm install
cp .env.example .env   # if present; then edit .env
npm run setup-db
npm run seed
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with hot reload (tsx) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled API (`node dist/index.js`) |
| `npm run setup-db` | Create collection and indexes |
| `npm run seed` | Seed English questions |
| `npm run seed-translations` | Add translated question text |

## Environment

Set in `.env`:

```
MONGODB_URI=...
MONGODB_DB=quiz_app
OPENAI_API_KEY=...
PORT=3000
OPENAI_MODEL=gpt-4o
```

Default URL: `http://localhost:3000`
