import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Import motion from framer-motion for animations

const ZakatCalculationStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  const [zakatAmount, setZakatAmount] = useState(0);
  // IMPORTANT: Replace with a reliable source for the current Nisab value in Malaysia
  const [nisab, setNisab] = useState(23000); // Example Nisab value in RM (Needs regular updates)
  const [calculationSummary, setCalculationSummary] = useState({});

  // Recalculate when userData changes
  useEffect(() => {
    // Derive values from documentData/manualDetails or use precomputed calculation
    const baseIncome = Number(userData?.documentData?.annualIncome || 0);
    const bonusDoc = Number(userData?.documentData?.bonus || 0);
    const otherIncome = Number(userData?.manualDetails?.otherIncome || 0);
    const bonusManual = Number(userData?.manualDetails?.bonusManual || 0);
    const manualBonusProvided = userData?.manualDetails?.bonusManual !== undefined && userData?.manualDetails?.bonusManual !== '';
    const grossIncomeFallback = baseIncome + otherIncome + (manualBonusProvided ? bonusManual : bonusDoc);
    const grossIncome = Number(userData?.calculation?.grossIncome ?? grossIncomeFallback);

    const breakdown = userData?.manualDetails?.expensesBreakdown || {};
    const allowedExpensesFallback =
      Number(breakdown.personalRelief || 0) +
      Number(breakdown.spouseRelief || 0) +
      Number(breakdown.childRelief || 0) +
      Number(breakdown.parentsSupport || 0) +
      Number(breakdown.educationExpenses || 0) +
      Number(breakdown.medicalExpenses || 0) +
      Number(breakdown.tabungHaji || 0) +
      Number(breakdown.epfContribution || 0);
    const allowedExpenses = Number(userData?.calculation?.allowedExpenses ?? allowedExpensesFallback);

    const netZakatableIncome = Number(
      userData?.calculation?.netZakatableIncome ?? Math.max(0, grossIncome - allowedExpenses)
    );

    const nisabValue = Number(userData?.calculation?.nisabRM ?? nisab);
    const isWajibVal = Boolean(
      userData?.calculation?.isWajib ?? (netZakatableIncome >= nisabValue)
    );

    let annualZakat = Number(
      userData?.calculation?.zakatAnnual ?? (isWajibVal ? netZakatableIncome * 0.025 : 0)
    );
    if (annualZakat > 0 && annualZakat < 10) {
      annualZakat = 10; // Minimum RM 10 for demo if there's any positive amount
    }
    const monthlyZakat = Number(
      userData?.calculation?.zakatMonthly ?? (annualZakat / 12)
    );

    setZakatAmount(annualZakat);
    setCalculationSummary({
      grossIncome,
      allowedExpenses,
      netZakatableIncome,
      nisab: nisabValue,
      isWajib: isWajibVal,
      zakatAnnual: annualZakat,
      zakatMonthly: monthlyZakat,
    });

  }, [userData, nisab]);

  const handleContinue = () => {
    updateUserData({
      zakatAmount,
      calculation: {
        grossIncome: Number(calculationSummary.grossIncome || 0),
        allowedExpenses: Number(calculationSummary.allowedExpenses || 0),
        netZakatableIncome: Number(calculationSummary.netZakatableIncome || 0),
        nisabRM: Number(calculationSummary.nisab || 0),
        isWajib: Boolean(calculationSummary.isWajib),
        zakatAnnual: Number(calculationSummary.zakatAnnual || zakatAmount || 0),
        zakatMonthly: Number(calculationSummary.zakatMonthly || (zakatAmount / 12) || 0),
      },
    });
    nextStep(); // Proceed to the next step (Category Selection)
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
            <span>Gross Income:</span> 
            <span className="font-semibold text-gray-800">RM {calculationSummary.grossIncome?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span>Allowable Expenses (Deduction):</span> 
            <span className="font-semibold text-gray-800">- RM {calculationSummary.allowedExpenses?.toFixed(2)}</span>
          </div>
          {/* Removed Zakat Paid and Assets lines; show Nisab instead */}
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span>Nisab Threshold (RM):</span> 
            <span className="font-semibold text-gray-800">RM {calculationSummary.nisab?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2 font-medium">
            <span>Net Zakatable Amount:</span> 
            <span className="font-bold text-gray-800">RM {calculationSummary.netZakatableIncome?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span>Zakat Rate:</span> 
            <span className="font-semibold text-gray-800">2.5%</span>
          </div>
        </div>

        {/* Calculated Zakat Amount */}
        <div className="pt-4 bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Your Zakat Amount</h3>
          
          {/* Annual Zakat */}
          <div className="flex items-center mb-4 pb-4 border-b border-green-200">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-600 mb-1">Annual Zakat</p>
              <p className="text-3xl font-bold text-green-700">RM {zakatAmount.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">Based on 2.5% of your Net Zakatable Amount</p>
            </div>
          </div>

          {/* Monthly Zakat */}
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-600 mb-1">Monthly Zakat</p>
              <p className="text-2xl font-bold text-blue-700">RM {calculationSummary.zakatMonthly?.toFixed(2) || (zakatAmount / 12).toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">Annual amount divided by 12 months</p>
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#fbe9ed] p-4 rounded-lg border border-[#fbe9ed]">
          <h4 className="font-medium text-[#5f0220] flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Why Pay Zakat?
          </h4>
          <p className="text-sm text-[#6f162e] mt-2">
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
        Disclaimer: This is a simplified calculation for demonstration purposes. 
        Please consult with a qualified religious advisor or your local Zakat authority for precise Zakat obligations.
      </p>
    </motion.div>
  );
};

export default ZakatCalculationStep;
