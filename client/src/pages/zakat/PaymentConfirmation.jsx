import React from 'react';

const PaymentConfirmation = ({ userData }) => {
  const { transactionDetails = {}, selectedCategories = [], zakatAmount = 0 } = userData; // Default values
  const {
      transactionId = 'N/A',
      amount = 0, // RM amount
      ethAmount = 0, // ETH amount
      rmToEthRate = 0,
      timestamp = new Date().toISOString(), // Use current time if timestamp missing
      status = 'Unknown',
      categories = '' // Use stored category names if available
  } = transactionDetails;

  // Fallback if category names weren't stored in transactionDetails
   const categoryNames = categories || selectedCategories.map(category => category.name).join(', ');


  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold text-green-700">Payment Confirmation</h2>

      <div className="p-6 md:p-8 border border-green-200 bg-green-50 rounded-lg shadow-sm space-y-4 max-w-lg mx-auto">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
           <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
         </svg>

        <h3 className="text-xl font-semibold text-gray-800">Thank you for your contribution!</h3>
        <p className="text-gray-600">Your Zakat/donation payment has been processed successfully.</p>

        <div className="pt-4 border-t border-green-100 text-left space-y-2 text-sm">
          <h4 className="text-base font-medium text-gray-700 mb-2">Receipt Details:</h4>
          <p><strong className="text-gray-600">Transaction ID:</strong> <span className="text-gray-800 break-all">{transactionId}</span></p>
          <p><strong className="text-gray-600">Amount Donated:</strong> <span className="text-gray-800 font-semibold">RM {Number(amount).toFixed(6)}</span></p>
          <p><strong className="text-gray-600">Equivalent ETH:</strong> <span className="text-gray-800">{Number(ethAmount).toFixed(8)} ETH</span></p>
          {rmToEthRate > 0 && <p><strong className="text-gray-600">Rate Used:</strong> <span className="text-gray-800">1 RM ≈ {rmToEthRate.toPrecision(4)} ETH</span></p>}
          <p><strong className="text-gray-600">Date & Time:</strong> <span className="text-gray-800">{new Date(timestamp).toLocaleString()}</span></p>
          <p><strong className="text-gray-600">Status:</strong> <span className="font-medium text-green-600">{status}</span></p>
        </div>

        {categoryNames && (
            <div className="pt-4 border-t border-green-100 text-left space-y-2 text-sm">
              <h4 className="text-base font-medium text-gray-700 mb-2">Your donation will support:</h4>
               <p className="text-gray-800">{categoryNames}</p>
              {/* If you want a list format: */}
              {/* <ul className="list-disc list-inside text-gray-800">
                   {categoryNames.split(', ').map((category, index) => (
                     <li key={index}>{category}</li>
                   ))}
                 </ul> */}
            </div>
        )}

        <div className="pt-6 text-center space-y-2">
           <p className="text-xs text-gray-500">A confirmation has been simulated. In a real application, this would be sent via email.</p>
           {/* Add actual functionality for buttons if needed */}
          {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2">
              Download Receipt (PDF)
          </button> */}
          <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                  onClick={() => window.location.reload()} // Simple way to "Return Home" / Start Over
          >
            Make Another Donation
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
