import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const DocumentUploadStep = ({ nextStep, updateUserData, userData }) => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    // We only take the first file
    const selectedFile = acceptedFiles[0];
    if (selectedFile && (selectedFile.type.includes('pdf') || selectedFile.type.includes('image'))) {
      setFile(selectedFile);
      setUploadSuccess(false); // Reset success state on new file
      setError('');
    } else {
      setError('Invalid file type. Please upload PDF or image files.');
      setFile(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: false
  });

  const processDocument = () => {
    if (!file) return;

    setIsProcessing(true);
    setError('');
    setUploadSuccess(false);

    // Simulate AI document processing [cite: 6, 23]
    console.log("Simulating AI processing for:", file.name);
    setTimeout(() => {
      // Mock data - replace with actual AI extraction logic
      const extractedData = {
        name: 'Ahmad bin Abdullah', // Example data
        salary: 6500,
        deductions: 700,
        assets: 15000
        // Add other fields extracted by AI
      };

      // Merge extracted data with existing userData.documentData
      // This ensures if user goes back and re-uploads, previous data isn't lost
      updateUserData({ documentData: { ...userData.documentData, ...extractedData } });
      setIsProcessing(false);
      setUploadSuccess(true);
      console.log("Simulated AI processing complete. Extracted:", extractedData);

      // Automatically proceed to the next step after successful processing
      setTimeout(() => {
         nextStep();
      }, 1000); // Short delay to show success message

    }, 2500); // Increased timeout for simulation effect
  };

  // Trigger processing immediately after a file is selected and validated
  React.useEffect(() => {
    if (file && !uploadSuccess && !isProcessing && !error) {
      processDocument();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]); // Dependency on 'file' state

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Step 1: Document Upload</h2>
      <p className="text-gray-600">Upload your payslip or other financial documents (PDF, JPG, PNG). The system will attempt to extract the relevant information automatically[cite: 6].</p>

      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200 ease-in-out ${
          isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-green-600">Drop the file here ...</p>
        ) : (
          <p className="text-gray-500">Drag 'n' drop your file here, or click to select file</p>
        )}
        <p className="text-sm text-gray-400 mt-1">PDF, JPG, or PNG files only</p>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {file && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-700 font-medium">Selected file: {file.name}</p>
          {isProcessing && (
            <div className="mt-2 flex items-center text-blue-600">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing document... Please wait.
            </div>
          )}
          {uploadSuccess && !isProcessing && (
            <p className="mt-2 text-green-600 font-semibold">Document processed successfully! Proceeding to the next step...</p>
          )}
        </div>
      )}

      {/* Button is removed as processing starts automatically */}
      {/* Kept for reference if manual trigger is preferred */}
      {/* {file && !isProcessing && !uploadSuccess && (
        <div className="mt-4">
          <button
            onClick={processDocument}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Process Document'}
          </button>
        </div>
      )} */}

      {/* Removed the explicit "Continue" button as it proceeds automatically */}
    </div>
  );
};

export default DocumentUploadStep;
