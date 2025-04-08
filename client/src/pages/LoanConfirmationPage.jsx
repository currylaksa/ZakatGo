import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { TransactionContext } from '../context/TransactionContext';
import { Loader } from '../components';

const LoanConfirmationPage = () => {
  const { currentAccount } = useContext(TransactionContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Get loan data from location state
    if (location.state && location.state.loan) {
      setLoan(location.state.loan);
    } else {
      // If no loan data is found, navigate back to the lending page
      navigate('/lend');
    }
  }, [location, navigate]);

  const handleConfirm = async () => {
    if (!currentAccount) {
      alert("Please connect your wallet first");
      return;
    }

    setIsProcessing(true);
    
    try {
      // In a real app, this would call your smart contract to:
      // 1. Transfer funds to the borrower
      // 2. Create the loan agreement on the blockchain
      // 3. Update the loan status in your contract

      // Simulate blockchain transaction time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page with loan details
      navigate('/loan-success', { 
        state: { 
          loan: {
            ...loan,
            dueDate: 'May 10, 2024', // Adding a due date for the receipt
            totalAmount: loan.requestedAmount
          } 
        } 
      });
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    navigate('/lend');
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!loan) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f8f7f3]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f3]">
      <div className="max-w-lg mx-auto p-6 w-full">
        <button
          onClick={handleBack}
          onKeyDown={(e) => e.key === 'Enter' && handleBack()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200"
          aria-label="Go back to previous page"
          tabIndex={0}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Confirm Funding</h1>
          <p className="text-gray-600">Review all details before funding this loan.</p>
        </div>

        <div className="bg-[#f8f7f3] rounded-xl shadow-md p-6 mb-6">
          <div className="mb-6 border-b pb-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">{loan.title}</h2>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ 
                backgroundColor: loan.risk === 'low' ? '#10B981' : loan.risk === 'medium' ? '#F59E0B' : '#EF4444' 
              }}></div>
              <span className="text-sm text-gray-500">
                {loan.risk === 'low' ? 'Low Risk' : loan.risk === 'medium' ? 'Medium Risk' : 'High Risk'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500">Requested Amount</p>
              <p className="text-2xl font-semibold text-[#2952e3]">RM {loan.requestedAmount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Payment</p>
              <p className="text-2xl font-semibold text-[#2952e3]">RM {loan.monthlyPayment}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500">Proposed Interest</p>
              <p className="text-lg font-medium text-gray-700">{loan.proposedInterest}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Term</p>
              <p className="text-lg font-medium text-gray-700">{loan.term}</p>
            </div>
          </div>

          <div className="bg-[#f8f7f3] p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 font-medium mb-1">Purpose</p>
            <p className="text-md">{loan.purpose}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 font-medium">Credit Score</p>
              <p className="text-md text-gray-700">{loan.creditScore}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 font-medium">Borrower ID</p>
              <p className="text-md text-gray-700">{loan.borrower}</p>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
            <p className="text-sm text-yellow-700">
              <span className="font-bold">Important:</span> By funding this loan, you agree to transfer the requested amount to the borrower. The loan agreement will be recorded on the blockchain and cannot be reversed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {isProcessing ? (
              <button 
                className="flex-1 bg-gray-300 text-gray-600 py-3 px-4 rounded-full font-medium flex items-center justify-center cursor-not-allowed"
                disabled
              >
                <span className="mr-2">Processing</span>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              </button>
            ) : (
              <>
                <button 
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-full font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirm}
                  className="flex-1 bg-[#2952e3] hover:bg-[#2546bd] text-white py-3 px-4 rounded-full font-medium"
                >
                  Confirm Funding
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanConfirmationPage; 