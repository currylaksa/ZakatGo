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
    personalInfo: {},
    documentData: {},
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

  const updateUserData = (newData) => {
    setUserData({ ...userData, ...newData });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <DocumentUploadStep 
                 nextStep={nextStep} 
                 updateUserData={updateUserData} 
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
        return <DocumentUploadStep nextStep={nextStep} updateUserData={updateUserData} />;
    }
  };

  return (
    <div>
      <h1>Zakat Payment System</h1>
      <div>
        <div>
          <ul>
            <li className={currentStep === 1 ? 'active' : ''}>Document Upload</li>
            <li className={currentStep === 2 ? 'active' : ''}>Review Information</li>
            <li className={currentStep === 3 ? 'active' : ''}>Zakat Calculation</li>
            <li className={currentStep === 4 ? 'active' : ''}>Category Selection</li>
            <li className={currentStep === 5 ? 'active' : ''}>Payment Process</li>
            <li className={currentStep === 6 ? 'active' : ''}>Confirmation</li>
          </ul>
        </div>
        <div>
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default ZakatPaymentPage;
