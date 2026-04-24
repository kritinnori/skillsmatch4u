# Quiz App Setup Guide

This guide will help you set up the quiz app with MongoDB and OpenAI integrations.

## Prerequisites

- Node.js and Bun installed
- A MongoDB instance (local, Docker, or MongoDB Atlas free tier)
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
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=quiz_app
OPENAI_API_KEY=your_openai_api_key
```

If you're using MongoDB Atlas, `MONGODB_URI` will look like:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
```

### 3. Set Up the MongoDB Database

MongoDB is schemaless, so no SQL migration is required. Run the setup script to
create the `questions` collection and a unique index on the numeric `id` field:

```bash
cd api
bun run setup-db
```

Then seed the questions:

```bash
bun run seed
```

This will insert all 30 questions into your `quiz_app.questions` collection.
The script automatically clears any existing questions before inserting the
new ones.

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
Fetches all questions from MongoDB.

**Response:**
```json
{
  "questions": [
    {
      "id": 1,
      "question": "I prefer working independently...",
      "category": "Personality"
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
- The AI analysis uses OpenAI's GPT model configured via `OPENAI_MODEL` (defaults to `gpt-5`)
- Make sure your OpenAI API key has sufficient credits
