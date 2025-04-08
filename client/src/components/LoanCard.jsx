import React from 'react';
import Button from './Button';

const LoanCard = ({ title, dueDate, balance, payment, isOverdue, onRepay }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">
            Due Date: <span className={isOverdue ? "text-red-500 font-medium" : ""}>{isOverdue ? "Over Due" : dueDate}</span>
          </p>
        </div>
        <Button 
          onClick={onRepay}
          variant="primary"
          size="sm"
        >
          Repay
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div>
          <p className="text-sm text-gray-500">Loan Balance</p>
          <p className="text-xl font-semibold text-primary">{balance}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Payment Amount</p>
          <p className="text-xl font-semibold text-primary">{payment}</p>
        </div>
      </div>
    </div>
  );
};

export default LoanCard; 