import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiCheckCircle, HiUserGroup, HiClock } from 'react-icons/hi';

const LoanSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loan } = location.state || { loan: null };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleViewLoan = () => {
    navigate('/dashboard');
  };

  if (!loan) {
    navigate('/loan');
    return null;
  }

  return (
    <div className="flex flex-col items-center mt-10 min-h-screen bg-[#f8f7f3] p-4">
      <div className="max-w-md w-full relative">
        {/* Receipt Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mt-6">
          {/* Status Icon */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className={`rounded-full p-4 ${loan.hasGuarantor ? 'bg-yellow-100' : 'bg-green-100'}`}>
              <div className={`rounded-full p-3 ${loan.hasGuarantor ? 'bg-yellow-400' : 'bg-green-500'}`}>
                {loan.hasGuarantor ? (
                  <HiClock className="h-8 w-8 text-white" />
                ) : (
                  <HiCheckCircle className="h-8 w-8 text-white" />
                )}
              </div>
            </div>
          </div>

          {/* Receipt Content */}
          <div className="pt-14 px-8 pb-6">
            <div className="text-center mb-6">
              <p className={`font-medium mb-1 ${loan.hasGuarantor ? 'text-yellow-500' : 'text-green-500'}`}>
                {loan.hasGuarantor ? 'Almost there!' : 'Success!'}
              </p>
              <h1 className="text-2xl font-bold text-gray-800">
                {loan.hasGuarantor ? 'Guarantor Pending' : 'Loan Application Submitted'}
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                {loan.hasGuarantor 
                  ? `We've sent an invitation to ${loan.guarantorName}` 
                  : 'Your loan is now available for lenders'}
              </p>
            </div>

            {loan.hasGuarantor && (
              <div className="bg-yellow-50 rounded-lg p-4 mb-6 flex items-start">
                <HiUserGroup className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Your loan will be listed for lenders once your guarantor accepts the invitation. We'll notify you when this happens.
                </p>
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <p className="text-gray-500">Loan Type</p>
                <p className="text-gray-800 font-medium">{loan.title}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-500">Term</p>
                <p className="text-gray-800 font-medium">{loan.term}</p>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <p className="text-gray-500">Monthly Payment</p>
                <p className="text-gray-800 font-medium">RM {loan.monthlyPayment}/month</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-500">Final Payment</p>
                <p className="text-gray-800 font-medium">{loan.dueDate}</p>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <p className="text-gray-500">Protection Fee</p>
                <p className="text-gray-800 font-medium">RM {loan.protectionFee}</p>
              </div>
              {loan.hasGuarantor && (
                <div className="flex justify-between items-center">
                  <p className="text-gray-500">Guarantor</p>
                  <p className="text-gray-800 font-medium">{loan.guarantorName}</p>
                </div>
              )}
              <div className="flex justify-between items-center">
                <p className="text-gray-500">Status</p>
                <p className={`font-medium ${loan.hasGuarantor ? 'text-yellow-500' : 'text-green-500'}`}>
                  {loan.hasGuarantor ? 'Awaiting Guarantor' : 'Listed for Funding'}
                </p>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 py-4 mb-6">
              <div className="flex items-center justify-between py-3">
                <p className="text-gray-500">Loan Amount</p>
                <p className="text-gray-800 font-medium">RM {loan.loanAmount}</p>
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm mb-1">Total including fees</p>
                <p className="text-secondary text-2xl font-bold">RM {loan.totalWithFees}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleViewLoan}
                className="w-full bg-secondary hover:bg-secondaryLight text-white py-3 rounded-full font-medium transition-colors"
              >
                View My Loans
              </button>
              <button
                onClick={handleBackToHome}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanSuccessPage; 