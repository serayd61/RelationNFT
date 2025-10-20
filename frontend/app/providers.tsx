'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { useState } from 'react';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
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
  // QueryClient'i useState ile oluştur - her render'da yeni instance oluşturulmasını engeller
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#a855f7',
            borderRadius: 'large',
          })}
          locale="en"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
