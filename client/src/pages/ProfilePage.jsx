import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HalfCircleBackground } from '../components';
import { ethers } from 'ethers';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { TransactionContext } from "../context/TransactionContext";

// Import the Approval Report
import ApprovalReportPage from './zakatAssist/ApprovalReportPage';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  
  // Profile view toggle state (donor or applicant)
  const [profileView, setProfileView] = useState('donor'); // 'donor' or 'applicant'
  
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
  const [ethToMYRRate] = useState(450); // Updated ETH to MYR conversion rate
  
  // Mock donor payment report data
  const [donorPaymentReport, setDonorPaymentReport] = useState({
    totalZakatAmount: 1245.00,
    paymentDate: 'April 15, 2025',
    paymentReference: 'ZKT-25-0415-D789',
    paymentMethod: 'Bank Transfer',
    selectedCategories: [
      { name: 'Fuqara (The Poor)', percentage: 60, color: 'bg-green-500', amount: 747.00 },
      { name: 'Muallaf (New Muslims/Friends)', percentage: 25, color: 'bg-blue-500', amount: 311.25 },
      { name: 'Ibn as-Sabil (Wayfarers)', percentage: 15, color: 'bg-purple-500', amount: 186.75 }
    ],
    certificate: {
      number: 'ZKTC-2025-004893',
      issuedDate: 'April 16, 2025',
      taxYear: '2025'
    }
  });
  
  // Mock applicant spending data
  const [spendingCategories, setSpendingCategories] = useState([
    { id: 1, name: 'Food & Groceries', percentage: 35, color: 'bg-green-500', spent: 315 },
    { id: 2, name: 'Housing Rent', percentage: 40, color: 'bg-blue-500', spent: 360 },
    { id: 3, name: 'Utilities', percentage: 15, color: 'bg-purple-500', spent: 135 },
    { id: 4, name: 'Medical Expenses', percentage: 10, color: 'bg-yellow-500', spent: 90 },
  ]);

  // Mock applicant transaction history
  const [applicantTransactions, setApplicantTransactions] = useState([
    { id: 1, merchant: 'Speed99 Mart', category: 'Food & Groceries', amount: 'RM125.50', date: '18 Apr 2025', items: ['Rice', 'Vegetables', 'Cooking Oil'] },
    { id: 2, merchant: 'Pharmacy Plus', category: 'Medical Expenses', amount: 'RM58.90', date: '17 Apr 2025', items: ['Medications', 'First Aid Supplies'] },
    { id: 3, merchant: 'Quick Shop', category: 'Food & Groceries', amount: 'RM82.25', date: '15 Apr 2025', items: ['Groceries', 'Household Items'] },
    { id: 4, merchant: 'Water & Power Co', category: 'Utilities', amount: 'RM135.00', date: '10 Apr 2025', items: ['Monthly Utility Bill'] },
  ]);

  // Mock applicant details
  const [applicantDetails, setApplicantDetails] = useState({
    id: 'ZKT-25-0419-001',
    name: 'Ahmad bin Abdullah',
    approvalDate: 'April 19, 2025',
    assistanceAmount: 2500,
    remaining: 1900,
    category: 'Fakir (The Poor)',
    validUntil: 'October 19, 2025',
  });
  
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
  
  // Helper function to calculate total spent amount
  const calculateTotalSpent = () => {
    return spendingCategories.reduce((total, category) => total + category.spent, 0);
  };

  // Toggle function for profile view
  const toggleProfileView = (view) => {
    setProfileView(view);
  };

  // Helper function to download payment report as PDF
  const downloadPaymentReport = () => {
    // In a real implementation, this would generate a PDF file
    alert('Downloading Zakat Payment Report as PDF...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Title and Description */}
      <div className="text-center py-8 max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-green-600 mb-2">ZakatGo Profile</h1>
        <div className="w-32 h-1 bg-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {profileView === 'donor' ? 
            'Manage your wallet, track your donations, and view your impact in the ZakatGo ecosystem.' :
            'Track your Zakat assistance, view spending, and manage your approved funds.'}
        </p>
        
        {/* Profile View Toggle */}
        <div className="mt-6 inline-flex bg-gray-100 rounded-lg p-1 shadow-inner">
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              profileView === 'donor' ? 
              'bg-green-600 text-white shadow' : 
              'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => toggleProfileView('donor')}
          >
            Donor View
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              profileView === 'applicant' ? 
              'bg-green-600 text-white shadow' : 
              'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => toggleProfileView('applicant')}
          >
            Applicant View
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-12">
        
        {profileView === 'donor' ? (
          // DONOR VIEW
          <>
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
            
            {/* Payment Report Section for Donors */}
            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h2 className="text-base font-bold">Zakat Payment Report</h2>
                </div>
                
                <button 
                  onClick={downloadPaymentReport}
                  className="text-sm text-green-600 hover:text-green-700 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>
              </div>
              
              {/* Payment Summary */}
              <div className="bg-green-50 p-4 rounded-xl mb-5">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="mb-2 md:mb-0">
                    <div className="text-sm text-gray-600">Total Zakat Payment</div>
                    <div className="text-2xl font-bold text-green-700">RM {donorPaymentReport.totalZakatAmount.toFixed(2)}</div>
                  </div>
                  
                  <div className="text-right mb-2 md:mb-0 md:mr-4">
                    <div className="text-sm text-gray-600">Payment Date</div>
                    <div className="font-medium">{donorPaymentReport.paymentDate}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Reference</div>
                    <div className="font-medium">{donorPaymentReport.paymentReference}</div>
                  </div>
                </div>
              </div>
              
              {/* Distribution Chart and Details */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* Chart */}
                <div className="flex flex-col items-center md:w-1/2">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Fuqara segment (60%) */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="20" strokeDasharray="377" strokeDashoffset="0" transform="rotate(-90 50 50)" />
                      {/* Muallaf segment (25%) */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" strokeWidth="20" strokeDasharray="150" strokeDashoffset="377" transform="rotate(-90 50 50)" />
                      {/* Ibn as-Sabil segment (15%) */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8B5CF6" strokeWidth="20" strokeDasharray="378" strokeDashoffset="534" transform="rotate(-90 50 50)" />
                      {/* Inner circle for donut effect */}
                      <circle cx="50" cy="50" r="30" fill="white" />
                    </svg>
                    
                    {/* Center text showing total */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-xs text-gray-500">Total Amount</div>
                      <div className="text-lg font-bold">RM {donorPaymentReport.totalZakatAmount.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-3">
                    <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Tax-Deductible
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Certificate #{donorPaymentReport.certificate.number}</p>
                  </div>
                </div>
                
                {/* Distribution Details */}
                <div className="md:w-1/2">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Zakat Distribution</h3>
                  
                  <div className="space-y-3">
                    {donorPaymentReport.selectedCategories.map((category, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${category.color}`}></div>
                            <div className="text-sm font-medium">{category.name}</div>
                          </div>
                          <div className="text-sm font-bold">RM {category.amount.toFixed(2)}</div>
                        </div>
                        
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${category.color}`}
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                        
                        <div className="text-xs text-gray-500 mt-1 text-right">{category.percentage}% of total donation</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-sm">
                    <p className="text-gray-600">Your zakat contribution is divided among your selected categories according to the percentages you specified during donation.</p>
                    <a href="#" className="text-green-600 hover:text-green-700 font-medium mt-2 inline-block">
                      Learn more about zakat categories →
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Impact Preview */}
              <div className="border-t border-gray-200 mt-6 pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Your Impact Preview</h3>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-2xl text-green-700 font-bold">12</div>
                    <div className="text-xs text-gray-600">Families Helped</div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-2xl text-blue-700 font-bold">3</div>
                    <div className="text-xs text-gray-600">New Muslims Supported</div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-2xl text-purple-700 font-bold">5</div>
                    <div className="text-xs text-gray-600">Travelers Assisted</div>
                  </div>
                </div>
              </div>
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
            </>
        ) : (
          // APPLICANT VIEW
          <>
            {/* Assistance Summary Card */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl p-6 mb-6 shadow-lg text-white mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 rounded-full p-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium">Zakat Assistance</span>
                </div>
                
                <div className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  ID: {applicantDetails.id}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-sm opacity-80">Approved Amount</div>
                <div className="text-3xl font-bold">RM {applicantDetails.assistanceAmount.toLocaleString()}</div>
                <div className="flex items-center text-sm mt-1">
                  <span className="opacity-80">Remaining Balance:</span>
                  <span className="font-medium ml-2">RM {applicantDetails.remaining.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white border-opacity-20 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm opacity-80">Category</div>
                  <div className="font-medium">{applicantDetails.category}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Approval Date</div>
                  <div className="font-medium">{applicantDetails.approvalDate}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Valid Until</div>
                  <div className="font-medium">{applicantDetails.validUntil}</div>
                </div>
              </div>
            </div>
            
            {/* Quick Action Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div 
                onClick={() => navigate('/zakatAssist/qr')}
                className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition-all text-center"
              >
                <div className="bg-green-100 rounded-full p-3 mb-3">
                  <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">View QR Code</span>
              </div>
              
              <div 
                className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition-all text-center"
              >
                <div className="bg-green-100 rounded-full p-3 mb-3">
                  <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Find Stores</span>
              </div>
              
              <div 
                className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition-all text-center"
              >
                <div className="bg-green-100 rounded-full p-3 mb-3">
                  <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Report Issue</span>
              </div>
            </div>
            
            {/* Spending Summary with Pie Chart */}
            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <h2 className="text-base font-bold">Spending Summary</h2>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:w-1/2">
                  <div className="relative w-40 h-40">
                    {/* Improved donut chart - visual representation of spending categories */}
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Calculate the circumference of the circle: 2 * PI * radius */}
                      {/* Full circle circumference = 2 * PI * 40 = ~251.33 */}
                      {/* Food segment (35%) = 0.35 * 251.33 = ~87.96 */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="20" strokeDasharray="251.33" strokeDashoffset="0" transform="rotate(-90 50 50)" />
                      {/* Housing segment (40%) = 0.4 * 251.33 = ~100.53 */}
                      {/* Starting after Food segment (35%) = 0.35 * 251.33 = ~87.96 */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" strokeWidth="20" strokeDasharray="100.53 150.8" strokeDashoffset="-87.96" transform="rotate(-90 50 50)" />
                      {/* Utilities segment (15%) = 0.15 * 251.33 = ~37.7 */}
                      {/* Starting after Food (35%) + Housing (40%) = 0.75 * 251.33 = ~188.5 */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8B5CF6" strokeWidth="20" strokeDasharray="37.7 213.63" strokeDashoffset="-188.5" transform="rotate(-90 50 50)" />
                      {/* Medical segment (10%) = 0.1 * 251.33 = ~25.13 */}
                      {/* Starting after Food (35%) + Housing (40%) + Utilities (15%) = 0.9 * 251.33 = ~226.2 */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F59E0B" strokeWidth="20" strokeDasharray="25.13 226.2" strokeDashoffset="-226.2" transform="rotate(-90 50 50)" />
                      {/* Inner circle for donut effect */}
                      <circle cx="50" cy="50" r="30" fill="white" />
                    </svg>
                    
                    {/* Center text showing total spent */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-xs text-gray-500">Total Spent</div>
                      <div className="text-lg font-bold">RM {calculateTotalSpent()}</div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2">
                  <div className="space-y-3">
                    {spendingCategories.map(category => (
                      <div key={category.id} className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${category.color}`}></div>
                        <div className="text-sm text-gray-600 w-40">{category.name}</div>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${category.color}`}
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                        <div className="ml-2 text-sm text-gray-700 font-medium">RM {category.spent}</div>
                      </div>
                    ))}
                    
                    <div className="flex items-center pt-2 mt-2 border-t border-gray-200">
                      <div className="w-3 h-3 rounded-full mr-2 bg-gray-300"></div>
                      <div className="text-sm text-gray-600 w-40">Remaining</div>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gray-300"
                          style={{ width: `${(applicantDetails.remaining / applicantDetails.assistanceAmount) * 100}%` }}
                        ></div>
                      </div>
                      <div className="ml-2 text-sm text-gray-700 font-medium">RM {applicantDetails.remaining}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Transactions Section */}
            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h2 className="text-base font-bold">Recent Transactions</h2>
                </div>
                
                <Link to="/transaction-history" className="text-sm text-green-600 hover:text-green-700 transition-colors">
                  View All
                </Link>
              </div>
              
              <div className="space-y-3">
                {applicantTransactions.map(transaction => (
                  <div key={transaction.id} className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className={`inline-block w-2 h-2 rounded-full ${
                            transaction.category === 'Food & Groceries' ? 'bg-green-500' :
                            transaction.category === 'Housing Rent' ? 'bg-blue-500' :
                            transaction.category === 'Utilities' ? 'bg-purple-500' : 'bg-yellow-500'
                          } mr-2`}></span>
                          <span className="font-medium text-sm">{transaction.merchant}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-2">{transaction.category}</span>
                          <span>{transaction.date}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-sm">{transaction.amount}</div>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs">
                      <span className="text-gray-500">Items: </span>
                      <span className="text-gray-700">{transaction.items.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Approval Details - Condensed version of ApprovalReportPage */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-base font-bold">Approval Details</h2>
                </div>
                
                <button 
                  onClick={() => navigate('/zakatAssist/approval-report')}
                  className="text-sm text-green-600 hover:text-green-700 transition-colors flex items-center"
                >
                  Full Report
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-green-800">
                      Your Zakat Application Has Been Approved
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-700">Assistance Breakdown</h3>
                  <div className="mt-2 space-y-1">
                    {spendingCategories.map(category => (
                      <div key={category.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{category.name}</span>
                        <span className="font-medium">RM {category.spent + (category.id === 1 ? 485 : category.id === 2 ? 590 : category.id === 3 ? 215 : 220)}</span>
                      </div>
                    ))}
                    <div className="pt-1 mt-1 border-t border-gray-200 flex justify-between font-medium">
                      <span>Total</span>
                      <span>RM {applicantDetails.assistanceAmount}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-700">Support Contact</h3>
                  <div className="mt-3 flex items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg text-blue-700">NH</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Nur Hafizah binti Ibrahim</p>
                      <p className="text-xs text-gray-500">Zakat Case Officer</p>
                      <div className="mt-1 text-xs text-gray-600">
                        <p>012-345-6789</p>
                        <p>hafizah.ibrahim@zakatgo.org</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Help & Support Section */}
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
          </>
        )}
      </div>
    </div>
  );
};

const RecentZakatTransactions = () => {
  const { zakatTransactions, getZakatTransactions, isLoading } = useContext(TransactionContext);
  const [walletAddress, setWalletAddress] = useState('');
  const [showInRM, setShowInRM] = useState(true);
  const ethToMYRRate = 450; // Updated ETH to MYR conversion rate
  
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
      return myrAmount.toFixed(6);
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
                          `RM ${Number(tx.amount).toFixed(6)}` : 
                          `${Number(tx.amount).toFixed(6)} ETH`
                        }
                      </div>
                      <div className="text-xs text-gray-500">
                        {showInRM ? 
                          `(${convertEthToMYR(tx.amount)}ETH)` : 
                          `(~RM ${convertEthToMYR(tx.amount)})`
                        }
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{tx.timestamp}</div>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <a 
                      href={`https://sepolia.etherscan.io/${tx.transactionHash ? `tx/${tx.transactionHash}` : `address/${tx.addressFrom}`}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-green-600 transition-colors"
                    >
                      {tx.transactionHash ? "View Transaction on Etherscan" : "View Address on Etherscan"}
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