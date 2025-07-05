import { MiniKit } from '@worldcoin/minikit-js';
import { signIn } from 'next-auth/react';

/**
 * Authenticates a user via their wallet using a nonce-based challenge-response mechanism.
 *
 * This function generates a unique `nonce` and requests the user to sign it with their wallet,
 * producing a `signedNonce`. The `signedNonce` ensures the response we receive from wallet auth
 * is authentic and matches our session creation.
 *
 * @returns {Promise<SignInResponse>} The result of the sign-in attempt.
 * @throws {Error} If wallet authentication fails at any step.
 */
export const walletAuth = async () => {
  console.log('Starting wallet auth...');
  console.log('Window location:', window.location.origin);
  console.log('MiniKit available:', typeof MiniKit !== 'undefined');
  console.log('MiniKit installed:', MiniKit.isInstalled());
  
  if (!MiniKit.isInstalled()) {
    throw new Error('MiniKit is not installed. Please ensure you are accessing the app through World App.');
  }
  
  let nonce, signedNonce;
  try {
    const response = await fetch('/api/nonce');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get nonce');
    }
    
    nonce = data.nonce;
    signedNonce = data.signedNonce;
    console.log('Got nonces:', { nonce, signedNonce });
  } catch (error) {
    console.error('Failed to get nonces:', error);
    throw error;
  }

  console.log('Calling MiniKit.commandsAsync.walletAuth...');
  const result = await MiniKit.commandsAsync.walletAuth({
    nonce,
    expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000),
    statement: `Authenticate (${self.crypto.randomUUID().replace(/-/g, '')}).`,
  });
  console.log('Result', result);
  if (!result) {
    throw new Error('No response from wallet auth');
  }

  if (result.finalPayload.status !== 'success') {
    console.error(
      'Wallet authentication failed',
      result.finalPayload.error_code,
    );
    return;
  } else {
    console.log(result.finalPayload);
  }

  await signIn('credentials', {
    redirectTo: '/home',
    nonce,
    signedNonce,
    finalPayloadJson: JSON.stringify(result.finalPayload),
  });
};
