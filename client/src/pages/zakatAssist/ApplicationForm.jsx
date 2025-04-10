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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDocument(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would validate the form fields here
    onSubmit({
      ...formData,
      document,
      applicationDate: new Date().toISOString(),
    });
  };

  return (
    <div>
      <h2>Step 1: Application Form</h2>
      <p>Please fill in your details to apply for Zakat assistance.</p>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="icNumber">IC Number:</label>
          <input
            type="text"
            id="icNumber"
            name="icNumber"
            value={formData.icNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="monthlyIncome">Monthly Income (RM):</label>
          <input
            type="number"
            id="monthlyIncome"
            name="monthlyIncome"
            value={formData.monthlyIncome}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="dependents">Number of Dependents:</label>
          <input
            type="number"
            id="dependents"
            name="dependents"
            value={formData.dependents}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="reason">Reason for Assistance:</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="document">Upload Payslip or Proof of Income:</label>
          <input
            type="file"
            id="document"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            required
          />
          <small>Please upload your latest pay slip or any document that proves your financial status</small>
        </div>

        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
};

export default ApplicationForm;
