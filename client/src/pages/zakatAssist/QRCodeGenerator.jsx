import React, { useState, useEffect, useRef } from 'react';
import qrCodeImage from './QRCode.png'; // Placeholder for QR code image

const QRCodeGenerator = ({ applicantData }) => {
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('all');
  const [showStoreList, setShowStoreList] = useState(false);
  const qrCodeRef = useRef(null);

  // Malaysian states
  const malaysianStates = [
    'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 
    'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 
    'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'
  ];

  // Sample store data - replace with actual data
  const storeData = [
    {
      name: 'Speed99',
      states: ['Selangor', 'Kuala Lumpur', 'Johor', 'Pulau Pinang'],
      itemCategories: ['Groceries', 'Household Items', 'Personal Care', 'School Supplies']
    },
    {
      name: 'EcoShop',
      states: ['Selangor', 'Kuala Lumpur', 'Negeri Sembilan', 'Melaka'],
      itemCategories: ['Groceries', 'Household Items', 'Essential Food Items']
    },
    {
      name: 'Billion',
      states: ['Johor', 'Pahang', 'Perak', 'Kedah'],
      itemCategories: ['Clothing', 'Household Items', 'Baby Products']
    },
    {
      name: 'Mydin',
      states: ['Sabah', 'Sarawak', 'Terengganu', 'Kelantan'],
      itemCategories: ['Groceries', 'Traditional Food Items', 'Household Items', 'Fresh Produce']
    },
    {
      name: 'Watsons',
      states: ['Selangor', 'Kuala Lumpur', 'Pulau Pinang', 'Johor', 'Sabah', 'Sarawak'],
      itemCategories: ['Personal Care', 'Hygiene Products', 'Essential Medicines']
    }
  ];

  useEffect(() => {
    // Simulate backend QR code generation
    setIsLoading(true);
    const generateQRCodeData = () => {
      // Create a unique reference based on applicant data (example only)
      const refId = `ZKT-${applicantData?.icNumber?.slice(-4) || 'XXXX'}-${Date.now().toString().slice(-6)}`;
      // In a real app, this value would likely come from a secure backend API response
      const dataToEncode = JSON.stringify({
          ref: refId,
          name: applicantData?.fullName, // Include some relevant data if needed
          timestamp: new Date().toISOString()
      });
      setQrCodeValue(dataToEncode); // This value would be used by a QR library
      setIsLoading(false);
    };

    // Simulate delay
    const timer = setTimeout(generateQRCodeData, 1500); // 1.5-second delay

    return () => clearTimeout(timer);
  }, [applicantData]);

  // Print only the QR code with some context
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const refId = qrCodeValue ? JSON.parse(qrCodeValue).ref : 'Unknown';
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>ZakatGo QR Code - ${refId}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 20px;
              text-align: center;
            }
            .qr-container {
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              background: white;
              margin-bottom: 20px;
            }
            .qr-image {
              width: 200px;
              height: 200px;
              margin: 0 auto;
            }
            .reference {
              font-family: monospace;
              padding: 4px 8px;
              background: #f1f1f1;
              border-radius: 4px;
              margin-top: 10px;
              display: inline-block;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h2 style="color: #2c7a7b; margin-bottom: 10px;">ZakatGo Assistance QR Code</h2>
            <img class="qr-image" src="${qrCodeImage}" alt="ZakatGo QR Code">
            <p style="margin-top: 10px;">Reference ID: <span class="reference">${refId}</span></p>
          </div>
          <p>Present this QR code at participating stores to utilize your Zakat assistance.</p>
          <button class="no-print" onclick="window.print(); window.close();" style="margin-top: 20px; padding: 8px 16px; background: #3182ce; color: white; border: none; border-radius: 4px; cursor: pointer;">Print QR Code</button>
        </body>
        </html>
      `);
      
      printWindow.document.close();
    } else {
      alert("Could not open print window. Please check your pop-up blocker settings.");
    }
  };

  // Download just the QR code image
  const handleDownload = () => {
    // Create an anchor element to download the original image
    const downloadLink = document.createElement('a');
    
    // Set the href to the original image source
    downloadLink.href = qrCodeImage;
    
    // Set the download attribute with a custom filename
    const refId = qrCodeValue ? JSON.parse(qrCodeValue).ref : 'Unknown';
    downloadLink.download = `ZakatGo_QRCode_${refId}.png`;
    
    // Append to the body, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Filter stores based on selected state
  const filteredStores = selectedState === 'all' 
    ? storeData 
    : storeData.filter(store => store.states.includes(selectedState));

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
    <div className="max-w-3xl mx-auto text-center p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 3: Your Zakat Assistance QR Code</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold text-green-700 mb-3">Application Approved!</h3>
        <p className="text-gray-600 mb-5">Use this QR code at partner stores for Zakat-funded purchases.</p>

        <div className="flex justify-center mb-5">
          {/* QR code image with ref */}
          <div ref={qrCodeRef}>
            <img 
              id="qr-code-image"
              src={qrCodeImage} // Placeholder for QR code image
              alt={`QR Code for ${JSON.parse(qrCodeValue).ref}`}
              className="w-48 h-48 border border-gray-200"
            />
          </div>
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

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
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

      {/* Partner Stores Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Partner Stores & Eligible Items
          </h3>
          <button 
            onClick={() => setShowStoreList(!showStoreList)}
            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {showStoreList ? 'Hide List' : 'Show List'}
          </button>
        </div>

        {showStoreList && (
          <>
            <div className="mb-4">
              <label htmlFor="state-filter" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Filter by State:
              </label>
              <select
                id="state-filter"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All States</option>
                {malaysianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredStores.length > 0 ? (
                filteredStores.map((store, index) => (
                  <div key={index} className="py-4">
                    <div className="flex justify-between items-start">
                      <h4 className="text-md font-medium text-gray-800">{store.name}</h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Approved</span>
                    </div>
                    
                    <div className="mt-2 text-left">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Available in: </span>
                        <span>{store.states.join(', ')}</span>
                      </p>
                      
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Eligible Items:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {store.itemCategories.map((category, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-gray-500">
                  No partner stores available in this state yet.
                </div>
              )}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Note:</span> You may use your Zakat assistance for daily necessities (生活用品) including groceries, household items, personal care products, school supplies, and essential clothing.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QRCodeGenerator;