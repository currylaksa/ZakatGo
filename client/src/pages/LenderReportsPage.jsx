import React, { useState } from 'react';
import { HalfCircleBackground } from '../components';
import { Link } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const LenderReportsPage = () => {
  const [isPremium] = useState(true); // In a real app, this would be from context/state
  const [activeTab, setActiveTab] = useState('performance');
  const [dateRange, setDateRange] = useState('all');

  // Mock data - in a real app would come from API
  const performanceData = {
    totalInvested: 120000,
    activeFunds: 75000,
    totalReturns: 14850,
    averageAPY: 7.5,
    loanCount: 18,
    riskDistribution: [
      { risk: 'Low', percentage: 40, color: '#10B981' },
      { risk: 'Medium', percentage: 35, color: '#F59E0B' },
      { risk: 'High', percentage: 25, color: '#EF4444' }
    ],
    monthlyReturns: [
      { month: 'Jan', amount: 980 },
      { month: 'Feb', amount: 1220 },
      { month: 'Mar', amount: 1180 },
      { month: 'Apr', amount: 1350 },
      { month: 'May', amount: 1410 },
      { month: 'Jun', amount: 1290 }
    ],
    recentLoans: [
      { id: '1', title: 'Small Business Loan', amount: 45000, interest: '8.5%', status: 'active' },
      { id: '2', title: 'Education Loan', amount: 12000, interest: '5.2%', status: 'active' },
      { id: '3', title: 'Home Improvement', amount: 28000, interest: '12.0%', status: 'completed' }
    ]
  };

  console.log('Monthly Returns Data:', performanceData.monthlyReturns);
  console.log('Max Return Value:', Math.max(...performanceData.monthlyReturns.map(i => i.amount)));

  // If not premium, show upgrade prompt
  if (!isPremium) {
    return (
      <HalfCircleBackground title="Lender Reports">
        <div className="pt-2 max-w-lg mx-auto w-full">
          <div className="bg-white rounded-xl p-6 shadow-md flex flex-col items-center text-center">
            <div className="bg-yellow-100 rounded-full p-4 mb-4">
              <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Premium Feature</h2>
            <p className="text-gray-600 mb-6">
              Advanced lender reports are only available for Premium users. Upgrade now to unlock detailed insights and analytics.
            </p>
            <Link 
              to="/premium"
              className="bg-secondary hover:bg-secondaryLight text-white py-3 px-6 rounded-full font-medium transition-colors"
            >
              Upgrade to Premium
            </Link>
          </div>
        </div>
      </HalfCircleBackground>
    );
  }

  return (
    <HalfCircleBackground title="Lender Reports">
      <div className="pt-2 max-w-lg mx-auto w-full pb-24">
        <p className="text-white text-opacity-80 mb-6">
          Track your performance and analyze your lending portfolio.
        </p>

        {/* Premium badge */}
        <div className="flex items-center mb-4">
          <div className="bg-yellow-400 text-xs uppercase px-2 py-1 rounded-full text-white font-bold mr-2">
            Premium
          </div>
          <span className="text-white text-opacity-80 text-sm">
            Enhanced reporting and analytics
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-xl overflow-hidden mb-px">
          <div className="flex border-b">
            <button 
              className={`flex-1 py-3 px-4 font-medium text-sm ${activeTab === 'performance' ? 'text-secondary border-b-2 border-secondary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('performance')}
            >
              Performance
            </button>
            <button 
              className={`flex-1 py-3 px-4 font-medium text-sm ${activeTab === 'risk' ? 'text-secondary border-b-2 border-secondary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('risk')}
            >
              Risk Analysis
            </button>
            <button 
              className={`flex-1 py-3 px-4 font-medium text-sm ${activeTab === 'borrowers' ? 'text-secondary border-b-2 border-secondary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('borrowers')}
            >
              Borrowers
            </button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white px-4 py-3 flex justify-between items-center border-b">
          <span className="text-sm text-gray-500">Date Range:</span>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 rounded-full text-xs font-medium ${dateRange === 'all' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setDateRange('all')}
            >
              All Time
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-xs font-medium ${dateRange === 'year' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setDateRange('year')}
            >
              This Year
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-xs font-medium ${dateRange === 'month' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setDateRange('month')}
            >
              This Month
            </button>
          </div>
        </div>

        {/* Performance Tab Content */}
        {activeTab === 'performance' && (
          <div className="bg-white rounded-b-xl p-4 shadow-md">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Total Invested</p>
                <p className="text-2xl font-bold text-gray-800">RM {performanceData.totalInvested.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Active Funds</p>
                <p className="text-2xl font-bold text-gray-800">RM {performanceData.activeFunds.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Total Returns</p>
                <p className="text-2xl font-bold text-green-600">+RM {performanceData.totalReturns.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Average APY</p>
                <p className="text-2xl font-bold text-gray-800">{performanceData.averageAPY}%</p>
              </div>
            </div>

            {/* Monthly Returns Chart */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Monthly Returns</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'column',
                      height: 250,
                      style: {
                        fontFamily: 'inherit'
                      }
                    },
                    title: {
                      text: null
                    },
                    xAxis: {
                      categories: performanceData.monthlyReturns.map(item => item.month),
                      crosshair: true,
                      labels: {
                        style: {
                          color: '#6B7280'
                        }
                      }
                    },
                    yAxis: {
                      title: {
                        text: null
                      },
                      labels: {
                        formatter: function() {
                          return 'RM ' + this.value.toLocaleString();
                        },
                        style: {
                          color: '#6B7280'
                        }
                      },
                      gridLineColor: '#E5E7EB'
                    },
                    tooltip: {
                      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                      pointFormatter: function() {
                        return `<tr>
                          <td style="padding:0">
                            <span style="color:${this.color}">●</span> Monthly Return: 
                          </td>
                          <td style="padding:0">
                            <b>RM ${this.y.toLocaleString()}</b>
                          </td>
                        </tr>`;
                      },
                      footerFormat: '</table>',
                      shared: true,
                      useHTML: true
                    },
                    plotOptions: {
                      column: {
                        pointPadding: 0.2,
                        borderWidth: 0,
                        color: '#0EA5E9', // secondary color
                        states: {
                          hover: {
                            color: '#38BDF8' // secondaryLight color
                          }
                        }
                      }
                    },
                    credits: {
                      enabled: false
                    },
                    series: [{
                      name: 'Monthly Return',
                      data: performanceData.monthlyReturns.map(item => item.amount)
                    }]
                  }}
                />
              </div>
            </div>

            {/* Loan Distribution */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Risk Distribution</h3>
              <div className="flex h-6 rounded-full overflow-hidden mb-3">
                {performanceData.riskDistribution.map((item, index) => (
                  <div
                    key={index}
                    className="h-full"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between text-sm">
                {performanceData.riskDistribution.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-1"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-600">{item.risk} ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Loans Table */}
            <div>
              <h3 className="text-lg font-medium mb-4">Recent Loans</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {performanceData.recentLoans.map((loan) => (
                      <tr key={loan.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{loan.title}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">RM {loan.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">{loan.interest}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            loan.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {loan.status === 'active' ? 'Active' : 'Completed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-center">
                <button className="text-secondary text-sm font-medium">
                  View All Loans →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Risk Analysis Tab Content */}
        {activeTab === 'risk' && (
          <div className="bg-white rounded-b-xl p-4 shadow-md">
            <div className="py-20 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-2">Risk analysis charts and metrics will appear here</p>
                <p className="text-sm text-gray-400">Coming soon</p>
              </div>
            </div>
          </div>
        )}

        {/* Borrowers Tab Content */}
        {activeTab === 'borrowers' && (
          <div className="bg-white rounded-b-xl p-4 shadow-md">
            <div className="py-20 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-2">Borrower analytics will appear here</p>
                <p className="text-sm text-gray-400">Coming soon</p>
              </div>
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="mt-6 bg-white rounded-xl p-4 shadow-md">
          <h3 className="font-medium mb-3">Export Reports</h3>
          <div className="flex space-x-2">
            <button className="flex-1 flex items-center justify-center py-2 border border-gray-300 rounded-lg text-sm text-gray-700">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              PDF
            </button>
            <button className="flex-1 flex items-center justify-center py-2 border border-gray-300 rounded-lg text-sm text-gray-700">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              CSV
            </button>
            <button className="flex-1 flex items-center justify-center py-2 border border-gray-300 rounded-lg text-sm text-gray-700">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Print
            </button>
          </div>
        </div>

      </div>
    </HalfCircleBackground>
  );
};

export default LenderReportsPage; 