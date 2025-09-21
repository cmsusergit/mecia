// @ts-nocheck
//

import { writable } from 'svelte/store';
import { createClient } from '@supabase/supabase-js';
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl1='https://ccfhpzusawtgiojavhxh.supabase.co/'
const supabaseCred1='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZmhwenVzYXd0Z2lvamF2aHhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ3NTk4MDAsImV4cCI6MjAxMDMzNTgwMH0.Hb06Rl186b_4wEmcmIyIqTVUqfJn0rGHszpDlr6jaZQ'
// const supabaseUrl='https://rrgqyaftcsbiaqoexana.supabase.co/'
// const supabaseCred='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyZ3F5YWZ0Y3NiaWFxb2V4YW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2Mzc4NzQsImV4cCI6MjA2NTIxMzg3NH0.WQK3TACNQhkJ_XE_E8mpH60WbcSHMt4Zh36bQNOzesg'


export const supabase = createClient(supabaseUrl1, supabaseCred1);
function createAuthStore() {
  const { subscribe, set } = writable(null);

  supabase.auth.onAuthStateChange((event, session) => {
    set(session?.user || null);
  });
  return {
    subscribe,
    login: async (email, password) => {
      const { user, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) console.error('Error signing in:', error);
      return user;
    },
    logout: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Error signing out:', error);
    }
  };










}
export const authStore = createAuthStore();
