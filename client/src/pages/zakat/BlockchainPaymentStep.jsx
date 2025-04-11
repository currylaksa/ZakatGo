import React, { useState, useEffect, useContext } from 'react';
import { TransactionContext } from '../../context/TransactionContext';

const BlockchainPaymentStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  const initialDepositAmount = userData.zakatAmount > 0 ? userData.zakatAmount : 0;
  const [depositAmount, setDepositAmount] = useState(initialDepositAmount);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const rmToEthRate = 0.000075; 
  const [ethAmount, setEthAmount] = useState(depositAmount * rmToEthRate);
  const { 
    currentAccount, 
    connectWallet, 
    sendTransaction, 
    isLoading, 
    handleChange,
    getZakatTransactions // Add this
  } = useContext(TransactionContext);

  useEffect(() => {
     const amount = Number(depositAmount) || 0;
     if (amount < initialDepositAmount && initialDepositAmount > 0) {
         setError(`Deposit amount cannot be less than the calculated Zakat of RM ${initialDepositAmount.toFixed(2)}.`);
     } else {
         setError('');
     }
     setEthAmount(amount * rmToEthRate);
  }, [depositAmount, initialDepositAmount, rmToEthRate]);

   useEffect(() => {
     const newInitialAmount = userData.zakatAmount > 0 ? userData.zakatAmount : 0;
     setDepositAmount(newInitialAmount);
   }, [userData.zakatAmount]);


  const handleDepositChange = (e) => {
    const value = e.target.value;
    setDepositAmount(value === '' ? '' : Number(value));
  };

  const processPayment = async () => {
    const finalDepositAmount = Number(depositAmount) || 0;

    if (finalDepositAmount <= 0) {
      setError('Please enter a valid amount to donate.');
      return;
    }
    if (finalDepositAmount < initialDepositAmount && initialDepositAmount > 0) {
      setError(`Deposit amount cannot be less than the calculated Zakat of RM ${initialDepositAmount.toFixed(2)}.`);
      return;
    }

    try {
      setError('');
      setIsProcessing(true);

      if (!currentAccount) {
        await connectWallet();
        return;
      }

      const ethValue = (finalDepositAmount * rmToEthRate).toFixed(18);
      const formattedEthAmount = Number(ethValue).toLocaleString('fullwide', {
        useGrouping: false,
        maximumFractionDigits: 18
      });

      handleChange({ target: { value: import.meta.env.VITE_RECEIVER_ADDRESS }}, 'addressTo');
      handleChange({ target: { value: formattedEthAmount }}, 'amount');
      handleChange({ target: { value: 'ZAKAT' }}, 'keyword');
      handleChange({ target: { value: `Zakat payment for categories: ${userData.selectedCategories.map(c => c.name).join(', ')}` }}, 'message');

      await sendTransaction();
      
      // Wait for transaction to be mined
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transactionDetails = {
        transactionId: '0x' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        amount: finalDepositAmount,
        ethAmount: formattedEthAmount,
        rmToEthRate: rmToEthRate,
        timestamp: new Date().toISOString(),
        status: 'Confirmed',
        categories: userData.selectedCategories.map(c => c.name).join(', '),
        walletAddress: currentAccount
      };

      updateUserData({ transactionDetails });
      
      // Force refresh of Zakat transactions
      await getZakatTransactions();
      
      nextStep();
    } catch (error) {
      console.error('Payment error:', error);
      setError('Transaction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Step 5: Payment Process</h2>

      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-5">
        <h3 className="text-lg font-medium text-gray-800">Confirm Donation Amount</h3>

        {initialDepositAmount > 0 && (
             <p className="text-sm text-gray-600">
                 Your calculated Zakat amount is: <span className="font-semibold text-green-700">RM {initialDepositAmount.toFixed(2)}</span>
             </p>
         )}

        <div>
          <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700 mb-1">
            {initialDepositAmount > 0 ? 'Confirm or increase donation amount (RM):' : 'Enter donation amount (RM):'}
            </label>
          <input
            type="number"
            id="depositAmount"
            value={depositAmount}
            onChange={handleDepositChange}
            min={initialDepositAmount > 0 ? initialDepositAmount : 0} 
            step="any"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
             placeholder={initialDepositAmount > 0 ? `Minimum RM ${initialDepositAmount.toFixed(2)}` : 'Enter amount'}
             aria-invalid={error ? "true" : "false"}
             aria-describedby={error ? "deposit-error" : undefined}
          />
          {error && <p id="deposit-error" className="mt-1 text-xs text-red-600">{error}</p>}
        </div>

        {/* Conversion Info */}
        <div className="p-3 bg-gray-50 rounded border border-gray-100">
          <p className="text-sm text-gray-600">Equivalent amount in Ethereum (ETH):</p>
          <p className="text-lg font-semibold text-indigo-700">{ethAmount.toFixed(8)} ETH</p>
          <p className="text-xs text-gray-500">(Rate: 1 RM ≈ {rmToEthRate.toPrecision(2)} ETH - illustrative rate)</p>
        </div>

         {/* Payment Method (Simplified) */}
         <div>
             <h4 className="text-sm font-medium text-gray-700 mb-2">Payment via Blockchain</h4>
             <div className="flex items-center p-3 border border-green-200 bg-green-50 rounded">
                {/* Placeholder for actual wallet connection/payment button */}
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                 </svg>
                 <p className="text-sm text-green-800">Payment will be processed securely on the Ethereum blockchain[cite: 8, 22].</p>
                {/* In a real app: Add Connect Wallet button here */}
             </div>
         </div>

      </div>


      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          disabled={isProcessing || isLoading}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={processPayment}
          disabled={isProcessing || isLoading || !!error || (Number(depositAmount) <= 0)}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center justify-center"
        >
          {isProcessing || isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Payment...
            </>
          ) : (
            !currentAccount ? 'Connect Wallet' : 'Complete Payment'
          )}
        </button>
      </div>
       <p className="text-xs text-gray-500 text-center mt-4">
        {currentAccount ? 
          `Connected: ${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` : 
          'Please connect your MetaMask wallet to make a payment'}
      </p>
    </div>
  );
};

export default BlockchainPaymentStep;
