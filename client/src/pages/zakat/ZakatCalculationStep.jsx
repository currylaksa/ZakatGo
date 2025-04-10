import React, { useState, useEffect } from 'react';

const ZakatCalculationStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  const [zakatAmount, setZakatAmount] = useState(0);
  // IMPORTANT: Replace with a reliable source for the current Nisab value in Malaysia
  const [nisab, setNisab] = useState(23000); // Example Nisab value in RM (Needs regular updates)
  const [isEligible, setIsEligible] = useState(false);
  const [calculationSummary, setCalculationSummary] = useState({});

  // Recalculate when userData changes
  useEffect(() => {
    const { salary = 0, deductions = 0, assets = 0 } = userData.personalInfo || {};

    // Basic Zakat calculation (example for Zakat on Wealth/Assets)
    // This is a simplified example. Real calculation might depend on income type, debts, etc.
    // Consult a religious scholar or official Zakat body for accurate calculation rules.
    const annualIncome = Number(salary) * 12;
    const netDeductible = Number(deductions) * 12; // Assuming deductions are monthly for simplicity
    const totalAssets = Number(assets);

    // Example: Zakat primarily on assets + surplus income after basic needs and debts.
    // Simplified: Assuming assets provided are the primary zakatable wealth.
    // Zakat is usually due on wealth exceeding Nisab held for one lunar year.
    const zakatableWealth = totalAssets; // Adapt this based on accurate Zakat rules

    // Determine eligibility and calculate Zakat
    const eligible = zakatableWealth >= nisab;
    const calculatedZakat = eligible ? zakatableWealth * 0.025 : 0;

    setZakatAmount(calculatedZakat);
    setIsEligible(eligible && calculatedZakat > 0); // Eligible only if Zakat > 0
    setCalculationSummary({
        annualIncome: annualIncome,
        netDeductible: netDeductible,
        totalAssets: totalAssets,
        zakatableWealth: zakatableWealth,
        nisab: nisab
    });

  }, [userData.personalInfo, nisab]);

  const handleContinue = () => {
    // Update the zakatAmount in the userData regardless of eligibility
    // If not eligible, it will be 0, which is correct for voluntary donation flow
    updateUserData({ zakatAmount });
    nextStep(); // Proceed to the next step (Category Selection)
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Step 3: Zakat Calculation</h2>

      {/* Calculation Summary Box */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-lg font-medium text-gray-800">Zakat Calculation Summary</h3>
        <div className="text-sm text-gray-600 space-y-1">
          {/* Display calculated values */}
          <p>Total Zakatable Assets: <span className="font-semibold">RM {calculationSummary.totalAssets?.toFixed(2)}</span></p>
          <p>Nisab Threshold (Example): <span className="font-semibold">RM {calculationSummary.nisab?.toFixed(2)}</span></p>
          {/* Add more details if needed based on actual calculation logic */}
          {/* <p>Annual Income (Approx): RM {calculationSummary.annualIncome?.toFixed(2)}</p> */}
          {/* <p>Annual Deductibles (Approx): RM {calculationSummary.netDeductible?.toFixed(2)}</p> */}
        </div>

        {/* Calculated Zakat Amount */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">Calculated Zakat Amount</h3>
          {isEligible ? (
             <p className="text-2xl font-bold text-green-600">RM {zakatAmount.toFixed(2)}</p>
          ) : (
             <p className="text-lg font-medium text-gray-700">
                Your Zakatable Wealth (RM {calculationSummary.zakatableWealth?.toFixed(2)}) is below the Nisab threshold (RM {calculationSummary.nisab?.toFixed(2)}). No Zakat is due based on this calculation.
             </p>
          )}
           <p className="text-xs text-gray-500 mt-1">Based on 2.5% of Zakatable Assets exceeding Nisab.</p>
        </div>
      </div>

      {/* Action Prompt & Buttons */}
      <div className={`text-center p-4 border rounded-lg ${isEligible ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'}`}>
        {isEligible ? (
          <p className="font-medium text-blue-800">Would you like to proceed to donate this amount?</p>
        ) : (
          <>
            <p className="font-medium text-yellow-800">No Zakat is calculated based on the provided information.</p>
            <p className="text-sm text-yellow-700 mt-1">You can still choose to make a voluntary donation (Sadaqah) if you wish.</p>
          </>
        )}

        {/* Buttons are now always displayed */}
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={prevStep}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back
          </button>
          <button
            onClick={handleContinue} // Always call handleContinue to proceed
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${isEligible ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'}`}
          >
            {/* Change button text based on eligibility */}
            {isEligible ? 'Yes, Proceed to Donate' : 'Make a Voluntary Donation'}
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        Disclaimer: This is a simplified calculation. Nisab value is indicative. Please consult with a qualified religious advisor or your local Zakat authority for precise Zakat obligations.
      </p>

    </div>
  );
};

export default ZakatCalculationStep;
