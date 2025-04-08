import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiCamera } from 'react-icons/hi';

const SelfiePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selfieImage, setSelfieImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelfieImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleContinue = () => {
    // In a real app, you would validate that a selfie was uploaded successfully
    // Check with backend if the selfie passes verification
    // Then navigate to a success or loan-application page
    navigate('/onboarding/upload-payslip');
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
            <div className="h-1 bg-secondary rounded-full" style={{ width: '100%' }}></div>
          </div>
          <div className="text-xs text-right text-gray-500 mt-1">5/5</div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        <h1 className="text-2xl font-bold mb-2">Selfie with ID Card</h1>
        <p className="text-gray-600 mb-6">Take a selfie holding your ID card next to your face. Ensure your face and ID card are clearly visible.</p>

        {/* Selfie Camera Section */}
        <div className="flex-1 flex flex-col items-center mb-8">
          {selfieImage ? (
            <div className="relative w-full">
              <img 
                src={selfieImage} 
                alt="Selfie with ID" 
                className="w-full h-64 object-cover border border-gray-300 rounded-lg"
              />
              <button 
                onClick={triggerFileInput}
                className="mt-4 text-secondary hover:text-secondaryLight font-medium"
              >
                Retake Photo
              </button>
            </div>
          ) : (
            <div className="w-full h-72 bg-gray-100 rounded-xl relative overflow-hidden">
              {/* Illustration of person with ID */}
              <div className="absolute w-full h-full flex items-center justify-center">
                <div className="relative">
                  {/* Simplified illustration */}
                  <div className="w-32 h-48 flex flex-col items-center">
                    {/* Head */}
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex flex-col items-center justify-end">
                      {/* Face details */}
                      <div className="w-10 h-4 bg-gray-900 rounded-full absolute top-10"></div>
                    </div>
                    
                    {/* Body */}
                    <div className="w-24 h-32 bg-secondary mt-1 rounded-t-xl">
                      {/* ID Card on right side */}
                      <div className="absolute right-0 top-20 transform rotate-12">
                        <div className="w-14 h-10 bg-gray-200 border-2 border-gray-400 rounded flex items-center justify-center">
                          <div className="w-10 h-6 bg-blue-900"></div>
                        </div>
                      </div>
                      
                      {/* Scarf */}
                      <div className="absolute top-16 left-0 w-20 h-8 bg-secondaryLight rounded-r-xl"></div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -bottom-4 -left-16 w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div className="absolute -top-8 -right-12 w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <div className="absolute bottom-10 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="absolute -bottom-2 right-16 w-3 h-3 bg-blue-400 rounded-full"></div>
                </div>
              </div>
              
              {/* Frame guide */}
              <div className="absolute inset-0 border-2 border-dashed border-gray-400 m-4 rounded-lg pointer-events-none"></div>
              
              {/* Positioning guides */}
              <div className="absolute top-10 left-10 w-3 h-3 border-2 border-white rounded-full"></div>
              <div className="absolute top-10 right-10 w-3 h-3 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-10 left-10 w-3 h-3 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-3 h-3 border-2 border-white rounded-full"></div>
            </div>
          )}
          
          {!selfieImage && (
            <button 
              onClick={triggerFileInput}
              className="mt-6 bg-secondary text-white rounded-full p-4 shadow-lg hover:bg-secondaryLight transition-colors focus:outline-none"
            >
              <HiCamera className="w-8 h-8" />
            </button>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            capture="user"
            onChange={handleFileChange}
            className="hidden" 
          />
        </div>

        {/* Tips */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Tips for a good photo:</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Hold your ID card next to your face</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Ensure both your face and all ID details are visible</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Take the photo in a well-lit area</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Remove glasses or anything covering your face</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom button */}
      <div className="px-6 py-4 border-t border-gray-100">
        <button
          onClick={handleContinue}
          className={`w-full font-semibold py-4 rounded-lg transition duration-200 ${selfieImage ? 'bg-secondary text-white hover:bg-secondaryLight' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          disabled={!selfieImage}
        >
          Take Selfie
        </button>
      </div>
    </div>
  );
};

export default SelfiePage; 