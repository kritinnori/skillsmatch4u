import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const createTableSQL = `
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
`;

async function setupDatabase() {
  console.log("Setting up Supabase database...");
  console.log("This will create the 'questions' table and set up Row Level Security.\n");

  try {
    // Execute SQL using Supabase REST API
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: createTableSQL 
    });

    // The RPC approach might not work, so let's use a different approach
    // We'll use the REST API directly
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ sql: createTableSQL })
    });

    if (!response.ok) {
      // If RPC doesn't work, we'll provide manual instructions
      console.log("⚠️  Automatic table creation is not available via the client.");
      console.log("Please run the following SQL in your Supabase SQL Editor:\n");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(createTableSQL);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
      console.log("Steps:");
      console.log("1. Go to your Supabase project dashboard");
      console.log("2. Navigate to SQL Editor (left sidebar)");
      console.log("3. Click 'New query'");
      console.log("4. Paste the SQL above");
      console.log("5. Click 'Run' or press Cmd/Ctrl + Enter");
      console.log("6. Then run: bun run seed\n");
      process.exit(0);
    }

    console.log("✅ Database setup complete!");
    console.log("You can now run: bun run seed\n");
  } catch (error) {
    console.log("⚠️  Could not automatically create the table.");
    console.log("Please run the following SQL in your Supabase SQL Editor:\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(createTableSQL);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("Steps:");
    console.log("1. Go to your Supabase project dashboard");
    console.log("2. Navigate to SQL Editor (left sidebar)");
    console.log("3. Click 'New query'");
    console.log("4. Paste the SQL above");
    console.log("5. Click 'Run' or press Cmd/Ctrl + Enter");
    console.log("6. Then run: bun run seed\n");
    process.exit(0);
  }
}

setupDatabase();
