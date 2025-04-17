import React, { useState, useEffect } from 'react';
import { getUserPayslips } from '../services/payslipService';

const UserPayslips = ({ userId }) => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        setLoading(true);
        const data = await getUserPayslips(userId);
        setPayslips(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching payslips:', err);
        setError('Failed to load your payslips. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPayslips();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const formatDate = (dateValue) => {
    if (!dateValue) return 'Unknown date';
    
    try {
      const date = typeof dateValue === 'string' 
        ? new Date(dateValue) 
        : dateValue instanceof Date 
          ? dateValue 
          : new Date();
          
      return date.toLocaleDateString();
    } catch (error) {
      return 'Unknown date';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading your documents...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  if (payslips.length === 0) {
    return <div className="text-gray-500 py-4">No documents found.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Your Uploaded Documents</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {payslips.map(payslip => (
          <div key={payslip.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-800">{payslip.fileName || 'Unnamed document'}</h3>
                <p className="text-sm text-gray-500">
                  {formatDate(payslip.uploadDate)}
                </p>
              </div>
              {payslip.fileUrl && (
                <a 
                  href={payslip.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View
                </a>
              )}
            </div>
            
            <div className="mt-3 pt-3 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Extracted Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span> {payslip.name || 'N/A'}
                </div>
                <div>
                  <span className="text-gray-500">Salary:</span> {payslip.monthlySalary ? `RM ${Number(payslip.monthlySalary).toFixed(2)}` : 'N/A'}
                </div>
                <div>
                  <span className="text-gray-500">Deductions:</span> {payslip.monthlyDeductions ? `RM ${Number(payslip.monthlyDeductions).toFixed(2)}` : 'RM 0.00'}
                </div>
                <div>
                  <span className="text-gray-500">Zakatable Assets:</span> {payslip.totalZakatableAssets ? `RM ${Number(payslip.totalZakatableAssets).toFixed(2)}` : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPayslips;