import React, { useState } from 'react';

const CategorySelectionStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(userData.selectedCategories?.map(c => c.id) || []);
  const [error, setError] = useState('');

  // 8 Categories of Zakat Recipients (Asnaf) [cite: 8]
  const zakatCategories = [
    { id: 1, name: 'Fuqara (The Poor)', description: 'Those living without means of livelihood.' },
    { id: 2, name: 'Masakin (The Needy)', description: 'Those without sufficient means to meet their basic needs.' },
    { id: 3, name: 'Amil Zakat (Zakat Collectors)', description: 'Administrators/collectors appointed to manage Zakat.' },
    { id: 4, name: 'Muallaf (New Muslims/Friends)', description: 'Those who have recently converted to Islam or are inclined towards it.' },
    { id: 5, name: 'Riqab (Slaves/Captives)', description: 'To free individuals from bondage or slavery (less common today, may apply to freeing captives or those oppressed).' },
    { id: 6, name: 'Gharimin (Debtors)', description: 'Those in overwhelming debt incurred for basic necessities or lawful purposes.' },
    { id: 7, name: 'Fi Sabilillah (In the Cause of Allah)', description: 'Those striving in the path of Allah, e.g., for defense, promoting Islam, community welfare projects.' },
    { id: 8, name: 'Ibn as-Sabil (Wayfarers)', description: 'Stranded travelers who lack the means to reach their destination.' }
  ];

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

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Step 4: Choose Zakat Categories</h2>
       {isEligibleForZakat ? (
            <p className="text-gray-600">Select one or more categories (Asnaf) you wish your Zakat of <span className="font-semibold">RM {userData.zakatAmount.toFixed(2)}</span> to support[cite: 8]:</p>
       ) : (
            <p className="text-gray-600">Even though no Zakat was calculated, you can choose categories if you wish to make a voluntary donation (Sadaqah).</p>
       )}

      <div className="space-y-3">
        {zakatCategories.map(category => (
          <div key={category.id} className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              id={`category-${category.id}`}
              checked={selectedCategoryIds.includes(category.id)}
              onChange={() => toggleCategory(category.id)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 cursor-pointer"
              aria-labelledby={`category-label-${category.id}`}
            />
            <label htmlFor={`category-${category.id}`} id={`category-label-${category.id}`} className="ml-3 block text-sm text-gray-700 cursor-pointer">
              <strong className="font-medium text-gray-900">{category.name}</strong>
              <p className="text-gray-500">{category.description}</p>
            </label>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default CategorySelectionStep;
