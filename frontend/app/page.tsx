'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const BASE_RPC_URL = "https://mainnet.base.org";

export default function Home() {
  const [account, setAccount] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string>('');

  // Stats data (örnek - backend'den gelecek)
  const stats = {
    relationships: 24,
    tipsReceived: 234.75,
    tipsGiven: 156.5,
    topSupporter: '@cryptowhale'
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError('');

      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask!');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      setAccount(accounts[0]);

      // Base network check
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const baseChainId = '0x2105'; // Base Mainnet
      
      if (chainId !== baseChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: baseChainId }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: baseChainId,
                chainName: 'Base',
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org']
              }]
            });
          }
        }
      }
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const mintNFT = async () => {
    try {
      setIsMinting(true);
      setError('');

      if (!account) {
        throw new Error('Please connect your wallet first');
      }

      // Mint logic here
      alert('NFT Minting initiated! 🎉');
      
    } catch (err: any) {
      console.error('Mint error:', err);
      setError(err.message || 'Failed to mint NFT');
    } finally {
      setIsMinting(false);
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || '');
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 text-white">
      {/* Header */}
      <header className="p-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center">
            ✕
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center">
            ⌄
          </button>
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold">RelationNFT</h1>
          <p className="text-sm text-gray-400">by seayd61</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center">
          ⋯
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-purple-600/40 to-pink-600/40 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-purple-500/30">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <span className="text-4xl">⭐</span>
                RelationNFT
              </h2>
              <p className="text-gray-200 text-lg">
                Immortalize Your Farcaster Connections
              </p>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full transition-colors">
              Connect Wallet
            </button>
          </div>

          {/* Stats Grid - FIXED LAYOUT */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Relationships */}
            <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/20">
              <div className="text-blue-400 text-2xl mb-2">👥</div>
              <div className="text-3xl font-bold mb-1">{stats.relationships}</div>
              <div className="text-sm text-gray-300">Relationships</div>
            </div>

            {/* Tips Received */}
            <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/20">
              <div className="text-green-400 text-2xl mb-2">🎁</div>
              <div className="text-2xl font-bold mb-1 break-words">
                ${stats.tipsReceived}
              </div>
              <div className="text-sm text-gray-300">Tips Received</div>
            </div>

            {/* Tips Given */}
            <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/20">
              <div className="text-pink-400 text-2xl mb-2">💝</div>
              <div className="text-2xl font-bold mb-1 break-words">
                ${stats.tipsGiven}
              </div>
              <div className="text-sm text-gray-300">Tips Given</div>
            </div>

            {/* Top Supporter */}
            <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/20">
              <div className="text-yellow-400 text-2xl mb-2">📈</div>
              <div className="text-lg font-bold mb-1 truncate">
                {stats.topSupporter}
              </div>
              <div className="text-sm text-gray-300">Top Supporter</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold px-8 py-3 rounded-2xl">
            Overview
          </button>
          <button className="bg-gray-800/30 text-gray-300 font-semibold px-8 py-3 rounded-2xl hover:bg-gray-800/50 transition-colors">
            Relationships
          </button>
          <button className="bg-gray-800/30 text-gray-300 font-semibold px-8 py-3 rounded-2xl hover:bg-gray-800/50 transition-colors">
            Milestones
          </button>
        </div>

        {/* Ready to Mint Section */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-yellow-400">⚡</span>
            Ready to Mint
          </h3>
        </div>

        {/* Mint Cards */}
        <div className="space-y-4">
          {/* Conversation Partners Card */}
          <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 backdrop-blur-xl rounded-3xl p-6 border border-orange-500/30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-2xl font-bold mb-2 text-yellow-300">
                  Conversation Partners
                </h4>
                <p className="text-gray-200 mb-2">with @degenbuilder</p>
                <p className="text-gray-300 text-sm mb-4">
                  50+ meaningful conversations
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Est. Value:</span>
                  <span className="text-2xl font-bold text-green-400">
                    $15-25
                  </span>
                </div>
              </div>
              <div className="bg-green-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                Ready!
              </div>
            </div>
            
            {/* FIXED BUTTON - İngilizce */}
            <button 
              onClick={mintNFT}
              disabled={isMinting || !account}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="text-xl">✨</span>
              {isMinting ? 'Minting...' : account ? 'Connect Wallet to Mint' : 'Connect Wallet to Mint'}
            </button>
          </div>

          {/* First Supporter Card */}
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-2xl font-bold mb-2 text-purple-300">
                  First Supporter
                </h4>
                <p className="text-gray-200 mb-4">with @nftcollector</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Est. Value:</span>
                  <span className="text-2xl font-bold text-green-400">
                    $10-15
                  </span>
                </div>
              </div>
              <div className="bg-green-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                Ready!
              </div>
            </div>
            
            {/* FIXED BUTTON - İngilizce */}
            <button 
              onClick={mintNFT}
              disabled={isMinting || !account}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="text-xl">✨</span>
              {isMinting ? 'Minting...' : 'Connect Wallet to Mint'}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-900/30 border border-red-500 rounded-2xl p-4">
            <p className="text-red-200 text-center">{error}</p>
          </div>
        )}
      </main>
    </div>
  );
}
