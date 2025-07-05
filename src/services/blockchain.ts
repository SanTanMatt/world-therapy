import { createPublicClient, createWalletClient, custom, http, parseAbi, defineChain } from 'viem';
import MessagingABI from '@/abi/Messaging.json';
import { CURRENT_NETWORK } from '@/config/contracts';
import { MiniKit } from '@worldcoin/minikit-js';

// Define World Chain
const worldChain = defineChain({
  id: CURRENT_NETWORK.chainId,
  name: CURRENT_NETWORK.name,
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: [CURRENT_NETWORK.rpcUrl] },
    public: { http: [CURRENT_NETWORK.rpcUrl] },
  },
  blockExplorers: {
    default: { name: 'World Chain Explorer', url: CURRENT_NETWORK.blockExplorer },
  },
});

// Create public client for reading from blockchain
export const publicClient = createPublicClient({
  chain: worldChain,
  transport: http(CURRENT_NETWORK.rpcUrl),
});

// Create wallet client for writing to blockchain
export const getWalletClient = () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No wallet found');
  }

  return createWalletClient({
    chain: worldChain,
    transport: custom(window.ethereum),
  });
};

// Message type matching the smart contract
export interface BlockchainMessage {
  from: string;
  to: string;
  content: string;
  timestamp: bigint;
  read: boolean;
}

// Send a message on blockchain
export async function sendBlockchainMessage(to: string, content: string) {
  try {
    // Use MiniKit to send transaction
    const result = await MiniKit.commandsAsync.sendTransaction({
      transaction: {
        address: CURRENT_NETWORK.messaging as `0x${string}`,
        abi: MessagingABI.abi,
        functionName: 'sendMessage',
        args: [to, content],
      },
    });

    if (result.finalPayload.status === 'success') {
      return result.finalPayload.transactionHash;
    } else {
      throw new Error('Transaction failed');
    }
  } catch (error) {
    console.error('Error sending blockchain message:', error);
    throw error;
  }
}

// Get conversation with another address
export async function getBlockchainConversation(otherAddress: string): Promise<BlockchainMessage[]> {
  try {
    const data = await publicClient.readContract({
      address: CURRENT_NETWORK.messaging as `0x${string}`,
      abi: MessagingABI.abi,
      functionName: 'getConversation',
      args: [otherAddress],
    });

    return data as BlockchainMessage[];
  } catch (error) {
    console.error('Error fetching blockchain messages:', error);
    return [];
  }
}

// Get all messages for current user
export async function getMyBlockchainMessages(): Promise<BlockchainMessage[]> {
  try {
    const data = await publicClient.readContract({
      address: CURRENT_NETWORK.messaging as `0x${string}`,
      abi: MessagingABI.abi,
      functionName: 'getMyMessages',
    });

    return data as BlockchainMessage[];
  } catch (error) {
    console.error('Error fetching my messages:', error);
    return [];
  }
}

// Get unread message count
export async function getUnreadCount(): Promise<number> {
  try {
    const count = await publicClient.readContract({
      address: CURRENT_NETWORK.messaging as `0x${string}`,
      abi: MessagingABI.abi,
      functionName: 'getUnreadCount',
    });

    return Number(count);
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
}

// Mark message as read
export async function markMessageAsRead(messageIndex: number) {
  try {
    const result = await MiniKit.commandsAsync.sendTransaction({
      transaction: {
        address: CURRENT_NETWORK.messaging as `0x${string}`,
        abi: MessagingABI.abi,
        functionName: 'markAsRead',
        args: [BigInt(messageIndex)],
      },
    });

    return result.finalPayload.status === 'success';
  } catch (error) {
    console.error('Error marking message as read:', error);
    return false;
  }
}