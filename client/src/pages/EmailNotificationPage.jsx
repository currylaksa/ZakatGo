const EmailNotificationPage = ({ transactionData }) => {
  // Default transaction data if none provided
  const defaultData = {
    hash: '0xdead...02',
    from: '0xf17f...98843',
    to: '0x47c2f...3118de',
    amount: '18.90',
    blockNumber: '8272625',
    timestamp: '12-11-2025 17:01:17',
    status: 'Confirmed'
  };

  const data = transactionData || defaultData;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#8B2845] to-[#5f0220] px-8 py-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="36" 
              height="36" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2"
            >
              <polygon points="12,2 2,7 2,17 12,22 22,17 22,7"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Zakat UTM Blockchain
          </h1>
          <p className="text-[#fbe9ed] text-base">
            Transparent Donation Platform
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-10">
          {/* Notification Badge */}
          <span className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-5">
            New Transaction
          </span>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            You've Received a New Donation! 🎉
          </h2>
          
          {/* Description */}
          <p className="text-gray-600 text-base leading-relaxed mb-8">
            A new transaction has been confirmed on the Zakat UTM blockchain. The donation has been successfully recorded and is now visible in the public ledger.
          </p>

          {/* Transaction Details Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-6 mb-6 border-l-4 border-[#8B2845]">
            <TransactionRow label="Transaction Hash">
              <a href="#" className="text-[#E88BA0] hover:text-[#F4A3B5] transition-colors break-all">
                {data.hash}
              </a>
            </TransactionRow>
            
            <TransactionRow label="From">
              <a href="#" className="text-[#E88BA0] hover:text-[#F4A3B5] transition-colors break-all">
                {data.from}
              </a>
            </TransactionRow>
            
            <TransactionRow label="To">
              <a href="#" className="text-[#E88BA0] hover:text-[#F4A3B5] transition-colors break-all">
                {data.to}
              </a>
            </TransactionRow>
            
            <TransactionRow label="Amount">
              <span className="text-green-400 text-lg font-bold">
                RM {data.amount}
              </span>
            </TransactionRow>
            
            <TransactionRow label="Block Number">
              <span className="text-white">{data.blockNumber}</span>
            </TransactionRow>
            
            <TransactionRow label="Timestamp">
              <span className="text-white">{data.timestamp}</span>
            </TransactionRow>
            
            <TransactionRow label="Status" isLast>
              <span className="text-green-400 font-semibold">
                ✓ {data.status}
              </span>
            </TransactionRow>
          </div>

          {/* Call to Action Button */}
          <div className="text-center mb-6">
            <a 
              href="#" 
              className="inline-block bg-[#8B2845] hover:bg-[#a62b45] text-white font-semibold px-8 py-3.5 rounded-lg transition-colors"
            >
              View Full Transaction Details
            </a>
          </div>

          {/* Info Box */}
          <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded mb-6">
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>🔒 Transparency & Security:</strong> This transaction has been permanently recorded on the blockchain and can be verified by anyone. All donor information remains anonymous through wallet addresses.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 my-8"></div>

          {/* What happens next */}
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            What happens next?
          </h2>
          <div className="text-gray-600 text-base leading-relaxed space-y-2">
            <p>• The donation amount has been added to your wallet</p>
            <p>• You can track this transaction in the public ledger</p>
            <p>• The donor will receive a confirmation receipt</p>
            <p>• Impact reports will be generated monthly</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 text-gray-400 px-8 py-8 text-center text-sm">
          <p className="text-white font-semibold mb-2">
            Zakat UTM Blockchain Platform
          </p>
          <p className="mb-5">
            Empowering transparent charitable giving through blockchain technology
          </p>
          
          <div className="mb-5 space-x-2">
            <a href="#" className="text-gray-400 hover:text-[#E88BA0] transition-colors">
              Website
            </a>
            <span>|</span>
            <a href="#" className="text-gray-400 hover:text-[#E88BA0] transition-colors">
              Support
            </a>
            <span>|</span>
            <a href="#" className="text-gray-400 hover:text-[#E88BA0] transition-colors">
              Privacy Policy
            </a>
          </div>
          
          <p className="text-xs mb-4">
            You're receiving this email because you enabled transaction notifications.<br />
            <a href="#" className="text-[#E88BA0] hover:text-[#F4A3B5] transition-colors">
              Manage your notification preferences
            </a>
          </p>
          
          <p className="text-xs text-gray-500">
            © 2025 Zakat UTM. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

// Transaction Row Component
const TransactionRow = ({ label, children, isLast = false }) => {
  return (
    <div className={`flex justify-between items-start py-3 ${!isLast ? 'border-b border-gray-600 border-opacity-30' : ''}`}>
      <span className="text-gray-400 text-sm font-medium">
        {label}
      </span>
      <span className="text-white text-sm font-semibold text-right max-w-[60%]">
        {children}
      </span>
    </div>
  );
};

// Example usage with different notification types
export const AlertNotification = ({ transactionData }) => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-br from-[#8B2845] to-[#5f0220] px-8 py-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Security Alert</h1>
          <p className="text-[#fbe9ed] text-base">Zakat UTM Blockchain Platform</p>
        </div>
        <div className="px-8 py-10">
          <span className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-5">
            Alert
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Unusual Activity Detected
          </h2>
          <p className="text-gray-600 text-base leading-relaxed mb-8">
            We've detected unusual activity on your account. Please review and verify this transaction.
          </p>
          <div className="text-center">
            <a href="#" className="inline-block bg-[#8B2845] hover:bg-[#a62b45] text-white font-semibold px-8 py-3.5 rounded-lg transition-colors">
              Review Activity
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailNotificationPage;