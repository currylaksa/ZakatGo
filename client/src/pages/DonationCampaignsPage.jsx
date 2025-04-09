import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { TransactionContext } from '../context/TransactionContext';
import { HalfCircleBackground } from '../components';
import { FiChevronDown, FiChevronUp, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { HiOutlineEye, HiOutlineUser, HiOutlineCash, HiOutlineCalendar, HiOutlineBadgeCheck, HiOutlineChartBar, HiOutlineLightningBolt, HiOutlineSparkles, HiOutlineGlobe, HiOutlineHeart } from 'react-icons/hi';

const DonationCampaignsPage = () => {
  const { currentAccount, connectWallet } = useContext(TransactionContext);
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'zakat', 'waqf', 'sadaqah'
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});
  const [showingInsights, setShowingInsights] = useState({});
  const [isPremium] = useState(true); // In a real app, this would come from a context or API
  
  useEffect(() => {
    // Simulate fetching donation campaigns from blockchain
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch from your smart contract
        setTimeout(() => {
          const mockCampaigns = [
            {
              id: '1',
              title: 'Education for Asnaf Children',
              type: 'zakat',
              organizer: '0x7e...1A3b',
              startDate: 'Mar 19, 2024',
              targetAmount: '150,000',
              raisedAmount: '42,500',
              purpose: 'Educational support for underprivileged children',
              region: 'Selangor',
              status: 'active',
              endDate: 'Jun 19, 2024',
              // Transparency insights data
              transparencyInsights: {
                fundsDistributed: 12500,
                beneficiaries: 45,
                adminFeePercentage: 2.5,
                lastDistribution: 'Mar 15, 2024',
                donorCount: 78,
                verificationStatus: 'Verified by SC Malaysia',
                impactMetrics: [
                  { metric: 'School supplies provided', value: 120 },
                  { metric: 'Tuition support', value: 45 },
                  { metric: 'Digital devices', value: 15 }
                ]
              }
            },
            {
              id: '2',
              title: 'Community Masjid Construction',
              type: 'waqf',
              organizer: '0x3D...F28c',
              startDate: 'Mar 10, 2024',
              targetAmount: '500,000',
              raisedAmount: '325,000',
              purpose: 'Building a new community mosque',
              region: 'Penang',
              status: 'active',
              endDate: 'Dec 31, 2024',
              transparencyInsights: {
                fundsDistributed: 290000,
                beneficiaries: 'Entire community',
                adminFeePercentage: 1.5,
                lastDistribution: 'Mar 12, 2024',
                donorCount: 156,
                verificationStatus: 'Verified by SC Malaysia',
                impactMetrics: [
                  { metric: 'Construction completed', value: '58%' },
                  { metric: 'Local jobs created', value: 25 },
                  { metric: 'Expected capacity', value: 500 }
                ]
              }
            },
            {
              id: '3',
              title: 'Emergency Flood Relief',
              type: 'sadaqah',
              organizer: '0x9A...B45d',
              startDate: 'Mar 05, 2024',
              targetAmount: '75,000',
              raisedAmount: '45,000',
              purpose: 'Immediate assistance for flood victims',
              region: 'Kelantan',
              status: 'urgent',
              endDate: 'Apr 05, 2024',
              transparencyInsights: {
                fundsDistributed: 40000,
                beneficiaries: 120,
                adminFeePercentage: 1.0,
                lastDistribution: 'Mar 18, 2024',
                donorCount: 210,
                verificationStatus: 'Verified by SC Malaysia',
                impactMetrics: [
                  { metric: 'Food packages', value: 200 },
                  { metric: 'Clean water (liters)', value: 5000 },
                  { metric: 'Temporary shelters', value: 15 }
                ]
              }
            },
            {
              id: '4',
              title: 'Healthcare for Elderly',
              type: 'zakat',
              organizer: '0x5C...D31e',
              startDate: 'Feb 28, 2024',
              targetAmount: '100,000',
              raisedAmount: '67,500',
              purpose: 'Medical care for elderly asnaf',
              region: 'Johor',
              status: 'active',
              endDate: 'May 30, 2024',
              transparencyInsights: {
                fundsDistributed: 55000,
                beneficiaries: 85,
                adminFeePercentage: 2.0,
                lastDistribution: 'Mar 14, 2024',
                donorCount: 112,
                verificationStatus: 'Verified by SC Malaysia',
                impactMetrics: [
                  { metric: 'Medical checkups', value: 85 },
                  { metric: 'Medications provided', value: 150 },
                  { metric: 'Specialist treatments', value: 12 }
                ]
              }
            },
            {
              id: '5',
              title: 'Sustainable Water Well',
              type: 'waqf',
              organizer: '0x2F...A87b',
              startDate: 'Feb 15, 2024',
              targetAmount: '85,000',
              raisedAmount: '25,000',
              purpose: 'Clean water access for rural communities',
              region: 'Sabah',
              status: 'active',
              endDate: 'Jul 15, 2024',
              transparencyInsights: {
                fundsDistributed: 20000,
                beneficiaries: '5 Villages (est. 1200 people)',
                adminFeePercentage: 1.8,
                lastDistribution: 'Mar 10, 2024',
                donorCount: 68,
                verificationStatus: 'Verified by SC Malaysia',
                impactMetrics: [
                  { metric: 'Well construction', value: '25%' },
                  { metric: 'Pipeline laid (km)', value: 2.5 },
                  { metric: 'Expected water capacity (L/day)', value: 5000 }
                ]
              }
            }
          ];
          
          setCampaigns(mockCampaigns);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching donation campaigns:", error);
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleDonate = (campaign) => {
    if (!currentAccount) {
      alert("Please connect your wallet first");
      return;
    }
    
    // Navigate to our donation page with campaign data
    navigate(`/donate/${campaign.id}`, { state: { campaign } });
  };

  const toggleCardExpand = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleInsights = (id) => {
    setShowingInsights(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'zakat': return 'bg-green-500';
      case 'waqf': return 'bg-blue-500';
      case 'sadaqah': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'zakat': return 'Zakat';
      case 'waqf': return 'Waqf';
      case 'sadaqah': return 'Sadaqah';
      default: return 'Other';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (filter === 'all') return true;
    return campaign.type === filter;
  });

  const calculateProgress = (raised, target) => {
    const raisedAmount = parseInt(raised.replace(/,/g, ''));
    const targetAmount = parseInt(target.replace(/,/g, ''));
    return (raisedAmount / targetAmount) * 100;
  };

  return (
    <HalfCircleBackground title="Donation Campaigns">
      <div className="pt-2 max-w-lg mx-auto w-full pb-20">
        <p className="text-white text-opacity-80 mb-6">Support charitable causes with transparent, blockchain-verified donations.</p>

        {!currentAccount ? (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 text-center">
            <p className="mb-4">Connect your wallet to start donating</p>
            <button 
              onClick={connectWallet}
              className="flex flex-row justify-center rounded-full items-center bg-secondary p-3 cursor-pointer hover:bg-secondaryLight"
            >
              <p className="text-white text-base font-semibold">
                Connect Wallet
              </p>
            </button>
          </div>
        ) : (
          <>
            <div className="flex space-x-2 mb-4 overflow-x-auto py-2">
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'all' ? 'bg-secondary text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('all')}
              >
                All Campaigns
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'zakat' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('zakat')}
              >
                Zakat
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'waqf' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('waqf')}
              >
                Waqf
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'sadaqah' ? 'bg-purple-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('sadaqah')}
              >
                Sadaqah
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {filteredCampaigns.map((campaign) => (
                  <div key={campaign.id} className="relative">
                    {/* Card container */}
                    <div className="bg-white rounded-xl shadow-sm mb-4">
                      
                      {!showingInsights[campaign.id] ? (
                        // Front of card - Main campaign details
                        <div className="p-4">
                          {/* Card Header */}
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800">{campaign.title}</h3>
                              <div className="flex items-center mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getTypeColor(campaign.type)}`}>
                                  {getTypeLabel(campaign.type)}
                                </span>
                                {campaign.status === 'urgent' && (
                                  <span className="text-xs px-2 py-0.5 ml-2 rounded-full bg-red-500 text-white">
                                    Urgent
                                  </span>
                                )}
                              </div>
                            </div>
                            <button 
                              onClick={() => handleDonate(campaign)}
                              className="bg-secondary hover:bg-secondaryLight text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
                            >
                              Donate
                            </button>
                          </div>

                          {/* Card Basic Info - Always Visible */}
                          <div className="mt-3">
                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>RM {campaign.raisedAmount} / RM {campaign.targetAmount}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  campaign.type === 'zakat' ? 'bg-green-500' : 
                                  campaign.type === 'waqf' ? 'bg-blue-500' : 'bg-purple-500'
                                }`}
                                style={{ width: `${calculateProgress(campaign.raisedAmount, campaign.targetAmount)}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          {/* Region */}
                          <div className="mt-3 flex items-center">
                            <HiOutlineGlobe className="text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">{campaign.region}</span>
                            
                            {/* Transparency insights button */}
                            <button 
                              onClick={() => toggleInsights(campaign.id)}
                              className="ml-auto flex items-center bg-gradient-to-r from-green-500 to-teal-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
                            >
                              <HiOutlineSparkles className="mr-1" /> Transparency
                            </button>
                          </div>
                          
                          {/* Expand/Collapse Button */}
                          <button 
                            onClick={() => toggleCardExpand(campaign.id)}
                            className="w-full flex items-center justify-center mt-3 pt-2 text-gray-500 hover:text-gray-700 focus:outline-none border-t border-gray-100"
                          >
                            {expandedCards[campaign.id] ? (
                              <>
                                <span className="text-xs mr-1">Show less</span>
                                <FiChevronUp size={14} />
                              </>
                            ) : (
                              <>
                                <span className="text-xs mr-1">Show details</span>
                                <FiChevronDown size={14} />
                              </>
                            )}
                          </button>
                          
                          {/* Card Detailed Info - Only Visible When Expanded */}
                          {expandedCards[campaign.id] && (
                            <div className="mt-3 pt-2 border-t border-gray-100 animate-fadeIn">
                              <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                  <p className="text-sm text-gray-500">Start Date</p>
                                  <p className="text-md font-medium text-gray-700">{campaign.startDate}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">End Date</p>
                                  <p className="text-md font-medium text-gray-700">{campaign.endDate}</p>
                                </div>
                              </div>
                              
                              <div className="mb-4">
                                <p className="text-sm text-gray-500">Purpose</p>
                                <p className="text-md font-medium text-gray-700">{campaign.purpose}</p>
                              </div>
                              
                              <div className="mb-2">
                                <p className="text-sm text-gray-500">Organizer ID</p>
                                <p className="text-md font-medium text-gray-700">{campaign.organizer}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Back of the card - Transparency Insights
                        <div className="bg-gradient-to-br from-slate-50 to-teal-50 p-4 rounded-xl">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold flex items-center">
                              <HiOutlineBadgeCheck className="text-teal-600 mr-2" /> 
                              Blockchain Transparency
                            </h3>
                            <button 
                              onClick={() => toggleInsights(campaign.id)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-gray-700">
                                <HiOutlineCash className="mr-2 text-teal-600" /> Funds Distributed
                              </div>
                              <span className="font-medium">RM {campaign.transparencyInsights.fundsDistributed.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-gray-700">
                                <HiOutlineUser className="mr-2 text-teal-600" /> Beneficiaries
                              </div>
                              <span className="font-medium">{campaign.transparencyInsights.beneficiaries}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-gray-700">
                                <HiOutlineCalendar className="mr-2 text-teal-600" /> Last Distribution
                              </div>
                              <span className="font-medium">{campaign.transparencyInsights.lastDistribution}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-gray-700">
                                <HiOutlineHeart className="mr-2 text-teal-600" /> Donors
                              </div>
                              <span className="font-medium">{campaign.transparencyInsights.donorCount}</span>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-teal-100">
                              <p className="text-sm font-medium text-teal-700 mb-2">Impact Metrics</p>
                              <div className="space-y-2">
                                {campaign.transparencyInsights.impactMetrics.map((metric, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{metric.metric}</span>
                                    <span className="font-medium">{metric.value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </HalfCircleBackground>
  );
};

export default DonationCampaignsPage;