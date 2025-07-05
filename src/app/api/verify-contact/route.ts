import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.walletAddress) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { proof, merkle_root, nullifier_hash, signal } = await request.json();

    // In a production app, you would verify the proof here using Worldcoin's API
    // For now, we'll accept it as valid for testing
    console.log('Verifying proof for signal:', signal);
    console.log('Proof data:', { proof, merkle_root, nullifier_hash });

    // Simulate verification
    // In production, call: https://developer.worldcoin.org/api/v1/verify/{app_id}
    const isValid = true; // Simulated verification

    if (isValid) {
      return NextResponse.json({ verified: true });
    } else {
      return NextResponse.json({ error: 'Invalid proof' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying contact:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}