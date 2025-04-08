import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HalfCircleBackground } from '../components';
import { HiExclamationCircle } from 'react-icons/hi';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <HalfCircleBackground title="Page Not Found">
      <div className="max-w-lg mx-auto pt-1 w-full pb-8">
        <div className="flex flex-col items-center justify-center px-6 pt-10 pb-8">
          {/* Error icon */}
          <div className="mb-8 text-secondary">
            <HiExclamationCircle className="w-24 h-24" />
          </div>

          {/* Error message */}
          <h1 className="text-2xl font-bold mb-2 text-center">404 Not Found</h1>
          <p className="text-gray-600 text-center mb-10">
            The page you're looking for doesn't exist or has been moved.
            <br />
            Please check the URL or return to the dashboard.
          </p>

          {/* Go home button */}
          <button 
            onClick={handleGoHome}
            className="w-full bg-secondary text-white font-semibold py-4 rounded-lg hover:bg-secondaryLight transition duration-200"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </HalfCircleBackground>
  );
};

export default NotFoundPage; 