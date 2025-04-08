import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HalfCircleBackground } from '../components';
import { ethers } from 'ethers';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  
  const [isPremium] = useState(true); // In a real app, this would come from context/API
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

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
        setWalletBalance(t.wrongNetwork);
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
    <HalfCircleBackground title="Profile">
      <div className="pt-2">
      
        {/* Wallet Balance Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 mb-6 shadow-md text-white mt-4">
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
                <span className="text-sm font-medium">{t.sepoliaEth}</span>
              </div>
              {networkError && (
                <span className="text-xs bg-red-500 bg-opacity-20 px-2 py-0.5 rounded-full">
                  {t.wrongNetwork}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {isWalletConnected && (
                <button 
                  onClick={() => navigate('/withdraw-tutorial')}
                  className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 transition-all rounded-full py-1 px-2 flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {t.howToWithdraw}
                </button>
              )}
              
              {isWalletConnected ? (
                <button 
                  onClick={() => getWalletBalance(walletAddress)}
                  className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 transition-all rounded-full py-1 px-2 flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {t.refresh}
                </button>
              ) : (
                <button 
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="text-xs bg-white text-blue-600 font-medium py-1 px-3 rounded-full hover:bg-opacity-90 transition-all disabled:opacity-70"
                >
                  {isLoading ? t.connecting : t.connectWallet}
                </button>
              )}
            </div>
          </div>

          {isWalletConnected && (
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="text-2xl font-bold">
                    {networkError ? t.wrongNetwork : (
                      isBalanceLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-lg">{t.loadingBalance}</span>
                        </div>
                      ) : (
                        `${walletBalance} ETH`
                      )
                    )}
                  </div>
                  <div className="text-xs opacity-80 mt-0.5 font-mono">
                    {formatAddress(walletAddress)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Credit Score Section */}
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
                  stroke="#00A86B" 
                  strokeWidth="6"
                  strokeDasharray="280"
                  strokeDashoffset="85" 
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Score and triangle in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="flex items-center text-sm font-medium text-green-600 mb-1">
                  <svg className="w-3 h-3 mr-1 fill-current" viewBox="0 0 24 24">
                    <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
                  </svg>
                  +5 {t.points}
                </div>
                <div className="text-5xl font-bold mb-1">725</div>
                <div className="text-gray-600 text-sm flex items-center">
                  {t.good}
                  <svg className="w-4 h-4 ml-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4M12 8h.01" />
                  </svg>
                </div>
                
                <div className="absolute bottom-4 w-full flex justify-between px-4 text-xs text-gray-500">
                  <span>0</span>
                  <span>850</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 flex items-center text-xs text-gray-500">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t.updatedAfterRepayment}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mb-6">
          <div className="flex flex-col items-center w-1/3">
            <div className="bg-white rounded-full p-4 shadow-sm mb-2 flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8v8m-4-4h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xs text-gray-500">{t.makePayment}</span>
          </div>

          <div className="flex flex-col items-center w-1/3">
            <div className="bg-white rounded-full p-4 shadow-sm mb-2 flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xs text-gray-500">{t.loanHistory}</span>
          </div>

          <div className="flex flex-col items-center w-1/3">
            <div className="bg-white rounded-full p-4 shadow-sm mb-2 flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="5" cy="12" r="1" fill="currentColor" />
                <circle cx="12" cy="12" r="1" fill="currentColor" />
                <circle cx="19" cy="12" r="1" fill="currentColor" />
              </svg>
            </div>
            <span className="text-xs text-gray-500">{t.more}</span>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-base font-bold">{t.loanSummary}</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t.repaymentHistory}</p>
              <p className="text-2xl font-bold mb-1">100%</p>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <p className="text-sm text-gray-500">{t.excellent}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">{t.activeLoans}</p>
              <p className="text-2xl font-bold mb-1">1</p>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                <p className="text-sm text-gray-500">{t.good}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">{t.currentBalance}</p>
              <p className="text-2xl font-bold mb-1">RM 1,875</p>
              <div className="flex items-center justify-center">
                <span className="text-gray-500 text-xs">{t.nextPayment}</span>
                <span className="text-xs ml-1">15 Apr</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">{t.maxLoanAmount}</p>
              <p className="text-2xl font-bold mb-1">RM 5,000</p>
              <div>
                <span className="text-xs text-secondary">{t.excellent}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/loan-history')}
            className="mt-6 w-full text-blue-500 text-center flex items-center justify-center"
          >
            {t.seeFullHistory} →
          </button>
        </div>
      </div>
    </HalfCircleBackground>
  );
};

export default ProfilePage;