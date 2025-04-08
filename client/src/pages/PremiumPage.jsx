import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HalfCircleBackground } from '../components';

const PremiumPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const handleSubscribe = () => {
    // In a real app, this would process payment and upgrade the account
    alert('Premium subscription activated! Redirecting to dashboard...');
    navigate('/dashboard');
  };

  return (
    <HalfCircleBackground title="Premium Lender">
      <div className="pt-2 max-w-lg mx-auto w-full pb-24">
        <p className="text-white text-opacity-80 mb-6">
          Upgrade to Premium to access advanced analytics and risk insights.
        </p>

        {/* Premium Features */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Premium Lender Benefits</h2>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="shrink-0 h-5 w-5 mr-2 mt-0.5 text-secondary">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Performance Analytics</h3>
                <p className="text-sm text-gray-600">Comprehensive reports on your lending portfolio performance, ROI, and default rates.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="shrink-0 h-5 w-5 mr-2 mt-0.5 text-secondary">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Advanced Risk Assessment</h3>
                <p className="text-sm text-gray-600">Detailed borrower insights including payment history and risk indicators for loan applications.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="shrink-0 h-5 w-5 mr-2 mt-0.5 text-secondary">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Priority Funding</h3>
                <p className="text-sm text-gray-600">Early access to high-quality loan opportunities before non-premium members.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="shrink-0 h-5 w-5 mr-2 mt-0.5 text-secondary">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Customizable Reports</h3>
                <p className="text-sm text-gray-600">Create and export tailored reports for your lending portfolio and tax purposes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Choose Your Plan</h2>
          
          <div className="flex items-center space-x-4 mb-4">
            <div 
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${selectedPlan === 'monthly' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setSelectedPlan('monthly')}
            >
              Monthly
            </div>
            <div 
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${selectedPlan === 'annual' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setSelectedPlan('annual')}
            >
              Annual
            </div>
          </div>
          
          <div className="mb-6 text-center">
            <h3 className="text-4xl font-bold text-gray-800">
              {selectedPlan === 'monthly' ? 'RM 9.99' : 'RM 99.99'}
              <span className="text-sm font-normal text-gray-500">
                /{selectedPlan === 'monthly' ? 'month' : 'year'}
              </span>
            </h3>
            
            {selectedPlan === 'annual' && (
              <p className="mt-2 text-green-500 text-sm font-medium">
                Save RM 19.89 annually
              </p>
            )}
          </div>
          
          <button 
            onClick={handleSubscribe}
            className="w-full bg-secondary hover:bg-secondaryLight text-white py-3 px-4 rounded-full font-medium transition-colors"
          >
            Subscribe Now
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Cancel anytime. No long-term commitment required.
          </p>
        </div>
      </div>
    </HalfCircleBackground>
  );
};

export default PremiumPage; 