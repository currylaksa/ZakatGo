import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { HalfCircleBackground } from '../components';
import { TransactionContext } from '../context/TransactionContext';

const FundingReviewPage = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentAccount, fundLoan, isLoading } = useContext(TransactionContext);
  const [loan, setLoan] = useState(null);
  const [loadingLoan, setLoadingLoan] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [transactionError, setTransactionError] = useState(null);

  useEffect(() => {
    // Get loan data from location state or fetch it
    const fetchLoanDetails = async () => {
      setLoadingLoan(true);
      try {
        if (location.state && location.state.loan) {
          // Use the loan data passed via navigation
          setLoan(location.state.loan);
          setLoadingLoan(false);
        } else {
          // In a real app, this would fetch loan data from your API/blockchain
          // Simulate fetching data for the selected loan ID
          setTimeout(() => {
            // Mock loan details for demonstration
            const mockLoan = {
              id: loanId,
              title: 'Small Business Loan',
              borrower: '0x7e...1A3b',
              requestDate: 'Mar 19, 2024',
              requestedAmount: '45,000',
              monthlyPayment: '5,000',
              purpose: 'Business Expansion',
              proposedInterest: '8.5%',
              term: '12 months',
              risk: 'low',
              collateralOffered: 'Business Equipment',
              creditScore: '720',
              status: 'pending',
              loanId: `LOAN-${loanId}`,
            };
            
            setLoan(mockLoan);
            setLoadingLoan(false);
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching loan details:", error);
        setLoadingLoan(false);
      }
    };

    fetchLoanDetails();
  }, [loanId, location]);

  const handleFundNow = async () => {
    if (!currentAccount) {
      alert("Please connect your wallet first");
      return;
    }
    
    setTransactionError(null);
    
    try {
      // Call the fundLoan function from our context to transfer ETH
      const transactionResult = await fundLoan();
      
      // If we reach this point, the transaction was successful
      console.log("Transaction successful:", transactionResult);
      
      // Navigate to success page with loan data
      navigate(`/funding-success/${loanId}`, { 
        state: { 
          loan: {
            ...loan,
            funded: true,
            fundingDate: new Date().toLocaleDateString('en-US', {
              month: 'short', 
              day: 'numeric', 
              year: 'numeric'
            }),
            transactionHash: transactionResult?.hash || null
          },
          isLender: true
        } 
      });
    } catch (error) {
      console.error("Error funding loan:", error);
      setTransactionError("Transaction failed. Please try again.");
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (loadingLoan || !loan) {
    return (
      <HalfCircleBackground title="Funding Review">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
      </HalfCircleBackground>
    );
  }

  // Get shortened wallet address for display
  const shortenAddress = (address) => {
    return address 
      ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
      : '0x00...0000';
  };

  return (
    <HalfCircleBackground title="Funding Review">
      <div className="max-w-lg mx-auto pt-1 w-full pb-8">
        {/* Loan Amount Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="mb-5">
              <h2 className="text-3xl font-bold text-gray-800">RM {loan.requestedAmount}</h2>
              <div className="flex items-center mt-1">
                <p className="text-gray-500 text-sm">Loan ID: {loan.id}</p>
                <button className="ml-2 text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <button 
                onClick={toggleExpanded}
                className="flex justify-between items-center w-full text-left mb-3"
              >
                <p className="font-medium text-gray-800">{loan.title}</p>
                <div className="flex items-center">
                  <span className="text-secondary font-semibold mr-1">{loan.proposedInterest}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 text-secondary transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="space-y-3 mb-4 bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Payment Term</p>
                    <p className="font-medium">{loan.term}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Monthly Payment</p>
                    <p className="font-medium">RM {loan.monthlyPayment}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Purpose</p>
                    <p className="font-medium">{loan.purpose}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Risk Level</p>
                    <p className="font-medium">
                      {loan.risk === 'low' ? 'Low Risk' : loan.risk === 'medium' ? 'Medium Risk' : 'High Risk'}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Credit Score</p>
                    <p className="font-medium">{loan.creditScore}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="mb-6">
          <h3 className="text-gray-700 font-medium mb-3">Selected Payment Method</h3>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M19 12h2l-3 4-3-4h2V8h-2l3-4 3 4h-2v4z"></path>
                    <path d="M13 12h-2V8H9l3-4 3 4h-2v4z"></path>
                    <path d="M5 12h2v4h2l-3 4-3-4h2v-4z"></path>
                    <path d="M11 16h2v-4h2l-3-4-3 4h2v4z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Metamask</p>
                  <p className="text-gray-500 text-sm">{shortenAddress(currentAccount)}</p>
                </div>
              </div>
              <button className="text-secondary font-medium">Change</button>
            </div>
          </div>
        </div>

        {/* Funding Terms */}
        <div className="mb-6 bg-yellow-50 rounded-xl p-4 border border-yellow-100">
          <h3 className="text-yellow-800 font-medium mb-2">Funding Terms</h3>
          <p className="text-yellow-700 text-sm mb-2">
            By funding this loan, you agree to:
          </p>
          <ul className="text-yellow-700 text-sm space-y-1 mb-2">
            <li>• Transfer RM {loan.requestedAmount} to the borrower</li>
            <li>• Accept the proposed interest rate of {loan.proposedInterest}</li>
            <li>• Receive monthly payments of RM {loan.monthlyPayment} for {loan.term}</li>
          </ul>
          <p className="text-yellow-700 text-sm">
            This transaction will be recorded on the blockchain and cannot be reversed.
          </p>
        </div>

        {/* Fund Now Button */}
        {isLoading ? (
          <div className="w-full bg-secondary py-4 rounded-xl font-medium text-lg text-center text-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
            Processing Transaction...
          </div>
        ) : (
          <button 
            onClick={handleFundNow}
            className="w-full bg-secondary hover:bg-secondaryLight text-white py-4 rounded-xl font-medium transition-colors text-lg"
          >
            Fund Now - RM {loan.requestedAmount}
          </button>
        )}
        
        {transactionError && (
          <div className="mt-2 text-red-500 text-center">
            {transactionError}
          </div>
        )}

        {/* Back Button */}
        <button 
          onClick={() => navigate(`/fund/${loanId}`)}
          className="flex items-center text-secondary font-medium mt-4 mx-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
    </HalfCircleBackground>
  );
};

export default FundingReviewPage; 