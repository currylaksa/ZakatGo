import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { processDocumentWithGroq } from '../../utils/groqApi';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const DocumentUploadStep = ({ nextStep, updateUserData, userData, isLoading, setIsLoading }) => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const acceptedFileTypes = {
    'application/pdf': ['.pdf'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png']
  };

  const onDrop = useCallback(acceptedFiles => {
    setError('');
    setUploadSuccess(false);
    setUploadProgress(0);
    const selectedFile = acceptedFiles[0];
    if (selectedFile && (
      selectedFile.type.includes('pdf') || 
      selectedFile.type.includes('image/jpeg') || 
      selectedFile.type.includes('image/png')
    )) {
      setFile(selectedFile);
    } else {
      setError('Invalid file type. Please upload PDF or image files.');
      setFile(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: false,
    maxSize: 5242880, 
  });

  const processDocument = useCallback(async () => {
    if (!file) return;

    setIsProcessing(true);
    setError('');
    
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 200);

      const extractedData = await processDocumentWithGroq(file);

      // Log what was extracted for debugging
      console.log("Extracted data from document:", extractedData);

      clearInterval(progressInterval);
      setUploadProgress(100);
      updateUserData({ 
        documentData: { 
          ...userData.documentData, 
          ...extractedData,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadDate: new Date().toISOString()
        } 
      });
      
      console.log("Document data stored in userData:", {
        ...extractedData,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });
      
      setIsProcessing(false);
      setUploadSuccess(true);
      
      setTimeout(() => {
        nextStep();
      }, 1500);

    } catch (error) {
      console.error('Document processing error:', error);
      setError('Failed to process document. Please try again.');
      setIsProcessing(false);
      setUploadProgress(0);
    }
  }, [file, nextStep, updateUserData, userData]);

  useEffect(() => {
    if (file && !uploadSuccess && !isProcessing && !error) {
      processDocument();
    }
  }, [file, uploadSuccess, isProcessing, error, processDocument]);

  const getBorderColor = () => {
    if (isDragAccept) return 'border-green-500';
    if (isDragReject) return 'border-red-500';
    if (isDragActive) return 'border-blue-400';
    return 'border-gray-300';
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 rounded-lg p-4 border border-green-100 mb-6">
        <h3 className="text-green-800 font-medium flex items-center">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Upload Required Documents
        </h3>
        <p className="text-green-700 text-sm mt-1">
          Our AI will automatically extract information from your payslip or financial statements to calculate your Zakat.
        </p>
      </div>

      {!file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            {...getRootProps()}
            className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-200 ease-in-out ${getBorderColor()} hover:bg-gray-50`}
          >
            <input {...getInputProps()} />
            
            <div className="space-y-4">
              <div className="mx-auto flex justify-center">
                <svg className="w-14 h-14 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-700">
                  {isDragActive ? 'Drop your file here' : 'Drag & drop your document'}
                </p>
                <p className="text-sm text-gray-500 mt-1">or click to browse from your device</p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">JPG</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">PNG</span>
              </div>
              
              <p className="text-xs text-gray-400">Maximum file size: 5MB</p>
            </div>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center">
              {file.type.includes('pdf') ? (
                <svg className="w-8 h-8 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                  <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              )}
              <div>
                <h4 className="font-medium text-gray-800">{file.name}</h4>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            
            {!isProcessing && !uploadSuccess && (
              <button 
                onClick={() => setFile(null)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
          
          <div className="p-4">
            {isProcessing && (
              <div className="space-y-3">
                <div className="flex items-center text-sm text-blue-700">
                  <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing document with AI...
                </div>
                
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                    <div 
                      style={{ width: `${uploadProgress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-blue-700 mt-1">
                    <span>Reading document</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                </div>
              </div>
            )}
            
            {uploadSuccess && (
              <div className="text-center py-2">
                <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Document processed successfully!</h3>
                <p className="mt-1 text-sm text-gray-500">We've extracted the information for your review.</p>
                <p className="mt-3 text-sm text-blue-600">Redirecting to next step...</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
        <h4 className="font-medium text-gray-700 mb-2">Accepted Documents</h4>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Monthly payslip</li>
          <li>Annual income statement</li>
          <li>Bank statements showing assets</li>
          <li>Investment account statements</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
