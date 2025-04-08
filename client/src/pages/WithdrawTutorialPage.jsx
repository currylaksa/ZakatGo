import React from 'react';
import { HalfCircleBackground } from '../components';
import { Link } from 'react-router-dom';

const WithdrawTutorialPage = () => {
  const steps = [
    {
      title: "Convert Stablecoins (if needed)",
      description: "If you have USDC or USDT, first convert them to ETH using Uniswap (app.uniswap.org). Connect your MetaMask, select the stablecoin, and swap to ETH.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      title: "Create & Verify Luno Account",
      description: "Sign up on Luno and complete the Malaysian ID verification (KYC). This is required for MYR withdrawals and typically takes 1-2 business days.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Get Luno ETH Address",
      description: "In Luno, go to Portfolio → RECEIVE → ETH. Copy your unique Ethereum deposit address. Always verify it starts with '0x'.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Send from MetaMask",
      description: "Open MetaMask → Send → Paste Luno's ETH address. Ensure you have enough ETH for gas fees (≈$5-20). Confirm and wait for 15-30 minutes.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      )
    },
    {
      title: "Sell ETH for MYR",
      description: "Once ETH arrives in Luno, go to Portfolio → ETH → SELL. Choose 'Instant Sell' for market rate or 'Advanced Trade' for limit orders.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )
    },
    {
      title: "Withdraw to Bank",
      description: "Go to Portfolio → MYR → WITHDRAW. Link your Malaysian bank account if not done. Enter amount and confirm. Transfers complete in 1-2 business days.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    }
  ];

  return (
    <HalfCircleBackground title="How to Withdraw">
      <div className="max-w-3xl mx-auto pt-2">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Converting MetaMask Crypto to Malaysian Ringgit (MYR)</h2>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Before You Start</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc list-inside">
                    <li>Ensure you have completed Luno's KYC verification</li>
                    <li>Keep extra ETH for gas fees (≈$5-20)</li>
                    <li>Only send ETH or supported cryptocurrencies to Luno</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-lg">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Important Safety Tips
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Triple-check all wallet addresses before sending any crypto</li>
              <li>Never share your private keys or seed phrases with anyone</li>
              <li>Enable 2FA on both MetaMask and Luno accounts</li>
              <li>Consider market prices and exchange rates before selling</li>
              <li>Keep transaction records for tax purposes</li>
              <li>Start with a small test transaction if unsure</li>
            </ul>
          </div>

          <div className="mt-6 flex justify-end">
            <Link 
              to="/profile"
              className="text-blue-500 hover:text-blue-600 font-medium flex items-center"
            >
              Back to Profile
              <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </HalfCircleBackground>
  );
};

export default WithdrawTutorialPage; 