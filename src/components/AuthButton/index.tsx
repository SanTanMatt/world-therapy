'use client';
import { walletAuth } from '@/auth/wallet';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit } from '@worldcoin/minikit-js';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { useCallback, useState } from 'react';

/**
 * This component is an example of how to authenticate a user
 * We will use Next Auth for this example, but you can use any auth provider
 * Read More: https://docs.world.org/mini-apps/commands/wallet-auth
 */
export const AuthButton = () => {
  const [isPending, setIsPending] = useState(false);
  const { isInstalled } = useMiniKit();

  const onClick = useCallback(async () => {
    console.log('AuthButton - isInstalled from hook:', isInstalled);
    console.log('AuthButton - MiniKit.isInstalled():', MiniKit.isInstalled());
    
    if (isPending) {
      return;
    }
    
    // Wait a bit for MiniKit to be ready if not installed
    if (!isInstalled && !MiniKit.isInstalled()) {
      console.log('MiniKit not ready, waiting...');
      setTimeout(() => {
        onClick();
      }, 1000);
      return;
    }
    setIsPending(true);
    try {
      await walletAuth();
    } catch (error: any) {
      console.error('Wallet authentication button error', error);
      console.error('Error details:', {
        message: error?.message,
        digest: error?.digest,
        stack: error?.stack
      });
      setIsPending(false);
      return;
    }

    setIsPending(false);
  }, [isInstalled, isPending]);

  // Remove auto-authentication to prevent loops
  // Users should explicitly click the button to authenticate

  return (
    <LiveFeedback
      label={{
        failed: 'Failed to login',
        pending: 'Logging in',
        success: 'Logged in',
      }}
      state={isPending ? 'pending' : undefined}
    >
      <Button
        onClick={onClick}
        disabled={isPending}
        size="lg"
        variant="primary"
      >
        Login with Wallet
      </Button>
    </LiveFeedback>
  );
};
