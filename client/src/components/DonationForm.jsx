import React, { useState } from 'react';
import { HiOutlineGift } from 'react-icons/hi';

const DonationForm = ({ campaignType, onSubmit, initialAmount = '' }) => {
  const [amount, setAmount] = useState(initialAmount);
  const [currency, setCurrency] = useState('MYR');
  const [donorName, setDonorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [recurring, setRecurring] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      amount,
      currency,
      donorName: isAnonymous ? '' : donorName,
      isAnonymous,
      message,
      recurring: campaignType !== 'sadaqah' ? recurring : false
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Donation Amount</label>
          <div className="flex">
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                    {currency === 'MYR' ? 'RM' : currency === 'ETH' ? 'Ξ' : '$'}
                  </span>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  id="donationAmount"
                  className="focus:ring-secondary focus:border-secondary block w-full pl-10 pr-12 py-3 border-gray-300 rounded-md"
                  placeholder="0.00"
                  step="0.01"
                  min="1"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="focus:ring-secondary focus:border-secondary h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 rounded-md"
                  >
                    <option value="MYR">MYR</option>
                    <option value="ETH">ETH</option>
                    <option value="USDT">USDT</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input
            type="text"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            className="focus:ring-secondary focus:border-secondary block w-full py-3 px-4 border-gray-300 rounded-md"
            placeholder="Your name (optional)"
            disabled={isAnonymous}
          />
          <div className="mt-2 flex items-center">
            <input
              id="isAnonymous"
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
            />
            <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-600">
              Donate anonymously
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="focus:ring-secondary focus:border-secondary block w-full py-3 px-4 border-gray-300 rounded-md"
            placeholder="Add a message with your donation"
          />
        </div>
        
        {campaignType !== 'sadaqah' && (
          <div className="flex items-center">
            <input
              id="recurring"
              type="checkbox"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
              className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
            />
            <label htmlFor="recurring" className="ml-2 block text-sm text-gray-600">
              Make this a recurring donation (monthly)
            </label>
          </div>
        )}
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-secondary hover:bg-secondaryLight text-white font-medium py-3 px-4 rounded-full transition-colors"
          >
            <HiOutlineGift className="mr-2" />
            Complete Donation
          </button>
        </div>
      </div>
    </form>
  );
};

export default DonationForm;