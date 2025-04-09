// src/components/ImpactDashboardPage.jsx
import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// --- Mock Data ---
// Data for Donations by Category Pie Chart
const pieChartData = [
  { name: 'Zakat (General)', value: 4500 },
  { name: 'Education Fund', value: 2500 },
  { name: 'Flood Relief', value: 1800 },
  { name: 'Food Bank', value: 1200 },
  { name: 'Masjid Renovation', value: 800 },
];

// Colors for charts (consistent theme with navy blues, teals, and accent colors)
const CHART_COLORS = ['#06b6d4', '#3b82f6', '#10b981', '#f97316', '#facc15'];

// Data for Donations Over Time (with option to view as bar or line)
const timeSeriesData = [
  { month: 'Jan', donations: 1500, donors: 45 },
  { month: 'Feb', donations: 2800, donors: 67 },
  { month: 'Mar', donations: 2000, donors: 52 },
  { month: 'Apr', donations: 3200, donors: 78 },
  { month: 'May', donations: 2500, donors: 63 },
  { month: 'Jun', donations: 4100, donors: 92 },
];

// Mock Data for Map View (Donations per State in Malaysia)
const mapData = {
  "Johor": 1500,
  "Selangor": 3200,
  "Kuala Lumpur": 2800,
  "Perak": 1200,
  "Penang": 900,
  "Sabah": 500,
  "Sarawak": 600,
  "Kelantan": 450,
  "Pahang": 580,
  "Terengganu": 420,
  "Negeri Sembilan": 650,
  "Melaka": 480,
  "Kedah": 520,
  "Perlis": 230,
};

const totalDonations = Object.values(mapData).reduce((sum, val) => sum + val, 0);
const totalRaised = pieChartData.reduce((sum, item) => sum + item.value, 0);
const totalCampaigns = 8;
const totalDonors = 347;

