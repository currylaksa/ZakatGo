import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const ReviewInformationStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize form with data from prior steps
  const [formData, setFormData] = useState({
    name: userData.documentData?.name || userData.personalInfo?.name || '',
    annualIncome: userData.documentData?.annualIncome || userData.personalInfo?.annualIncome || '',
    annualExpenses: userData.documentData?.annualExpenses || userData.personalInfo?.annualExpenses || '',
    zakatPaid: userData.documentData?.zakatPaid || userData.personalInfo?.zakatPaid || '',
    assets: userData.documentData?.assets || userData.personalInfo?.assets || ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Update form when userData changes (e.g., after AI processing)
  useEffect(() => {
    setFormData({
      name: userData.documentData?.name || userData.personalInfo?.name || '',
      annualIncome: userData.documentData?.annualIncome || userData.personalInfo?.annualIncome || '',
      annualExpenses: userData.documentData?.annualExpenses || userData.personalInfo?.annualExpenses || '',
      zakatPaid: userData.documentData?.zakatPaid || userData.personalInfo?.zakatPaid || '',
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
    } else if (name === 'annualExpenses' && value === '') {
      processedValue = '';
    } else if (name === 'zakatPaid' && value === '') {
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
      case 'annualIncome':
        if (value === '' || isNaN(value) || value <= 0) {
          error = 'Valid Annual Income is required';
        }
        break;
      case 'annualExpenses':
        if (value !== '' && (isNaN(value) || value < 0)) {
          error = 'Annual Expenses must be a valid number (0 or more)';
        }
        break;
      case 'zakatPaid':
        if (value !== '' && (isNaN(value) || value < 0)) {
          error = 'Zakat/Fitrah already paid must be a valid number (0 or more)';
        }
        break;
      case 'assets':
        if (value !== '' && (isNaN(value) || value < 0)) {
          error = 'Assets Value must be a valid number (0 or more)';
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
    const fields = ['name', 'annualIncome', 'annualExpenses', 'zakatPaid', 'assets'];
    const newErrors = {};
    let isValid = true;
    
    fields.forEach(field => {
      if (!validateField(field, formData[field])) {
        newErrors[field] = errors[field] || `${field} is invalid`;
        isValid = false;
      }
    });
    
    // Separately validate zakatPaid since it's optional
    if (formData.zakatPaid !== '' && !validateField('zakatPaid', formData.zakatPaid)) {
      newErrors.zakatPaid = errors.zakatPaid || 'Zakat & Fitrah Paid is invalid';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Save data to Firebase
  const saveToFirebase = async (userData) => {
    try {
      if (userData.personalInfo?.name) {
        const userRef = doc(db, "users", userData.personalInfo.name);
        await setDoc(userRef, {
          personalInfo: userData.personalInfo,
          zakatAmount: userData.zakatAmount || 0,
          timestamp: new Date()
        }, { merge: true });
        console.log("User data saved to Firebase");
      }
    } catch (error) {
      console.error("Error saving to Firebase:", error);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      annualIncome: true,
      annualExpenses: true,
      zakatPaid: true,
      assets: true
    });
    
    if (validateForm()) {
      setIsLoading(true);
      
      // Process form data (convert string values to appropriate types)
      const processedData = {
        name: formData.name,
        annualIncome: Number(formData.annualIncome),
        annualExpenses: formData.annualExpenses === '' ? 0 : Number(formData.annualExpenses),
        zakatPaid: formData.zakatPaid === '' ? 0 : Number(formData.zakatPaid),
        assets: formData.assets === '' ? 0 : Number(formData.assets) // Made optional
>>>>>>> 599958b (update reviewinformation)
      };
      
      // Update user data
      updateUserData({ personalInfo: processedData });
      
      // Save to Firebase
      saveToFirebase({ personalInfo: processedData });
      
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
              <p>We've pre-filled information extracted from your income tax documents. Please review and complete any missing fields.</p>
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

          {/* Annual Income Field */}
          <div>
            <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700 mb-1">Annual Income (RM)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">RM</span>
              </div>
              <input
                type="number"
                id="annualIncome"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('annualIncome')}
                placeholder="e.g., 60000"
                min="0"
                step="any"
                style={{ paddingLeft: '3rem' }}
                aria-invalid={errors.annualIncome && touched.annualIncome ? 'true' : 'false'}
              />
            </div>
            {touched.annualIncome && errors.annualIncome && (
              <p className="mt-1 text-sm text-red-600" id="annualIncome-error">{errors.annualIncome}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Annual income after EPF contributions and tax reliefs
            </p>
          </div>

          {/* Annual Expenses Field */}
          <div>
            <label htmlFor="annualExpenses" className="block text-sm font-medium text-gray-700 mb-1">
              Necessary Annual Expenses (RM)
              <span className="text-gray-500 text-xs ml-1">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">RM</span>
              </div>
              <input
                type="number"
                id="annualExpenses"
                name="annualExpenses"
                value={formData.annualExpenses}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('annualExpenses')}
                placeholder="e.g., 25000 (leave empty if none)"
                min="0"
                step="any"
                style={{ paddingLeft: '3rem' }}
                aria-invalid={errors.annualExpenses && touched.annualExpenses ? 'true' : 'false'}
              />
            </div>
            {touched.annualExpenses && errors.annualExpenses && (
              <p className="mt-1 text-sm text-red-600" id="annualExpenses-error">{errors.annualExpenses}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Include housing, food, transportation, debt payments, and other essential expenses.
            </p>
          </div>

          {/* Already Paid Zakat Field */}
          <div>
            <label htmlFor="zakatPaid" className="block text-sm font-medium text-gray-700 mb-1">
              Zakat/Fitrah Already Paid (RM)
              <span className="text-gray-500 text-xs ml-1">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">RM</span>
              </div>
              <input
                type="number"
                id="zakatPaid"
                name="zakatPaid"
                value={formData.zakatPaid}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('zakatPaid')}
                placeholder="e.g., 500 (leave empty if none)"
                min="0"
                step="any"
                style={{ paddingLeft: '3rem' }}
                aria-invalid={errors.zakatPaid && touched.zakatPaid ? 'true' : 'false'}
              />
            </div>
            {touched.zakatPaid && errors.zakatPaid && (
              <p className="mt-1 text-sm text-red-600" id="zakatPaid-error">{errors.zakatPaid}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Enter any Zakat or Fitrah already paid this year
            </p>
          </div>

          {/* Assets Field */}
          <div className="md:col-span-2">
            <label htmlFor="assets" className="block text-sm font-medium text-gray-700 mb-1">
              Total Zakatable Assets Value (RM)
              <span className="text-gray-500 text-xs ml-1">(Optional)</span>
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
                placeholder="e.g., 15000 (leave empty if unknown)"
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
