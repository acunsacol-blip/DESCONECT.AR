import { createClient } from '@supabase/supabase-js';

// Helper to validate URL
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use env var only if it's a valid URL, otherwise fallback
const supabaseUrl = (envUrl && isValidUrl(envUrl)) ? envUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = envKey && envKey !== 'your-anon-key' ? envKey : 'placeholder';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper for server-side admin actions that might need to bypass RLS (if we used Service Role)
// But for now, we'll stick to the anon key and RLS policies or simple client usage.
// If RLS blocks writes and we don't have a supabase user, we MUST use the Service Role Key for admin actions.
// Let's add an admin client export if the key exists.

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;
