'use client';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';

export const TestButton = () => {
  const { isInstalled } = useMiniKit();

  const testApi = async () => {
    console.log('Testing API...');
    try {
      const response = await fetch('/api/nonce');
      const text = await response.text();
      console.log('Response status:', response.status);
      console.log('Response text:', text);
      
      if (response.ok) {
        const data = JSON.parse(text);
        console.log('Parsed data:', data);
      }
    } catch (error) {
      console.error('Test API error:', error);
    }
  };

  const testMiniKit = () => {
    console.log('MiniKit installed:', isInstalled);
    console.log('Window location:', window.location.origin);
  };

  return (
    <div className="grid gap-2">
      <Button onClick={testMiniKit} size="sm" variant="secondary">
        Test MiniKit Status
      </Button>
      <Button onClick={testApi} size="sm" variant="secondary">
        Test API Endpoint
      </Button>
    </div>
  );
};