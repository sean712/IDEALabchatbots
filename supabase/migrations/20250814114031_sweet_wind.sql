/*
  # Fix RLS policies for conversations table
  
  1. Security Changes
    - Drop all existing policies on conversations table
    - Recreate policies to allow anonymous users full access
    - Ensure policies don't conflict with each other
  
  2. Policies Created
    - Allow anonymous users to insert conversations
    - Allow anonymous users to update conversations  
    - Allow anonymous users to select conversations
    - Allow service role full access for analytics
*/

-- Drop all existing policies on conversations table
DROP POLICY IF EXISTS "Allow service role read all conversations" ON conversations;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON conversations;
DROP POLICY IF EXISTS "Enable update for anonymous users" ON conversations;

-- Create new policies that allow anonymous access
CREATE POLICY "Allow anonymous insert conversations"
  ON conversations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update conversations"
  ON conversations
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select conversations"
  ON conversations
  FOR SELECT
  TO anon
  USING (true);

-- Keep service role access for analytics
CREATE POLICY "Allow service role full access"
  ON conversations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);