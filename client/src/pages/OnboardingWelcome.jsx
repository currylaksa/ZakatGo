import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaGoogle, FaApple, FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const OnboardingWelcome = () => {
  const navigate = useNavigate();

  const handleContinueWithGoogle = () => {
    // In a real app, this would initialize Google OAuth
    // For now, we'll simulate a successful login and navigate to the personal info page
    navigate('/onboarding/personal-info');
  };

  const handleSignUp = () => {
    navigate('/onboarding/personal-info');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 flex flex-col items-center px-6 pt-10 pb-8">
        {/* Logo */}
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-2">Let's Get Started!</h1>
        <p className="text-gray-600 text-center mb-10">Let's dive in into your account</p>

        {/* Social login buttons */}
        <div className="w-full space-y-3 mb-6">
          <button 
            onClick={handleContinueWithGoogle}
            className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium"
          >
            <FaGoogle className="text-red-500 mr-3" />
            Continue with Google
          </button>

          <button className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium">
            <FaApple className="text-black mr-3" />
            Continue with Apple
          </button>

          <button className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium">
            <FaFacebook className="text-blue-600 mr-3" />
            Continue with Facebook
          </button>

          <button className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium">
            <FaXTwitter className="text-black mr-3" />
            Continue with X
          </button>
        </div>

        {/* Sign up button */}
        <button 
          onClick={handleSignUp}
          className="w-full bg-secondary text-white font-semibold py-4 rounded-lg mb-4 hover:bg-secondaryLight transition duration-200"
        >
          Sign up
        </button>

        {/* Sign in link */}
        <p className="text-gray-600">
          Already have an account? <Link to="/login" className="text-gray-800 font-medium">Sign in</Link>
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-center space-x-4 text-xs text-gray-500 pb-4">
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/terms-of-service">Terms of Service</Link>
      </div>
    </div>
  );
};

export default OnboardingWelcome; 