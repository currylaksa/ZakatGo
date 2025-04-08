import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCheckCircle } from 'react-icons/hi';

const OnboardingSuccessPage = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-8">
        {/* Success icon */}
        <div className="mb-8 text-secondary">
          <HiCheckCircle className="w-24 h-24" />
        </div>

        {/* Success message */}
        <h1 className="text-2xl font-bold mb-2 text-center">You're All Set!</h1>
        <p className="text-gray-600 text-center mb-10">
          Your account has been successfully created.
          <br />
          You can now sign in with your credentials
          <br />
          and continue using MicroLoanChain.
        </p>

        {/* Sign in button */}
        <button 
          onClick={handleSignIn}
          className="w-full bg-secondary text-white font-semibold py-4 rounded-lg hover:bg-secondaryLight transition duration-200"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default OnboardingSuccessPage; 