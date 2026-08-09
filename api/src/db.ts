import "dotenv/config";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

// --- DynamoDB client setup ---

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

// --- Table names ---

const QUESTIONS_TABLE =
  process.env.DYNAMODB_QUESTIONS_TABLE || "skillsmatch4u-questions";
const USER_PROGRESS_TABLE =
  process.env.DYNAMODB_USER_PROGRESS_TABLE || "skillsmatch4u-user-progress";

// --- Types ---

export interface QuestionDoc {
  id: number;
  question: string;
  category: string;
  translations?: Record<string, string>;
}

export interface UserProgressDoc {
  user_id: string;
  email?: string;
  career_title?: string | null;
  career_match_score?: number | null;
  career_salary?: string | null;
  career_growth?: string | null;
  career_description?: string | null;
  career_skills?: string[];
  courses_clicked?: Array<{
    title: string;
    provider?: string;
    url: string;
    clickedAt: string;
  }>;
  jobs_clicked?: Array<{
    title: string;
    company?: string;
    url: string;
    clickedAt: string;
  }>;
  courses_completed?: Array<{
    title: string;
    provider?: string;
    url: string;
    clickedAt: string;
  }>;
  recommended_courses?: Array<{
    title: string;
    provider: string;
    reason: string;
    url?: string;
  }>;
  recommended_jobs?: Array<{
    title: string;
    company: string;
    location: string;
    reason: string;
    url?: string;
  }>;
  quiz_completed_at?: string | null;
  updated_at?: string | null;
}

// --- Questions ---

export async function getAllQuestions(): Promise<QuestionDoc[]> {
  const result = await docClient.send(
    new ScanCommand({ TableName: QUESTIONS_TABLE })
  );
  const items = (result.Items || []) as QuestionDoc[];
  return items.sort((a, b) => a.id - b.id);
}

// --- User Progress ---

export async function getUserProgress(
  userId: string
): Promise<UserProgressDoc | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: USER_PROGRESS_TABLE,
      Key: { user_id: userId },
    })
  );
  return (result.Item as UserProgressDoc) || null;
}

export async function putUserProgress(
  doc: UserProgressDoc
): Promise<void> {
  await docClient.send(
    new PutCommand({
      TableName: USER_PROGRESS_TABLE,
      Item: { ...doc, updated_at: new Date().toISOString() },
    })
  );
}

export async function updateUserProgress(
  userId: string,
  fields: Partial<Omit<UserProgressDoc, "user_id">>
): Promise<void> {
  // Build update expression dynamically from provided fields
  const expressionParts: string[] = [];
  const expressionNames: Record<string, string> = {};
  const expressionValues: Record<string, unknown> = {};

  // Always set updated_at
  fields.updated_at = new Date().toISOString();

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;
    const attrAlias = `#${key}`;
    const valAlias = `:${key}`;
    expressionParts.push(`${attrAlias} = ${valAlias}`);
    expressionNames[attrAlias] = key;
    expressionValues[valAlias] = value;
  }

  if (expressionParts.length === 0) return;

  await docClient.send(
    new UpdateCommand({
      TableName: USER_PROGRESS_TABLE,
      Key: { user_id: userId },
      UpdateExpression: `SET ${expressionParts.join(", ")}`,
      ExpressionAttributeNames: expressionNames,
      ExpressionAttributeValues: expressionValues,
    })
  );
}

export async function deleteUserProgress(userId: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: USER_PROGRESS_TABLE,
      Key: { user_id: userId },
    })
  );
}
