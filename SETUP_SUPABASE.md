# Setting Up Supabase for eTherapy Messaging

## Quick Setup (5 minutes)

### 1. Create Supabase Account
Go to [supabase.com](https://supabase.com) and create a free account.

### 2. Create New Project
- Click "New Project"
- Choose a name (e.g., "etherapy-messages")
- Select region closest to you
- Create a strong database password (save it!)

### 3. Create Database Tables

Go to SQL Editor and run this script:

```sql
-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- Create contacts table
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  contact_address TEXT NOT NULL,
  username TEXT NOT NULL,
  verified_human BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_address, contact_address)
);

-- Create indexes for performance
CREATE INDEX idx_messages_addresses ON messages(from_address, to_address);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_contacts_user ON contacts(user_address);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies (optional - for better security)
-- Allow users to see their own messages
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (
    auth.jwt() ->> 'walletAddress' = from_address OR 
    auth.jwt() ->> 'walletAddress' = to_address
  );

-- Allow users to insert messages
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'walletAddress' = from_address
  );
```

### 4. Get Your API Keys

1. Go to Settings → API
2. Copy these values:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Public Key**: `eyJ...` (long string)

### 5. Update Your .env.local

```bash
NEXT_PUBLIC_SUPABASE_URL='https://your-project.supabase.co'
NEXT_PUBLIC_SUPABASE_ANON_KEY='your-anon-key-here'
```

### 6. Restart Your App

```bash
npm run dev
```

## That's It! 🎉

Your messages will now be stored in Supabase database:
- ✅ Messages persist across sessions
- ✅ Real-time updates (coming soon)
- ✅ Works across devices
- ✅ Free for up to 500MB storage
- ✅ No blockchain gas fees

## Optional: Enable Real-time

To get instant message updates:

1. Go to Database → Replication
2. Enable replication for `messages` table
3. The app will automatically use real-time subscriptions

## Troubleshooting

If messages aren't saving:
1. Check browser console for errors
2. Verify your Supabase URL and key are correct
3. Make sure tables were created successfully
4. Check Supabase dashboard logs

## Benefits Over Blockchain

- **Instant**: No waiting for blockchain confirmations
- **Free**: No gas fees ever
- **Private**: Messages aren't publicly visible
- **Editable**: Can update/delete messages
- **Scalable**: Handles millions of messages