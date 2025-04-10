import React, { useEffect } from 'react';

const StatusUpdate = ({ status, onSuccess }) => {
  useEffect(() => {
    // When the status becomes 'approved', trigger the onSuccess callback to move to step 3
    if (status === 'approved') {
      const timer = setTimeout(() => {
        onSuccess();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [status, onSuccess]);

  const renderStatusMessage = () => {
    switch (status) {
      case 'not_submitted':
        return 'Application has not been submitted yet.';
      case 'pending':
        return 'Your application is being reviewed. This usually takes 1-3 business days.';
      case 'approved':
        return 'Congratulations! Your application has been approved. Generating your QR code...';
      case 'rejected':
        return 'Unfortunately, your application has been rejected. Please contact our support team for more information.';
      default:
        return 'Application status unknown.';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <div>
      <h2>Step 2: Application Status</h2>
      <div>
        <div>
          <span>{getStatusIcon()}</span>
          <h3>Status: {status.charAt(0).toUpperCase() + status.slice(1)}</h3>
          <p>{renderStatusMessage()}</p>
        </div>
        
        {status === 'rejected' && (
          <div>
            <h4>What's Next?</h4>
            <p>You can contact our support team at support@zakatgo.com for more information about your application.</p>
            <button>Contact Support</button>
          </div>
        )}
        
        {status === 'pending' && (
          <div>
            <h4>What's Next?</h4>
            <p>We'll notify you via email when your application status changes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusUpdate;
