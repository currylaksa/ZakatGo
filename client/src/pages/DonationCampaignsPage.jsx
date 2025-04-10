import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionContext } from '../context/TransactionContext';
import { HalfCircleBackground } from '../components';
// Import icons
import { FiMapPin, FiFilter, FiList, FiUserCheck, FiShare2, FiEdit, FiSend, FiChevronDown, FiChevronUp, FiPackage, FiDollarSign, FiNavigation, FiGift } from 'react-icons/fi'; // Added FiGift
import { HiOutlineLocationMarker, HiOutlineMap, HiOutlineAdjustments, HiOutlineNewspaper, HiOutlineLink, HiOutlineSparkles, HiOutlineHeart, HiOutlineCash, HiOutlineCalendar, HiOutlineChartBar, HiOutlineEye, HiOutlineUser, HiOutlineBadgeCheck } from 'react-icons/hi';

// --- Mock Data (Unchanged from previous version without Zakat) ---
const mockCampaigns = [
  {
    id: '2',
    title: 'Masjid Taman Universiti Expansion Waqf',
    type: 'waqf',
    organizer: '0xWaqf...MasjidTU',
    startDate: 'Feb 15, 2025',
    targetAmount: '1,500,000',
    raisedAmount: '850,600',
    purpose: 'Funding the construction of a new prayer hall and classroom facilities.',
    region: 'Skudai, Johor',
    status: 'active',
    endDate: 'Dec 31, 2026',
    categories: ['Waqf Project'],
    donationMode: 'money', // Money only for this large project
    inKindNeeds: [],
    inKindLocation: '',
  },
  {
    id: '3',
    title: 'Urgent Food Aid for Flood Victims (Kota Tinggi)',
    type: 'sadaqah',
    organizer: '0xRelief...JohorAid',
    startDate: 'Apr 5, 2025',
    targetAmount: '50,000', // Target for monetary aid
    raisedAmount: '48,100',
    purpose: 'Providing immediate food packs, clean water, and basic necessities.',
    region: 'Kota Tinggi, Johor',
    status: 'urgent',
    endDate: 'Apr 30, 2025',
    categories: ['General Sadaqah', 'Emergency Relief'],
    donationMode: 'both', // Accepts both money and goods
    inKindNeeds: ['Canned food (halal)', 'Rice (5kg/10kg bags)', 'Cooking oil', 'Drinking water (bottles)', 'Blankets', 'Toiletries (soap, toothpaste)'],
    inKindLocation: 'Collection Point: Dewan Serbaguna Kota Tinggi, 9am-5pm daily.',
  },
  {
    id: '5',
    title: 'Skill Development for Single Mothers (Sadaqah Jariyah)',
    type: 'sadaqah',
    organizer: '0xEmpower...WomenJB',
    startDate: 'Feb 1, 2025',
    targetAmount: '40,000', // For training materials, allowances
    raisedAmount: '15,500',
    purpose: 'Providing vocational training (sewing, baking, digital skills).',
    region: 'Johor Bahru, Johor',
    status: 'active',
    endDate: 'Aug 31, 2025',
    categories: ['General Sadaqah', 'Skill Development'],
    donationMode: 'both', // Needs funds and potentially equipment
    inKindNeeds: ['Working laptops (used)', 'Sewing machines (used/new)', 'Baking supplies (flour, sugar - unopened)'],
    inKindLocation: 'Drop-off: Empower Training Center, Larkin Idaman. Mon-Fri 10am-4pm.',
  },
   {
    id: '6',
    title: 'Completed: Ramadan Iftar Meals 2025',
    type: 'sadaqah',
    organizer: '0xCommunity...Kitchen',
    startDate: 'Mar 1, 2025',
    targetAmount: '30,000',
    raisedAmount: '32,150',
    purpose: 'Provided daily Iftar meals.',
    region: 'Johor Bahru, Johor',
    status: 'completed',
    endDate: 'Apr 9, 2025',
    categories: ['General Sadaqah', 'Food Aid'],
    donationMode: 'money',
    inKindNeeds: [],
    inKindLocation: '',
  },
   {
    id: '7',
    title: 'Back-to-School Supplies Drive',
    type: 'sadaqah',
    organizer: '0xYouth...HopeJB',
    startDate: 'Apr 10, 2025',
    targetAmount: '0', // Focus is on in-kind for this example
    raisedAmount: 'N/A',
    purpose: 'Collecting new school supplies for underprivileged students.',
    region: 'Johor Bahru',
    status: 'active',
    endDate: 'May 15, 2025',
    categories: ['General Sadaqah', 'Orphanage Support'],
    donationMode: 'in-kind', // In-kind only
    inKindNeeds: ['School bags', 'Notebooks', 'Pens/Pencils', 'Color pencils', 'Geometry sets', 'Calculators'],
    inKindLocation: 'Drop-off points: ZakatGo Office (Tmn Molek), Selected Bookstores (list on website).',
  },
];

