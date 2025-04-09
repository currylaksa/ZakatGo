import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HalfCircleBackground } from '../components';
import { HiOutlineCheckCircle, HiOutlineDocumentText, HiOutlineShare, HiOutlineArrowLeft } from 'react-icons/hi';
import { QRCodeSVG } from 'qrcode.react';

const DonationSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [donation, setDonation] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [confetti, setConfetti] = useState(true);
  
  useEffect(() => {
    // Extract donation data from route state
    if (location.state?.donation && location.state?.campaign) {
      setDonation(location.state.donation);
      setCampaign(location.state.campaign);
      setTransactionId(location.state.transactionId || 'TX12345');
      
      // Disable confetti animation after 3 seconds
      const timer = setTimeout(() => {
        setConfetti(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      // If no data, redirect back to campaigns
      navigate('/campaigns');
    }
  }, [location.state, navigate]);

  const handleShareDonation = () => {
    // In a real app, this would open a sharing dialog
    // For the hackathon, we'll just log to console
    console.log('Sharing donation:', donation);
    
    // You could use the Web Share API if supported
    if (navigator.share) {
      navigator.share({
        title: `I donated to ${campaign.title}`,
        text: `I just made a donation of ${donation.amount} ${donation.currency} to support ${campaign.purpose}. Join me in making a difference!`,
        url: `https://zakatgo.io/campaigns/${campaign.id}`
      });
    } else {
      alert('Share functionality would be implemented here');
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'zakat': return 'Zakat';
      case 'waqf': return 'Waqf';
      case 'sadaqah': return 'Sadaqah';
      default: return 'Donation';
    }
  };

  if (!donation || !campaign) {
    return (
      <HalfCircleBackground title="Loading...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </div>
      </HalfCircleBackground>
    );
  }

  return (
    <HalfCircleBackground title="Thank You!">
      <div className="pt-2 max-w-lg mx-auto w-full pb-20">
        {confetti && (
          <div className="fixed inset-0 pointer-events-none z-10">
            {/* This would be replaced with a real confetti animation component */}
            <div className="animate-confetti-1 absolute top-0 left-1/4 w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="animate-confetti-2 absolute top-0 left-1/3 w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="animate-confetti-3 absolute top-0 left-1/2 w-4 h-4 bg-green-500 rounded-full"></div>
            <div className="animate-confetti-4 absolute top-0 left-2/3 w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="animate-confetti-5 absolute top-0 left-3/4 w-2 h-2 bg-purple-500 rounded-full"></div>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <HiOutlineCheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800">Donation Successful!</h2>
            <p className="text-gray-600 mt-2">
              Your {getTypeLabel(campaign.type)} contribution has been processed successfully.
            </p>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-medium text-gray-800">{transactionId}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium text-gray-800">{donation.amount} {donation.currency}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium text-gray-800">{new Date().toLocaleDateString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Campaign:</span>
                <span className="font-medium text-gray-800">{campaign.title}</span>
              </div>
              
              {donation.recurring && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Recurring:</span>
                  <span className="font-medium text-green-600">Monthly</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 mb-2">Verify on Blockchain</p>
              <div className="flex justify-center">
                <QRCodeSVG 
                  value={`https://etherscan.io/tx/${transactionId}`} 
                  size={120}
                  includeMargin={true}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Scan to view your transaction on the blockchain
              </p>
            </div>
          </div>
        </div>
        
        {/* Social Impact Message */}
        <div className="bg-green-50 rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-md font-semibold text-green-800 mb-2">Your Impact</h3>
          <p className="text-sm text-green-700">
            {campaign.type === 'zakat' && 'Your Zakat contribution helps fulfill your religious obligation and supports those in need.'}
            {campaign.type === 'waqf' && 'Your Waqf contribution creates a sustainable charitable endowment that will benefit many for generations.'}
            {campaign.type === 'sadaqah' && 'Your Sadaqah provides immediate support to those facing hardship and crisis.'}
          </p>
          <p className="text-sm text-green-700 mt-2">
            You can track exactly how your donation is being used through our transparency dashboard.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/campaigns')}
            className="flex-1 flex items-center justify-center bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-xl border border-gray-200 transition-colors"
          >
            <HiOutlineArrowLeft className="mr-2" />
            Back to Campaigns
          </button>
          
          <button
            onClick={handleShareDonation}
            className="flex-1 flex items-center justify-center bg-secondary hover:bg-secondaryLight text-white font-medium py-3 px-4 rounded-xl transition-colors"
          >
            <HiOutlineShare className="mr-2" />
            Share
          </button>
        </div>
        
        {/* Receipt Link */}
        <div className="mt-4 flex justify-center">
          <button className="flex items-center text-secondary hover:text-secondaryLight transition-colors">
            <HiOutlineDocumentText className="mr-1" />
            <span className="text-sm">Download Receipt</span>
          </button>
        </div>
      </div>
    </HalfCircleBackground>
  );
};

export default DonationSuccessPage;