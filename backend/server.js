// RelationNFT Backend API
// Handles Farcaster integration, milestone tracking, and NFT minting orchestration

const express = require('express');
const { ethers } = require('ethers');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Configuration
const PORT = process.env.PORT || 3000;
const FARCASTER_HUB_URL = process.env.FARCASTER_HUB_URL || 'https://hub.farcaster.xyz';
const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.ORACLE_PRIVATE_KEY;
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET = process.env.PINATA_SECRET;

// Initialize blockchain connection
const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Smart contract ABI (simplified)
const contractABI = [
  "function mintRelationshipNFT(address user1, address user2, uint8 milestoneType, uint256 interactionCount, uint256 totalTipsExchanged, string metadataURI1, string metadataURI2) external payable",
  "function hasRelationshipNFT(address user1, address user2) external view returns (bool)",
  "function mintFee() external view returns (uint256)"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

// In-memory database (use PostgreSQL/MongoDB in production)
const relationshipData = new Map();
const userInteractions = new Map();

// Milestone thresholds
const MILESTONES = {
  FIRST_SUPPORTER: { minTips: 1, minInteractions: 1 },
  CONVERSATION_PARTNER: { minTips: 0, minInteractions: 50 },
  CO_CREATOR: { minTips: 10, minInteractions: 20 },
  MUTUAL_WHALE: { minTips: 100, minInteractions: 10 },
  GOLDEN_BOND: { minTips: 50, minInteractions: 100 },
  COMMUNITY_BUILDER: { minTips: 0, minInteractions: 0, referrals: 10 },
  EARLY_ADOPTER: { userNumber: 1000 }
};

// === FARCASTER API INTEGRATION ===

/**
 * Fetch user data from Farcaster
 */
async function getFarcasterUser(fid) {
  try {
    const response = await axios.get(`${FARCASTER_HUB_URL}/v1/userDataByFid?fid=${fid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Farcaster user:', error);
    return null;
  }
}

/**
 * Track interactions between two users
 */
function trackInteraction(user1Address, user2Address, tipAmount = 0) {
  const key = [user1Address, user2Address].sort().join('-');
  
  if (!relationshipData.has(key)) {
    relationshipData.set(key, {
      users: [user1Address, user2Address],
      interactionCount: 0,
      totalTipsExchanged: 0,
      firstInteraction: Date.now(),
      lastInteraction: Date.now(),
      milestones: []
    });
  }

  const relationship = relationshipData.get(key);
  relationship.interactionCount++;
  relationship.totalTipsExchanged += tipAmount;
  relationship.lastInteraction = Date.now();
  
  relationshipData.set(key, relationship);
  
  return relationship;
}

/**
 * Check if a milestone is unlocked
 */
function checkMilestoneUnlocked(relationship, milestoneType) {
  const threshold = MILESTONES[milestoneType];
  
  if (!threshold) return false;

  const tipsInEther = ethers.formatEther(relationship.totalTipsExchanged.toString());
  
  switch(milestoneType) {
    case 'FIRST_SUPPORTER':
      return relationship.totalTipsExchanged >= ethers.parseEther('1') && 
             !relationship.milestones.includes('FIRST_SUPPORTER');
    
    case 'CONVERSATION_PARTNER':
      return relationship.interactionCount >= threshold.minInteractions &&
             !relationship.milestones.includes('CONVERSATION_PARTNER');
    
    case 'MUTUAL_WHALE':
      return relationship.totalTipsExchanged >= ethers.parseEther('100') &&
             !relationship.milestones.includes('MUTUAL_WHALE');
    
    case 'GOLDEN_BOND':
      return relationship.interactionCount >= 100 && 
             relationship.totalTipsExchanged >= ethers.parseEther('50') &&
             !relationship.milestones.includes('GOLDEN_BOND');
    
    default:
      return false;
  }
}

/**
 * Generate NFT metadata and upload to IPFS via Pinata
 */
async function generateAndUploadMetadata(user1, user2, milestoneType, relationship) {
  const metadata1 = {
    name: `${milestoneType} - ${user1} & ${user2}`,
    description: `This NFT represents a ${milestoneType} milestone between ${user1} and ${user2} on Farcaster.`,
    image: await generateNFTImage(user1, user2, milestoneType),
    attributes: [
      { trait_type: "Milestone Type", value: milestoneType },
      { trait_type: "Interactions", value: relationship.interactionCount },
      { trait_type: "Tips Exchanged", value: ethers.formatEther(relationship.totalTipsExchanged.toString()) + " ETH" },
      { trait_type: "Partner", value: user2 },
      { trait_type: "Minted At", value: new Date().toISOString() }
    ]
  };

  const metadata2 = { ...metadata1, name: `${milestoneType} - ${user2} & ${user1}` };
  metadata2.attributes[3].value = user1;

  // Upload to IPFS (Pinata)
  const uri1 = await uploadToIPFS(metadata1);
  const uri2 = await uploadToIPFS(metadata2);

  return { uri1, uri2 };
}

/**
 * Upload JSON to IPFS via Pinata
 */
async function uploadToIPFS(metadata) {
  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      metadata,
      {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET
        }
      }
    );
    return `ipfs://${response.data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}

/**
 * Generate NFT image URL (using placeholder service)
 * In production, use AI image generation or custom graphics
 */
async function generateNFTImage(user1, user2, milestoneType) {
  // Simple placeholder - integrate with AI art generator in production
  const colors = {
    FIRST_SUPPORTER: 'ffbe0b',
    CONVERSATION_PARTNER: '8338ec',
    MUTUAL_WHALE: 'fb5607',
    GOLDEN_BOND: 'ffd60a',
    CO_CREATOR: '3a86ff'
  };
  
  const color = colors[milestoneType] || '000000';
  return `https://via.placeholder.com/512/${color}/ffffff?text=${milestoneType}`;
}

// === API ENDPOINTS ===

/**
 * Webhook to receive Farcaster events (tips, interactions)
 */
app.post('/api/farcaster/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (type === 'tip') {
      const { fromAddress, toAddress, amount } = data;
      const relationship = trackInteraction(fromAddress, toAddress, ethers.parseEther(amount));
      
      // Check for milestone unlocks
      const milestonesToCheck = ['FIRST_SUPPORTER', 'CONVERSATION_PARTNER', 'MUTUAL_WHALE', 'GOLDEN_BOND'];
      
      for (const milestone of milestonesToCheck) {
        if (checkMilestoneUnlocked(relationship, milestone)) {
          // Trigger NFT minting
          await mintRelationshipNFT(fromAddress, toAddress, milestone, relationship);
        }
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get relationship status between two users
 */
app.get('/api/relationship/:user1/:user2', async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const key = [user1, user2].sort().join('-');
    const relationship = relationshipData.get(key);
    
    if (!relationship) {
      return res.json({ exists: false });
    }
    
    // Check which milestones are ready
    const readyMilestones = [];
    for (const [milestone, threshold] of Object.entries(MILESTONES)) {
      if (checkMilestoneUnlocked(relationship, milestone)) {
        readyMilestones.push(milestone);
      }
    }
    
    res.json({
      exists: true,
      relationship,
      readyMilestones,
      hasNFT: await contract.hasRelationshipNFT(user1, user2)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Manually trigger NFT minting (for testing)
 */
app.post('/api/mint', async (req, res) => {
  try {
    const { user1, user2, milestoneType } = req.body;
    
    // Get relationship data
    const key = [user1, user2].sort().join('-');
    const relationship = relationshipData.get(key);
    
    if (!relationship) {
      return res.status(400).json({ error: 'No relationship found' });
    }
    
    // Mint NFT
    const txHash = await mintRelationshipNFT(user1, user2, milestoneType, relationship);
    
    res.json({ success: true, txHash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get user statistics
 */
app.get('/api/user/:address/stats', async (req, res) => {
  try {
    const { address } = req.params;
    
    let totalRelationships = 0;
    let totalInteractions = 0;
    let totalTips = 0;
    
    for (const [key, relationship] of relationshipData.entries()) {
      if (relationship.users.includes(address)) {
        totalRelationships++;
        totalInteractions += relationship.interactionCount;
        totalTips += parseFloat(ethers.formatEther(relationship.totalTipsExchanged.toString()));
      }
    }
    
    res.json({
      address,
      totalRelationships,
      totalInteractions,
      totalTips,
      nftCount: await contract.userNFTCount(address)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === CORE MINTING FUNCTION ===

async function mintRelationshipNFT(user1, user2, milestoneType, relationship) {
  try {
    console.log(`Minting NFT for ${user1} and ${user2} - ${milestoneType}`);
    
    // Check if already minted
    const alreadyMinted = await contract.hasRelationshipNFT(user1, user2);
    if (alreadyMinted) {
      throw new Error('NFT already minted for this relationship');
    }
    
    // Generate metadata
    const { uri1, uri2 } = await generateAndUploadMetadata(user1, user2, milestoneType, relationship);
    
    // Get mint fee
    const mintFee = await contract.mintFee();
    const totalFee = mintFee * 2n; // Fee for both NFTs
    
    // Convert milestone type to enum value
    const milestoneEnum = Object.keys(MILESTONES).indexOf(milestoneType);
    
    // Call smart contract
    const tx = await contract.mintRelationshipNFT(
      user1,
      user2,
      milestoneEnum,
      relationship.interactionCount,
      relationship.totalTipsExchanged,
      uri1,
      uri2,
      { value: totalFee }
    );
    
    console.log(`Transaction sent: ${tx.hash}`);
    await tx.wait();
    console.log(`NFT minted successfully!`);
    
    // Mark milestone as achieved
    relationship.milestones.push(milestoneType);
    
    return tx.hash;
  } catch (error) {
    console.error('Minting error:', error);
    throw error;
  }
}

// === SERVER START ===

app.listen(PORT, () => {
  console.log(`RelationNFT API running on port ${PORT}`);
  console.log(`Contract address: ${CONTRACT_ADDRESS}`);
  console.log(`Oracle wallet: ${wallet.address}`);
});

// Export for testing
module.exports = { app, trackInteraction, checkMilestoneUnlocked };

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. Install dependencies:
 *    npm install express ethers axios cors dotenv
 * 
 * 2. Create .env file:
 *    ORACLE_PRIVATE_KEY=your_private_key
 *    CONTRACT_ADDRESS=deployed_contract_address
 *    BASE_RPC_URL=https://mainnet.base.org
 *    PINATA_API_KEY=your_pinata_key
 *    PINATA_SECRET=your_pinata_secret
 * 
 * 3. Deploy smart contract first
 * 4. Set oracle address in contract to this backend's wallet
 * 5. Run: node server.js
 * 6. Configure Farcaster webhooks to point to /api/farcaster/webhook
 */
