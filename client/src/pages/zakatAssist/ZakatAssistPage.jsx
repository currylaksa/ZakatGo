import React, { useState, useEffect } from 'react';
import ApplicationForm from './ApplicationForm';
import StatusUpdate from './StatusUpdate';
import QRCodeGenerator from './QRCodeGenerator';

const ZakatAssistPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState(null);
  // Simulate status: 'not_submitted', 'pending', 'approved', 'rejected'
  const [applicationStatus, setApplicationStatus] = useState('not_submitted');
  const [loadingStatus, setLoadingStatus] = useState(false);

  // Steps definition - moved outside component body for better performance
  const steps = [
    { number: 1, label: "Application Form", icon: "📝", description: "Fill in your details and upload required documents" },
    { number: 2, label: "Application Status", icon: "🔍", description: "Check your application review status" },
    { number: 3, label: "QR Code", icon: "📱", description: "Receive your payment QR code" }
  ];

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const step = parseInt(window.location.hash.replace('#step', '')) || 1;
      if (step >= 1 && step <= 3) {
        setCurrentStep(step);
      }
    };

    window.addEventListener('popstate', handlePopState);
    // Set initial hash if not present
    if (!window.location.hash) {
      window.location.hash = `#step${currentStep}`;
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL hash when step changes
  useEffect(() => {
    window.location.hash = `#step${currentStep}`;
  }, [currentStep]);

  const handleFormSubmit = (formData) => {
    console.log("Form Data Submitted:", formData);
    setApplicationData(formData);
    setApplicationStatus('pending');
    setCurrentStep(2);
    setLoadingStatus(true);

    // Simulate backend processing and status update
    setTimeout(() => {
      const isApproved = Math.random() > 0.3; // 70% chance of approval
      setApplicationStatus(isApproved ? 'approved' : 'rejected');
      setLoadingStatus(false);
    }, 3000);
  };

  const handleSuccess = () => {
    console.log("Application Approved, moving to Step 3");
    setCurrentStep(3);
  };

  const handleRetry = () => {
    setCurrentStep(1);
    setApplicationStatus('not_submitted');
  };
  
  // Calculate current progress percentage
  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg transform transition-transform hover:scale-105 duration-300">
  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
</div>
          <h1 className="text-4xl font-bold text-green-800 mb-3">Zakat Assistance System</h1>
          <p className="text-gray-600 text-lg">Apply for Zakat assistance. If approved, receive a QR code to get essential goods at partnered stores.</p>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:shadow-xl">
          {/* Progress Indicator Section */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-green-800">
                Step {currentStep}: {steps[currentStep-1].label}
              </h2>
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">{currentStep} of {steps.length}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 ease-in-out"
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
                  <div key={step.number} className="flex flex-col items-center group">
                    <div 
                      className={`
                        w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                        ${isActive ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md' : 
                          isCompleted ? 'bg-green-100 text-green-700 border-2 border-green-500' : 
                          'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-500'}
                      `}
                    >
                      {isCompleted ? (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-lg">{step.icon}</span>
                      )}
                    </div>
                    <span className={`text-sm font-medium text-center ${
                      isActive ? 'text-green-700' : 
                      isCompleted ? 'text-green-600' : 
                      'text-gray-400 group-hover:text-gray-600'
                    }`}>
                      {step.label}
                    </span>
                    <span className="text-xs text-center mt-1 text-gray-500 opacity-80 max-w-xs">
                      {step.description}
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
              <StatusUpdate 
                status={applicationStatus} 
                onSuccess={handleSuccess} 
                isLoading={loadingStatus}
              />
            )}
            
            {currentStep === 3 && applicationStatus === 'approved' && (
              <QRCodeGenerator applicantData={applicationData} />
            )}
            
            {currentStep === 3 && applicationStatus !== 'approved' && (
              <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100 animate-pulse">
                  <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-red-700 mb-2">Cannot Generate QR Code</h3>
                <p className="text-red-600 mb-6">Your application has not been approved. Please contact support for more information or try again.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    Return to Status
                  </button>
                  <button 
                    onClick={handleRetry}
                    className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    Start New Application
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Info Box Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-t border-blue-100">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="bg-blue-100 rounded-full p-2 border border-blue-200">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-md font-medium text-blue-800 mb-1">Important Information</h4>
                <p className="text-sm text-blue-700">
                  If approved, you will receive a QR code that can be used at partner stores like Speed99 for Zakat-funded purchases. The QR code is valid for 30 days from issuance.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Help Box */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Need Assistance?
          </h3>
          <p className="text-gray-600 mb-4">If you have any questions about your application or the process, our support team is available to help.</p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:support@zakatgo.com" className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-md hover:bg-green-200 transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Support
            </a>
            <a href="tel:+60123456789" className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700
 text-sm font-medium rounded-md hover:bg-green-200 transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Helpline
            </a>
            <a href="#" className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-md hover:bg-green-200 transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Live Chat
            </a>
          </div>
        </div>
        
        {/* FAQ Accordion - New Addition */}
        <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-green-50 border-b border-green-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Frequently Asked Questions
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            <details className="p-6 group">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span>How long does the application review process take?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </summary>
              <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                Most applications are reviewed within 24-48 hours. During peak periods, it may take up to 72 hours. You'll receive a notification once your application has been processed.
              </p>
            </details>
            <details className="p-6 group">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span>What documents do I need to upload?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </summary>
              <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                Required documents typically include a valid ID card, recent payslips (if employed), proof of address, and any additional documents that demonstrate financial need.
              </p>
            </details>
            <details className="p-6 group">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span>How long is the QR code valid?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </summary>
              <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                The QR code remains valid for 30 days from the date of issuance. After expiration, you may need to submit a new application if you require further assistance.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZakatAssistPage;
