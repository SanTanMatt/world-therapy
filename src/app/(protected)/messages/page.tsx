import { Messages } from '@/components/Messages';
import { Navigation } from '@/components/Navigation';
import { Page } from '@/components/PageLayout';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user?.walletAddress) {
    redirect('/');
  }

  return (
    <>
      <Page.Main className="h-full">
        <Messages userAddress={session.user.walletAddress} username={session.user.username} />
      </Page.Main>
      <Page.Bottom>
        <Navigation />
      </Page.Bottom>
    </>
  );
}