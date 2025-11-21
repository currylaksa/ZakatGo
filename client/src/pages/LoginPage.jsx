import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HalfCircleBackground, Button } from '../components';
import { FaGoogle, FaApple, FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!email || !password) {
      setError('Please enter your email and password.');
      return false;
    }
    // Very basic email check for prototype purposes
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    const ADMIN_EMAIL = 'adminZakat@gmail.com';
    const ADMIN_PASSWORD = '123456';
    const isAdmin = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (isAdmin) {
        localStorage.setItem('isAdminAuthed', 'true');
        localStorage.setItem('isUserAuthed', 'true');
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect');
        navigate(redirect || '/admin/zakat');
      } else {
        localStorage.setItem('isUserAuthed', 'true');
        navigate('/dashboard');
      }
    }, 600);
  };

  const handleSocialLogin = (provider) => {
    // Simulate OAuth login & redirect
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 600);
  };

  return (
    <HalfCircleBackground title="Sign In">
      <div className="max-w-lg mx-auto pt-10 w-full pb-8">
        <div className="bg-white rounded-xl p-10 shadow-sm">

          <h2 className="text-xl font-bold mb-2 text-[#400017]">Welcome back</h2>
          <p className="text-gray-600 mb-6">Sign in to continue to Zakat UTM</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                autoComplete="email"
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="#" className="text-xs text-secondary hover:text-secondaryLight">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.042.159-2.046.454-2.985M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"/></svg>
                  )}
                </button>
              </div>
            </div>

            <Button variant="secondary" fullWidth disabled={isSubmitting} onClick={handleLogin}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4 text-xs text-gray-500">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
            >
              <FaGoogle className="mr-2" /> Google
            </button>
            <button
              onClick={() => handleSocialLogin('apple')}
              className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
            >
              <FaApple className="mr-2" /> Apple
            </button>
            <button
              onClick={() => handleSocialLogin('facebook')}
              className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
            >
              <FaFacebook className="mr-2" /> Facebook
            </button>
            <button
              onClick={() => handleSocialLogin('twitter')}
              className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
            >
              <FaXTwitter className="mr-2" /> X (Twitter)
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/onboarding/welcome" className="text-[#400017] font-medium hover:underline">Sign up</Link>
        </div>
      </div>
    </HalfCircleBackground>
  );
};

export default LoginPage;