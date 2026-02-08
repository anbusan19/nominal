# Nominal: Sovereign Payroll Infrastructure - Frontend

This is the frontend application for Nominal, a decentralized payroll management system designed for the global, remote-first workforce.

## Overview

Nominal eliminates the friction of traditional cross-border payments by combining decentralized identity with automated stablecoin distribution. The platform allows companies to manage corporate hierarchies through ENS subnames and enables employees to receive and bridge their salaries to their preferred blockchain ecosystem in a single transaction.

## Features

- **Corporate Identity Onboarding (ENS):** Companies register their primary ENS domain (e.g., google.eth) as the root of their corporate identity tree
- **Employee Provisioning:** Employees request subnames linked to the corporate domain (e.g., alice.google.eth) using ENS NameWrapper
- **Automated Payroll:** Batch USDC distribution from Arc L1 treasury vaults to all registered employee addresses
- **Sovereign Withdrawal:** Integrated LI.FI protocol for employees to "Claim & Bridge" their USDC to any supported EVM chain in a single transaction

## Run Locally

**Prerequisites:** Node.js v18.0.0 or higher

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env.local` file with:
   ```
   VITE_ARC_RPC_URL=your_arc_rpc_url
   VITE_LIFI_API_KEY=your_lifi_api_key
   VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   VITE_PAYROLL_VAULT_ADDRESS=your_contract_address
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technical Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Project Structure

```
frontend/
├── components/          # React components
│   ├── Hero.tsx        # Landing page hero section
│   ├── HowItWorks.tsx  # Workflow explanation
│   ├── Architecture.tsx # System architecture
│   └── ...
├── App.tsx             # Main app component
├── index.tsx           # Entry point
└── package.json        # Dependencies
```

## Integration Details

### Arc (Circle)
Arc serves as the primary Economic OS for the platform. Corporate treasuries are held as USDC on the Arc L1 to ensure high-fidelity settlement and regulatory-ready stablecoin infrastructure.

### ENS (Ethereum Name Service)
ENS is utilized as the core identity and routing layer. We utilize NameWrapper for subname management. Our resolution logic ensures that payroll is sent to the address currently linked to the employee's subname, allowing workers to rotate their keys without interrupting the payroll cycle.

### LI.FI
LI.FI provides the cross-chain execution layer for the employee "Exit Ramp." We integrated the LI.FI SDK to handle the bridging and swapping of USDC from the Arc L1 to the employee's destination of choice.
