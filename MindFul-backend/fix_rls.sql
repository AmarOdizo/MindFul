-- ==========================================================
-- MindFul: Fix Row-Level Security (RLS) Policy Error
-- Copy and run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ihjnxqewzcupshivqqnu/sql/new
-- ==========================================================

-- ----------------------------------------------------------
-- OPTION 1 (Recommended for Custom Node.js Backends):
-- Disable Row Level Security on all tables.
-- Your Express backend manages authentication via JWT.
-- ----------------------------------------------------------
ALTER TABLE IF EXISTS public.journal_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mood_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------
-- OPTION 2 (Alternative if you want RLS enabled):
-- Enable RLS and grant full access policies for anon, authenticated, and public roles.
-- ----------------------------------------------------------
/*
ALTER TABLE IF EXISTS public.journal_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on journal_entries" ON public.journal_entries;
CREATE POLICY "Allow all on journal_entries" ON public.journal_entries 
    FOR ALL TO anon, authenticated, public USING (true) WITH CHECK (true);

ALTER TABLE IF EXISTS public.mood_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on mood_logs" ON public.mood_logs;
CREATE POLICY "Allow all on mood_logs" ON public.mood_logs 
    FOR ALL TO anon, authenticated, public USING (true) WITH CHECK (true);

ALTER TABLE IF EXISTS public.chat_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on chat_messages" ON public.chat_messages;
CREATE POLICY "Allow all on chat_messages" ON public.chat_messages 
    FOR ALL TO anon, authenticated, public USING (true) WITH CHECK (true);

ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on users" ON public.users;
CREATE POLICY "Allow all on users" ON public.users 
    FOR ALL TO anon, authenticated, public USING (true) WITH CHECK (true);
*/
