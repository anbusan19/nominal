# Quick Start Guide

This guide will help you get Nominal up and running quickly.

## Prerequisites

- Node.js 18+ installed
- A code editor (VS Code recommended)
- Basic knowledge of Web3 and React

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Setup Foundry

If you don't have Foundry installed:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Then install OpenZeppelin contracts:

```bash
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

## Step 3: Configure Environment

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` and add:

1. **Arc RPC URL** - Get from Arc documentation
2. **LI.FI API Key** - Sign up at https://li.fi
3. **WalletConnect Project ID** (optional) - Get from https://cloud.walletconnect.com

## Step 4: Deploy Contracts

Before deploying, you'll need:

- A private key with test funds on Arc
- The USDC contract address on Arc

Add to `.env`:
```
PRIVATE_KEY=your_private_key_here
USDC_ADDRESS=0x...
```

Deploy:

```bash
forge script scripts/Deploy.s.sol --broadcast --rpc-url $NEXT_PUBLIC_ARC_RPC_URL
```

After deployment, update `.env` with the deployed contract address:
```
NEXT_PUBLIC_PAYROLL_VAULT_ADDRESS=0x...
```

## Step 5: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Next Steps

1. **Connect your wallet** using the wallet button
2. **Register a corporate ENS domain** (if you own one)
3. **Add employees** by creating ENS subnames
4. **Deposit USDC** into the vault
5. **Distribute payroll** to employees
6. **Test bridging** using the employee withdrawal interface

## Troubleshooting

### "Module not found" errors
Run `npm install` again and ensure all dependencies are installed.

### Foundry errors
Make sure Foundry is installed and OpenZeppelin contracts are in `lib/openzeppelin-contracts/`

### Wallet connection issues
- Ensure you have a WalletConnect Project ID if using WalletConnect
- Check that your wallet supports the Arc network
- Try using injected connector (MetaMask)

### Contract deployment fails
- Verify you have test funds on Arc
- Check that USDC address is correct
- Ensure RPC URL is accessible

## Getting Help

- Check the main [README.md](./README.md) for detailed documentation
- Review the [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
- Open an issue on GitHub for bugs or questions
