import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { addContact, getContacts } from '@/lib/messageStore';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const session = await auth();
  if (!session?.user?.walletAddress) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Try Supabase first, fallback to local storage
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_address', session.user.walletAddress)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform to match local format
      const contacts = data?.map(c => ({
        address: c.contact_address,
        username: c.username,
        verifiedHuman: c.verified_human,
        addedAt: c.created_at
      })) || [];
      
      return NextResponse.json({ contacts });
    } catch (error) {
      console.error('Supabase error:', error);
      // Fallback to local storage
    }
  }

  // Local storage fallback
  const contacts = getContacts(session.user.walletAddress);
  return NextResponse.json({ contacts });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.walletAddress) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { address, username, verifiedHuman } = await request.json();

    if (!address || !username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Try Supabase first, fallback to local storage
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('contacts')
          .insert({
            user_address: session.user.walletAddress,
            contact_address: address,
            username: username,
            verified_human: verifiedHuman || false
          })
          .select()
          .single();

        if (error) throw error;
        
        const contact = {
          address: data.contact_address,
          username: data.username,
          verifiedHuman: data.verified_human,
          addedAt: data.created_at
        };
        
        return NextResponse.json({ contact });
      } catch (error) {
        console.error('Supabase error:', error);
        // Fallback to local storage
      }
    }

    // Local storage fallback
    const contact = {
      address,
      username,
      verifiedHuman: verifiedHuman || false,
      addedAt: new Date(),
    };

    addContact(session.user.walletAddress, contact);
    return NextResponse.json({ contact });
  } catch (error) {
    console.error('Error adding contact:', error);
    return NextResponse.json({ error: 'Failed to add contact' }, { status: 500 });
  }
}