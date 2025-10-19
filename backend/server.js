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

if (PRIVATE_KEY && PRIVATE_KEY.startsWith('0x') && PRIVATE_KEY.length === 66) {
  try {
    provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
    wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log('✅ Blockchain connected:', wallet.address);
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
