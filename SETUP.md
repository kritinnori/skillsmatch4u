# SkillsMatch4U Setup Guide

This guide will help you set up the SkillsMatch4U app with AWS (DynamoDB, Cognito) and OpenAI integrations.

## Prerequisites

- Node.js 18+ installed
- AWS account with DynamoDB and Cognito configured
- OpenAI API key

## Backend Setup

### 1. Install Dependencies

```bash
cd api
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the `api` directory:

```
PORT=3000
AWS_REGION=us-east-1
DYNAMODB_QUESTIONS_TABLE=skillsmatch4u-questions
DYNAMODB_USER_PROGRESS_TABLE=skillsmatch4u-user-progress
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
OPENAI_API_KEY=your_openai_api_key
```

### 3. Seed the DynamoDB Questions Table

```bash
npm run seed
```

This will insert all 30 questions into your DynamoDB questions table.

### 4. Run the Backend Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd app
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the `app` directory:

```
VITE_API_URL=http://localhost:3000
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Run the Frontend

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## AWS Infrastructure

### DynamoDB Tables

1. **Questions Table** (`skillsmatch4u-questions`)
   - Partition key: `id` (Number)
   - Stores quiz questions with translations

2. **User Progress Table** (`skillsmatch4u-user-progress`)
   - Partition key: `user_id` (String)
   - Stores user career results and progress

### Cognito User Pool

- Handles user authentication (sign up, sign in, password reset)
- Configure app client with appropriate OAuth flows

## API Endpoints

### GET `/questions`
Fetches all questions from DynamoDB.

**Response:**
```json
{
  "questions": [
    {
      "id": 1,
      "question": "I prefer working independently...",
      "category": "Personality"
    }
  ],
  "language": "en"
}
```

### POST `/analyze`
Analyzes user answers and returns AI-powered career recommendation.

**Request Body:**
```json
{
  "answers": [1, 2, 3, 4, 5, ...],
  "questions": [{ "id": 1, "question": "..." }],
  "additionalInfo": "Optional additional information",
  "language": "en"
}
```

**Response:**
```json
{
  "recommendation": {
    "title": "Data Analyst",
    "description": "...",
    "matchScore": 92,
    "skills": ["Problem Solving", "..."],
    "salary": "₹6 LPA - ₹12 LPA",
    "growth": "Strong demand in Indian tech sector"
  }
}
```

### POST `/courses`
Returns course recommendations for a career.

### POST `/jobs`
Returns job recommendations for a career.

### POST `/local-industries`
Returns thriving industries near a location.

### POST `/jobs-by-distance`
Returns jobs sorted by distance from user's location.

### POST `/account/delete`
Deletes user account from Cognito and DynamoDB (requires auth token).

## Notes

- Questions use a 1-5 scale (Strongly Disagree to Strongly Agree)
- Supports 13 Indian languages (Hindi, Tamil, Telugu, etc.)
- 3-tier caching: sessionStorage → DynamoDB → LLM fallback
- AI analysis uses OpenAI GPT model (configurable via `OPENAI_MODEL`)
