import React, { useState, useEffect } from 'react';

const QRCodeGenerator = ({ applicantData }) => {
  const [qrCode, setQrCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would generate this on the server side
    // For this example, we're simulating the QR code with ASCII art
    const generateQRCode = () => {
      // Create a unique reference ID for the applicant
      const refId = 'ZKT' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      
      // In a real app, this would be a real QR code
      setQrCode(refId);
      setIsLoading(false);
    };

    // Simulate a server delay
    const timer = setTimeout(() => {
      generateQRCode();
    }, 1500);

    return () => clearTimeout(timer);
  }, [applicantData]);

  if (isLoading) {
    return (
      <div>
        <h2>Step 3: Generating Your QR Code</h2>
        <p>Please wait while we generate your unique QR code...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Step 3: Your QR Code</h2>
      <div>
        <h3>Congratulations! Your Zakat assistance application has been approved.</h3>
        <p>Below is your unique QR code that can be used at approved stores like Speed99 for Zakat payments:</p>
        
        <div>
          {/* In a real app, you would use a QR code library component here */}
          <div style={{ 
            border: '1px solid black', 
            padding: '20px', 
            display: 'inline-block',
            textAlign: 'center'
          }}>
            <div>QR Code Placeholder</div>
            <div>Reference ID: {qrCode}</div>
          </div>
        </div>
        
        <div>
          <h4>How to use your QR code:</h4>
          <ol>
            <li>Save or print this QR code</li>
            <li>Present it at any of our partner stores (e.g., Speed99)</li>
            <li>The store will scan your code and process your purchase using Zakat funds</li>
            <li>You'll receive a receipt for your transaction</li>
          </ol>
        </div>
        
        <div>
          <button onClick={() => window.print()}>Print QR Code</button>
          <button>Download QR Code</button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
