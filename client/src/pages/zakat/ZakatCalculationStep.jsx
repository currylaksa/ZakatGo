import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore'; // Import Firebase functions
import { db } from '../../config/firebase'; // Import Firebase db
import { calculateZakat, updateZakatInFirebase } from '../../services/zakatService'; // Import the service functions

const ZakatCalculationStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  const [zakatAmount, setZakatAmount] = useState(0);
  const [nisab, setNisab] = useState(23000); // Example Nisab value in RM (Needs regular updates)
  const [calculationSummary, setCalculationSummary] = useState({});

  // Get personal info data from previous step
  const personalInfo = userData.personalInfo || {};
  
  // Use this effect to calculate Zakat when component mounts or userData changes
  useEffect(() => {
    // Extract all relevant values from userData
    const { 
      name = '',
      annualIncome = 0, 
      annualExpenses = 0, 
      zakatPaid = 0, 
      assets = 0 
    } = userData.personalInfo || {};

    // Calculate zakatable amount using the formula:
    // (Annual Income - Necessary Annual Expenses - Zakat/Fitrah Already Paid + Total Zakatable Assets Value) x 2.5%
    const zakatableAmount = Number(annualIncome) - Number(annualExpenses) - Number(zakatPaid) + Number(assets);
    
    // Apply 2.5% Zakat rate if the amount is positive
    let calculatedZakat = 0;
    if (zakatableAmount > 0) {
      calculatedZakat = zakatableAmount * 0.025; // 2.5%
    }

    // Set minimum zakat value for positive calculations (demonstration purposes)
    if (calculatedZakat > 0 && calculatedZakat < 10) {
      calculatedZakat = 10; // Minimum RM 10 for demo if there's any positive amount
    }

    setZakatAmount(calculatedZakat);
    setCalculationSummary({
      annualIncome: Number(annualIncome),
      annualExpenses: Number(annualExpenses),
      zakatPaid: Number(zakatPaid),
      assets: Number(assets),
      zakatableAmount: zakatableAmount > 0 ? zakatableAmount : 0,
      nisab: nisab
    });

  }, [userData.personalInfo, nisab]);

  const handleContinue = async () => {
    // Update the user data locally
    const zakatData = {
      zakatAmount,
      calculationSummary,
      calculationDate: new Date().toISOString()
    };
    
    updateUserData({ zakatAmount, calculationSummary: calculationSummary });
    
    // Update Firebase if a user ID exists
    if (userData.userId) {
      await updateZakatInFirebase(userData.userId, zakatData);
    }
    
    nextStep(); // Proceed to the next step
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-700">Step 3: Zakat Calculation</h2>

      {/* Calculation Summary Box */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm space-y-4">
        <h3 className="text-lg font-medium text-gray-800">Zakat Calculation Summary</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span>Annual Income:</span> 
            <span className="font-semibold text-gray-800">RM {calculationSummary.annualIncome?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span>Annual Expenses (Deduction):</span> 
            <span className="font-semibold text-gray-800">- RM {calculationSummary.annualExpenses?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span>Zakat Already Paid (Deduction):</span> 
            <span className="font-semibold text-gray-800">- RM {calculationSummary.zakatPaid?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span>Total Zakatable Assets (Addition):</span> 
            <span className="font-semibold text-gray-800">+ RM {calculationSummary.assets?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2 font-medium">
            <span>Net Zakatable Amount:</span> 
            <span className="font-bold text-gray-800">RM {calculationSummary.zakatableAmount?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span>Zakat Rate:</span> 
            <span className="font-semibold text-gray-800">2.5%</span>
          </div>
          <div className="flex justify-between pb-2">
            <span>Zakatable Status:</span> 
            <span className={`font-semibold ${calculationSummary.isAboveNisab ? 'text-green-600' : 'text-yellow-600'}`}>
              {calculationSummary.isAboveNisab ? 'Above Nisab (Zakat Required)' : 'Below Nisab (Optional)'}
            </span>
          </div>
        </div>

        {/* Calculated Zakat Amount */}
        <div className="pt-4 bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Your Zakat Amount</h3>
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-700">RM {zakatAmount.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Based on 2.5% of your Net Zakatable Amount</p>
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="font-medium text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Why Pay Zakat?
          </h4>
          <p className="text-sm text-blue-700 mt-2">
            Zakat is one of the five pillars of Islam, purifying your wealth and helping those in need.
            Your contribution makes a real difference in the community.
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h4 className="font-medium text-purple-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Secure Blockchain Payment
          </h4>
          <p className="text-sm text-purple-700 mt-2">
            Your Zakat is processed securely through blockchain technology, 
            ensuring transparency and traceability of your contribution.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center p-6 bg-green-50 border border-green-100 rounded-lg shadow-sm">
        <p className="font-medium text-green-800 mb-4">Ready to proceed with your Zakat payment?</p>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={prevStep}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md transition-colors flex items-center"
          >
            Proceed to Payment
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        Disclaimer: This calculation follows the formula: (Income + Assets - Relief - Previous Zakat) × 2.5%.
        Please consult with a qualified religious advisor or your local Zakat authority for precise Zakat obligations.
      </p>
    </motion.div>
  );
};

export default ZakatCalculationStep;
