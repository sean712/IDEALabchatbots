/*
  # Fix RLS policies for conversation storage

  1. Security Updates
    - Drop existing restrictive policies
    - Create new policies allowing anonymous users to insert and update conversations
    - Maintain RLS enabled for security while allowing necessary operations

  The policies allow anonymous users to:
  - Insert new conversations (needed for storing chat data)
  - Update existing conversations (needed for adding new messages)
*/

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Allow anonymous insert conversations" ON conversations;
DROP POLICY IF EXISTS "Allow anonymous update conversations" ON conversations;

-- Create new permissive policies for anonymous users
CREATE POLICY "Enable insert for anonymous users"
  ON conversations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Enable update for anonymous users"
  ON conversations
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Keep the service role policy for admin access
-- (This should already exist but recreate if needed)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'conversations' 
    AND policyname = 'Allow service role read all conversations'
  ) THEN
    CREATE POLICY "Allow service role read all conversations"
      ON conversations
      FOR SELECT
      TO service_role
      USING (true);
  END IF;
END $$;