import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { HalfCircleBackground } from '../components';
import { TransactionContext } from '../context/TransactionContext';

const LoanFundingPage = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentAccount } = useContext(TransactionContext);
  const [loan, setLoan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      setIsLoading(true);
      try {
        if (location.state && location.state.loan) {
          setLoan(location.state.loan);
        } else {
          setTimeout(() => {
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
          }, 1000);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching loan details:", error);
        setIsLoading(false);
      }
    };

    fetchLoanDetails();
  }, [loanId, location]);

  const handleFund = () => {
    if (!currentAccount) {
      alert("Please connect your wallet first");
      return;
    }
    navigate(`/funding-review/${loanId}`, { state: { loan }});
  };

  const getRiskColor = (risk) => {
    if (risk === 'low') return 'bg-green-500';
    if (risk === 'medium') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading || !loan) {
    return (
      <HalfCircleBackground title="Loan Funding">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
      </HalfCircleBackground>
    );
  }

  return (
    <HalfCircleBackground title="Loan Funding">
      <div className="max-w-lg mx-auto pt-1 w-full pb-8">
        {/* Loan Amount Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">RM {loan.requestedAmount}</h2>
              <p className="text-gray-500 text-sm mt-2">
                Loan Request from {loan.borrower}
              </p>
              <div className="flex items-center justify-center mt-2">
                <p className="text-gray-500 text-sm">Loan ID: {loan.id}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${getRiskColor(loan.risk)}`} />
                  <p className="font-medium text-gray-800">
                    {loan.risk.charAt(0).toUpperCase() + loan.risk.slice(1)} Risk
                  </p>
                </div>
                <div className="flex items-center text-green-500 font-semibold">
                  {loan.proposedInterest}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <p className="text-gray-600">Payment Term</p>
                  <p className="font-medium">{loan.term}</p>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <p className="text-gray-600">Monthly Payment</p>
                  <p className="font-medium">RM {loan.monthlyPayment}</p>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <p className="text-gray-600">Purpose</p>
                  <p className="font-medium">{loan.purpose}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Credit Score</p>
                  <p className="font-medium">{loan.creditScore}</p>
                </div>
              </div>

              <button 
                onClick={handleFund}
                className="w-full bg-secondary hover:bg-secondaryLight text-white py-3 rounded-lg font-medium transition-colors"
              >
                Fund This Loan
              </button>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigate('/lend')}
          className="flex items-center text-blue-700 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Loan Applications
        </button>
      </div>
    </HalfCircleBackground>
  );
};

export default LoanFundingPage;