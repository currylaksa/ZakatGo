// pages/DonationCampaignsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionContext } from '../context/TransactionContext';
import { HalfCircleBackground } from '../components';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import icons
import { FiMapPin, FiFilter, FiList, FiUserCheck, FiShare2, FiEdit, FiSend, FiChevronDown, FiChevronUp, FiPackage, FiDollarSign, FiNavigation, FiGift } from 'react-icons/fi';
import { HiOutlineLocationMarker, HiOutlineMap, HiOutlineAdjustments, HiOutlineNewspaper, HiOutlineLink, HiOutlineSparkles, HiOutlineHeart, HiOutlineCash, HiOutlineCalendar, HiOutlineChartBar, HiOutlineEye, HiOutlineUser, HiOutlineBadgeCheck, HiArrowLeft } from 'react-icons/hi';

// --- Leaflet Icon Setup ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom Icons
const createIcon = (bgColor, iconContent) => {
  return L.divIcon({
    className: `custom-marker`,
    html: `<div style="background-color: ${bgColor}; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${iconContent}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};
const sadaqahIcon = createIcon('rgba(147, 51, 234, 0.9)', 'S'); // Purple
const waqfIcon = createIcon('rgba(59, 130, 246, 0.9)', 'W');    // Blue
const simpleUserIcon = createIcon('rgba(22, 163, 74, 0.9)', 'U'); // Green for user

// --- Mock Data ---
const mockCampaigns = [ // For the main list
  { id: '2', title: 'Masjid Taman Universiti Expansion Waqf', type: 'waqf', organizer: '0xWaqf...MasjidTU', startDate: 'Feb 15, 2025', targetAmount: '1,500,000', raisedAmount: '850,600', purpose: 'Funding the construction of a new prayer hall and classroom facilities.', region: 'Skudai, Johor', status: 'active', endDate: 'Dec 31, 2026', categories: ['Waqf Project'], donationMode: 'money', inKindNeeds: [], inKindLocation: '', },
  { id: '3', title: 'Urgent Food Aid for Flood Victims (Kota Tinggi)', type: 'sadaqah', organizer: '0xRelief...JohorAid', startDate: 'Apr 5, 2025', targetAmount: '50,000', raisedAmount: '48,100', purpose: 'Providing immediate food packs, clean water, and basic necessities.', region: 'Kota Tinggi, Johor', status: 'urgent', endDate: 'Apr 30, 2025', categories: ['General Sadaqah', 'Emergency Relief'], donationMode: 'both', inKindNeeds: ['Canned food (halal)', 'Rice (5kg/10kg bags)', 'Cooking oil', 'Drinking water (bottles)', 'Blankets', 'Toiletries (soap, toothpaste)'], inKindLocation: 'Collection Point: Dewan Serbaguna Kota Tinggi, 9am-5pm daily.', },
  { id: '5', title: 'Skill Development for Single Mothers (Sadaqah Jariyah)', type: 'sadaqah', organizer: '0xEmpower...WomenJB', startDate: 'Feb 1, 2025', targetAmount: '40,000', raisedAmount: '15,500', purpose: 'Providing vocational training (sewing, baking, digital skills).', region: 'Johor Bahru, Johor', status: 'active', endDate: 'Aug 31, 2025', categories: ['General Sadaqah', 'Skill Development'], donationMode: 'both', inKindNeeds: ['Working laptops (used)', 'Sewing machines (used/new)', 'Baking supplies (flour, sugar - unopened)'], inKindLocation: 'Drop-off: Empower Training Center, Larkin Idaman. Mon-Fri 10am-4pm.', },
   { id: '6', title: 'Completed: Ramadan Iftar Meals 2025', type: 'sadaqah', organizer: '0xCommunity...Kitchen', startDate: 'Mar 1, 2025', targetAmount: '30,000', raisedAmount: '32,150', purpose: 'Provided daily Iftar meals.', region: 'Johor Bahru, Johor', status: 'completed', endDate: 'Apr 9, 2025', categories: ['General Sadaqah', 'Food Aid'], donationMode: 'money', inKindNeeds: [], inKindLocation: '', },
   { id: '7', title: 'Back-to-School Supplies Drive', type: 'sadaqah', organizer: '0xYouth...HopeJB', startDate: 'Apr 10, 2025', targetAmount: '0', raisedAmount: 'N/A', purpose: 'Collecting new school supplies for underprivileged students.', region: 'Johor Bahru', status: 'active', endDate: 'May 15, 2025', categories: ['General Sadaqah', 'Orphanage Support'], donationMode: 'in-kind', inKindNeeds: ['School bags', 'Notebooks', 'Pens/Pencils', 'Color pencils', 'Geometry sets', 'Calculators'], inKindLocation: 'Drop-off points: ZakatGo Office (Tmn Molek), Selected Bookstores (list on website).', },
];

const mockNearbyCauses = [ // For the map/nearby list
  { id: 101, type: 'Sadaqah', name: 'JB Central Soup Kitchen', distance: null, coordinates: [1.4627, 103.7614], description: 'Daily meals for the homeless.', goal: 5000, progress: 4100, location: 'Jalan Trus, Bandar Johor Bahru', donationMode: 'both', inKindNeeds: ['Rice', 'Cooking Oil', 'Vegetables', 'Canned Goods (Halal)'], inKindLocation: 'Kitchen backdoor, 11am-1pm daily' },
  { id: 102, type: 'Waqf', name: 'Islamic Library Fund (Masjid Abu Bakar)', distance: null, coordinates: [1.4590, 103.7496], description: 'Acquiring books and resources.', goal: 50000, progress: 15200, location: 'Masjid Sultan Abu Bakar, Jalan Skudai', donationMode: 'money', inKindNeeds: [], inKindLocation: '' },
  { id: 103, type: 'Sadaqah', name: 'Orphanage Needs (Taman Pelangi)', distance: null, coordinates: [1.4801, 103.7719], description: 'Clothing and school fees.', goal: 10000, progress: 6800, location: 'Rumah Anak Yatim Taman Pelangi', donationMode: 'both', inKindNeeds: ['Children\'s Clothes (Ages 6-16, good condition)', 'School Shoes', 'Story Books'], inKindLocation: 'Office hours, Mon-Sat' },
  { id: 105, type: 'Waqf', name: 'Madrasah Tahfiz Land Purchase', distance: null, coordinates: [1.5490, 103.7380], description: 'Endowment fund for land purchase.', goal: 250000, progress: 75000, location: 'Kempas, Johor Bahru', donationMode: 'money', inKindNeeds: [], inKindLocation: '' },
  { id: 106, type: 'Sadaqah', name: 'Animal Shelter Support (SPCA JB)', distance: null, coordinates: [1.4699, 103.7786], description: 'Food and medical care for animals.', goal: 8000, progress: 3100, location: 'SPCA Johor Bahru, Stulang Laut', donationMode: 'both', inKindNeeds: ['Dry/Wet Pet Food (Cat/Dog)', 'Old Towels/Newspapers', 'Cat Litter'], inKindLocation: 'Shelter during opening hours' },
];
// --- End Mock Data ---

// --- Helper Functions ---
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Return raw distance in km
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

const calculateProgress = (raised, target) => {
    if (!raised || !target) return 0;
    const raisedNum = parseInt(String(raised).replace(/,/g, ''));
    const targetNum = parseInt(String(target).replace(/,/g, ''));
    if (isNaN(raisedNum) || isNaN(targetNum) || targetNum === 0) return 0;
    return Math.min(Math.max((raisedNum / targetNum) * 100, 0), 100);
};
// --- End Helper Functions ---

const DonationCampaignsPage = () => {
  const { currentAccount, connectWallet } = useContext(TransactionContext);
  const navigate = useNavigate();

  // State for NGO campaigns list
  const [campaigns, setCampaigns] = useState([]);
  const [filter, setFilter] = useState('all'); // Filter for NGO campaigns list

  // State for Nearby Causes (Map/List)
  const [nearbyCauses, setNearbyCauses] = useState(mockNearbyCauses);
  const [viewMode, setViewMode] = useState('list');
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [nearbyFilterType, setNearbyFilterType] = useState('all');
  const [nearbyFilterDistance, setNearbyFilterDistance] = useState(10);

  // Combined Loading State
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [modalContent, setModalContent] = useState(null); // { type: string, cause: object } | null
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch User Location & Initial Data
  useEffect(() => {
    setIsLoading(true);
    setLocationError(null);
    let locationFetched = false;
    let campaignsFetched = false;

    const updateLoadingState = () => {
        if (locationFetched && campaignsFetched) {
            setIsLoading(false);
        }
    };

    // Fetch user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          locationFetched = true;
          updateLoadingState();
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError(`Location Error: ${error.message}. Using default.`);
          setUserLocation({ lat: 1.4927, lng: 103.7414 }); // Skudai default
          locationFetched = true;
          updateLoadingState();
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setLocationError("Geolocation not supported. Using default location.");
      setUserLocation({ lat: 1.4927, lng: 103.7414 });
      locationFetched = true;
      updateLoadingState();
    }

    // Fetch/set NGO campaigns data
    setTimeout(() => {
      setCampaigns(mockCampaigns.filter(c => c.type !== 'zakat'));
      campaignsFetched = true;
      updateLoadingState();
    }, 500);

  }, []); // Run once

  // Calculate distances when user location is available
  useEffect(() => {
    if (userLocation) {
      setNearbyCauses(prevCauses =>
        prevCauses.map(cause => {
          if (cause.coordinates && userLocation) {
            const distance = calculateDistance(
              userLocation.lat, userLocation.lng,
              cause.coordinates[0], cause.coordinates[1]
            );
            return { ...cause, distance: distance };
          }
          return { ...cause, distance: null };
        })
      );
    }
  }, [userLocation]);

  // --- Modal Handlers ---
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const simulateDonationFromModal = (cause, amount) => {
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
        console.log(`Simulating: Donating RM ${amount} (as ETH) to ${cause.name || cause.title} via blockchain.`);
        // Use a confirmation message that doesn't block - maybe another modal state or a toast
        setModalContent({ type: 'confirmation', message: `Simulated donation of RM ${amount} to ${cause.name || cause.title}!` });
        setIsModalOpen(true);
        // TODO: Add actual blockchain transaction call here
        // Close after a delay
        // setTimeout(closeModal, 2500);
      } else {
         // Handle invalid amount within the modal - add error message state to modalContent?
         setModalContent(prev => ({...prev, error: "Invalid amount entered."}));
      }
  };
  // --- End Modal Handlers ---

  // --- Nearby Causes Handlers ---
  const handleNearbyFilterChange = (type) => setNearbyFilterType(type);
  const handleDistanceChange = (e) => setNearbyFilterDistance(parseInt(e.target.value, 10));

  const handleViewCauseDetails = (cause) => {
      // Open modal to show details instead of alert
      setModalContent({ type: 'showInKindInfo', cause: cause }); // Re-use 'showInKindInfo' or create 'showDetails'
      setIsModalOpen(true);
  };

  const handleQuickContribute = (cause) => {
    if (!currentAccount) {
      setModalContent({ type: 'connectWallet', cause: null });
      setIsModalOpen(true);
      return;
    }

    if (cause.donationMode === 'money') {
        setModalContent({ type: 'getAmount', cause: cause });
    } else if (cause.donationMode === 'in-kind') {
        setModalContent({ type: 'showInKindInfo', cause: cause });
    } else { // 'both'
        setModalContent({ type: 'showChoice', cause: cause });
    }
    setIsModalOpen(true);
  };
  // --- End Nearby Causes Handlers ---

  // --- NGO Campaign Handlers ---
  const handleContributeClick = (campaign) => {
    if (!currentAccount) {
      setModalContent({ type: 'connectWallet', cause: null });
      setIsModalOpen(true);
      return;
    }
     if (campaign.donationMode === 'money') {
        setModalContent({ type: 'getAmount', cause: campaign });
    } else if (campaign.donationMode === 'in-kind') {
        setModalContent({ type: 'showInKindInfo', cause: campaign });
    } else { // 'both'
        setModalContent({ type: 'showChoice', cause: campaign });
    }
    setIsModalOpen(true);
  };

  const handleShare = (campaign) => {
     const shareText = `Support the "${campaign.title}" campaign on ZakatGo! ${campaign.donationMode !== 'money' ? 'They need items like: ' + campaign.inKindNeeds.slice(0, 2).join(', ') + '...' : 'Goal: RM ' + campaign.targetAmount}. Learn more: [Link to campaign]`;
     if (navigator.share) {
       navigator.share({ title: `Support ${campaign.title}`, text: shareText, url: window.location.href }).catch(console.error);
     } else {
       // Fallback: maybe copy link to clipboard or show text in modal
       setModalContent({type: 'shareInfo', text: shareText});
       setIsModalOpen(true);
     }
   };
  // --- End NGO Campaign Handlers ---

  // --- Filtering Logic ---
  const filteredCampaigns = campaigns.filter(campaign => {
    if (campaign.type === 'zakat') return false;
    if (filter === 'all') return true;
    return campaign.type === filter;
  });

  const filteredNearbyCauses = nearbyCauses.filter(cause => {
    if (cause.type === 'Zakat') return false;
    const typeMatch = nearbyFilterType === 'all' || cause.type === nearbyFilterType;
    const distanceMatch = cause.distance === null || cause.distance <= nearbyFilterDistance;
    return typeMatch && distanceMatch;
  }).sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
  // --- End Filtering Logic ---

  // Map center coordinates
  const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] : [1.4927, 103.7414];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Donation Campaigns</h1>
          <p className="text-xl text-gray-600">Manage NGO campaigns, discover nearby Sadaqah & Waqf opportunities, donate money or in-kind items.</p>
        </div>

        {/* Connect Wallet Prompt */}
        {!currentAccount && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 text-center">
            <p className="mb-4">Connect your wallet to create campaigns or donate.</p>
            <button onClick={() => setModalContent({ type: 'connectWallet', cause: null })} className="bg-secondary hover:bg-secondaryLight text-white py-2 px-5 rounded-full font-medium">
              Connect Wallet
            </button>
          </div>
        )}

        {/* NGO Hub Button */}
        {currentAccount && (
           <div className="bg-white rounded-xl shadow-md p-4 mb-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
               <div className="mb-2 sm:mb-0">
                 <h2 className="text-lg font-bold text-gray-800 flex items-center"><FiEdit className="mr-2 text-blue-600" />NGO Hub</h2>
                 <p className="text-xs text-gray-500 mt-1">Create and manage your organization's campaigns.</p>
               </div>
               <button onClick={() => navigate('/create-campaigns')} className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-full transition-transform transform hover:scale-105 flex-shrink-0">
                 + Create Campaign
               </button>
             </div>
           </div>
         )}

        {/* Nearby Causes Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
           <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><HiOutlineLocationMarker className="mr-2" />Nearby Causes (Sadaqah & Waqf)</h2>
           {isLoading && <p className="text-sm text-gray-500 mb-4 animate-pulse">Loading location and causes...</p>}
           {locationError && <p className="text-sm text-red-600 bg-red-50 p-2 rounded mb-4">{locationError}</p>}

           {/* Filters */}
           <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4 border-b pb-4">
              <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap"><span className="text-sm font-medium text-gray-700 mr-2 shrink-0">Type:</span><button onClick={() => handleNearbyFilterChange('all')} className={`px-3 py-1 rounded-full text-xs transition-colors ${nearbyFilterType === 'all' ? 'bg-secondary text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200'}`}>All</button><button onClick={() => handleNearbyFilterChange('Sadaqah')} className={`px-3 py-1 rounded-full text-xs transition-colors ${nearbyFilterType === 'Sadaqah' ? 'bg-purple-500 text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200'}`}>Sadaqah</button><button onClick={() => handleNearbyFilterChange('Waqf')} className={`px-3 py-1 rounded-full text-xs transition-colors ${nearbyFilterType === 'Waqf' ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200'}`}>Waqf</button></div>
              <div className="flex items-center space-x-2"><label htmlFor="distanceFilter" className="text-sm font-medium text-gray-700 shrink-0">Distance:</label>
                 <select id="distanceFilter" value={nearbyFilterDistance} onChange={handleDistanceChange} className="p-1 border border-gray-300 rounded-md text-xs focus:ring-secondary focus:border-secondary">
                     <option value="1">≤ 1 km</option><option value="5">≤ 5 km</option><option value="10">≤ 10 km</option><option value="25">≤ 25 km</option><option value="50">≤ 50 km</option><option value="100">≤ 100 km</option><option value="200">≤ 200 km</option>
                 </select>
              </div>
              <div className="sm:ml-auto flex items-center space-x-2"><span className="text-sm font-medium text-gray-700 shrink-0">View:</span><button onClick={() => setViewMode('map')} title="Map View" className={`p-2 rounded-md transition-colors ${viewMode === 'map' ? 'bg-secondary text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200'}`}><HiOutlineMap className="w-4 h-4" /></button><button onClick={() => setViewMode('list')} title="List View" className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-secondary text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200'}`}><FiList className="w-4 h-4" /></button></div>
           </div>

           {/* Map or List View */}
           {viewMode === 'map' ? (
              <div className="mb-4 h-72 sm:h-96 rounded-lg border border-gray-200 shadow overflow-hidden">
                 <MapContainer key={mapCenter.join('-')} center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
                   <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors'/>
                   {userLocation && !isLoading && (<Marker position={mapCenter} icon={simpleUserIcon}><Popup>Your Location</Popup></Marker>)}
                   {!isLoading && filteredNearbyCauses.map(cause => {
                     if (!cause.coordinates || !Array.isArray(cause.coordinates) || cause.coordinates.length < 2) return null;
                     return (<Marker key={cause.id} position={cause.coordinates} icon={cause.type === 'Sadaqah' ? sadaqahIcon : waqfIcon}>
                          <Popup><div className="text-sm max-w-xs"><h3 className="font-bold text-base mb-1">{cause.name}</h3><p className="text-gray-700 mb-1 line-clamp-2">{cause.description}</p><p className="text-xs text-gray-500 mb-2">Distance: {cause.distance?.toFixed(1) ?? 'N/A'} km</p><button onClick={() => handleQuickContribute(cause)} className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-full shadow-sm w-full text-center"><FiGift className="inline mr-1 w-3 h-3" /> Contribute</button></div></Popup>
                       </Marker>);
                   })}
                 </MapContainer>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {isLoading ? (<p className="text-center text-gray-500 py-6">Loading nearby causes...</p>) :
                 filteredNearbyCauses.length > 0 ? (
                  filteredNearbyCauses.map(cause => (
                     <div key={cause.id} className="border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"> <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start"> <div className="flex-grow mb-2 sm:mb-0 sm:mr-4"> <div className="flex items-center mb-1 flex-wrap gap-1"> <span className={`text-xs px-2 py-0.5 rounded-full text-white shadow-sm inline-block ${cause.type === 'Sadaqah' ? 'bg-purple-500' : 'bg-blue-500'}`}>{cause.type}</span> <span className={`text-xs px-2 py-0.5 rounded-full shadow-sm inline-block ${cause.donationMode === 'money' ? 'bg-green-100 text-green-700' : cause.donationMode === 'in-kind' ? 'bg-orange-100 text-orange-700' : 'bg-indigo-100 text-indigo-700'}`}>{cause.donationMode === 'money' ? <FiDollarSign className="inline mr-1 w-3 h-3"/> : cause.donationMode === 'in-kind' ? <FiPackage className="inline mr-1 w-3 h-3"/> : <><FiDollarSign className="inline mr-0.5 w-3 h-3"/><FiPackage className="inline ml-0.5 w-3 h-3"/></>}{cause.donationMode.charAt(0).toUpperCase() + cause.donationMode.slice(1)}</span> </div> <h4 className="font-semibold text-gray-800 text-md leading-tight">{cause.name}</h4> <p className="text-sm text-gray-600 mt-1 line-clamp-2">{cause.description}</p> <p className="text-xs text-gray-500 mt-1 flex items-center"> <FiMapPin className="mr-1 w-3 h-3" /> {cause.distance?.toFixed(1) ?? 'N/A'} km - {cause.location} </p> </div> <div className="mt-2 sm:mt-0 flex sm:flex-col items-start sm:items-end space-x-2 sm:space-x-0 sm:space-y-2 flex-shrink-0"> <button onClick={() => handleViewCauseDetails(cause)} className="text-xs text-blue-600 hover:underline whitespace-nowrap">View Details</button> <button onClick={() => handleQuickContribute(cause)} className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-full flex items-center shadow-sm transition-colors whitespace-nowrap"><FiGift className="mr-1 w-3 h-3" /> Contribute</button> </div> </div> {cause.donationMode !== 'in-kind' && cause.goal > 0 && cause.progress !== undefined && ( <div className="mt-2 pt-2 border-t border-gray-100"> <div className="flex justify-between text-xs text-gray-500 mb-1"><span>RM {cause.progress?.toLocaleString()}</span><span>Goal: RM {cause.goal?.toLocaleString()}</span></div> <div className="w-full bg-gray-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${cause.type === 'Sadaqah' ? 'bg-purple-500' : 'bg-blue-500'}`} style={{ width: `${calculateProgress(cause.progress, cause.goal)}%` }}></div></div> </div> )} {cause.donationMode !== 'money' && ( <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600"> <span className="font-medium">Needs:</span> {cause.inKindNeeds?.slice(0, 3).join(', ') || 'N/A'}{cause.inKindNeeds?.length > 3 ? '...' : ''} </div> )} </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-6">No nearby causes found matching your filters.</p>
                )}
              </div>
            )}
        </div>
        {/* --- End Nearby Causes --- */}


        {/* --- Interactive Features (Restored) --- */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
           <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><HiOutlineSparkles className="mr-2" />Engage & Discover</h2>
           <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
             <h3 className="text-md font-semibold text-purple-800 mb-2 flex items-center"><FiUserCheck className="mr-2"/>Recommended For You</h3>
             <p className="text-sm text-purple-700">Based on your interest in Community Development, you might like the <span className="font-medium">"Masjid Taman Universiti Expansion Waqf"</span>.</p>
             <button onClick={() => handleContributeClick(campaigns.find(c => c.id === '2'))} className="text-xs text-purple-600 hover:underline mt-1">View Recommendation</button> {/* Example: Link to contribute */}
           </div>
        </div>
        {/* --- End Interactive Features --- */}


        {/* --- NGO Campaigns List (Restored) --- */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><HiOutlineNewspaper className="mr-2"/>Active & Approved Campaigns</h2>
            <div className="flex space-x-2 mb-4 overflow-x-auto py-2">
                <button className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'all' ? 'bg-secondary text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200'}`} onClick={() => setFilter('all')}>All (Sadaqah/Waqf)</button>
                <button className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'waqf' ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200'}`} onClick={() => setFilter('waqf')}>Waqf</button>
                <button className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'sadaqah' ? 'bg-purple-500 text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200'}`} onClick={() => setFilter('sadaqah')}>Sadaqah</button>
            </div>

          {isLoading ? (
            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div></div>
          ) : (
            <div className="mt-4 space-y-4">
              {filteredCampaigns.length > 0 ? filteredCampaigns.map((campaign) => (
                 <div key={campaign.id} className={`border rounded-lg p-4 shadow-sm transition-shadow duration-200 ${campaign.status === 'completed' ? 'bg-gray-50 opacity-80' : 'bg-white hover:shadow-md'}`}> <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4"> <div className="flex-grow mb-3 md:mb-0 md:mr-4"> <div className="flex items-center mb-1 flex-wrap gap-1"><span className={`text-xs px-2 py-0.5 rounded-full text-white shadow-sm inline-block ${campaign.type === 'waqf' ? 'bg-blue-500' : 'bg-purple-500'}`}>{campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}</span><span className={`text-xs px-2 py-0.5 rounded-full shadow-sm inline-block ${campaign.donationMode === 'money' ? 'bg-green-100 text-green-700' : campaign.donationMode === 'in-kind' ? 'bg-orange-100 text-orange-700' : 'bg-indigo-100 text-indigo-700'}`}>{campaign.donationMode === 'money' ? <FiDollarSign className="inline mr-1 w-3 h-3"/> : campaign.donationMode === 'in-kind' ? <FiPackage className="inline mr-1 w-3 h-3"/> : <><FiDollarSign className="inline mr-0.5 w-3 h-3"/><FiPackage className="inline ml-0.5 w-3 h-3"/></>}{campaign.donationMode.charAt(0).toUpperCase() + campaign.donationMode.slice(1)}</span>{campaign.status === 'urgent' && (<span className="text-xs px-2 py-0.5 rounded-full bg-red-500 text-white shadow-sm inline-block">Urgent</span>)}{campaign.status === 'completed' && (<span className="text-xs px-2 py-0.5 rounded-full bg-gray-500 text-white shadow-sm inline-block">Completed</span>)}</div> <h3 className="text-lg font-semibold text-gray-800 leading-tight">{campaign.title}</h3> <p className="text-sm text-gray-600 mt-1 line-clamp-2">{campaign.purpose}</p> <p className="text-xs text-gray-500 mt-1">Ends: {new Date(campaign.endDate).toLocaleDateString('en-GB')}</p> {campaign.categories && campaign.categories.length > 0 && (<div className="mt-1 text-xs text-gray-500">Categories: {campaign.categories.join(', ')}</div>)} {campaign.donationMode !== 'money' && ( <div className="mt-2 text-xs text-gray-600 bg-orange-50 border border-orange-100 rounded p-2"> <span className="font-medium text-orange-800">Needs:</span> {campaign.inKindNeeds?.slice(0, 4).join(', ') || 'N/A'}{campaign.inKindNeeds?.length > 4 ? '...' : ''} <button onClick={() => setModalContent({ type: 'showInKindInfo', cause: campaign })} className="ml-1 text-orange-600 hover:underline">(more)</button> </div> )} </div> <div className="mt-2 md:mt-0 flex flex-wrap items-center justify-start md:flex-col md:items-end gap-2 flex-shrink-0"> {campaign.status !== 'completed' && ( <button onClick={() => handleContributeClick(campaign)} className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1.5 rounded-full shadow-sm transition-colors whitespace-nowrap flex items-center justify-center w-full md:w-auto"><FiGift className="mr-1 w-4 h-4"/> Contribute</button> )} <button onClick={() => handleShare(campaign)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1.5 rounded-full flex items-center shadow-sm transition-colors whitespace-nowrap justify-center w-full md:w-auto"> <FiShare2 className="mr-1 h-3 w-3" /> Share </button> </div> </div> {campaign.donationMode !== 'in-kind' && campaign.targetAmount !== '0' && ( <div className="mt-3"> <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Raised: RM {campaign.raisedAmount}</span><span>Goal: RM {campaign.targetAmount}</span></div> <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden"><div className={`absolute top-0 left-0 h-full rounded-full ${campaign.status === 'completed' ? 'bg-gray-400' : campaign.type === 'waqf' ? 'bg-blue-500' : 'bg-purple-500'}`} style={{ width: `${calculateProgress(campaign.raisedAmount, campaign.targetAmount)}%` }}></div></div> {campaign.status !== 'completed' && (<div className="text-right text-xs text-green-600 mt-1 flex items-center justify-end"><HiOutlineChartBar className="mr-1"/> Real-time Updates</div>)} </div> )} </div>
              )) : (
                 <p className="text-center text-gray-500 py-6">No {filter !== 'all' ? filter : ''} campaigns found.</p>
              )}
            </div>
          )}
        </div>
        {/* --- End NGO Campaigns List --- */}

         {/* --- Modal Dialog --- */}
         {isModalOpen && modalContent && (
             <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4 transition-opacity duration-300 backdrop-blur-sm">
                 <div className="bg-white rounded-lg shadow-xl p-6 pt-10 w-full max-w-md relative animate-fadeIn">
                     {/* Close Button */}
                     <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full" aria-label="Close modal">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>

                     {/* Modal Title */}
                     <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">
                         {modalContent.type === 'getAmount' && `Donate to ${modalContent.cause.name || modalContent.cause.title}`}
                         {modalContent.type === 'showInKindInfo' && `In-Kind Info: ${modalContent.cause.name || modalContent.cause.title}`}
                         {modalContent.type === 'showChoice' && `Contribute to ${modalContent.cause.name || modalContent.cause.title}`}
                         {modalContent.type === 'connectWallet' && `Connect Wallet Required`}
                         {modalContent.type === 'confirmation' && `Donation Status`}
                         {modalContent.type === 'shareInfo' && `Share This Campaign`}
                     </h3>

                     {/* Modal Content */}
                     <div className="modal-body text-sm">
                         {modalContent.type === 'connectWallet' && (<> <p className="text-gray-600 mb-4 text-center">Please connect your wallet to proceed.</p> <button onClick={() => { connectWallet(); closeModal(); }} className="w-full bg-secondary hover:bg-secondaryLight text-white font-semibold py-2 px-4 rounded-md">Connect Wallet</button> </>)}
                         {modalContent.type === 'getAmount' && ( <form onSubmit={(e) => { e.preventDefault(); const amount = e.target.elements.donationAmountInput.value; simulateDonationFromModal(modalContent.cause, amount); }}> <label htmlFor="donationAmountInput" className="block text-sm font-medium text-gray-700 mb-1">Amount (RM)</label> <input type="number" id="donationAmountInput" name="donationAmountInput" className="w-full p-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary mb-4" placeholder="0.00" step="0.01" min="1" required autoFocus/> {modalContent.error && <p className="text-red-500 text-xs mb-2">{modalContent.error}</p> } <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md">Confirm Donation</button> </form> )}
                         {modalContent.type === 'showInKindInfo' && ( <div className="space-y-2"> <p className="font-medium text-gray-700">Items Needed:</p> <ul className="list-disc list-inside text-gray-600 bg-gray-50 p-3 rounded border max-h-24 overflow-y-auto"> {modalContent.cause.inKindNeeds?.length > 0 ? modalContent.cause.inKindNeeds.map((item, index) => <li key={index}>{item}</li>) : <li>No specific items listed.</li> } </ul> <p className="font-medium text-gray-700 mt-3">Drop-off Location & Info:</p> <p className="text-gray-600 bg-gray-50 p-3 rounded border">{modalContent.cause.inKindLocation || 'Please contact the organizer for details.'}</p> <button onClick={closeModal} className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md">Close</button> </div> )}
                         {modalContent.type === 'showChoice' && ( <div className="space-y-3"> <p className="text-gray-600 text-center">How would you like to contribute?</p> <button onClick={() => setModalContent({ type: 'getAmount', cause: modalContent.cause })} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center"><FiDollarSign className="mr-1"/> Donate Money</button> <button onClick={() => setModalContent({ type: 'showInKindInfo', cause: modalContent.cause })} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center"><FiPackage className="mr-1"/> View In-Kind Needs</button> </div> )}
                         {modalContent.type === 'confirmation' && (<> <p className="text-green-600 text-center mb-4">{modalContent.message}</p> <button onClick={closeModal} className="mt-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md">OK</button> </>)}
                         {modalContent.type === 'shareInfo' && (<> <p className="text-gray-600 mb-2">Copy the text below to share:</p><textarea readOnly className="w-full h-24 p-2 border rounded bg-gray-50 text-xs" value={modalContent.text}></textarea><button onClick={closeModal} className="mt-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md">Close</button> </>)}
                     </div>
                 </div>
             </div>
         )}
         {/* --- End Modal Dialog --- */}


      </div>
    </div>
  );
};

export default DonationCampaignsPage;

// Inject styles
const styles = `
.leaflet-container { height: 100%; width: 100%; z-index: 0; }
.popup-content { width: 200px; }
.max-h-96::-webkit-scrollbar { width: 6px; }
.max-h-96::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
.max-h-96::-webkit-scrollbar-thumb { background: #bdbdbd; border-radius: 10px; }
.max-h-96::-webkit-scrollbar-thumb:hover { background: #888; }
.custom-marker { border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); text-shadow: 1px 1px 2px rgba(0,0,0,0.5); }
.custom-user-marker div { background-color: rgba(22, 163, 74, 0.9); width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
.line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);