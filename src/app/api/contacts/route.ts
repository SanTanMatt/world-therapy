import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { addContact, getContacts } from '@/lib/messageStore';

export async function GET() {
  const session = await auth();
  if (!session?.user?.walletAddress) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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