'use client';
import { useState, useEffect } from 'react';
import { Button, Input } from '@worldcoin/mini-apps-ui-kit-react';
import { Contact, Message } from '@/lib/messageStore';
import { AddContact } from '@/components/AddContact';

interface MessagesProps {
  userAddress: string;
  username: string;
}

export const Messages = ({ userAddress, username }: MessagesProps) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch contacts
  useEffect(() => {
    fetchContacts();
  }, []);

  // Fetch messages when contact is selected
  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.address);
      const interval = setInterval(() => {
        fetchMessages(selectedContact.address);
      }, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [selectedContact]);

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

  const sendMessage = async () => {
    if (!selectedContact || !newMessage.trim()) return;

    setLoading(true);
    try {
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
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactAdded = (contact: Contact) => {
    setContacts([...contacts, contact]);
    setShowAddContact(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold mb-2">Messages</h1>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setShowAddContact(true)}
        >
          Add Contact
        </Button>
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
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center">No messages yet</p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg max-w-[70%] ${
                        message.fromAddress === userAddress
                          ? 'ml-auto bg-blue-500 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !newMessage.trim()}
                >
                  Send
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a contact to start messaging
            </div>
          )}
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <AddContact
          userAddress={userAddress}
          onClose={() => setShowAddContact(false)}
          onContactAdded={handleContactAdded}
        />
      )}
    </div>
  );
};