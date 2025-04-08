import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiChevronDown } from 'react-icons/hi';

const JobInfoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employerName: '',
    jobTitle: '',
    employmentType: '',
    industry: '',
    monthlyIncome: ''
  });

  // Employment types for Malaysia
  const employmentTypes = [
    'Full-time',
    'Part-time',
    'Self-employed',
    'Contract',
    'Freelance',
    'Gig Economy Worker',
    'Unemployed'
  ];

  // Industries common in Malaysia
  const industries = [
    'Agriculture',
    'Manufacturing',
    'Construction',
    'Retail & Wholesale',
    'Food & Beverage',
    'Hospitality & Tourism',
    'Healthcare',
    'Education',
    'Finance & Banking',
    'Information Technology',
    'Oil & Gas',
    'Public Sector',
    'Transportation & Logistics',
    'Telecommunications',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleContinue = () => {
    // In a real app, you would validate the form data here
    navigate('/onboarding/upload-id');
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
            <div className="h-1 bg-secondary rounded-full" style={{ width: '40%' }}></div>
          </div>
          <div className="text-xs text-right text-gray-500 mt-1">2/5</div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        <h1 className="text-2xl font-bold mb-2">Job Information</h1>
        <p className="text-gray-600 mb-6">To accurately assess your loan eligibility, please fill out your current employment information. Your privacy is our priority.</p>

        <form className="space-y-5">
          {/* Current Employer Name */}
          <div>
            <label htmlFor="employerName" className="block text-sm font-medium text-gray-700 mb-1">
              Current Employer Name
            </label>
            <input
              type="text"
              id="employerName"
              name="employerName"
              value={formData.employerName}
              onChange={handleInputChange}
              placeholder="Enter your employer's name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
            />
          </div>

          {/* Job Title/Position */}
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title/Position
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              placeholder="Enter your job title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
            />
          </div>

          {/* Employment Type */}
          <div>
            <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
              Employment Type
            </label>
            <div className="relative">
              <select
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition bg-white"
              >
                <option value="" disabled>Select your employment type</option>
                {employmentTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <HiChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <div className="relative">
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition bg-white"
              >
                <option value="" disabled>Select your industry</option>
                {industries.map((industry, index) => (
                  <option key={index} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <HiChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Monthly Income */}
          <div>
            <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Income (MYR)
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                RM
              </div>
              <input
                type="text"
                id="monthlyIncome"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
              />
            </div>
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

export default JobInfoPage; 