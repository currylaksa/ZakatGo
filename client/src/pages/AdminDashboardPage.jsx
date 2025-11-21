import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#06b6d4', '#3b82f6', '#10b981', '#f97316', '#facc15', '#8b5cf6'];

const AdminDashboardPage = () => {
  // Generate mock donations data for current month
  const { dailyData, totalThisMonth, totalDonations, categoryDistribution } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daily = [];
    let totalMonth = 0;
    const categories = [
      { name: 'Masakin', value: 0 },
      { name: 'Amil', value: 0 },
      { name: 'Muallaf', value: 0 },
      { name: 'Riqab', value: 0 },
      { name: 'Gharimin', value: 0 },
      { name: 'Fi Sabilillah', value: 0 },
    ];

    for (let d = 1; d <= daysInMonth; d++) {
      const value = Math.floor(100 + Math.random() * 900); // RM amount per day
      daily.push({ day: d.toString(), amount: value });
      totalMonth += value;
      // Random distribution
      const pick = Math.floor(Math.random() * categories.length);
      categories[pick].value += value;
    }

    const totalDon = 500000 + Math.floor(Math.random() * 500000); // total across the year

    return {
      dailyData: daily,
      totalThisMonth: totalMonth,
      totalDonations: totalDon,
      categoryDistribution: categories,
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#5f0220]">Admin Dashboard</h1>
            <p className="text-gray-600">Overview of donations and impact</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/profile" className="px-4 py-2 bg-[#5f0220] text-white rounded-lg hover:bg-[#6f162e]">Admin Profile</Link>
            <Link to="/admin/deduction" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Monthly Deduction</Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl shadow border border-gray-200">
            <p className="text-sm text-gray-500">Donations This Month</p>
            <p className="text-2xl font-bold">RM {totalThisMonth.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow border border-gray-200">
            <p className="text-sm text-gray-500">Total Donations (YTD)</p>
            <p className="text-2xl font-bold">RM {totalDonations.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow border border-gray-200">
            <p className="text-sm text-gray-500">Active Categories</p>
            <p className="text-2xl font-bold">{categoryDistribution.length}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar chart: daily donations */}
          <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
            <h2 className="text-lg font-semibold mb-3 text-[#5f0220]">Daily Donations (RM)</h2>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" name="Amount (RM)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie chart: category distribution */}
          <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
            <h2 className="text-lg font-semibold mb-3 text-[#5f0220]">Distribution by Category</h2>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;