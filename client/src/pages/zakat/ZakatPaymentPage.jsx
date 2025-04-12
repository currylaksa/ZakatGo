import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DocumentUploadStep from './DocumentUploadStep';
import ReviewInformationStep from './ReviewInformationStep';
import ZakatCalculationStep from './ZakatCalculationStep';
import CategorySelectionStep from './CategorySelectionStep';
import BlockchainPaymentStep from './BlockchainPaymentStep';
import PaymentConfirmation from './PaymentConfirmation';

const ZakatPaymentPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    personalInfo: { name: '', salary: '', deductions: '', assets: '' },
    documentData: { name: '', salary: '', deductions: '', assets: '' },
    zakatAmount: 0,
    selectedCategories: [],
    transactionDetails: {}
  });
  const [isLoading, setIsLoading] = useState(false);

  // Define all steps
  const steps = [
    { id: 1, name: 'Document Upload', icon: 'document-upload' },
    { id: 2, name: 'Review Information', icon: 'review' },
    { id: 3, name: 'Zakat Calculation', icon: 'calculator' },
    { id: 4, name: 'Category Selection', icon: 'categories' },
    { id: 5, name: 'Payment Process', icon: 'payment' },
    { id: 6, name: 'Confirmation', icon: 'check-circle' }
  ];

  const nextStep = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsLoading(false);
      // Scroll to top when changing steps
      window.scrollTo(0, 0);
    }, 400);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    // Scroll to top when changing steps
    window.scrollTo(0, 0);
  };

  // Deep merge for updating nested user data
  const updateUserData = (newData) => {
    setUserData(prevData => ({
      ...prevData,
      ...newData,
      personalInfo: {
        ...prevData.personalInfo,
        ...(newData.personalInfo || {})
      },
      documentData: {
        ...prevData.documentData,
        ...(newData.documentData || {})
      }
    }));
  };

  // Icon renderer for step indicator
  const renderIcon = (icon) => {
    switch (icon) {
      case 'document-upload':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15V3M12 3L8 7M12 3L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 17V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'review':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 11H15M12 15H15M9 11H9.01M9 15H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'calculator':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 12H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 17H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'categories':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 4H5C4.44772 4 4 4.44772 4 5V9C4 9.55228 4.44772 10 5 10H9C9.55228 10 10 9.55228 10 9V5C10 4.44772 9.55228 4 9 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M19 4H15C14.4477 4 14 4.44772 14 5V9C14 9.55228 14.4477 10 15 10H19C19.5523 10 20 9.55228 20 9V5C20 4.44772 19.5523 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 14H5C4.44772 14 4 14.4477 4 15V19C4 19.5523 4.44772 20 5 20H9C9.55228 20 10 19.5523 10 19V15C10 14.4477 9.55228 14 9 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M19 14H15C14.4477 14 14 14.4477 14 15V19C14 19.5523 14.4477 20 15 20H19C19.5523 20 20 19.5523 20 19V15C20 14.4477 19.5523 14 19 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'payment':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 15H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M15 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'check-circle':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const renderStep = () => {
    const props = {
      nextStep,
      prevStep,
      userData,
      updateUserData,
      isLoading,
      setIsLoading
    };

    switch (currentStep) {
      case 1:
        return <DocumentUploadStep {...props} />;
      case 2:
        return <ReviewInformationStep {...props} />;
      case 3:
        return <ZakatCalculationStep {...props} />;
      case 4:
        return <CategorySelectionStep {...props} />;
      case 5:
        return <BlockchainPaymentStep {...props} />;
      case 6:
        return <PaymentConfirmation userData={userData} />;
      default:
        return <DocumentUploadStep {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with logo */}
        <div className="text-center mb-10">
          <div className="inline-block p-2 bg-white rounded-full shadow-md mb-4">
            <div className="bg-green-600 rounded-full p-3">
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-green-800">ZakatGo Payment System</h1>
          <p className="mt-2 text-gray-600">Simplifying your Zakat payment journey</p>
        </div>

        {/* Main content card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Progress bar */}
          {currentStep <= 6 && (
            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="flex flex-wrap items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  Step {currentStep}: {steps.find(step => step.id === currentStep)?.name}
                </h2>
                <p className="text-sm text-gray-500">{currentStep} of {steps.length}</p>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div 
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${(currentStep / (steps.length)) * 100}%` }}>
                </div>
              </div>

              {/* Steps indicator */}
              <div className="hidden md:flex justify-between">
              {steps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      step.id < currentStep 
                        ? 'bg-green-600 border-green-600 text-white' 
                        : step.id === currentStep 
                          ? 'bg-white border-green-600 text-green-600' 
                          : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {step.id < currentStep ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        renderIcon(step.icon)
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${
                      step.id <= currentStep ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step content with animation */}
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Support information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help? <a href="#" className="text-green-600 hover:text-green-700 font-medium">Contact support</a> or call our helpline at +60 12-345-6789
          </p>
        </div>
      </div>
    </div>
  );
};

export default ZakatPaymentPage;
