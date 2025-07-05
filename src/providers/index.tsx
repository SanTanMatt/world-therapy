'use client';
import { MiniKit } from '@worldcoin/minikit-js';
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

const ErudaProvider = dynamic(
  () => import('@/providers/Eruda').then((c) => c.ErudaProvider),
  { ssr: false },
);

// Define props for ClientProviders
interface ClientProvidersProps {
  children: ReactNode;
  session: Session | null; // Use the appropriate type for session from next-auth
}

/**
 * ClientProvider wraps the app with essential context providers.
 *
 * - ErudaProvider:
 *     - Should be used only in development.
 *     - Enables an in-browser console for logging and debugging.
 *
 * - MiniKitProvider:
 *     - Required for MiniKit functionality.
 *
 * This component ensures both providers are available to all child components.
 */
export default function ClientProviders({
  children,
  session,
}: ClientProvidersProps) {
  useEffect(() => {
    // Install MiniKit with the app ID
    const appId = process.env.NEXT_PUBLIC_APP_ID;
    console.log('Installing MiniKit with app ID:', appId);
    if (appId) {
      MiniKit.install(appId);
      console.log('MiniKit.install() called');
      // Check if MiniKit is installed after a short delay
      setTimeout(() => {
        console.log('MiniKit installed check:', MiniKit.isInstalled());
      }, 1000);
    } else {
      console.error('NEXT_PUBLIC_APP_ID is not defined');
    }
  }, []);

  return (
    <ErudaProvider>
      <MiniKitProvider>
        <SessionProvider session={session}>{children}</SessionProvider>
      </MiniKitProvider>
    </ErudaProvider>
  );
}
