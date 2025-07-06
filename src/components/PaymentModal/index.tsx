'use client';
import { useState } from 'react';
import { Button, Input } from '@worldcoin/mini-apps-ui-kit-react';
import { Contact } from '@/lib/messageStore';

interface PaymentModalProps {
  contact: Contact;
  onClose: () => void;
  onPay: (amount: string) => void;
}

export const PaymentModal = ({ contact, onClose, onPay }: PaymentModalProps) => {
  const [amount, setAmount] = useState('');

  const handlePay = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    onPay(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-6">Payment Details</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pay to</label>
            <p className="text-lg font-semibold">{contact.username}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Address</label>
            <p className="text-sm text-gray-600 font-mono break-all">{contact.address}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USDC)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handlePay}
            disabled={!amount || parseFloat(amount) <= 0}
            className="flex-1"
          >
            Pay
          </Button>
        </div>
      </div>
    </div>
  );
};