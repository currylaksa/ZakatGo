import React, { useState, useEffect } from 'react';

const ReviewInformationStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  // Initialize form data from userData, specifically documentData first, then personalInfo if needed
  const [formData, setFormData] = useState({
    name: userData.documentData?.name || userData.personalInfo?.name || '',
    salary: userData.documentData?.salary || userData.personalInfo?.salary || '',
    deductions: userData.documentData?.deductions || userData.personalInfo?.deductions || '',
    assets: userData.documentData?.assets || userData.personalInfo?.assets || ''
  });
  const [errors, setErrors] = useState({});

   // Update form when userData changes (e.g., after AI processing finishes)
   useEffect(() => {
    setFormData({
        name: userData.documentData?.name || userData.personalInfo?.name || '',
        salary: userData.documentData?.salary || userData.personalInfo?.salary || '',
        deductions: userData.documentData?.deductions || userData.personalInfo?.deductions || '',
        assets: userData.documentData?.assets || userData.personalInfo?.assets || ''
    });
   }, [userData.documentData, userData.personalInfo]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow empty string for deductions, but treat others as numbers if possible
    const processedValue = (name === 'deductions' && value === '') ? '' : (name === 'name' ? value : Number(value) || '');
    setFormData({ ...formData, [name]: processedValue });
     // Clear specific error when user starts typing
     if (errors[name]) {
        setErrors({ ...errors, [name]: null });
     }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Full Name is required.';
    if (formData.salary === '' || isNaN(formData.salary) || formData.salary <= 0) newErrors.salary = 'Valid Monthly Salary is required.';
    // Deductions can be 0 or empty, but if entered must be a non-negative number
    if (formData.deductions !== '' && (isNaN(formData.deductions) || formData.deductions < 0)) newErrors.deductions = 'Deductions must be a valid number (0 or more).';
     // Assets must be a non-negative number
    if (formData.assets === '' || isNaN(formData.assets) || formData.assets < 0) newErrors.assets = 'Total Assets Value is required (0 or more).';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
        // Convert deductions back to number if empty string was used
        const finalFormData = {
            ...formData,
            deductions: formData.deductions === '' ? 0 : Number(formData.deductions),
            salary: Number(formData.salary),
            assets: Number(formData.assets),
        };
      console.log("Updating user personal info:", finalFormData);
      updateUserData({ personalInfo: finalFormData });
      nextStep();
    } else {
        console.log("Validation failed:", errors);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Step 2: Review & Complete Information</h2>
      <p className="text-gray-600">Please review the information extracted from your document (if any) and complete or correct the fields below[cite: 6].</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && <p id="name-error" className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        {/* Salary Field */}
        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary (RM):</label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g., 5000"
            min="0"
            step="any"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.salary ? 'border-red-500' : 'border-gray-300'}`}
             aria-invalid={errors.salary ? "true" : "false"}
             aria-describedby={errors.salary ? "salary-error" : undefined}
          />
          {errors.salary && <p id="salary-error" className="mt-1 text-xs text-red-600">{errors.salary}</p>}
        </div>

        {/* Deductions Field */}
        <div>
          <label htmlFor="deductions" className="block text-sm font-medium text-gray-700 mb-1">Monthly Deductions (RM):</label>
          <input
            type="number"
            id="deductions"
            name="deductions"
            value={formData.deductions}
            onChange={handleChange}
            placeholder="e.g., 500 (optional, enter 0 if none)"
            min="0"
            step="any"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.deductions ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={errors.deductions ? "true" : "false"}
             aria-describedby={errors.deductions ? "deductions-error" : undefined}
          />
          {errors.deductions && <p id="deductions-error" className="mt-1 text-xs text-red-600">{errors.deductions}</p>}
        </div>

        {/* Assets Field */}
        <div>
          <label htmlFor="assets" className="block text-sm font-medium text-gray-700 mb-1">Total Zakatable Assets Value (RM):</label>
           <p className="text-xs text-gray-500 mb-1">Include savings, investments, gold/silver above Nisab etc., that have been held for one lunar year.</p>
          <input
            type="number"
            id="assets"
            name="assets"
            value={formData.assets}
            onChange={handleChange}
            placeholder="e.g., 10000"
            min="0"
            step="any"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.assets ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={errors.assets ? "true" : "false"}
             aria-describedby={errors.assets ? "assets-error" : undefined}
          />
           {errors.assets && <p id="assets-error" className="mt-1 text-xs text-red-600">{errors.assets}</p>}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Calculate Zakat
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewInformationStep;
