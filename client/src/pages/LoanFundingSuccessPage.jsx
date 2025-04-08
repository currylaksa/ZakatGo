import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { HiCheckCircle } from 'react-icons/hi';

const LoanFundingSuccessPage = () => {
  const navigate = useNavigate();
  const { loanId } = useParams();
  const location = useLocation();
  
  // Get loan data from location state
  const loan = location.state?.loan || null;
  const transactionHash = loan?.transactionHash || null;

  const handleViewLoan = () => {
    navigate(`/lend`);
  };

  const handleViewTransactions = () => {
    navigate('/transactions');
  };
  
  const viewOnEtherscan = () => {
    if (transactionHash) {
      window.open(`https://sepolia.etherscan.io/tx/${transactionHash}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-8">
        {/* Success icon */}
        <div className="mb-8 text-secondary">
          <HiCheckCircle className="w-24 h-24" />
        </div>

        {/* Success message */}
        <h1 className="text-2xl font-bold mb-2 text-center">Funding Successful!</h1>
        <p className="text-gray-600 text-center mb-6">
          You have successfully funded this loan.
          <br />
          The funds have been transferred to the borrower.
          <br />
          You will receive monthly repayments according to the loan terms.
        </p>

        {/* Transaction Details */}
        {transactionHash && (
          <div className="bg-gray-50 p-4 rounded-lg w-full mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Transaction Details</h3>
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm truncate w-3/4">
                Hash: {transactionHash.substring(0, 6)}...{transactionHash.substring(transactionHash.length - 4)}
              </p>
              <button 
                onClick={viewOnEtherscan}
                className="text-secondary text-sm font-medium"
              >
                View on Etherscan
              </button>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="w-full space-y-4">
          <button 
            onClick={handleViewLoan}
            className="w-full bg-secondary text-white font-semibold py-4 rounded-lg hover:bg-secondaryLight transition duration-200"
          >
            View Your Loans
          </button>
          <button 
            onClick={handleViewTransactions}
            className="w-full border border-secondary text-secondary font-semibold py-4 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            View Transactions
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanFundingSuccessPage; 