import React, { useState } from 'react';

const BlockchainPaymentStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  const [depositAmount, setDepositAmount] = useState(userData.zakatAmount);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock conversion rate
  const rmToEthRate = 0.00012;
  const ethAmount = depositAmount * rmToEthRate;

  const handleDepositChange = (e) => {
    setDepositAmount(e.target.value);
  };

  const processPayment = () => {
    setIsProcessing(true);
    
    // Simulate blockchain transaction
    setTimeout(() => {
      const transactionDetails = {
        transactionId: 'ETH' + Math.random().toString(36).substring(2, 15),
        amount: depositAmount,
        ethAmount: ethAmount,
        timestamp: new Date().toISOString(),
        status: 'Completed'
      };
      
      updateUserData({ transactionDetails });
      setIsProcessing(false);
      nextStep();
    }, 3000);
  };

  return (
    <div>
      <h2>Step 5: Blockchain Payment Process</h2>
      
      <div>
        <h3>Deposit RM and Convert to ETH</h3>
        <p>Your calculated Zakat amount: RM {userData.zakatAmount.toFixed(2)}</p>
        
        <div>
          <label>Amount to deposit (RM):</label>
          <input
            type="number"
            value={depositAmount}
            onChange={handleDepositChange}
            min={userData.zakatAmount}
          />
        </div>
        
        <div>
          <p>Conversion to ETH: {ethAmount.toFixed(6)} ETH</p>
          <p>(Rate: 1 RM = {rmToEthRate} ETH)</p>
        </div>
        
        <div>
          <h4>Payment Method</h4>
          <div>
            <input type="radio" id="ethereum" name="paymentMethod" checked />
            <label htmlFor="ethereum">Ethereum Blockchain</label>
          </div>
        </div>
        
        <div>
          <button onClick={prevStep}>Back</button>
          <button 
            onClick={processPayment} 
            disabled={isProcessing || depositAmount < userData.zakatAmount}
          >
            {isProcessing ? 'Processing Payment...' : 'Complete Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockchainPaymentStep;
