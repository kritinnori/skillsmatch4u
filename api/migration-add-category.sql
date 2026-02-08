-- Migration: Add category column to questions table
-- Run this if you already have a questions table without the category field

-- Add category column (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' AND column_name = 'category'
  ) THEN
    ALTER TABLE questions ADD COLUMN category TEXT;
    
    -- Set default category for existing rows (optional - you may want to update these manually)
    UPDATE questions SET category = 'General' WHERE category IS NULL;
    
    -- Make category NOT NULL after setting defaults
    ALTER TABLE questions ALTER COLUMN category SET NOT NULL;
  END IF;
END $$;
