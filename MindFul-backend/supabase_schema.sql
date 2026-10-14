-- ==========================================================
-- MindFul PostgreSQL Schema for Supabase
-- Copy and run this in your Supabase SQL Editor
-- ==========================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Mood Check-ins Table
CREATE TABLE IF NOT EXISTS public.mood_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    mood_id TEXT NOT NULL,
    mood_label TEXT NOT NULL,
    intensity INTEGER NOT NULL CHECK (intensity >= 1 AND intensity <= 10),
    tags JSONB DEFAULT '[]'::jsonb,
    reflection TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Journal Entries Table
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT NOT NULL,
    prompt_id TEXT,
    mood_tag TEXT,
    category TEXT DEFAULT 'Reflective',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Maya AI Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'maya')),
    text TEXT NOT NULL,
    action_title TEXT,
    action_sub TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- Performance Indexes
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_mood_logs_user_id ON public.mood_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_logs_created_at ON public.mood_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_category ON public.journal_entries(category);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON public.journal_entries(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at ASC);

-- ==========================================================
-- Row Level Security (RLS) Configuration
-- For custom Node/Express backends using bcrypt & JWT:
-- Option 1 (Recommended & simplest for custom backend): Disable RLS
-- ==========================================================
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages DISABLE ROW LEVEL SECURITY;

-- Option 2 (If you prefer keeping RLS enabled in Supabase, uncomment below):
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
--
-- DROP POLICY IF EXISTS "Allow all on users" ON public.users;
-- CREATE POLICY "Allow all on users" ON public.users FOR ALL TO public, anon, authenticated USING (true) WITH CHECK (true);
--
-- DROP POLICY IF EXISTS "Allow all on mood_logs" ON public.mood_logs;
-- CREATE POLICY "Allow all on mood_logs" ON public.mood_logs FOR ALL TO public, anon, authenticated USING (true) WITH CHECK (true);
--
-- DROP POLICY IF EXISTS "Allow all on journal_entries" ON public.journal_entries;
-- CREATE POLICY "Allow all on journal_entries" ON public.journal_entries FOR ALL TO public, anon, authenticated USING (true) WITH CHECK (true);
--
-- DROP POLICY IF EXISTS "Allow all on chat_messages" ON public.chat_messages;
-- CREATE POLICY "Allow all on chat_messages" ON public.chat_messages FOR ALL TO public, anon, authenticated USING (true) WITH CHECK (true);
