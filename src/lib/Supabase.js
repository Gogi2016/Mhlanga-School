import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Check your .env file.'
  );
}

// --------------------------------------------------
// Main client — used by the Admin login/dashboard.
// Persists the admin's auth session in the browser
// so they stay logged in across page reloads.
// --------------------------------------------------
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// --------------------------------------------------
// Public client — used ONLY by the applicant-facing
// Admissions form. Deliberately does NOT persist or
// read any auth session, so it always talks to
// Supabase as the plain `anon` role — even if an
// admin is logged in elsewhere in the same browser.
// --------------------------------------------------
export const supabasePublic = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: 'mss-public-noop',
    },
  }
);