import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ApprovalReportPage = ({hideHeader = false}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // In a real application, this data would come from the backend
  // For demo purposes, we're using mock data for the Fakir category
  const mockApprovalData = {
    applicationId: "ZKT-25-0419-001",
    applicantName: "Mohd Ali bin Mohd Noor",
    approvalDate: "April 19, 2025",
    asnafCategory: "fakir",
    approvedAmount: 2500,
    disbursementDate: "April 25, 2025",
    disbursementMethod: "QR Code Access",
    purpose: "Basic Necessities & Housing Assistance",
    
    // Detailed breakdown of the suggested spending allocation
    approvalBreakdown: [
      { category: "Food & Groceries", amount: 800, period: "Monthly", description: "Basic food and household necessities" },
      { category: "Housing Rent", amount: 950, period: "Monthly", description: "Assistance for family dwelling" },
      { category: "Utilities", amount: 350, period: "Monthly", description: "Water, electricity, and gas bills" },
      { category: "Medical Expenses", amount: 400, period: "Monthly", description: "Medications and clinic visits" },
    ],
    
    // Usage guidelines for the disbursed funds
    usageGuidelines: [
      "This spending breakdown is a recommendation to help you manage your assistance funds",
      "You have flexibility to adjust spending based on your most urgent needs",
      "Any change in financial circumstances should be reported for potential additional support",
      "Support is reviewed every 6 months and may be adjusted based on circumstances"
    ],
    
    // Next steps for the applicant
    nextSteps: [
      "Proceed to get your QR code on the next screen",
      "Attend a brief orientation session (online) on April 22, 2025",
      "Download the ZakatGo app to track your spending and available balance",
      "Contact your assigned case officer for any questions or concerns"
    ],
    
    // Support contact info
    supportContact: {
      name: "Nur Hafizah binti Ibrahim",
      role: "Zakat Case Officer",
      phone: "012-345-6789",
      email: "hafizah.ibrahim@zakatgo.org",
      hours: "Monday to Friday, 9am-5pm"
    },
    
    // Future programs that might be relevant to this applicant
    relevantPrograms: [
      { name: "Skill Development Program", description: "Free training courses to develop employable skills" },
      { name: "Micro-Business Grant", description: "Seed funding to start small businesses" },
      { name: "Children's Education Support", description: "School supplies and tuition assistance" }
    ]
  };
  
  // In a real application, we would fetch the approval data using the application ID
  const approvalData = mockApprovalData;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' }).format(amount);
  };
  
  // Get appropriate category description
  const getCategoryDetails = () => {
    switch(approvalData.asnafCategory) {
      case 'fakir':
        return {
          title: "Fakir (The Poor)",
          description: "Those who have no means to sustain themselves and their families' basic needs.",
          eligibilityCriteria: [
            "Those without property or income",
            "Those whose income is less than 50% of their basic needs",
            "Unable to work due to disability, illness, or old age",
            "Have dependents but insufficient means to support them"
          ],
          icon: "🏠"
        };
      // Other categories would be defined here
      default:
        return {
          title: "Undefined Category",
          description: "Category details not available.",
          eligibilityCriteria: [],
          icon: "❓"
        };
    }
  };
  
  const categoryDetails = getCategoryDetails();
  const totalApproved = approvalData.approvedAmount;
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Approval notification - Only show when not embedded in the step flow */}
      {!hideHeader && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-lg font-medium text-green-800">
                Your Zakat Application Has Been Approved!
              </p>
              <p className="text-sm text-green-700 mt-1">
                Application ID: {approvalData.applicationId} | Approval Date: {approvalData.approvalDate}
              </p>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Zakat Assistance Approval Report</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Applicant Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Applicant Name</p>
              <p className="font-medium">{approvalData.applicantName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Application ID</p>
              <p className="font-medium">{approvalData.applicationId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Approval Date</p>
              <p className="font-medium">{approvalData.approvalDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Disbursement Method</p>
              <p className="font-medium">{approvalData.disbursementMethod}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
          <div className="flex items-center">
            <span className="text-4xl mr-4">{categoryDetails.icon}</span>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{categoryDetails.title}</h2>
              <p className="text-gray-600">{categoryDetails.description}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Eligibility Criteria:</h3>
          <ul className="list-disc pl-5 space-y-1 mb-6">
            {categoryDetails.eligibilityCriteria.map((criteria, index) => (
              <li key={index} className="text-gray-600">{criteria}</li>
            ))}
          </ul>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Total Approved Amount:</h3>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totalApproved)}</p>
            <p className="text-gray-600 mt-1">Available through your QR code at partner stores</p>
          </div>
          
          <h3 className="text-lg font-medium text-gray-800 mb-3">Suggested Spending Allocation:</h3>
          <p className="text-gray-600 mb-4 italic">This breakdown is a guideline to help you manage your funds. You have flexibility to adjust based on your needs.</p>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suggested Amount</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {approvalData.approvalBreakdown.map((item, index) => (
                  <tr key={index}>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.category}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatCurrency(item.amount)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{item.period}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{item.description}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">Total</td>
                  <td colSpan="3" className="py-3 px-4 text-sm font-bold text-gray-900">{formatCurrency(totalApproved)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
            <h2 className="text-xl font-semibold text-gray-800">Usage Recommendations</h2>
          </div>
          <div className="p-6">
            <ul className="list-disc pl-5 space-y-2">
              {approvalData.usageGuidelines.map((guideline, index) => (
                <li key={index} className="text-gray-600">{guideline}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
            <h2 className="text-xl font-semibold text-gray-800">Next Steps</h2>
          </div>
          <div className="p-6">
            <ol className="list-decimal pl-5 space-y-2">
              {approvalData.nextSteps.map((step, index) => (
                <li key={index} className="text-gray-600">{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
          <h2 className="text-xl font-semibold text-gray-800">Your Support Contact</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="mb-4 sm:mb-0 sm:mr-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl text-blue-700">
                  {approvalData.supportContact.name.split(' ').map(name => name[0]).join('')}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">{approvalData.supportContact.name}</h3>
              <p className="text-gray-600">{approvalData.supportContact.role}</p>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Phone:</span> {approvalData.supportContact.phone}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {approvalData.supportContact.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Available:</span> {approvalData.supportContact.hours}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
          <h2 className="text-xl font-semibold text-gray-800">Other Programs That May Help You</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {approvalData.relevantPrograms.map((program, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer">
                <h3 className="font-medium text-blue-700">{program.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{program.description}</p>
                <button className="mt-3 text-sm text-blue-600 hover:underline">Learn more</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
        >
          Back
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Report
        </button>
      </div>
    </div>
  );
};

export default ApprovalReportPage;