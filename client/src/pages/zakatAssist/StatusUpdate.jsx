import React, { useEffect } from 'react';

const StatusUpdate = ({ status, onSuccess }) => {

  useEffect(() => {
    // When the status becomes 'approved', trigger the onSuccess callback
    // after a short delay to allow the user to read the message.
    if (status === 'approved') {
      console.log("Status is approved, scheduling move to next step."); // Debugging
      const timer = setTimeout(() => {
        onSuccess();
      }, 2500); // 2.5-second delay before moving to QR code step

      // Cleanup function to clear the timer if the component unmounts
      // or if the status changes before the timer fires.
      return () => {
        console.log("Clearing approval timer."); // Debugging
        clearTimeout(timer);
      };
    }
  }, [status, onSuccess]); // Dependencies for the effect

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
          message: 'We regret to inform you that your application could not be approved at this time. This may be due to eligibility criteria or missing information.',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-400',
          nextSteps: "If you believe this is an error or wish to understand the reason, please contact our support team.",
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
        </div>
      </div>

      {details.nextSteps && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
           <h4 className="font-semibold text-gray-700 mb-2">What's Next?</h4>
           <p className="text-sm text-gray-600">{details.nextSteps}</p>
           {details.showContact && (
               <div className="mt-4">
                   <button
                      onClick={() => window.location.href = 'mailto:support@zakatgo.com'}
                      className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                   >
                      Contact Support
                   </button>
               </div>
           )}
        </div>
      )}
    </div>
  );
};

export default StatusUpdate;
