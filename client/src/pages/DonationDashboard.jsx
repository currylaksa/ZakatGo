import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { HalfCircleBackground } from '../components'; // Assuming HalfCircleBackground is in components
import { shortenAddress } from '../utils/shortenAddress'; // Import shortenAddress utility
import useFetch from '../hooks/useFetch'; // Import useFetch hook for GIFs (optional)

// Re-use or adapt the TransactionCard component (can be moved to its own file later)
const DonationCard = ({ addressTo, addressFrom, timestamp, message, keyword, amount, url }) => {
  // Optional: Use the hook to fetch a relevant GIF based on keywords
   const gifUrl = useFetch({ keyword: keyword || 'donation' }); // Default keyword 'donation'

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 m-2 flex flex-col w-full sm:w-[300px] md:w-[350px]">
      <div className="flex flex-col items-start w-full">
        <div className="w-full mb-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            To: <a
              href={`https://sepolia.etherscan.io/address/${addressTo}`} // Link to Etherscan for recipient
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline"
            >
              {shortenAddress(addressTo)}
            </a>
          </p>
           <p className="text-gray-800 dark:text-white text-lg font-semibold my-1">{amount} ETH</p>
          {message && (
            <p className="text-gray-700 dark:text-gray-200 text-sm italic my-1">"{message}"</p>
          )}
           <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{timestamp}</p>
        </div>

       {/* Optional GIF display */}
       {gifUrl && (
         <img
           src={gifUrl || url} // Fallback to url if needed
           alt="Donation related GIF"
           className="w-full h-48 rounded-md shadow-lg object-cover mt-2"
         />
       )}

      </div>
    </div>
  );
};


const DonationDashboard = () => {
  const { currentAccount, transactions } = useContext(TransactionContext);

  // Filter transactions to show only those sent FROM the current user
  const userDonations = transactions.filter(
    tx => tx.addressFrom.toLowerCase() === currentAccount.toLowerCase()
  );

  return (
    <HalfCircleBackground title="My Donation History">
      <div className="pt-4 pb-12 px-4 max-w-6xl mx-auto">
        {!currentAccount ? (
          <div className="text-center text-white bg-black bg-opacity-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold">Connect Your Wallet</h3>
            <p className="mt-2">Please connect your wallet to view your donation history.</p>
            {/* Optionally add a connect button here if needed */}
          </div>
        ) : (
          <>
            {userDonations.length === 0 ? (
              <div className="text-center text-white bg-black bg-opacity-50 p-6 rounded-lg">
                 <h3 className="text-xl font-semibold">No Donations Yet</h3>
                 <p className="mt-2">It looks like you haven't made any donations through this wallet yet.</p>
               </div>
            ) : (
              <div className="flex flex-wrap justify-center items-start gap-4">
                 {/* Display latest donations first */}
                 {userDonations.reverse().map((donation, i) => (
                   <DonationCard key={i} {...donation} />
                 ))}
               </div>
            )}
          </>
        )}
      </div>
    </HalfCircleBackground>
  );
};

export default DonationDashboard;