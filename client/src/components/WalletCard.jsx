import React from 'react';
import { shortenAddress } from '../utils/shortenAddress';

/**
 * WalletCard component for displaying wallet information and loan balance
 * @param {Object} props - Component props
 * @param {string} props.userName - User's name
 * @param {string} props.balance - Loan balance
 * @param {string} props.walletAddress - Wallet address to display
 * @param {string} props.walletType - Type of wallet (e.g. "Metamask")
 * @param {string} props.currencySymbol - Currency symbol (default: "£")
 * @returns {JSX.Element} WalletCard component
 */
const WalletCard = ({ 
  userName, 
  balance, 
  walletAddress, 
  walletType = "Metamask",
  currencySymbol = "£"
}) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg">
      {/* Card background with gradient */}
      <div className="p-6 relative h-52" style={{
        background: "linear-gradient(135deg, #176B87 0%, #2E8A9F 50%, #64CCC5 100%)"
      }}>
        {/* Card icons */}
        <div className="absolute top-4 right-4">
          <svg width="28" height="28" viewBox="0 0 24 24" className="text-white opacity-80">
            <path 
              fill="currentColor" 
              d="M20 4H4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4M20 18H4V12H20V18M20 8H4V6H20V8M14 16H6V14H14V16M18 16H16V14H18V16Z" 
            />
          </svg>
        </div>
        
        <div className="absolute bottom-4 right-4">
          <svg width="36" height="36" viewBox="0 0 24 24" className="text-white opacity-80">
            <path 
              fill="currentColor" 
              d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M12.31 11.14C10.54 10.69 9.93 10.19 9.93 9.5C9.93 8.73 10.6 8.2 11.7 8.2C12.87 8.2 13.32 8.8 13.38 9.65H15.31C15.24 8.33 14.54 7.2 12.91 6.82V5H10.93V6.77C9.58 7.05 8.38 7.95 8.38 9.53C8.38 11.43 9.88 12.15 12.09 12.67C14.03 13.12 14.41 13.82 14.41 14.5C14.41 15 14.06 15.83 12.69 15.83C11.41 15.83 10.82 15.19 10.7 14.4H8.77C8.91 15.85 9.92 16.95 10.93 17.23V19H12.91V17.26C14.27 17 15.5 16.2 15.5 14.5C15.5 12.2 14.07 11.59 12.31 11.14Z"
            />
          </svg>
        </div>
        
        {/* Card Content */}
        <div className="relative z-10 text-white h-full flex flex-col justify-between">
          <div>
            <p className="text-white text-opacity-80 text-sm mb-1">Card Name</p>
            <h2 className="font-bold text-xl mb-1">{userName}</h2>
            <p className="text-sm tracking-wide mb-4">
              {shortenAddress(walletAddress)} • {walletType}
            </p>
          </div>
          
          <div>
            <p className="text-white text-opacity-80 text-sm mb-1">Loan Balance</p>
            <h2 className="text-3xl font-bold">{currencySymbol}{balance}</h2>
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

export default WalletCard; 