# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Building and Development
- `npm run build` - Build all packages using Lerna
- `npm run build:connect` - Build only the @stacks/connect package  
- `npm run build:connect-ui` - Build only the @stacks/connect-ui package
- `npm run typecheck` - Run TypeScript type checking across all packages in parallel
- `npm run types` - Generate TypeScript declaration files
- `npm run types:connect` - Generate types for @stacks/connect only
- `npm run types:connect-react` - Generate types for @stacks/connect-react only

### Testing
- `npm test` in `/packages/connect` - Run Vitest tests for the connect package
- `npm run test:watch` in `/packages/connect` - Run tests in watch mode
- `npm run test:coverage` in `/packages/connect` - Run tests with coverage report

### Linting and Code Quality
- `npm run lint` - Run both ESLint and Prettier checks
- `npm run lint:eslint` - Run ESLint on TypeScript/TSX files
- `npm run lint:eslint:fix` - Fix ESLint issues automatically
- `npm run lint:prettier` - Check Prettier formatting
- `npm run lint:prettier:fix` - Fix Prettier formatting issues

### Documentation and Storybook
- `npm run build:docs` - Generate TypeDoc documentation
- `npm run storybook` in `/packages/connect` - Start Storybook development server
- `npm run build-storybook` in `/packages/connect` - Build Storybook for production

### Package Development
- `npm run dev` in individual packages - Watch mode for development
- `npm start` in `/packages/connect-ui` - Start Stencil dev server with live reload

## Architecture Overview

This is a monorepo managed by Lerna containing three main packages:

### @stacks/connect (Core Package)
The primary library for Stacks wallet integration. Key modules:
- **Auth**: Authentication flow with Stacks wallets (`src/auth.ts`)
- **Providers**: Wallet provider management and discovery (`src/providers.ts`)
- **Transactions**: STX transfers, contract calls, and contract deployment (`src/transactions/`)
- **Signature**: Message signing functionality (`src/signature/`)
- **Bitcoin**: Bitcoin/PSBT transaction support (`src/bitcoin/`)
- **Request**: Core wallet communication layer (`src/request.ts`)
- **Methods**: JSON-RPC method definitions and types (`src/methods.ts`)
- **UI**: Legacy UI wrappers for backward compatibility (`src/ui.ts`)

### @stacks/connect-ui (Web Components)
Stencil-based web components for wallet selection modals:
- Built with Stencil framework and TailwindCSS
- Provides `connect-modal` component for wallet selection
- Exports provider management utilities
- Generates both ES modules and CommonJS builds

### @stacks/connect-react (React Wrapper)
React-specific hooks and components (currently deprecated in README):
- React hooks for wallet integration
- Context providers for app-wide wallet state
- Built with tsup for optimized bundling

## Key Development Patterns

### Wallet Provider System
- Wallets implement the WebBTCProvider interface
- Providers are registered globally on `window.wbip_providers`
- Core providers include Leather, Xverse, Asigna, and Fordefi
- Provider selection is handled by the connect-ui modal

### JSON-RPC Communication
- All wallet communication uses JSON-RPC 2.0 protocol
- Method definitions in `src/methods.ts` define the API surface
- Supports both Stacks methods (`stx_*`) and Bitcoin methods (`signPsbt`, etc.)

### Legacy Compatibility
- Maintains backward compatibility through `src/ui.ts` wrapper functions
- Legacy functions like `showConnect`, `showSTXTransfer` wrap new request system
- Option/response mapping maintains API compatibility

### Build System
- Uses tsup for efficient bundling with multiple output formats
- Supports both ES modules and CommonJS
- Individual package builds are optimized for tree-shaking
- Stencil generates web component builds for connect-ui

## Testing Strategy
- Vitest for unit testing in the connect package
- TypeScript strict mode with comprehensive type checking
- ESLint with @stacks/eslint-config and additional Stencil/React rules
- Storybook for component development and testing

## Dependencies and Ecosystem
- Built on @stacks/* ecosystem packages (network, transactions, profile)
- Supports both v6 and v7 of @stacks/transactions for compatibility
- Uses Stencil for cross-framework web component generation
- TailwindCSS for styling in connect-ui package