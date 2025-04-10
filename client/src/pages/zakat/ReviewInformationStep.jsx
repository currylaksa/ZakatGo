import React, { useState } from 'react';

const ReviewInformationStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  const [formData, setFormData] = useState({
    name: userData.documentData.name || '',
    salary: userData.documentData.salary || '',
    deductions: userData.documentData.deductions || '',
    assets: userData.documentData.assets || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserData({ personalInfo: formData });
    nextStep();
  };

  return (
    <div>
      <h2>Step 2: Review & Complete Information</h2>
      <p>Please review the information extracted from your document and complete any missing fields.</p>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Monthly Salary (RM):</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Deductions (RM):</label>
          <input
            type="number"
            name="deductions"
            value={formData.deductions}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label>Total Assets Value (RM):</label>
          <input
            type="number"
            name="assets"
            value={formData.assets}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <button type="button" onClick={prevStep}>Back</button>
          <button type="submit">Continue</button>
        </div>
      </form>
    </div>
  );
};

export default ReviewInformationStep;
