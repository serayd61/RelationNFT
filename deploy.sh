#!/bin/bash

###############################################################################
# RelationNFT - Complete Deployment Automation Script
# This script automates the entire deployment process
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f .env ]; then
        print_error ".env file not found!"
        echo "Creating .env template..."
        cat > .env << EOF
# Blockchain Configuration
DEPLOYER_PRIVATE_KEY=your_private_key_here
ORACLE_PRIVATE_KEY=your_oracle_private_key_here
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key

# IPFS Configuration
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET=your_pinata_secret

# API Configuration
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001

# Farcaster Configuration
FARCASTER_HUB_URL=https://hub.farcaster.xyz

# Contract Addresses (will be filled after deployment)
CONTRACT_ADDRESS=
EOF
        print_warning "Please fill in the .env file with your credentials"
        exit 1
    fi
}

# Load environment variables
load_env() {
    print_step "Loading environment variables..."
    set -a
    source .env
    set +a
    print_success "Environment loaded"
}

# Install dependencies
install_dependencies() {
    print_step "Installing dependencies..."
    
    # Backend dependencies
    print_step "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Frontend dependencies
    print_step "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    # Smart contract dependencies
    print_step "Installing smart contract dependencies..."
    cd contracts
    npm install
    cd ..
    
    print_success "All dependencies installed"
}

# Compile smart contracts
compile_contracts() {
    print_step "Compiling smart contracts..."
    cd contracts
    npx hardhat compile
    print_success "Contracts compiled"
    cd ..
}

# Deploy smart contracts
deploy_contracts() {
    print_step "Deploying smart contracts to Base network..."
    cd contracts
    
    # Deploy to testnet first
    print_warning "Deploying to Base Goerli (testnet)..."
    TESTNET_ADDRESS=$(npx hardhat run scripts/deploy.js --network baseGoerli | grep "Contract deployed to:" | awk '{print $4}')
    
    echo ""
    read -p "Deploy to mainnet? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_step "Deploying to Base Mainnet..."
        MAINNET_ADDRESS=$(npx hardhat run scripts/deploy.js --network base | grep "Contract deployed to:" | awk '{print $4}')
        
        # Update .env with contract address
        sed -i "s/CONTRACT_ADDRESS=.*/CONTRACT_ADDRESS=$MAINNET_ADDRESS/" ../.env
        
        print_success "Contract deployed to mainnet: $MAINNET_ADDRESS"
        
        # Verify on BaseScan
        print_step "Verifying contract on BaseScan..."
        npx hardhat verify --network base $MAINNET_ADDRESS $ORACLE_ADDRESS
        print_success "Contract verified"
    else
        print_warning "Skipping mainnet deployment"
        sed -i "s/CONTRACT_ADDRESS=.*/CONTRACT_ADDRESS=$TESTNET_ADDRESS/" ../.env
    fi
    
    cd ..
}

# Setup backend API
setup_backend() {
    print_step "Setting up backend API..."
    cd backend
    
    # Run database migrations (if using DB)
    # npm run migrate
    
    # Start backend in background
    print_step "Starting backend server..."
    npm start > backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > backend.pid
    
    # Wait for backend to start
    sleep 5
    
    # Test backend health
    if curl -s http://localhost:3000/health > /dev/null; then
        print_success "Backend server running (PID: $BACKEND_PID)"
    else
        print_error "Backend server failed to start"
        exit 1
    fi
    
    cd ..
}

# Setup frontend
setup_frontend() {
    print_step "Setting up frontend..."
    cd frontend
    
    # Build frontend
    print_step "Building frontend..."
    npm run build
    
    # Deploy to Vercel (if configured)
    if command -v vercel &> /dev/null; then
        read -p "Deploy to Vercel? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_step "Deploying to Vercel..."
            vercel --prod
            print_success "Frontend deployed to Vercel"
        fi
    else
        print_warning "Vercel CLI not found. Run: npm i -g vercel"
    fi
    
    cd ..
}

