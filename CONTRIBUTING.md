# Contributing to Nominal

Thank you for your interest in contributing to Nominal!

## Development Workflow

1. **Fork the repository** and create a feature branch
2. **Make your changes** following the code style
3. **Test your changes:**
   ```bash
   npm run type-check
   npm run lint
   forge test
   ```
4. **Commit your changes** with clear commit messages
5. **Push to your fork** and create a pull request

## Code Style

- Use TypeScript for all new code
- Follow the existing code structure
- Add comments for complex logic
- Write tests for smart contracts

## Smart Contract Development

- All contracts should be in `contracts/`
- Tests should be in `test/`
- Use OpenZeppelin contracts when possible
- Follow Solidity style guide

## Frontend Development

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Keep components modular and reusable