const mockNearbyCauses = [
  { id: 101, type: 'Sadaqah', name: 'JB Central Soup Kitchen', distance: '0.8 km', description: 'Daily meals for the homeless.', goal: 5000, progress: 4100, location: 'Jalan Trus, Bandar Johor Bahru', donationMode: 'both', inKindNeeds: ['Rice', 'Cooking Oil', 'Vegetables', 'Canned Goods (Halal)'], inKindLocation: 'Kitchen backdoor, 11am-1pm daily' },
  { id: 102, type: 'Waqf', name: 'Islamic Library Fund (Masjid Abu Bakar)', distance: '1.5 km', description: 'Acquiring books and resources.', goal: 50000, progress: 15200, location: 'Masjid Sultan Abu Bakar, Jalan Skudai', donationMode: 'money', inKindNeeds: [], inKindLocation: '' },
  { id: 103, type: 'Sadaqah', name: 'Orphanage Needs (Taman Pelangi)', distance: '3.2 km', description: 'Clothing and school fees.', goal: 10000, progress: 6800, location: 'Rumah Anak Yatim Taman Pelangi', donationMode: 'both', inKindNeeds: ['Children\'s Clothes (Ages 6-16, good condition)', 'School Shoes', 'Story Books'], inKindLocation: 'Office hours, Mon-Sat' },
  { id: 105, type: 'Waqf', name: 'Madrasah Tahfiz Land Purchase', distance: '6.1 km', description: 'Endowment fund for land purchase.', goal: 250000, progress: 75000, location: 'Kempas, Johor Bahru', donationMode: 'money', inKindNeeds: [], inKindLocation: '' },
  { id: 106, type: 'Sadaqah', name: 'Animal Shelter Support (SPCA JB)', distance: '7.8 km', description: 'Food and medical care for animals.', goal: 8000, progress: 3100, location: 'SPCA Johor Bahru, Stulang Laut', donationMode: 'both', inKindNeeds: ['Dry/Wet Pet Food (Cat/Dog)', 'Old Towels/Newspapers', 'Cat Litter'], inKindLocation: 'Shelter during opening hours' },
];
// --- End Mock Data ---

