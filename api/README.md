# SkillsMatch4U API

Node.js + Express backend for SkillsMatch4U.

## Prerequisites

- Node.js 18+
- AWS account (DynamoDB, Cognito)
- OpenAI API key

## Setup

```bash
npm install
cp .env.example .env   # then edit .env with your credentials
npm run seed           # seed questions to DynamoDB
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with hot reload (tsx) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled API (`node dist/index.js`) |
| `npm run seed` | Seed English questions to DynamoDB |

## Environment

Set in `.env`:

```
PORT=3000
AWS_REGION=us-east-1
DYNAMODB_QUESTIONS_TABLE=skillsmatch4u-questions
DYNAMODB_USER_PROGRESS_TABLE=skillsmatch4u-user-progress
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
```

## Deployment

Deployed as AWS Lambda via API Gateway at `https://api.skillsmatch4u.com`

Default local URL: `http://localhost:3000`
