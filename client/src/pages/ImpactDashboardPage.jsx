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

// Colors for charts
const CHART_COLORS = ['#06b6d4', '#3b82f6', '#10b981', '#f97316', '#facc15', '#8b5cf6', '#ec4899', '#14b8a6'];
const SADAQAH_COLORS = ['#3b82f6', '#10b981', '#f97316', '#facc15', '#8b5cf6'];

// Data for Donations Over Time
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
  { id: 1, name: "Flood Relief Fund", category: "Emergency Relief", raised: 15800, goal: 25000, endDate: "2025-05-15", beneficiaries: 85 },
  { id: 2, name: "Rural Education Scholarships", category: "Education", raised: 28500, goal: 50000, endDate: "2025-06-30", beneficiaries: 37 },
  { id: 3, name: "Medical Assistance Program", category: "Healthcare", raised: 12700, goal: 20000, endDate: "2025-05-31", beneficiaries: 24 },
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
  const [categoryView, setCategoryView] = useState('zakat');
  const [isBlockchainVerified, setIsBlockchainVerified] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsBlockchainVerified(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = categoryView === 'zakat' ? totalZakat : totalSadaqah;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-medium text-green-700">{payload[0].name}</p>
          <p className="text-gray-800">MYR {payload[0].value.toLocaleString()}</p>
          <p className="text-gray-600 text-sm">{(payload[0].value / total * 100).toFixed(1)}% of total</p>
          {payload[0].payload.description && <p className="text-gray-500 text-xs mt-1">{payload[0].payload.description}</p>}
        </div>
      );
    }
    return null;
  };

  const CustomTimeTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-medium text-green-700">{label}</p>
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} style={{ color: entry.color }} className="text-sm">
              {entry.name || entry.dataKey}: MYR {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-green-700">ZakatGo Impact Dashboard</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
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

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Raised</p>
                <h3 className="text-2xl font-bold text-gray-800">MYR {totalDonations.toLocaleString()}</h3>
                <div className="flex mt-1 text-xs">
                  <span className="text-green-600 mr-2">Zakat: {Math.round(totalZakat/totalDonations*100)}%</span>
                  <span className="text-blue-600">Sadaqah: {Math.round(totalSadaqah/totalDonations*100)}%</span>
                </div>
              </div>
              <div className="bg-green-100 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Donors</p>
                <h3 className="text-2xl font-bold text-gray-800">{totalDonors}</h3>
                <p className="text-xs text-gray-500 mt-1">Across Malaysia</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Beneficiaries Helped</p>
                <h3 className="text-2xl font-bold text-gray-800">{totalBeneficiaries}</h3>
                <p className="text-xs text-gray-500 mt-1">Lives impacted</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Campaigns</p>
                <h3 className="text-2xl font-bold text-gray-800">{totalCampaigns}</h3>
                <p className="text-xs text-gray-500 mt-1">Ongoing initiatives</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></div>
            </div>
          </div>
        </div>

        {/* Grid for Charts and Campaign List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart: Donations by Category */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-green-700">Distribution</h2>
              <div className="flex space-x-2">
                <button onClick={() => setCategoryView('zakat')} className={`px-3 py-1 rounded text-xs font-medium ${categoryView === 'zakat' ? 'bg-green-600 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Zakat</button>
                <button onClick={() => setCategoryView('sadaqah')} className={`px-3 py-1 rounded text-xs font-medium ${categoryView === 'sadaqah' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Sadaqah</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryView === 'zakat' ? zakatCategoryData : sadaqahCategoryData} cx="50%" cy="50%" labelLine={false} outerRadius={80} innerRadius={30} fill="#8884d8" dataKey="value" paddingAngle={2} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} className="text-xs">
                  {(categoryView === 'zakat' ? zakatCategoryData : sadaqahCategoryData).map((entry, index) => <Cell key={`cell-${index}`} fill={categoryView === 'zakat' ? CHART_COLORS[index % CHART_COLORS.length] : SADAQAH_COLORS[index % SADAQAH_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4"><div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-4">{(categoryView === 'zakat' ? zakatCategoryData : sadaqahCategoryData).map((entry, index) => <div key={`legend-${index}`} className="flex items-center"><div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: categoryView === 'zakat' ? CHART_COLORS[index % CHART_COLORS.length] : SADAQAH_COLORS[index % SADAQAH_COLORS.length] }}></div><span className="text-xs text-gray-700">{entry.name}</span></div>)}</div>{categoryView === 'zakat' && <div className="mt-4 bg-green-50 p-3 rounded text-xs text-gray-700 border border-green-200"><p className="mb-1 text-green-700 font-medium">About Zakat Categories</p><p>Zakat must be distributed among 8 categories (asnaf) mentioned in the Quran (9:60).</p></div>}</div>
          </div>

          {/* Time Series Chart: Donations Over Time */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-green-700">Donation Trends</h2>
              <div className="flex space-x-2">
                <button onClick={() => setChartType('bar')} className={`px-3 py-1 rounded text-xs font-medium ${chartType === 'bar' ? 'bg-green-600 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Bar</button>
                <button onClick={() => setChartType('line')} className={`px-3 py-1 rounded text-xs font-medium ${chartType === 'line' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Line</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              {chartType === 'bar' ? (
                <BarChart data={timeSeriesData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: '#4b5563', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#4b5563', fontSize: 12 }} />
                  <Tooltip content={<CustomTimeTooltip />} />
                  <Legend wrapperStyle={{ color: '#4b5563', fontSize: 12 }} />
                  <Bar dataKey="zakat" name="Zakat" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sadaqah" name="Sadaqah" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={timeSeriesData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: '#4b5563', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#4b5563', fontSize: 12 }} />
                  <Tooltip content={<CustomTimeTooltip />} />
                  <Legend wrapperStyle={{ color: '#4b5563', fontSize: 12 }} />
                  <Line type="monotone" dataKey="zakat" name="Zakat" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9', stroke: '#e0f2fe', strokeWidth: 2, r: 4 }} activeDot={{ r: 8, fill: '#0ea5e9', stroke: '#ffffff' }} />
                  <Line type="monotone" dataKey="sadaqah" name="Sadaqah" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', stroke: '#ecfdf5', strokeWidth: 2, r: 4 }} activeDot={{ r: 8, fill: '#10b981', stroke: '#ffffff' }} />
                </LineChart>
              )}
            </ResponsiveContainer>
            <div className="flex justify-end mt-1"><div className="flex items-center px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 border border-gray-200"><svg className="w-3 h-3 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" /></svg>All transactions verified on Ethereum</div></div>
          </div>

          {/* Featured Campaigns Section */}
          <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 text-green-700">Active Campaigns</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {campaignData.map(campaign => (
                <div key={campaign.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex justify-between items-start"><h3 className="text-lg font-medium text-gray-800">{campaign.name}</h3><span className="bg-green-100 text-xs font-medium px-2 py-1 rounded text-green-700">{campaign.category}</span></div>
                  <div className="mt-4"><div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Raised: MYR {campaign.raised.toLocaleString()}</span><span className="text-green-600">{Math.round(campaign.raised/campaign.goal*100)}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, (campaign.raised/campaign.goal*100))}%` }}></div></div><div className="text-xs text-gray-500 mt-1">Goal: MYR {campaign.goal.toLocaleString()}</div></div>
                  <div className="mt-4 flex justify-between text-xs"><div className="text-gray-500"><span>Ends: {new Date(campaign.endDate).toLocaleDateString()}</span></div><div className="text-green-600"><span>{campaign.beneficiaries} beneficiaries</span></div></div>
                  <button className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors duration-200">View Details</button>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Distribution by Location - Only Table */}
          <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 text-center text-green-700">
              Impact Distribution by Location
            </h2>
             {/* Regional Distribution Data Table */}
             <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col">
               <h3 className="text-lg font-medium mb-4 text-green-700">Top Contributing Regions</h3>
               <div className="overflow-x-auto rounded-lg border border-gray-200"> {/* Added overflow and border */}
                 <table className="min-w-full divide-y divide-gray-200">
                   <thead className="bg-gray-100">
                     <tr>
                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (MYR)</th>
                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distribution (Zakat/Sadaqah)</th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {getRegionalTotals().slice(0, 5).map((region, index) => (
                       <tr key={index} className="hover:bg-gray-50">
                         <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{region.state}</td>
                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{region.total.toLocaleString()}</td>
                         <td className="px-4 py-3 whitespace-nowrap">
                           <div className="flex items-center">
                             <div className="w-full bg-gray-200 rounded-full h-2 mr-2 min-w-[100px]"> {/* Ensure minimum width for progress bar */}
                               <div className="flex h-2 rounded-full">
                                 <div className="bg-green-500 h-2 rounded-l-full" style={{ width: `${Math.round(region.zakat/region.total*100)}%` }}></div>
                                 <div className="bg-blue-500 h-2 rounded-r-full" style={{ width: `${Math.round(region.sadaqah/region.total*100)}%` }}></div>
                               </div>
                             </div>
                             <span className="text-xs text-gray-500 w-24 shrink-0"> {/* Prevent shrinking */}
                                Z: {Math.round(region.zakat/region.total*100)}% | S: {Math.round(region.sadaqah/region.total*100)}%
                             </span>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
               <div className="mt-4 text-xs text-center text-gray-500">
                 <p>Data updated daily. Last update: {new Date().toLocaleDateString('en-GB')}</p>
               </div>
             </div>
           </div>


           {/* Donor Recognition Wall - Improved Responsiveness */}
           <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
             <h2 className="text-xl font-semibold mb-6 text-green-700 flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               Donor Recognition Wall
             </h2>
             {/* Responsive Grid: 2 cols on mobile, 3 on small screens, 4 on medium, 6 on large */}
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
               {[...Array(12)].map((_, index) => (
                 <div key={index} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200 hover:border-green-400 transition-all duration-300 hover:bg-green-50 hover:shadow-sm">
                   <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto flex items-center justify-center text-xl font-bold text-white">
                     {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
                   </div>
                   <div className="mt-2 text-gray-800 font-medium text-sm truncate">{index % 2 === 0 ? 'Anonymous' : `Donor ${index + 1}`}</div>
                   <div className="text-green-600 text-xs mt-1">MYR {(Math.floor(Math.random() * 10) * 500 + 500).toLocaleString()}</div>
                   <div className="text-gray-500 text-xs mt-1">{Math.floor(Math.random() * 20) + 1} Donations</div>
                 </div>
               ))}
             </div>
             <div className="mt-6 text-center">
               <button className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-all duration-300 shadow hover:shadow-md">View All Donors</button>
             </div>
           </div>

           {/* Blockchain Transparency Section - Improved Responsiveness */}
           <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
             <h2 className="text-xl font-semibold mb-6 text-green-700 flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
               Blockchain Verification
             </h2>
             {/* Use flex-col on mobile, md:flex-row for larger screens */}
             <div className="flex flex-col md:flex-row gap-6">
               {/* Latest Transactions Table - Added overflow */}
               <div className="md:w-2/3 lg:w-3/4 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-hidden"> {/* Adjusted widths */}
                 <h3 className="text-lg text-gray-800 mb-3">Latest Transactions</h3>
                 <div className="overflow-x-auto rounded-lg border border-gray-200">
                   <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-100">
                       <tr>
                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tx Hash</th>
                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Amount</th> {/* Hide on extra small */}
                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                       </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                       {[...Array(5)].map((_, index) => (
                         <tr key={index} className="hover:bg-gray-50 transition-colors">
                           <td className="px-3 py-2 whitespace-nowrap text-sm font-mono text-blue-600 truncate max-w-[100px] sm:max-w-none">0x{Array(8).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}...</td>
                           <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{index % 2 === 0 ? 'Zakat' : 'Sadaqah'}</td>
                           <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">MYR {(Math.floor(Math.random() * 10) * 100 + 200).toLocaleString()}</td>
                           <td className="px-3 py-2 whitespace-nowrap">
                             <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 border border-green-200">Confirmed</span>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
                 <div className="mt-4 text-center">
                   <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm text-white rounded-lg transition-colors flex items-center mx-auto shadow hover:shadow-md">
                     <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" /></svg>
                     View All on Etherscan
                   </button>
                 </div>
               </div>

               {/* Smart Contract Info - Stacks nicely on mobile */}
               <div className="md:w-1/3 lg:w-1/4 bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col"> {/* Adjusted widths */}
                 <h3 className="text-lg text-gray-800 mb-3">Smart Contract Info</h3>
                 <div className="flex-1 flex flex-col gap-3">
                   <div className="p-3 bg-white rounded-lg border border-gray-200">
                     <p className="text-xs text-gray-500 mb-1">Contract Address</p>
                     <p className="font-mono text-blue-600 text-sm break-all">0x1a2b...f9a0b</p> {/* Shortened for space */}
                   </div>
                   <div className="p-3 bg-white rounded-lg border border-gray-200">
                     <p className="text-xs text-gray-500 mb-1">Total Transactions</p>
                     <p className="text-gray-900 text-xl font-medium">3,487</p>
                   </div>
                   <div className="p-3 bg-white rounded-lg border border-gray-200">
                     <p className="text-xs text-gray-500 mb-1">Last Audited</p>
                     <p className="text-gray-800 text-sm">March 25, 2025 by CertiK</p>
                   </div>
                   <div className="text-center mt-auto">
                     <button className="px-3 py-1 bg-green-100 hover:bg-green-200 text-xs text-green-700 rounded-lg transition-colors border border-green-200">View Smart Contract</button>
                   </div>
                 </div>
               </div>
             </div>
           </div>

         </div> {/* End Grid for Charts and Lists */}
       </div> {/* End Max Width Container */}
     </div> // End Main Container
   );
 };

 export default ImpactDashboardPage;
 