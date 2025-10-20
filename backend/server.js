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
const PRIVATE_KEY = process.env.ORACLE_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY;

// Initialize blockchain connection (optional for development)
let provider = null;
let wallet = null;
let contract = null;

const RELATION_NFT_ABI = [
  'function mintRelationshipNFT(address user1, address user2, uint8 milestoneType, uint256 interactionCount, uint256 totalTipsExchanged, string metadataURI1, string metadataURI2) payable',
  'function mintFee() view returns (uint256)',
];

if (PRIVATE_KEY && PRIVATE_KEY.startsWith('0x') && PRIVATE_KEY.length === 66) {
  try {
    provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
    wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log('✅ Blockchain connected:', wallet.address);
    if (CONTRACT_ADDRESS) {
      try {
        contract = new ethers.Contract(CONTRACT_ADDRESS, RELATION_NFT_ABI, wallet);
        console.log('✅ Contract ready:', CONTRACT_ADDRESS);
      } catch (contractError) {
        console.log('⚠️  Failed to initialise contract:', contractError.message);
      }
    } else {
      console.log('ℹ️  CONTRACT_ADDRESS env var not set. Mint requests will be simulated.');
    }
  } catch (error) {
    console.log('⚠️  Blockchain connection error:', error.message);
  }
} else {
  console.log('⚠️  Running in development mode (no blockchain connection)');
}

// In-memory database
const relationshipData = new Map();

// === API ENDPOINTS ===

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    blockchainConnected: wallet !== null,
    contractAddress: CONTRACT_ADDRESS
  });
});

app.post('/api/farcaster/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;
    console.log('📨 Webhook received:', type, data);
    res.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/relationship/:user1/:user2', async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    res.json({ exists: true, relationship: {} });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/mint', async (req, res) => {
  try {
    const {
      user1,
      user2,
      milestoneType,
      interactionCount = 0,
      totalTipsExchanged = '0',
      metadataURI1 = '',
      metadataURI2 = '',
    } = req.body;

    if (!user1 || !user2 || typeof milestoneType !== 'number') {
      return res.status(400).json({ error: 'Missing required mint parameters.' });
    }

    if (!wallet || !contract) {
      return res.json({
        success: true,
        simulated: true,
        message: 'Mint simulated. Configure blockchain credentials for live minting.',
      });
    }

    const mintFee = await contract.mintFee();
    const totalFee = mintFee * 2n;
    const interactionValue = BigInt(interactionCount);
    const totalTipsValue = ethers.parseUnits(String(totalTipsExchanged), 18);

    const tx = await contract.mintRelationshipNFT(
      user1,
      user2,
      milestoneType,
      interactionValue,
      totalTipsValue,
      metadataURI1,
      metadataURI2,
      {
        value: totalFee,
      }
    );

    const receipt = await tx.wait();

    res.json({
      success: true,
      simulated: false,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    });
  } catch (error) {
    console.error('Mint error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({
    name: 'RelationNFT API',
    version: '1.0.0',
    status: 'running'
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║   RelationNFT API Server                  ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`📝 Contract: ${CONTRACT_ADDRESS || 'Not set'}`);
  console.log(`🔗 Blockchain: ${wallet ? 'Connected ✅' : 'Dev mode ⚠️'}`);
  console.log('');
});

module.exports = { app };
