import { useState } from 'react';

// --- Mock Block Data ---
const mockBlocks = Array.from({ length: 20 }, (_, i) => ({
  number: 8529190 - i,
  hash: `0x${Math.random().toString(16).substring(2, 18)}...`,
  time: new Date(Date.now() - i * 5000).toISOString(),
  txs: 0,
  transfers: 0,
  appCalls: 0,
  assetConfig: 0,
}));

// Helper to calculate time ago
const timeAgo = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const seconds = Math.floor((now - past) / 1000);
  
  if (seconds < 60) return `${seconds} secs ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const BlockchainLedgerPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [blockStartIndex, setBlockStartIndex] = useState(0);
  
  const itemsPerPage = 10;
  const blocksPerView = 9;
  
  // Get visible blocks for carousel
  const visibleBlocks = mockBlocks.slice(blockStartIndex, blockStartIndex + blocksPerView);
  
  // Pagination for blocks table
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBlocks = mockBlocks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(mockBlocks.length / itemsPerPage);
  
  // Navigation handlers
  const handleBlockPrev = () => {
    setBlockStartIndex(prev => Math.max(0, prev - 1));
  };
  
  const handleBlockNext = () => {
    setBlockStartIndex(prev => Math.min(mockBlocks.length - blocksPerView, prev + 1));
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white mt-20">
      {/* Block Overview Section */}
      <div className="bg-black border-b border-gray-800 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 mt-10">
          <div className="flex items-center gap-3 mb-8">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <polygon points="10,0 0,5 0,15 10,20 20,15 20,5" />
            </svg>
            <h1 className="text-2xl font-bold">Block Overview</h1>
          </div>
          
          {/* Block Carousel */}
          <div className="flex items-center gap-6">
            <button
              onClick={handleBlockPrev}
              disabled={blockStartIndex === 0}
              className="p-2 hover:bg-gray-800 rounded disabled:opacity-30 disabled:cursor-not-allowed transition flex-shrink-0"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex-1 flex gap-3 overflow-hidden">
              {visibleBlocks.map((block, index) => (
                <div key={block.number} className="flex-1 min-w-0 relative">
                  <div className="relative">
                    <div className="bg-gray-300 rounded-3xl aspect-square flex items-center justify-center shadow-lg">
                      {/* Block placeholder */}
                    </div>
                    {index < visibleBlocks.length - 1 && (
                      <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="bg-black rounded-full p-1">
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-center mt-3 text-sm font-medium">#{block.number}</div>
                </div>
              ))}
            </div>
            
            <button
              onClick={handleBlockNext}
              disabled={blockStartIndex >= mockBlocks.length - blocksPerView}
              className="p-2 hover:bg-gray-800 rounded disabled:opacity-30 disabled:cursor-not-allowed transition flex-shrink-0"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Block Table Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-300 text-black text-sm">
                <th className="px-6 py-4 text-left font-bold">Block</th>
                <th className="px-6 py-4 text-left font-bold">Hash</th>
                <th className="px-6 py-4 text-left font-bold">Time</th>
                <th className="px-6 py-4 text-left font-bold">Txs</th>
                <th className="px-6 py-4 text-left font-bold">Txs Summary</th>
                <th className="px-6 py-4 text-left font-bold">Age</th>
              </tr>
            </thead>
            <tbody>
              {currentBlocks.map((block, index) => (
                <tr 
                  key={block.number} 
                  className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                  style={{ backgroundColor: index % 2 === 0 ? '#1f2937' : '#374151' }}
                >
                  <td className="px-6 py-4 text-white font-medium">{block.number}</td>
                  <td className="px-6 py-4">
                    <a href="#" className="text-[#8B2845] hover:text-[#a62b45] transition-colors">
                      {block.hash}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {new Date(block.time).toLocaleString('en-GB', { 
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    }).replace(/\//g, '-')}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{block.txs}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    <span>Transfer {block.transfers}</span>
                    <span className="mx-3">App calls {block.appCalls}</span>
                    <span>Asset config {block.assetConfig}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{timeAgo(block.time)}</td>
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

export default BlockchainLedgerPage;