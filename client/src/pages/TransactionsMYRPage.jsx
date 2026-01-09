import { useState } from 'react';
import { Link } from 'react-router-dom';
// --- Mock Transaction Data ---
const mockTransactions = [
  {
    hash: '0xdead...02',
    block: 8272625,
    time: new Date(Date.now() - 1627000).toISOString(),
    from: '0xf17f...98843',
    to: '0x47c2f...3118de',
    amount: '18.90',
    currency: 'RM'
  },
  {
    hash: '0x460D...89',
    block: 8272624,
    time: new Date(Date.now() - 1724000).toISOString(),
    from: '0xf17f...98843',
    to: '0x47c2f...3118de',
    amount: '100.10',
    currency: 'RM'
  },
  {
    hash: '0xf587c...f3',
    block: 8272623,
    time: new Date(Date.now() - 1725000).toISOString(),
    from: '0xf17f...98843',
    to: '0x78c2f...ba669',
    amount: '100.10',
    currency: 'RM'
  },
  {
    hash: '0x0087c...3f',
    block: 8272622,
    time: new Date(Date.now() - 27250000).toISOString(),
    from: '0xf17f...98843',
    to: '0x78c2f...ba669',
    amount: '100.10',
    currency: 'RM'
  },
  {
    hash: '0x1787c...48',
    block: 8272621,
    time: new Date(Date.now() - 77300000).toISOString(),
    from: '0xf17f...98843',
    to: '0x78c2f...ba669',
    amount: '100.10',
    currency: 'RM'
  },
  {
    hash: '0xdd87c...21',
    block: 8272620,
    time: new Date(Date.now() - 172700000).toISOString(),
    from: '0xf17f...98843',
    to: '0x78c2f...ba669',
    amount: '100.10',
    currency: 'RM'
  },
  // Additional dummy data to fill the table
  ...Array.from({ length: 14 }, (_, i) => {
    const baseTime = Date.now() - (180000000 + i * 10000000);
    return {
      hash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 4)}`,
      block: 8272619 - i,
      time: new Date(baseTime).toISOString(),
      from: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 7)}`,
      to: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 7)}`,
      amount: (Math.random() * 200).toFixed(2),
      currency: 'RM'
    };
  })
];

// Helper to calculate time ago in seconds
const timeAgoSeconds = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  return Math.floor((now - past) / 1000);
};

const TransactionsMYRPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = mockTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(mockTransactions.length / itemsPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Transactions Header */}
      <div className="bg-black border-b border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <polygon points="10,0 0,5 0,15 10,20 20,15 20,5" />
            </svg>
            <h1 className="text-2xl font-bold">Transactions</h1>
          </div>
        </div>
      </div>

      {/* Transactions Table Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-300 text-black text-sm">
                <th className="px-6 py-4 text-left font-bold">Txn Hash</th>
                <th className="px-6 py-4 text-left font-bold">Block</th>
                <th className="px-6 py-4 text-left font-bold">Time</th>
                <th className="px-6 py-4 text-left font-bold">From</th>
                <th className="px-6 py-4 text-left font-bold">To</th>
                <th className="px-6 py-4 text-left font-bold">Amount</th>
                <th className="px-6 py-4 text-left font-bold">Age</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((tx, index) => (
                <tr 
                  key={tx.hash + index} 
                  className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                  style={{ backgroundColor: index % 2 === 0 ? '#2d3748' : '#374151' }}
                >
                  <td className="px-6 py-4">
                   <Link
                        to={`/zakat/explorer/${encodeURIComponent(tx.hash)}?status=Sent&amount=${encodeURIComponent(tx.amount)}&currency=RM&timestamp=${encodeURIComponent(new Date().toISOString())}&contractAddress=0x47c2f8bb91d0a6f2443bde0e5c1e79aa64f923118de`}
                        className="text-[#fbe9ed] hover:underline"
                      >
                        {tx.hash}
                      </Link>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">{tx.block}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {new Date(tx.time).toLocaleString('en-GB', { 
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    }).replace(/\//g, '-')}
                  </td>
                  <td className="px-6 py-4">
                    <a href="#" className="text-[#E88BA0] hover:text-[#F4A3B5] transition-colors">
                      {tx.from}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <a href="#" className="text-[#E88BA0] hover:text-[#F4A3B5] transition-colors">
                      {tx.to}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-400 font-medium">
                      Amount: {tx.currency} {tx.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {timeAgoSeconds(tx.time)} secs ago
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            First Page
          </button>
          
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-xl"
          >
            &lt;
          </button>
          
          <div className="px-6 py-2 bg-gray-700 text-white rounded-lg font-medium min-w-[60px] text-center">
            {currentPage}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-xl"
          >
            &gt;
          </button>
          
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            Last Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsMYRPage;
