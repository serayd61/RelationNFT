'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export function useMiniApp() {
  const [isReady, setIsReady] = useState(false);
  const [context, setContext] = useState<any>(null);

  useEffect(() => {
    const initMiniApp = async () => {
      try {
        const ctx = await sdk.context;
        setContext(ctx);
        await sdk.actions.ready();
        setIsReady(true);
      } catch (error) {
        console.error('MiniApp init error:', error);
        setIsReady(true);
      }
    };

    initMiniApp();
  }, []);

  return { isReady, context, sdk };
}
