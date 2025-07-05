'use client';
import { useState } from 'react';
import { Button, Input, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit } from '@worldcoin/minikit-js';
import { Contact } from '@/lib/messageStore';

interface AddContactProps {
  userAddress: string;
  onClose: () => void;
  onContactAdded: (contact: Contact) => void;
}

export const AddContact = ({ userAddress, onClose, onContactAdded }: AddContactProps) => {
  const [contactAddress, setContactAddress] = useState('');
  const [username, setUsername] = useState('');
  const [verifyState, setVerifyState] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const verifyHuman = async () => {
    if (!contactAddress.trim()) {
      alert('Please enter a contact address first');
      return;
    }

    setVerifyState('pending');
    
    try {
      // Request World ID verification
      const result = await MiniKit.commandsAsync.verify({
        action: 'verify-contact',
        signal: contactAddress,
        verification_level: 'device', // Use device level for easier testing
      });

      console.log('Verification result:', result);

      if (result.finalPayload.status === 'success') {
        // Verify the proof on the server
        const response = await fetch('/api/verify-contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            proof: result.finalPayload.proof,
            merkle_root: result.finalPayload.merkle_root,
            nullifier_hash: result.finalPayload.nullifier_hash,
            signal: contactAddress,
          }),
        });

        if (response.ok) {
          setVerifyState('success');
          setIsVerified(true);
        } else {
          setVerifyState('failed');
        }
      } else {
        setVerifyState('failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerifyState('failed');
    }

    // Reset state after 3 seconds
    setTimeout(() => {
      setVerifyState('idle');
    }, 3000);
  };

  const addContact = async () => {
    if (!contactAddress.trim() || !username.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: contactAddress,
          username: username,
          verifiedHuman: isVerified,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onContactAdded(data.contact);
        onClose();
      } else {
        alert('Failed to add contact');
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Error adding contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add New Contact</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Wallet Address</label>
            <Input
              placeholder="0x..."
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input
              placeholder="Contact name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3">
              Verify this contact is a real human using World ID
            </p>
            
            <LiveFeedback
              label={{
                idle: isVerified ? 'Verified Human ✓' : 'Verify Human',
                pending: 'Verifying...',
                success: 'Verified!',
                failed: 'Verification Failed',
              }}
              state={verifyState}
              className="mb-4"
            >
              <Button
                onClick={verifyHuman}
                disabled={verifyState === 'pending' || isVerified}
                variant={isVerified ? 'secondary' : 'primary'}
                size="sm"
                className="w-full"
              >
                {isVerified ? 'Verified Human ✓' : 'Verify with World ID'}
              </Button>
            </LiveFeedback>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={addContact}
              disabled={loading || !contactAddress.trim() || !username.trim()}
              className="flex-1"
            >
              Add Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};