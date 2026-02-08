# Integration Guide

This document explains how Nominal integrates with Circle, ENS, and LI.FI.

## Circle Integration

Nominal uses Circle's Developer Controlled Wallets API for treasury management and payroll distribution.

### Setup

1. **Get API Credentials:**
   - Sign up at [Circle Developer Portal](https://developers.circle.com/)
   - Create an API key and entity secret
   - Create a treasury wallet

2. **Configure Environment:**
   ```env
   CIRCLE_API_KEY=your_api_key
   CIRCLE_ENTITY_SECRET=your_entity_secret
   TREASURY_WALLET_ID=your_wallet_id
   USDC_TOKEN_ID_ARC=your_usdc_token_id
   ```

3. **API Endpoints:**
   - `GET /api/payout` - Get treasury balance
   - `POST /api/payout` - Execute single payout
   - `PUT /api/payout` - Execute batch payouts

### References
- [Circle Wallets Documentation](https://developers.circle.com/wallets)
- [Circle SDKs](https://developers.circle.com/sdks)

## ENS Integration

Nominal uses ENS NameWrapper to create subnames for employees (e.g., `alice.company.eth`).

### Setup

1. **Prerequisites:**
   - Company must own a parent ENS domain (e.g., `company.eth`)
   - Parent domain must be wrapped with NameWrapper
   - Company wallet must have permissions to create subnames

2. **Configuration:**
   ```env
   NEXT_PUBLIC_ENS_NAME_WRAPPER=0x0635513f179D50A207757E05759CbD106d7dFcE8
   ```

3. **Usage:**
   The `createSubnameData` function in `lib/ens/nameWrapper.ts` prepares the transaction to create subnames.

### References
- [ENS Documentation](https://docs.ens.domains/)
- [NameWrapper Contract](https://docs.ens.domains/contract-api-reference/name-wrapper)

## LI.FI Integration

Nominal uses LI.FI Widget for employee cross-chain withdrawals.

### Setup

1. **Get API Key (Optional):**
   - Sign up at [LI.FI](https://li.fi/)
   - Get API key for higher rate limits

2. **Configuration:**
   ```env
   LI_FI_API_KEY=your_api_key
   NEXT_PUBLIC_ARC_CHAIN_ID=5042002
   NEXT_PUBLIC_USDC_ADDRESS_ARC=0x...
   ```

3. **Widget Configuration:**
   The widget is configured in `components/EmployeeWithdrawal.tsx` with:
   - Source chain: Arc
   - Source token: USDC on Arc
   - Destination: User-selected chain
   - Integrator: "Nominal-HackMoney"

### References
- [LI.FI SDK Documentation](https://docs.li.fi/sdk/overview)
- [LI.FI Widget Configuration](https://docs.li.fi/widget/configuration)

## Workflow

1. **Corporate Onboarding:**
   - Company registers ENS domain
   - Sets up Circle treasury wallet
   - Configures payroll amounts

2. **Employee Provisioning:**
   - Employee connects wallet
   - Company creates ENS subname (e.g., `alice.company.eth`)
   - Employee address is linked to subname

3. **Payroll Distribution:**
   - Company deposits USDC to Circle treasury
   - System resolves employee ENS subnames to addresses
   - Batch payout executed via Circle API

4. **Employee Withdrawal:**
   - Employee receives USDC on Arc
   - Uses LI.FI widget to bridge to preferred chain
   - Single transaction handles bridge + swap if needed
