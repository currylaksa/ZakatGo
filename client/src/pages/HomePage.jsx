// Please paste your full component code here. I will help complete, clean, or fix it once you add the remaining part.
import { useState } from 'react';
import mapImage from '../assets/Map.png';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

// Reusable Button component with updated styling
const Button = ({ children, onClick, type = 'primary', className = '' }) => {
  const baseStyle = "px-6 py-3 rounded-md font-semibold text-white transition duration-300 ease-in-out shadow-md hover:shadow-lg";
  const primaryStyle = "bg-green-600 hover:bg-green-700"; // Primary green for main actions
  const secondaryStyle = "bg-[#871f39] hover:bg-[#6f162e]"; // Blue for secondary actions
  const outlineStyle = "bg-transparent border-2 border-[#5f0220] text-[#5f0220] hover:bg-[#fbe9ed]";
  const warningStyle = "bg-yellow-500 hover:bg-yellow-600"; // For assistance requests
  const tertiaryStyle = "bg-[#176B87] hover:bg-[#145a73]"; // Blue for tertiary actions
  
  let styleClass = primaryStyle;
  if (type === 'secondary') styleClass = secondaryStyle;
  if (type === 'outline') styleClass = outlineStyle;
  if (type === 'warning') styleClass = warningStyle;
  if (type === 'tertiary') styleClass = tertiaryStyle;
  
  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${styleClass} ${className}`}
    >
      {children}
    </button>
  );
};

// Enhanced Feature Card Component with alert popup
const FeatureCard = ({ icon, title, description, detailedInfo, learnMoreLink, scrollDown }) => {
  const [showAlert, setShowAlert] = useState(false);
  const scrollDownDef = (scrollDown == null) ? false : scrollDown;
  const handleClick = () => {
    setShowAlert(true);
  };

const handleLearnMore = (targetId) => {
    // Delay allows the popup closing animation to complete
  setTimeout(() => {
    //just scroll down
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, 200);
  //close any existing alert
  setShowAlert(false);


};

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <>
      <div 
        className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-green-600 cursor-pointer"
        onClick={handleClick}
      >
    <div className="text-4xl text-green-600 mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-3 text-[#400017]">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
      
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseAlert}>
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="items-center mb-4">
              <h3 className="text-2xl font-bold text-[#400017] text-center">{title}</h3>
            </div>
            <div className="text-4xl text-green-600 mb-4 text-center">{icon}</div>
            <p className="text-gray-700 mb-4">{description}</p>
            {detailedInfo && <p className="text-sm text-gray-600">{detailedInfo}</p>}
            {learnMoreLink && !scrollDownDef ? (
                <a 
                  href={learnMoreLink}
                  className="mt-4 w-full block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                >
                  Learn More
                </a>
              ) : learnMoreLink?(
                <button 
                  onClick={() => handleLearnMore(learnMoreLink)}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                >
                  Learn More
                </button>
              ):<div></div>
              }
            <button 
              onClick={handleCloseAlert}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ name, role, content, avatar }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold mr-4">
        {avatar || name.charAt(0)}
      </div>
      <div>
        <h4 className="font-semibold text-[#400017]">{name}</h4>
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
    <h4 className="font-medium text-[#400017]">{name}</h4>
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

  const handleZakatPaymentClick = () => {
    window.location.href = '/zakat-payment';
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
              <p className="text-sm text-purple-100">Invite friends to Zakat UTM PPZ and earn rewards for spreading the word about charitable giving!</p>
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
      <section className="bg-gradient-to-r from-[#5f0220] to-[#ff4e50] text-white py-20 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Zakat UTM PPZ: One-Stop Zakat Platform</h1>
            <p className="text-lg md:text-xl mb-8 text-[#fbe9ed]">Transparent, Automated & Shariah-Compliant Zakat platform powered by Blockchain & AI Integration.</p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white border-opacity-20">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold">Quick Access</h3>
                <p className="text-[#f4ccd6] text-sm mt-2">Choose how you want to interact with UTM PPZ</p>
              </div>
              <div className="space-y-4"> 
                <Button onClick={handleCalculateClick} className="w-full">Calculate My Zakat</Button>
                <Button onClick={handleZakatPaymentClick} type="tertiary" className="w-full">Zakat Payment</Button>
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
            <h2 className="text-3xl font-bold mb-6 text-[#400017]">Bringing Technology to Islamic Finance</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Zakat UTM PPZ addresses the key challenges in the traditional Zakat system: lack of transparency, inefficiency in distribution, and limited accessibility.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              This platform leverages blockchain technology for secure and transparent transactions, while AI automates Zakat calculations based on uploaded documents like payslips.
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-1 bg-green-600 rounded"></div>
              <p className="text-[#5f0220] font-semibold">100% Shariah-Compliant</p>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="grid grid-cols-2 gap-6">
              <StatDisplay value="100%" label="Transparent via Blockchain" />
              <StatDisplay value="AI-Powered" label="Zakat Calculation" />
              <StatDisplay value="8" label="Zakat Categories" />
              <StatDisplay value="MYR" label="Secure Payments" />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section - Aligned with specific features in proposal */}
      <section className="bg-[#fbe9ed] py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#400017]">Key Features</h2>
            <p className="max-w-2xl mx-auto text-gray-600">This platform offers innovative solutions designed to make your Zakat payments more transparent, efficient, and accessible.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon="🧮" 
              title="AI-Powered Zakat Auto-Calculator" 
              description="Automatically calculates your Zakat obligation based on uploaded documents like payslips." 
              detailedInfo="The AI system uses advanced machine learning to extract financial information from your documents and calculate zakat accurately according to Shariah principles."
            />
            <FeatureCard 
              icon="🔗" 
              title="Blockchain Integration" 
              description="Ensures transparent, real-time tracking of donations through secure, immutable records." 
              detailedInfo="Every transaction is recorded on the blockchain, providing complete transparency and traceability. You can verify your zakat payments anytime through the blockchain explorer."
              learnMoreLink="explorer-dashboard-myr"
            />
            <FeatureCard 
              icon="🧾" 
              title="Donation's Categories" 
              description="Select from the 8 categories for Zakat distribution (Fuqara, Masakin, etc.)." 
              detailedInfo="Choose how your zakat is distributed among the 8 asnaf categories as defined in Islamic law, ensuring your contributions reach those who need it most."
              learnMoreLink="donation-category"
              scrollDown={true}
            />
            <FeatureCard 
              icon="📱" 
              title="Easy Tracing" 
              description="Track the status of your zakat payments with ease, from sent to approved or cancelled." 
              detailedInfo="Once your zakat contribution is sent, you can track its status in real-time on this platform. Whether it's approved, cancelled, or pending, you'll always know the latest information."
              learnMoreLink="/profile"
            />
            <FeatureCard 
              icon="💰" 
              title="MYR Payment System" 
              description="Deposit in Malaysian Ringgit (MYR) and make secure blockchain payments." 
              detailedInfo="All payments are processed in Malaysian Ringgit (MYR) with blockchain verification for complete transparency and security."
            />
            <FeatureCard 
              icon="📊" 
              title="Impact Dashboard" 
              description="Track how your donations are making a difference with real-time visualization." 
              detailedInfo="View detailed analytics showing how your zakat contributions are distributed, including breakdowns by faculty, position, and categories."
              learnMoreLink="/dashboard"
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
              <h3 className="text-2xl font-bold text-[#400017]">Referral Rewards for Good Deeds</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Spread the word about charitable giving and get recognized for your positive impact!
            </p>
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500 mb-6">
              <h4 className="font-medium text-[#400017] mb-2">How It Will Work:</h4>
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
          </div>
          <div className="lg:w-1/2 bg-gradient-to-r from-[#5f0220] to-[#8e44ad] p-8 lg:p-12 text-white">
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
      <div id="donation-category">
      {/* Zakat Categories Section - New section to highlight Islamic aspects */}
      <section className="py-16 px-4 container mx-auto" id="donation-category">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#400017]">Zakat Distribution Categories</h2>
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
      </div>
      {/* How It Works Section - Updated sequence */}
      <section className="py-16 px-4 container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#400017]">How Zakat UTM PPZ Works</h2>
          <p className="max-w-2xl mx-auto text-gray-600">A simple, secure process to manage your Zakat payments</p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center md:space-x-4 lg:space-x-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center mb-8 md:mb-0 w-full md:w-1/5">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-800 text-2xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2 text-[#400017]">Upload Document</h3>
            <p className="text-gray-600 text-sm">Upload your payslip or financial document</p>
          </div>
          <div className="hidden md:block text-green-400 text-4xl">→</div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center mb-8 md:mb-0 w-full md:w-1/5">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-800 text-2xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2 text-[#400017]">AI Processing</h3>
            <p className="text-gray-600 text-sm">AI automatically calculates your Zakat obligation</p>
          </div>
          <div className="hidden md:block text-green-400 text-4xl">→</div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center mb-8 md:mb-0 w-full md:w-1/5">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-800 text-2xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2 text-[#400017]">Choose Categories</h3>
            <p className="text-gray-600 text-sm">Select which Zakat categories you want to support</p>
          </div>
          <div className="hidden md:block text-green-400 text-4xl">→</div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center mb-8 md:mb-0 w-full md:w-1/5">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-800 text-2xl font-bold mx-auto mb-4">4</div>
            <h3 className="text-xl font-semibold mb-2 text-[#400017]">Zakat Payment</h3>
            <p className="text-gray-600 text-sm">Pay securely using MYR</p>
          </div>
          <div className="hidden md:block text-green-400 text-4xl">→</div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center w-full md:w-1/5">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-800 text-2xl font-bold mx-auto mb-4">5</div>
            <h3 className="text-xl font-semibold mb-2 text-[#400017]">Trace Zakat Status</h3>
            <p className="text-gray-600 text-sm">Track your zakat payment status on blockchain</p>
          </div>
        </div>
      </section>

      {/* New Section: Apply for Zakat Assistance - MODIFIED SECTION */}
      <section className="py-16 px-4 container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#400017] flex items-center justify-center">
            <span className="mr-3 text-4xl">💰</span> Need Financial Help?
          </h2>
          <p className="max-w-lg mx-auto text-gray-600 mb-8">Apply for Zakat assistance with dignity</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-6 text-[#400017]">Zakat Assistance System</h3>
              <div className="space-y-4 md:space-y-6">
                {/* Enhanced step-by-step process with icons and better visuals */}
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-full text-yellow-600 mr-4 flex-shrink-0">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#400017] mb-1">Apply</h4>
                    <p className="text-sm text-gray-600">Complete form & upload documents</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-full text-yellow-600 mr-4 flex-shrink-0">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#400017] mb-1">Verification</h4>
                    <p className="text-sm text-gray-600">Eligibility check based on Shariah guidelines</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-full text-yellow-600 mr-4 flex-shrink-0">
                    <span className="text-2xl">🔔</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#400017] mb-1">Status</h4>
                    <p className="text-sm text-gray-600">Get notifications via SMS or app</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-full text-yellow-600 mr-4 flex-shrink-0">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#400017] mb-1">QR Code</h4>
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
                  <h4 className="font-semibold text-[#400017]">QR Code</h4>
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
            <section className="bg-[#fbe9ed] py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#400017]">Track & Monitor the Zakat Distribution</h2>
            <p className="max-w-2xl mx-auto text-gray-600">The transparent dashboard allows you to track and monitor the distribution of Zakat to beneficiaries in real-time. </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-[#400017]">Distribution By Category</h3>
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
                <h3 className="text-xl font-semibold mb-4 text-[#400017]">Beneficiaries Reached</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} label={{ fontSize: 12 }}>
                        <Label value="Category" position="insideBottom"/>
                      </XAxis>
                      <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} 
                        label={{ fontSize: 12 }}>
                        <Label     value="Amount (RM)"
                          angle={-90}
                          position="insideLeft"
                          offset={5}
                          style={{ textAnchor: 'middle' }}/>
                      </YAxis>
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="beneficiaries" fill="#1e40af" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Faculty and Position Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-[#400017]">Zakat by Faculty (UTM PPZ)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { faculty: 'Computing', amount: 12000 },
                        { faculty: 'Engineering', amount: 10000 },
                        { faculty: 'Medicine', amount: 9500 },
                        { faculty: 'Business', amount: 8500 },
                        { faculty: 'Science', amount: 8000 },
                      ]}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                       <XAxis
                        dataKey="faculty"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 10 }}
                        label={{ fontSize: 12 }}
                      >
                        <Label value="Faculty" position="insideBottom"/>
                      </XAxis>
                     
                      <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} 
                        label={{ fontSize: 12 }}>
                          
                        <Label     value="Amount (RM)"
                          angle={-90}
                          position="insideLeft"
                          offset={5}
                          style={{ textAnchor: 'middle' }}/>
                      </YAxis>
                      <Tooltip formatter={(value) => [`RM${Number(value).toLocaleString()}`, 'Amount']} />
                      <Legend />
                      <Bar dataKey="amount" name="Zakat Amount (RM)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-[#400017]">Zakat by Position (UTM PPZ)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { position: 'Professor', amount: 15000 },
                        { position: 'Assoc. Prof', amount: 12000 },
                        { position: 'Sr. Lecturer', amount: 10000 },
                        { position: 'Lecturer', amount: 8000 },
                        { position: 'Asst. Lecturer', amount: 5000 },
                      ]}
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="position" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 10 }}
                        
                      >
                        <Label value="Position" position="insideBottom"/>
                      </XAxis>
                     
                      <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} 
                        label={{ fontSize: 12 }}>
                        <Label     value="Amount (RM)"
                          angle={-90}
                          position="insideLeft"
                          offset={10}
                          style={{ textAnchor: 'middle' }}/>
                      </YAxis>
                      <Tooltip formatter={(value) => [`RM${Number(value).toLocaleString()}`, 'Amount']} />
                      <Legend />
                      <Bar dataKey="amount" name="Zakat Amount (RM)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
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
      <section className="bg-[#fbe9ed] py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#400017]">List of Sadaqah & Waqf</h2>
            <p className="max-w-2xl mx-auto text-gray-600">View the list of Sadaqah and Waqf that are available for you to donate to.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sample Campaign Cards */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
  <div className="h-48 bg-[#f4ccd6] flex items-center justify-center">
  <span className="text-[120px]">🏥</span>
</div>

              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 text-[#400017]">Medical Aid for Refugees</h3>
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
              <div className="h-48 bg-[#f4ccd6] flex items-center justify-center">
                <span className="text-[120px]">🍲</span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 text-[#400017]">Food Bank Initiative</h3>
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
              <div className="h-48 bg-[#f4ccd6] flex items-center justify-center">
                <span className="text-[120px]">🏫</span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 text-[#400017]">Education for Orphans</h3>
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
          <h2 className="text-3xl font-bold mb-4 text-[#400017]">Nearby Sadaqah & Waqf</h2>
          <p className="max-w-2xl mx-auto text-gray-600">Discover verified local causes near you through the geofencing technology</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="h-64 bg-[#fbe9ed] mb-6 rounded-lg flex items-center justify-center relative">
            <img src={mapImage} alt="Location Map" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <span className="text-xl">🕌</span>
                </div>
                <div>
                  <h4 className="font-medium text-[#400017]">Al-Amin Mosque</h4>
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
                  <h4 className="font-medium text-[#400017]">Community Kitchen</h4>
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
                  <h4 className="font-medium text-[#400017]">Islamic Learning Center</h4>
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
        <div className="container mx-auto max-w-4xl bg-gradient-to-r from-[#5f0220] to-[#400017] rounded-2xl p-12 shadow-xl">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Experience This Zakat Website ?</h2>
          <p className="text-lg text-[#fbe9ed] mb-8">Use Zakat UTM now for transparent, efficient, and accessible Islamic charitable giving</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={handleCalculateClick} className="bg-green-600 hover:bg-green-700">Calculate My Zakat</Button>
            <Button onClick={handleZakatPaymentClick} type="secondary">Pay My Zakat</Button>
            <Button onClick={handleCampaignsClick} type="tertiary">View Donation Campaigns</Button>
            <Button onClick={handleAssistanceClick} type="warning">Apply for Assistance</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