const DonationCampaignsPage = () => {
  const { currentAccount, connectWallet } = useContext(TransactionContext);
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  // Removed form state and handlers, moved to CreateCampaignPage
  const [nearbyCauses, setNearbyCauses] = useState(mockNearbyCauses);
  const [viewMode, setViewMode] = useState('list');
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyFilterType, setNearbyFilterType] = useState('all');
  const [nearbyFilterDistance, setNearbyFilterDistance] = useState(5);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setCampaigns(mockCampaigns.filter(c => c.type !== 'zakat'));
      setIsLoading(false);
      setUserLocation({ lat: 1.4927, lng: 103.7414 });
    }, 500);
  }, []);

  // --- Nearby Causes Handlers ---
  const handleNearbyFilterChange = (type) => {
    setNearbyFilterType(type);
  };

  const handleDistanceChange = (e) => {
    setNearbyFilterDistance(parseInt(e.target.value, 10));
  };

   const handleViewCauseDetails = (cause) => {
       let details = `Details for: ${cause.name}\nType: ${cause.type}\nDistance: ${cause.distance}\nDescription: ${cause.description}\nLocation: ${cause.location}\nDonation Mode: ${cause.donationMode}`;
       if (cause.donationMode !== 'money') {
           details += `\n\nNeeded Items:\n- ${cause.inKindNeeds?.join('\n- ') || 'Not specified'}`;
           details += `\n\nDrop-off Info:\n${cause.inKindLocation || 'Contact organizer'}`;
       }
       if (cause.donationMode !== 'in-kind') {
           details += `\n\nMonetary Goal: RM ${cause.goal?.toLocaleString()}, Raised: RM ${cause.progress?.toLocaleString()}`;
       }
     alert(details);
   };

   // Updated handler for Quick Contribute button
   const handleQuickContribute = (cause) => {
    if (!currentAccount) {
      alert("Please connect your wallet first.");
      connectWallet();
      return;
    }

    if (cause.donationMode === 'money') {
      // Only money: Prompt for amount
      const amount = prompt(`Enter amount (RM) to donate to ${cause.name}:`);
      if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
         alert(`Donating RM ${amount} (converted to ETH) to ${cause.name} via blockchain.`);
      } else if (amount !== null) {
         alert("Invalid amount entered.");
      }
    } else if (cause.donationMode === 'in-kind') {
      // Only in-kind: Show info
      alert(`In-Kind Contribution for ${cause.name}:\nNeeded: ${cause.inKindNeeds?.join(', ') || 'Not specified'}\nDrop-off: ${cause.inKindLocation || 'Contact organizer'}`);
    } else {
      // Both: Show options
      const choice = prompt(`Contribute to "${cause.name}":\n1. Donate Money\n2. View In-Kind Info\n\nEnter 1 or 2:`);
      if (choice === '1') {
        const amount = prompt(`Enter amount (RM) to donate:`);
        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
           alert(`Donating RM ${amount} (converted to ETH) to ${cause.name} via blockchain.`);
        } else if (amount !== null) {
           alert("Invalid amount entered.");
        }
      } else if (choice === '2') {
        alert(`In-Kind Contribution for ${cause.name}:\nNeeded: ${cause.inKindNeeds?.join(', ') || 'Not specified'}\nDrop-off: ${cause.inKindLocation || 'Contact organizer'}`);
      } else if (choice !== null) {
        alert("Invalid choice.");
      }
    }
  };
  // --- End Nearby Causes Handlers ---

  // --- Campaign Handlers ---
  // Updated handler for main Contribute button
  const handleContributeClick = (campaign) => {
    if (!currentAccount) {
      alert("Please connect your wallet first");
      connectWallet();
      return;
    }

    if (campaign.donationMode === 'money') {
        const amount = prompt(`Enter amount (RM) to donate to ${campaign.title}:`);
        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
           alert(`Donating RM ${amount} (converted to ETH) to ${campaign.title} via blockchain.`);
        } else if (amount !== null) {
           alert("Invalid amount entered.");
        }
    } else if (campaign.donationMode === 'in-kind') {
        alert(`In-Kind Contribution for ${campaign.title}:\n\nItems Needed:\n- ${campaign.inKindNeeds?.join('\n- ') || 'Not specified'}\n\nDrop-off Location & Info:\n${campaign.inKindLocation || 'Contact organizer for details.'}`);
    } else { // 'both'
        const choice = prompt(`Contribute to "${campaign.title}":\n1. Donate Money\n2. View In-Kind Info\n\nEnter 1 or 2:`);
        if (choice === '1') {
            const amount = prompt(`Enter amount (RM) to donate:`);
            if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
               alert(`Donating RM ${amount} (converted to ETH) to ${campaign.title} via blockchain.`);
            } else if (amount !== null) {
               alert("Invalid amount entered.");
            }
        } else if (choice === '2') {
             alert(`In-Kind Contribution for ${campaign.title}:\n\nItems Needed:\n- ${campaign.inKindNeeds?.join('\n- ') || 'Not specified'}\n\nDrop-off Location & Info:\n${campaign.inKindLocation || 'Contact organizer for details.'}`);
        } else if (choice !== null) {
            alert("Invalid choice.");
        }
    }
  };

  const calculateProgress = (raised, target) => {
    const raisedNum = parseInt(String(raised).replace(/,/g, ''));
    const targetNum = parseInt(String(target).replace(/,/g, ''));
    if (isNaN(raisedNum) || isNaN(targetNum) || targetNum === 0) return 0;
    return Math.min((raisedNum / targetNum) * 100, 100);
  };

  const handleShare = (campaign) => {
     const shareText = `Support the "${campaign.title}" campaign on ZakatGo! ${campaign.donationMode !== 'money' ? 'They need items like: ' + campaign.inKindNeeds.slice(0, 2).join(', ') + '...' : 'Goal: RM ' + campaign.targetAmount}. Learn more: [Link to campaign]`;
     if (navigator.share) {
       navigator.share({
         title: `Support ${campaign.title}`,
         text: shareText,
         url: window.location.href,
       }).catch(console.error);
     } else {
       alert(`Share this campaign:\n${shareText}`);
     }
   };
  // --- End Campaign Handlers ---

  const calculateMockDistance = (km) => parseFloat(km.split(' ')[0]);

  const filteredCampaigns = campaigns.filter(campaign => {
    if (campaign.type === 'zakat') return false;
    if (filter === 'all') return true;
    return campaign.type === filter;
  });

  const filteredNearbyCauses = nearbyCauses.filter(cause => {
    if (cause.type === 'Zakat') return false;
    const typeMatch = nearbyFilterType === 'all' || cause.type === nearbyFilterType;
    const distance = calculateMockDistance(cause.distance);
    const distanceMatch = distance <= nearbyFilterDistance;
    return typeMatch && distanceMatch;
  }).sort((a, b) => calculateMockDistance(a.distance) - calculateMockDistance(b.distance));


  return (
    <HalfCircleBackground title="Donation Campaigns & Causes">
      <div className="pt-2 max-w-4xl mx-auto w-full pb-20">
        <p className="text-white text-opacity-80 mb-6">
          Manage NGO campaigns, discover nearby Sadaqah & Waqf opportunities, donate money or in-kind items.
        </p>

        {!currentAccount && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 text-center">
            <p className="mb-4">Connect your wallet to create campaigns or donate.</p>
            <button
              onClick={connectWallet}
              className="bg-secondary hover:bg-secondaryLight text-white py-2 px-5 rounded-full font-medium"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {/* --- Section: NGO Campaign Management Button --- */}
         {currentAccount && (
           <div className="bg-white rounded-xl shadow-md p-4 mb-6">
             <div className="flex justify-between items-center">
               <h2 className="text-lg font-bold text-gray-800 flex items-center"><FiEdit className="mr-2 text-blue-600" />NGO Hub</h2>
               <button
                 onClick={() => navigate('/create-campaigns')} // Navigate to the new page
                 className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-full transition-transform transform hover:scale-105"
               >
                 + Create New Campaign
               </button>
             </div>
              <p className="text-xs text-gray-500 mt-2">Click here to create and manage your organization's campaigns after verification.</p>
           </div>
         )}
         {/* --- End Section: NGO Campaign Management Button --- */}

        {/* --- Section: Geofencing-Based Sadaqah & Waqf Suggestions --- */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
           <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><HiOutlineLocationMarker className="mr-2" />Nearby Causes (Sadaqah & Waqf)</h2>
           {/* Filters */}
           <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4 border-b pb-4">
              {/* Type Filter */}
              <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap"><span className="text-sm font-medium text-gray-700 mr-2 shrink-0">Type:</span><button onClick={() => handleNearbyFilterChange('all')} className={`px-3 py-1 rounded-full text-xs transition-colors ${nearbyFilterType === 'all' ? 'bg-secondary text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200'}`}>All</button><button onClick={() => handleNearbyFilterChange('Sadaqah')} className={`px-3 py-1 rounded-full text-xs transition-colors ${nearbyFilterType === 'Sadaqah' ? 'bg-purple-500 text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200'}`}>Sadaqah</button><button onClick={() => handleNearbyFilterChange('Waqf')} className={`px-3 py-1 rounded-full text-xs transition-colors ${nearbyFilterType === 'Waqf' ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200'}`}>Waqf</button></div>
              {/* Distance Filter */}
              <div className="flex items-center space-x-2"><label htmlFor="distanceFilter" className="text-sm font-medium text-gray-700 shrink-0">Distance:</label><select id="distanceFilter" value={nearbyFilterDistance} onChange={handleDistanceChange} className="p-1 border border-gray-300 rounded-md text-xs focus:ring-secondary focus:border-secondary"><option value="1">≤ 1 km</option><option value="5">≤ 5 km</option><option value="10">≤ 10 km</option><option value="25">≤ 25 km</option><option value="50">≤ 50 km</option></select></div>
              {/* View Mode Toggle */}
              <div className="sm:ml-auto flex items-center space-x-2"><span className="text-sm font-medium text-gray-700 shrink-0">View:</span><button onClick={() => setViewMode('map')} title="Map View" className={`p-2 rounded-md transition-colors ${viewMode === 'map' ? 'bg-secondary text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200'}`}><HiOutlineMap className="w-4 h-4" /></button><button onClick={() => setViewMode('list')} title="List View" className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-secondary text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200'}`}><FiList className="w-4 h-4" /></button></div>
           </div>
           {/* Map Placeholder */}
           {viewMode === 'map' && ( <div className="mb-4 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex flex-col items-center justify-center text-gray-500 border border-gray-200 shadow-inner"> <HiOutlineMap className="w-16 h-16 text-secondary opacity-50 mb-2" /> <p className="font-medium">Map View Placeholder</p> <p className="text-xs mt-1">(Requires Geolocation API & Map Library)</p> <p className="text-xs mt-2 px-4 text-center">Nearby Sadaqah and Waqf causes shown here.</p> </div> )}
           {/* List View */}
           {viewMode === 'list' && ( <div className="space-y-3 max-h-96 overflow-y-auto pr-2"> {filteredNearbyCauses.length > 0 ? filteredNearbyCauses.map(cause => ( <div key={cause.id} className="border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"> <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start"> <div className="flex-grow mb-2 sm:mb-0 sm:mr-4"> {/* Badges */} <div className="flex items-center mb-1 flex-wrap gap-1"> <span className={`text-xs px-2 py-0.5 rounded-full text-white shadow-sm inline-block ${cause.type === 'Sadaqah' ? 'bg-purple-500' : 'bg-blue-500'}`}>{cause.type}</span> <span className={`text-xs px-2 py-0.5 rounded-full shadow-sm inline-block ${cause.donationMode === 'money' ? 'bg-green-100 text-green-700' : cause.donationMode === 'in-kind' ? 'bg-orange-100 text-orange-700' : 'bg-indigo-100 text-indigo-700'}`}>{cause.donationMode === 'money' ? <FiDollarSign className="inline mr-1 w-3 h-3"/> : cause.donationMode === 'in-kind' ? <FiPackage className="inline mr-1 w-3 h-3"/> : <><FiDollarSign className="inline mr-0.5 w-3 h-3"/><FiPackage className="inline ml-0.5 w-3 h-3"/></>}{cause.donationMode.charAt(0).toUpperCase() + cause.donationMode.slice(1)}</span> </div> <h4 className="font-semibold text-gray-800 text-md leading-tight">{cause.name}</h4> <p className="text-sm text-gray-600 mt-1 line-clamp-2">{cause.description}</p> <p className="text-xs text-gray-500 mt-1 flex items-center"> <FiMapPin className="mr-1 w-3 h-3" /> {cause.distance} - {cause.location} </p> </div> <div className="mt-2 sm:mt-0 flex sm:flex-col items-start sm:items-end space-x-2 sm:space-x-0 sm:space-y-2 flex-shrink-0"> <button onClick={() => handleViewCauseDetails(cause)} className="text-xs text-blue-600 hover:underline whitespace-nowrap">View Details</button> {/* Single Contribute Button */} <button onClick={() => handleQuickContribute(cause)} className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-full flex items-center shadow-sm transition-colors whitespace-nowrap"><FiGift className="mr-1 w-3 h-3" /> Contribute</button> </div> </div> {/* Details based on mode */} {cause.donationMode !== 'in-kind' && cause.goal && cause.progress !== undefined && ( <div className="mt-2 pt-2 border-t border-gray-100"> <div className="flex justify-between text-xs text-gray-500 mb-1"><span>RM {cause.progress?.toLocaleString()}</span><span>Goal: RM {cause.goal?.toLocaleString()}</span></div> <div className="w-full bg-gray-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${cause.type === 'Sadaqah' ? 'bg-purple-500' : 'bg-blue-500'}`} style={{ width: `${calculateProgress(cause.progress, cause.goal)}%` }}></div></div> </div> )} {cause.donationMode !== 'money' && ( <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600"> <span className="font-medium">Needs:</span> {cause.inKindNeeds?.slice(0, 3).join(', ') || 'N/A'}{cause.inKindNeeds?.length > 3 ? '...' : ''} </div> )} </div> )) : ( <p className="text-center text-gray-500 py-6">No nearby causes found.</p> )} </div> )}
        </div>
        {/* --- End Section: Geofencing Suggestions --- */}


        {/* --- Section: Interactive Features --- */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
           <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><HiOutlineSparkles className="mr-2" />Engage & Discover</h2>
           <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100"><h3 className="text-md font-semibold text-purple-800 mb-2 flex items-center"><FiUserCheck className="mr-2"/>Recommended For You</h3><p className="text-sm text-purple-700">Based on your interest in Community Development, you might like the <span className="font-medium">"Masjid Taman Universiti Expansion Waqf"</span>.</p><button className="text-xs text-purple-600 hover:underline mt-1">View Recommendation</button></div>
         </div>
        {/* --- End Section: Interactive Features --- */}


        {/* --- Section: Existing Campaigns List --- */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><HiOutlineNewspaper className="mr-2"/>Active & Approved Campaigns</h2>
           {/* Filter Buttons */}
            <div className="flex space-x-2 mb-4 overflow-x-auto py-2"><button className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'all' ? 'bg-secondary text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200'}`} onClick={() => setFilter('all')}>All (Sadaqah/Waqf)</button><button className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'waqf' ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200'}`} onClick={() => setFilter('waqf')}>Waqf</button><button className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'sadaqah' ? 'bg-purple-500 text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200'}`} onClick={() => setFilter('sadaqah')}>Sadaqah</button></div>

          {isLoading ? (
            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div></div>
          ) : (
            <div className="mt-4 space-y-4">
              {filteredCampaigns.length > 0 ? filteredCampaigns.map((campaign) => (
                // Campaign Card
                <div key={campaign.id} className={`border rounded-lg p-4 shadow-sm transition-shadow duration-200 ${campaign.status === 'completed' ? 'bg-gray-50 opacity-80' : 'bg-white hover:shadow-md'}`}>
                   <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4"> {/* Added gap */}
                     <div className="flex-grow mb-3 md:mb-0 md:mr-4">
                        {/* Badges */}
                        <div className="flex items-center mb-1 flex-wrap gap-1"><span className={`text-xs px-2 py-0.5 rounded-full text-white shadow-sm inline-block ${campaign.type === 'waqf' ? 'bg-blue-500' : 'bg-purple-500'}`}>{campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}</span><span className={`text-xs px-2 py-0.5 rounded-full shadow-sm inline-block ${campaign.donationMode === 'money' ? 'bg-green-100 text-green-700' : campaign.donationMode === 'in-kind' ? 'bg-orange-100 text-orange-700' : 'bg-indigo-100 text-indigo-700'}`}>{campaign.donationMode === 'money' ? <FiDollarSign className="inline mr-1 w-3 h-3"/> : campaign.donationMode === 'in-kind' ? <FiPackage className="inline mr-1 w-3 h-3"/> : <><FiDollarSign className="inline mr-0.5 w-3 h-3"/><FiPackage className="inline ml-0.5 w-3 h-3"/></>}{campaign.donationMode.charAt(0).toUpperCase() + campaign.donationMode.slice(1)}</span>{campaign.status === 'urgent' && (<span className="text-xs px-2 py-0.5 rounded-full bg-red-500 text-white shadow-sm inline-block">Urgent</span>)}{campaign.status === 'completed' && (<span className="text-xs px-2 py-0.5 rounded-full bg-gray-500 text-white shadow-sm inline-block">Completed</span>)}</div>
                        {/* Info */}
                       <h3 className="text-lg font-semibold text-gray-800 leading-tight">{campaign.title}</h3>
                       <p className="text-sm text-gray-600 mt-1 line-clamp-2">{campaign.purpose}</p>
                       <p className="text-xs text-gray-500 mt-1">Ends: {new Date(campaign.endDate).toLocaleDateString('en-GB')}</p>
                       {campaign.categories && campaign.categories.length > 0 && (<div className="mt-1 text-xs text-gray-500">Categories: {campaign.categories.join(', ')}</div>)}
                       {/* In-Kind Needs Snippet */}
                       {campaign.donationMode !== 'money' && ( <div className="mt-2 text-xs text-gray-600 bg-orange-50 border border-orange-100 rounded p-2"> <span className="font-medium text-orange-800">Needs:</span> {campaign.inKindNeeds?.slice(0, 4).join(', ') || 'N/A'}{campaign.inKindNeeds?.length > 4 ? '...' : ''} <button onClick={() => alert(`Items Needed for ${campaign.title}:\n- ${campaign.inKindNeeds.join('\n- ')}\n\nDrop-off:\n${campaign.inKindLocation}`)} className="ml-1 text-orange-600 hover:underline">(more)</button> </div> )}
                     </div>
                     {/* Action Buttons - Adjusted for responsiveness */}
                     <div className="mt-2 md:mt-0 flex flex-wrap items-center justify-start md:flex-col md:items-end gap-2 flex-shrink-0">
                        {campaign.status !== 'completed' && (
                            // Single Contribute button for all modes
                            <button onClick={() => handleContributeClick(campaign)} className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1.5 rounded-full shadow-sm transition-colors whitespace-nowrap flex items-center justify-center w-full md:w-auto"><FiGift className="mr-1 w-4 h-4"/> Contribute</button>
                        )}
                        <button onClick={() => handleShare(campaign)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1.5 rounded-full flex items-center shadow-sm transition-colors whitespace-nowrap justify-center w-full md:w-auto"> <FiShare2 className="mr-1 h-3 w-3" /> Share </button>
                     </div>
                   </div>
                   {/* Progress Bar */}
                   {campaign.donationMode !== 'in-kind' && campaign.targetAmount !== '0' && ( <div className="mt-3"> <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Raised: RM {campaign.raisedAmount}</span><span>Goal: RM {campaign.targetAmount}</span></div> <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden"><div className={`absolute top-0 left-0 h-full rounded-full ${campaign.status === 'completed' ? 'bg-gray-400' : campaign.type === 'waqf' ? 'bg-blue-500' : 'bg-purple-500'}`} style={{ width: `${calculateProgress(campaign.raisedAmount, campaign.targetAmount)}%` }}></div></div> {campaign.status !== 'completed' && (<div className="text-right text-xs text-green-600 mt-1 flex items-center justify-end"><HiOutlineChartBar className="mr-1"/> Real-time Updates</div>)} </div> )}
                </div>
                // --- End Campaign Card ---
              )) : (
                 <p className="text-center text-gray-500 py-6">No {filter !== 'all' ? filter : ''} campaigns found.</p>
              )}
            </div>
          )}
        </div>
        {/* --- End Section: Existing Campaigns List --- */}

      </div>
    </HalfCircleBackground>
  );
};

export default DonationCampaignsPage;

// --- Styles (Should be in index.css or similar) ---
const styles = `
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
.line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.max-h-96::-webkit-scrollbar { width: 6px; }
.max-h-96::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
.max-h-96::-webkit-scrollbar-thumb { background: #bdbdbd; border-radius: 10px; }
.max-h-96::-webkit-scrollbar-thumb:hover { background: #888; }
`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);