import React from 'react';
import Button from './Button';

/**
 * ActionButtons component for main dashboard actions
 * @param {Object} props - Component props 
 * @param {Function} props.onRepay - Callback for repay button
 * @param {Function} props.onRequest - Callback for request button
 * @returns {JSX.Element} ActionButtons component
 */
const ActionButtons = ({ onRepay, onRequest }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <button 
        onClick={onRepay} 
        className="bg-white hover:bg-[#f0efe8] border-2 border-secondary text-secondary py-3 px-4 rounded-full font-medium"
      >
        Repay Loan
      </button>
      <button 
        onClick={onRequest}
        className="bg-primary hover:bg-secondaryLight text-white py-3 px-4 rounded-full font-medium"
      >
        Request Loan
      </button>
    </div>
  );
};

export default ActionButtons; 