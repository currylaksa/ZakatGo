import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionContext } from '../context/TransactionContext'; // Assuming context is needed
import { HalfCircleBackground } from '../components'; // Assuming layout component
// Import icons
import { FiUpload, FiCheckCircle, FiAlertCircle, FiPackage, FiDollarSign } from 'react-icons/fi';
import { HiOutlineOfficeBuilding, HiOutlineNewspaper, HiArrowLeft } from 'react-icons/hi';

// Available donation categories (Zakat-specific categories removed)
const donationCategoryOptions = ['General Sadaqah', 'Waqf Project', 'Emergency Relief', 'Skill Development', 'Food Aid', 'Healthcare', 'Orphanage Support', 'Masjid Support', 'Animal Welfare'];

const CreateCampaignPage = () => {
    const navigate = useNavigate();
    const { currentAccount } = useContext(TransactionContext); // Get wallet address if needed
    const [formStatus, setFormStatus] = useState(''); // '', 'submitting', 'success', 'error'

    // State for NGO verification + campaign details + donation mode
    const [newCampaign, setNewCampaign] = useState({
        // NGO Verification Info
        ngoName: '', ngoRegNumber: '', contactPerson: '', contactEmail: '', contactPhone: '', ngoWebsite: '', verificationDocs: null,
        // Campaign Details
        campaignName: '', campaignDescription: '', endDate: '', donationCategories: [], campaignType: 'sadaqah',
        // Donation Mode Details
        donationMode: 'money', // Default to money
        goalAmount: '', // Monetary goal
        inKindNeeds: '', // Comma-separated string
        inKindLocation: '',
    });

    // ****** START: Added Missing Handler Functions ******
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCampaign(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewCampaign(prev => ({ ...prev, verificationDocs: e.target.files[0] }));
            console.log("File selected:", e.target.files[0].name);
        } else {
            setNewCampaign(prev => ({ ...prev, verificationDocs: null }));
        }
    };

    const handleTypeChange = (e) => {
        setNewCampaign(prev => ({ ...prev, campaignType: e.target.value }));
    };

    const handleDonationModeChange = (e) => {
        setNewCampaign(prev => ({ ...prev, donationMode: e.target.value }));
    };

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        setNewCampaign(prev => ({
          ...prev,
          donationCategories: checked
            ? [...prev.donationCategories, value]
            : prev.donationCategories.filter(cat => cat !== value)
        }));
      };

    const handleCreateCampaignSubmit = (e) => {
        e.preventDefault();
        setFormStatus('submitting');
        // Convert inKindNeeds string to array if needed
        const processedCampaign = {
          ...newCampaign,
          inKindNeeds: newCampaign.donationMode !== 'money' ? newCampaign.inKindNeeds.split(',').map(item => item.trim()).filter(item => item) : [],
          goalAmount: newCampaign.donationMode === 'in-kind' ? '0' : newCampaign.goalAmount, // Set goal to 0 if in-kind only
        };
        console.log("Submitting campaign for verification:", processedCampaign);

        // ** TODO: Implement actual submission to backend for verification **
        // - Send all `processedCampaign` data, including the file `verificationDocs`
        // - Backend should process, store, and mark for review

        // Simulate submission & review process
        setTimeout(() => {
            setFormStatus('success'); // Simulate success after 2 seconds
            // Redirect back to campaigns page after success message
            setTimeout(() => {
                navigate('/campaigns'); // Navigate back
            }, 2000); // Show success message for 2 seconds
        }, 2000); // Simulate 2 seconds submission time
    };
    // ****** END: Added Missing Handler Functions ******


    return (
        <HalfCircleBackground title="Create New Campaign">
            <div className="pt-2 max-w-2xl mx-auto w-full pb-20">
                <button onClick={() => navigate(-1)} className="flex items-center text-white opacity-80 hover:opacity-100 mb-4">
                    <HiArrowLeft className="mr-1"/> Back to Campaigns
                </button>

                 <div className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden">
                     {/* Submission Status Overlay */}
                     {(formStatus === 'submitting' || formStatus === 'success') && (
                         <div className={`absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center z-10 transition-opacity duration-300`}>
                             {formStatus === 'submitting' && ( <> <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary mb-4"></div> <p className="text-lg font-medium text-gray-700">Submitting for Verification...</p> <p className="text-sm text-gray-500">Please wait.</p> </> )}
                             {formStatus === 'success' && ( <> <FiCheckCircle className="w-16 h-16 text-green-500 mb-4" /> <p className="text-lg font-medium text-gray-700">Campaign Submitted!</p> <p className="text-sm text-gray-500 text-center px-4">Under review (24-48 hours). Redirecting...</p> </> )}
                         </div>
                      )}
                     {/* End Submission Status Overlay */}

                     <form onSubmit={handleCreateCampaignSubmit} className="space-y-6">
                         {/* --- NGO Verification Section --- */}
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                             <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center"><HiOutlineOfficeBuilding className="mr-2" /> 1. NGO Verification Details</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {/* Fields: ngoName, ngoRegNumber, contactPerson, contactEmail, contactPhone, ngoWebsite */}
                                 <div><label htmlFor="ngoName" className="block text-sm font-medium text-gray-700 mb-1">Official NGO Name*</label><input id="ngoName" type="text" name="ngoName" value={newCampaign.ngoName} onChange={handleInputChange} placeholder="Full registered name" className="w-full p-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required /></div>
                                 <div><label htmlFor="ngoRegNumber" className="block text-sm font-medium text-gray-700 mb-1">Registration Number*</label><input id="ngoRegNumber" type="text" name="ngoRegNumber" value={newCampaign.ngoRegNumber} onChange={handleInputChange} placeholder="e.g., PPM-XXX-XX-XXXXXX" className="w-full p-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required /></div>
                                 <div><label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">Contact Person*</label><input id="contactPerson" type="text" name="contactPerson" value={newCampaign.contactPerson} onChange={handleInputChange} placeholder="Name of representative" className="w-full p-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required /></div>
                                 <div><label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">Official Contact Email*</label><input id="contactEmail" type="email" name="contactEmail" value={newCampaign.contactEmail} onChange={handleInputChange} placeholder="e.g., info@ngo.org.my" className="w-full p-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required /></div>
                                 <div><label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">Contact Phone*</label><input id="contactPhone" type="tel" name="contactPhone" value={newCampaign.contactPhone} onChange={handleInputChange} placeholder="+60XXXXXXXXX" className="w-full p-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required /></div>
                                 <div><label htmlFor="ngoWebsite" className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label><input id="ngoWebsite" type="url" name="ngoWebsite" value={newCampaign.ngoWebsite} onChange={handleInputChange} placeholder="https://www.ngo.org.my" className="w-full p-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" /></div>
                                 {/* Verification Doc Upload */}
                                 <div className="md:col-span-2">
                                     <label htmlFor="verificationDocs" className="block text-sm font-medium text-gray-700 mb-1">Verification Document*</label>
                                     <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"><div className="space-y-1 text-center"><FiUpload className="mx-auto h-10 w-10 text-gray-400" /><div className="flex text-sm text-gray-600"><label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-secondary hover:text-secondaryLight focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-secondary"><span>Upload Registration Cert</span><input id="file-upload" name="verificationDocs" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" required /></label><p className="pl-1">or drag and drop</p></div><p className="text-xs text-gray-500">PDF, PNG, JPG up to 5MB</p>{newCampaign.verificationDocs && <p className="text-xs text-green-600 mt-1">Selected: {newCampaign.verificationDocs.name}</p>}</div></div>
                                 </div>
                             </div>
                          </div>

                         {/* --- Campaign Details Section --- */}
                          <div>
                              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center mt-6"><HiOutlineNewspaper className="mr-2" /> 2. Campaign Details</h3>
                              <div className="space-y-4">
                                  {/* Campaign Type */}
                                   <div>
                                       <label htmlFor="campaignType" className="block text-sm font-medium text-gray-700 mb-1">Campaign Type*</label>
                                       <select id="campaignType" name="campaignType" value={newCampaign.campaignType} onChange={handleTypeChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required >
                                           <option value="sadaqah">Sadaqah (Voluntary Charity)</option>
                                           <option value="waqf">Waqf (Endowment)</option>
                                       </select>
                                   </div>
                                   {/* Donation Mode */}
                                   <div>
                                       <label className="block text-sm font-medium text-gray-700 mb-1">Donation Mode*</label>
                                       <div className="flex space-x-4 mt-1">
                                           <label className="flex items-center cursor-pointer"><input type="radio" name="donationMode" value="money" checked={newCampaign.donationMode === 'money'} onChange={handleDonationModeChange} className="mr-1 focus:ring-secondary h-4 w-4"/> Money Only</label>
                                           <label className="flex items-center cursor-pointer"><input type="radio" name="donationMode" value="in-kind" checked={newCampaign.donationMode === 'in-kind'} onChange={handleDonationModeChange} className="mr-1 focus:ring-secondary h-4 w-4"/> In-Kind Only</label>
                                           <label className="flex items-center cursor-pointer"><input type="radio" name="donationMode" value="both" checked={newCampaign.donationMode === 'both'} onChange={handleDonationModeChange} className="mr-1 focus:ring-secondary h-4 w-4"/> Both Money & In-Kind</label>
                                       </div>
                                   </div>
                                   {/* Monetary Goal (conditional) */}
                                   {newCampaign.donationMode !== 'in-kind' && (
                                       <div>
                                           <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-700 mb-1">Monetary Goal (RM)</label>
                                           <input id="goalAmount" type="number" name="goalAmount" value={newCampaign.goalAmount} onChange={handleInputChange} placeholder="Leave blank or 0 if no monetary goal" className="w-full p-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" min="0" required={newCampaign.donationMode === 'money'}/> {/* Required if money only */}
                                       </div>
                                   )}
                                   {/* In-Kind Needs (conditional) */}
                                   {newCampaign.donationMode !== 'money' && (
                                       <>
                                           <div>
                                               <label htmlFor="inKindNeeds" className="block text-sm font-medium text-gray-700 mb-1">In-Kind Items Needed*</label>
                                               <textarea id="inKindNeeds" name="inKindNeeds" value={newCampaign.inKindNeeds} onChange={handleInputChange} placeholder="List specific items needed, separated by commas (e.g., Rice bags, Canned food, Blankets)" rows="3" className="w-full p-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required={newCampaign.donationMode !== 'money'}/>
                                           </div>
                                           <div>
                                               <label htmlFor="inKindLocation" className="block text-sm font-medium text-gray-700 mb-1">In-Kind Drop-off Location & Instructions*</label>
                                               <textarea id="inKindLocation" name="inKindLocation" value={newCampaign.inKindLocation} onChange={handleInputChange} placeholder="Provide clear drop-off address and operating hours/contact person" rows="2" className="w-full p-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required={newCampaign.donationMode !== 'money'}/>
                                           </div>
                                       </>
                                   )}
                                  {/* Campaign Name, Desc, End Date */}
                                  <div><label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-1">Campaign Name*</label><input id="campaignName" type="text" name="campaignName" value={newCampaign.campaignName} onChange={handleInputChange} placeholder="Descriptive title of the campaign" className="w-full p-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required /></div>
                                  <div><label htmlFor="campaignDescription" className="block text-sm font-medium text-gray-700 mb-1">Campaign Description*</label><textarea id="campaignDescription" name="campaignDescription" value={newCampaign.campaignDescription} onChange={handleInputChange} placeholder="Detailed description, objectives, and how funds/items will be used" rows="4" className="w-full p-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required /></div>
                                  <div><label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Campaign End Date*</label><input id="endDate" type="date" name="endDate" value={newCampaign.endDate} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required min={new Date().toISOString().split("T")[0]} /></div>
                                  {/* Categories */}
                                   <div>
                                       <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Categories*</label>
                                       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 p-3 bg-gray-50 rounded-md border max-h-40 overflow-y-auto">
                                         {donationCategoryOptions.map(cat => ( <div key={cat} className="flex items-center"> <input type="checkbox" id={`cat-${cat}`} value={cat} checked={newCampaign.donationCategories.includes(cat)} onChange={handleCategoryChange} className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded cursor-pointer"/> <label htmlFor={`cat-${cat}`} className="ml-2 text-sm text-gray-600 cursor-pointer">{cat}</label> </div> ))}
                                       </div>
                                        <p className="text-xs text-gray-500 mt-1">Select at least one category.</p>
                                    </div>
                              </div>
                          </div>

                         {/* --- Submission Button & Note --- */}
                          <div className="mt-8 pt-6 border-t border-gray-200">
                             <p className="text-sm text-gray-600 mb-4"> <FiAlertCircle className="inline w-4 h-4 mr-1 text-yellow-600" /> Please review all details carefully. Your campaign will be submitted for verification before becoming public. </p>
                             <button type="submit" disabled={formStatus === 'submitting'} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-wait" > {formStatus === 'submitting' ? ( <> <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div> Processing Submission... </> ) : ( 'Submit Campaign for Verification' )} </button>
                          </div>
                     </form>
                 </div>
            </div>
        </HalfCircleBackground>
    );
}

export default CreateCampaignPage;

// Inject styles if needed
const styles = `
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);