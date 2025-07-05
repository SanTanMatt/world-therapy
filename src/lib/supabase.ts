import { createClient } from '@supabase/supabase-js';

// Database types
export interface Message {
  id: string;
  from_address: string;
  to_address: string;
  content: string;
  created_at: string;
  read: boolean;
}

export interface Contact {
  id: string;
  user_address: string;
  contact_address: string;
  username: string;
  verified_human: boolean;
  created_at: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Using local storage fallback.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;