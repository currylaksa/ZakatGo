import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const ReviewInformationStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize form with data from prior steps
  const [formData, setFormData] = useState({
    name: userData.documentData?.name || userData.personalInfo?.name || '',
    otherIncome: '',
    bonusManual: '', // user can enter bonus if not present in doc
    personalRelief: 9000,
    spouseCount: 0,
    childCount: 0,
    parentsSupport: '',
    educationExpenses: '',
    medicalExpenses: '',
    tabungHaji: '',
    epfContribution: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Update form when userData changes (e.g., after AI processing)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: userData.documentData?.name || userData.personalInfo?.name || '',
    }));
  }, [userData.documentData, userData.personalInfo]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    if (
      [
        'otherIncome',
        'bonusManual',
        'personalRelief',
        'spouseCount',
        'childCount',
        'parentsSupport',
        'educationExpenses',
        'medicalExpenses',
        'tabungHaji',
        'epfContribution',
      ].includes(name)
    ) {
      processedValue = value === '' ? '' : Math.max(0, Number(value));
    }

    if (name === 'spouseCount') {
      processedValue = value === '' ? '' : Math.min(4, Math.max(0, Number(value)));
    }

    setFormData({ ...formData, [name]: processedValue });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = null;
    switch (name) {
      case 'name':
        if (!value || value.trim() === '') error = 'Full Name is required';
        break;
      case 'personalRelief':
        if (value === '' || isNaN(value) || value < 0 || value > 9000) error = 'Personal Relief must be between 0 and 9000';
        break;
      case 'spouseCount':
        if (value === '' || isNaN(value) || value < 0 || value > 4) error = 'Spouse count must be 0–4';
        break;
      case 'childCount':
        if (value === '' || isNaN(value) || value < 0) error = 'Children count must be 0 or more';
        break;
      case 'otherIncome':
      case 'bonusManual':
      case 'parentsSupport':
      case 'educationExpenses':
      case 'medicalExpenses':
      case 'tabungHaji':
      case 'epfContribution':
        if (value !== '' && (isNaN(value) || value < 0)) error = 'Enter a valid non-negative amount';
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateForm = () => {
    const fields = [
      'name',
      'personalRelief',
      'spouseCount',
      'childCount',
      'otherIncome',
      'bonusManual',
      'parentsSupport',
      'educationExpenses',
      'medicalExpenses',
      'tabungHaji',
      'epfContribution',
    ];
    const newErrors = {};
    let isValid = true;
    fields.forEach(field => {
      if (!validateField(field, formData[field])) {
        newErrors[field] = errors[field] || `${field} is invalid`;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      personalRelief: true,
      spouseCount: true,
      childCount: true,
      otherIncome: true,
      bonusManual: true,
      parentsSupport: true,
      educationExpenses: true,
      medicalExpenses: true,
      tabungHaji: true,
      epfContribution: true,
    });

    if (validateForm()) {
      setIsLoading(true);

      const docData = userData.documentData || {};
      const baseIncome = Number(docData.annualIncome || 0);
      const bonusFromDoc = Number(docData.bonus || 0);
      const manualBonus = Number(formData.bonusManual || 0);
      const otherIncome = Number(formData.otherIncome || 0);
      const grossIncome = baseIncome + bonusFromDoc + otherIncome + (bonusFromDoc > 0 ? 0 : manualBonus);

      const spouseRelief = 3000 * Number(formData.spouseCount || 0);
      const childRelief = 1000 * Number(formData.childCount || 0);
      const personalRelief = Number(formData.personalRelief || 0);
      const parentsSupport = Number(formData.parentsSupport || 0);
      const educationExpenses = Number(formData.educationExpenses || 0);
      const medicalExpenses = Number(formData.medicalExpenses || 0);
      const tabungHaji = Number(formData.tabungHaji || 0);
      const epfContribution = Number(formData.epfContribution || 0);

      const allowedExpenses = personalRelief + spouseRelief + childRelief + parentsSupport + educationExpenses + medicalExpenses + tabungHaji + epfContribution;
      const netZakatableIncome = Math.max(0, grossIncome - allowedExpenses);

      updateUserData({
        personalInfo: { name: formData.name },
        manualDetails: {
          otherIncome,
          bonusManual: Number(formData.bonusManual || 0),
          expensesBreakdown: {
            personalRelief,
            spouseCount: Number(formData.spouseCount || 0),
            spouseRelief,
            childCount: Number(formData.childCount || 0),
            childRelief,
            parentsSupport,
            educationExpenses,
            medicalExpenses,
            tabungHaji,
            epfContribution,
          },
        },
        calculation: {
          grossIncome,
          allowedExpenses,
          netZakatableIncome,
        },
      });

      const dataToSave = {
        name: formData.name,
        calculation: {
          grossIncome,
          allowedExpenses,
          netZakatableIncome,
        },
        manualDetails: {
          otherIncome,
          bonusManual: Number(formData.bonusManual || 0),
          personalRelief,
          spouseCount: Number(formData.spouseCount || 0),
          spouseRelief,
          childCount: Number(formData.childCount || 0),
          childRelief,
          parentsSupport,
          educationExpenses,
          medicalExpenses,
          tabungHaji,
          epfContribution,
        },
        lastUpdated: new Date().toISOString(),
      };

      const docId = formData.name ? formData.name.toLowerCase().replace(/\s+/g, '_') : `calc_${Date.now()}`;
      const userRef = doc(db, 'zakatCalculations', docId);
      setDoc(userRef, dataToSave, { merge: true })
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            setIsLoading(false);
            nextStep();
          }, 600);
        });
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClasses = "w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 transition duration-150";
    if (errors[fieldName] && touched[fieldName]) return `${baseClasses} border-red-300 text-red-800 focus:border-red-500 focus:ring-red-200`;
    if (touched[fieldName] && !errors[fieldName]) return `${baseClasses} border-green-300 focus:border-green-500 focus:ring-green-200`;
    return `${baseClasses} border-gray-300 focus:border-[#a62b45] focus:ring-[#f4ccd6]`;
  };

  // Derived display values for summary
  const baseIncomeFromDoc = Number(userData.documentData?.annualIncome || 0);
  const bonusFromDocRender = Number(userData.documentData?.bonus || 0);
  const manualBonusAllowed = Number(formData.bonusManual || 0);
  const otherPlusBonusManual = Number(formData.otherIncome || 0) + manualBonusAllowed;
  const personalReliefRender = Number(formData.personalRelief || 0);
  const spouseReliefRender = 3000 * Number(formData.spouseCount || 0);
  const childReliefRender = 1000 * Number(formData.childCount || 0);
  const parentsSupportRender = Number(formData.parentsSupport || 0);
  const educationExpensesRender = Number(formData.educationExpenses || 0);
  const medicalExpensesRender = Number(formData.medicalExpenses || 0);
  const tabungHajiRender = Number(formData.tabungHaji || 0);
  const epfContributionRender = Number(formData.epfContribution || 0);
  const allowedExpensesRender = personalReliefRender + spouseReliefRender + childReliefRender + parentsSupportRender + educationExpensesRender + medicalExpensesRender + tabungHajiRender + epfContributionRender;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Manual Entry: Other Income & Allowable Expenses</h2>
        <p className="text-gray-600 mt-1">Enter additional income and allowable expenses per Malaysian tax rules.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('name')}
                placeholder="e.g. Ahmad bin Ali"
              />
            </div>
            {errors.name && touched.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="otherIncome" className="block text-sm font-medium text-gray-700 mb-1">Other Income (RM/year)</label>
            <input
              type="number"
              id="otherIncome"
              name="otherIncome"
              value={formData.otherIncome}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName('otherIncome')}
              placeholder="e.g. 12000"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="bonusManual" className="block text-sm font-medium text-gray-700 mb-1">Bonus (if not in document) (RM/year)</label>
            <input
              type="number"
              id="bonusManual"
              name="bonusManual"
              value={formData.bonusManual}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName('bonusManual')}
              placeholder="e.g. 5000"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="personalRelief" className="block text-sm font-medium text-gray-700 mb-1">Personal Relief (max RM9,000)</label>
            <input
              type="number"
              id="personalRelief"
              name="personalRelief"
              value={formData.personalRelief}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName('personalRelief')}
              placeholder="Up to 9000"
              min="0"
              max="9000"
            />
          </div>

          <div>
            <label htmlFor="spouseCount" className="block text-sm font-medium text-gray-700 mb-1">Spouse Count (RM3,000 × count, max 4)</label>
            <input
              type="number"
              id="spouseCount"
              name="spouseCount"
              value={formData.spouseCount}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName('spouseCount')}
              placeholder="0–4"
              min="0"
              max="4"
            />
          </div>

          <div>
            <label htmlFor="childCount" className="block text-sm font-medium text-gray-700 mb-1">Children Count (RM1,000 × count)</label>
            <input
              type="number"
              id="childCount"
              name="childCount"
              value={formData.childCount}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName('childCount')}
              placeholder="e.g. 2"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="parentsSupport" className="block text-sm font-medium text-gray-700 mb-1">Parents’ Support (RM/year)</label>
            <input
              type="number"
              id="parentsSupport"
              name="parentsSupport"
              value={formData.parentsSupport}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName('parentsSupport')}
              placeholder="e.g. 1200"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="educationExpenses" className="block text-sm font-medium text-gray-700 mb-1">Education Expenses (RM/year)</label>
            <input
              type="number"
              id="educationExpenses"
              name="educationExpenses"
              value={formData.educationExpenses}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName('educationExpenses')}
              placeholder="e.g. 3000"
              min="0"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="medicalExpenses" className="block text-sm font-medium text-gray-700 mb-1">Medical Expenses (RM/year) – excluding insurance, takaful, and panel clinic costs</label>
            <input
              type="number"
              id="medicalExpenses"
              name="medicalExpenses"
              value={formData.medicalExpenses}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName('medicalExpenses')}
              placeholder="e.g. 1500"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="tabungHaji" className="block text-sm font-medium text-gray-700 mb-1">Tabung Haji Contribution (RM/year)</label>
            <input
              type="number"
              id="tabungHaji"
              name="tabungHaji"
              value={formData.tabungHaji}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName('tabungHaji')}
              placeholder="e.g. 2000"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="epfContribution" className="block text-sm font-medium text-gray-700 mb-1">EPF Contribution (KWSP) (RM/year)</label>
            <input
              type="number"
              id="epfContribution"
              name="epfContribution"
              value={formData.epfContribution}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName('epfContribution')}
              placeholder="e.g. 24000"
              min="0"
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-gray-800 font-medium mb-2">Zakatable Income Calculation</h3>
          <p className="text-sm text-gray-600">Total Income − Total Allowable Expenses</p>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-white rounded border">
              <span className="text-gray-500">Base Income (from doc)</span>
              <div className="text-lg font-semibold text-gray-900">RM {baseIncomeFromDoc.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-white rounded border">
              <span className="text-gray-500">Other + Bonus (manual)</span>
              <div className="text-lg font-semibold text-gray-900">RM {otherPlusBonusManual.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-white rounded border">
              <span className="text-gray-500">Allowable Expenses Total</span>
              <div className="text-lg font-semibold text-gray-900">RM {allowedExpensesRender.toLocaleString()}</div>
              <div className="mt-2 text-xs text-gray-600 space-y-1">
                <div>Spouse Relief: RM {spouseReliefRender.toLocaleString()}</div>
                <div>Children Relief: RM {childReliefRender.toLocaleString()}</div>
                <div>Parents’ Support: RM {parentsSupportRender.toLocaleString()}</div>
                <div>Education: RM {educationExpensesRender.toLocaleString()}</div>
                <div>Medical: RM {medicalExpensesRender.toLocaleString()}</div>
                <div>Tabung Haji: RM {tabungHajiRender.toLocaleString()}</div>
                <div>EPF (KWSP): RM {epfContributionRender.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={prevStep}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg bg-[#a62b45] text-white hover:bg-[#8b233b] disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ReviewInformationStep;
