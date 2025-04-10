import React, { useState } from 'react';

const DocumentUploadStep = ({ nextStep, updateUserData }) => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const processDocument = () => {
    if (!file) return;

    setIsProcessing(true);
    
    // Simulate AI document processing
    setTimeout(() => {
      // Mock data that would come from AI processing
      const extractedData = {
        name: 'John Doe',
        salary: 5000,
        deductions: 500,
        assets: 10000
      };
      
      updateUserData({ documentData: extractedData });
      setIsProcessing(false);
      setUploadSuccess(true);
    }, 2000);
  };

  const handleContinue = () => {
    nextStep();
  };

  return (
    <div>
      <h2>Step 1: Document Upload</h2>
      <p>Please upload your payslip or other financial documents to calculate your Zakat.</p>
      
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <p>Drag and drop your file here, or</p>
        <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
      </div>
      
      {file && (
        <div>
          <p>Selected file: {file.name}</p>
          <button onClick={processDocument} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Process Document'}
          </button>
        </div>
      )}
      
      {uploadSuccess && (
        <div>
          <p>Document processed successfully!</p>
          <button onClick={handleContinue}>Continue</button>
        </div>
      )}
    </div>
  );
};

export default DocumentUploadStep;
