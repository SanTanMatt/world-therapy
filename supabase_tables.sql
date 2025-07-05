-- eTherapy Supabase Tables
-- Copy and paste this entire script into Supabase SQL Editor

-- 1. Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- 2. Create contacts table
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  contact_address TEXT NOT NULL,
  username TEXT NOT NULL,
  verified_human BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_address, contact_address)
);

-- 3. Create indexes for fast queries
CREATE INDEX idx_messages_addresses ON messages(from_address, to_address);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_contacts_user ON contacts(user_address);

-- 4. Enable Row Level Security (optional but recommended)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 5. Create open policies (for testing - you can make these more restrictive later)
CREATE POLICY "Enable all access for messages" ON messages
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for contacts" ON contacts
  FOR ALL USING (true) WITH CHECK (true);

-- Done! Your tables are ready for messaging