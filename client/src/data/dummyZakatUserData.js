const dummyUserData = {
  personalInfo: { name: 'Ali bin Ahmad', salary: '', deductions: '', assets: '' },
  userIDHash: '0x' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
  taxDataHash: '0x' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
  documentData: { name: 'Ali bin Ahmad', annualIncome: 60000, bonus: 5000, salary: '', deductions: '', assets: '' },
  manualDetails: {
    otherIncome: 2000,
    bonusManual: 0,
    expensesBreakdown: {
      personalRelief: 9000,
      spouseCount: 1,
      spouseRelief: 4000,
      childCount: 2,
      childRelief: 4000,
      parentsSupport: 1000,
      educationExpenses: 2500,
      medicalExpenses: 3000,
      tabungHaji: 0,
      epfContribution: 10000
    },
  },
  calculation: {
    grossIncome: 67000, // 60000 base + 5000 bonus + 2000 other
    allowedExpenses: 25000,
    netZakatableIncome: 42000,
    nisabRM: 15000,
    isWajib: true,
    zakatAnnual: 1050, // 2.5% of 42000
    zakatMonthly: 87.5,
  },
  zakatAmount: 0,
  selectedCategories: [
    { name: 'Poor & Needy' },
    { name: 'Education' }
  ],
  transactionDetails: {}
};

export default dummyUserData;