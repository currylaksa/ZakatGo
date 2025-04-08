import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { TransactionContext } from '../context/TransactionContext';
import { LoanCard, HalfCircleBackground } from '../components';
import { FiChevronDown, FiChevronUp, FiLock, FiBarChart2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { HiOutlineEye, HiOutlineUser, HiOutlineCash, HiOutlineCalendar, HiOutlineBadgeCheck, HiOutlineChartBar, HiOutlineLightningBolt, HiOutlineSparkles } from 'react-icons/hi';

const LendPage = () => {
  const { currentAccount, connectWallet } = useContext(TransactionContext);
  const navigate = useNavigate();
  const [loanApplications, setLoanApplications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'low-risk', 'low-amount'
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});
  const [showingInsights, setShowingInsights] = useState({});
  const [isPremium] = useState(true); // In a real app, this would come from a context or API
  
  useEffect(() => {
    // Simulate fetching loan applications from blockchain
    const fetchLoanApplications = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch from your smart contract
        setTimeout(() => {
          const mockApplications = [
            {
              id: '1',
              title: 'Small Business Loan',
              borrower: '0x7e...1A3b',
              requestDate: 'Mar 19, 2024',
              requestedAmount: '45,000',
              monthlyPayment: '5,000',
              purpose: 'Business Expansion',
              proposedInterest: '6.5%',
              term: '12 months',
              risk: 'low',
              collateralOffered: 'Business Equipment',
              creditScore: '720',
              status: 'pending',
              // Premium insights data for the flip card
              riskScore: 28,
              onTimePayment: 97,
              previousLoans: 3,
              estimatedROI: 6.5,
              // Original premium insights
              premiumInsights: {
                borrowerRepaymentRate: 97, // percentage of on-time payments
                latePaymentFrequency: 2.5, // percentage of late payments
                defaultRisk: 'Very Low', // calculated risk of default
                similarLoansPerformance: 98.2, // percentage of similar loans that performed well
                borrowerHistory: [
                  { amount: '12,000', status: 'Completed', onTime: true },
                  { amount: '8,500', status: 'Completed', onTime: true },
                  { amount: '5,000', status: 'Completed', onTime: false }
                ]
              }
            },
            {
              id: '2',
              title: 'Education Loan',
              borrower: '0x3D...F28c',
              requestDate: 'Mar 18, 2024',
              requestedAmount: '45,000',
              monthlyPayment: '5,000',
              purpose: 'University Tuition',
              proposedInterest: '6.5%',
              term: '24 months',
              risk: 'low',
              collateralOffered: 'None',
              creditScore: '750',
              status: 'pending',
              // Premium insights data for the flip card
              riskScore: 15,
              onTimePayment: 100,
              previousLoans: 2,
              estimatedROI: 6.5,
              premiumInsights: {
                borrowerRepaymentRate: 100,
                latePaymentFrequency: 0,
                defaultRisk: 'Minimal',
                similarLoansPerformance: 99.5,
                borrowerHistory: [
                  { amount: '10,000', status: 'Completed', onTime: true },
                  { amount: '15,000', status: 'Completed', onTime: true }
                ]
              }
            },
            {
              id: '3',
              title: 'Home Improvement',
              borrower: '0x9A...B45d',
              requestDate: 'Mar 17, 2024',
              requestedAmount: '45,000',
              monthlyPayment: '5,000',
              purpose: 'Kitchen Renovation',
              proposedInterest: '6.5%',
              term: '6 months',
              risk: 'high',
              collateralOffered: 'Property Lien',
              creditScore: '680',
              status: 'pending',
              // Premium insights data for the flip card
              riskScore: 65,
              onTimePayment: 86,
              previousLoans: 3,
              estimatedROI: 6.5,
              premiumInsights: {
                borrowerRepaymentRate: 86,
                latePaymentFrequency: 12,
                defaultRisk: 'Moderate',
                similarLoansPerformance: 90.1,
                borrowerHistory: [
                  { amount: '20,000', status: 'Completed', onTime: false },
                  { amount: '7,500', status: 'Defaulted', onTime: false },
                  { amount: '12,000', status: 'Completed', onTime: true }
                ]
              }
            },
            {
              id: '4',
              title: 'Medical Expenses',
              borrower: '0x5C...D31e',
              requestDate: 'Mar 16, 2024',
              requestedAmount: '12,000',
              monthlyPayment: '2,000',
              purpose: 'Surgery Costs',
              proposedInterest: '6.5%',
              term: '6 months',
              risk: 'medium',
              collateralOffered: 'None',
              creditScore: '700',
              status: 'pending',
              // Premium insights data for the flip card
              riskScore: 42,
              onTimePayment: 92,
              previousLoans: 2,
              estimatedROI: 6.5,
              premiumInsights: {
                borrowerRepaymentRate: 92,
                latePaymentFrequency: 5,
                defaultRisk: 'Low',
                similarLoansPerformance: 94.3,
                borrowerHistory: [
                  { amount: '9,000', status: 'Completed', onTime: true },
                  { amount: '6,000', status: 'Completed', onTime: false }
                ]
              }
            },
            {
              id: '5',
              title: 'Startup Funding',
              borrower: '0x2F...A87b',
              requestDate: 'Mar 15, 2024',
              requestedAmount: '75,000',
              monthlyPayment: '6,250',
              purpose: 'Initial Inventory',
              proposedInterest: '6.5%',
              term: '12 months',
              risk: 'high',
              collateralOffered: 'Inventory',
              creditScore: '690',
              status: 'pending',
              // Premium insights data for the flip card
              riskScore: 78,
              onTimePayment: 82,
              previousLoans: 2,
              estimatedROI: 6.5,
              premiumInsights: {
                borrowerRepaymentRate: 82,
                latePaymentFrequency: 15,
                defaultRisk: 'High',
                similarLoansPerformance: 85.0,
                borrowerHistory: [
                  { amount: '50,000', status: 'Active', onTime: true },
                  { amount: '25,000', status: 'Late', onTime: false }
                ]
              }
            }
          ];
          
          setLoanApplications(mockApplications);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching loan applications:", error);
        setIsLoading(false);
      }
    };

    fetchLoanApplications();
  }, []);

  const handleFund = (loan) => {
    if (!currentAccount) {
      alert("Please connect your wallet first");
      return;
    }
    
    // Navigate to our new funding page with loan data
    navigate(`/fund/${loan.id}`, { state: { loan } });
  };

  const toggleCardExpand = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleInsights = (id) => {
    setShowingInsights(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredApplications = loanApplications.filter(loan => {
    if (filter === 'all') return true;
    if (filter === 'low-risk') return loan.risk === 'low';
    return true;
  }).sort((a, b) => {
    if (filter === 'low-amount') {
      return parseInt(a.requestedAmount.replace(/,/g, '')) - parseInt(b.requestedAmount.replace(/,/g, ''));
    }
    return 0;
  });

  return (
    <HalfCircleBackground title="Loan Applications">
      <div className="pt-2 max-w-lg mx-auto w-full pb-20">
        <p className="text-white text-opacity-80 mb-6">Review and fund loan requests from borrowers.</p>

        {!currentAccount ? (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 text-center">
            <p className="mb-4">Connect your wallet to start lending</p>
            <button 
              onClick={connectWallet}
              className="flex flex-row justify-center rounded-full items-center bg-secondary p-3 cursor-pointer hover:bg-secondaryLight"
            >
              <p className="text-white text-base font-semibold">
                Connect Wallet
              </p>
            </button>
          </div>
        ) : (
          <>
            <div className="flex space-x-2 mb-4 overflow-x-auto py-2">
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'all' ? 'bg-secondary text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('all')}
              >
                All Applications
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'low-risk' ? 'bg-secondary text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('low-risk')}
              >
                Low Risk
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'low-amount' ? 'bg-secondary text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('low-amount')}
              >
                Low Amount
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {filteredApplications.map((loan, index) => (
                  <div key={loan.id} className="relative">
                    {/* Card container */}
                    <div className="bg-white rounded-xl shadow-sm mb-4">
                      
                      {!showingInsights[loan.id] ? (
                        // Front of card - Main loan details
                        <div className="p-4">
                          {/* Card Header */}
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800">{loan.title}</h3>
                            </div>
                            <button 
                              onClick={() => handleFund(loan)}
                              className="bg-secondary hover:bg-secondaryLight text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
                            >
                              Fund
                            </button>
                          </div>

                          {/* Card Basic Info - Always Visible */}
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                              <p className="text-sm text-gray-500">Requested Amount</p>
                              <p className="text-xl font-semibold text-secondary">RM {loan.requestedAmount}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Monthly Payment</p>
                              <p className="text-xl font-semibold text-secondary">RM {loan.monthlyPayment}</p>
                            </div>
                          </div>
                          
                          {/* Risk Indicator and Premium Insights Button */}
                          <div className="mt-3 flex items-center">
                            <div className="w-2 h-2 rounded-full mr-1" style={{ 
                              backgroundColor: loan.risk === 'low' ? '#10B981' : loan.risk === 'medium' ? '#F59E0B' : '#EF4444' 
                            }}></div>
                            <span className="text-xs text-gray-500">
                              {loan.risk === 'low' ? 'Low Risk' : loan.risk === 'medium' ? 'Medium Risk' : 'High Risk'}
                            </span>
                            
                            {/* Premium insights button */}
                            {isPremium && (
                              <button 
                                onClick={() => toggleInsights(loan.id)}
                                className="ml-auto flex items-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
                              >
                                <HiOutlineSparkles className="mr-1" /> Insights
                              </button>
                            )}
                            
                            {/* Premium lock for non-premium users */}
                            {!isPremium && (
                              <Link 
                                to="/premium"
                                className="ml-auto flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium transition-colors"
                              >
                                <FiLock className="mr-1" />
                                Unlock Insights
                              </Link>
                            )}
                          </div>
                          
                          {/* Expand/Collapse Button */}
                          <button 
                            onClick={() => toggleCardExpand(loan.id)}
                            className="w-full flex items-center justify-center mt-3 pt-2 text-gray-500 hover:text-gray-700 focus:outline-none border-t border-gray-100"
                          >
                            {expandedCards[loan.id] ? (
                              <>
                                <span className="text-xs mr-1">Show less</span>
                                <FiChevronUp size={14} />
                              </>
                            ) : (
                              <>
                                <span className="text-xs mr-1">Show details</span>
                                <FiChevronDown size={14} />
                              </>
                            )}
                          </button>
                          
                          {/* Card Detailed Info - Only Visible When Expanded */}
                          {expandedCards[loan.id] && (
                            <div className="mt-3 pt-2 border-t border-gray-100 animate-fadeIn">
                              <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                  <p className="text-sm text-gray-500">Proposed Interest</p>
                                  <p className="text-md font-medium text-gray-700">{loan.proposedInterest}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Term</p>
                                  <p className="text-md font-medium text-gray-700">{loan.term}</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-gray-500">Purpose</p>
                                  <p className="text-md font-medium text-gray-700">{loan.purpose}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Credit Score</p>
                                  <p className="text-md font-medium text-gray-700">{loan.creditScore}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Back of the card - Premium Insights
                        <div className="bg-gradient-to-br from-slate-50 to-purple-50 p-4 rounded-xl">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold flex items-center">
                              <HiOutlineBadgeCheck className="text-purple-600 mr-2" /> 
                              Premium Insights
                            </h3>
                            <button 
                              onClick={() => toggleInsights(loan.id)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-gray-700">
                                <HiOutlineChartBar className="mr-2 text-purple-600" /> Risk Score
                              </div>
                              <div className="flex items-center">
                                <div className="h-2 w-28 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${loan.riskScore < 30 ? 'bg-green-500' : loan.riskScore < 70 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                    style={{ width: `${loan.riskScore}%` }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-sm font-medium">{loan.riskScore}%</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-gray-700">
                                <HiOutlineLightningBolt className="mr-2 text-purple-600" /> On-time Payment
                              </div>
                              <span className="font-medium">{loan.onTimePayment || '96'}%</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-gray-700">
                                <HiOutlineEye className="mr-2 text-purple-600" /> Previous Loans
                              </div>
                              <span className="font-medium">{loan.previousLoans || '2'} loans</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-gray-700">
                                <HiOutlineCash className="mr-2 text-purple-600" /> Est. ROI
                              </div>
                              <span className="font-medium text-green-600">{loan.estimatedROI || (loan.interestRate - 2)}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </HalfCircleBackground>
  );
};

export default LendPage;