# Register with Farcaster
register_farcaster() {
    print_step "Farcaster Integration Setup"
    echo ""
    echo "To complete Farcaster integration:"
    echo "1. Go to: https://warpcast.com/~/developers"
    echo "2. Create a new Mini App"
    echo "3. Set App URL to: $FRONTEND_URL"
    echo "4. Set Webhook URL to: $API_URL/api/farcaster/webhook"
    echo "5. Subscribe to events: tip.sent, tip.received, cast.created"
    echo ""
    read -p "Press enter when done..."
    print_success "Farcaster setup complete"
}

# Run tests
run_tests() {
    print_step "Running test suite..."
    
    # Test smart contracts
    print_step "Testing smart contracts..."
    cd contracts
    npx hardhat test
    cd ..
    
    # Test backend API
    print_step "Testing backend API..."
    cd backend
    npm test
    cd ..
    
    # Test frontend
    print_step "Testing frontend..."
    cd frontend
    npm test
    cd ..
    
    print_success "All tests passed!"
}

# Create test data
seed_test_data() {
    print_step "Seeding test data..."
    
    curl -X POST http://localhost:3000/api/test/seed \
         -H "Content-Type: application/json" \
         -d '{
           "users": 10,
           "relationships": 20,
           "interactions": 100
         }'
    
    print_success "Test data seeded"
}

# Health check
health_check() {
    print_step "Running health checks..."
    
    # Check backend
    if curl -s http://localhost:3000/health | grep -q "ok"; then
        print_success "Backend: OK"
    else
        print_error "Backend: FAILED"
    fi
    
    # Check contract
    if [ ! -z "$CONTRACT_ADDRESS" ]; then
        print_success "Contract: $CONTRACT_ADDRESS"
    else
        print_error "Contract: Not deployed"
    fi
    
    # Check frontend
    if [ -d "frontend/dist" ] || [ -d "frontend/.next" ]; then
        print_success "Frontend: Built"
    else
        print_warning "Frontend: Not built"
    fi
}

# Stop services
stop_services() {
    print_step "Stopping services..."
    
    if [ -f backend/backend.pid ]; then
        BACKEND_PID=$(cat backend/backend.pid)
        kill $BACKEND_PID 2>/dev/null || true
        rm backend/backend.pid
        print_success "Backend stopped"
    fi
}

# Main deployment flow
main() {
    echo ""
    echo "╔═══════════════════════════════════════════╗"
    echo "║   RelationNFT Deployment Automation       ║"
    echo "╚═══════════════════════════════════════════╝"
    echo ""
    
    # Check prerequisites
    check_env_file
    load_env
    
    # Show menu
    echo "Select deployment option:"
    echo "1) Full deployment (contracts + backend + frontend)"
    echo "2) Deploy contracts only"
    echo "3) Deploy backend only"
    echo "4) Deploy frontend only"
    echo "5) Run tests"
    echo "6) Health check"
    echo "7) Stop services"
    echo "8) Exit"
    echo ""
    read -p "Enter option (1-8): " option
    
    case $option in
        1)
            install_dependencies
            compile_contracts
            deploy_contracts
            setup_backend
            setup_frontend
            register_farcaster
            run_tests
            health_check
            ;;
        2)
            install_dependencies
            compile_contracts
            deploy_contracts
            ;;
        3)
            setup_backend
            ;;
        4)
            setup_frontend
            ;;
        5)
            run_tests
            ;;
        6)
            health_check
            ;;
        7)
            stop_services
            ;;
        8)
            echo "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid option"
            exit 1
            ;;
    esac
    
    echo ""
    print_success "Deployment complete! 🎉"
    echo ""
    echo "Access your app at:"
    echo "  Backend API: $API_URL"
    echo "  Frontend: $FRONTEND_URL"
    echo "  Contract: $CONTRACT_ADDRESS"
    echo ""
}

# Handle script interruption
trap stop_services EXIT

# Run main function
main

###############################################################################
# USAGE:
#
# 1. Make script executable:
#    chmod +x deploy.sh
#
# 2. Run deployment:
#    ./deploy.sh
#
# 3. Follow the interactive prompts
#
# For automated deployment (CI/CD):
#    ./deploy.sh --auto --env=production
#
###############################################################################
