# Deploying the Messaging Smart Contract on World Chain

## About World Chain Gas-Free Transactions
World Chain provides **FREE GAS** for verified humans! This means:
- ✅ No ETH needed for gas fees
- ✅ Verified World ID holders get priority blockspace
- ✅ Instant transactions for real humans
- ✅ Bot and power user fees subsidize human usage

## Prerequisites
1. Install Foundry (for contract deployment): https://getfoundry.sh/
2. Have a World App account with verified World ID
3. Small amount of ETH for initial deployment (you can get from another user)

## Steps to Deploy

### 1. Set up environment
```bash
export PRIVATE_KEY="your_wallet_private_key"
```

### 2. Deploy to World Chain Mainnet (Gas-Free!)
```bash
forge create --rpc-url https://worldchain-mainnet.g.alchemy.com/public \
  --private-key $PRIVATE_KEY \
  --etherscan-api-key "verifier" \
  --verify \
  contracts/Messaging.sol:Messaging
```

### 3. Update contract address
After deployment, update the contract address in `/src/config/contracts.ts`:

```typescript
worldchainMainnet: {
  messaging: '0xYOUR_DEPLOYED_CONTRACT_ADDRESS',
  // ... rest of config
}
```

### 4. Alternative: Use Remix
1. Go to https://remix.ethereum.org/
2. Create new file `Messaging.sol` and paste the contract code
3. Compile with Solidity 0.8.19
4. Deploy using Injected Provider (World App)
5. Add World Chain to your wallet:
   - Network Name: World Chain
   - Chain ID: 480
   - RPC URL: https://worldchain-mainnet.g.alchemy.com/public
   - Currency Symbol: ETH
   - Block Explorer: https://worldchain-mainnet.explorer.alchemy.com
6. Deploy and copy the contract address

## Using the Contract (Gas-Free!)
Once deployed on World Chain mainnet:
1. **Verified humans get FREE transactions** - no gas fees!
2. Messages are permanently stored on-chain
3. Anyone with the contract address can participate
4. Reading messages is always free

## How Gas-Free Works
- World Chain prioritizes transactions from verified humans
- The World Foundation initially sponsors gas fees
- Eventually, bot and power user fees will subsidize human usage
- You can also pay fees with WLD tokens if needed

## View Your Contract
Check your deployed contract at:
https://worldchain-mainnet.explorer.alchemy.com/address/YOUR_CONTRACT_ADDRESS