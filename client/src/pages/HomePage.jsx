import React from 'react';
// Optional: Import icons if you have them set up (like from react-icons)
// import { FaHandsHelping, FaCalculator, FaMapMarkedAlt } from 'react-icons/fa';

// Reusable Button component (Adapt from LendKawKaw or create new)
const Button = ({ children, onClick, type = 'primary' }) => {
  const baseStyle = "px-6 py-2 rounded-md font-semibold text-white transition duration-200 ease-in-out";
  const primaryStyle = "bg-blue-600 hover:bg-blue-700"; // Adjust colors as needed
  const secondaryStyle = "bg-gray-500 hover:bg-gray-600";
  
  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${type === 'primary' ? primaryStyle : secondaryStyle}`}
    >
      {children}
    </button>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300">
    {/* Optional Icon */}
    {/* <div className="text-4xl text-blue-600 mb-4">{icon}</div> */}
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
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
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Reuse Navbar from LendKawKaw if available */}
      {/* <Navbar /> */}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-teal-400 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">ZakatGo: Transform Your Giving</h1>
        <p className="text-lg md:text-xl mb-8">Transparent, Automated & Shariah-Compliant Charity for Zakat, Waqf & Sadaqah.</p>
        <div className="space-x-4">
          <Button onClick={handleDonateClick} type="primary">Donate Now</Button>
          <Button onClick={handleCalculateClick} type="secondary">Calculate Zakat</Button>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 px-4 container mx-auto text-center">
         <h2 className="text-3xl font-semibold mb-4">Empowering Charity with Technology</h2>
         <p className="max-w-3xl mx-auto text-gray-600 mb-12">
           Addressing the need for transparency, efficiency, and accessibility in managing Zakat, Waqf, and Sadaqah funds through innovative fintech solutions.
         </p>
      </section>

      {/* Key Features Section */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">Why Choose ZakatGo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              // icon={<FaCalculator />} 
              title="Zakat Auto-Calculator" 
              description="Easily determine eligibility and calculate the exact Zakat amount based on Shariah guidelines." 
            />
            <FeatureCard 
              // icon={<FaHandsHelping />} 
              title="Transparent Impact Dashboard" 
              description="See exactly where your donations go with real-time charts, maps, and project updates." 
            />
             <FeatureCard 
              // icon={<FaMapMarkedAlt />} 
              title="Geo-Sadaqah Suggestions" 
              description="Discover verified local causes like mosques or food banks nearby, suggested intelligently." 
            />
             {/* Add more FeatureCards for AI Allocation, Waqf Pool simulation, Referral Rewards etc. */}
              <FeatureCard 
                title="AI-Driven Allocation" 
                description="Funds prioritized automatically based on urgency and impact (e.g., medical, food)." 
              />
               <FeatureCard 
                title="Inclusive Access" 
                description="Easy onboarding for everyone, including unbanked individuals using QR codes & MyKad." 
              />
               <FeatureCard 
                title="Blockchain Secured" 
                description="Donations tracked on a transparent, tamper-proof digital ledger for ultimate trust." 
              />
          </div>
        </div>
      </section>

       {/* Call to Action Section */}
       <section className="py-16 px-4 text-center">
           <h2 className="text-3xl font-semibold mb-4">Ready to Make a Difference?</h2>
           <p className="text-lg text-gray-600 mb-8">Join ZakatGo and experience the future of transparent and impactful charity.</p>
           <Button onClick={handleDonateClick} type="primary">Get Started</Button>
       </section>


      {/* Reuse Footer from LendKawKaw if available */}
      {/* <Footer /> */}
    </div>
  );
};

export default Homepage;