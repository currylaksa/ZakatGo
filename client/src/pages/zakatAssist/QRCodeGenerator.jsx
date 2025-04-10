import React, { useState, useEffect } from 'react';
// Consider using a library like 'qrcode.react' for actual QR code generation
// import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ applicantData }) => {
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate backend QR code generation
    setIsLoading(true);
    const generateQRCodeData = () => {
      // Create a unique reference based on applicant data (example only)
      const refId = `ZKT-${applicantData?.icNumber?.slice(-4) || 'XXXX'}-${Date.now().toString().slice(-6)}`;
      // In a real app, this value would likely come from a secure backend API response
      // and contain information needed for verification at the store.
      const dataToEncode = JSON.stringify({
          ref: refId,
          name: applicantData?.fullName, // Include some relevant data if needed
          timestamp: new Date().toISOString()
      });
      setQrCodeValue(dataToEncode); // This value would be used by a QR library
      setIsLoading(false);
      console.log("Generated QR Code Data:", dataToEncode); // Debugging
    };

    // Simulate delay
    const timer = setTimeout(generateQRCodeData, 1500); // 1.5-second delay

    return () => clearTimeout(timer);
  }, [applicantData]); // Re-run if applicantData changes (though unlikely in this flow)

  const handlePrint = () => {
     // Use browser print functionality
     window.print();
  };

  const handleDownload = () => {
      // This requires generating the QR code as an image (e.g., using a canvas from a QR library)
      // Example using 'qrcode.react' canvas:
      const canvas = document.getElementById('qr-code-canvas'); // Assuming QRCode component renders a canvas with this ID
      if (canvas) {
        const pngUrl = canvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream'); // Prompt download
        let downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `ZakatGo_QRCode_${qrCodeValue.substring(8, 16)}.png`; // Example filename
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
         console.log("QR Code download initiated."); // Debugging
      } else {
         console.error("Could not find QR code canvas element for download.");
         alert("Could not download QR Code. Please try printing instead.");
      }
  };


  if (isLoading) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 3: Generating Your QR Code</h2>
         <div className="flex justify-center items-center space-x-2 text-gray-600">
             <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
            <span>Please wait while we generate your unique QR code...</span>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto text-center p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 3: Your Zakat Assistance QR Code</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-green-700 mb-3">Application Approved!</h3>
        <p className="text-gray-600 mb-5">Use this QR code at partner stores (like Speed99) for Zakat-funded purchases.</p>

        <div className="flex justify-center mb-5">
          {/* --- QR Code Placeholder --- */}
          {/* Replace this div with a real QR Code component */}
           {/* Example using qrcode.react: */}
           {/*
           <QRCode
             id="qr-code-canvas" // ID for download functionality
             value={qrCodeValue}
             size={200} // Adjust size as needed
             level={"H"} // Error correction level
             includeMargin={true}
           />
           */}
           {/* --- Simple Placeholder --- */}
            <div className="w-48 h-48 bg-gray-200 border border-gray-400 flex flex-col items-center justify-center text-gray-500 text-sm">
               <span>[QR Code Area]</span>
               <span className="text-xs mt-1">(Install `qrcode.react`)</span>
               <span className="text-xs mt-1 break-all p-1">Ref: {JSON.parse(qrCodeValue).ref}</span>
            </div>
           {/* --- End Placeholder --- */}
        </div>

         {/* Reference ID Display */}
         <p className="text-sm text-gray-500 mb-6">Reference ID: <span className="font-mono bg-gray-100 px-1 rounded">{JSON.parse(qrCodeValue).ref}</span></p>


        <div className="text-left bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">How to use your QR code:</h4>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
            <li>Save or print this QR code page.</li>
            <li>Present it to the cashier at partner stores.</li>
            <li>The cashier will scan the code to apply Zakat funds to your purchase.</li>
            <li>Keep the receipt for your records.</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
             onClick={handlePrint}
             className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out flex items-center justify-center"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
             </svg>
            Print QR Code
          </button>
          <button
             onClick={handleDownload}
             className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out flex items-center justify-center"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
             </svg>
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
