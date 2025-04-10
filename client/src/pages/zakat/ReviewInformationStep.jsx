import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ReviewInformationStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize form with data from prior steps
  const [formData, setFormData] = useState({
    name: userData.documentData?.name || userData.personalInfo?.name || '',
    salary: userData.documentData?.salary || userData.personalInfo?.salary || '',
    deductions: userData.documentData?.deductions || userData.personalInfo?.deductions || '',
    assets: userData.documentData?.assets || userData.personalInfo?.assets || ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Update form when userData changes (e.g., after AI processing)
  useEffect(() => {
    setFormData({
      name: userData.documentData?.name || userData.personalInfo?.name || '',
      salary: userData.documentData?.salary || userData.personalInfo?.salary || '',
      deductions: userData.documentData?.deductions || userData.personalInfo?.deductions || '',
      assets: userData.documentData?.assets || userData.personalInfo?.assets || ''
    });
  }, [userData.documentData, userData.personalInfo]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format value based on field type
    let processedValue;
    if (name === 'name') {
      processedValue = value;
    } else if (name === 'deductions' && value === '') {
      processedValue = '';
    } else {
      // Allow number input but don't convert empty strings to 0
      processedValue = value === '' ? '' : (isNaN(parseFloat(value)) ? '' : parseFloat(value));
    }
    
    setFormData({ ...formData, [name]: processedValue });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Mark field as touched when user interacts with it
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    
    // Validate individual field on blur
    validateField(name, formData[name]);
  };

  // Validate a single field
  const validateField = (name, value) => {
    let error = null;
    
    switch (name) {
      case 'name':
        if (!value || value.trim() === '') {
          error = 'Full Name is required';
        }
        break;
      case 'salary':
        if (value === '' || isNaN(value) || value <= 0) {
          error = 'Valid Monthly Salary is required';
        }
        break;
      case 'deductions':
        if (value !== '' && (isNaN(value) || value < 0)) {
          error = 'Deductions must be a valid number (0 or more)';
        }
        break;
      case 'assets':
        if (value === '' || isNaN(value) || value < 0) {
          error = 'Total Assets Value is required (0 or more)';
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  // Validate all form fields
  const validateForm = () => {
    const fields = ['name', 'salary', 'deductions', 'assets'];
    const newErrors = {};
    let isValid = true;
    
    fields.forEach(field => {
      if (!validateField(field, formData[field])) {
        newErrors[field] = errors[field] || `${field} is invalid`;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      salary: true,
      deductions: true,
      assets: true
    });
    
    if (validateForm()) {
      setIsLoading(true);
      
      // Process form data (convert string values to appropriate types)
      const processedData = {
        name: formData.name,
        salary: Number(formData.salary),
        deductions: formData.deductions === '' ? 0 : Number(formData.deductions),
        assets: Number(formData.assets)
      };
      
      // Update user data
      updateUserData({ personalInfo: processedData });
      
      // Simulate processing delay for better UX
      setTimeout(() => {
        setIsLoading(false);
        nextStep();
      }, 600);
    }
  };

  // Get appropriate input styles based on validation state
  const getInputClassName = (fieldName) => {
    const baseClasses = "w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 transition duration-150";
    
    if (errors[fieldName] && touched[fieldName]) {
      return `${baseClasses} border-red-300 text-red-800 focus:border-red-500 focus:ring-red-200`;
    }
    
    if (touched[fieldName] && !errors[fieldName]) {
      return `${baseClasses} border-green-300 focus:border-green-500 focus:ring-green-200`;
    }
    
    return `${baseClasses} border-gray-300 focus:border-blue-500 focus:ring-blue-200`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Review Your Information</h2>
        <p className="text-gray-600 mt-1">
          Please verify the information below for accurate Zakat calculation
        </p>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Important</h3>
            <div className="text-sm text-blue-700">
              <p>We've pre-filled information extracted from your documents. Please review and complete any missing fields.</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name Field */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('name')}
                placeholder="Enter your full name"
                style={{ paddingLeft: '2.5rem' }}
                aria-invalid={errors.name && touched.name ? 'true' : 'false'}
              />
              {touched.name && errors.name && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {touched.name && errors.name && (
              <p className="mt-1 text-sm text-red-600" id="name-error">{errors.name}</p>
            )}
          </div>

          {/* Salary Field */}
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary (RM)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">RM</span>
              </div>
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('salary')}
                placeholder="e.g., 5000"
                min="0"
                step="any"
                style={{ paddingLeft: '3rem' }}
                aria-invalid={errors.salary && touched.salary ? 'true' : 'false'}
              />
            </div>
            {touched.salary && errors.salary && (
              <p className="mt-1 text-sm text-red-600" id="salary-error">{errors.salary}</p>
            )}
          </div>

          {/* Deductions Field */}
          <div>
            <label htmlFor="deductions" className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Deductions (RM)
              <span className="text-gray-500 text-xs ml-1">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">RM</span>
              </div>
              <input
                type="number"
                id="deductions"
                name="deductions"
                value={formData.deductions}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('deductions')}
                placeholder="e.g., 500 (leave empty if none)"
                min="0"
                step="any"
                style={{ paddingLeft: '3rem' }}
                aria-invalid={errors.deductions && touched.deductions ? 'true' : 'false'}
              />
            </div>
            {touched.deductions && errors.deductions && (
              <p className="mt-1 text-sm text-red-600" id="deductions-error">{errors.deductions}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Include EPF, taxes, loans, and other monthly financial obligations.
            </p>
          </div>

          {/* Assets Field */}
          <div className="md:col-span-2">
            <label htmlFor="assets" className="block text-sm font-medium text-gray-700 mb-1">
              Total Zakatable Assets Value (RM)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">RM</span>
              </div>
              <input
                type="number"
                id="assets"
                name="assets"
                value={formData.assets}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('assets')}
                placeholder="e.g., 15000"
                min="0"
                step="any"
                style={{ paddingLeft: '3rem' }}
                aria-invalid={errors.assets && touched.assets ? 'true' : 'false'}
              />
            </div>
            {touched.assets && errors.assets && (
              <p className="mt-1 text-sm text-red-600" id="assets-error">{errors.assets}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Include savings, investments, gold/silver above Nisab, etc., that have been held for one lunar year.
            </p>
          </div>
        </div>

        {/* Help information card */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
          <h4 className="font-medium text-gray-700 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            What Are Zakatable Assets?
          </h4>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            <li>Cash in bank accounts</li>
            <li>Gold and silver (above Nisab value)</li>
            <li>Investments (stocks, mutual funds, etc.)</li>
            <li>Business merchandise inventory</li>
            <li>Rental income properties</li>
            <li>Receivable loans that you expect to be repaid</li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <motion.button
            type="button"
            onClick={prevStep}
            disabled={isLoading}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </div>
          </motion.button>
          
          <motion.button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              <div className="flex items-center">
                Calculate Zakat
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default ReviewInformationStep;
