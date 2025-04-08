import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiArrowLeft, HiCalendar } from 'react-icons/hi';

const PersonalInfoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    homeAddress: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleContinue = () => {
    // In a real app, you would validate the form data here
    navigate('/onboarding/job-info');
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
            <div className="h-1 bg-secondary rounded-full" style={{ width: '20%' }}></div>
          </div>
          <div className="text-xs text-right text-gray-500 mt-1">1/5</div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        <h1 className="text-2xl font-bold mb-2">Personal Information</h1>
        <p className="text-gray-600 mb-6">We need some basic information to determine your loan eligibility. Your data is safe with us.</p>

        <form className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="text"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                placeholder="DD/MM/YYYY"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <HiCalendar className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="flex items-center">
              <div className="flex items-center bg-gray-100 px-3 py-3 rounded-l-lg border border-gray-300 border-r-0">
                <span className="text-gray-600">🇲🇾</span>
                <span className="text-gray-600 ml-1">+60</span>
              </div>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="(123) 456-7890"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                required
              />
            </div>
          </div>

          {/* Home Address */}
          <div>
            <label htmlFor="homeAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Home Address
            </label>
            <textarea
              id="homeAddress"
              name="homeAddress"
              value={formData.homeAddress}
              onChange={handleInputChange}
              placeholder="Enter your home address"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition resize-none"
              required
            />
          </div>
        </form>
      </div>

      {/* Bottom button */}
      <div className="px-6 py-4 border-t border-gray-100">
        <button
          onClick={handleContinue}
          className="w-full bg-secondary text-white font-semibold py-4 rounded-lg hover:bg-secondaryLight transition duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoPage; 