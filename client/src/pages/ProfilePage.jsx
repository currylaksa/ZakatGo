import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HalfCircleBackground } from '../components';
import { ethers } from 'ethers';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  
  const [isPremium] = useState(false); // For potential premium donor features
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  
  // Enhanced states for ZakatGo platform
  const [zakatDue, setZakatDue] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [impactScore, setImpactScore] = useState(235);
  const [showLocalSuggestions, setShowLocalSuggestions] = useState(false);
  const [nearbyDonationOpportunities, setNearbyDonationOpportunities] = useState([
    { id: 1, type: 'Mosque', name: 'Masjid Al-Hikmah', distance: '0.5km', goal: 'RM10,000', raised: 'RM7,500' },
    { id: 2, type: 'Food Bank', name: 'Community Food Relief', distance: '1.2km', goal: 'RM5,000', raised: 'RM2,750' },
    { id: 3, type: 'Education', name: 'Student Support Fund', distance: '2.3km', goal: 'RM8,000', raised: 'RM4,200' }
  ]);
  
  // Category breakdown for zakat distribution
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
    
    // Listen for network changes
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

  useEffect(() => {
    // Calculate zakat due based on wallet balance (simplified example)
    if (walletBalance && !isNaN(parseFloat(walletBalance))) {
      // Example: 2.5% of wallet balance for zakat calculation
      const zakatCalculation = parseFloat(walletBalance) * 0.025;
      setZakatDue(zakatCalculation.toFixed(4));
    }
  }, [walletBalance]);

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
        setIsBalanceLoading(false); // Clear loading state
        return;
      }
      
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.formatEther(balance);
      setWalletBalance(parseFloat(formattedBalance).toFixed(4));
      setNetworkError(false);
      setIsBalanceLoading(false); // Clear loading state
    } catch (error) {
      console.error("Error fetching balance:", error);
      setWalletBalance("Error");
      setIsBalanceLoading(false); // Clear loading state
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return address.slice(0, 6) + '...' + address.slice(-4);
  };
  
  // Format transaction hash
  const formatTxHash = (hash) => {
    if (!hash) return '';
    return hash.slice(0, 6) + '...' + hash.slice(-4);
  };
  
  // Toggle nearby donation suggestions
  const toggleLocalSuggestions = () => {
    setShowLocalSuggestions(!showLocalSuggestions);
  };

  return (
    <HalfCircleBackground title="ZakatGo Profile">
      <div className="pt-2">
      
        {/* Wallet Balance Section */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 mb-6 shadow-md text-white mt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none">
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
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="text-2xl font-bold">
                    {networkError ? "Wrong Network" : (
                      isBalanceLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-lg">Loading...</span>
                        </div>
                      ) : (
                        `${walletBalance} ETH`
                      )
                    )}
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
              
              {/* Zakat Due Display */}
              {!networkError && !isBalanceLoading && walletBalance && (
                <div className="bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                  <div className="text-xs opacity-80">
                    Zakat Due (2.5%)
                  </div>
                  <div className="text-lg font-bold">{zakatDue} ETH</div>
                  <button 
                    onClick={() => navigate('/zakat-calculator')}
                    className="mt-1 text-xs bg-white bg-opacity-30 hover:bg-opacity-40 transition-all px-2 py-0.5 rounded-full"
                  >
                    Pay Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Impact Score Section with Categories Visualization */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:w-1/2">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Your Impact Score</h3>
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
              
              <div className="mt-3 flex items-center text-xs text-gray-500">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Updated after your last donation
              </div>
            </div>
            
            {/* Zakat Categories Distribution */}
            <div className="md:w-1/2">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Your Zakat Distribution</h3>
              <div className="space-y-3">
                {zakatCategories.map(category => (
                  <div key={category.id} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${category.color}`}></div>
                    <div className="text-sm text-gray-600 w-40">{category.name}</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${category.color}`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <div className="ml-2 text-xs text-gray-500 font-medium">{category.percentage}%</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-500 text-center">
                Based on your latest Zakat distribution preferences
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mb-6">
          <div className="flex flex-col items-center w-1/3">
            <div 
              onClick={() => navigate('/donate')}
              className="bg-white rounded-full p-4 shadow-sm mb-2 flex items-center justify-center cursor-pointer hover:bg-green-50 transition-all"
            >
              <svg className="h-6 w-6 text-green-500" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8v8m-4-4h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xs text-gray-500">Make Donation</span>
          </div>

          <div className="flex flex-col items-center w-1/3">
            <div 
              onClick={() => navigate('/zakat-calculator')}
              className="bg-white rounded-full p-4 shadow-sm mb-2 flex items-center justify-center cursor-pointer hover:bg-green-50 transition-all"
            >
              <svg className="h-6 w-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                <path d="M8 12h8M8 8h3M8 16h4" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xs text-gray-500">Zakat Calculator</span>
          </div>

          <div className="flex flex-col items-center w-1/3">
            <div 
              onClick={toggleLocalSuggestions}
              className="bg-white rounded-full p-4 shadow-sm mb-2 flex items-center justify-center cursor-pointer hover:bg-green-50 transition-all"
            >
              <svg className="h-6 w-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs text-gray-500">Nearby Causes</span>
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
            
            <div className="space-y-4">
              {nearbyDonationOpportunities.map(opportunity => (
                <div key={opportunity.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-all cursor-pointer">
                  <div className="flex justify-between items-start">
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
                    <button className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                      Donate
                    </button>
                  </div>
                  
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">Fundraising Progress</div>
                    <div className="flex items-center">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden mr-2">
                        {/* Calculate progress width */}
                        <div 
                          className="h-full bg-green-500"
                          style={{ 
                            width: `${(parseInt(opportunity.raised.replace(/[^\d]/g, '')) / parseInt(opportunity.goal.replace(/[^\d]/g, ''))) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs font-medium">
                        {opportunity.raised} / {opportunity.goal}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => navigate('/local-causes')}
              className="mt-4 w-full text-green-500 text-center flex items-center justify-center"
            >
              View All Nearby Causes →
            </button>
          </div>
        )}

        {/* Summary Section - continuing from where it was cut off */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-base font-bold">Donation Summary</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Zakat</p>
                <p className="text-2xl font-bold mb-1">RM1,250</p>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <p className="text-sm text-gray-500">Year to date</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Sadaqah</p>
                <p className="text-2xl font-bold mb-1">RM750</p>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <p className="text-sm text-gray-500">Year to date</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Waqf Investment</p>
                <p className="text-2xl font-bold mb-1">RM500</p>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                  <p className="text-sm text-gray-500">Active</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Impact Score</p>
                <p className="text-2xl font-bold mb-1">{impactScore}</p>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                  <p className="text-sm text-gray-500">Current</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Donations Section */}
          <div className="bg-white rounded-xl p-6 mt-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-base font-bold">Recent Donations</h2>
              </div>
              
              <Link to="/donation-history" className="text-sm text-green-500 hover:text-green-600">
                View All
              </Link>
            </div>
            
            <div className="divide-y divide-gray-100">
              {recentDonations.map(donation => (
                <div key={donation.id} className="py-3 first:pt-0 last:pb-0">
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
                      <div className="font-bold text-sm">{donation.amount}</div>
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
          
          {/* Settings Section */}
          <div className="bg-white rounded-xl p-6 mt-6 shadow-sm">
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h2 className="text-base font-bold">Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Language</p>
                  <p className="text-xs text-gray-500">Change the display language</p>
                </div>
                <LanguageToggle />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Notification Preferences</p>
                  <p className="text-xs text-gray-500">Manage email and app notifications</p>
                </div>
                <button className="text-sm text-green-500">Edit</button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Zakat Distribution Preferences</p>
                  <p className="text-xs text-gray-500">Set default Zakat distribution categories</p>
                </div>
                <button 
                  onClick={() => navigate('/zakat-preferences')}
                  className="text-sm text-green-500"
                >
                  Edit
                </button>
              </div>
              
              {isPremium ? (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Premium Membership</p>
                    <p className="text-xs text-gray-500">Active until April 10, 2026</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Premium Membership</p>
                    <p className="text-xs text-gray-500">Unlock advanced features</p>
                  </div>
                  <button className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-full hover:bg-green-600 transition-all">
                    Upgrade
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Help & FAQ */}
          <div className="mt-6 mb-8">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => navigate('/help')}
                className="flex items-center text-gray-500 text-sm"
              >
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4M12 8h.01" />
                </svg>
                Help & FAQ
              </button>
              
              <button 
                onClick={() => navigate('/contact')}
                className="flex items-center text-gray-500 text-sm"
              >
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </button>
            </div>
          </div>
        </div>
    </HalfCircleBackground>
  );
};

export default ProfilePage;