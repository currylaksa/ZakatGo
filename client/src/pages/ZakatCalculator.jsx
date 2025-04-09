// src/components/ZakatCalculator.jsx
import React, { useState } from 'react';

// Reusable Input component
const InputField = ({ label, type = 'number', value, onChange, placeholder, helpText }) => (
  <div className="mb-5">
    <label className="block text-white text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder || '0.00'}
      className="w-full px-4 py-3 rounded-lg border border-blue-400/30 bg-navy-700/50 text-white 
                focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent 
                placeholder-gray-500 transition-all duration-200" 
      min="0"
      step="0.01"
    />
    {helpText && <p className="text-xs text-blue-200/70 mt-1">{helpText}</p>}
  </div>
);

// Reusable Button component
const Button = ({ children, onClick, type = 'primary', disabled = false }) => {
    const baseStyle = "px-8 py-3 rounded-lg font-semibold transition-all duration-300 text-white shadow-lg";
    const primaryStyle = `bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-500 
                          hover:shadow-teal-500/30 hover:shadow-xl transform hover:-translate-y-0.5 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`; 
    const secondaryStyle = `bg-blue-700 hover:bg-blue-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
    
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

// Decorative Pattern Component
const IslamicPattern = () => (
  <div className="absolute opacity-5 right-0 top-0 h-40 w-40">
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M50,0 L100,50 L50,100 L0,50 Z M50,20 L80,50 L50,80 L20,50 Z M50,35 L65,50 L50,65 L35,50 Z" />
    </svg>
  </div>
);

const ZakatCalculator = () => {
  // --- State for Inputs ---
  const [savings, setSavings] = useState('');
  const [goldValue, setGoldValue] = useState('');
  const [silverValue, setSilverValue] = useState('');
  const [businessAssets, setBusinessAssets] = useState('');
  const [sharesValue, setSharesValue] = useState('');
  const [liabilities, setLiabilities] = useState('');

  // --- State for Calculation Results ---
  const [nisabThreshold] = useState(24000); // Placeholder Nisab value (approx. 85g gold)
  const [totalAssets, setTotalAssets] = useState(0);
  const [netAssets, setNetAssets] = useState(0);
  const [isObligated, setIsObligated] = useState(false);
  const [zakatDue, setZakatDue] = useState(0);
  const [calculationDone, setCalculationDone] = useState(false);

  // --- Input Change Handlers ---
  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
       setter(value);
       setCalculationDone(false);
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
    setCalculationDone(true);
    
    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // --- Format Currency ---
  const formatCurrency = (value) => {
    return value.toLocaleString('en-MY', { style: 'currency', currency: 'MYR' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 text-white">
            <span className="text-teal-300">Zakat</span> Calculator
          </h1>
          <p className="text-blue-200 max-w-lg mx-auto">
            Calculate your Zakat Al-Mal (Zakat on Wealth) according to Islamic principles
          </p>
        </div>
        
        {/* Main Card */}
        <div className="bg-gradient-to-br from-blue-800/70 to-blue-900/70 backdrop-blur-sm rounded-2xl shadow-2xl 
                      shadow-blue-900/50 p-8 border border-blue-700/30 relative overflow-hidden">
          <IslamicPattern />
          
          {/* Nisab Information Box */}
          <div className="bg-gradient-to-r from-blue-700/80 to-blue-800/80 p-5 rounded-xl mb-8 
                        border border-blue-600/50 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-lg font-semibold mb-2 text-teal-300">Current Nisab Threshold</h2>
              <p className="text-sm text-blue-100 mb-2">
                The minimum wealth required for Zakat obligation, based on 85g Gold / 612.36g Silver
              </p>
              <p className="text-2xl font-bold mt-1 text-white">{formatCurrency(nisabThreshold)}</p>
              <p className="text-xs text-blue-300/70 mt-2">
                *This is a placeholder value. Please refer to your local official Zakat authority for the current Nisab value.
              </p>
            </div>
          </div>

          {/* Input Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
            {/* Assets Section */}
            <div className="p-5 bg-blue-900/30 rounded-xl border border-blue-700/30 mb-6 md:mb-0">
              <h2 className="text-xl font-semibold mb-5 text-white flex items-center">
                <span className="h-8 w-8 bg-teal-500/20 rounded-full flex items-center justify-center mr-2">
                  <span className="h-6 w-6 bg-teal-400 rounded-full flex items-center justify-center">
                    <span className="text-sm">1</span>
                  </span>
                </span>
                Assets <span className="text-sm ml-2 text-teal-300 font-normal">(Held for 1 Lunar Year)</span>
              </h2>
              
              <InputField 
                label="Cash Savings (In Hand & Bank)" 
                value={savings} 
                onChange={handleInputChange(setSavings)}
                helpText="Include all savings accounts and cash"
              />
              <InputField 
                label="Value of Gold" 
                value={goldValue} 
                onChange={handleInputChange(setGoldValue)}
                helpText="Jewelry not in daily use, gold bars, coins"
              />
              <InputField 
                label="Value of Silver" 
                value={silverValue} 
                onChange={handleInputChange(setSilverValue)}
                helpText="Silver jewelry, coins, bars"
              />
              <InputField 
                label="Business Assets" 
                value={businessAssets} 
                onChange={handleInputChange(setBusinessAssets)}
                helpText="Net current value: inventory, cash, receivables"
              />
              <InputField 
                label="Shares & Investments" 
                value={sharesValue} 
                onChange={handleInputChange(setSharesValue)}
                helpText="Current market value of Shariah-compliant investments"
              />
            </div>

            {/* Liabilities Section */}
            <div className="p-5 bg-blue-900/30 rounded-xl border border-blue-700/30">
              <h2 className="text-xl font-semibold mb-5 text-white flex items-center">
                <span className="h-8 w-8 bg-teal-500/20 rounded-full flex items-center justify-center mr-2">
                  <span className="h-6 w-6 bg-teal-400 rounded-full flex items-center justify-center">
                    <span className="text-sm">2</span>
                  </span>
                </span>
                Liabilities <span className="text-sm ml-2 text-teal-300 font-normal">(Deductible)</span>
              </h2>
              
              <InputField 
                label="Short-Term Debts (Due within 1 year)" 
                value={liabilities} 
                onChange={handleInputChange(setLiabilities)}
                helpText="Includes immediate necessary expenses, installments due within the next year"
              />
              
              <div className="mt-6 p-4 bg-blue-800/30 rounded-lg border border-blue-700/50">
                <h3 className="text-sm font-medium mb-2 text-teal-300">Zakat Guidance</h3>
                <ul className="text-xs text-blue-200 space-y-2">
                  <li>• Assets must be owned for one full lunar year (Haul)</li>
                  <li>• Only include assets that exceed basic needs</li>
                  <li>• Different rules apply to agricultural produce, livestock, and certain investments</li>
                  <li>• Consult official guidelines for specific rulings on modern financial instruments</li>
                </ul>
              </div>
              
              {/* Calculate Button */}
              <div className="mt-8 text-center">
                <Button onClick={calculateZakat} type="primary">
                  Calculate My Zakat
                </Button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {calculationDone && (
            <div id="results" className="mt-12 pt-8 border-t border-blue-700/30 animate-fadeIn">
              <h2 className="text-2xl font-semibold mb-6 text-center text-white">
                Your <span className="text-teal-300">Zakat</span> Calculation
              </h2>
              
              <div className="bg-gradient-to-br from-blue-700/50 to-blue-800/50 p-6 rounded-xl 
                            shadow-lg border border-blue-600/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-800/30 rounded-lg border border-blue-700/30">
                    <p className="text-sm text-blue-300 mb-1">Total Zakatable Assets</p>
                    <p className="text-xl font-medium text-white">{formatCurrency(totalAssets)}</p>
                  </div>
                  <div className="p-3 bg-blue-800/30 rounded-lg border border-blue-700/30">
                    <p className="text-sm text-blue-300 mb-1">Total Deductible Liabilities</p>
                    <p className="text-xl font-medium text-white">{formatCurrency(parseFloat(liabilities) || 0)}</p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-700/40 rounded-lg border border-blue-600/30">
                  <p className="text-sm text-blue-300 mb-1">Net Zakatable Wealth</p>
                  <p className="text-2xl font-medium text-white">{formatCurrency(netAssets)}</p>
                </div>
                
                <div className="mt-4 p-4 bg-blue-700/40 rounded-lg border border-blue-600/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-blue-300 mb-1">Nisab Threshold Met?</p>
                      <p className="text-lg font-medium">
                        <span className={`inline-block px-3 py-1 rounded-full ${isObligated ? 'bg-teal-500/20 text-teal-300' : 'bg-red-500/20 text-red-400'}`}>
                          {isObligated ? 'Yes' : 'No'}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-300 mb-1">Threshold Value</p>
                      <p className="text-lg font-medium text-white">{formatCurrency(nisabThreshold)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-6 bg-gradient-to-r from-teal-800/40 to-teal-700/40 rounded-xl 
                              border border-teal-700/30 shadow-lg">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-teal-300 mb-2">Total Zakat Due (2.5%)</h3>
                    <p className="text-4xl font-bold text-white mt-2">{formatCurrency(zakatDue)}</p>
                    {isObligated && (
                      <p className="mt-3 text-teal-300 text-sm">
                        May Allah accept your Zakat and multiply your rewards
                      </p>
                    )}
                    {!isObligated && netAssets > 0 && (
                      <p className="mt-3 text-blue-300 text-sm">
                        Your wealth has not reached the Nisab threshold for Zakat obligation
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Disclaimer */}
              <div className="mt-8 p-4 bg-blue-900/30 rounded-lg border border-blue-800/50 text-center">
                <p className="text-xs text-blue-300">
                  <strong className="text-teal-400">Disclaimer:</strong> This calculator provides an estimate for informational purposes only. 
                  Please consult with your local official Zakat authority (e.g., MAIJ in Johor, PPZ-MAIWP, LZS) or a qualified Islamic scholar 
                  for precise calculations and rulings specific to your situation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZakatCalculator;
