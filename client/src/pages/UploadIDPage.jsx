import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiCheck, HiX, HiCamera } from 'react-icons/hi';
import icSample from '../assets/ic_sample_vhack.png';

const UploadIDPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'success', 'error'

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setUploadStatus('success'); // For demo purposes, assuming successful upload
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleContinue = () => {
    // In a real app, you would validate that an ID was uploaded successfully
    navigate('/onboarding/selfie');
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
        
        {/* Progress bar */}
        <div className="flex-1 px-4 flex flex-col justify-center mt-5">
          <div className="h-1 bg-gray-200 rounded-full">
            <div className="h-1 bg-secondary rounded-full" style={{ width: '80%' }}></div>
          </div>
          <div className="text-xs text-right text-gray-500 mt-1">4/5</div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        <h1 className="text-2xl font-bold mb-2">Upload ID Card Photo</h1>
        <p className="text-gray-600 mb-6">Please upload clear photos of your ID card. This step is crucial for verifying your identity and securing your account.</p>

        {/* ID Upload Section */}
        <div className="mb-8">
          {uploadedImage ? (
            <div className="relative">
              <img 
                src={uploadedImage} 
                alt="Uploaded ID" 
                className="w-full h-48 object-contain border border-gray-300 rounded-lg"
              />
              <div className={`absolute -top-2 -right-2 rounded-full p-1 ${uploadStatus === 'success' ? 'bg-secondary' : 'bg-red-500'}`}>
                {uploadStatus === 'success' ? (
                  <HiCheck className="w-5 h-5 text-white" />
                ) : (
                  <HiX className="w-5 h-5 text-white" />
                )}
              </div>

              <button 
                onClick={triggerFileInput}
                className="mt-2 text-sm text-secondary hover:text-secondaryLight"
              >
                Change photo
              </button>
            </div>
          ) : (
            <div 
              onClick={triggerFileInput}
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-secondary transition-colors"
            >
              <HiCamera className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-gray-600 mb-1">Tap to take a photo</p>
              <p className="text-gray-400 text-sm">or upload from gallery</p>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Example Images */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Examples</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Correct Example */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="mb-2 flex items-center">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <HiCheck className="w-4 h-4 text-secondary" />
                </div>
                <span className="text-sm font-medium">Correct</span>
              </div>
              
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={icSample} 
                  alt="Sample IC" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            
            {/* Incorrect Examples */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="mb-2 flex items-center">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-2">
                    <HiX className="w-3 h-3 text-red-600" />
                  </div>
                  <span className="text-xs font-medium">Dark</span>
                </div>
                <div className="relative h-20 rounded overflow-hidden">
                  <img 
                    src={icSample} 
                    alt="Dark IC Sample" 
                    className="w-full h-full object-cover brightness-50"
                  />
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="mb-2 flex items-center">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-2">
                    <HiX className="w-3 h-3 text-red-600" />
                  </div>
                  <span className="text-xs font-medium">Blur</span>
                </div>
                <div className="relative h-20 rounded overflow-hidden">
                  <img 
                    src={icSample} 
                    alt="Blurred IC Sample" 
                    className="w-full h-full object-cover blur-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom button */}
      <div className="px-6 py-4 border-t border-gray-100">
        <button
          onClick={handleContinue}
          className={`w-full font-semibold py-4 rounded-lg transition duration-200 ${uploadStatus === 'success' ? 'bg-secondary text-white hover:bg-secondaryLight' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          disabled={uploadStatus !== 'success'}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default UploadIDPage; 