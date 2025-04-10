import React from 'react';

const PaymentConfirmation = ({ userData }) => {
  const { transactionDetails, selectedCategories, zakatAmount } = userData;
  
  return (
    <div>
      <h2>Payment Confirmation</h2>
      <div>
        <h3>Thank you for your Zakat contribution!</h3>
        <p>Your payment has been processed successfully.</p>
        
        <div>
          <h4>Receipt Details:</h4>
          <p>Transaction ID: {transactionDetails.transactionId}</p>
          <p>Amount Donated: RM {transactionDetails.amount.toFixed(2)}</p>
          <p>ETH Amount: {transactionDetails.ethAmount.toFixed(6)} ETH</p>
          <p>Date & Time: {new Date(transactionDetails.timestamp).toLocaleString()}</p>
        </div>
        
        <div>
          <h4>Your donation will support these categories:</h4>
          <ul>
            {selectedCategories.map(category => (
              <li key={category.id}>{category.name}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <p>A copy of this receipt has been sent to your email address.</p>
          <button>Download Receipt</button>
          <button>Return to Home</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;