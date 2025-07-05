import { Page } from '@/components/PageLayout';
import { AuthButton } from '../components/AuthButton';

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-gray-700 mb-8">
              Sometimes we all just need to talk to a Human.
            </h1>
            <AuthButton />
          </div>
        </div>
      </Page.Main>
    </Page>
  );
}
