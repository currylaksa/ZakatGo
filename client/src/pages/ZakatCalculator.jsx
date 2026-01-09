// src/components/ZakatCalculator.jsx
import { useState, useEffect } from 'react';

// Reusable Input component
const InputField = ({ label, type = 'number', value, onChange, placeholder, helpText }) => (
  <div className="mb-5">
    <label className="block text-white text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder || '0.00'}
      className="w-full px-4 py-3 rounded-lg border border-[#c7435f]/30 bg-navy-700/50 text-black 
                focus:outline-none focus:ring-2 focus:ring-[#dc6e85] focus:border-transparent 
                placeholder-gray-500 transition-all duration-200" 
      min="0"
      step="0.01"
    />
    {helpText && <p className="text-xs text-[#f4ccd6]/70 mt-1">{helpText}</p>}
  </div>
);

// Reusable Button component
const Button = ({ children, onClick, type = 'primary', disabled = false }) => {
  const baseStyle = "px-8 py-3 rounded-lg font-semibold transition-all duration-300 text-white shadow-lg";
  const primaryStyle = `bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-500 
                        hover:shadow-teal-500/30 hover:shadow-xl transform hover:-translate-y-0.5 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`; 
  const secondaryStyle = `bg-[#6f162e] hover:bg-[#871f39] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

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
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');

  // --- State for Calculation Results ---
  const [nisabGold, setNisabGold] = useState(null);
  const [nisabLoading, setNisabLoading] = useState(false);
  const [incomeForZakat, setIncomeForZakat] = useState(0);
  const [mustPayZakat, setMustPayZakat] = useState(false);
  const [annualZakat, setAnnualZakat] = useState(0);
  const [monthlyZakat, setMonthlyZakat] = useState(0);
  const [calculationDone, setCalculationDone] = useState(false);

  // Fetch live nisab gold from MAIJ API
  useEffect(() => {
    const fetchNisabGold = async () => {
      setNisabLoading(true);
      try {
        // Placeholder / fallback
        const estimatedNisab = 23800; 
        setNisabGold(estimatedNisab);
      } catch (error) {
        console.log('Using fallback nisab value');
        setNisabGold(23800); 
      } finally {
        setNisabLoading(false);
      }
    };
    fetchNisabGold();
  }, []);

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
    const incomeVal = parseFloat(income) || 0;
    const expensesVal = parseFloat(expenses) || 0;
    const incomeForZakatVal = incomeVal - expensesVal;
    const nisab = nisabGold || 23800;
    const mustPay = incomeForZakatVal >= nisab;
    const annualZakatVal = mustPay ? incomeForZakatVal * 0.025 : 0;
    const monthlyZakatVal = annualZakatVal / 12;

    setIncomeForZakat(incomeForZakatVal);
    setMustPayZakat(mustPay);
    setAnnualZakat(annualZakatVal);
    setMonthlyZakat(monthlyZakatVal);
    setCalculationDone(true);

    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // --- Reset / Done Handlers ---
  const handleRecalculate = () => {
    setCalculationDone(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDone = () => {
    window.history.back();
  };

  // --- Format Currency ---
  const formatCurrency = (value) => {
    return value.toLocaleString('en-MY', { style: 'currency', currency: 'MYR' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#400017] to-blue-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 text-white">
            <span className="text-teal-300">Zakat</span> Calculator - UTM PPZ
          </h1>
          <p className="text-[#f4ccd6] max-w-lg mx-auto">
            Calculate your Zakat based on your income and expenses according to Islamic principles
          </p>
        </div>
        
        {/* Main Card */}
        <div className="bg-gradient-to-br from-[#5f0220]/70 to-[#400017]/70 backdrop-blur-sm rounded-2xl shadow-2xl 
                      shadow-[#400017]/50 p-8 border border-[#6f162e]/30 relative overflow-hidden">
          <IslamicPattern />
          
          {/* Nisab Information Box */}
          <div className="bg-gradient-to-r from-[#6f162e]/80 to-[#5f0220]/80 p-5 rounded-xl mb-8 
                        border border-[#871f39]/50 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-lg font-semibold mb-2 text-teal-300">Current Nisab Gold (85g)</h2>
              <p className="text-sm text-[#fbe9ed] mb-2">
                The minimum wealth required for Zakat obligation, based on 85g of Gold
              </p>
              {nisabLoading ? (
                <p className="text-lg text-[#fbe9ed]">Loading current nisab value...</p>
              ) : (
                <p className="text-2xl font-bold mt-1 text-white">
                  {formatCurrency(nisabGold || 23800)}
                </p>
              )}
              <p className="text-xs text-[#dc6e85]/70 mt-2">
                Source: MAIJ - https://www.maij.gov.my/?page_id=110
              </p>
            </div>
          </div>

          {/* Input Sections */}
          <div className="space-y-6">
            {/* Formula Display */}
            <div className="bg-[#73234B]/30 p-5 rounded-xl border border-[#6f162e]/30">
              <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                <span className="h-8 w-8 bg-teal-500/20 rounded-full flex items-center justify-center mr-2">
                  <span className="h-6 w-6 bg-teal-400 rounded-full flex items-center justify-center">
                    <span className="text-sm">📐</span>
                  </span>
                </span>
                Zakat Calculation Formula
              </h2>
              <p className="text-sm text-[#fbe9ed] mb-3">
                <strong className="text-teal-300">Income for Zakat calculation:</strong> Total income - Total expenses
              </p>
              {income && expenses && (
                <div className="bg-[#5f0220]/30 p-3 rounded-lg border border-[#6f162e]/50">
                  <p className="text-lg font-semibold text-teal-300">
                    RM {parseFloat(income || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })} - RM {parseFloat(expenses || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })} = RM {((parseFloat(income || 0) - parseFloat(expenses || 0))).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              )}
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-[#73234B]/30 rounded-xl border border-[#6f162e]/30">
                <h2 className="text-xl font-semibold mb-5 text-white flex items-center">
                  <span className="h-8 w-8 bg-teal-500/20 rounded-full flex items-center justify-center mr-2">
                    <span className="h-6 w-6 bg-teal-400 rounded-full flex items-center justify-center">
                      <span className="text-sm">1</span>
                    </span>
                  </span>
                  Total Income
                </h2>
                
                <InputField 
                  label="Total Annual Income (RM)" 
                  value={income} 
                  onChange={handleInputChange(setIncome)}
                  helpText="Enter your total annual income"
                  placeholder="0.00"
                />
              </div>

              <div className="p-5 bg-[#73234B]/30 rounded-xl border border-[#6f162e]/30">
                <h2 className="text-xl font-semibold mb-5 text-white flex items-center">
                  <span className="h-8 w-8 bg-teal-500/20 rounded-full flex items-center justify-center mr-2">
                    <span className="h-6 w-6 bg-teal-400 rounded-full flex items-center justify-center">
                      <span className="text-sm">2</span>
                    </span>
                  </span>
                  Total Expenses
                </h2>
                
                <InputField 
                  label="Total Annual Expenses (RM)" 
                  value={expenses} 
                  onChange={handleInputChange(setExpenses)}
                  helpText="Enter your total annual expenses"
                  placeholder="0.00"
                />
              </div>
            </div>
              
            {/* Calculate Button */}
            <div className="text-center">
              <Button onClick={calculateZakat} type="primary">
                Calculate My Zakat
              </Button>
            </div>
          </div>

          {/* Results Section */}
          {calculationDone && (
            <div id="results" className="mt-12 pt-8 border-t border-[#6f162e]/30 animate-fadeIn">
              <h2 className="text-2xl font-semibold mb-6 text-center text-white">
                Your <span className="text-teal-300">Zakat</span> Calculation Results
              </h2>
              
              <div className="bg-gradient-to-br from-[#6f162e]/50 to-[#5f0220]/50 p-6 rounded-xl 
                            shadow-lg border border-[#871f39]/30 space-y-4">
                <div className="p-4 bg-[#6f162e]/40 rounded-lg border border-[#871f39]/30">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#dc6e85]">Income for Zakat calculation:</span>
                    <span className="text-xl font-semibold text-white">{formatCurrency(incomeForZakat)}</span>
                  </div>
                </div>
                
                <div className="p-4 bg-[#6f162e]/40 rounded-lg border border-[#871f39]/30">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#dc6e85]">Nisab Gold (85g):</span>
                    <span className="text-xl font-semibold text-white">{formatCurrency(nisabGold || 23800)}</span>
                  </div>
                </div>
                
                <div className="p-4 bg-[#6f162e]/40 rounded-lg border border-[#871f39]/30">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#dc6e85]">Must Pay Zakat:</span>
                    <span className={`text-lg font-bold ${mustPayZakat ? 'text-teal-300' : 'text-red-400'}`}>
                      {mustPayZakat ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                
                {mustPayZakat && (
                  <>
                    <div className="p-4 bg-[#6f162e]/40 rounded-lg border border-[#871f39]/30">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#dc6e85]">Annual Zakat (2.5%):</span>
                        <span className="text-xl font-semibold text-teal-300">{formatCurrency(annualZakat)}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-[#6f162e]/40 rounded-lg border border-[#871f39]/30">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#dc6e85]">Monthly Zakat:</span>
                        <span className="text-xl font-semibold text-teal-300">{formatCurrency(monthlyZakat)}</span>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="mt-6 p-6 bg-gradient-to-r from-teal-800/40 to-teal-700/40 rounded-xl 
                              border border-teal-700/30 shadow-lg">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-teal-300 mb-2">
                      {mustPayZakat ? 'Total Zakat Yearly (2.5%)' : 'Zakat Status'}
                    </h3>
                    {mustPayZakat ? (
                      <>
                        <p className="text-4xl font-bold text-white mt-2">{formatCurrency(annualZakat)}</p>
                        <p className="text-lg text-teal-200 mt-2">Monthly: {formatCurrency(monthlyZakat)}</p>
                        <p className="mt-3 text-teal-300 text-sm">
                          May Allah accept your Zakat and multiply your rewards
                        </p>
                      </>
                    ) : (
                      <p className="mt-3 text-[#dc6e85] text-sm">
                        Your income has not reached the Nisab threshold for Zakat obligation
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Disclaimer */}
              <div className="mt-8 p-4 bg-[#73234B]/30 rounded-lg border border-[#5f0220]/50 text-center">
                <p className="text-xs text-[#dc6e85]">
                  <strong className="text-teal-400">Disclaimer:</strong> This calculator provides an estimate for informational purposes only. 
                  Please consult with your local official Zakat authority (e.g., MAIJ in Johor, PPZ-MAIWP, LZS) or a qualified Islamic scholar 
                  for precise calculations and rulings specific to your situation.
                </p>
              </div>

              {/* Recalculate & Done Buttons */}
              <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
                <Button type="secondary" onClick={handleRecalculate}>
                  Recalculate
                </Button>
                <Button type="primary" onClick={handleDone}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZakatCalculator;
