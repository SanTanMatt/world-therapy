// Simple in-memory message store
// In production, replace this with a proper database

export interface Message {
  id: string;
  fromAddress?: string; // Local storage format
  from_address?: string; // Supabase format
  toAddress?: string; // Local storage format
  to_address?: string; // Supabase format
  content: string;
  timestamp?: Date; // Local storage format
  created_at?: string; // Supabase format
  read: boolean;
}

export interface Contact {
  address: string;
  username: string;
  verifiedHuman: boolean;
  addedAt: Date;
}

// In-memory storage
const messages: Message[] = [];
const contacts: Map<string, Contact[]> = new Map();

// Message functions
export const sendMessage = (fromAddress: string, toAddress: string, content: string): Message => {
  const message: Message = {
    id: Date.now().toString(),
    fromAddress,
    toAddress,
    content,
    timestamp: new Date(),
    read: false,
  };
  messages.push(message);
  return message;
};

export const getMessages = (userAddress: string, contactAddress: string): Message[] => {
  return messages.filter(
    (msg) =>
      (msg.fromAddress === userAddress && msg.toAddress === contactAddress) ||
      (msg.fromAddress === contactAddress && msg.toAddress === userAddress)
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

export const markAsRead = (messageId: string): void => {
  const message = messages.find((msg) => msg.id === messageId);
  if (message) {
    message.read = true;
  }
};

// Contact functions
export const addContact = (userAddress: string, contact: Contact): void => {
  const userContacts = contacts.get(userAddress) || [];
  if (!userContacts.find((c) => c.address === contact.address)) {
    userContacts.push(contact);
    contacts.set(userAddress, userContacts);
  }
};

export const getContacts = (userAddress: string): Contact[] => {
  return contacts.get(userAddress) || [];
};

export const isContact = (userAddress: string, contactAddress: string): boolean => {
  const userContacts = contacts.get(userAddress) || [];
  return userContacts.some((c) => c.address === contactAddress);
};