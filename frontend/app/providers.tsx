'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { useState } from 'react';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: 'RelationNFT',
  projectId: '6b394142385b183ac8ff7a49a4643ccd',
  chains: [base],
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  // useState ensures the QueryClient persists across renders
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
