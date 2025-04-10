import React, { useState } from 'react';

const CategorySelectionStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const zakatCategories = [
    { id: 1, name: 'Fuqara (Poor)', description: 'Those who do not have enough to meet their basic needs' },
    { id: 2, name: 'Masakin (Needy)', description: 'Those who have some means but not enough to meet their needs' },
    { id: 3, name: 'Amil Zakat (Zakat Collectors)', description: 'Those who collect and distribute Zakat' },
    { id: 4, name: 'Muallaf (New Muslims)', description: 'Those who have recently converted to Islam' },
    { id: 5, name: 'Riqab (Freedom of Slaves)', description: 'To free people from bondage or oppression' },
    { id: 6, name: 'Gharimin (Debtors)', description: 'Those in debt for legitimate reasons' },
    { id: 7, name: 'Fi Sabilillah (In the Cause of Allah)', description: 'For causes in the way of Allah' },
    { id: 8, name: 'Ibn as-Sabil (Travelers)', description: 'Travelers who lack resources to continue their journey' }
  ];

  const toggleCategory = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleContinue = () => {
    if (selectedCategories.length === 0) {
      alert('Please select at least one category');
      return;
    }

    const selectedCategoryDetails = zakatCategories.filter(category => 
      selectedCategories.includes(category.id)
    );
    
    updateUserData({ selectedCategories: selectedCategoryDetails });
    nextStep();
  };

  return (
    <div>
      <h2>Step 4: Choose Zakat Categories</h2>
      <p>Select one or more categories you wish to donate your Zakat to:</p>
      
      <div>
        {zakatCategories.map(category => (
          <div key={category.id}>
            <input
              type="checkbox"
              id={`category-${category.id}`}
              checked={selectedCategories.includes(category.id)}
              onChange={() => toggleCategory(category.id)}
            />
            <label htmlFor={`category-${category.id}`}>
              <strong>{category.name}</strong> - {category.description}
            </label>
          </div>
        ))}
      </div>
      
      <div>
        <button onClick={prevStep}>Back</button>
        <button onClick={handleContinue}>Continue</button>
      </div>
    </div>
  );
};

export default CategorySelectionStep;
