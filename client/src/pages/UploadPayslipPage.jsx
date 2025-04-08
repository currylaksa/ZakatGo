import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiCheck, HiX, HiUpload, HiDocumentAdd } from 'react-icons/hi';

const UploadPayslipPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [documentType, setDocumentType] = useState('payslip'); // 'payslip', 'bank', or 'receipts'

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'success' // Assuming success for demo purposes
      }));
      
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const handleContinue = () => {
    // In a real app, you would validate that files were uploaded successfully
    navigate('/onboarding/success'); // Navigate to the success page
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 py-3 flex items-center border-b border-gray-100">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Go back"
        >
          <HiArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Progress bar would be 100% here as this would be a bonus/extra step */}
        <div className="flex-1 px-4 flex flex-col justify-center mt-5">
          <div className="h-1 bg-gray-200 rounded-full">
            <div className="h-1 bg-secondary rounded-full" style={{ width: '100%' }}></div>
          </div>
          <div className="text-xs text-right text-gray-500 mt-1">Final Step</div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        <h1 className="text-2xl font-bold mb-2">Upload Financial Documents</h1>
        <p className="text-gray-600 mb-6">Please upload your financial documents to help us assess your loan eligibility. If you don't have a payslip, you can upload bank statements or receipts.</p>

        {/* Document Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What type of documents are you uploading?
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setDocumentType('payslip')}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                documentType === 'payslip' 
                  ? 'bg-secondary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Payslip
            </button>
            <button
              onClick={() => setDocumentType('bank')}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                documentType === 'bank' 
                  ? 'bg-secondary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bank Statement
            </button>
            <button
              onClick={() => setDocumentType('receipts')}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                documentType === 'receipts' 
                  ? 'bg-secondary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Receipts
            </button>
          </div>
        </div>

        {/* Document Type Instructions */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          {documentType === 'payslip' && (
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Please upload your latest 3 months of payslips.</p>
              <p>Ensure all details are clearly visible, including your name, company name, salary, and date.</p>
            </div>
          )}
          
          {documentType === 'bank' && (
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Please upload your bank statements from the last 3 months.</p>
              <p>Ensure they show your regular income and spending patterns. Make sure your name and account details are visible.</p>
            </div>
          )}
          
          {documentType === 'receipts' && (
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Please upload receipts of your regular expenses and income.</p>
              <p>Include receipts for utilities, rent, business income, or any regular financial transactions from the last 3 months.</p>
            </div>
          )}
        </div>

        {/* File Upload Section */}
        <div className="mb-8">
          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h3>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center">
                      <HiDocumentAdd className="w-5 h-5 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {file.status === 'success' ? (
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <HiCheck className="w-4 h-4 text-secondary" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-2">
                          <HiX className="w-4 h-4 text-red-600" />
                        </div>
                      )}
                      <button 
                        onClick={() => handleRemoveFile(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <HiX className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div 
            onClick={triggerFileInput}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:border-secondary transition-colors"
          >
            <HiUpload className="w-10 h-10 text-gray-400 mb-3" />
            <p className="text-gray-700 font-medium mb-1">Upload {documentType === 'payslip' ? 'Payslips' : documentType === 'bank' ? 'Bank Statements' : 'Receipts'}</p>
            <p className="text-gray-500 text-sm text-center mb-3">
              Click to browse your files or drag and drop them here
            </p>
            <p className="text-xs text-gray-400">
              Supported formats: PDF, JPG, PNG (Max 10MB)
            </p>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            className="hidden"
          />
        </div>

        {/* Note */}
        <div className="mb-6 text-sm text-gray-600">
          <p className="mb-1"><strong>Note:</strong> All uploaded documents are encrypted and securely stored.</p>
          <p>Your financial information will only be used for loan eligibility assessment and will not be shared with third parties without your consent.</p>
        </div>
      </div>

      {/* Bottom button */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/onboarding/success')}
            className="w-1/3 border border-secondary text-secondary font-semibold py-4 rounded-lg hover:bg-secondary hover:bg-opacity-10 transition duration-200"
          >
            Skip
          </button>
          <button
            onClick={handleContinue}
            className={`w-2/3 font-semibold py-4 rounded-lg transition duration-200 ${uploadedFiles.length > 0 ? 'bg-secondary text-white hover:bg-secondaryLight' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            disabled={uploadedFiles.length === 0}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPayslipPage; 