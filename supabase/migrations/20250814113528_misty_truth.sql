/*
  # Restructure conversations table for full conversation storage

  1. Changes to existing table
    - Drop the current conversations table that stores individual messages
    - Create new conversations table optimized for storing complete conversations

  2. New Table Schema
    - `conversations` table:
      - `id` (uuid, primary key)
      - `thread_id` (text, unique) - OpenAI thread identifier
      - `messages` (jsonb) - Complete array of conversation messages
      - `message_count` (integer) - Number of messages in conversation
      - `created_at` (timestamp) - When conversation started
      - `updated_at` (timestamp) - When conversation was last updated

  3. Security
    - Enable RLS on conversations table
    - Allow anonymous users to insert and update their conversations
    - Add policy for service role to read all data for analytics
*/

-- Drop existing table and recreate with new structure
DROP TABLE IF EXISTS public.conversations;

-- Create new conversations table for storing complete conversations
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id text UNIQUE NOT NULL,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  message_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_conversations_thread_id ON public.conversations(thread_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON public.conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations(updated_at);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert and update conversations
CREATE POLICY "Allow anonymous insert conversations"
  ON public.conversations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update conversations"
  ON public.conversations
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow service role to read all data for analytics
CREATE POLICY "Allow service role read all conversations"
  ON public.conversations
  FOR SELECT
  TO service_role
  USING (true);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.message_count = jsonb_array_length(NEW.messages);
  RETURN NEW;
END;
$$ language plpgsql;

-- Trigger to call the function
CREATE TRIGGER update_conversations_updated_at_trigger
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_conversations_updated_at();