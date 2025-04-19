import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

// Colors for charts
const COLORS = ['#06b6d4', '#3b82f6', '#10b981', '#f97316', '#facc15', '#8b5cf6', '#ec4899', '#14b8a6'];

// Mock Demographic Data for Zakat Contributors and Recipients
const demographicData = {
  // Donor age distribution
  ageDistribution: [
    { age: '18-24', count: 45, percentage: 13 },
    { age: '25-34', count: 103, percentage: 30 },
    { age: '35-44', count: 86, percentage: 25 },
    { age: '45-54', count: 67, percentage: 19 },
    { age: '55-64', count: 32, percentage: 9 },
    { age: '65+', count: 14, percentage: 4 },
  ],
  
  // Donor income bracket
  incomeBrackets: [
    { bracket: 'RM2,500-5,000', count: 78, percentage: 22 },
    { bracket: 'RM5,001-10,000', count: 125, percentage: 36 },
    { bracket: 'RM10,001-15,000', count: 87, percentage: 25 },
    { bracket: 'RM15,001-20,000', count: 42, percentage: 12 },
    { bracket: 'Above RM20,000', count: 15, percentage: 5 },
  ],
  
  // Donor occupation categories
  occupationCategories: [
    { category: 'Professional', count: 98, percentage: 28 },
    { category: 'Government', count: 67, percentage: 19 },
    { category: 'Private Sector', count: 112, percentage: 32 },
    { category: 'Self-employed', count: 45, percentage: 13 },
    { category: 'Retiree', count: 15, percentage: 5 },
    { category: 'Other', count: 10, percentage: 3 },
  ],
  
  // Nisab awareness status
  nisabAwareness: [
    { status: 'Well Informed', value: 185, percentage: 53 },
    { status: 'Somewhat Aware', value: 102, percentage: 29 },
    { status: 'Limited Knowledge', value: 60, percentage: 18 },
  ],
  
  // Zakat payment frequency
  paymentFrequency: [
    { frequency: 'Monthly', value: 112, percentage: 32 },
    { frequency: 'Quarterly', value: 65, percentage: 19 },
    { frequency: 'Annually', value: 143, percentage: 41 },
    { frequency: 'Irregular', value: 27, percentage: 8 },
  ],
  
  // Payment methods preferred
  paymentMethods: [
    { method: 'ZakatGo Platform', value: 147, percentage: 42 },
    { method: 'Bank Transfer', value: 96, percentage: 28 },
    { method: 'Traditional Zakat Office', value: 75, percentage: 22 },
    { method: 'Other', value: 29, percentage: 8 },
  ]
};

// Beneficiary demographics
const beneficiaryData = {
  // Recipient categories
  recipientTypes: [
    { type: 'Single Parents', count: 47, percentage: 32 },
    { type: 'Elderly', count: 35, percentage: 24 },
    { type: 'Students', count: 29, percentage: 20 },
    { type: 'Unemployed', count: 18, percentage: 12 },
    { type: 'Medical Needs', count: 17, percentage: 12 },
  ],
  
  // Education Level of Recipients
  educationLevel: [
    { level: 'Primary', count: 22, percentage: 15 },
    { level: 'Secondary', count: 63, percentage: 43 },
    { level: 'Diploma', count: 42, percentage: 29 },
    { level: 'Degree', count: 18, percentage: 12 },
    { level: 'Postgraduate', count: 1, percentage: 1 },
  ],
  
  // Housing situation
  housingSituation: [
    { situation: 'Renting', count: 86, percentage: 59 },
    { situation: 'Own home (with loans)', count: 32, percentage: 22 },
    { situation: 'Own home (paid off)', count: 10, percentage: 7 },
    { situation: 'Living with family', count: 18, percentage: 12 },
  ],
  
  // Average household size
  householdSize: [
    { size: '1-2 members', count: 28, percentage: 19 },
    { size: '3-4 members', count: 47, percentage: 32 },
    { size: '5-6 members', count: 52, percentage: 36 },
    { size: '7+ members', count: 19, percentage: 13 },
  ]
};

// Demographic data for radar chart
const radarData = [
  { subject: 'Income Level', A: 85, B: 65, fullMark: 100 },
  { subject: 'Zakat Knowledge', A: 78, B: 45, fullMark: 100 },
  { subject: 'Tech Adoption', A: 92, B: 30, fullMark: 100 },
  { subject: 'Urban Residence', A: 80, B: 40, fullMark: 100 },
  { subject: 'Education Level', A: 75, B: 55, fullMark: 100 },
  { subject: 'Age (Younger)', A: 65, B: 45, fullMark: 100 },
];

