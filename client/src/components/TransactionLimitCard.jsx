import React from 'react';

/**
 * TransactionLimitCard component for displaying transaction limit information
 * @param {Object} props - Component props
 * @param {string} props.limitAmount - The transaction limit amount
 * @param {string} props.period - The period for the transaction limit (e.g., "12 MONTHS")
 * @param {string} props.currencySymbol - Currency symbol (default: "$")
 * @returns {JSX.Element} TransactionLimitCard component
 */
const TransactionLimitCard = ({ 
  limitAmount = "12,960", 
  period = "12 MONTHS",
  currencySymbol = "$"
}) => {
  // Format the amount with a space between thousands if not already formatted
  const formattedAmount = limitAmount.toString().includes(",") 
    ? limitAmount 
    : limitAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <div className="rounded-xl overflow-hidden shadow-lg w-full max-w-sm">
      {/* Card background with gradient */}
      <div className="p-6 relative h-40" style={{
        background: "linear-gradient(135deg, #6247AA 0%, #8458B3 50%, #A28CC0 100%)"
      }}>
        {/* Card Content */}
        <div className="relative z-10 text-white h-full flex flex-col justify-between">
          <div>
            <p className="text-white text-opacity-80 text-sm font-medium uppercase tracking-wide mb-1">
              PAY WITHIN {period}
            </p>
            <p className="text-white text-opacity-70 text-sm mb-1">
              transaction limit
            </p>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold">
              {currencySymbol} {formattedAmount}
            </h2>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-6 right-8 w-32 h-32 border-t border-r border-white opacity-10 rounded-tr-full"></div>
        <div className="absolute bottom-0 right-16 w-40 h-40 border border-white opacity-10 rounded-full"></div>
        <div className="absolute -bottom-10 -left-4 w-24 h-24 border border-white opacity-10 rounded-full"></div>
      </div>
    </div>
  );
};

export default TransactionLimitCard; 