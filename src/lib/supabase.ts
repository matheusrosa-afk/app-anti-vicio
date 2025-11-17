import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types para o banco de dados
export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  completed_days: number[];
  current_day: number;
  total_saved: number;
  updated_at: string;
}

export interface DiaryEntry {
  id: string;
  user_id: string;
  date: string;
  mood: string;
  entry: string;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  days_count: number;
  likes: number;
  claps: number;
  awards: number;
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  message: string;
  created_at: string;
}

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: 'like' | 'clap' | 'award';
  created_at: string;
}

export interface UserSelection {
  id: string;
  user_id: string;
  day: number;
  selection_type: string;
  selections: string[];
  created_at: string;
}
