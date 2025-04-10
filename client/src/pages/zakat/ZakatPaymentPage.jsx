import React, { useState } from 'react';
import DocumentUploadStep from './DocumentUploadStep';
import ReviewInformationStep from './ReviewInformationStep';
import ZakatCalculationStep from './ZakatCalculationStep';
import CategorySelectionStep from './CategorySelectionStep';
import BlockchainPaymentStep from './BlockchainPaymentStep';
import PaymentConfirmation from './PaymentConfirmation';

const ZakatPaymentPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    personalInfo: { name: '', salary: '', deductions: '', assets: '' }, // Initialize with empty strings
    documentData: { name: '', salary: '', deductions: '', assets: '' }, // Initialize from potential AI extraction
    zakatAmount: 0,
    selectedCategories: [],
    transactionDetails: {}
  });

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Ensure updateUserData merges deeply for nested objects like personalInfo
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


  const steps = [
    'Document Upload',
    'Review Information',
    'Zakat Calculation',
    'Category Selection',
    'Payment Process',
    'Confirmation'
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <DocumentUploadStep
                 nextStep={nextStep}
                 updateUserData={updateUserData}
                 userData={userData} // Pass existing data in case user goes back
               />;
      case 2:
        return <ReviewInformationStep
                 nextStep={nextStep}
                 prevStep={prevStep}
                 userData={userData}
                 updateUserData={updateUserData}
               />;
      case 3:
        return <ZakatCalculationStep
                 nextStep={nextStep}
                 prevStep={prevStep}
                 userData={userData}
                 updateUserData={updateUserData}
               />;
      case 4:
        return <CategorySelectionStep
                 nextStep={nextStep}
                 prevStep={prevStep}
                 userData={userData}
                 updateUserData={updateUserData}
               />;
      case 5:
        return <BlockchainPaymentStep
                 nextStep={nextStep}
                 prevStep={prevStep}
                 userData={userData}
                 updateUserData={updateUserData}
               />;
      case 6:
        return <PaymentConfirmation userData={userData} />;
      default:
        return <DocumentUploadStep nextStep={nextStep} updateUserData={updateUserData} userData={userData}/>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-6">Zakat Payment System</h1>
          {/* Step Indicator */}
          {currentStep <= 5 && (
            <div className="mb-6">
              <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 sm:text-base">
                {steps.slice(0, 5).map((step, index) => (
                  <li key={step} className={`flex md:w-full items-center ${index + 1 < currentStep ? 'text-green-600' : ''} ${index + 1 === currentStep ? 'text-blue-600' : ''} ${index !== steps.length - 2 ? 'sm:after:content-[\'\'] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10' : ''} ${index + 1 < currentStep ? 'sm:after:border-green-300' : ''} ${index + 1 === currentStep ? 'sm:after:border-blue-200' : ''}`}>
                    <span className={`flex items-center ${index !== steps.length - 2 ? 'sm:after:hidden' : ''}`}>
                      <svg className={`w-4 h-4 me-2.5 sm:w-5 sm:h-5 ${index + 1 <= currentStep ? 'text-green-600' : 'text-gray-400'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                      </svg>
                      {step}
                    </span>
                  </li>
                ))}
                  <li className={`flex items-center ${currentStep === 6 ? 'text-green-600' : ''}`}>
                     <svg className={`w-4 h-4 me-2.5 sm:w-5 sm:h-5 ${currentStep === 6 ? 'text-green-600' : 'text-gray-400'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                         <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                     </svg>
                    {steps[5]}
                 </li>
              </ol>
            </div>
          )}
        </div>
        <div className="p-6 md:p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default ZakatPaymentPage;
