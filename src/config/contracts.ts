// Contract addresses for different networks
// You'll need to deploy the Messaging contract and update these addresses

export const CONTRACTS = {
  // World Chain Mainnet - GAS FREE for verified humans!
  worldchainMainnet: {
    messaging: '0x0000000000000000000000000000000000000000', // TODO: Deploy and update
    chainId: 480,
    rpcUrl: 'https://worldchain-mainnet.g.alchemy.com/public', // Public RPC
    blockExplorer: 'https://worldchain-mainnet.explorer.alchemy.com',
    name: 'World Chain',
  },
  // World Chain Testnet (Sepolia)
  worldchainTestnet: {
    messaging: '0x0000000000000000000000000000000000000000', // TODO: Deploy and update
    chainId: 11155420,
    rpcUrl: 'https://worldchain-sepolia.g.alchemy.com/public',
    blockExplorer: 'https://worldchain-sepolia.explorer.alchemy.com',
    name: 'World Chain Sepolia',
  },
};

// Use World Chain mainnet for gas-free transactions!
export const CURRENT_NETWORK = CONTRACTS.worldchainMainnet;