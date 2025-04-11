import React, { useState } from 'react';
import ApplicationForm from './ApplicationForm';
import StatusUpdate from './StatusUpdate';
import QRCodeGenerator from './QRCodeGenerator';

const ZakatAssistPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState(null);
  // Simulate status: 'not_submitted', 'pending', 'approved', 'rejected'
  const [applicationStatus, setApplicationStatus] = useState('not_submitted');

  const handleFormSubmit = (formData) => {
    console.log("Form Data Submitted:", formData); // For debugging
    setApplicationData(formData);
    setApplicationStatus('pending'); // Set status to pending
    setCurrentStep(2); // Move to step 2

    // Simulate backend processing and status update
    setTimeout(() => {
      // Randomly approve or reject for demo purposes
      const isApproved = Math.random() > 0.3; // 70% chance of approval
      console.log("Simulated Backend Response:", isApproved ? 'approved' : 'rejected'); // For debugging
      setApplicationStatus(isApproved ? 'approved' : 'rejected');
      // No need to automatically move to step 3 here; StatusUpdate handles it on 'approved'
    }, 3000); // 3-second delay
  };

  const handleSuccess = () => {
    console.log("Application Approved, moving to Step 3"); // For debugging
    setCurrentStep(3); // Move to Step 3 when StatusUpdate signals success
  };

  // Function to determine step styling
  const getStepClass = (stepNumber) => {
    let baseClass = "flex items-center px-6 py-3 rounded-lg";
    if (stepNumber === currentStep) {
      return `${baseClass} bg-blue-600 text-white font-semibold shadow-md`;
    } else if (stepNumber < currentStep) {
      return `${baseClass} bg-green-100 text-green-700`;
    } else {
      return `${baseClass} bg-gray-200 text-gray-600`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <h1 className="text-3xl font-bold text-center">Zakat Assistance Application System</h1>
          <p className="text-center text-indigo-100 mt-1">Apply for Zakat assistance and, if approved, receive a QR code to get essential goods at partnered stores.</p>
        </div>

        {/* Main Content Area */}
        <div className="p-6 sm:p-10">
          {/* Step Indicator */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Application Process</h2>
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className={getStepClass(1)}>
                <span className="mr-3 text-lg font-bold">1</span>
                <span>Application Form</span>
              </div>
               <span className="hidden sm:block text-gray-400 font-bold">&rarr;</span>
              <div className={getStepClass(2)}>
                <span className="mr-3 text-lg font-bold">2</span>
                <span>Application Status</span>
              </div>
               <span className="hidden sm:block text-gray-400 font-bold">&rarr;</span>
              <div className={getStepClass(3)}>
                <span className="mr-3 text-lg font-bold">3</span>
                <span>QR Code</span>
              </div>
            </div>
          </div>

          {/* Render Current Step Component */}
          <div className="mt-8 border-t pt-8">
            {currentStep === 1 && <ApplicationForm onSubmit={handleFormSubmit} />}
            {currentStep === 2 && <StatusUpdate status={applicationStatus} onSuccess={handleSuccess} />}
            {currentStep === 3 && applicationStatus === 'approved' && <QRCodeGenerator applicantData={applicationData} />}
            {/* Fallback or message if state is inconsistent */}
            {currentStep === 3 && applicationStatus !== 'approved' && (
                 <div className="text-center text-red-600">Error: Cannot generate QR code. Application not approved.</div>
            )}
          </div>
        </div>
      </div>
       {/* Footer */}
        <footer className="text-center py-4 text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ZakatGo. All rights reserved.
        </footer>
    </div>
  );
};

export default ZakatAssistPage;
