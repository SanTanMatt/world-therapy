# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Worldcoin Mini App - a Next.js application designed to run within the World App ecosystem. It integrates with Worldcoin's identity verification (World ID) and payment infrastructure.

## Key Commands

```bash
# Development
npm run dev          # Start development server on http://localhost:3000

# Production
npm run build        # Create production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Architecture

### Tech Stack
- **Next.js 15.2.3** with App Router
- **TypeScript** with strict mode
- **Tailwind CSS v4** for styling
- **NextAuth v5** for authentication
- **Worldcoin SDKs** for World App integration

### Directory Structure
- `/src/app/` - Next.js App Router pages and API routes
  - `(protected)/` - Authenticated routes requiring wallet connection
  - `api/` - Backend endpoints for auth, payments, and verification
- `/src/components/` - React components organized by feature
- `/src/auth/` - Authentication logic and wallet integration
- `/src/providers/` - React context providers for app-wide state

### Authentication Flow
1. User connects via World App wallet
2. App generates nonce and requests signature
3. Signature verified server-side
4. JWT session created with wallet address and World App user data

### World ID Integration
The app supports two verification levels:
- **Device Level**: Basic verification using device attestation
- **Orb Level**: Enhanced verification requiring iris scan

Verification happens through:
1. Client requests proof via MiniKit
2. Proof sent to `/api/verify-proof`
3. Server validates with Worldcoin Developer Portal

### Payment System
Payments use Worldcoin's MiniKit payment flow:
1. Frontend calls `/api/initiate-payment` to get payment ID
2. MiniKit handles payment UI and processing
3. Transaction status tracked via blockchain

## Development Notes

### Testing with World App
1. Start dev server: `npm run dev`
2. Use ngrok to expose local server: `ngrok http 3000`
3. Access via World App using the ngrok URL

### Environment Variables
Required in `.env.local`:
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - Session encryption key
- `WALLET_DOMAIN` - Authentication domain

### Key Integration Points
- **MiniKitProvider**: Wraps app to enable World App features
- **useReactMiniKit()**: Hook for accessing MiniKit functionality
- **Worldcoin UI Kit**: Pre-styled components matching World App design

### Smart Contract Integration
- Contract ABI in `/src/abi/TestContract.json`
- Uses viem for blockchain interactions
- Deployment on Worldcoin testnet