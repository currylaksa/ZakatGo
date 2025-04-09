import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { TransactionContext } from '../context/TransactionContext';
import { HalfCircleBackground } from '../components';
import { HiOutlineCalculator, HiOutlineCheckCircle, HiOutlineCurrencyDollar, HiOutlineUser, HiOutlineHeart, HiOutlineGift } from 'react-icons/hi';

const DonationFormPage = () => {
  const { currentAccount, connectWallet } = useContext(TransactionContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showZakatCalculator, setShowZakatCalculator] = useState(false);

  useEffect(() => {
    if (location.state?.campaign) {
      setCampaign(location.state.campaign);
      setIsLoading(false);
    } else if (id) {
      setTimeout(() => {
        const mockCampaign = {
          id: id,
          title: 'Education for Asnaf Children',
          type: 'zakat',
          organizer: '0x7e...1A3b',
          startDate: 'Mar 19, 2024',
          targetAmount: '150,000',
          raisedAmount: '42,500',
          purpose: 'Educational support for underprivileged children',
          region: 'Selangor',
          status: 'active',
          endDate: 'Jun 19, 2024'
        };

        setCampaign(mockCampaign);
        setIsLoading(false);
      }, 800);
    }
  }, [id, location.state]);

  const handleDonationSubmit = (donationData) => {
    console.log('Processing donation:', donationData);

    setTimeout(() => {
      navigate('/donation-success', {
        state: {
          donation: donationData,
          campaign: campaign,
          transactionId: `TX${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        }
      });
    }, 1500);
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'zakat': return 'Zakat';
      case 'waqf': return 'Waqf';
      case 'sadaqah': return 'Sadaqah';
      default: return 'Donation';
    }
  };

  const toggleZakatCalculator = () => {
    setShowZakatCalculator(!showZakatCalculator);
  };

  const ZakatCalculator = () => {
    const [zakatableAssets, setZakatableAssets] = useState({
      cash: '', gold: '', silver: '', investments: '', businessAssets: ''
    });
    const [calculatedZakat, setCalculatedZakat] = useState(0);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setZakatableAssets(prev => ({ ...prev, [name]: value }));
    };

    const calculateZakat = () => {
      const total = Object.values(zakatableAssets).reduce(
        (sum, value) => sum + (parseFloat(value) || 0), 0
      );
      const nisabThreshold = 21000;
      setCalculatedZakat(total >= nisabThreshold ? (total * 0.025).toFixed(2) : 0);
    };

    const applyZakat = () => {
      if (calculatedZakat > 0) {
        document.getElementById('donationAmount').value = calculatedZakat;
        toggleZakatCalculator();
      }
    };

    return (
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <HiOutlineCalculator className="mr-2 text-secondary" /> Zakat Calculator
          </h3>
          <button onClick={toggleZakatCalculator} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">Enter the value of your assets to calculate your Zakat. Nisab: RM 21,000</p>
        {['cash', 'gold', 'silver', 'investments', 'businessAssets'].map((asset, idx) => (
          <div key={idx} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{asset.replace(/([A-Z])/g, ' $1')}</label>
            <input type="number" name={asset} value={zakatableAssets[asset]} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="0.00" />
          </div>
        ))}
        <div className="mt-6 flex space-x-3">
          <button onClick={calculateZakat} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md">Calculate</button>
          <button onClick={applyZakat} disabled={calculatedZakat <= 0} className={`flex-1 ${calculatedZakat > 0 ? 'bg-secondary hover:bg-secondaryLight text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} py-2 px-4 rounded-md`}>
            Apply Amount
          </button>
        </div>
        {calculatedZakat > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-green-800">Your Zakat:</span>
              <span className="font-bold text-lg text-green-800">RM {calculatedZakat}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <HalfCircleBackground title="Loading...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </div>
      </HalfCircleBackground>
    );
  }

  if (!campaign) {
    return (
      <HalfCircleBackground title="Campaign Not Found">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-white text-opacity-80 mb-4">We couldn't find the campaign you're looking for.</p>
          <button onClick={() => navigate('/campaigns')} className="bg-white text-secondary font-medium px-6 py-2 rounded-full hover:bg-gray-100">Back to Campaigns</button>
        </div>
      </HalfCircleBackground>
    );
  }

  return (
    <HalfCircleBackground title={`Donate to ${campaign.title}`}>
      <div className="pt-2 max-w-lg mx-auto w-full pb-20">
        <p className="text-white text-opacity-80 mb-6">You're making a {getTypeLabel(campaign.type)} donation to support {campaign.purpose}.</p>
        {!currentAccount ? (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 text-center">
            <p className="mb-4">Connect your wallet to start donating</p>
            <button onClick={connectWallet} className="flex flex-row justify-center rounded-full items-center bg-secondary p-3 cursor-pointer hover:bg-secondaryLight">
              <p className="text-white text-base font-semibold">Connect Wallet</p>
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-xs px-2 py-0.5 rounded-full text-white ${campaign.type === 'zakat' ? 'bg-green-500' : campaign.type === 'waqf' ? 'bg-blue-500' : 'bg-purple-500'}`}>{getTypeLabel(campaign.type)}</span>
                  <h3 className="text-lg font-semibold mt-2">{campaign.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{campaign.purpose}</p>
                </div>
                {campaign.type === 'zakat' && (
                  <button onClick={toggleZakatCalculator} className="flex items-center text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium hover:bg-green-200">
                    <HiOutlineCalculator className="mr-1" /> Zakat Calculator
                  </button>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Campaign Progress</span>
                  <span>RM {campaign.raisedAmount} / RM {campaign.targetAmount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${campaign.type === 'zakat' ? 'bg-green-500' : campaign.type === 'waqf' ? 'bg-blue-500' : 'bg-purple-500'}`} style={{ width: `${(parseInt(campaign.raisedAmount.replace(/,/g, '')) / parseInt(campaign.targetAmount.replace(/,/g, ''))) * 100}%` }}></div>
                </div>
              </div>
            </div>
            {showZakatCalculator && campaign.type === 'zakat' && <ZakatCalculator />}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <HiOutlineHeart className="mr-2 text-secondary" /> Make Your Donation
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const donationData = {
                  campaignId: campaign.id,
                  amount: formData.get('amount'),
                  currency: formData.get('currency'),
                  donorName: formData.get('donorName') || 'Anonymous',
                  isAnonymous: formData.get('isAnonymous') === 'on',
                  message: formData.get('message') || '',
                  recurring: formData.get('recurring') === 'on',
                  walletAddress: currentAccount
                };
                handleDonationSubmit(donationData);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Donation Amount</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">RM</span>
                      </div>
                      <input type="number" name="amount" id="donationAmount" className="focus:ring-secondary focus:border-secondary block w-full pl-10 pr-12 py-3 border-gray-300 rounded-md" placeholder="0.00" step="0.01" min="1" required />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <select name="currency" className="focus:ring-secondary focus:border-secondary h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 rounded-md">
                          <option>MYR</option>
                          <option>ETH</option>
                          <option>USDT</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input type="text" name="donorName" className="focus:ring-secondary focus:border-secondary block w-full py-3 px-4 border-gray-300 rounded-md" placeholder="Your name (optional)" />
                  </div>
                  {/* Additional fields for anonymous, recurring, and message can be added here */}
                </div>
                <button type="submit" className="mt-6 w-full bg-secondary hover:bg-secondaryLight text-white font-semibold py-3 px-6 rounded-md">Donate Now</button>
              </form>
            </div>
          </>
        )}
      </div>
    </HalfCircleBackground>
  );
};

export default DonationFormPage;
