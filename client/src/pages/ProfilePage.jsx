import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HalfCircleBackground } from '../components';
import { ethers } from 'ethers';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { TransactionContext } from "../context/TransactionContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  
  const [isPremium] = useState(false); 
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [zakatDue, setZakatDue] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [impactScore, setImpactScore] = useState(235);
  const [showLocalSuggestions, setShowLocalSuggestions] = useState(false);
  const [showInRM, setShowInRM] = useState(false); // New state for currency toggle
  const [ethToMYRRate] = useState(13333.33); // Current ETH to MYR conversion rate
  
  const [nearbyDonationOpportunities, setNearbyDonationOpportunities] = useState([
    { id: 1, type: 'Mosque', name: 'Masjid Al-Hikmah', distance: '0.5km', goal: 'RM10,000', raised: 'RM7,500' },
    { id: 2, type: 'Food Bank', name: 'Community Food Relief', distance: '1.2km', goal: 'RM5,000', raised: 'RM2,750' },
    { id: 3, type: 'Education', name: 'Student Support Fund', distance: '2.3km', goal: 'RM8,000', raised: 'RM4,200' }
  ]);

  const [zakatCategories, setZakatCategories] = useState([
    { id: 1, name: 'Fuqara (Poor)', percentage: 30, color: 'bg-green-500' },
    { id: 2, name: 'Masakin (Needy)', percentage: 25, color: 'bg-blue-500' },
    { id: 3, name: 'Amil Zakat (Admin)', percentage: 15, color: 'bg-purple-500' },
    { id: 4, name: 'Muallaf (Converts)', percentage: 10, color: 'bg-yellow-500' },
    { id: 5, name: 'Other Categories', percentage: 20, color: 'bg-red-500' }
  ]);
  
  const [recentDonations, setRecentDonations] = useState([
    { id: 1, type: 'Zakat', amount: 'RM500', date: '10 Apr', status: 'Completed', recipient: 'Orphanage Fund', txHash: '0x2a8d...e3f9' },
    { id: 2, type: 'Sadaqah', amount: 'RM100', date: '25 Mar', status: 'Completed', recipient: 'Flood Relief', txHash: '0x7b3e...a2c1' },
    { id: 3, type: 'Waqf', amount: 'RM250', date: '18 Mar', status: 'Completed', recipient: 'Education Fund', txHash: '0x5f1d...b7e8' }
  ]);

  useEffect(() => {
    checkIfWalletIsConnected();
    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleChainChanged = () => {
    // Reload the page when chain changes
    window.location.reload();
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
      getWalletBalance(accounts[0]);
    } else {
      setWalletAddress('');
      setWalletBalance(null);
      setIsWalletConnected(false);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        console.log("Please install MetaMask");
        return;
      }

      setIsLoading(true);
      
      // Check if we're on Sepolia network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const sepoliaChainId = '0xaa36a7'; // Chain ID for Sepolia
      
      if (chainId !== sepoliaChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: sepoliaChainId }],
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: sepoliaChainId,
                  chainName: 'Sepolia Test Network',
                  nativeCurrency: {
                    name: 'Sepolia ETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://sepolia.infura.io/v3/'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io']
                }]
              });
            } catch (addError) {
              console.error('Error adding Sepolia network:', addError);
              setNetworkError(true);
            }
          }
          console.error('Error switching to Sepolia network:', switchError);
          setNetworkError(true);
        }
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });

      if (accounts.length) {
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        await getWalletBalance(accounts[0]);
      } else {
        console.log('No authorized account found');
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }

      setIsLoading(true);
      setNetworkError(false);

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check and switch to Sepolia network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const sepoliaChainId = '0xaa36a7'; // Chain ID for Sepolia
      
      if (chainId !== sepoliaChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: sepoliaChainId }],
          });
        } catch (switchError) {
          setNetworkError(true);
          setIsLoading(false);
          return;
        }
      }
      
      setWalletAddress(accounts[0]);
      setIsWalletConnected(true);
      await getWalletBalance(accounts[0]);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const getWalletBalance = async (address) => {
    try {
      if (!window.ethereum) return;
      
      setIsBalanceLoading(true); // Set loading state
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (network.chainId !== BigInt(11155111)) {
        setWalletBalance("Wrong Network");
        setNetworkError(true);
        setIsBalanceLoading(false); 
        return;
      }
      
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.formatEther(balance);
      setWalletBalance(parseFloat(formattedBalance).toFixed(4));
      setNetworkError(false);
      setIsBalanceLoading(false);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setWalletBalance("Error");
      setIsBalanceLoading(false); 
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return address.slice(0, 6) + '...' + address.slice(-4);
  };
  
  const formatTxHash = (hash) => {
    if (!hash) return '';
    return hash.slice(0, 6) + '...' + hash.slice(-4);
  };
  
  const toggleLocalSuggestions = () => {
    setShowLocalSuggestions(!showLocalSuggestions);
  };
  
  // Function to toggle between ETH and RM display
  const toggleCurrency = () => {
    setShowInRM(!showInRM);
  };
  
  // Function to convert ETH to RM
  const convertToRM = (ethAmount) => {
    if (!ethAmount || isNaN(parseFloat(ethAmount))) return '0.00';
    return (parseFloat(ethAmount) * ethToMYRRate).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
    {/* Page Title and Description */}
    <div className="text-center py-8 max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-green-600 mb-2">ZakatGo Profile</h1>
      <div className="w-32 h-1 bg-green-500 mx-auto mb-4"></div>
      <p className="text-gray-600">
        Manage your wallet, track your donations, and view your impact in the ZakatGo ecosystem.
        All transactions are verified on the Sepolia blockchain for complete transparency.
      </p>
      <div className="mt-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016a11.955 11.955 0 01-2.593 7.339l-5.363 7.68a.75.75 0 01-1.224 0l-5.363-7.68a11.955 11.955 0 1114.546 0z" />
          </svg>
          Blockchain Verified
        </span>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-4 pb-12">
      
        {/* Wallet Balance Section - Now with Currency Toggle */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl p-6 mb-6 shadow-lg text-white mt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1.5" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M19 7h-1V6a3 3 0 00-3-3H5a3 3 0 00-3 3v12a3 3 0 003 3h14a3 3 0 003-3v-8a3 3 0 00-3-3zm-8 3a2 2 0 100 4 2 2 0 000-4z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm font-medium">Sepolia ETH</span>
              </div>
              {networkError && (
                <span className="text-xs bg-red-500 bg-opacity-20 px-2 py-0.5 rounded-full">
                  Wrong Network
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {isWalletConnected ? (
                <button 
                  onClick={() => getWalletBalance(walletAddress)}
                  className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 transition-all rounded-full py-1 px-2 flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              ) : (
                <button 
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="text-xs bg-white text-green-600 font-medium py-1 px-3 rounded-full hover:bg-opacity-90 transition-all disabled:opacity-70"
                >
                  {isLoading ? "Connecting..." : "Connect Wallet"}
                </button>
              )}
            </div>
          </div>

          {isWalletConnected && (
            <>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="flex items-center">
                      <div className="text-2xl font-bold mr-3">
                        {networkError ? "Wrong Network" : (
                          isBalanceLoading ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-lg">Loading...</span>
                            </div>
                          ) : (
                            showInRM ? 
                            `RM ${convertToRM(walletBalance)}` : 
                            `${walletBalance} ETH`
                          )
                        )}
                      </div>
                    </div>
                    <div className="flex items-center text-xs opacity-80 mt-0.5">
                      <span className="font-mono">{formatAddress(walletAddress)}</span>
                      <a 
                        href={`https://sepolia.etherscan.io/address/${walletAddress}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-1 opacity-80 hover:opacity-100"
                      >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Currency Toggle Button */}
                <button 
                  onClick={toggleCurrency}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all rounded-full py-1 px-2 text-xs flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  {showInRM ? "Show in ETH" : "Show in RM"}
                </button>
              </div>
            </>
          )}
        </div>
        
        {/* Quick Action Cards - Redesigned */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div 
            onClick={() => navigate('/')}
            className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition-all text-center"
          >
            <div className="bg-green-100 rounded-full p-3 mb-3">
              <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8v8m-4-4h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Make Donation</span>
          </div>

          <div 
            onClick={() => navigate('/calculator')}
            className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition-all text-center"
          >
            <div className="bg-green-100 rounded-full p-3 mb-3">
              <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                <path d="M8 12h8M8 8h3M8 16h4" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Zakat Calculator</span>
          </div>

          <div 
            onClick={toggleLocalSuggestions}
            className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition-all text-center"
          >
            <div className="bg-green-100 rounded-full p-3 mb-3">
              <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Nearby Causes</span>
          </div>
        </div>
        
        {/* Impact Score Section with Categories Visualization - Improved Layout */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:w-1/2">
              <h3 className="text-base font-bold mb-3 text-gray-700">Your Impact Score</h3>
              <div className="relative w-40 h-40">
                {/* Circular progress bar */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#E5E7EB" 
                    strokeWidth="6"
                  />
                  {/* Progress circle - green */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#10B981" 
                    strokeWidth="6"
                    strokeDasharray="280"
                    strokeDashoffset="85" 
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Score and info in center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center text-sm font-medium text-green-600 mb-1">
                    <svg className="w-3 h-3 mr-1 fill-current" viewBox="0 0 24 24">
                      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
                    </svg>
                    +15 points
                  </div>
                  <div className="text-4xl font-bold mb-1">{impactScore}</div>
                  <div className="text-gray-600 text-xs flex items-center">
                    Impact Score
                    <svg className="w-3 h-3 ml-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4M12 8h.01" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Zakat Categories Distribution */}
            <div className="md:w-1/2">
              <h3 className="text-base font-bold mb-3 text-gray-700">Your Zakat Distribution</h3>
              <div className="space-y-3">
                {zakatCategories.map(category => (
                  <div key={category.id} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${category.color}`}></div>
                    <div className="text-sm text-gray-600 w-40">{category.name}</div>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${category.color}`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <div className="ml-2 text-sm text-gray-700 font-medium">{category.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Nearby Donation Suggestions - Only shown when toggled */}
        {showLocalSuggestions && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-base font-bold">Nearby Donation Opportunities</h2>
              </div>
              <button 
                onClick={toggleLocalSuggestions}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {nearbyDonationOpportunities.map(opportunity => (
                <div key={opportunity.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <div className="text-sm font-medium">{opportunity.name}</div>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span className="mr-3">{opportunity.type}</span>
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {opportunity.distance} away
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Fundraising Progress</div>
                    <div className="flex items-center">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden mr-2">
                        {/* Calculate progress width */}
                        <div 
                          className="h-full bg-green-500"
                          style={{ 
                            width: `${(parseInt(opportunity.raised.replace(/[^\d]/g, '')) / parseInt(opportunity.goal.replace(/[^\d]/g, ''))) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs font-medium whitespace-nowrap">
                        {opportunity.raised} / {opportunity.goal}
                      </div>
                    </div>
                  </div>
                  
                  <button className="mt-3 w-full bg-green-500 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-green-600 transition-all">
                    Donate
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => navigate('/local-causes')}
              className="mt-4 w-full text-green-600 text-center flex items-center justify-center hover:text-green-700 transition-all"
            >
              View All Nearby Causes →
            </button>
          </div>
        )}

        {/* Summary Section - Redesigned with Cards */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-base font-bold">Donation Summary</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Total Zakat</p>
                <p className="text-2xl font-bold mb-1">

                  {showInRM ? 'RM1,250' : '0.0937 ETH'}</p>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <p className="text-sm text-gray-500">Year to date</p>
                  {showInRM ? null : <p className="text-xs text-gray-400 ml-2">(~RM1,250)</p>}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Total Sadaqah</p>
                <p className="text-2xl font-bold mb-1">
                  {showInRM ? 'RM750' : '0.0562 ETH'}</p>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <p className="text-sm text-gray-500">Year to date</p>
                  {showInRM ? null : <p className="text-xs text-gray-400 ml-2">(~RM750)</p>}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Waqf Investment</p>
                <p className="text-2xl font-bold mb-1">
                  {showInRM ? 'RM500' : '0.0375 ETH'}</p>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                  <p className="text-sm text-gray-500">Active</p>
                  {showInRM ? null : <p className="text-xs text-gray-400 ml-2">(~RM500)</p>}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Impact Score</p>
                <p className="text-2xl font-bold mb-1">{impactScore}</p>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                  <p className="text-sm text-gray-500">Current</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Donations Section - Enhanced UI */}
          <div className="bg-white rounded-xl p-6 mt-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-base font-bold">Recent Donations</h2>
              </div>
              
              <Link to="/donation-history" className="text-sm text-green-600 hover:text-green-700 transition-colors">
                View All
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentDonations.map(donation => (
                <div key={donation.id} className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center mb-1">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          donation.type === 'Zakat' ? 'bg-green-500' :
                          donation.type === 'Sadaqah' ? 'bg-blue-500' : 'bg-purple-500'
                        } mr-2`}></span>
                        <span className="font-medium text-sm">{donation.recipient}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="mr-2">{donation.type}</span>
                        <span>{donation.date}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-sm">
                        {showInRM ? donation.amount : (
                          parseFloat(donation.amount.replace(/[^\d.]/g, '')) / ethToMYRRate
                        ).toFixed(4) + ' ETH'}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 justify-end">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                          donation.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'
                        } mr-1`}></span>
                        <span>{donation.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <span className="font-mono">{formatTxHash(donation.txHash)}</span>
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${donation.txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <RecentZakatTransactions />
          
          {/* Settings Section - Redesigned */}
          <div className="bg-white rounded-xl p-6 mt-6 shadow-sm">
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h2 className="text-base font-bold">Settings</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">      
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Notification Preferences</p>
                    <p className="text-xs text-gray-500">Manage email and app notifications</p>
                  </div>
                  <button className="px-3 py-1.5 bg-green-100 text-green-700 text-xs rounded-lg hover:bg-green-200 transition-all">
                    Edit
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Zakat Distribution Preferences</p>
                    <p className="text-xs text-gray-500">Set default Zakat distribution categories</p>
                  </div>
                  <button 
                    onClick={() => navigate('/zakat-preferences')}
                    className="px-3 py-1.5 bg-green-100 text-green-700 text-xs rounded-lg hover:bg-green-200 transition-all"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Help & FAQ - Card Style */}
          <div className="bg-white rounded-xl p-6 mt-6 mb-8 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/help')}
                className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-all"
              >
                <svg className="w-6 h-6 text-gray-600 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4M12 8h.01" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Help & FAQ</span>
              </button>
              
              <button 
                onClick={() => navigate('/contact')}
                className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-all"
              >
                <svg className="w-6 h-6 text-gray-600 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Contact Support</span>
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

const RecentZakatTransactions = () => {
  const { zakatTransactions, getZakatTransactions, isLoading } = useContext(TransactionContext);
  const [walletAddress, setWalletAddress] = useState('');
  const [showInRM, setShowInRM] = useState(true);
  const ethToMYRRate = 13333.33;
  
  useEffect(() => {
      // Get current wallet address when component mounts
      const getCurrentWalletAddress = async () => {
          if (window.ethereum) {
              try {
                  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                  if (accounts.length > 0) {
                      setWalletAddress(accounts[0].toLowerCase());
                  }
              } catch (error) {
                  console.error("Error getting wallet address:", error);
              }
          }
      };
      
      getCurrentWalletAddress();
  }, []);
  
  useEffect(() => {
      const fetchZakatTransactions = async () => {
          try {
              await getZakatTransactions();
          } catch (error) {
              console.error("Error fetching Zakat transactions:", error);
          }
      };
      
      fetchZakatTransactions();
  }, [getZakatTransactions]);

  const convertEthToMYR = (ethAmount) => {
      const myrAmount = Number(ethAmount) * ethToMYRRate;
      return myrAmount.toFixed(2);
  };
  
  const filteredTransactions = zakatTransactions ? zakatTransactions.filter(
      tx => walletAddress && tx.addressFrom.toLowerCase() === walletAddress
  ) : [];

  return (
      <div className="bg-white rounded-xl p-6 mt-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-base font-bold">My Zakat Transactions</h2>
              </div>
              
              <button 
                onClick={() => setShowInRM(!showInRM)}
                className="text-xs bg-gray-100 hover:bg-gray-200 transition-all rounded-full py-1 px-2 flex items-center text-gray-700"
              >
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                {showInRM ? "Show in ETH" : "Show in RM"}
              </button>
          </div>

          {isLoading ? (
            <div className="py-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent"></div>
            </div>
          ) : walletAddress && filteredTransactions.length > 0 ? (
            <div className="space-y-3">
              {filteredTransactions.map((tx, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        <span className="font-medium text-sm">Zakat Payment</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="mr-2">To: {tx.addressTo.slice(0, 6)}...{tx.addressTo.slice(-4)}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{tx.message}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-sm">
                        {showInRM ? 
                          `RM ${convertEthToMYR(tx.amount)}` : 
                          `${Number(tx.amount).toFixed(6)} ETH`
                        }
                      </div>
                      <div className="text-xs text-gray-500">
                        {showInRM ? 
                          `(${Number(tx.amount).toFixed(6)} ETH)` : 
                          `(~RM ${convertEthToMYR(tx.amount)})`
                        }
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{tx.timestamp}</div>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${tx.transactionHash || tx.addressFrom}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-green-600 transition-colors"
                    >
                      View on Etherscan
                      <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : !walletAddress ? (
            <div className="py-6 text-center text-gray-500 bg-gray-50 rounded-xl">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" />
                <path strokeLinecap="round" strokeWidth="2" d="M3 10h18M7 15h2" />
              </svg>
              <p className="text-sm font-medium mb-1">No wallet connected</p>
              <p className="text-xs">Please connect your wallet to view your transactions</p>
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500 bg-gray-50 rounded-xl">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-medium mb-1">No transactions found</p>
              <p className="text-xs">Make your first Zakat payment to see your transactions</p>
            </div>
          )}
      </div>
  );
};

export default ProfilePage;