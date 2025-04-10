// src/components/ImpactDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// --- Mock Data ---
// Data for Zakat Distribution by Islamic Categories (8 asnaf)
const zakatCategoryData = [
  { name: 'Fuqara (Poor)', value: 2500, description: 'Those living below poverty line' },
  { name: 'Masakin (Needy)', value: 2000, description: 'Those in financial hardship' },
  { name: 'Amil Zakat (Administrators)', value: 800, description: 'Those managing Zakat collection/distribution' },
  { name: 'Muallaf (New Converts)', value: 1200, description: 'Those who recently embraced Islam' },
  { name: 'Riqab (Freedom from Bondage)', value: 500, description: 'Those in slavery or bondage' },
  { name: 'Gharimin (Debtors)', value: 1500, description: 'Those in overwhelming debt' },
  { name: 'Fi Sabilillah (Cause of Allah)', value: 1800, description: 'Those striving in Allah\'s path' },
  { name: 'Ibnus Sabil (Wayfarers)', value: 700, description: 'Stranded travelers in need' },
];

// Data for Sadaqah Distribution (Voluntary Charity)
const sadaqahCategoryData = [
  { name: 'Education Fund', value: 2500 },
  { name: 'Flood Relief', value: 1800 },
  { name: 'Food Bank', value: 1200 },
  { name: 'Masjid Renovation', value: 800 },
  { name: 'Medical Aid', value: 1100 },
];

// Colors for charts (themed for Islamic finance - greens, blues)
const CHART_COLORS = ['#06b6d4', '#3b82f6', '#10b981', '#f97316', '#facc15', '#8b5cf6', '#ec4899', '#14b8a6'];
const SADAQAH_COLORS = ['#3b82f6', '#10b981', '#f97316', '#facc15', '#8b5cf6'];

// Data for Donations Over Time (with option to view as bar or line)
const timeSeriesData = [
  { month: 'Jan', zakat: 1500, sadaqah: 800, donors: 45 },
  { month: 'Feb', zakat: 2800, sadaqah: 1200, donors: 67 },
  { month: 'Mar', zakat: 2000, sadaqah: 950, donors: 52 },
  { month: 'Apr', zakat: 3200, sadaqah: 1400, donors: 78 },
  { month: 'May', zakat: 2500, sadaqah: 1100, donors: 63 },
  { month: 'Jun', zakat: 4100, sadaqah: 1800, donors: 92 },
];

// Mock Data for Map View (Donations per State in Malaysia)
const mapData = {
  "Johor": { zakat: 1300, sadaqah: 200 },
  "Selangor": { zakat: 2800, sadaqah: 400 },
  "Kuala Lumpur": { zakat: 2500, sadaqah: 300 },
  "Perak": { zakat: 1000, sadaqah: 200 },
  "Penang": { zakat: 750, sadaqah: 150 },
  "Sabah": { zakat: 400, sadaqah: 100 },
  "Sarawak": { zakat: 500, sadaqah: 100 },
  "Kelantan": { zakat: 350, sadaqah: 100 },
  "Pahang": { zakat: 480, sadaqah: 100 },
  "Terengganu": { zakat: 320, sadaqah: 100 },
  "Negeri Sembilan": { zakat: 550, sadaqah: 100 },
  "Melaka": { zakat: 380, sadaqah: 100 },
  "Kedah": { zakat: 420, sadaqah: 100 },
  "Perlis": { zakat: 180, sadaqah: 50 },
};

// Mock Campaign Data
const campaignData = [
  { 
    id: 1, 
    name: "Flood Relief Fund", 
    category: "Emergency Relief", 
    raised: 15800, 
    goal: 25000, 
    endDate: "2025-05-15",
    beneficiaries: 85
  },
  { 
    id: 2, 
    name: "Rural Education Scholarships", 
    category: "Education", 
    raised: 28500, 
    goal: 50000, 
    endDate: "2025-06-30",
    beneficiaries: 37
  },
  { 
    id: 3, 
    name: "Medical Assistance Program", 
    category: "Healthcare", 
    raised: 12700, 
    goal: 20000, 
    endDate: "2025-05-31",
    beneficiaries: 24
  },
];

