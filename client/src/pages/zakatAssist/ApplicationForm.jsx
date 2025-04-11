import React, { useState, useRef, useEffect } from 'react';

const ApplicationForm = ({ onSubmit }) => {
  // Store form data in state but don't use it for input values directly
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
  
  // Use refs for direct DOM access
  const fullNameRef = useRef(null);
  const icNumberRef = useRef(null);
  const addressRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const monthlyIncomeRef = useRef(null);
  const dependentsRef = useRef(null);
  const reasonRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // UI state
  const [document, setDocument] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [errors, setErrors] = useState({});
  
  // This effect runs once after the component mounts
  // to set initial ref values from state (if any)
  useEffect(() => {
    if (fullNameRef.current) fullNameRef.current.value = formData.fullName;
    if (icNumberRef.current) icNumberRef.current.value = formData.icNumber;
    if (addressRef.current) addressRef.current.value = formData.address;
    if (phoneRef.current) phoneRef.current.value = formData.phone;
    if (emailRef.current) emailRef.current.value = formData.email;
    if (monthlyIncomeRef.current) monthlyIncomeRef.current.value = formData.monthlyIncome;
    if (dependentsRef.current) dependentsRef.current.value = formData.dependents;
    if (reasonRef.current) reasonRef.current.value = formData.reason;
  }, []);
  
  // This function synchronizes the refs with our state before any render
  // but doesn't cause re-renders during typing
  const syncFormDataFromRefs = () => {
    const newFormData = {
      fullName: fullNameRef.current?.value || '',
      icNumber: icNumberRef.current?.value || '',
      address: addressRef.current?.value || '',
      phone: phoneRef.current?.value || '',
      email: emailRef.current?.value || '',
      monthlyIncome: monthlyIncomeRef.current?.value || '',
      dependents: dependentsRef.current?.value || '',
      reason: reasonRef.current?.value || '',
    };
    setFormData(newFormData);
    return newFormData;
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    // First, sync form data from refs to state to preserve all fields
    syncFormDataFromRefs();
    
    try {
      const file = e.target.files?.[0];
      
      if (!file) {
        return;
      }
      
      // Basic validation
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          document: 'Invalid file type. Please upload PDF, JPG, or PNG.'
        }));
        setDocument(null);
        setDocumentName('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          document: 'File is too large. Maximum size is 5MB.'
        }));
        setDocument(null);
        setDocumentName('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      // Valid file
      setDocument(file);
      setDocumentName(file.name);
      setErrors(prev => ({
        ...prev,
        document: null
      }));
      
      console.log("File selected:", file.name);
    } catch (error) {
      console.error("Error in file upload:", error);
    }
  };
  
  // This effect makes sure form data is restored after re-render
  useEffect(() => {
    if (fullNameRef.current) fullNameRef.current.value = formData.fullName;
    if (icNumberRef.current) icNumberRef.current.value = formData.icNumber;
    if (addressRef.current) addressRef.current.value = formData.address;
    if (phoneRef.current) phoneRef.current.value = formData.phone;
    if (emailRef.current) emailRef.current.value = formData.email;
    if (monthlyIncomeRef.current) monthlyIncomeRef.current.value = formData.monthlyIncome;
    if (dependentsRef.current) dependentsRef.current.value = formData.dependents;
    if (reasonRef.current) reasonRef.current.value = formData.reason;
  }, [formData]);

  const validateForm = () => {
    // Sync form data before validation
    const currentFormData = syncFormDataFromRefs();
    const newErrors = {};
    
    // Validate each field
    if (!currentFormData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    
    if (!currentFormData.icNumber.trim()) {
      newErrors.icNumber = 'IC Number is required.';
    } else if (!/^\d{12}$/.test(currentFormData.icNumber.replace(/-/g, ''))) {
      newErrors.icNumber = 'Invalid IC Number format (should be 12 digits).';
    }
    
    if (!currentFormData.address.trim()) newErrors.address = 'Address is required.';
    
    if (!currentFormData.phone.trim()) {
      newErrors.phone = 'Phone Number is required.';
    } else if (!/^(\+?6?01)[0-9]{8,9}$/.test(currentFormData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'Invalid Malaysian phone number format.';
    }
    
    if (currentFormData.email.trim() && !/\S+@\S+\.\S+/.test(currentFormData.email)) {
      newErrors.email = 'Invalid email format.';
    }
    
    if (!currentFormData.monthlyIncome) {
      newErrors.monthlyIncome = 'Monthly Income is required.';
    } else if (isNaN(currentFormData.monthlyIncome) || Number(currentFormData.monthlyIncome) < 0) {
      newErrors.monthlyIncome = 'Monthly Income must be a positive number.';
    }
    
    if (!currentFormData.dependents) {
      newErrors.dependents = 'Number of Dependents is required.';
    } else if (isNaN(currentFormData.dependents) || Number(currentFormData.dependents) < 0 || !Number.isInteger(Number(currentFormData.dependents))) {
      newErrors.dependents = 'Number of Dependents must be a non-negative integer.';
    }
    
    if (!currentFormData.reason.trim()) newErrors.reason = 'Reason for Assistance is required.';
    
    if (!document) newErrors.document = 'Proof of Income document is required.';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      return currentFormData; // Return form data if valid
    }
    return null; // Return null if invalid
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validatedData = validateForm();
    if (validatedData) {
      console.log("Form validated successfully");
      onSubmit({
        ...validatedData,
        document: document,
        applicationDate: new Date().toISOString(),
      });
    } else {
      console.log("Form validation failed:", errors);
    }
  };
  
  // Clear a specific error when user tries to correct it
  const clearError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };
  
  // Blur event handler to validate fields individually when user leaves a field
  const handleBlur = (fieldName) => {
    syncFormDataFromRefs(); // Update state with current input values
    
    // Only validate the specific field that lost focus
    let fieldError = null;
    
    switch(fieldName) {
      case 'fullName':
        if (!formData.fullName.trim()) fieldError = 'Full Name is required.';
        break;
      case 'icNumber':
        if (!formData.icNumber.trim()) {
          fieldError = 'IC Number is required.';
        } else if (!/^\d{12}$/.test(formData.icNumber.replace(/-/g, ''))) {
          fieldError = 'Invalid IC Number format (should be 12 digits).';
        }
        break;
      case 'address':
        if (!formData.address.trim()) fieldError = 'Address is required.';
        break;
      case 'phone':
        if (!formData.phone.trim()) {
          fieldError = 'Phone Number is required.';
        } else if (!/^(\+?6?01)[0-9]{8,9}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
          fieldError = 'Invalid Malaysian phone number format.';
        }
        break;
      case 'email':
        if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
          fieldError = 'Invalid email format.';
        }
        break;
      case 'monthlyIncome':
        if (!formData.monthlyIncome) {
          fieldError = 'Monthly Income is required.';
        } else if (isNaN(formData.monthlyIncome) || Number(formData.monthlyIncome) < 0) {
          fieldError = 'Monthly Income must be a positive number.';
        }
        break;
      case 'dependents':
        if (!formData.dependents) {
          fieldError = 'Number of Dependents is required.';
        } else if (isNaN(formData.dependents) || Number(formData.dependents) < 0 || !Number.isInteger(Number(formData.dependents))) {
          fieldError = 'Number of Dependents must be a non-negative integer.';
        }
        break;
      case 'reason':
        if (!formData.reason.trim()) fieldError = 'Reason for Assistance is required.';
        break;
      default:
        break;
    }
    
    // Update errors state
    if (fieldError) {
      setErrors(prev => ({...prev, [fieldName]: fieldError}));
    } else {
      clearError(fieldName);
    }
  };

  // Simple field component that doesn't rely on value state
  const FormField = ({ id, name, label, type = 'text', error, required, inputRef, children, ...props }) => (
    <div className="mb-5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children ? children : (
        <input
          type={type}
          id={id}
          name={name}
          ref={inputRef}
          onFocus={() => clearError(name)}
          onBlur={() => handleBlur(name)}
          defaultValue={formData[name]} // Use defaultValue to avoid controlled input issues
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <FormField 
            id="fullName" 
            name="fullName" 
            label="Full Name (as per IC)" 
            inputRef={fullNameRef}
            error={errors.fullName} 
            required 
          />
          <FormField 
            id="icNumber" 
            name="icNumber" 
            label="IC Number (e.g., 900101101234)" 
            inputRef={icNumberRef}
            error={errors.icNumber} 
            required 
            placeholder="12 digits without dashes"
          />
        </div>

        <FormField id="address" name="address" label="Current Address" required error={errors.address}>
          <textarea
            id="address"
            name="address"
            rows="3"
            ref={addressRef}
            onFocus={() => clearError('address')}
            onBlur={() => handleBlur('address')}
            defaultValue={formData.address}
            className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <FormField 
            type="tel" 
            id="phone" 
            name="phone" 
            label="Phone Number (e.g., 0123456789)" 
            inputRef={phoneRef}
            error={errors.phone} 
            required 
            placeholder="Start with 01"
          />
          <FormField 
            type="email" 
            id="email" 
            name="email" 
            label="Email Address (Optional)" 
            inputRef={emailRef}
            error={errors.email} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <FormField 
            type="number" 
            id="monthlyIncome" 
            name="monthlyIncome" 
            label="Monthly Household Income (RM)" 
            inputRef={monthlyIncomeRef}
            error={errors.monthlyIncome} 
            required 
            min="0" 
            step="10"
          />
          <FormField 
            type="number" 
            id="dependents" 
            name="dependents" 
            label="Number of Dependents" 
            inputRef={dependentsRef}
            error={errors.dependents} 
            required 
            min="0" 
            step="1"
          />
        </div>

        <FormField id="reason" name="reason" label="Reason for Assistance" required error={errors.reason}>
          <textarea
            id="reason"
            name="reason"
            rows="4"
            ref={reasonRef}
            onFocus={() => clearError('reason')}
            onBlur={() => handleBlur('reason')}
            defaultValue={formData.reason}
            className={`w-full px-4 py-2 border ${errors.reason ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
            placeholder="Briefly explain why you need assistance."
          />
        </FormField>

        <div className="mb-5">
          <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Payslip or Proof of Income <span className="text-red-500">*</span>
          </label>
          <div className={`w-full border ${errors.document ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}>
            <input
              type="file"
              id="document"
              ref={fileInputRef}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="sr-only" // Hide the default input
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 truncate">
                {documentName || "No file selected"}
              </span>
              <button
                type="button"
                onClick={() => {
                  // Save form data before clicking browse
                  syncFormDataFromRefs();
                  fileInputRef.current.click();
                }}
                className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                Browse Files
              </button>
            </div>
          </div>
          {errors.document && <p className="mt-1 text-xs text-red-600">{errors.document}</p>}
          <small className="mt-1 block text-xs text-gray-500">PDF, JPG, or PNG format. Max file size: 5MB.</small>
        </div>

        <div className="pt-4 text-center">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;