const ImpactDashboardPage = () => {
  const [chartType, setChartType] = useState('bar');
  const [timeView, setTimeView] = useState('6month');

  // Custom Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 border border-teal-500 rounded shadow-lg">
          <p className="font-medium text-teal-300">{payload[0].name}</p>
          <p className="text-white">MYR {payload[0].value.toLocaleString()}</p>
          <p className="text-gray-400 text-sm">
            {(payload[0].value / totalRaised * 100).toFixed(1)}% of total
          </p>
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
          <h1 className="text-4xl font-bold mb-2 text-white">Impact Dashboard</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-teal-400 to-blue-400 mx-auto rounded-full"></div>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            Visualizing the collective impact of ZakatGo donations across Malaysia.
            Together, we're making a difference.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Total Donations Card */}
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-4 rounded-lg shadow-lg border border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Raised</p>
                <h3 className="text-2xl font-bold text-white">MYR {totalRaised.toLocaleString()}</h3>
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
              </div>
              <div className="bg-blue-700 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Campaigns Card */}
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-4 rounded-lg shadow-lg border border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Active Campaigns</p>
                <h3 className="text-2xl font-bold text-white">{totalCampaigns}</h3>
              </div>
              <div className="bg-blue-700 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* States Impacted Card */}
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-4 rounded-lg shadow-lg border border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Regions Impacted</p>
                <h3 className="text-2xl font-bold text-white">{Object.keys(mapData).length}</h3>
              </div>
              <div className="bg-blue-700 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Grid for Charts and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart: Donations by Category */}
          <div className="lg:col-span-1 bg-gradient-to-br from-gray-900 to-blue-950 p-6 rounded-lg shadow-xl border border-blue-800">
            <h2 className="text-xl font-semibold mb-6 text-center text-teal-300">
              Donations by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={30} // Added inner radius for donut chart
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2} // Slight spacing between segments
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  className="text-xs"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4">
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {pieChartData.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-1" 
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    ></div>
                    <span className="text-xs text-gray-300">{entry.name}</span>
                  </div>
                ))}
              </div>
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
                  <Tooltip
                    cursor={{ fill: 'rgba(45, 55, 72, 0.3)' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #0284c7', borderRadius: '4px' }}
                    labelStyle={{ color: '#f0f9ff' }}
                    formatter={(value) => [`MYR ${value.toLocaleString()}`, "Donations"]}
                  />
                  <Legend wrapperStyle={{ color: '#e5e7eb' }} />
                  <Bar dataKey="donations" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart
                  data={timeSeriesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="month" tick={{ fill: '#e5e7eb' }} />
                  <YAxis tick={{ fill: '#e5e7eb' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #0284c7', borderRadius: '4px' }}
                    labelStyle={{ color: '#f0f9ff' }}
                    formatter={(value) => [`MYR ${value.toLocaleString()}`, "Donations"]}
                  />
                  <Legend wrapperStyle={{ color: '#e5e7eb' }} />
                  <Line 
                    type="monotone" 
                    dataKey="donations" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    dot={{ fill: '#0ea5e9', stroke: '#0c4a6e', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 8, fill: '#0ea5e9', stroke: '#f0f9ff' }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Map View with enhanced visuals */}
          <div className="lg:col-span-3 bg-gradient-to-br from-gray-900 to-blue-950 p-6 rounded-lg shadow-xl border border-blue-800">
            <h2 className="text-xl font-semibold mb-4 text-center text-teal-300">
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
                      d="M120,100 C150,80 200,90 220,110 C240,130 280,150 320,120 C360,90 380,120 390,150 C400,180 380,210 350,220 C320,230 290,210 270,190 C250,170 210,160 190,180 C170,200 140,190 120,170 C100,150 90,120 120,100 Z" 
                      fill="url(#blue-gradient)" 
                      stroke="#0ea5e9" 
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0c4a6e" />
                        <stop offset="100%" stopColor="#0369a1" />
                      </linearGradient>
                    </defs>
                    
                    {/* Add dots for major donation areas */}
                    {Object.entries(mapData).slice(0, 5).map(([state, amount], index) => {
                      // Positioning dots manually for this example
                      const positions = [
                        { x: 150, y: 180 }, // Johor
                        { x: 220, y: 140 }, // Selangor
                        { x: 240, y: 160 }, // KL
                        { x: 180, y: 120 }, // Perak
                        { x: 160, y: 100 }, // Penang
                      ];
                      
                      // Size based on donation amount
                      const size = 5 + (amount / 1000);
                      
                      return (
                        <g key={state}>
                          <circle 
                            cx={positions[index].x} 
                            cy={positions[index].y} 
                            r={size}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                            opacity="0.8"
                          >
                            <animate 
                              attributeName="opacity" 
                              values="0.8;0.4;0.8" 
                              dur="2s" 
                              repeatCount="indefinite" 
                            />
                          </circle>
                          <text 
                            x={positions[index].x} 
                            y={positions[index].y - size - 5}
                            fontSize="10"
                            fill="#fff"
                            textAnchor="middle"
                          >
                            {state}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-400">Interactive map visualization coming soon.</p>
                    <p className="text-xs text-teal-500 mt-1">Hover over regions to see detailed stats</p>
                  </div>
                </div>
              </div>
              
              {/* Regional Data */}
              <div className="bg-gradient-to-b from-blue-900 to-blue-950 rounded-lg p-4 border border-blue-800">
                <h3 className="text-lg font-medium text-teal-400 mb-3">Regional Distribution</h3>
                <p className="text-sm text-gray-300 mb-4">Total Impact: MYR {totalDonations.toLocaleString()}</p>
                
                {/* Bar chart for state distribution */}
                <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-950">
                  {Object.entries(mapData)
                    .sort((a, b) => b[1] - a[1])
                    .map(([state, amount]) => {
                      const percentage = (amount / totalDonations) * 100;
                      return (
                        <div key={state} className="mb-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-300">{state}</span>
                            <span className="text-teal-300">MYR {amount.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-blue-950 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer with additional information */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Data last updated: April 9, 2025 • All figures shown in Malaysian Ringgit (MYR)</p>
          <p className="mt-1">ZakatGo Impact Report • For more details, download our full quarterly report</p>
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboardPage;
