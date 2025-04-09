// src/components/ZakatCalculator.jsx
import React, { useState, useEffect } from 'react';

// Reusable Input component (optional, or use standard inputs)
const InputField = ({ label, type = 'number', value, onChange, placeholder }) => (
  <div className="mb-4">
    <label className="block text-gray-300 text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder || '0.00'}
      // Styling inputs for the navy theme
      className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500" 
      min="0" // Ensure non-negative numbers for currency
      step="0.01" // Allow cents
    />
  </div>
);

// Reusable Button component (Adapt from previous examples or create new)
const Button = ({ children, onClick, type = 'primary', disabled = false }) => {
    const baseStyle = "px-6 py-2 rounded-md font-semibold transition duration-200 ease-in-out text-white";
    // Adjusted primary style for better visibility on navy background maybe? Or keep blue.
    const primaryStyle = `bg-teal-500 hover:bg-teal-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`; 
    const secondaryStyle = `bg-gray-600 hover:bg-gray-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
    
    return (
      <button 
        onClick={onClick} 
        className={`${baseStyle} ${type === 'primary' ? primaryStyle : secondaryStyle}`}
        disabled={disabled}
      >
        {children}
      </button>
    );
};

const ZakatCalculator = () => {
  // --- State for Inputs ---
  const [savings, setSavings] = useState(''); // Cash in hand & bank accounts
  const [goldValue, setGoldValue] = useState(''); // Current market value of gold owned (meeting haul & type conditions)
  const [silverValue, setSilverValue] = useState(''); // Current market value of silver owned
  const [businessAssets, setBusinessAssets] = useState(''); // Net current assets of business (cash, inventory, receivables)
  const [sharesValue, setSharesValue] = useState(''); // Market value of shares/investments
  const [liabilities, setLiabilities] = useState(''); // Short-term debts due within the year

  // --- State for Calculation Results ---
  const [nisabThreshold] = useState(24000); // IMPORTANT: Placeholder Nisab value (approx. 85g gold). Fetch official current value for production!
  const [totalAssets, setTotalAssets] = useState(0);
  const [netAssets, setNetAssets] = useState(0);
  const [isObligated, setIsObligated] = useState(false);
  const [zakatDue, setZakatDue] = useState(0);
  const [calculationDone, setCalculationDone] = useState(false);

  // --- Input Change Handlers ---
  // Ensures only numbers are processed for calculations
  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
     // Allow empty string or valid numbers (including decimals)
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
       setter(value);
       setCalculationDone(false); // Reset calculation on input change
    }
  };

  // --- Calculation Logic ---
  const calculateZakat = () => {
    const assets = 
      (parseFloat(savings) || 0) +
      (parseFloat(goldValue) || 0) +
      (parseFloat(silverValue) || 0) +
      (parseFloat(businessAssets) || 0) +
      (parseFloat(sharesValue) || 0);
      
    const debts = parseFloat(liabilities) || 0;
    const net = assets - debts;

    setTotalAssets(assets);
    setNetAssets(net);

    if (net >= nisabThreshold) {
      setIsObligated(true);
      setZakatDue(net * 0.025); // 2.5% Zakat rate
    } else {
      setIsObligated(false);
      setZakatDue(0);
    }
    setCalculationDone(true); // Mark calculation as performed
  };

  // --- Format Currency ---
  const formatCurrency = (value) => {
    return value.toLocaleString('en-MY', { style: 'currency', currency: 'MYR' });
  };

  return (
    // Main container with navy background
    <div className="min-h-screen bg-blue-900 text-white p-4 md:p-8">
      {/* Assume Navbar is rendered globally in App.js */}
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl">
        
        <h1 className="text-3xl font-bold mb-2 text-center text-teal-300">Zakat Calculator (Zakat Al-Mal)</h1>
        <p className="text-center text-gray-400 mb-6">Calculate your Zakat on Wealth (Savings, Gold, Business, etc.)</p>

        {/* Nisab Information Box */}
        <div className="bg-blue-800 p-4 rounded-md mb-6 text-center border border-blue-700">
          <h2 className="text-lg font-semibold mb-1 text-teal-400">Nisab Threshold (Illustrative)</h2>
          <p className="text-sm text-gray-300">
            The minimum wealth required for Zakat obligation. Based on 85g Gold / 612.36g Silver.
          </p>
          <p className="text-lg font-bold mt-1">{formatCurrency(nisabThreshold)}*</p>
          <p className="text-xs text-gray-500 mt-1">*This is a placeholder value. Always refer to your local official Zakat authority for the current Nisab value.</p>
        </div>

        {/* Input Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {/* Assets Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-teal-400 border-b border-gray-600 pb-1">Assets (Held for 1 Lunar Year)</h2>
            <InputField 
              label="Cash Savings (In Hand & Bank)" 
              value={savings} 
              onChange={handleInputChange(setSavings)}
            />
            <InputField 
              label="Value of Gold (e.g., Jewellery not in daily use, Bars)" 
              value={goldValue} 
              onChange={handleInputChange(setGoldValue)} 
            />
             <InputField 
              label="Value of Silver" 
              value={silverValue} 
              onChange={handleInputChange(setSilverValue)} 
            />
            <InputField 
              label="Business Assets (Net Current Value: Inventory, Cash)" 
              value={businessAssets} 
              onChange={handleInputChange(setBusinessAssets)} 
            />
            <InputField 
              label="Shares & Investments (Current Market Value)" 
              value={sharesValue} 
              onChange={handleInputChange(setSharesValue)} 
            />
          </div>

          {/* Liabilities Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-teal-400 border-b border-gray-600 pb-1">Liabilities (Deductible)</h2>
            <InputField 
              label="Short-Term Debts (Due within 1 year)" 
              value={liabilities} 
              onChange={handleInputChange(setLiabilities)} 
            />
             <p className="text-xs text-gray-500 mb-4">Includes immediate necessary expenses, installments due within the next year. Consult official guidelines for specifics.</p>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="text-center mt-6">
          <Button onClick={calculateZakat} type="primary">
             Calculate Zakat
          </Button>
        </div>

        {/* Results Section */}
        {calculationDone && (
          <div className="mt-8 pt-6 border-t border-gray-600">
            <h2 className="text-2xl font-semibold mb-4 text-center text-teal-300">Calculation Results</h2>
            <div className="bg-gray-700 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-sm text-gray-400 mb-1">Total Zakatable Assets</p>
                    <p className="text-xl font-medium">{formatCurrency(totalAssets)}</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-400 mb-1">Total Deductible Liabilities</p>
                    <p className="text-xl font-medium">{formatCurrency(parseFloat(liabilities) || 0)}</p>
                </div>
                 <div className="md:col-span-2">
                    <p className="text-sm text-gray-400 mb-1">Net Zakatable Wealth</p>
                    <p className="text-xl font-medium">{formatCurrency(netAssets)}</p>
                </div>
                 <div className="md:col-span-2 mt-2">
                    <p className="text-sm text-gray-400 mb-1">Nisab Threshold Met?</p>
                    <p className={`text-xl font-bold ${isObligated ? 'text-green-400' : 'text-red-400'}`}>
                        {isObligated ? 'Yes' : 'No'} 
                        <span className="text-sm font-normal text-gray-300"> (Threshold: {formatCurrency(nisabThreshold)})</span>
                    </p>
                </div>
                 <div className="md:col-span-2 mt-4 bg-teal-800 p-3 rounded">
                    <p className="text-lg font-semibold text-white mb-1">Total Zakat Due (2.5%)</p>
                    <p className="text-3xl font-bold text-yellow-400">{formatCurrency(zakatDue)}</p>
                 </div>
            </div>
             {/* Disclaimer */}
             <p className="text-xs text-gray-500 mt-6 text-center">
               **Disclaimer:** This calculator provides an estimate for informational purposes only. Please consult with your local official Zakat authority (e.g., MAIJ in Johor, PPZ-MAIWP, LZS) or a qualified Islamic scholar for precise calculations and rulings specific to your situation. Ensure assets have met the Haul (1 lunar year). Different rules may apply to specific assets like agricultural produce, livestock, or different types of investments.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZakatCalculator;
