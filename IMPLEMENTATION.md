# ENS & Arc Implementation Summary

This document describes the complete implementation of the ENS domain registration and Arc treasury payroll system.

## Architecture Overview

### Employer Flow
1. **Register ENS Domain** → `CompanyRegistration` component
2. **Fund Arc Treasury** → `TreasuryFunding` component  
3. **View Dashboard** → `EmployerDashboard` component
4. **Execute Payroll** → API route that distributes funds to employees

### Employee Flow
1. **Register Sub-ENS** → `EmployeeRegistration` component
2. **View Balance** → Employee dashboard
3. **Withdraw via LiFi** → `WithdrawalWidget` component

## Key Components

### Client-Side Components

#### `CompanyRegistration.tsx`
- 4-step flow: Commit → Wait → Register → Wrap
- Generates random secret for commit/reveal pattern
- Saves registration data to localStorage
- Registers company in system after wrapping
- Integrates with ENS ETH Registrar Controller on Sepolia

#### `TreasuryFunding.tsx`
- Approves USDC on Arc network
- Deposits USDC to PayrollVault contract
- Shows balance and approval status
- Registers treasury address with company

#### `EmployerDashboard.tsx`
- Displays all registered employees
- Shows employee sub-ENS names
- Resolves sub-ENS to addresses
- Execute payroll button
- Shows treasury information

#### `EmployeeRegistration.tsx`
- Form for employee to register sub-ENS
- Collects name, email, and wallet address
- Issues sub-ENS via server-side API
- Registers employee in system

#### `WithdrawalWidget.tsx`
- LiFi widget integration
- Allows bridging USDC from Arc to other chains
- Supports swapping to other tokens

### Server-Side API Routes

#### `/api/employer/register-company`
- Registers a company in the system
- Stores company ENS name and owner address

#### `/api/employer/fund-treasury`
- Funds the Arc treasury vault
- Uses admin private key to sign transactions
- Updates company with treasury address

#### `/api/employer/employees`
- Returns all employees for a company
- Includes employee details and sub-ENS names

#### `/api/employee/register`
- Registers an employee in the system
- Validates company exists
- Creates employee record with sub-ENS

#### `/api/issue-subname`
- Issues sub-ENS domain via NameWrapper
- Uses admin private key to sign transactions
- Sets owner to employee address
- Sets resolver to Public Resolver

#### `/api/payroll/execute`
- Executes batch payroll distribution
- Gets all employees for company
- Distributes USDC from treasury to employee addresses
- Uses batchDistribute on PayrollVault contract

### Storage Layer

#### `lib/storage/employees.ts`
- In-memory storage for companies and employees
- Functions: `getCompany`, `createCompany`, `addEmployee`, etc.
- **Note**: Replace with database in production

## Data Flow

### Employer Registration
```
1. User connects wallet
2. Enters domain name → CompanyRegistration
3. Commits registration (saves secret to localStorage)
4. Waits 60 seconds
5. Registers domain with ETH
6. Wraps domain for subname support
7. Company registered in system
8. Company ENS stored in localStorage
```

### Treasury Funding
```
1. Employer switches to Arc network
2. Enters USDC amount → TreasuryFunding
3. Approves USDC spending
4. Deposits to PayrollVault
5. Treasury address saved to company
```

### Employee Registration
```
1. Employee connects wallet
2. Enters username/label → EmployeeRegistration
3. Fills optional name/email
4. Registers in system (API)
5. Sub-ENS issued via API (server signs)
6. Employee record created
```

### Payroll Execution
```
1. Employer clicks "Execute Payroll"
2. API fetches all employees for company
3. Gets treasury balance
4. Calculates equal split (or uses custom amounts)
5. Calls batchDistribute on PayrollVault
6. Funds sent to employee wallet addresses
```

### Employee Withdrawal
```
1. Employee receives USDC on Arc
2. Opens WithdrawalWidget
3. Selects destination chain/token
4. LiFi handles bridge/swap
5. Funds arrive at destination
```

## Configuration

### Environment Variables
- `ADMIN_PRIVATE_KEY` - Private key for server-side transactions
- `NEXT_PUBLIC_ARC_RPC_URL` - Arc network RPC endpoint
- `NEXT_PUBLIC_ENS_CHAIN_ID` - Sepolia chain ID (11155111)
- `NEXT_PUBLIC_LI_FI_API_KEY` - LiFi API key (optional)

### Contract Addresses
- `ENS_ETH_REGISTRAR_CONTROLLER` - 0x59E16fcCd424Cc24e280Be16E11Bcd56fb0CE547 (Sepolia)
- `ENS_NAME_WRAPPER` - 0x0635513f179D50A207757E05759CbD106d7dFcE8 (Sepolia)
- `ENS_PUBLIC_RESOLVER` - 0x8FADE66B79cC9f707fB2676E1B5100b901e3601d (Sepolia)
- `PAYROLL_VAULT_ADDRESS` - Set after deployment
- `ARC_USDC_ADDRESS` - 0x3600000000000000000000000000000000000000 (Arc Testnet)

## Pages

- `/employer/dashboard` - Employer registration and dashboard
- `/employee/register` - Employee sub-ENS registration
- `/employee` - Employee dashboard with balance and withdrawal

## Next Steps for Production

1. **Replace in-memory storage** with a proper database (PostgreSQL, MongoDB, etc.)
2. **Add authentication** - Verify wallet signatures for API calls
3. **Add company selection** - Allow employees to choose which company to register with
4. **Improve ENS resolution** - Properly resolve sub-ENS names on Sepolia
5. **Add error handling** - Better error messages and retry logic
6. **Add transaction history** - Track all payroll executions
7. **Add role-based access** - Verify employer owns the company ENS domain
8. **Add amount configuration** - Allow employers to set custom amounts per employee
