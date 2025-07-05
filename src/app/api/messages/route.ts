import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sendMessage, getMessages } from '@/lib/messageStore';

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

    const message = sendMessage(session.user.walletAddress, toAddress, content);
    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}