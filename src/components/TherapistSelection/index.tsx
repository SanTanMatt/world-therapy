'use client';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { Contact } from '@/lib/messageStore';

interface TherapistSelectionProps {
  onClose: () => void;
  onTherapistSelected: (contact: Contact) => void;
  onManualEntry: () => void;
}

const EXISTING_THERAPISTS = [
  {
    address: '0x0000000000000000',
    username: 'Susan',
    verifiedHuman: true,
    addedAt: new Date(),
  },
  {
    address: '0x0000000123',
    username: 'Brad',
    verifiedHuman: true,
    addedAt: new Date(),
  },
];

export const TherapistSelection = ({ onClose, onTherapistSelected, onManualEntry }: TherapistSelectionProps) => {
  const handleSelectTherapist = async (therapist: Contact) => {
    // Add to contacts via API
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: therapist.address,
          username: therapist.username,
          verifiedHuman: therapist.verifiedHuman,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onTherapistSelected(data.contact);
      } else {
        console.error('Failed to add therapist');
      }
    } catch (error) {
      console.error('Error adding therapist:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Select a Therapist</h2>
        
        <div className="space-y-3 mb-6">
          {EXISTING_THERAPISTS.map((therapist) => (
            <div
              key={therapist.address}
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSelectTherapist(therapist)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{therapist.username}</h3>
                  <p className="text-sm text-gray-600">{therapist.address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-green-600">✓ Verified Human</p>
                    <p className="text-xs text-blue-600">Licensed Professional Counselor</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTherapist(therapist);
                  }}
                >
                  Select
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <Button
            variant="secondary"
            onClick={onManualEntry}
            className="w-full mb-3"
          >
            Enter Manually
          </Button>
          
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};