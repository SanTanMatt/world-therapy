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
    <Page>
      <Page.Main className="h-full p-0">
        <Messages userAddress={session.user.walletAddress} username={session.user.username} />
      </Page.Main>
      <Page.Footer>
        <Navigation />
      </Page.Footer>
    </Page>
  );
}