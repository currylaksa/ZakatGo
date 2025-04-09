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
  
  // New states for ZakatGo platform
  const [zakatDue, setZakatDue] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [impactScore, setImpactScore] = useState(235);
  const [recentDonations, setRecentDonations] = useState([
    { id: 1, type: 'Zakat', amount: 'RM500', date: '10 Apr', status: 'Completed', recipient: 'Orphanage Fund' },
    { id: 2, type: 'Sadaqah', amount: 'RM100', date: '25 Mar', status: 'Completed', recipient: 'Flood Relief' }
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
                        `RM${walletBalance} ETH`
                      )
                    )}
                  </div>
                  <div className="text-xs opacity-80 mt-0.5 font-mono">
                    {formatAddress(walletAddress)}
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
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Impact Score Section */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
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
                <div className="text-5xl font-bold mb-1">{impactScore}</div>
                <div className="text-gray-600 text-sm flex items-center">
                  Impact Score
                  <svg className="w-4 h-4 ml-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4M12 8h.01" />
                  </svg>
                </div>
                
                <div className="absolute bottom-4 w-full flex justify-between px-4 text-xs text-gray-500">
                  <span>0</span>
                  <span>500</span>
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
              onClick={() => navigate('/donation-history')}
              className="bg-white rounded-full p-4 shadow-sm mb-2 flex items-center justify-center cursor-pointer hover:bg-green-50 transition-all"
            >
              <svg className="h-6 w-6 text-green-500" viewBox="0 0 24 24" fill="none">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xs text-gray-500">Donation History</span>
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
        </div>

        {/* Summary Section */}
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
              <p className="text-sm text-gray-500 mb-1">Total Impact</p>
              <p className="text-2xl font-bold mb-1">125 people</p>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                <p className="text-sm text-gray-500">helped</p>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold mb-2">Recent Donations</h3>
            
            {recentDonations.map(donation => (
              <div key={donation.id} className="flex justify-between items-center py-2 border-b border-gray-50">
                <div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${donation.type === 'Zakat' ? 'bg-green-500' : donation.type === 'Sadaqah' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                    <span className="font-medium text-sm">{donation.type}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{donation.recipient}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{donation.amount}</div>
                  <div className="text-xs text-gray-500">{donation.date}</div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate('/donation-history')}
            className="mt-4 w-full text-green-500 text-center flex items-center justify-center"
          >
            See Full History →
          </button>
        </div>
      </div>
    </HalfCircleBackground>
  );
};

export default ProfilePage;