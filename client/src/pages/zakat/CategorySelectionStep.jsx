import React, { useState, useMemo } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const CategorySelectionStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(
    userData.selectedCategories?.map(c => c.id) || []
  );
  const [error, setError] = useState('');

  // 8 Categories of Zakat Recipients (Asnaf)
  const zakatCategories = useMemo(() => [
    { id: 1, name: 'Fuqara (The Poor)', description: 'Those living without means of livelihood.' },
    { id: 2, name: 'Masakin (The Needy)', description: 'Those without sufficient means to meet their basic needs.' },
    { id: 3, name: 'Amil Zakat (Zakat Collectors)', description: 'Administrators/collectors appointed to manage Zakat.' },
    { id: 4, name: 'Muallaf (New Muslims/Friends)', description: 'Those who have recently converted to Islam or are inclined towards it.' },
    { id: 5, name: 'Riqab (Slaves/Captives)', description: 'To free individuals from bondage or slavery (less common today, may apply to freeing captives or those oppressed).' },
    { id: 6, name: 'Gharimin (Debtors)', description: 'Those in overwhelming debt incurred for basic necessities or lawful purposes.' },
    { id: 7, name: 'Fi Sabilillah (In the Cause of Allah)', description: 'Those striving in the path of Allah, e.g., for defense, promoting Islam, community welfare projects.' },
    { id: 8, name: 'Ibn as-Sabil (Wayfarers)', description: 'Stranded travelers who lack the means to reach their destination.' }
  ], []);

  const toggleCategory = (categoryId) => {
    setError(''); // Clear error on interaction
    setSelectedCategoryIds(prevSelected =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter(id => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const handleContinue = () => {
    if (selectedCategoryIds.length === 0) {
      setError('Please select at least one category to donate to.');
      return;
    }

    const selectedCategoryDetails = zakatCategories.filter(category =>
      selectedCategoryIds.includes(category.id)
    );

    updateUserData({ selectedCategories: selectedCategoryDetails });
    nextStep();
  };

  // Determine if the user is eligible for Zakat payment based on the previous step
  const isEligibleForZakat = userData.zakatAmount > 0;
  
  // Calculate total categories and selected categories
  const totalCategories = zakatCategories.length;
  const selectedCount = selectedCategoryIds.length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 bg-white rounded-lg p-6 shadow-sm">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Choose Zakat Categories</h2>
        <p className="text-gray-500 mt-1">Step 4 of 5: Select recipients for your contribution</p>
      </div>

      {isEligibleForZakat ? (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-blue-800 font-medium flex items-center">
            <span className="bg-blue-100 p-1 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Your Zakat Amount
          </h3>
          <p className="text-gray-700 mt-2">
            Select one or more categories (Asnaf) for your Zakat contribution of{' '}
            <span className="font-bold text-blue-700">RM {userData.zakatAmount.toFixed(2)}</span>
          </p>
        </div>
      ) : (
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <h3 className="text-amber-800 font-medium flex items-center">
            <span className="bg-amber-100 p-1 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
            No Zakat Due
          </h3>
          <p className="text-gray-700 mt-2">
            Even though no Zakat was calculated, you can choose categories for a voluntary Sadaqah donation.
          </p>
        </div>
      )}

      <div className="my-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600">Selected Categories: {selectedCount}/{totalCategories}</p>
          {selectedCount > 0 && (
            <button 
              onClick={() => setSelectedCategoryIds([])} 
              className="text-sm text-gray-500 hover:text-red-500"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${(selectedCount / totalCategories) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {zakatCategories.map(category => (
          <div 
            key={category.id} 
            onClick={() => toggleCategory(category.id)}
            className={`
              relative flex items-start p-4 rounded-lg cursor-pointer transition-all duration-200
              ${selectedCategoryIds.includes(category.id) 
                ? 'bg-blue-50 border-2 border-blue-400 shadow-sm' 
                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}
            `}
          >
            <div className="min-w-0 flex-1">
              <h3 className="text-md font-medium text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{category.description}</p>
            </div>
            <div className="ml-3 flex items-center h-5">
              {selectedCategoryIds.includes(category.id) ? (
                <div className="text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              ) : (
                <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 p-3 rounded-md border border-red-200">
          <p className="text-red-600 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t">
        <button
          onClick={prevStep}
          className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className={`
            px-5 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
            ${selectedCategoryIds.length > 0 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-blue-400 text-white cursor-not-allowed'}
          `}
          disabled={selectedCategoryIds.length === 0}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default CategorySelectionStep;
