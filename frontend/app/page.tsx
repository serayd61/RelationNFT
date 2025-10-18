import React, { useState, useEffect } from 'react';
import { Sparkles, Users, Gift, TrendingUp, Award, Heart, Zap } from 'lucide-react';

export default function RelationNFTApp() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState({
    totalRelationships: 0,
    nftsMinted: 0,
    topSupporter: null,
    totalTipsGiven: 0,
    totalTipsReceived: 0
  });
  
  const [relationships, setRelationships] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [pendingNFTs, setPendingNFTs] = useState([]);

  // Simulated data - gerçek uygulamada Farcaster API'den gelecek
  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUserStats({
        totalRelationships: 24,
        nftsMinted: 7,
        topSupporter: '@cryptowhale',
        totalTipsGiven: 156.50,
        totalTipsReceived: 234.75
      });

      setRelationships([
        {
          id: 1,
          username: '@cryptowhale',
          avatar: '🐋',
          interactions: 142,
          tipsExchanged: 89.50,
          nftStatus: 'minted',
          nftType: 'Golden Bond',
          firstInteraction: '2025-01-15',
          milestone: 'Top Supporter'
        },
        {
          id: 2,
          username: '@degenbuilder',
          avatar: '🛠️',
          interactions: 89,
          tipsExchanged: 45.20,
          nftStatus: 'ready',
          nftType: 'Co-Creator',
          firstInteraction: '2025-02-01',
          milestone: 'Conversation Partners'
        },
        {
          id: 3,
          username: '@nftcollector',
          avatar: '🎨',
          interactions: 67,
          tipsExchanged: 32.10,
          nftStatus: 'progress',
          nftType: null,
          firstInteraction: '2025-03-10',
          milestone: null
        }
      ]);

      setPendingNFTs([
        {
          id: 1,
          partner: '@degenbuilder',
          type: 'Conversation Partners',
          description: '50+ meaningful conversations',
          readyToMint: true,
          estimatedValue: '$15-25'
        },
        {
          id: 2,
          partner: '@nftcollector',
          type: 'First Supporter',
          description: 'Gave you your first $1+ tip',
          readyToMint: true,
          estimatedValue: '$10-20'
        }
      ]);

      setMilestones([
        { name: 'First Supporter', progress: 100, unlocked: true },
        { name: 'Conversation Partners', progress: 100, unlocked: true },
        { name: 'Co-Creator', progress: 75, unlocked: false },
        { name: 'Mutual Whale', progress: 45, unlocked: false },
        { name: 'Golden Bond', progress: 100, unlocked: true }
      ]);
    }, 500);
  }, []);

  const handleMintNFT = async (nftId) => {
    // Simulated minting process
    alert(`🎨 Minting NFT #${nftId}...\n\nThis will create a dual NFT for both you and your partner!\n\nEstimated gas fee: $0.50 on Base Network`);
    
    // In real app, this would call the smart contract
    // const tx = await contract.mintRelationNFT(partnerId, milestoneType);
  };

  const NFTCard = ({ relationship }) => {
    const getStatusColor = (status) => {
      if (status === 'minted') return 'bg-green-500';
      if (status === 'ready') return 'bg-yellow-500';
      return 'bg-gray-400';
    };

    const getStatusText = (status) => {
      if (status === 'minted') return 'NFT Minted';
      if (status === 'ready') return 'Ready to Mint';
      return 'In Progress';
    };

    return (
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-xl p-6 shadow-2xl border border-purple-500 hover:border-purple-400 transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{relationship.avatar}</div>
            <div>
              <h3 className="text-white font-bold text-lg">{relationship.username}</h3>
              <p className="text-purple-300 text-sm">Since {relationship.firstInteraction}</p>
            </div>
          </div>
          <div className={`${getStatusColor(relationship.nftStatus)} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
            {getStatusText(relationship.nftStatus)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-purple-300 text-xs mb-1">Interactions</p>
            <p className="text-white font-bold text-xl">{relationship.interactions}</p>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-purple-300 text-xs mb-1">Tips Exchanged</p>
            <p className="text-white font-bold text-xl">${relationship.tipsExchanged}</p>
          </div>
        </div>

        {relationship.milestone && (
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <Award className="text-white" size={20} />
              <p className="text-white font-semibold">{relationship.milestone}</p>
            </div>
          </div>
        )}

        {relationship.nftStatus === 'ready' && (
          <button
            onClick={() => handleMintNFT(relationship.id)}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            Mint Relationship NFT
          </button>
        )}

        {relationship.nftStatus === 'minted' && (
          <button className="w-full bg-green-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 cursor-default">
            <Award size={20} />
            View NFT Collection
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 text-white p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Sparkles className="text-yellow-400" size={32} />
                RelationNFT
              </h1>
              <p className="text-purple-300">Immortalize Your Farcaster Connections</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 rounded-lg">
              <p className="text-sm text-white/80">Total NFTs</p>
              <p className="text-2xl font-bold">{userStats.nftsMinted}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <Users className="mx-auto mb-2 text-blue-400" size={24} />
              <p className="text-2xl font-bold">{userStats.totalRelationships}</p>
              <p className="text-xs text-purple-300">Relationships</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <Gift className="mx-auto mb-2 text-green-400" size={24} />
              <p className="text-2xl font-bold">${userStats.totalTipsReceived}</p>
              <p className="text-xs text-purple-300">Tips Received</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <Heart className="mx-auto mb-2 text-pink-400" size={24} />
              <p className="text-2xl font-bold">${userStats.totalTipsGiven}</p>
              <p className="text-xs text-purple-300">Tips Given</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <TrendingUp className="mx-auto mb-2 text-yellow-400" size={24} />
              <p className="text-2xl font-bold">{userStats.topSupporter}</p>
              <p className="text-xs text-purple-300">Top Supporter</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex gap-2 bg-black/30 rounded-xl p-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('relationships')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'relationships'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            Relationships
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'milestones'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            Milestones
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Zap className="text-yellow-400" />
              Ready to Mint
            </h2>
            {pendingNFTs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {pendingNFTs.map((nft) => (
                  <div key={nft.id} className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 rounded-xl p-6 border border-yellow-500/50">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-yellow-300">{nft.type}</h3>
                        <p className="text-white/80 text-sm">with {nft.partner}</p>
                      </div>
                      <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold animate-pulse">
                        Ready!
                      </div>
                    </div>
                    <p className="text-white/70 text-sm mb-4">{nft.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-white/60">Est. Value:</span>
                      <span className="text-lg font-bold text-green-400">{nft.estimatedValue}</span>
                    </div>
                    <button
                      onClick={() => handleMintNFT(nft.id)}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles size={20} />
                      Mint NFT Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-black/30 rounded-xl p-8 text-center mb-8">
                <p className="text-purple-300">No NFTs ready to mint yet. Keep building relationships!</p>
              </div>
            )}

            <h2 className="text-2xl font-bold mb-4">Recent Relationships</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relationships.slice(0, 3).map((rel) => (
                <NFTCard key={rel.id} relationship={rel} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'relationships' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">All Relationships</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relationships.map((rel) => (
                <NFTCard key={rel.id} relationship={rel} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'milestones' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Achievement Milestones</h2>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl p-6 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {milestone.unlocked ? (
                        <Award className="text-yellow-400" size={24} />
                      ) : (
                        <Award className="text-gray-600" size={24} />
                      )}
                      <h3 className="text-lg font-bold">{milestone.name}</h3>
                    </div>
                    <span className={`text-sm font-semibold ${milestone.unlocked ? 'text-green-400' : 'text-yellow-400'}`}>
                      {milestone.progress}%
                    </span>
                  </div>
                  <div className="bg-black/30 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        milestone.unlocked
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      }`}
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="max-w-6xl mx-auto mt-12 bg-black/30 rounded-xl p-6 border border-purple-500/30">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Sparkles className="text-yellow-400" size={20} />
          How RelationNFT Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-semibold text-purple-300 mb-2">1. Build Relationships</p>
            <p className="text-white/70">Interact with others through tips, comments, and collaborations on Farcaster.</p>
          </div>
          <div>
            <p className="font-semibold text-purple-300 mb-2">2. Unlock Milestones</p>
            <p className="text-white/70">Hit achievement thresholds to unlock unique NFT minting opportunities.</p>
          </div>
          <div>
            <p className="font-semibold text-purple-300 mb-2">3. Mint & Earn</p>
            <p className="text-white/70">Create dual NFTs with your partners, gain utility, and build your collection.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
