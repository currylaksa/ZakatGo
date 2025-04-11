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
    console.log("Form Data Submitted:", formData);
    setApplicationData(formData);
    setApplicationStatus('pending');
    setCurrentStep(2);

    // Simulate backend processing and status update
    setTimeout(() => {
      const isApproved = Math.random() > 0.3; // 70% chance of approval
      setApplicationStatus(isApproved ? 'approved' : 'rejected');
    }, 3000);
  };

  const handleSuccess = () => {
    console.log("Application Approved, moving to Step 3");
    setCurrentStep(3);
  };

  // The 3 steps of the Zakat Assistance process
  const steps = [
    { number: 1, label: "Application Form", icon: "📝" },
    { number: 2, label: "Application Status", icon: "🔍" },
    { number: 3, label: "QR Code", icon: "📱" }
  ];
  
  // Calculate current progress percentage
  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="bg-green-500 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">ℹ️</span>
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">ZakatGo Assistance System</h1>
          <p className="text-gray-600">Simplifying your Zakat assistance journey</p>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Progress Indicator Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-700">
                Step {currentStep}: {steps[currentStep-1].label}
              </h2>
              <span className="text-sm text-gray-500">{currentStep} of {steps.length}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-500 ease-in-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            {/* Step Indicators */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {steps.map((step) => {
                // Determine if this step is active, completed, or upcoming
                const isActive = step.number === currentStep;
                const isCompleted = step.number < currentStep;
                const isUpcoming = step.number > currentStep;
                
                return (
                  <div key={step.number} className="flex flex-col items-center">
                    <div 
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center mb-2
                        ${isActive ? 'bg-green-500 text-white' : 
                          isCompleted ? 'bg-green-100 text-green-700 border border-green-500' : 
                          'bg-gray-100 text-gray-400'}
                      `}
                    >
                      {isCompleted ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span>{step.number}</span>
                      )}
                    </div>
                    <span className={`text-sm text-center ${
                      isActive ? 'text-green-600 font-medium' : 
                      isCompleted ? 'text-green-600' : 
                      'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {currentStep === 1 && (
              <ApplicationForm onSubmit={handleFormSubmit} />
            )}
            
            {currentStep === 2 && (
              <StatusUpdate status={applicationStatus} onSuccess={handleSuccess} />
            )}
            
            {currentStep === 3 && applicationStatus === 'approved' && (
              <QRCodeGenerator applicantData={applicationData} />
            )}
            
            {currentStep === 3 && applicationStatus !== 'approved' && (
              <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100">
                  <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-700 mb-2">Error: Cannot Generate QR Code</h3>
                <p className="text-red-600 mb-4">Your application has not been approved. Please contact support for more information.</p>
                <button 
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150"
                >
                  Return to Status
                </button>
              </div>
            )}
          </div>
          
          {/* Info Box Section */}
          <div className="bg-blue-50 p-4 border-t border-blue-100">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  If approved, you will receive a QR code that can be used at partner stores like Speed99 for Zakat-funded purchases.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Help Box */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Assistance?</h3>
          <p className="text-gray-600 mb-4">If you have any questions about your application or the process, our support team is available to help.</p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:support@zakatgo.com" className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-md hover:bg-green-200 transition duration-150">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Support
            </a>
            <a href="tel:+60123456789" className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-md hover:bg-green-200 transition duration-150">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Helpline
            </a>
          </div>
        </div>
        
        {/* Simple Footer */}
        <footer className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ZakatGo. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default ZakatAssistPage;
