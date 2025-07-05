'use client';

import { TabItem, Tabs } from '@worldcoin/mini-apps-ui-kit-react';
import { Bank, Home, User, Message } from 'iconoir-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * This component uses the UI Kit to navigate between pages
 * Bottom navigation is the most common navigation pattern in Mini Apps
 * We require mobile first design patterns for mini apps
 * Read More: https://docs.world.org/mini-apps/design/app-guidelines#mobile-first
 */

export const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState('home');

  useEffect(() => {
    // Update selected tab based on current path
    if (pathname === '/home') setValue('home');
    else if (pathname === '/messages') setValue('messages');
    else if (pathname === '/wallet') setValue('wallet');
    else if (pathname === '/profile') setValue('profile');
  }, [pathname]);

  const handleTabChange = (newValue: string) => {
    setValue(newValue);
    // Navigate to the corresponding page
    switch (newValue) {
      case 'home':
        router.push('/home');
        break;
      case 'messages':
        router.push('/messages');
        break;
      case 'wallet':
        router.push('/wallet');
        break;
      case 'profile':
        router.push('/profile');
        break;
    }
  };

  return (
    <Tabs value={value} onValueChange={handleTabChange}>
      <TabItem value="home" icon={<Home />} label="Home" />
      <TabItem value="messages" icon={<Message />} label="Messages" />
      <TabItem value="wallet" icon={<Bank />} label="Wallet" />
      <TabItem value="profile" icon={<User />} label="Profile" />
    </Tabs>
  );
};
