import React from 'react'; // Removed useState, useEffect
import { HalfCircleBackground } from '../components'; // Or your preferred layout component
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Placeholder Data (Remains the same) ---
// This data is now used directly by the component
const placeholderAllocationData = [
  { name: 'Orphanage Support', value: 4000 },
  { name: 'Water Well Project', value: 3000 },
  { name: 'Food Aid', value: 2000 },
  { name: 'Medical Supplies', value: 2780 },
  { name: 'Education Fund', value: 1890 },
];

const placeholderImpactData = [
  { name: 'Orphanage', funds_received: 4000, funds_distributed: 3500, beneficiaries: 50 },
  { name: 'Water Well', funds_received: 3000, funds_distributed: 3000, beneficiaries: 250 },
  { name: 'Food Aid', funds_received: 2000, funds_distributed: 1800, beneficiaries: 600 },
  { name: 'Medical', funds_received: 2780, funds_distributed: 2500, beneficiaries: 150 },
  { name: 'Education', funds_received: 1890, funds_distributed: 1500, beneficiaries: 30 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];
// --- End Placeholder Data ---


const TransparencyPage = () => {
  // Directly use placeholder data - no fetching needed
  const allocationData = placeholderAllocationData;
  const impactData = placeholderImpactData;

  return (
    <HalfCircleBackground title="Transparency Hub">
      <div className="pt-4 pb-12 px-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Fund Allocation Chart */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Fund Allocation by Campaign</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} ETH`} /> {/* Adjust currency if needed */}
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Impact Metrics Chart */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Campaign Impact Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={impactData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'ETH', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Beneficiaries', angle: -90, position: 'insideRight' }}/>
              <Tooltip formatter={(value, name) => (name === 'beneficiaries' ? value : `${value} ETH`)} />
              <Legend />
              <Bar yAxisId="left" dataKey="funds_received" fill="#8884d8" name="Funds Received" />
              <Bar yAxisId="left" dataKey="funds_distributed" fill="#82ca9d" name="Funds Distributed" />
              {/* Optional: Add beneficiaries as another bar/line if scale allows */}
              {/* <Bar yAxisId="right" dataKey="beneficiaries" fill="#ffc658" name="Beneficiaries Reached" /> */}
            </BarChart>
          </ResponsiveContainer>
           {/* Display beneficiaries data separately if scale is too different */}
           <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
             <h3 className="font-semibold mb-1">Beneficiaries Reached:</h3>
             <ul className="list-disc list-inside">
               {impactData.map(item => (
                 <li key={item.name}>{item.name}: {item.beneficiaries}</li>
               ))}
             </ul>
           </div>
        </div>

        {/* Placeholder for other metrics/details */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-2">
           <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Detailed Transaction View (Example)</h2>
           <p className="text-gray-600 dark:text-gray-300">
             This section could link to detailed, verifiable transaction records on a block explorer or show a feed of recent fund distributions linked to specific campaigns. (For the demo, this uses static examples).
           </p>
           {/* Example Link */}
           <a href="https://sepolia.etherscan.io/" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline mt-2 inline-block">
             View Contract on Etherscan (Example Link)
           </a>
         </div>

      </div>
    </HalfCircleBackground>
  );
};

export default TransparencyPage;