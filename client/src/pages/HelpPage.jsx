import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon, ChevronDownIcon, MagnifyingGlassIcon as SearchIcon } from '@heroicons/react/20/solid'; 
import { submitContactForm } from '../services/contactService';

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitError('Please fill out all fields.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await submitContactForm(formData);
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('There was a problem submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const faqCategories = [
    {
      id: 'general',
      title: 'General Information',
      questions: [
        {
          question: 'What is ZakatGo?',
          answer: 'ZakatGo is a one-stop Zakat payment platform with blockchain & AI integration. Our platform simplifies and streamlines the Zakat payment process through features like AI-powered Zakat auto-calculation, blockchain integration for transparency, and user-friendly interfaces for both banked and unbanked users.'
        },
        {
          question: 'How does ZakatGo ensure Shariah compliance?',
          answer: 'ZakatGo ensures Shariah compliance through smart contracts and blockchain integration that follow Islamic principles for Zakat distribution. Our calculations and distribution methods are reviewed by Shariah advisors to maintain full compliance with Islamic principles.'
        },
        {
          question: 'Is my data secure on ZakatGo?',
          answer: 'Yes, your data is secure. We use encryption and follow industry best practices for data security. Your personal information is only used for Zakat calculation and is never shared with third parties without your consent.'
        },
      ]
    },
    {
      id: 'zakat-calculator',
      title: 'Zakat Calculator',
      questions: [
        {
          question: 'How does the Zakat Auto-Calculator work?',
          answer: 'Our Zakat Auto-Calculator uses AI to read and process your uploaded documents (like payslips). The system automatically extracts relevant financial information and calculates your Zakat obligation according to Islamic principles. You can review and adjust the information before finalizing your calculation.'
        },
        {
          question: 'What documents can I upload for Zakat calculation?',
          answer: 'You can upload payslips, bank statements, and other financial documents in PDF format. Our AI system will extract the necessary information to calculate your Zakat.'
        },
        {
          question: 'Can I manually input my financial information?',
          answer: 'Yes, you can manually input your financial information if you prefer not to upload documents or if you need to add information that isn\'t in your uploaded documents.'
        },
      ]
    },
    {
      id: 'blockchain-payments',
      title: 'Blockchain & Payments',
      questions: [
        {
          question: 'How do blockchain payments work on ZakatGo?',
          answer: 'ZakatGo uses Ethereum blockchain for secure and transparent transactions. When you pay Zakat, your funds are deposited in Malaysian Ringgit (RM), converted to ETH, and then distributed through blockchain technology. This ensures your donation is traceable and transparently managed.'
        },
        {
          question: 'Can I pay Zakat using traditional methods?',
          answer: 'Yes, we support traditional payment methods alongside blockchain payments. You can use credit/debit cards, bank transfers, or e-wallets to make your Zakat payments.'
        },
        {
          question: 'How do I track my blockchain transactions?',
          answer: 'After making a payment, you can view all transaction details in your user profile under "Transaction History." Each transaction includes a unique identifier that you can use to track it on the blockchain.'
        },
      ]
    },
    {
      id: 'donation-categories',
      title: 'Zakat Categories & Donations',
      questions: [
        {
          question: 'What are the 8 categories for Zakat distribution?',
          answer: 'The 8 Zakat categories are: Fuqara (the poor), Masakin (the needy), Amil Zakat (Zakat administrators), Muallaf (converts to Islam), Riqab (freeing from bondage), Gharimin (those in debt), Fi Sabilillah (in the cause of Allah), and Ibn as-Sabil (travelers in need). You can select which categories you would like your Zakat to support.'
        },
        {
          question: 'How does ZakatGo verify NGO campaigns?',
          answer: 'ZakatGo thoroughly verifies all NGO campaigns on our platform to ensure legitimacy. We require official registration documents, check their track record, and regularly monitor campaign activities to maintain trust and transparency.'
        },
        {
          question: 'What is the geofencing-based Sadaqah suggestion feature?',
          answer: 'This feature uses your location to suggest nearby verified donation opportunities, such as local mosques, food banks, or other charitable causes. It makes it easier for you to find and support causes in your community.'
        },
      ]
    },
    {
      id: 'unbanked-users',
      title: 'Features for Unbanked Users',
      questions: [
        {
          question: 'How can I use ZakatGo if I don\'t have a bank account?',
          answer: 'ZakatGo is designed to be inclusive for unbanked users. You can use QR codes with your National ID (MyKad) to make and track donations at participating physical locations like Speed99 stores.'
        },
        {
          question: 'How does the QR code donation tracking work?',
          answer: 'Each user in need is assigned a unique QR code. When you donate at a physical location, you can scan this QR code to ensure your donation is properly tracked and directed to the intended recipient.'
        },
      ]
    },
    {
      id: 'support',
      title: 'Support & Contact',
      questions: [
        {
          question: 'How can I contact ZakatGo support?',
          answer: 'You can reach our support team by email at support@zakatgo.com, through the contact form on this page, or by phone at +60 3-1234 5678 during business hours (9 AM - 5 PM, Monday-Friday).'
        },
        {
          question: 'What should I do if I find a technical issue?',
          answer: 'If you encounter any technical issues, please take a screenshot (if applicable), note what you were trying to do, and contact our support team. We aim to resolve all technical issues within 24-48 hours.'
        },
      ]
    },
  ];

  // Filter FAQs based on search term
  const filteredFAQs = searchTerm 
    ? faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(qa => 
          qa.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          qa.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqCategories;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-green-600 mb-2">ZakatGo Help Center</h1>
          <p className="text-xl text-gray-600">Find answers to common questions about ZakatGo</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-xl mx-auto">
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-12 py-3 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="font-medium text-green-600">Zakat Calculator</h3>
              <p className="text-sm text-gray-500">Learn how to calculate your Zakat obligation</p>
              <a href="#zakat-calculator" className="text-sm text-green-600 hover:text-green-700 mt-2 inline-block">View FAQs →</a>
            </div>
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="font-medium text-green-600">Blockchain Payments</h3>
              <p className="text-sm text-gray-500">Understanding secure blockchain transactions</p>
              <a href="#blockchain-payments" className="text-sm text-green-600 hover:text-green-700 mt-2 inline-block">View FAQs →</a>
            </div>
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="font-medium text-green-600">Contact Support</h3>
              <p className="text-sm text-gray-500">Get help from our dedicated support team</p>
              <a href="#support" className="text-sm text-green-600 hover:text-green-700 mt-2 inline-block">View Contact Options →</a>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          {filteredFAQs.map((category) => (
            <div key={category.id} id={category.id} className="bg-white rounded-lg shadow overflow-hidden">
              <h2 className="bg-green-50 px-4 py-3 text-lg font-medium text-green-800">{category.title}</h2>
              <div className="divide-y divide-gray-200">
                {category.questions.map((faq, index) => (
                  <Disclosure key={index}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="py-4 px-4 w-full flex justify-between items-center text-left focus:outline-none focus-visible:ring focus-visible:ring-green-500">
                          <span className="text-gray-800 font-medium">{faq.question}</span>
                          {open ? (
                            <ChevronUpIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-green-500" />
                          )}
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pb-4 pt-1 text-gray-600">
                          {faq.answer}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6">Can't find what you're looking for? Contact our support team directly.</p>
          
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
              <p className="font-medium">Thank you for contacting us!</p>
              <p className="text-sm">Our support team will get back to you as soon as possible.</p>
            </div>
          )}
          
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
              <p>{submitError}</p>
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Your name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
              <select
                id="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                required
              >
                <option value="">Select a subject</option>
                <option value="zakat-calculation">Zakat Calculation</option>
                <option value="payment-issue">Payment Issue</option>
                <option value="account-problem">Account Problem</option>
                <option value="technical-issue">Technical Issue</option>
                <option value="suggestion">Suggestion</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Describe your issue or question in detail..."
                required
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional contact methods */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            You can also reach us at <a href="mailto:support@zakatgo.com" className="text-green-600 hover:text-green-700">support@zakatgo.com</a> or call us at <span className="text-green-600">+60 3-1234 5678</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
