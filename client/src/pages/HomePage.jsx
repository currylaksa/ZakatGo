import React from 'react';
import mapImage from '../assets/Map.png';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Reusable Button component with updated styling
const Button = ({ children, onClick, type = 'primary', className = '' }) => {
  const baseStyle = "px-6 py-3 rounded-md font-semibold text-white transition duration-300 ease-in-out shadow-md hover:shadow-lg";
  const primaryStyle = "bg-green-600 hover:bg-green-700"; // Primary green for main actions
  const secondaryStyle = "bg-blue-600 hover:bg-blue-700"; // Blue for secondary actions
  const outlineStyle = "bg-transparent border-2 border-blue-800 text-blue-800 hover:bg-blue-50";
  const warningStyle = "bg-yellow-500 hover:bg-yellow-600"; // For assistance requests
  
  let styleClass = primaryStyle;
  if (type === 'secondary') styleClass = secondaryStyle;
  if (type === 'outline') styleClass = outlineStyle;
  if (type === 'warning') styleClass = warningStyle;
  
  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${styleClass} ${className}`}
    >
      {children}
    </button>
  );
};

// Enhanced Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-green-600">
    <div className="text-4xl text-green-600 mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-3 text-blue-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Testimonial Card Component
const TestimonialCard = ({ name, role, content, avatar }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold mr-4">
        {avatar || name.charAt(0)}
      </div>
      <div>
        <h4 className="font-semibold text-blue-900">{name}</h4>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
    <p className="text-gray-600 italic">"{content}"</p>
  </div>
);

// Stat Display Component
const StatDisplay = ({ value, label }) => (
  <div className="text-center">
    <div className="text-4xl font-bold text-green-600 mb-2">{value}</div>
    <p className="text-gray-600">{label}</p>
  </div>
);

// Category Card for Zakat Distribution
const CategoryCard = ({ icon, name }) => (
  <div className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition-all cursor-pointer border-l-4 border-green-600">
    <div className="text-2xl text-green-600 mb-2">{icon}</div>
    <h4 className="font-medium text-blue-900">{name}</h4>
  </div>
);

const Homepage = () => {
  // Sample data for charts
  const pieData = [
    { name: 'Fuqara', value: 25 },
    { name: 'Masakin', value: 20 },
    { name: 'Amil Zakat', value: 10 },
    { name: 'Muallaf', value: 15 },
    { name: 'Other Categories', value: 30 },
  ];
  
  const barData = [
    { name: 'Education', beneficiaries: 1200 },
    { name: 'Healthcare', beneficiaries: 900 },
    { name: 'Food', beneficiaries: 1500 },
    { name: 'Housing', beneficiaries: 700 },
    { name: 'Debt Relief', beneficiaries: 500 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Navigation functions based on the prototype
  const handleCalculateClick = () => {
    window.location.href = '/calculator';
  };

  const handleCampaignsClick = () => {
    window.location.href = '/campaigns';
  };

  const handleImpactClick = () => {
    window.location.href = '/dashboard';
  };
  
  const handleAssistanceClick = () => {
    window.location.href = '/zakat-assist';
  };
  
  const handleLearnMoreClick = () => {
    window.location.href = '/referral-program';
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Referral Rewards Announcement Banner - NEW SECTION */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-3 md:mb-0">
            <div className="text-3xl mr-3">🎁</div>
            <div>
              <h3 className="font-bold text-lg">Referral Rewards for Good Deeds - Coming Soon!</h3>
              <p className="text-sm text-purple-100">Invite friends to ZakatGo and earn rewards for spreading the word about charitable giving!</p>
            </div>
          </div>
          <Button 
            onClick={handleLearnMoreClick} 
            className="bg-green text-purple-700 hover:bg-black-100 px-5 py-1"
          >
            Learn More
          </Button>
        </div>
      </section>
      
      {/* Hero Section - Updated to focus on core value proposition */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">ZakatGo: One-Stop Zakat Platform</h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">Transparent, Automated & Shariah-Compliant Zakat platform powered by Blockchain & AI.</p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white border-opacity-20">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold">Quick Access</h3>
                <p className="text-blue-200 text-sm mt-2">Choose how you want to interact with ZakatGo</p>
              </div>
              <div className="space-y-4"> 
                <Button onClick={handleCalculateClick} className="w-full">Calculate My Zakat</Button>
                <Button onClick={handleCampaignsClick} type="secondary" className="w-full">View Donation Campaigns</Button>
                <Button onClick={handleAssistanceClick} type="warning" className="w-full">Apply for Zakat Assistance</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section - Emphasis on blockchain and AI integration */}
      <section className="py-16 px-4 container mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-3xl font-bold mb-6 text-blue-900">Bringing Technology to Islamic Finance</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              ZakatGo addresses the key challenges in the traditional Zakat system: lack of transparency, inefficiency in distribution, and limited accessibility.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our platform leverages blockchain technology for secure and transparent transactions, while AI automates Zakat calculations based on uploaded documents like payslips.
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-1 bg-green-600 rounded"></div>
              <p className="text-blue-800 font-semibold">100% Shariah-Compliant</p>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="grid grid-cols-2 gap-6">
              <StatDisplay value="100%" label="Transparency via Blockchain" />
              <StatDisplay value="AI-Powered" label="Zakat Calculation" />
              <StatDisplay value="8" label="Zakat Categories" />
              <StatDisplay value="ETH" label="Secure Payments" />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section - Aligned with specific features in proposal */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">Key Features</h2>
            <p className="max-w-2xl mx-auto text-gray-600">Our platform offers innovative solutions designed to make your Zakat payments more transparent, efficient, and accessible.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon="🧮" 
              title="AI-Powered Zakat Auto-Calculator" 
              description="Automatically calculates your Zakat obligation based on uploaded documents like payslips." 
            />
            <FeatureCard 
              icon="🔗" 
              title="Blockchain Integration" 
              description="Ensures transparent, real-time tracking of donations through secure, immutable records." 
            />
            <FeatureCard 
              icon="🧾" 
              title="Categorized Donations" 
              description="Select from the 8 categories for Zakat distribution (Fuqara, Masakin, etc.)." 
            />
            <FeatureCard 
              icon="📱" 
              title="Unbanked-Friendly" 
              description="QR codes and National ID recognition for users without bank accounts." 
            />
            <FeatureCard 
              icon="💰" 
              title="ETH Payment System" 
              description="Deposit in Malaysian Ringgit (RM), convert to ETH, and make secure blockchain payments." 
            />
            <FeatureCard 
              icon="📊" 
              title="Impact Dashboard" 
              description="Track how your donations are making a difference with real-time visualization." 
            />
          </div>
        </div>
      </section>

      {/* NEW SECTION: Referral Rewards Feature Highlight */}
      <section className="py-16 px-4 container mx-auto">
        <div className="flex flex-col lg:flex-row items-center bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="lg:w-1/2 p-8 lg:p-12">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full text-purple-600 mr-4">
                <span className="text-3xl">🎁</span>
              </div>
              <h3 className="text-2xl font-bold text-blue-900">Referral Rewards for Good Deeds</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Soon, you'll be able to earn rewards for inviting friends and family to ZakatGo. Spread the word about charitable giving and get recognized for your positive impact!
            </p>
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500 mb-6">
              <h4 className="font-medium text-blue-900 mb-2">How It Will Work:</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="mr-2 text-purple-500">✓</div>
                  <span>Invite others using your personal referral link</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-purple-500">✓</div>
                  <span>Earn badges and recognition when they join</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-purple-500">✓</div>
                  <span>Track your impact and rewards on a personalized dashboard</span>
                </li>
              </ul>
            </div>
            <Button 
              onClick={handleLearnMoreClick} 
              type="secondary" 
              className="bg-purple-600 hover:bg-purple-700"
            >
              Learn More
            </Button>
          </div>
          <div className="lg:w-1/2 bg-gradient-to-r from-purple-500 to-indigo-600 p-8 lg:p-12 text-white">
            <div className="max-w-md mx-auto">
              <h4 className="text-xl font-semibold mb-6">Preview of Rewards Dashboard:</h4>
              <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm border border-white border-opacity-20">
                <div className="mb-6">
                  <p className="text-sm text-purple-100 mb-1">Your Impact</p>
                  <p className="text-3xl font-bold">7 Friends Invited</p>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-purple-100 mb-2">Rewards Progress</p>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-3 mb-2">
                    <div className="bg-white h-3 rounded-full" style={{width: '70%'}}></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>7 invites</span>
                    <span>10 invites for next badge</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-purple-100 mb-3">Your Badges</p>
                  <div className="flex space-x-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-lg">🌱</span>
                    </div>
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-lg">🌟</span>
                    </div>
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-2 border-dashed border-white border-opacity-40">
                      <span className="text-lg">?</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm mt-4 text-purple-100">Coming Soon - Stay Tuned!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Zakat Categories Section - New section to highlight Islamic aspects */}
      <section className="py-16 px-4 container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-blue-900">Zakat Distribution Categories</h2>
          <p className="max-w-2xl mx-auto text-gray-600">Choose how your Zakat will be distributed among these Shariah-defined categories</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CategoryCard icon="👨‍👩‍👧‍👦" name="Fuqara (Poor)" />
          <CategoryCard icon="🏠" name="Masakin (Needy)" />
          <CategoryCard icon="👨‍💼" name="Amil Zakat (Administrators)" />
          <CategoryCard icon="🤝" name="Muallaf (New Muslims)" />
          <CategoryCard icon="🔓" name="Riqab (Freeing Captives)" />
          <CategoryCard icon="💳" name="Gharimin (Debtors)" />
          <CategoryCard icon="🛣️" name="Fi Sabilillah (Cause of Allah)" />
          <CategoryCard icon="🧳" name="Ibn as-Sabil (Travelers)" />
        </div>
      </section>

      {/* How It Works Section - Aligned with system flow */}
      <section className="py-16 px-4 container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-blue-900">How ZakatGo Works</h2>
          <p className="max-w-2xl mx-auto text-gray-600">A simple, secure process to manage your Zakat payments</p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center md:space-x-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center mb-8 md:mb-0 w-full md:w-1/4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-800 text-2xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2 text-blue-900">Upload Document</h3>
            <p className="text-gray-600">Upload your payslip or financial document</p>
          </div>
          <div className="hidden md:block text-green-400 text-4xl">→</div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center mb-8 md:mb-0 w-full md:w-1/4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-800 text-2xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2 text-blue-900">AI Processing</h3>
            <p className="text-gray-600">Our AI automatically calculates your Zakat obligation</p>
          </div>
          <div className="hidden md:block text-green-400 text-4xl">→</div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center mb-8 md:mb-0 w-full md:w-1/4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-800 text-2xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2 text-blue-900">Choose Categories</h3>
            <p className="text-gray-600">Select which Zakat categories you want to support</p>
          </div>
          <div className="hidden md:block text-green-400 text-4xl">→</div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center w-full md:w-1/4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-800 text-2xl font-bold mx-auto mb-4">4</div>
            <h3 className="text-xl font-semibold mb-2 text-blue-900">Blockchain Payment</h3>
            <p className="text-gray-600">Pay securely using ETH and track your contribution</p>
          </div>
        </div>
      </section>

      {/* New Section: Apply for Zakat Assistance - MODIFIED SECTION */}
      <section className="py-16 px-4 container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-blue-900 flex items-center justify-center">
            <span className="mr-3 text-4xl">💰</span> Need Financial Help?
          </h2>
          <p className="max-w-lg mx-auto text-gray-600 mb-8">Apply for Zakat assistance with dignity</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-6 text-blue-900">Zakat Assistance System</h3>
              <div className="space-y-4 md:space-y-6">
                {/* Enhanced step-by-step process with icons and better visuals */}
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-full text-yellow-600 mr-4 flex-shrink-0">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Apply</h4>
                    <p className="text-sm text-gray-600">Complete form & upload documents</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-full text-yellow-600 mr-4 flex-shrink-0">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Verification</h4>
                    <p className="text-sm text-gray-600">Eligibility check based on Shariah guidelines</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-full text-yellow-600 mr-4 flex-shrink-0">
                    <span className="text-2xl">🔔</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Status</h4>
                    <p className="text-sm text-gray-600">Get notifications via SMS or app</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-full text-yellow-600 mr-4 flex-shrink-0">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">QR Code</h4>
                    <p className="text-sm text-gray-600">Redeem assistance at partner locations</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Button onClick={handleAssistanceClick} type="warning" className="w-full">
                    <span className="flex items-center justify-center">
                      <span className="mr-2">📱</span> Apply Now
                    </span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <div className="flex items-center mb-2">
                  <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 mr-3">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h4 className="font-semibold text-blue-900">QR Code</h4>
                </div>
                <p className="text-xs text-gray-600 mb-3">Receive help with dignity at partner stores</p>
                <div className="bg-white p-3 rounded-lg flex items-center justify-center">
                  <div className="border-2 border-gray-300 p-1 rounded">
                    <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                      QR Sample
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* Impact Dashboard Preview with actual charts */}
            <section className="bg-blue-50 py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">Track Your Impact</h2>
            <p className="max-w-2xl mx-auto text-gray-600">Our transparent dashboard lets you see exactly how your contributions are making a difference</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-900">Distribution By Category</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-900">Beneficiaries Reached</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="beneficiaries" fill="#1e40af" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button onClick={handleImpactClick} type="secondary">View Full Dashboard</Button>
            </div>
          </div>
        </div>
      </section>

      {/* NGO Campaign Section - New section based on proposal */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">NGO Campaigns</h2>
            <p className="max-w-2xl mx-auto text-gray-600">Support verified NGO campaigns or create your own if you represent an organization</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sample Campaign Cards */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 bg-blue-200 flex items-center justify-center">
                <span className="text-4xl">🏥</span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 text-blue-900">Medical Aid for Refugees</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{width: '70%'}}></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>RM 70,000 raised</span>
                  <span>Target: RM 100,000</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 bg-blue-200 flex items-center justify-center">
                <span className="text-4xl">🍲</span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 text-blue-900">Food Bank Initiative</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{width: '45%'}}></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>RM 22,500 raised</span>
                  <span>Target: RM 50,000</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 bg-blue-200 flex items-center justify-center">
                <span className="text-4xl">🏫</span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 text-blue-900">Education for Orphans</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{width: '85%'}}></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>RM 42,500 raised</span>
                  <span>Target: RM 50,000</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Button onClick={handleCampaignsClick} type="secondary">View All Campaigns</Button>
          </div>
        </div>
      </section>

      {/* Geofencing-Based Sadaqah Section - New section based on proposal */}
      <section className="py-16 px-4 container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-blue-900">Nearby Sadaqah Opportunities</h2>
          <p className="max-w-2xl mx-auto text-gray-600">Discover verified local causes near you through our geofencing technology</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="h-64 bg-blue-100 mb-6 rounded-lg flex items-center justify-center relative">
            <img src={mapImage} alt="Location Map" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <span className="text-xl">🕌</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Al-Amin Mosque</h4>
                  <p className="text-sm text-gray-600">0.5 km away</p>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <span className="text-xl">🍲</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Community Kitchen</h4>
                  <p className="text-sm text-gray-600">1.2 km away</p>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <span className="text-xl">📚</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Islamic Learning Center</h4>
                  <p className="text-sm text-gray-600">2.3 km away</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Button type="secondary">Enable Location Services</Button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto max-w-4xl bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl p-12 shadow-xl">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Revolutionize Your Zakat Experience?</h2>
          <p className="text-lg text-blue-100 mb-8">Join ZakatGo for transparent, efficient, and accessible Islamic charitable giving</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={handleCalculateClick} className="bg-green-600 hover:bg-green-700">Calculate My Zakat</Button>
            <Button onClick={handleCampaignsClick} type="secondary" className="w-full">View Donation Campaigns</Button>
            <Button onClick={handleAssistanceClick} type="warning">Apply for Assistance</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