const ImpactDashboardPage = () => {
  const [chartType, setChartType] = useState('bar');
  const [categoryView, setCategoryView] = useState('zakat');
  const [isBlockchainVerified, setIsBlockchainVerified] = useState(false);
  const [demographicView, setDemographicView] = useState('donors');
  const [detailView, setDetailView] = useState('age');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const timer = setTimeout(() => setIsBlockchainVerified(true), 2000);
    
    // Add responsive handler
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-3 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 text-green-700">ZakatGo Impact Dashboard</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm md:text-base">
            Visualizing the collective impact of ZakatGo donations across Malaysia.
            All transactions are verified on blockchain for complete transparency.
          </p>
          <div className="flex justify-center mt-3">
            <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${isBlockchainVerified ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-yellow-100 text-yellow-700 border border-yellow-300 animate-pulse'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isBlockchainVerified ? "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"} /></svg>
              {isBlockchainVerified ? 'Blockchain Verified' : 'Verifying Blockchain Data...'}
            </div>
          </div>
        </div>

        {/* PPZ Collaboration Section: Demographic Insights */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200 mt-4 md:mt-6">
          <h2 className="text-lg md:text-xl font-semibold mb-2 text-green-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Demographic Insights Dashboard for PPZ
          </h2>
          <p className="text-gray-600 mb-4 md:mb-6 text-xs md:text-sm">
            Comprehensive analysis of ZakatGo user demographics to help Pusat Pungutan Zakat (PPZ) understand the zakat ecosystem better and identify potential collaboration opportunities.
          </p>

          {/* Demographic View Selector - Improved mobile layout */}
          <div className="flex flex-col md:flex-row gap-3 mb-4 md:mb-6">
            <div className="flex rounded-lg overflow-hidden border border-gray-300 w-full md:w-auto">
              <button 
                onClick={() => setDemographicView('donors')} 
                className={`flex-1 md:flex-initial px-2 md:px-4 py-2 text-xs md:text-sm font-medium ${demographicView === 'donors' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Zakat Contributors
              </button>
              <button 
                onClick={() => setDemographicView('recipients')} 
                className={`flex-1 md:flex-initial px-2 md:px-4 py-2 text-xs md:text-sm font-medium ${demographicView === 'recipients' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Zakat Recipients
              </button>
              <button 
                onClick={() => setDemographicView('comparison')} 
                className={`flex-1 md:flex-initial px-2 md:px-4 py-2 text-xs md:text-sm font-medium ${demographicView === 'comparison' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Digital vs Traditional
              </button>
            </div>
            {/* Sub-categories in scrollable container for mobile */}
            {demographicView === 'donors' && (
              <div className="overflow-x-auto">
                <div className="flex rounded-lg overflow-hidden border border-gray-300 min-w-max md:min-w-0">
                  <button 
                    onClick={() => setDetailView('age')} 
                    className={`px-3 py-1 text-xs font-medium ${detailView === 'age' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Age
                  </button>
                  <button 
                    onClick={() => setDetailView('income')} 
                    className={`px-3 py-1 text-xs font-medium ${detailView === 'income' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Income
                  </button>
                  <button 
                    onClick={() => setDetailView('occupation')} 
                    className={`px-3 py-1 text-xs font-medium ${detailView === 'occupation' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Occupation
                  </button>
                  <button 
                    onClick={() => setDetailView('awareness')} 
                    className={`px-3 py-1 text-xs font-medium ${detailView === 'awareness' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Zakat Awareness
                  </button>
                  <button 
                    onClick={() => setDetailView('payment')} 
                    className={`px-3 py-1 text-xs font-medium ${detailView === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Payment Habits
                  </button>
                </div>
              </div>
            )}
            {demographicView === 'recipients' && (
              <div className="overflow-x-auto">
                <div className="flex rounded-lg overflow-hidden border border-gray-300 min-w-max md:min-w-0">
                  <button 
                    onClick={() => setDetailView('category')} 
                    className={`px-3 py-1 text-xs font-medium ${detailView === 'category' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Categories
                  </button>
                  <button 
                    onClick={() => setDetailView('education')} 
                    className={`px-3 py-1 text-xs font-medium ${detailView === 'education' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Education
                  </button>
                  <button 
                    onClick={() => setDetailView('housing')} 
                    className={`px-3 py-1 text-xs font-medium ${detailView === 'housing' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Housing
                  </button>
                  <button 
                    onClick={() => setDetailView('household')} 
                    className={`px-3 py-1 text-xs font-medium ${detailView === 'household' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Household Size
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Demographic Content - Better stacking on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Chart Section - Height adjustments for mobile */}
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
              {demographicView === 'donors' && (
                <>
                  <h3 className="text-md md:text-lg font-medium mb-2 md:mb-3 text-gray-800">
                    {detailView === 'age' && 'Age Distribution of Zakat Contributors'}
                    {detailView === 'income' && 'Income Brackets of Zakat Contributors'}
                    {detailView === 'occupation' && 'Occupation Categories of Zakat Contributors'}
                    {detailView === 'awareness' && 'Zakat Knowledge & Awareness Level'}
                    {detailView === 'payment' && 'Zakat Payment Preferences'}
                  </h3>
                  <div className="h-[250px] md:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={
                          detailView === 'age' ? demographicData.ageDistribution :
                          detailView === 'income' ? demographicData.incomeBrackets :
                          detailView === 'occupation' ? demographicData.occupationCategories :
                          detailView === 'awareness' ? demographicData.nisabAwareness :
                          demographicData.paymentFrequency
                        }
                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey={
                            detailView === 'age' ? 'age' :
                            detailView === 'income' ? 'bracket' :
                            detailView === 'occupation' ? 'category' :
                            detailView === 'awareness' ? 'status' :
                            'frequency'
                          } 
                          tick={{ fill: '#4b5563', fontSize: isMobileView ? 9 : 11 }}
                          tickFormatter={isMobileView ? (value) => value.length > 8 ? value.substring(0, 8) + '...' : value : undefined}
                        />
                        <YAxis tick={{ fill: '#4b5563', fontSize: isMobileView ? 9 : 11 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: isMobileView ? 10 : 12 }} />
                        <Bar 
                          dataKey="percentage" 
                          name="Percentage (%)" 
                          fill="#4ade80" 
                          radius={[4, 4, 0, 0]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}

              {demographicView === 'recipients' && (
                <>
                  <h3 className="text-md md:text-lg font-medium mb-2 md:mb-3 text-gray-800">
                    {detailView === 'category' && 'Categories of Zakat Recipients'}
                    {detailView === 'education' && 'Education Level of Recipients'}
                    {detailView === 'housing' && 'Housing Situation of Recipients'}
                    {detailView === 'household' && 'Household Size of Recipients'}
                  </h3>
                  <div className="h-[250px] md:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={
                            detailView === 'category' ? beneficiaryData.recipientTypes :
                            detailView === 'education' ? beneficiaryData.educationLevel :
                            detailView === 'housing' ? beneficiaryData.housingSituation :
                            beneficiaryData.householdSize
                          }
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={isMobileView ? 90 : 110}
                          innerRadius={isMobileView ? 40 : 60}
                          fill="#8884d8"
                          dataKey="percentage"
                          nameKey={
                            detailView === 'category' ? 'type' :
                            detailView === 'education' ? 'level' :
                            detailView === 'housing' ? 'situation' :
                            'size'
                          }
                          label={({ name, percent }) => isMobileView ? `${(percent * 100).toFixed(0)}%` : `${name.length > 8 ? name.substring(0, 8) + '...' : name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {(detailView === 'category' ? beneficiaryData.recipientTypes :
                            detailView === 'education' ? beneficiaryData.educationLevel :
                            detailView === 'housing' ? beneficiaryData.housingSituation :
                            beneficiaryData.householdSize).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend wrapperStyle={{ fontSize: isMobileView ? 10 : 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}

              {demographicView === 'comparison' && (
                <>
                  <h3 className="text-md md:text-lg font-medium mb-2 md:mb-3 text-gray-800">Digital vs Traditional Zakat Contributors</h3>
                  <div className="text-xs rounded-lg p-2 mb-2 bg-green-50 border border-green-200">
                    <p className="text-gray-700">This radar chart compares characteristics of digital platform users vs traditional zakat payers</p>
                  </div>
                  <div className="h-[250px] md:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={isMobileView ? 70 : 90} width={500} height={300} data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: isMobileView ? 9 : 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: isMobileView ? 9 : 11 }} />
                        <Radar name="ZakatGo Users" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                        <Radar name="Traditional Zakat" dataKey="B" stroke="#f97316" fill="#f97316" fillOpacity={0.5} />
                        <Legend wrapperStyle={{ fontSize: isMobileView ? 10 : 12 }} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </div>

            {/* Info Section - Enhanced with comprehensive insights for PPZ */}
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
              {demographicView === 'donors' && (
                <div>
                  <h3 className="text-md md:text-lg font-medium mb-2 md:mb-3 text-gray-800">Key Insights for PPZ</h3>
                  
                  {detailView === 'age' && (
                    <>
                      <div className="mb-3 md:mb-4">
                        <h4 className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2">Age Distribution Analysis</h4>
                        <p className="text-xs md:text-sm text-gray-700 mb-2">Our platform is attracting a significant number of younger Muslims (25-44 age group) who represent 55% of zakat contributors.</p>
                        <div className="bg-blue-50 p-2 md:p-3 rounded border border-blue-200">
                          <h5 className="text-xs md:text-sm font-medium text-blue-700 mb-1">Strategic Opportunity for PPZ</h5>
                          <p className="text-xs text-gray-700">PPZ can leverage ZakatGo's digital platform to reach tech-savvy younger Muslims who may not engage with traditional zakat collection channels, while maintaining authoritative oversight of zakat collection.</p>
                        </div>
                      </div>
                      <div className="overflow-x-auto text-xs">
                        <table className="min-w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-2 md:px-3 py-2 text-left">Age Group</th>
                              <th className="px-2 md:px-3 py-2 text-right">Contributors</th>
                              <th className="px-2 md:px-3 py-2 text-right">Percentage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {demographicData.ageDistribution.map((item, i) => (
                              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-2 md:px-3 py-1 md:py-2">{item.age}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.count}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.percentage}%</td>
                              </tr>
                            ))}
                            <tr className="bg-green-50 font-medium">
                              <td className="px-2 md:px-3 py-1 md:py-2">Total</td>
                              <td className="px-2 md:px-3 py-1 md:py-2 text-right">{demographicData.ageDistribution.reduce((sum, item) => sum + item.count, 0)}</td>
                              <td className="px-2 md:px-3 py-1 md:py-2 text-right">100%</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="mt-3 text-xs">
                          <div className="flex items-center gap-1 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">PPZ Benefit:</span>
                          </div>
                          <p className="mt-1 pl-5 text-gray-700">Majority of our users are in their prime earning years (25-54), representing a stable zakat base with high lifetime value potential for PPZ.</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {detailView === 'income' && (
                    <>
                      <div className="mb-3 md:mb-4">
                        <h4 className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2">Income Bracket Analysis</h4>
                        <p className="text-xs md:text-sm text-gray-700 mb-2">The majority of our users (61%) fall within the RM5,000-15,000 monthly income bracket, representing a significant segment of zakat-eligible Muslims.</p>
                        <div className="bg-blue-50 p-2 md:p-3 rounded border border-blue-200">
                          <h5 className="text-xs md:text-sm font-medium text-blue-700 mb-1">Strategic Opportunity for PPZ</h5>
                          <p className="text-xs text-gray-700">These higher income brackets represent potential for increased zakat collection amounts. PPZ can tap into this demographic through ZakatGo's digital platform while providing official calculation guidance and verification.</p>
                        </div>
                      </div>
                      <div className="overflow-x-auto text-xs">
                        <table className="min-w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-2 md:px-3 py-2 text-left">Income (Monthly)</th>
                              <th className="px-2 md:px-3 py-2 text-right">Contributors</th>
                              <th className="px-2 md:px-3 py-2 text-right">Percentage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {demographicData.incomeBrackets.map((item, i) => (
                              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-2 md:px-3 py-1 md:py-2">{item.bracket}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.count}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.percentage}%</td>
                              </tr>
                            ))}
                            <tr className="bg-green-50 font-medium">
                              <td className="px-2 md:px-3 py-1 md:py-2">Total</td>
                              <td className="px-2 md:px-3 py-1 md:py-2 text-right">{demographicData.incomeBrackets.reduce((sum, item) => sum + item.count, 0)}</td>
                              <td className="px-2 md:px-3 py-1 md:py-2 text-right">100%</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="mt-3 text-xs">
                          <div className="flex items-center gap-1 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">PPZ Benefit:</span>
                          </div>
                          <p className="mt-1 pl-5 text-gray-700">By partnering with ZakatGo, PPZ gains access to higher-income segments that contribute significantly larger zakat amounts, enabling better financial planning and more impactful distribution programs.</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {detailView === 'occupation' && (
                    <>
                      <div className="mb-3 md:mb-4">
                        <h4 className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2">Occupation Distribution</h4>
                        <p className="text-xs md:text-sm text-gray-700 mb-2">Private sector employees (32%) and professionals (28%) form the largest segments of zakat contributors on our platform, offering PPZ access to corporate networks.</p>
                        <div className="bg-blue-50 p-2 md:p-3 rounded border border-blue-200">
                          <h5 className="text-xs md:text-sm font-medium text-blue-700 mb-1">Strategic Opportunity for PPZ</h5>
                          <p className="text-xs text-gray-700">PPZ can launch targeted workplace zakat programs through ZakatGo, partnering with corporations to implement automatic monthly zakat deductions with official PPZ receipts and verification.</p>
                        </div>
                      </div>
                      <div className="overflow-x-auto text-xs">
                        <table className="min-w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-2 md:px-3 py-2 text-left">Occupation</th>
                              <th className="px-2 md:px-3 py-2 text-right">Contributors</th>
                              <th className="px-2 md:px-3 py-2 text-right">Percentage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {demographicData.occupationCategories.map((item, i) => (
                              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-2 md:px-3 py-1 md:py-2">{item.category}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.count}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.percentage}%</td>
                              </tr>
                            ))}
                            <tr className="bg-green-50 font-medium">
                              <td className="px-2 md:px-3 py-1 md:py-2">Total</td>
                              <td className="px-2 md:px-3 py-1 md:py-2 text-right">{demographicData.occupationCategories.reduce((sum, item) => sum + item.count, 0)}</td>
                              <td className="px-2 md:px-3 py-1 md:py-2 text-right">100%</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="mt-3 text-xs">
                          <div className="flex items-center gap-1 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">PPZ Benefit:</span>
                          </div>
                          <p className="mt-1 pl-5 text-gray-700">The high concentration of private sector and professional users offers PPZ an opportunity to implement workplace-based zakat collection programs, significantly increasing collection efficiency while reducing administrative costs.</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {detailView === 'awareness' && (
                    <>
                      <div className="mb-3 md:mb-4">
                        <h4 className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2">Zakat Knowledge & Awareness</h4>
                        <p className="text-xs md:text-sm text-gray-700 mb-2">While 53% of users are well-informed about zakat rules, 47% have limited to moderate understanding, presenting an educational opportunity for PPZ as Malaysia's zakat authority.</p>
                        <div className="bg-blue-50 p-2 md:p-3 rounded border border-blue-200">
                          <h5 className="text-xs md:text-sm font-medium text-blue-700 mb-1">Strategic Opportunity for PPZ</h5>
                          <p className="text-xs text-gray-700">PPZ can integrate authoritative educational content into ZakatGo's platform, establishing itself as the definitive voice on zakat matters while increasing confidence in zakat calculation accuracy.</p>
                        </div>
                      </div>
                      <div className="overflow-x-auto text-xs">
                        <table className="min-w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-2 md:px-3 py-2 text-left">Awareness Level</th>
                              <th className="px-2 md:px-3 py-2 text-right">Contributors</th>
                              <th className="px-2 md:px-3 py-2 text-right">Percentage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {demographicData.nisabAwareness.map((item, i) => (
                              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-2 md:px-3 py-1 md:py-2">{item.status}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.value}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.percentage}%</td>
                              </tr>
                            ))}
                            <tr className="bg-green-50 font-medium">
                              <td className="px-2 md:px-3 py-1 md:py-2">Total</td>
                              <td className="px-2 md:px-3 py-1 md:py-2 text-right">{demographicData.nisabAwareness.reduce((sum, item) => sum + item.value, 0)}</td>
                              <td className="px-2 md:px-3 py-1 md:py-2 text-right">100%</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="mt-3 text-xs">
                          <div className="flex items-center gap-1 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">PPZ Benefit:</span>
                          </div>
                          <p className="mt-1 pl-5 text-gray-700">PPZ can establish itself as the authoritative voice on zakat matters through ZakatGo, providing educational content that increases compliance and potentially increases zakat amounts as users gain confidence in their calculations.</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {detailView === 'payment' && (
                    <>
                      <div className="mb-3 md:mb-4">
                        <h4 className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2">Payment Habits & Preferences</h4>
                        <p className="text-xs md:text-sm text-gray-700 mb-2">42% of users prefer digital platforms for zakat payment, with 32% making regular monthly contributions rather than annual payments - a model that enhances collection predictability.</p>
                        <div className="bg-blue-50 p-2 md:p-3 rounded border border-blue-200">
                          <h5 className="text-xs md:text-sm font-medium text-blue-700 mb-1">Strategic Opportunity for PPZ</h5>
                          <p className="text-xs text-gray-700">PPZ can integrate with ZakatGo's recurring payment system to capture monthly zakat payments, improving cash flow predictability and potentially increasing total collection through the "pay as you earn" model.</p>
                        </div>
                      </div>
                      <div className="overflow-x-auto text-xs">
                        <h5 className="text-xs font-medium text-gray-700 mb-2">Payment Method Preferences</h5>
                        <table className="min-w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-2 md:px-3 py-2 text-left">Payment Method</th>
                              <th className="px-2 md:px-3 py-2 text-right">Contributors</th>
                              <th className="px-2 md:px-3 py-2 text-right">Percentage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {demographicData.paymentMethods.map((item, i) => (
                              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-2 md:px-3 py-1 md:py-2">{item.method}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.value}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.percentage}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        <h5 className="text-xs font-medium text-gray-700 mt-4 mb-2">Payment Frequency</h5>
                        <table className="min-w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-2 md:px-3 py-2 text-left">Frequency</th>
                              <th className="px-2 md:px-3 py-2 text-right">Contributors</th>
                              <th className="px-2 md:px-3 py-2 text-right">Percentage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {demographicData.paymentFrequency.map((item, i) => (
                              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-2 md:px-3 py-1 md:py-2">{item.frequency}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.value}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.percentage}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="mt-3 text-xs">
                          <div className="flex items-center gap-1 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">PPZ Benefit:</span>
                          </div>
                          <p className="mt-1 pl-5 text-gray-700">The significant preference for digital payments (42%) and monthly contributions (32%) presents an opportunity for PPZ to modernize collection methods while stabilizing cash flow throughout the year rather than relying on seasonal spikes.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {demographicView === 'recipients' && (
                <div>
                  <h3 className="text-md md:text-lg font-medium mb-2 md:mb-3 text-gray-800">Beneficiary Insights for PPZ</h3>
                  
                  {detailView === 'category' && (
                    <>
                      <div className="mb-3 md:mb-4">
                        <h4 className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2">Recipient Categories</h4>
                        <p className="text-xs md:text-sm text-gray-700 mb-2">Single parents (32%) and elderly individuals (24%) represent the largest groups receiving zakat assistance through our platform, highlighting targeted aid opportunities.</p>
                        <div className="bg-blue-50 p-2 md:p-3 rounded border border-blue-200">
                          <h5 className="text-xs md:text-sm font-medium text-blue-700 mb-1">Strategic Opportunity for PPZ</h5>
                          <p className="text-xs text-gray-700">PPZ can develop specialized, high-impact programs through ZakatGo targeting the specific needs of single-parent households and elderly care, ensuring zakat funds address the most pressing community needs.</p>
                        </div>
                      </div>
                      <div className="overflow-x-auto text-xs">
                        <table className="min-w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-2 md:px-3 py-2 text-left">Recipient Category</th>
                              <th className="px-2 md:px-3 py-2 text-right">Count</th>
                              <th className="px-2 md:px-3 py-2 text-right">Percentage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {beneficiaryData.recipientTypes.map((item, i) => (
                              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-2 md:px-3 py-1 md:py-2">{item.type}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.count}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.percentage}%</td>
                              </tr>
                            ))}
                            <tr className="bg-green-50 font-medium">
                              <td className="px-2 md:px-3 py-1 md:py-2">Total</td>
                              <td className="px-2 md:px-3 py-1 md:py-2 text-right">{beneficiaryData.recipientTypes.reduce((sum, item) => sum + item.count, 0)}</td>
                              <td className="px-2 md:px-3 py-1 md:py-2 text-right">100%</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="mt-3 text-xs">
                          <div className="flex items-center gap-1 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">PPZ Benefit:</span>
                          </div>
                          <p className="mt-1 pl-5 text-gray-700">These demographic insights allow PPZ to develop more targeted aid programs that address specific community needs rather than generic assistance, potentially increasing the impact and efficiency of zakat distribution.</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {detailView === 'education' && (
                    <>
                      <div className="mb-3 md:mb-4">
                        <h4 className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2">Education Level Analysis</h4>
                        <p className="text-xs md:text-sm text-gray-700 mb-2">58% of zakat recipients have secondary education or lower, highlighting education as a potential pathway out of poverty and a strategic area for sustainable zakat impact.</p>
                        <div className="bg-blue-50 p-2 md:p-3 rounded border border-blue-200">
                          <h5 className="text-xs md:text-sm font-medium text-blue-700 mb-1">Strategic Opportunity for PPZ</h5>
                          <p className="text-xs text-gray-700">PPZ can partner with ZakatGo to establish educational scholarship programs targeting recipients with lower education levels, creating a sustainable impact model that addresses the root causes of poverty.</p>
                        </div>
                      </div>
                      <div className="overflow-x-auto text-xs">
                        <table className="min-w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-2 md:px-3 py-2 text-left">Education Level</th>
                              <th className="px-2 md:px-3 py-2 text-right">Recipients</th>
                              <th className="px-2 md:px-3 py-2 text-right">Percentage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {beneficiaryData.educationLevel.map((item, i) => (
                              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-2 md:px-3 py-1 md:py-2">{item.level}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.count}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.percentage}%</td>
                              </tr>
                            ))}
                            <tr className="bg-green-50 font-medium">
                              <td className="px-2 md:px-3 py-1 md:py-2">Total</td>
                              <td className="px-2 md:px-3 py-1 md:py-2 text-right">{beneficiaryData.educationLevel.reduce((sum, item) => sum + item.count, 0)}</td>
                              <td className="px-2 md:px-3 py-1 md:py-2 text-right">100%</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="mt-3 text-xs">
                          <div className="flex items-center gap-1 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">PPZ Benefit:</span>
                          </div>
                          <p className="mt-1 pl-5 text-gray-700">By focusing zakat funds on education initiatives, PPZ can create a transformative impact model where today's zakat recipients become tomorrow's zakat contributors, building a more sustainable zakat ecosystem while fulfilling PPZ's social mission.</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {detailView === 'housing' && (
                    <>
                      <div className="mb-3 md:mb-4">
                        <h4 className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2">Housing Situation Analysis</h4>
                        <p className="text-xs md:text-sm text-gray-700 mb-2">59% of recipients are renting their homes, with only 7% owning paid-off homes, indicating housing stability as a significant concern for zakat recipients and a potential area for meaningful intervention.</p>
                        <div className="bg-blue-50 p-2 md:p-3 rounded border border-blue-200">
                          <h5 className="text-xs md:text-sm font-medium text-blue-700 mb-1">Strategic Opportunity for PPZ</h5>
                          <p className="text-xs text-gray-700">PPZ can develop housing assistance programs through ZakatGo targeting rental subsidies, affordable housing initiatives, or home ownership pathways for zakat-eligible families to address housing insecurity.</p>
                        </div>
                      </div>
                      <div className="overflow-x-auto text-xs">
                        <table className="min-w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-2 md:px-3 py-2 text-left">Housing Status</th>
                              <th className="px-2 md:px-3 py-2 text-right">Recipients</th>
                              <th className="px-2 md:px-3 py-2 text-right">Percentage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {beneficiaryData.housingSituation.map((item, i) => (
                              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-2 md:px-3 py-1 md:py-2">{item.situation}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.count}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.percentage}%</td>
                              </tr>
                            ))}
                            <tr className="bg-green-50 font-medium">
                              <td className="px-2 md:px-3 py-1 md:py-2">Total</td>
                              <td className="px-2 md:px-3 py-1 md:py-2 text-right">{beneficiaryData.housingSituation.reduce((sum, item) => sum + item.count, 0)}</td>
                              <td className="px-2 md:px-3 py-1 md:py-2 text-right">100%</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="mt-3 text-xs">
                          <div className="flex items-center gap-1 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">PPZ Benefit:</span>
                          </div>
                          <p className="mt-1 pl-5 text-gray-700">Addressing housing insecurity through targeted zakat fund allocation can significantly reduce financial stress on vulnerable families, enabling them to focus on education and livelihood opportunities that could help them emerge from asnaf status.</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {detailView === 'household' && (
                    <>
                      <div className="mb-3 md:mb-4">
                        <h4 className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2">Household Size Analysis</h4>
                        <p className="text-xs md:text-sm text-gray-700 mb-2">68% of recipient households have 3-6 family members, with 13% having 7+ members, highlighting larger families as a significant zakat recipient demographic requiring tailored support programs.</p>
                        <div className="bg-blue-50 p-2 md:p-3 rounded border border-blue-200">
                          <h5 className="text-xs md:text-sm font-medium text-blue-700 mb-1">Strategic Opportunity for PPZ</h5>
                          <p className="text-xs text-gray-700">PPZ can develop family-support packages through ZakatGo that scale benefits based on household size, ensuring adequate assistance for larger families while addressing their specific cost-of-living challenges.</p>
                        </div>
                      </div>
                      <div className="overflow-x-auto text-xs">
                        <table className="min-w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-2 md:px-3 py-2 text-left">Household Size</th>
                              <th className="px-2 md:px-3 py-2 text-right">Recipients</th>
                              <th className="px-2 md:px-3 py-2 text-right">Percentage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {beneficiaryData.householdSize.map((item, i) => (
                              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-2 md:px-3 py-1 md:py-2">{item.size}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.count}</td>
                                <td className="px-2 md:px-3 py-1 md:py-2 text-right">{item.percentage}%</td>
                              </tr>
                            ))}
                            <tr className="bg-green-50 font-medium">
                              <td className="px-2 md:px-3 py-1 md:py-2">Total</td>
                              <td className="px-2 md:px-3 py-1 md:py-2 text-right">{beneficiaryData.householdSize.reduce((sum, item) => sum + item.count, 0)}</td>
                              <td className="px-2 md:px-3 py-1 md:py-2 text-right">100%</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="mt-3 text-xs">
                          <div className="flex items-center gap-1 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">PPZ Benefit:</span>
                          </div>
                          <p className="mt-1 pl-5 text-gray-700">Creating household-size-adjusted zakat distribution models allows PPZ to ensure more equitable support, particularly for larger families that face multiplicative costs for education, healthcare, and basic necessities.</p>
                        </div>
                      </div>
                      <div className="mt-4 bg-green-50 p-2 md:p-3 rounded border border-green-200">
                        <h5 className="text-xs md:text-sm font-medium text-green-700 mb-1">Overall Recipient Insight</h5>
                        <p className="text-xs text-gray-700">The demographic data reveals that zakat recipients face intersecting challenges: larger families often have housing insecurity and lower education levels. A comprehensive PPZ-ZakatGo partnership could address these interconnected issues more effectively than siloed approaches.</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {demographicView === 'comparison' && (
                <div>
                  <h3 className="text-md md:text-lg font-medium mb-2 md:mb-3 text-gray-800">Digital vs Traditional Zakat Collection</h3>
                  <div className="mb-3 md:mb-4">
                    <h4 className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2">Collaboration Value Proposition</h4>
                    <p className="text-xs md:text-sm text-gray-700 mb-2">This analysis compares the profile of Muslims using digital zakat platforms like ZakatGo versus those using traditional collection channels.</p>
                    
                    <div className="bg-blue-50 p-2 md:p-3 rounded border border-blue-200 mb-3 md:mb-4">
                      <h5 className="text-xs md:text-sm font-medium text-blue-700 mb-1">Strategic Opportunity for PPZ</h5>
                      <p className="text-xs text-gray-700">By collaborating with ZakatGo, PPZ can access a complementary demographic that may not be fully engaged through traditional channels, particularly younger, tech-savvy, higher-income Muslims - significantly expanding PPZ's overall reach.</p>
                    </div>
                    
                    <div className="overflow-x-auto text-xs">
                      <table className="min-w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-2 md:px-3 py-2 text-left">Characteristic</th>
                            <th className="px-2 md:px-3 py-2 text-center">ZakatGo Users</th>
                            <th className="px-2 md:px-3 py-2 text-center">Traditional Channels</th>
                            <th className="px-2 md:px-3 py-2 text-left">Collaboration Benefit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr className="bg-white">
                            <td className="px-2 md:px-3 py-1 md:py-2 font-medium">Income Level</td>
                            <td className="px-2 md:px-3 py-1 md:py-2 text-center">Higher (85/100)</td>
                            <td className="px-2 md:px-3 py-1 md:py-2 text-center">Moderate (65/100)</td>
                            <td className="px-2 md:px-3 py-1 md:py-2 text-xs">Access to higher-income zakat payers</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="px-2 md:px-3 py-1 md:py-2 font-medium">Zakat Knowledge</td>
                            <td className="px-2 md:px-3 py-1 md:py-2 text-center">Good (78/100)</td>
                            <td className="px-2 md:px-3 py-1 md:py-2 text-center">Basic (45/100)</td>
                            <td className="px-2 md:px-3 py-1 md:py-2 text-xs">Educational opportunities</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="px-2 md:px-3 py-1 md:py-2 font-medium">Tech Adoption</td>
                            <td className="px-2 md:px-3 py-1 md:py-2 text-center">Very High (92/100)</td>
                            <td className="px-2 md:px-3 py-1 md:py-2 text-center">Low (30/100)</td>
                            <td className="px-2 md:px-3 py-1 md:py-2 text-xs">Digital reach expansion</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="px-2 md:px-3 py-1 md:py-2 font-medium">Urban Residence</td>
                            <td className="px-2 md:px-3 py-1 md:py-2 text-center">Urban (80/100)</td>
                            <td className="px-2 md:px-3 py-1 md:py-2 text-center">Mixed (40/100)</td>
                            <td className="px-2 md:px-3 py-1 md:py-2 text-xs">Urban market penetration</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="px-2 md:px-3 py-1 md:py-2 font-medium">Education Level</td>
                            <td className="px-2 md:px-3 py-1 md:py-2 text-center">Higher (75/100)</td>
                            <td className="px-2 md:px-3 py-1 md:py-2 text-center">Mixed (55/100)</td>
                            <td className="px-2 md:px-3 py-1 md:py-2 text-xs">Access to educated professionals</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="px-2 md:px-3 py-1 md:py-2 font-medium">Age (Younger)</td>
                            <td className="px-2 md:px-3 py-1 md:py-2 text-center">Younger (65/100)</td>
                            <td className="px-2 md:px-3 py-1 md:py-2 text-center">Older (45/100)</td>
                            <td className="px-2 md:px-3 py-1 md:py-2 text-xs">Next generation engagement</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="mt-3 text-xs">
                        <div className="flex items-center gap-1 text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">PPZ Benefit:</span>
                        </div>
                        <p className="mt-1 pl-5 text-gray-700">This data demonstrates how ZakatGo and PPZ can create a truly comprehensive zakat ecosystem - PPZ maintains its traditional authority and reach while expanding into digital channels through ZakatGo's platform, potentially increasing total zakat collection.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 md:p-3 bg-green-50 rounded border border-green-200 mt-3 md:mt-4">
                    <h5 className="text-xs md:text-sm font-medium text-green-700 mb-1">Strategic Partnership Potential</h5>
                    <p className="text-xs text-gray-700">A partnership between PPZ and ZakatGo creates a powerful dual-channel approach to zakat collection, combining PPZ's traditional authority with ZakatGo's digital innovation to maximize zakat collection while ensuring full Shariah compliance and transparency.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Call to Action for PPZ - Made responsive */}
          <div className="mt-4 md:mt-5 p-3 md:p-5 bg-green-50 rounded-lg border border-green-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-3 md:mb-0 md:mr-6 text-center md:text-left">
                <h3 className="text-md md:text-lg font-semibold text-green-700 mb-1 md:mb-2">Partner with ZakatGo</h3>
                <p className="text-xs md:text-sm text-gray-700">Our platform offers PPZ access to tech-savvy zakat payers and detailed demographic insights for targeted outreach. Together, we can modernize zakat collection while maintaining compliance and transparency.</p>
              </div>
              <button className="px-4 md:px-6 py-2 md:py-3 bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm font-medium rounded-lg transition-all duration-300 shadow hover:shadow-md flex items-center whitespace-nowrap">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Request Collaboration Proposal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboardPage;