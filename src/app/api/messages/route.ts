import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sendMessage, getMessages } from '@/lib/messageStore';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.walletAddress) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const contactAddress = searchParams.get('contact');

  if (!contactAddress) {
    return NextResponse.json({ error: 'Contact address required' }, { status: 400 });
  }

  // Try Supabase first, fallback to local storage
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(from_address.eq.${session.user.walletAddress},to_address.eq.${contactAddress}),and(from_address.eq.${contactAddress},to_address.eq.${session.user.walletAddress})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      return NextResponse.json({ messages: data || [] });
    } catch (error) {
      console.error('Supabase error:', error);
      // Fallback to local storage
    }
  }

  // Local storage fallback
  const messages = getMessages(session.user.walletAddress, contactAddress);
  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.walletAddress) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { toAddress, content } = await request.json();

    if (!toAddress || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Try Supabase first, fallback to local storage
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .insert({
            from_address: session.user.walletAddress,
            to_address: toAddress,
            content: content,
            read: false
          })
          .select()
          .single();

        if (error) throw error;
        
        return NextResponse.json({ message: data });
      } catch (error) {
        console.error('Supabase error:', error);
        // Fallback to local storage
      }
    }

    // Local storage fallback
    const message = sendMessage(session.user.walletAddress, toAddress, content);
    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}