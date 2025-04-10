import React, { useState } from 'react';
import ApplicationForm from './ApplicationForm';
import StatusUpdate from './StatusUpdate';
import QRCodeGenerator from './QRCodeGenerator';

const ZakatAssistPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState('not_submitted');

  const handleFormSubmit = (formData) => {
    // In a real application, you would submit the data to a backend API
    setApplicationData(formData);
    setApplicationStatus('pending');
    setCurrentStep(2);

    // Simulate a backend response (in real app, this would be an API response)
    setTimeout(() => {
      // For demo purposes, we'll always approve
      setApplicationStatus('approved');
    }, 3000);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ApplicationForm onSubmit={handleFormSubmit} />;
      case 2:
        return (
          <StatusUpdate 
            status={applicationStatus} 
            onSuccess={() => setCurrentStep(3)} 
          />
        );
      case 3:
        return <QRCodeGenerator applicantData={applicationData} />;
      default:
        return <ApplicationForm onSubmit={handleFormSubmit} />;
    }
  };

  return (
    <div>
      <h1>Zakat Assistance System</h1>
      <div>
        <div>
          <h2>Application Process</h2>
          <ul>
            <li className={currentStep === 1 ? 'active' : ''}>Step 1: Complete Application Form</li>
            <li className={currentStep === 2 ? 'active' : ''}>Step 2: Application Status</li>
            <li className={currentStep === 3 ? 'active' : ''}>Step 3: QR Code Generation</li>
          </ul>
        </div>
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default ZakatAssistPage;
