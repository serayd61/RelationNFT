# 💎 RelationNFT

> **Transform your Farcaster connections into valuable NFTs**

RelationNFT is an innovative Web3 application that immortalizes meaningful interactions between users on Farcaster through unique, dual NFTs.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)](https://docs.soliditylang.org/)
[![Base Network](https://img.shields.io/badge/Network-Base-0052FF)](https://base.org/)
[![Farcaster](https://img.shields.io/badge/Farcaster-Compatible-8A63D2)](https://farcaster.xyz/)

## 🌟 Features

### ✨ Core Features

- **Automatic NFT Minting**: Dual NFTs are automatically minted when relationship milestones are achieved
- **7 Milestone Types**: From First Supporter to Golden Bond, celebrate various achievements
- **Dynamic NFTs**: Each NFT features unique, relationship-specific designs
- **Real Utility**: NFTs aren't just collectibles—they provide platform benefits
- **Cross-Platform**: Seamlessly integrated Farcaster Mini App + Web interface

### 💰 Value Creation

- **Passive Income**: Every like and interaction earns you USDC
- **NFT Value**: Rare milestone NFTs appreciate on secondary markets
- **Staking Rewards**: Stake your NFTs to earn additional rewards
- **VIP Access**: High-level NFTs unlock exclusive channels and features

### 🎨 Milestone Types

| Milestone | Requirements | Rarity | Utility |
|-----------|-------------|--------|---------|
| 🌟 First Supporter | First $1+ tip | Common | +2% tip bonus |
| 💬 Conversation Partner | 50+ interactions | Rare | Special channel access |
| 🛠️ Co-Creator | Collaborative project | Rare | Priority listing |
| 🐋 Mutual Whale | $100+ mutual tips | Epic | Fee discount |
| 💎 Golden Bond | 100+ interactions + $50+ tips | Epic | VIP access |
| 🏗️ Community Builder | 10+ referrals | Legendary | Revenue share |
| 🚀 Early Adopter | First 1000 users | Legendary | Lifetime benefits |

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React + Next.js 14 + Tailwind CSS
- **Backend**: Node.js + Express
- **Blockchain**: Solidity 0.8.20 on Base Network
- **Storage**: IPFS (via Pinata)
- **Social**: Farcaster Protocol integration

### Project Structure

```
relationnft/
├── frontend/                 # React Mini App
│   ├── app/
│   │   ├── page.tsx         # Main application
│   │   └── api/
│   │       └── frame/       # Farcaster Frame API
│   ├── public/
│   │   └── manifest.json    # Frame manifest
│   └── package.json
│
├── backend/                 # Node.js API
│   ├── server.js           # Express server
│   ├── services/
│   │   ├── farcaster.js    # Farcaster integration
│   │   ├── blockchain.js   # Web3 interactions
│   │   └── ipfs.js         # IPFS upload
│   └── package.json
│
├── contracts/              # Smart Contracts
│   ├── contracts/
│   │   └── RelationNFT.sol # Main NFT contract
│   ├── scripts/
│   │   └── deploy.js       # Deployment script
│   ├── test/
│   │   └── RelationNFT.test.js
│   └── hardhat.config.js
│
├── utils/                  # Utilities
│   ├── metadata-generator.js
│   └── nft-designer.js
│
├── deploy.sh              # Automated deployment
├── .env.example           # Environment template
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- npm or yarn
- MetaMask wallet
- Farcaster account
- Base network ETH (~$10-20)
- Pinata account (for IPFS)

### Installation

```bash
# Clone the repository
git clone https://github.com/serayd61/RelationNFT.git
cd RelationNFT

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run automated deployment
chmod +x deploy.sh
./deploy.sh
```

### Manual Setup

<details>
<summary>Step-by-step manual installation (click to expand)</summary>

#### 1. Smart Contract Deployment

```bash
cd contracts
npm install
npx hardhat compile

# Deploy to testnet
npx hardhat run scripts/deploy.js --network baseGoerli

# Deploy to mainnet
npx hardhat run scripts/deploy.js --network base

# Verify on BaseScan
npx hardhat verify --network base CONTRACT_ADDRESS ORACLE_ADDRESS
```

#### 2. Backend Setup

```bash
cd backend
npm install

# Start server
npm start

# Or production mode
npm run prod
```

#### 3. Frontend Setup

```bash
cd frontend
npm install

# Development
npm run dev

# Production build
npm run build

# Deploy to Vercel
vercel --prod
```

</details>

## 🔧 Configuration

### Environment Variables

```env
# Blockchain
DEPLOYER_PRIVATE_KEY=0x...
ORACLE_PRIVATE_KEY=0x...
BASE_RPC_URL=https://mainnet.base.org
CONTRACT_ADDRESS=0x...

# IPFS
PINATA_API_KEY=...
PINATA_SECRET=...

# API
API_URL=https://api.relationnft.com
FRONTEND_URL=https://relationnft.com

# Farcaster
FARCASTER_HUB_URL=https://hub.farcaster.xyz
```

### Farcaster Integration

1. Go to Farcaster Developer Portal: https://warpcast.com/~/developers
2. Create a new Mini App
3. Set webhook URL: `https://your-api.com/api/farcaster/webhook`
4. Subscribe to events:
   - `tip.sent`
   - `tip.received`
   - `cast.created`
   - `reaction.added`

## 📊 API Documentation

### Public Endpoints

```
GET  /api/relationship/:user1/:user2  # Get relationship status
GET  /api/user/:address/stats         # Get user statistics
POST /api/mint                         # Mint NFT (requires auth)
```

### Webhook Endpoints

```
POST /api/farcaster/webhook           # Farcaster event handler
```

### Admin Endpoints

```
POST /api/test/seed                   # Seed test data
GET  /api/health                      # Health check
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Smart contract tests
cd contracts
npx hardhat test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

## 💻 Development

### Local Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Local blockchain
cd contracts
npx hardhat node
```

### Test NFT Minting

```bash
# Seed test data
curl -X POST http://localhost:3000/api/test/seed

# Test mint
curl -X POST http://localhost:3000/api/mint \
  -H "Content-Type: application/json" \
  -d '{
    "user1": "0x123...",
    "user2": "0x456...",
    "milestoneType": "FIRST_SUPPORTER"
  }'
```

## 📈 Deployment

### Production Checklist

- [ ] Smart contract audited
- [ ] Environment variables configured for production
- [ ] HTTPS certificates installed
- [ ] Rate limiting enabled
- [ ] Monitoring setup (Sentry, DataDog)
- [ ] Backup strategy implemented
- [ ] Smart contract verified on BaseScan
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render
- [ ] Farcaster app registered and approved

### Deployment Options

**Frontend:**
- ✅ Vercel (Recommended)
- Railway
- Netlify

**Backend:**
- ✅ Railway (Recommended)
- Render
- AWS/GCP

**Blockchain:**
- ✅ Base Mainnet (Recommended)
- Base Goerli (Testnet)

## 💰 Tokenomics & Revenue

### Revenue Streams

1. **Mint Fees**: 0.001 ETH (~$2) per NFT pair
2. **Premium Subscriptions**: $10-15/month
3. **Marketplace Commission**: 2.5% on secondary sales
4. **Sponsored Milestones**: Brand partnership revenue

### Cost Breakdown

| Item | Cost |
|------|------|
| Smart Contract Audit | $5,000-10,000 (one-time) |
| Infrastructure | $50-100/month |
| Gas fees (Base) | ~$0.50 per mint |
| IPFS storage | $5-20/month |

### Projected Revenue (Month 1)

- 500 NFTs minted × $2 = **$1,000**
- 50 premium users × $10 = **$500**
- **Total: ~$1,500/month**

## 🛡️ Security

### Security Features

- ✅ Private keys secured in environment variables
- ✅ Rate limiting on all API endpoints
- ✅ Input validation and sanitization
- ✅ Smart contract security best practices
- ✅ HTTPS/SSL everywhere
- ✅ Regular dependency updates
- ✅ Oracle-based verification system

### Audit

```bash
# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Smart contract analysis
cd contracts
slither .
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Keep commits atomic and descriptive

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: https://relationnft.com
- **Documentation**: https://docs.relationnft.com
- **Farcaster**: [@relationnft](https://warpcast.com/relationnft)
- **Twitter**: [@relationnft](https://twitter.com/relationnft)
- **Discord**: https://discord.gg/relationnft

## 👥 Team

- **Founder & Lead Developer**: [Your Name]
- **Smart Contract Developer**: [Name]
- **Frontend Developer**: [Name]
- **Designer**: [Name]

## 🙏 Acknowledgments

- Farcaster team for the innovative protocol
- Base network for affordable transactions
- OpenZeppelin for secure contract templates
- Vercel for seamless hosting
- The entire Web3 community

## 📞 Support

Need help? Reach out:

- **Email**: support@relationnft.com
- **Discord**: https://discord.gg/relationnft
- **Documentation**: https://docs.relationnft.com
- **GitHub Issues**: https://github.com/serayd61/RelationNFT/issues

## 🗺️ Roadmap

### Q1 2025
- [x] Smart contract development
- [x] Basic UI implementation
- [x] Farcaster integration
- [ ] Beta launch on testnet
- [ ] Security audit

### Q2 2025
- [ ] Mainnet deployment
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Marketplace launch

### Q3 2025
- [ ] Multi-chain support (Ethereum, Optimism)
- [ ] AI-generated NFT designs
- [ ] Partnership integrations
- [ ] DAO governance

### Q4 2025
- [ ] Token launch
- [ ] Global expansion
- [ ] 100,000+ users milestone

## 📊 Statistics

- **Smart Contract**: ERC-721 compliant
- **Supported Networks**: Base (Mainnet & Testnet)
- **NFT Storage**: IPFS (decentralized)
- **Average Mint Cost**: ~$2.50 (including gas)
- **Transaction Speed**: <2 seconds on Base

## 🎯 Use Cases

1. **Content Creators**: Reward your most loyal supporters
2. **Communities**: Create exclusive membership NFTs
3. **Brands**: Engage customers with relationship-based rewards
4. **DAOs**: Track and reward active contributors
5. **Social Networks**: Gamify user engagement

---

<div align="center">

**Every connection matters. Make yours eternal with RelationNFT. 💎**

[Live Demo](https://demo.relationnft.com) • [Documentation](https://docs.relationnft.com) • [Join Discord](https://discord.gg/relationnft)

Made with ❤️ by the RelationNFT Team

</div>
