-- 1. Add missing columns to the 'messages' table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS is_loved BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN DEFAULT FALSE;

-- 2. Ensure RLS is enabled for messages and replies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

-- 3. Set up RLS Policies for messages
-- Drop existing policies if they exist to avoid errors
DROP POLICY IF EXISTS "Allow public select" ON messages;
DROP POLICY IF EXISTS "Allow public insert" ON messages;
DROP POLICY IF EXISTS "Allow public update" ON messages;
DROP POLICY IF EXISTS "Allow public delete" ON messages;

-- Allow everyone to view and insert messages
CREATE POLICY "Allow public select" ON messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON messages FOR INSERT WITH CHECK (true);
-- Allow public update and delete for the admin dashboard
CREATE POLICY "Allow public update" ON messages FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON messages FOR DELETE USING (true);

-- 4. Set up RLS Policies for replies
-- Drop existing policies if they exist to avoid errors
DROP POLICY IF EXISTS "Allow public select" ON replies;
DROP POLICY IF EXISTS "Allow public insert" ON replies;
DROP POLICY IF EXISTS "Allow public delete" ON replies;

-- Allow everyone to view and insert replies
CREATE POLICY "Allow public select" ON replies FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON replies FOR INSERT WITH CHECK (true);
-- Allow public delete for the admin dashboard
CREATE POLICY "Allow public delete" ON replies FOR DELETE USING (true);

-- 5. Enable Realtime for 'messages' and 'replies'
-- This is necessary for the dashboard to reflect changes instantly across sessions.
BEGIN;
  -- Remove tables from the publication if they already exist to avoid errors
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS messages;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS replies;
  -- Add tables to the publication
  ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  ALTER PUBLICATION supabase_realtime ADD TABLE replies;
COMMIT;

-- 6. Fix Timezone Desync (Use timestamptz for automatic timezone handling)
ALTER TABLE messages 
ALTER COLUMN created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC',
ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE replies 
ALTER COLUMN created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC',
ALTER COLUMN created_at SET DEFAULT now();
