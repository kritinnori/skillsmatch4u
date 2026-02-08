# Quiz App Setup Guide

This guide will help you set up the quiz app with Supabase and OpenAI integrations.

## Prerequisites

- Node.js and Bun installed
- Supabase account (free tier works)
- OpenAI API key

## Backend Setup

### 1. Install Dependencies

```bash
cd api
bun install
```

### 2. Set Up Environment Variables

Create a `.env` file in the `api` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### 3. Set Up Supabase Database

**Important:** You must create the database table before running the seed script.

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (in the left sidebar)
3. Click **"New query"** or the **"+"** button
4. Copy and paste the SQL from `api/supabase-schema.sql` (or use the SQL below)
5. Click **"Run"** or press `Cmd/Ctrl + Enter`

```sql
-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists (to avoid errors on re-run)
DROP POLICY IF EXISTS "Allow public read access" ON questions;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON questions
  FOR SELECT USING (true);
```

6. After the table is created, seed the questions into the database:

```bash
cd api
bun run seed
```

This will insert all 30 questions into your Supabase database. The script will automatically delete any existing questions and insert the new ones.

### 4. Run the Backend Server

```bash
cd api
bun run dev
```

The API will be available at `http://localhost:3000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd app
yarn install
```

### 2. Set Up Environment Variables

Create a `.env` file in the `app` directory:

```
VITE_API_URL=http://localhost:3000
```

### 3. Run the Frontend

```bash
cd app
yarn dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns)

## API Endpoints

### GET `/questions`
Fetches all questions from Supabase.

**Response:**
```json
{
  "questions": [
    {
      "id": 1,
      "question": "I prefer working independently..."
    }
  ]
}
```

### POST `/analyze`
Analyzes user answers and returns AI-powered career recommendation.

**Request Body:**
```json
{
  "answers": [1, 2, 3, 4, 5],
  "questions": [
    { "id": 1, "question": "..." }
  ],
  "additionalInfo": "Optional additional information"
}
```

**Response:**
```json
{
  "recommendation": {
    "title": "Software Engineer",
    "description": "...",
    "matchScore": 92,
    "skills": ["Problem Solving", "..."],
    "salary": "$100,000 - $150,000",
    "growth": "22% growth expected"
  }
}
```

## Notes

- Questions use a 1-5 scale where:
  - 1 = Strongly Disagree
  - 2 = Disagree
  - 3 = Neutral
  - 4 = Agree
  - 5 = Strongly Agree

- After completing all questions, users can optionally add additional information
- The AI analysis uses OpenAI's GPT-4o-mini model for cost efficiency
- Make sure your OpenAI API key has sufficient credits
