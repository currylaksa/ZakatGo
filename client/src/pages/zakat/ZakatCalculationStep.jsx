import React from 'react';

const ZakatCalculationStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  // Simple Zakat calculation logic (for demonstration)
  // In a real app, this would be more complex and follow proper Zakat rules
  const calculateZakat = () => {
    const annualSalary = userData.personalInfo.salary * 12;
    const netWorth = annualSalary - userData.personalInfo.deductions + userData.personalInfo.assets;
    
    // 2.5% is a common rate for Zakat
    return netWorth * 0.025;
  };

  const zakatAmount = calculateZakat();

  const handleContinue = () => {
    updateUserData({ zakatAmount });
    nextStep();
  };

  return (
    <div>
      <h2>Step 3: Zakat Calculation</h2>
      
      <div>
        <h3>Your Zakat Calculation Summary</h3>
        <div>
          <p>Annual Income: RM {userData.personalInfo.salary * 12}</p>
          <p>Total Deductions: RM {userData.personalInfo.deductions}</p>
          <p>Total Assets: RM {userData.personalInfo.assets}</p>
          <p>Net Worth for Zakat: RM {(userData.personalInfo.salary * 12) - userData.personalInfo.deductions + userData.personalInfo.assets}</p>
        </div>
        
        <div>
          <h3>Your Zakat Amount</h3>
          <p>RM {zakatAmount.toFixed(2)}</p>
        </div>
        
        <div>
          <p>Would you like to donate this amount?</p>
          <div>
            <button onClick={prevStep}>Back</button>
            <button onClick={handleContinue}>Yes, Proceed</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZakatCalculationStep;