import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  try {
    const nonce = crypto.randomUUID().replace(/-/g, '');
    const hmac = crypto.createHmac('sha256', process.env.HMAC_SECRET_KEY!);
    hmac.update(nonce);
    const signedNonce = hmac.digest('hex');
    
    return NextResponse.json({ nonce, signedNonce });
  } catch (error) {
    console.error('Error generating nonce:', error);
    return NextResponse.json({ error: 'Failed to generate nonce' }, { status: 500 });
  }
}