// Calculate Totals
const totalZakat = zakatCategoryData.reduce((sum, item) => sum + item.value, 0);
const totalSadaqah = sadaqahCategoryData.reduce((sum, item) => sum + item.value, 0);
const totalDonations = totalZakat + totalSadaqah;
const totalCampaigns = campaignData.length;
const totalDonors = 347;
const totalBeneficiaries = campaignData.reduce((sum, campaign) => sum + campaign.beneficiaries, 0);

// Calculate donation distribution by state
const getRegionalTotals = () => {
  return Object.entries(mapData).map(([state, values]) => ({
    state,
    total: values.zakat + values.sadaqah,
    zakat: values.zakat,
    sadaqah: values.sadaqah
  })).sort((a, b) => b.total - a.total);
};

const ImpactDashboardPage = () => {
  const [chartType, setChartType] = useState('bar');
  const [timeView, setTimeView] = useState('6month');
  const [categoryView, setCategoryView] = useState('zakat');
  const [isBlockchainVerified, setIsBlockchainVerified] = useState(true);

  // Simulate blockchain verification check
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBlockchainVerified(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Custom Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = categoryView === 'zakat' ? totalZakat : totalSadaqah;
      return (
        <div className="bg-gray-900 p-3 border border-teal-500 rounded shadow-lg">
          <p className="font-medium text-teal-300">{payload[0].name}</p>
          <p className="text-white">MYR {payload[0].value.toLocaleString()}</p>
          <p className="text-gray-400 text-sm">
            {(payload[0].value / total * 100).toFixed(1)}% of total
          </p>
          {payload[0].payload.description && (
            <p className="text-gray-400 text-xs mt-1">{payload[0].payload.description}</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Bar/Line Charts
  const CustomTimeTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 border border-teal-500 rounded shadow-lg">
          <p className="font-medium text-teal-300">{label}</p>
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} style={{ color: entry.color }} className="text-sm">
              {entry.name}: MYR {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    // Main container with gradient navy background
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with animated gradient underline */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">ZakatGo Impact Dashboard</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-teal-400 to-blue-400 mx-auto rounded-full"></div>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            Visualizing the collective impact of ZakatGo donations across Malaysia.
            All transactions are verified on blockchain for complete transparency.
          </p>
          
          {/* Blockchain verification badge */}
          <div className="flex justify-center mt-3">
            <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              isBlockchainVerified 
                ? 'bg-green-900 text-green-300 border border-green-700' 
                : 'bg-yellow-900 text-yellow-300 border border-yellow-700'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isBlockchainVerified 
                    ? "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                    : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  } 
                />
              </svg>
              {isBlockchainVerified ? 'Blockchain Verified' : 'Verifying Blockchain Data...'}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Total Donations Card */}
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-4 rounded-lg shadow-lg border border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Raised</p>
                <h3 className="text-2xl font-bold text-white">MYR {totalDonations.toLocaleString()}</h3>
                <div className="flex mt-1 text-xs">
                  <span className="text-teal-400 mr-2">Zakat: {Math.round(totalZakat/totalDonations*100)}%</span>
                  <span className="text-blue-400">Sadaqah: {Math.round(totalSadaqah/totalDonations*100)}%</span>
                </div>
              </div>
              <div className="bg-blue-700 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Donors Card */}
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-4 rounded-lg shadow-lg border border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Donors</p>
                <h3 className="text-2xl font-bold text-white">{totalDonors}</h3>
                <p className="text-xs text-gray-400 mt-1">Across Malaysia</p>
              </div>
              <div className="bg-blue-700 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Beneficiaries Card */}
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-4 rounded-lg shadow-lg border border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Beneficiaries Helped</p>
                <h3 className="text-2xl font-bold text-white">{totalBeneficiaries}</h3>
                <p className="text-xs text-gray-400 mt-1">Lives impacted</p>
              </div>
              <div className="bg-blue-700 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Campaigns Card */}
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-4 rounded-lg shadow-lg border border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Active Campaigns</p>
                <h3 className="text-2xl font-bold text-white">{totalCampaigns}</h3>
                <p className="text-xs text-gray-400 mt-1">Ongoing initiatives</p>
              </div>
              <div className="bg-blue-700 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Grid for Charts and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart: Donations by Category */}
          <div className="lg:col-span-1 bg-gradient-to-br from-gray-900 to-blue-950 p-6 rounded-lg shadow-xl border border-blue-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-teal-300">
                Distribution by Category
              </h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setCategoryView('zakat')}
                  className={`px-3 py-1 rounded text-xs font-medium ${categoryView === 'zakat' ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Zakat
                </button>
                <button 
                  onClick={() => setCategoryView('sadaqah')}
                  className={`px-3 py-1 rounded text-xs font-medium ${categoryView === 'sadaqah' ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Sadaqah
                </button>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryView === 'zakat' ? zakatCategoryData : sadaqahCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={30} // Added inner radius for donut chart
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2} // Slight spacing between segments
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  className="text-xs"
                >
                  {(categoryView === 'zakat' ? zakatCategoryData : sadaqahCategoryData).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={categoryView === 'zakat' ? 
                        CHART_COLORS[index % CHART_COLORS.length] : 
                        SADAQAH_COLORS[index % SADAQAH_COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-4">
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {(categoryView === 'zakat' ? zakatCategoryData : sadaqahCategoryData).map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center mb-1">
                    <div 
                      className="w-3 h-3 rounded-full mr-1" 
                      style={{ 
                        backgroundColor: categoryView === 'zakat' ? 
                          CHART_COLORS[index % CHART_COLORS.length] : 
                          SADAQAH_COLORS[index % SADAQAH_COLORS.length] 
                      }}
                    ></div>
                    <span className="text-xs text-gray-300">{entry.name}</span>
                  </div>
                ))}
              </div>
              
              {/* Islamic info tooltip for Zakat categories */}
              {categoryView === 'zakat' && (
                <div className="mt-4 bg-blue-900 bg-opacity-50 p-3 rounded text-xs text-gray-300 border border-blue-800">
                  <p className="mb-1 text-teal-400 font-medium">About Zakat Categories</p>
                  <p>Zakat must be distributed among 8 categories (asnaf) mentioned in the Quran (9:60). This ensures equitable distribution according to Shariah principles.</p>
                </div>
              )}
            </div>
          </div>

          {/* Time Series Chart: Donations Over Time */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-blue-950 p-6 rounded-lg shadow-xl border border-blue-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-teal-300">Donation Trends</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1 rounded text-xs font-medium ${chartType === 'bar' ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Bar
                </button>
                <button 
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1 rounded text-xs font-medium ${chartType === 'line' ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Line
                </button>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={280}>
              {chartType === 'bar' ? (
                <BarChart
                  data={timeSeriesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="month" tick={{ fill: '#e5e7eb' }} />
                  <YAxis tick={{ fill: '#e5e7eb' }} />
                  <Tooltip content={<CustomTimeTooltip />} />
                  <Legend wrapperStyle={{ color: '#e5e7eb' }} />
                  <Bar dataKey="zakat" name="Zakat" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sadaqah" name="Sadaqah" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart
                  data={timeSeriesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="month" tick={{ fill: '#e5e7eb' }} />
                  <YAxis tick={{ fill: '#e5e7eb' }} />
                  <Tooltip content={<CustomTimeTooltip />} />
                  <Legend wrapperStyle={{ color: '#e5e7eb' }} />
                  <Line 
                    type="monotone" 
                    dataKey="zakat" 
                    name="Zakat"
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    dot={{ fill: '#0ea5e9', stroke: '#0c4a6e', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 8, fill: '#0ea5e9', stroke: '#f0f9ff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sadaqah" 
                    name="Sadaqah"
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', stroke: '#064e3b', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 8, fill: '#10b981', stroke: '#f0f9ff' }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
            
            {/* ETH verification badge */}
            <div className="flex justify-end mt-1">
              <div className="flex items-center px-2 py-1 bg-gray-800 rounded text-xs text-gray-400 border border-gray-700">
                <svg className="w-3 h-3 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                </svg>
                All transactions verified on Ethereum blockchain
              </div>
            </div>
          </div>

          {/* Featured Campaigns Section */}
          <div className="lg:col-span-3 bg-gradient-to-br from-gray-900 to-blue-950 p-6 rounded-lg shadow-xl border border-blue-800">
            <h2 className="text-xl font-semibold mb-6 text-teal-300">
              Active Campaigns
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {campaignData.map(campaign => (
                <div key={campaign.id} className="bg-blue-900 bg-opacity-40 rounded-lg p-4 border border-blue-800">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-white">{campaign.name}</h3>
                    <span className="bg-blue-800 text-xs font-medium px-2 py-1 rounded text-teal-300">
                      {campaign.category}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Raised: MYR {campaign.raised.toLocaleString()}</span>
                      <span className="text-teal-400">{Math.round(campaign.raised/campaign.goal*100)}%</span>
                    </div>
                    <div className="w-full bg-blue-950 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (campaign.raised/campaign.goal*100))}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Goal: MYR {campaign.goal.toLocaleString()}</div>
                  </div>
                  
                  <div className="mt-4 flex justify-between text-xs">
                    <div className="text-gray-400">
                      <span>Ends: {new Date(campaign.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="text-teal-300">
                      <span>{campaign.beneficiaries} beneficiaries</span>
                    </div>
                  </div>
                  
                  <button className="mt-4 w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded transition-colors duration-200">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Map View with enhanced visuals */}
          <div className="lg:col-span-3 bg-gradient-to-br from-gray-900 to-blue-950 p-6 rounded-lg shadow-xl border border-blue-800">
            <h2 className="text-xl font-semibold mb-6 text-center text-teal-300">
              Impact Distribution by Location
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Map Visualization Placeholder with more interesting design */}
              <div className="bg-gradient-to-b from-blue-900 to-blue-950 rounded-lg p-4 border border-blue-800 flex flex-col justify-center items-center">
                <div className="relative w-full">
                  {/* Malaysia map outline SVG placeholder */}
                  <svg 
                    viewBox="0 0 500 300" 
                    className="w-full h-auto max-h-64"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.3))' }}
                  >
                    <path 
                      d="M120,100 C150,80 200,90 220,110 C240,130 280,150 320,120 C360,90 380,120 390,150 C400,180 380,210 350,200 C360,90 380,120 390,150 C400,180 380,210 350,220 C320,230 280,210 250,190 C220,170 170,180 150,160 C130,140 90,120 120,100"
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="2"
                      opacity="0.8"
                    />
                    {/* Data point markers */}
                    {getRegionalTotals().slice(0, 5).map((region, index) => (
                      <circle
                        key={index}
                        cx={100 + index * 70}
                        cy={150 - (index % 3) * 40}
                        r={Math.max(5, (region.total / 1000))}
                        fill="#10b981"
                        opacity="0.8"
                        stroke="#f0fdfa"
                        strokeWidth="1"
                      >
                        <title>{region.state}: MYR {region.total.toLocaleString()}</title>
                      </circle>
                    ))}
                    <text x="250" y="280" fill="#94a3b8" fontSize="12" textAnchor="middle">Interactive Malaysia Map</text>
                  </svg>
                  <div className="text-center mt-2 text-sm text-gray-400">Donation distribution across Malaysia</div>
                </div>
              </div>
              
              {/* Regional Distribution Data */}
              <div className="bg-gradient-to-b from-blue-900 to-blue-950 rounded-lg p-4 border border-blue-800 flex flex-col">
                <h3 className="text-lg font-medium mb-4 text-teal-300">Top Contributing Regions</h3>
                
                {/* Top regions by donation table */}
                <div className="overflow-hidden rounded-lg border border-blue-800">
                  <table className="min-w-full divide-y divide-blue-800">
                    <thead className="bg-blue-900">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">State</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total (MYR)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Distribution</th>
                      </tr>
                    </thead>
                    <tbody className="bg-blue-950 bg-opacity-50 divide-y divide-blue-800">
                      {getRegionalTotals().slice(0, 5).map((region, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{region.state}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{region.total.toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-full bg-blue-950 rounded-full h-2 mr-2">
                                <div className="flex h-2 rounded-full">
                                  <div 
                                    className="bg-teal-500 h-2 rounded-l-full" 
                                    style={{ width: `${Math.round(region.zakat/region.total*100)}%` }}
                                  ></div>
                                  <div 
                                    className="bg-blue-500 h-2 rounded-r-full" 
                                    style={{ width: `${Math.round(region.sadaqah/region.total*100)}%` }}
                                  ></div>
                                </div>
                              </div>
                              <span className="text-xs text-gray-400 w-20">
                                Z: {Math.round(region.zakat/region.total*100)}% | 
                                S: {Math.round(region.sadaqah/region.total*100)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 text-xs text-center text-gray-400">
                  <p>Data updated daily. Last update: 10 April 2025</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Donor Recognition Wall - New Section */}
          <div className="lg:col-span-3 bg-gradient-to-br from-gray-900 to-blue-950 p-6 rounded-lg shadow-xl border border-blue-800 mt-6">
            <h2 className="text-xl font-semibold mb-6 text-teal-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Donor Recognition Wall
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {/* Generate random donor entries */}
              {[...Array(12)].map((_, index) => (
                <div 
                  key={index} 
                  className="bg-blue-900 bg-opacity-30 rounded-lg p-3 text-center border border-blue-800 hover:border-teal-500 transition-all duration-300 hover:bg-blue-800"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full mx-auto flex items-center justify-center text-xl font-bold">
                    {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
                  </div>
                  <div className="mt-2 text-white font-medium text-sm">
                    {index % 2 === 0 ? 'Anonymous' : `Donor${index + 1}`}
                  </div>
                  <div className="text-teal-300 text-xs mt-1">
                    MYR {(Math.floor(Math.random() * 10) * 500 + 500).toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {Math.floor(Math.random() * 20) + 1} Donations
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 text-white text-sm font-medium hover:from-teal-700 hover:to-blue-700 transition-all duration-300">
                View All Donors
              </button>
            </div>
          </div>
          
          {/* Blockchain Transparency Section */}
          <div className="lg:col-span-3 bg-gradient-to-br from-gray-900 to-blue-950 p-6 rounded-lg shadow-xl border border-blue-800 mt-6">
            <h2 className="text-xl font-semibold mb-6 text-teal-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Blockchain Verification
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-800">
                <h3 className="text-lg text-white mb-3">Latest Transactions</h3>
                
                <div className="overflow-hidden rounded-lg border border-blue-800">
                  <table className="min-w-full divide-y divide-blue-800">
                    <thead className="bg-blue-900">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tx Hash</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-blue-950 bg-opacity-50 divide-y divide-blue-800">
                      {[...Array(5)].map((_, index) => (
                        <tr key={index} className="hover:bg-blue-800 hover:bg-opacity-50 transition-colors">
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-mono text-blue-400">0x{Array(8).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}...</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">{index % 2 === 0 ? 'Zakat' : 'Sadaqah'}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">MYR {(Math.floor(Math.random() * 10) * 100 + 200).toLocaleString()}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-400 border border-green-700">Confirmed</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 text-center">
                  <button className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-sm text-white rounded-lg transition-colors flex items-center mx-auto">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                    </svg>
                    View All Transactions on Etherscan
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-800 flex flex-col">
                <h3 className="text-lg text-white mb-3">Smart Contract Info</h3>
                
                <div className="flex-1 flex flex-col gap-3">
                  <div className="p-3 bg-blue-950 rounded-lg border border-blue-800">
                    <p className="text-xs text-gray-400 mb-1">Contract Address</p>
                    <p className="font-mono text-blue-400 text-sm break-all">0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b</p>
                  </div>
                  
                  <div className="p-3 bg-blue-950 rounded-lg border border-blue-800">
                    <p className="text-xs text-gray-400 mb-1">Total Transactions</p>
                    <p className="text-white text-xl font-medium">3,487</p>
                  </div>
                  
                  <div className="p-3 bg-blue-950 rounded-lg border border-blue-800">
                    <p className="text-xs text-gray-400 mb-1">Last Audited</p>
                    <p className="text-white text-sm">March 25, 2025 by CertiK</p>
                  </div>
                  
                  <div className="text-center mt-auto">
                    <button className="px-3 py-1 bg-teal-800 hover:bg-teal-700 text-xs text-teal-300 rounded-lg transition-colors">
                      View Smart Contract
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer section */}
        <div className="pt-12 pb-6 text-center text-gray-400 text-sm">
          <p>© 2025 ZakatGo. All transactions are verified on Ethereum blockchain for transparency.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-teal-400 hover:text-teal-300 transition-colors">About</a>
            <a href="#" className="text-teal-400 hover:text-teal-300 transition-colors">Privacy Policy</a>
            <a href="#" className="text-teal-400 hover:text-teal-300 transition-colors">Terms of Service</a>
            <a href="#" className="text-teal-400 hover:text-teal-300 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboardPage
