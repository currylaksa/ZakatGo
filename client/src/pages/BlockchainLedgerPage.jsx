// src/components/BlockchainLedgerPage.jsx
import React, { useState } from 'react';

// --- Mock Transaction Data ---
// In a real blockchain app, this data would be fetched from the blockchain.
// For the prototype, we use static fake data.
const mockTransactions = [
  { id: '0xabc123def456', timestamp: '2025-04-09 18:35:10', from: 'Donor Wallet A', to: 'Flood Relief Campaign', amount: 50.00, status: 'Confirmed', type: 'Donation' },
  { id: '0xdef456ghi789', timestamp: '2025-04-09 15:22:05', from: 'Donor Wallet B', to: 'Zakat Payment (General)', amount: 120.50, status: 'Confirmed', type: 'Zakat' },
  { id: '0xghi789jkl012', timestamp: '2025-04-08 21:05:45', from: 'Donor Wallet C', to: 'Education Fund', amount: 75.00, status: 'Confirmed', type: 'Donation' },
  { id: '0xjkl012mno345', timestamp: '2025-04-08 11:15:30', from: 'Donor Wallet D', to: 'Masjid Renovation', amount: 200.00, status: 'Confirmed', type: 'Donation' },
  { id: '0xmno345pqr678', timestamp: '2025-04-07 09:01:15', from: 'Donor Wallet E', to: 'Food Bank Sadaqah', amount: 30.00, status: 'Confirmed', type: 'Sadaqah' },
  { id: '0xpqr678stu901', timestamp: '2025-04-06 16:45:00', from: 'Donor Wallet F', to: 'Zakat Payment (General)', amount: 85.75, status: 'Confirmed', type: 'Zakat' },
  { id: '0xstu901vwx234', timestamp: '2025-04-05 12:30:20', from: 'Donor Wallet G', to: 'Emergency Medical Aid', amount: 150.00, status: 'Confirmed', type: 'Donation' },
  { id: '0xvwx234yza567', timestamp: '2025-04-04 10:15:45', from: 'Donor Wallet H', to: 'Orphan Sponsorship', amount: 100.00, status: 'Confirmed', type: 'Donation' },
];

// Helper function to truncate addresses/IDs for display
const truncateId = (id) => {
  if (!id) return '';
  return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
};

const BlockchainLedgerPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  
  const itemsPerPage = 5;
  
  // Filter transactions based on search term and type filter
  const filteredTransactions = mockTransactions.filter(tx => {
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'All' || tx.type === filterType;
    
    return matchesSearch && matchesType;
  });
  
  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortConfig.key === 'amount') {
      return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    
    if (sortConfig.key === 'timestamp') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.timestamp) - new Date(b.timestamp) 
        : new Date(b.timestamp) - new Date(a.timestamp);
    }
    
    // Default text comparison for other fields
    return sortConfig.direction === 'asc'
      ? a[sortConfig.key].localeCompare(b[sortConfig.key])
      : b[sortConfig.key].localeCompare(a[sortConfig.key]);
  });
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = sortedTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  
  // Handle sort click
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };
  
  // Generate pagination numbers
  const paginationNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationNumbers.push(i);
  }
  
  // Format date for better readability
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    // Main container with navy background gradient
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white p-4 md:p-8">
      {/* Assume Navbar is rendered globally in App.js */}
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-gradient-to-r from-blue-800 to-blue-700 p-8 rounded-t-lg shadow-lg border-b border-teal-400">
          <h1 className="text-4xl font-bold mb-3 text-center text-white">Public Donation Ledger</h1>
          <p className="text-center text-blue-100 mb-6 max-w-3xl mx-auto">
            Explore the transparent record of all donations on the ZakatGo platform. Every transaction is publicly verifiable while maintaining donor privacy.
          </p>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg shadow border border-blue-700">
              <h3 className="text-sm uppercase text-blue-300 mb-1">Total Transactions</h3>
              <p className="text-2xl font-bold text-white">{mockTransactions.length}</p>
            </div>
            <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg shadow border border-blue-700">
              <h3 className="text-sm uppercase text-blue-300 mb-1">Total Amount</h3>
              <p className="text-2xl font-bold text-white">
                MYR {mockTransactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg shadow border border-blue-700">
              <h3 className="text-sm uppercase text-blue-300 mb-1">Latest Transaction</h3>
              <p className="text-2xl font-bold text-white">{formatDate(mockTransactions[0].timestamp)}</p>
            </div>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                className="bg-blue-950 border border-blue-700 text-blue-100 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Search by ID, sender, or recipient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <select
                className="bg-blue-950 border border-blue-700 text-blue-100 text-sm rounded-lg p-2.5 focus:ring-teal-500 focus:border-teal-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Donation">Donations</option>
                <option value="Zakat">Zakat</option>
                <option value="Sadaqah">Sadaqah</option>
              </select>
              
              <button className="flex items-center gap-1 bg-blue-950 border border-blue-700 text-blue-100 text-sm rounded-lg p-2.5 hover:bg-blue-800 transition">
                <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span className="hidden md:inline">Date Range</span>
              </button>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-gray-900 p-6 rounded-b-lg shadow-xl">
          <div className="overflow-x-auto relative shadow-md rounded-lg mb-6">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-blue-800 text-blue-100">
                <tr>
                  <th scope="col" className="py-3 px-2 md:px-6 cursor-pointer" onClick={() => handleSort('id')}>
                    <div className="flex items-center">
                      Transaction ID
                      {sortConfig.key === 'id' && (
                        <svg className="w-4 h-4 ml-1 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                        </svg>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="py-3 px-2 md:px-6 cursor-pointer" onClick={() => handleSort('timestamp')}>
                    <div className="flex items-center">
                      Date & Time
                      {sortConfig.key === 'timestamp' && (
                        <svg className="w-4 h-4 ml-1 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                        </svg>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="py-3 px-2 md:px-6 cursor-pointer" onClick={() => handleSort('from')}>
                    <div className="flex items-center">
                      From
                      {sortConfig.key === 'from' && (
                        <svg className="w-4 h-4 ml-1 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                        </svg>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="py-3 px-2 md:px-6 cursor-pointer" onClick={() => handleSort('to')}>
                    <div className="flex items-center">
                      To
                      {sortConfig.key === 'to' && (
                        <svg className="w-4 h-4 ml-1 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                        </svg>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="py-3 px-2 md:px-6 cursor-pointer" onClick={() => handleSort('amount')}>
                    <div className="flex items-center">
                      Amount (MYR)
                      {sortConfig.key === 'amount' && (
                        <svg className="w-4 h-4 ml-1 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                        </svg>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="py-3 px-2 md:px-6">Type</th>
                  <th scope="col" className="py-3 px-2 md:px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.length > 0 ? (
                  currentTransactions.map((tx, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-blue-900 bg-gray-800 transition duration-150 ease-in-out">
                      <td className="py-4 px-2 md:px-6 font-mono text-xs">
                        <div className="flex items-center">
                          {truncateId(tx.id)}
                          <a 
                            href="#" 
                            className="text-teal-400 hover:text-teal-300 ml-2"
                            title="View on blockchain explorer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                            </svg>
                          </a>
                        </div>
                      </td>
                      <td className="py-4 px-2 md:px-6">{formatDate(tx.timestamp)}</td>
                      <td className="py-4 px-2 md:px-6">
                        <span className="inline-flex items-center">
                          <span className="w-2 h-2 mr-2 rounded-full bg-blue-500"></span>
                          {tx.from}
                        </span>
                      </td>
                      <td className="py-4 px-2 md:px-6">
                        <span className="inline-flex items-center">
                          <span className="w-2 h-2 mr-2 rounded-full bg-teal-500"></span>
                          {tx.to}
                        </span>
                      </td>
                      <td className="py-4 px-2 md:px-6 font-medium">{tx.amount.toFixed(2)}</td>
                      <td className="py-4 px-2 md:px-6">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded ${
                          tx.type === 'Zakat' 
                            ? 'bg-purple-900 text-purple-200' 
                            : tx.type === 'Sadaqah'
                              ? 'bg-blue-900 text-blue-200'
                              : 'bg-teal-900 text-teal-200'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-4 px-2 md:px-6">
                        <span className="bg-green-800 text-green-100 text-xs font-medium px-2.5 py-1 rounded">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-gray-400 bg-gray-800">
                      No transactions found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-400">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedTransactions.length)} of {sortedTransactions.length} entries
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-800 text-blue-100 hover:bg-blue-700'
                  }`}
                >
                  Previous
                </button>
                
                {paginationNumbers.map(number => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`px-3 py-1 rounded ${
                      currentPage === number
                        ? 'bg-teal-600 text-white'
                        : 'bg-blue-800 text-blue-100 hover:bg-blue-700'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-800 text-blue-100 hover:bg-blue-700'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {/* Info Footer */}
          <div className="mt-8 p-4 bg-blue-950 rounded-lg border border-blue-800">
            <h3 className="text-sm font-medium text-teal-300 mb-2">About the ZakatGo Blockchain Ledger</h3>
            <p className="text-xs text-blue-300 mb-2">
              This ledger uses simulated data to demonstrate the concept of blockchain transparency. In a real system, this would display actual, verified transactions from a blockchain network. Donor identities are anonymized using wallet addresses.
            </p>
            <p className="text-xs text-blue-300">
              Our blockchain technology ensures that every donation is traceable, immutable, and transparent while protecting donor privacy. This allows you to verify that funds reach their intended destinations without compromising personal information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainLedgerPage;
