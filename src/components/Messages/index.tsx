'use client';
import { useState, useEffect } from 'react';
import { Button, Input, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { Contact, Message } from '@/lib/messageStore';
import { AddContact } from '@/components/AddContact';
import { TherapistSelection } from '@/components/TherapistSelection';
import { PaymentModal } from '@/components/PaymentModal';
import { sendBlockchainMessage, getBlockchainConversation, BlockchainMessage } from '@/services/blockchain';
import { CURRENT_NETWORK } from '@/config/contracts';

interface MessagesProps {
  userAddress: string;
  username: string;
}

export const Messages = ({ userAddress, username }: MessagesProps) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [blockchainMessages, setBlockchainMessages] = useState<BlockchainMessage[]>([]);
  const [useBlockchain, setUseBlockchain] = useState(false); // Default to database
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co';
  const [newMessage, setNewMessage] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [showTherapistSelection, setShowTherapistSelection] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch contacts
  useEffect(() => {
    fetchContacts();
  }, []);

  // Fetch messages when contact is selected
  useEffect(() => {
    if (selectedContact) {
      if (useBlockchain && CURRENT_NETWORK.messaging !== '0x0000000000000000000000000000000000000000') {
        fetchBlockchainMessages(selectedContact.address);
        const interval = setInterval(() => {
          fetchBlockchainMessages(selectedContact.address);
        }, 10000); // Poll every 10 seconds (blockchain is slower)
        return () => clearInterval(interval);
      } else {
        fetchMessages(selectedContact.address);
        const interval = setInterval(() => {
          fetchMessages(selectedContact.address);
        }, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
      }
    }
  }, [selectedContact, useBlockchain]);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchMessages = async (contactAddress: string) => {
    try {
      const response = await fetch(`/api/messages?contact=${contactAddress}`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchBlockchainMessages = async (contactAddress: string) => {
    try {
      const messages = await getBlockchainConversation(contactAddress);
      setBlockchainMessages(messages);
    } catch (error) {
      console.error('Error fetching blockchain messages:', error);
      // Fallback to local messages
      setUseBlockchain(false);
    }
  };

  const sendMessage = async () => {
    if (!selectedContact || !newMessage.trim()) return;

    setLoading(true);
    setTxStatus('pending');
    
    try {
      if (useBlockchain && CURRENT_NETWORK.messaging !== '0x0000000000000000000000000000000000000000') {
        // Send on blockchain
        const txHash = await sendBlockchainMessage(selectedContact.address, newMessage);
        console.log('Message sent on blockchain:', txHash);
        setTxStatus('success');
        setNewMessage('');
        
        // Wait a bit for blockchain to update
        setTimeout(() => {
          fetchBlockchainMessages(selectedContact.address);
        }, 2000);
      } else {
        // Fallback to API
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toAddress: selectedContact.address,
            content: newMessage,
          }),
        });

        if (response.ok) {
          setNewMessage('');
          fetchMessages(selectedContact.address);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setTxStatus('error');
    } finally {
      setLoading(false);
      setTimeout(() => setTxStatus('idle'), 3000);
    }
  };

  const handleContactAdded = (contact: Contact) => {
    setContacts([...contacts, contact]);
    setShowAddContact(false);
  };

  const handleTherapistSelected = (contact: Contact) => {
    setContacts([...contacts, contact]);
    setShowTherapistSelection(false);
    setSelectedContact(contact);
  };

  const handleManualEntry = () => {
    setShowTherapistSelection(false);
    setShowAddContact(true);
  };

  const handlePayment = async (amount: string) => {
    // TODO: Implement actual payment logic
    console.log(`Payment of ${amount} USDC to ${selectedContact?.username}`);
    alert(`Payment of ${amount} USDC to ${selectedContact?.username} initiated!`);
    setShowPaymentModal(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="text-xs text-gray-500 mt-1">
              {isSupabaseConfigured 
                ? '🟢 Using Supabase Database' 
                : useBlockchain && CURRENT_NETWORK.messaging !== '0x0000000000000000000000000000000000000000'
                  ? '⛓️ Using World Chain (Gas Free!)'
                  : '💾 Using Local Storage'}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowTherapistSelection(true)}
            >
              Find Therapist
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                if (!selectedContact) {
                  alert('Please select a therapist first');
                  return;
                }
                setShowPaymentModal(true);
              }}
            >
              Pay
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Contacts List */}
        <div className="w-1/3 border-r overflow-y-auto">
          {contacts.length === 0 ? (
            <p className="p-4 text-gray-500">No contacts yet</p>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.address}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedContact?.address === contact.address ? 'bg-gray-100' : ''
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <p className="font-semibold">{contact.username}</p>
                <p className="text-sm text-gray-500 truncate">{contact.address}</p>
                {contact.verifiedHuman && (
                  <p className="text-xs text-green-600 mt-1">✓ Verified Human</p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Contact Header */}
              <div className="p-4 border-b">
                <h2 className="font-semibold">{selectedContact.username}</h2>
                <p className="text-sm text-gray-500">{selectedContact.address}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {useBlockchain && CURRENT_NETWORK.messaging !== '0x0000000000000000000000000000000000000000' ? (
                  <>
                    {blockchainMessages.length === 0 ? (
                      <div className="text-center">
                        <p className="text-gray-500">No blockchain messages yet</p>
                        {CURRENT_NETWORK.messaging === '0x0000000000000000000000000000000000000000' && (
                          <p className="text-xs text-orange-600 mt-2">
                            Contract not deployed. Messages are local only.
                          </p>
                        )}
                      </div>
                    ) : (
                      blockchainMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg max-w-[70%] ${
                            message.from.toLowerCase() === userAddress.toLowerCase()
                              ? 'ml-auto bg-blue-500 text-white'
                              : 'bg-gray-200'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(Number(message.timestamp) * 1000).toLocaleTimeString()}
                          </p>
                          <p className="text-xs opacity-50">On-chain (Gas Free!)</p>
                        </div>
                      ))
                    )}
                  </>
                ) : (
                  <>
                    {messages.length === 0 ? (
                      <p className="text-gray-500 text-center">No messages yet</p>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 rounded-lg max-w-[70%] ${
                            (message.fromAddress || message.from_address) === userAddress
                              ? 'ml-auto bg-blue-500 text-white'
                              : 'bg-gray-200'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.timestamp || message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <LiveFeedback
                    label={{
                      idle: 'Send',
                      pending: 'Sending...',
                      success: 'Sent!',
                      error: 'Failed',
                    }}
                    state={txStatus}
                  >
                    <Button
                      onClick={sendMessage}
                      disabled={loading || !newMessage.trim()}
                    >
                      Send
                    </Button>
                  </LiveFeedback>
                </div>
                {useBlockchain && CURRENT_NETWORK.messaging === '0x0000000000000000000000000000000000000000' && (
                  <p className="text-xs text-orange-600 mt-2">
                    ⚠️ Contract not deployed on World Chain. Using local storage.
                    <br />
                    <span className="text-green-600">Deploy to World Chain mainnet for FREE gas!</span>
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a contact to start messaging
            </div>
          )}
        </div>
      </div>

      {/* Therapist Selection Modal */}
      {showTherapistSelection && (
        <TherapistSelection
          onClose={() => setShowTherapistSelection(false)}
          onTherapistSelected={handleTherapistSelected}
          onManualEntry={handleManualEntry}
        />
      )}

      {/* Add Contact Modal */}
      {showAddContact && (
        <AddContact
          userAddress={userAddress}
          onClose={() => setShowAddContact(false)}
          onContactAdded={handleContactAdded}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedContact && (
        <PaymentModal
          contact={selectedContact}
          onClose={() => setShowPaymentModal(false)}
          onPay={handlePayment}
        />
      )}
    </div>
  );
};