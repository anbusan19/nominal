# Nominal: Sovereign Payroll Infrastructure

## Overview
Nominal is a decentralized payroll management system designed for the global, remote-first workforce. It eliminates the friction of traditional cross-border payments by combining decentralized identity with automated stablecoin distribution. The platform allows companies to manage corporate hierarchies through ENS subnames and enables employees to receive and bridge their salaries to their preferred blockchain ecosystem in a single transaction.

## The Problem
Remote workers and freelancers often face three primary obstacles:
1. **Identity Management:** Managing fragmented 0x addresses for a global team is prone to error and lacks professional structure.
2. **Settlement Latency:** International banking transfers are slow, expensive, and subject to local government intervention or currency devaluation.
3. **Liquidity Fragmentation:** Payouts are often locked to the chain the employer uses, forcing the employee to manage complex bridging and gas logistics themselves.

## The Workflow
The platform follows a three-stage lifecycle:

### 1. Corporate Identity Onboarding (ENS)
Companies connect their administrative wallet and register their primary ENS domain (e.g., google.eth). This domain acts as the root of the corporate identity tree.

### 2. Employee Provisioning
Employees connect their wallets and request a subname linked to the corporate domain (e.g., alice.google.eth). 
* The system utilizes the ENS NameWrapper to issue these subnames.
* This creates a human-readable mapping that replaces the need for the employer to store or verify raw hex addresses manually.

### 3. Automated Payroll & Cross-Chain Withdrawal
* **Distribution:** The company funds a treasury vault on the Arc (Circle) L1. At the end of the pay period, a batch transaction distributes USDC to the resolved addresses of all registered subnames.
* **Sovereign Withdrawal:** Upon receiving funds, the employee can use the integrated LI.FI protocol to "Claim & Bridge." This allows them to move their USDC from Arc to any supported EVM chain (such as Base, Arbitrum, or Polygon) or swap it into other assets (like ETH) in a single flow.

## Technical Integrations

### Arc (Circle)
Arc serves as the primary Economic OS for the platform.
* **Implementation:** Corporate treasuries are held as USDC on the Arc L1 to ensure high-fidelity settlement and regulatory-ready stablecoin infrastructure.
* **Bounty Targeted:** Best Global Payouts and Treasury Systems.

### ENS (Ethereum Name Service)
ENS is utilized as the core identity and routing layer.
* **Implementation:** We utilize NameWrapper for subname management. Our resolution logic ensures that payroll is sent to the address currently linked to the employee's subname, allowing workers to rotate their keys without interrupting the payroll cycle.
* **Bounty Targeted:** Most creative use of ENS for DeFi.

### LI.FI
LI.FI provides the cross-chain execution layer for the employee "Exit Ramp."
* **Implementation:** We integrated the LI.FI SDK to handle the bridging and swapping of USDC from the Arc L1 to the employee’s destination of choice. This abstracts the complexity of gas on destination chains and bridge selection.
* **Bounty Targeted:** Best LI.FI-Powered DeFi Integration.

## Installation and Setup

### Requirements
* Node.js v18.0.0 or higher
* Foundry (for smart contract testing)
* npm or yarn

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nominal.git
   cd nominal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup Foundry (if not already installed):**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   forge install OpenZeppelin/openzeppelin-contracts --no-commit
   ```

4. **Configure environment variables:**
   ```bash
   cp env.example .env
   ```
   Then edit `.env` and add your:
   - Arc RPC URL
   - LI.FI API key
   - WalletConnect Project ID (optional)
   - Contract addresses (after deployment)

5. **Deploy smart contracts:**
   ```bash
   # Set your private key and USDC address in .env
   forge script scripts/Deploy.s.sol --broadcast --rpc-url $NEXT_PUBLIC_ARC_RPC_URL
   ```

6. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Project Structure

```
nominal/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main dashboard
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── CorporateOnboarding.tsx
│   ├── EmployeeProvisioning.tsx
│   ├── PayrollManagement.tsx
│   ├── EmployeeWithdrawal.tsx
│   └── ui/               # Reusable UI components
├── contracts/            # Solidity smart contracts
│   └── PayrollVault.sol  # Main payroll vault contract
├── lib/                  # Utility libraries
│   ├── config/          # Chain and wagmi configuration
│   ├── ens/             # ENS integration utilities
│   ├── lifi/            # LI.FI SDK integration
│   └── contracts/       # Contract interaction helpers
├── scripts/             # Deployment and setup scripts
└── test/                # Foundry test files
```

## Architecture
1. **Employer:** Deposits USDC -> Arc Vault.
2. **Identity Layer:** Resolver checks name.company.eth -> 0xAddress.
3. **Execution Layer:** Batch transfer triggers on Arc.
4. **Employee Interface:** LI.FI SDK calculates routes -> Executes Bridge/Swap to destination chain.

## Future Roadmap
* **Agentic Payroll:** Implementing autonomous agents to trigger payroll based on GitHub commits or Jira ticket completion.
* **RWA Integration:** Allowing companies to use tokenized yield-bearing assets on Arc as the collateral for their payroll treasury.