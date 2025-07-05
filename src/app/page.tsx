import { Page } from '@/components/PageLayout';
import { AuthButton } from '../components/AuthButton';
import { TestButton } from '../components/TestButton';

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center gap-4">
        <AuthButton />
        <div className="mt-4 pt-4 border-t">
          <TestButton />
        </div>
      </Page.Main>
    </Page>
  );
}
