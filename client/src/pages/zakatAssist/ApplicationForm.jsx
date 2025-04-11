import React, { useState } from 'react';

const ApplicationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    icNumber: '',
    address: '',
    phone: '',
    email: '',
    monthlyIncome: '',
    dependents: '',
    reason: '',
  });
  const [document, setDocument] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        // Basic validation for file type and size (e.g., max 5MB)
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
             setErrors({ ...errors, document: 'Invalid file type. Please upload PDF, JPG, or PNG.' });
             setDocument(null); // Clear the invalid file
             e.target.value = null; // Reset file input
             return;
        }

        if (file.size > maxSize) {
             setErrors({ ...errors, document: 'File is too large. Maximum size is 5MB.' });
             setDocument(null); // Clear the invalid file
             e.target.value = null; // Reset file input
             return;
        }

        setDocument(file);
        setErrors({ ...errors, document: null }); // Clear document error on valid file selection
    }
  };

  const validateForm = () => {
      const newErrors = {};
      if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
      if (!formData.icNumber.trim()) newErrors.icNumber = 'IC Number is required.';
       // Basic IC validation (example: must be numeric and 12 digits)
       else if (!/^\d{12}$/.test(formData.icNumber.replace(/-/g, ''))) newErrors.icNumber = 'Invalid IC Number format (should be 12 digits).';
      if (!formData.address.trim()) newErrors.address = 'Address is required.';
      if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required.';
       // Basic phone validation (example: Malaysian format)
       else if (!/^(\+?6?01)[0-9]{8,9}$/.test(formData.phone.replace(/[-\s]/g, ''))) newErrors.phone = 'Invalid Malaysian phone number format.';
       if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format.'; // Email is optional, but validate if entered
      if (!formData.monthlyIncome) newErrors.monthlyIncome = 'Monthly Income is required.';
      else if (isNaN(formData.monthlyIncome) || Number(formData.monthlyIncome) < 0) newErrors.monthlyIncome = 'Monthly Income must be a positive number.';
      if (!formData.dependents) newErrors.dependents = 'Number of Dependents is required.';
      else if (isNaN(formData.dependents) || Number(formData.dependents) < 0 || !Number.isInteger(Number(formData.dependents))) newErrors.dependents = 'Number of Dependents must be a non-negative integer.';
      if (!formData.reason.trim()) newErrors.reason = 'Reason for Assistance is required.';
      if (!document) newErrors.document = 'Proof of Income document is required.';

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0; // Return true if no errors
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
       console.log("Form validated successfully"); // Debugging
      onSubmit({
        ...formData,
        document: document, // Send the file object
        applicationDate: new Date().toISOString(),
      });
    } else {
       console.log("Form validation failed", errors); // Debugging
    }
  };

  // Helper component for form fields
  const FormField = ({ id, name, label, type = 'text', value, onChange, error, required, children, ...props }) => (
    <div className="mb-5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children ? children : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
          {...props}
        />
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Step 1: Application Form</h2>
      <p className="text-gray-600 mb-6 text-center">Please fill in your details accurately to apply for Zakat assistance.</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
             <FormField id="fullName" name="fullName" label="Full Name (as per IC)" value={formData.fullName} onChange={handleChange} error={errors.fullName} required />
             <FormField id="icNumber" name="icNumber" label="IC Number (e.g., 900101101234)" value={formData.icNumber} onChange={handleChange} error={errors.icNumber} required placeholder="12 digits without dashes"/>
         </div>

         <FormField id="address" name="address" label="Current Address" required error={errors.address}>
             <textarea
                id="address"
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
            />
         </FormField>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormField type="tel" id="phone" name="phone" label="Phone Number (e.g., 0123456789)" value={formData.phone} onChange={handleChange} error={errors.phone} required placeholder="Start with 01"/>
            <FormField type="email" id="email" name="email" label="Email Address (Optional)" value={formData.email} onChange={handleChange} error={errors.email} />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormField type="number" id="monthlyIncome" name="monthlyIncome" label="Monthly Household Income (RM)" value={formData.monthlyIncome} onChange={handleChange} error={errors.monthlyIncome} required min="0" step="10"/>
            <FormField type="number" id="dependents" name="dependents" label="Number of Dependents" value={formData.dependents} onChange={handleChange} error={errors.dependents} required min="0" step="1"/>
         </div>

         <FormField id="reason" name="reason" label="Reason for Assistance" required error={errors.reason}>
             <textarea
                id="reason"
                name="reason"
                rows="4"
                value={formData.reason}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border ${errors.reason ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                placeholder="Briefly explain why you need assistance."
            />
         </FormField>

         <FormField id="document" name="document" label="Upload Payslip or Proof of Income" required error={errors.document}>
             <input
                type="file"
                id="document"
                name="document" // Ensure name matches state/validation
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                required
                className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${errors.document ? 'border border-red-500 rounded-md p-1' : ''}`}
             />
            <small className="mt-1 block text-xs text-gray-500">PDF, JPG, or PNG format. Max file size: 5MB.</small>
         </FormField>


        <div className="pt-4 text-center">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50"
            // disabled={Object.values(errors).some(error => error)} // Optionally disable if there are errors
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
