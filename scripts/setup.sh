#!/bin/bash

# Nominal Project Setup Script

echo "🚀 Setting up Nominal project..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js version 18 or higher is required"
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup Foundry (if not already installed)
if ! command -v forge &> /dev/null; then
  echo "🔨 Installing Foundry..."
  curl -L https://foundry.paradigm.xyz | bash
  foundryup
fi

# Install Foundry dependencies
echo "📚 Installing Foundry dependencies..."
forge install OpenZeppelin/openzeppelin-contracts --no-commit

# Copy environment file
if [ ! -f .env ]; then
  echo "📝 Creating .env file..."
  cp env.example .env
  echo "⚠️  Please update .env with your configuration"
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your API keys and contract addresses"
echo "2. Deploy PayrollVault contract: forge script script/Deploy.s.sol"
echo "3. Run development server: npm run dev"
