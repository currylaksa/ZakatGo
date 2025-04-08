import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HalfCircleBackground } from '../components';

const TransactionsPage = () => {
  const navigate = useNavigate();
  
  const recentTransactions = [
    { id: 1, type: 'loan', status: 'completed', amount: 2500, date: 'Aug 25, 2023', recipient: 'Michael Chen' },
    { id: 2, type: 'repayment', status: 'pending', amount: 312, date: 'Aug 18, 2023', recipient: 'MicroLoanChain' },
    { id: 3, type: 'loan', status: 'completed', amount: 1500, date: 'Jul 30, 2023', recipient: 'Sarah Johnson' },
    { id: 4, type: 'repayment', status: 'completed', amount: 312, date: 'Jul 25, 2023', recipient: 'MicroLoanChain' },
    { id: 5, type: 'repayment', status: 'completed', amount: 312, date: 'Jul 18, 2023', recipient: 'MicroLoanChain' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    if (type === 'loan') {
      return (
        <div className="bg-blue-100 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="bg-green-100 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    }
  };

  return (
    <HalfCircleBackground title="Transactions">
      <div className="pt-4">
        {/* Date Filter */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-700">August 2023</span>
            </div>
            <button className="text-blue-700">Change</button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>
          
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  {getTypeIcon(transaction.type)}
                  <div className="ml-3">
                    <p className="font-medium">{transaction.recipient}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-medium">RM {transaction.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full mt-1 ${getStatusColor(transaction.status)}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h2 className="text-lg font-bold mb-4">Transaction Summary</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-gray-500 mb-1">Total Loaned</p>
              <p className="text-xl font-bold mb-1">RM 4,000</p>
              <p className="text-green-500 text-sm">2 loans</p>
            </div>
            
            <div className="text-center">
              <p className="text-gray-500 mb-1">Total Repaid</p>
              <p className="text-xl font-bold mb-1">RM 936</p>
              <p className="text-blue-700 text-sm">3 payments</p>
            </div>
            
            <div className="text-center">
              <p className="text-gray-500 mb-1">Outstanding</p>
              <p className="text-xl font-bold mb-1">RM 3,064</p>
              <p className="text-yellow-500 text-sm">4 payments left</p>
            </div>
            
            <div className="text-center">
              <p className="text-gray-500 mb-1">Next Payment</p>
              <p className="text-xl font-bold mb-1">RM 312</p>
              <p className="text-red-500 text-sm">Due Sep 1</p>
            </div>
          </div>
        </div>

        {/* View All Button */}
        <button 
          onClick={() => {/* Navigate to all transactions */}}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 px-4 rounded-full font-medium flex items-center justify-center"
        >
          View All Transactions
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </HalfCircleBackground>
  );
};

export default TransactionsPage; 