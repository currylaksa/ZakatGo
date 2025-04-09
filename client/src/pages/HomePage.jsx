import React from 'react';

// Reusable Button component with updated styling
const Button = ({ children, onClick, type = 'primary', className = '' }) => {
  const baseStyle = "px-6 py-3 rounded-md font-semibold text-white transition duration-300 ease-in-out shadow-md hover:shadow-lg";
  const primaryStyle = "bg-blue-800 hover:bg-blue-900"; // Navy blue theme
  const secondaryStyle = "bg-blue-600 hover:bg-blue-700";
  const outlineStyle = "bg-transparent border-2 border-blue-800 text-blue-800 hover:bg-blue-50";
  
  let styleClass = primaryStyle;
  if (type === 'secondary') styleClass = secondaryStyle;
  if (type === 'outline') styleClass = outlineStyle;
  
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
  <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-blue-600">
    <div className="text-4xl text-blue-700 mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-3 text-blue-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Testimonial Card Component
const TestimonialCard = ({ name, role, content, avatar }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold mr-4">
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
    <div className="text-4xl font-bold text-blue-900 mb-2">{value}</div>
    <p className="text-gray-600">{label}</p>
  </div>
);

const Homepage = () => {
  // Dummy function for button clicks in prototype
  const handleDonateClick = () => {
    alert('Navigate to Donation Page (Prototype)');
  };

  const handleCalculateClick = () => {
    alert('Navigate to Zakat Calculator (Prototype)');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navigation Bar is removed as requested */}

      {/* Hero Section with more visually appealing layout */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-24 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">ZakatGo: Transform Your Giving</h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">Transparent, Automated & Shariah-Compliant Charity for Zakat, Waqf & Sadaqah.</p>
            <div className="flex space-x-4">
              <Button onClick={handleDonateClick} type="primary" className="bg-green-600 hover:bg-green-700">Donate Now</Button>
              <Button onClick={handleCalculateClick} type="outline">Calculate Zakat</Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white border-opacity-20">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold">Quick Donation</h3>
              </div>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button type="secondary" className="flex-1 py-2">RM50</Button>
                  <Button type="secondary" className="flex-1 py-2">RM100</Button>
                  <Button type="secondary" className="flex-1 py-2">RM200</Button>
                </div>
                <Button type="primary" className="w-full bg-green-600 hover:bg-green-700">Donate Now</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section with visual elements */}
      <section className="py-20 px-4 container mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-3xl font-bold mb-6 text-blue-900">Empowering Charity with Technology</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              ZakatGo addresses the need for transparency, efficiency, and accessibility in managing Zakat, Waqf, and Sadaqah funds through innovative fintech solutions.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We combine Islamic finance principles with cutting-edge technology to ensure your charitable contributions reach those who need it most.
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-1 bg-blue-600 rounded"></div>
              <p className="text-blue-800 font-semibold">100% Shariah-Compliant</p>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="grid grid-cols-2 gap-6">
              <StatDisplay value="100%" label="Transparency" />
              <StatDisplay value="24/7" label="Accessibility" />
              <StatDisplay value="0%" label="Hidden Fees" />
              <StatDisplay value="500+" label="Projects Funded" />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section with icons */}
      <section className="bg-blue-50 py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">Why Choose ZakatGo?</h2>
            <p className="max-w-2xl mx-auto text-gray-600">Our platform offers unique features designed to make your charitable giving more effective, transparent, and rewarding.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon="🧮" 
              title="Zakat Auto-Calculator" 
              description="Easily determine eligibility and calculate the exact Zakat amount based on Shariah guidelines." 
            />
            <FeatureCard 
              icon="📊" 
              title="Transparent Impact Dashboard" 
              description="See exactly where your donations go with real-time charts, maps, and project updates." 
            />
            <FeatureCard 
              icon="🗺️" 
              title="Geo-Sadaqah Suggestions" 
              description="Discover verified local causes like mosques or food banks nearby, suggested intelligently." 
            />
            <FeatureCard 
              icon="🤖" 
              title="AI-Driven Allocation" 
              description="Funds prioritized automatically based on urgency and impact (e.g., medical, food)." 
            />
            <FeatureCard 
              icon="📱" 
              title="Inclusive Access" 
              description="Easy onboarding for everyone, including unbanked individuals using QR codes & MyKad." 
            />
            <FeatureCard 
              icon="🔗" 
              title="Blockchain Secured" 
              description="Donations tracked on a transparent, tamper-proof digital ledger for ultimate trust." 
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-blue-900">How ZakatGo Works</h2>
          <p className="max-w-2xl mx-auto text-gray-600">A simple, secure process to manage your charitable giving</p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center md:space-x-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center mb-8 md:mb-0 w-full md:w-1/4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 text-2xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2 text-blue-900">Register</h3>
            <p className="text-gray-600">Create your account in minutes with simple verification</p>
          </div>
          <div className="hidden md:block text-blue-400 text-4xl">→</div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center mb-8 md:mb-0 w-full md:w-1/4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 text-2xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2 text-blue-900">Calculate</h3>
            <p className="text-gray-600">Use our tools to determine your Zakat obligation</p>
          </div>
          <div className="hidden md:block text-blue-400 text-4xl">→</div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center w-full md:w-1/4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 text-2xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2 text-blue-900">Contribute</h3>
            <p className="text-gray-600">Donate securely and track your impact in real-time</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-blue-900 py-20 px-4 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="max-w-2xl mx-auto text-blue-100">Trusted by thousands of Muslims worldwide for their Zakat and Sadaqah management</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Ahmad Hassan" 
              role="Regular Donor" 
              content="ZakatGo made calculating and paying my Zakat so simple. I love being able to see exactly where my contributions are making an impact."
            />
            <TestimonialCard 
              name="Fatima Ali" 
              role="Monthly Contributor" 
              content="The transparency is what I value most. For the first time, I can track my donations from my account all the way to the beneficiaries."
            />
            <TestimonialCard 
              name="Yusof Ibrahim" 
              role="Business Owner" 
              content="As a business owner, the business Zakat calculator has been invaluable. The automated reminders ensure I never miss my obligations."
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section with enhanced design */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl p-12 shadow-xl">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Make a Difference?</h2>
          <p className="text-lg text-blue-100 mb-8">Join ZakatGo and experience the future of transparent and impactful charity.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button onClick={handleDonateClick} type="primary" className="bg-green-600 hover:bg-green-700">
              Donate Now
            </Button>
            <Button onClick={handleCalculateClick} type="outline" className="border-white text-white hover:bg-blue-800">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ZakatGo</h3>
              <p className="text-blue-200 mb-4">Transforming charitable giving with technology and transparency.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-blue-200">
                  <span className="sr-only">Facebook</span>
                  📱
                </a>
                <a href="#" className="text-white hover:text-blue-200">
                  <span className="sr-only">Twitter</span>
                  📱
                </a>
                <a href="#" className="text-white hover:text-blue-200">
                  <span className="sr-only">Instagram</span>
                  📱
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200 hover:text-white">Home</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Services</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Projects</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200 hover:text-white">Zakat Guide</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Waqf Explained</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-blue-200">
                <li>hello@zakatgo.com</li>
                <li>+603 1234 5678</li>
                <li>Kuala Lumpur, Malaysia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
            <p>&copy; {new Date().getFullYear()} ZakatGo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
