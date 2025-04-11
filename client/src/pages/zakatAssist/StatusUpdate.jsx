import React, { useEffect, useState } from 'react';

const StatusUpdate = ({ status: initialStatus, onSuccess, onRetry }) => {
  // Add local state to manage status transitions and retry functionality
  const [status, setStatus] = useState(initialStatus);
  const [retryCount, setRetryCount] = useState(0);
  const [processingError, setProcessingError] = useState(null);

  // Reset processing error when status changes
  useEffect(() => {
    setStatus(initialStatus);
    setProcessingError(null);
  }, [initialStatus]);

  useEffect(() => {
    // Handle status transitions
    if (status === 'approved') {
      console.log("Status is approved, scheduling move to next step.");
      const timer = setTimeout(() => {
        onSuccess();
      }, 2500); // 2.5-second delay before moving to QR code step

      return () => {
        console.log("Clearing approval timer.");
        clearTimeout(timer);
      };
    }
  }, [status, onSuccess]);

  // Function to handle retry attempts
  const handleRetry = () => {
    console.log("Retrying application processing...");
    setProcessingError(null);
    setRetryCount(prevCount => prevCount + 1);
    
    // In a real app, you would call your API here to reprocess the application
    // For this example, we'll simulate success after retry
    setStatus('processing');
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Force approval on retry for demo purposes
      // In production, replace this with actual API call
      setStatus('approved');
    }, 2000);
    
    // If onRetry is provided, call it
    if (onRetry) {
      onRetry();
    }
  };

  const getStatusDetails = () => {
    switch (status) {
      case 'pending':
        return {
          icon: '⏳',
          title: 'Pending Review',
          message: 'Your application has been received and is currently being reviewed by our team. This usually takes 1-3 business days. We appreciate your patience.',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-400',
          nextSteps: "We'll notify you via email (if provided) once the review is complete. You can also check back here for updates."
        };
      case 'processing':
        return {
          icon: '⚙️',
          title: 'Processing Application',
          message: 'We are currently processing your application. This should only take a moment.',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-400',
          nextSteps: "Please wait while we verify your information..."
        };
      case 'approved':
        return {
          icon: '✅',
          title: 'Application Approved!',
          message: 'Congratulations! Your application for Zakat assistance has been approved. We are now generating your unique QR code.',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-400',
          nextSteps: 'Please wait while we prepare your QR code...'
        };
      case 'rejected':
        return {
          icon: '❌',
          title: 'Application Rejected',
          message: processingError || 'We regret to inform you that your application could not be approved at this time. This may be due to eligibility criteria or missing information.',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-400',
          nextSteps: "Please verify your documents and information, then try again.",
          showRetry: true,
          showContact: true // Flag to show contact button
        };
       case 'not_submitted':
         return {
          icon: '📄',
          title: 'Not Submitted',
          message: 'You have not submitted an application yet. Please complete the application form first.',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-400',
          nextSteps: 'Go back to Step 1 to start your application.'
         };
      default:
        return {
          icon: '❓',
          title: 'Unknown Status',
          message: 'There was an issue retrieving your application status. Please try again later or contact support.',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-400',
          nextSteps: 'Please contact support if this issue persists.',
          showRetry: true,
          showContact: true
        };
    }
  };

  const details = getStatusDetails();

  return (
    <div className="max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 2: Application Status</h2>

      <div className={`p-6 rounded-lg border ${details.borderColor} ${details.bgColor} shadow-md`}>
        <div className="flex flex-col items-center">
          <span className="text-4xl mb-3">{details.icon}</span>
          <h3 className={`text-xl font-bold mb-2 ${details.textColor}`}>{details.title}</h3>
          <p className={`text-base ${details.textColor}`}>{details.message}</p>
          {status === 'rejected' && retryCount > 0 && (
            <p className="mt-2 text-sm text-red-700">
              Previous attempts: {retryCount}. Please ensure your documents are clear and information is accurate.
            </p>
          )}
        </div>
      </div>

      {details.nextSteps && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
           <h4 className="font-semibold text-gray-700 mb-2">What's Next?</h4>
           <p className="text-sm text-gray-600">{details.nextSteps}</p>
           <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
             {details.showRetry && (
               <button
                 onClick={handleRetry}
                 className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
               >
                 Retry Application
               </button>
             )}
             {details.showContact && (
               <button
                 onClick={() => window.location.href = 'mailto:support@zakatgo.com'}
                 className="px-5 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
               >
                 Contact Support
               </button>
             )}
           </div>
        </div>
      )}
      
      {/* Add a hint about document quality for better user experience */}
      <div className="mt-4 text-sm text-gray-600">
        <p>For best results, please ensure your uploaded documents are:</p>
        <ul className="list-disc text-left ml-8 mt-2">
          <li>Clear and legible</li>
          <li>Properly oriented</li>
          <li>Complete with all necessary information</li>
        </ul>
      </div>
    </div>
  );
};

export default StatusUpdate;
