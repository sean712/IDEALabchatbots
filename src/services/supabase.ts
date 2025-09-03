import { createClient } from '@supabase/supabase-js';
import { Message } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// Type definitions for our database
export interface ConversationRecord {
  id: string;
  thread_id: string;
  bot_id: string;
  bot_name: string;
  messages: Message[]; // Array of Message objects
  message_count: number;
  created_at: string;
  updated_at: string;
}