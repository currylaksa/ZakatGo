import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCheckCircle } from 'react-icons/hi';

const OnboardingSuccessPage = () => {
  const navigate = useNavigate();

  // Auto-complete signup: mark authed, create wallet, redirect to dashboard
  useEffect(() => {
    try {
      localStorage.setItem('isUserAuthed', 'true');
      const addr = '0x' + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      localStorage.setItem('userWalletAddress', addr);
    } catch (_) { /* empty */ }
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-8">
        {/* Success icon with animation */}
        <div className="mb-8 text-green-500 animate-pulse">
          <HiCheckCircle className="w-24 h-24" />
        </div>

        {/* Success message */}
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">Successfully Signed Up!</h1>
        <p className="text-gray-600 text-center mb-6">
          Your account has been successfully created.
          <br />
          You will be redirected to the login page shortly.
        </p>
        <p className="text-sm text-gray-500 text-center mb-10">
          Redirecting in 3 seconds...
        </p>

        {/* Sign in button */}
        <button 
          onClick={handleSignIn}
          className="w-full bg-secondary text-white font-semibold py-4 rounded-lg hover:bg-secondaryLight transition duration-200"
        >
          Go to Sign In
        </button>
      </div>
    </div>
  );
};

export default OnboardingSuccessPage;