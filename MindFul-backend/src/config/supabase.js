const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('\n⚠️ WARNING: SUPABASE_URL or SUPABASE_KEY missing in .env!');
  console.warn('👉 Please add your Supabase credentials to MindFul-backend/.env\n');
}

// Create Supabase client
const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

// Helper function to verify Supabase connection
const testConnection = async () => {
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    return { connected: false, message: 'Supabase credentials not configured yet in .env' };
  }
  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, it's still connected to Supabase
      if (error.message && error.message.includes('relation "public.users" does not exist')) {
        return { connected: true, tablesReady: false, message: 'Connected to Supabase, but schema tables need to be created via supabase_schema.sql' };
      }
      return { connected: false, message: error.message };
    }
    return { connected: true, tablesReady: true, message: 'Connected to Supabase successfully' };
  } catch (err) {
    return { connected: false, message: err.message };
  }
};

module.exports = { supabase, testConnection };
