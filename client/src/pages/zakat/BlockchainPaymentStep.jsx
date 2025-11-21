import { useState, useEffect, useContext } from 'react';
import { TransactionContext } from '../../context/TransactionContext';
// import { savePayslipAfterPayment } from '../../services/payslipService';

const BlockchainPaymentStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  const initialDepositAmount = 0; // Force 0 ETH flow
  const [depositAmount, setDepositAmount] = useState(initialDepositAmount);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const rmToEthRate = 0; // No ETH conversion; ETH is 0
  const [ethAmount, setEthAmount] = useState(0);
  const { 
    currentAccount, 
    connectWallet, 
    sendTransaction, 
    isLoading, 
    handleChange,
    getZakatTransactions,
    recordZakatMetadata,
  } = useContext(TransactionContext);
  const [saveStatus, setSaveStatus] = useState(''); // Add a state for save status

  // Helper to hex encode ArrayBuffer
  const toHex = (buffer) => '0x' + Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');

  // Helper to generate a dummy 64-char hex string
  const randomHex64 = () => '0x' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

  useEffect(() => {
     const amount = 0;
     setError('');
     setEthAmount(0);
  }, []);

  useEffect(() => {
    setDepositAmount(0);
  }, [userData.zakatAmount]);

  useEffect(() => {
    handleChange({ target: { value: import.meta.env.VITE_RECEIVER_ADDRESS }}, 'addressTo');
    handleChange({ target: { value: '0' }}, 'amount');
    handleChange({ target: { value: 'ZAKAT_METADATA' }}, 'keyword');
    handleChange({ target: { value: `Store Zakat metadata for categories: ${userData.selectedCategories.map(c => c.name).join(', ')}` }}, 'message');
  }, []);

  // Seed dummy hashes for display if not present yet
  useEffect(() => {
    try {
      if (!userData?.userIDHash || !userData?.taxDataHash) {
        const dummyUserIDHash = randomHex64();
        const dummyTaxDataHash = randomHex64();
        updateUserData({
          userIDHash: userData?.userIDHash || dummyUserIDHash,
          taxDataHash: userData?.taxDataHash || dummyTaxDataHash,
        });
      }
    } catch (e) {
      console.warn('Failed to seed dummy hashes for Store Details page', e);
    }
  }, []);

  const processPayment = async () => {
    try {
      setError('');
      setIsProcessing(true);

      // Compute summary values from userData
      const grossIncome = Number(userData?.calculation?.grossIncome || 0);
      const allowedExpenses = Number(userData?.calculation?.allowedExpenses || 0);
      const netZakatableIncome = Number(userData?.calculation?.netZakatableIncome || Math.max(0, grossIncome - allowedExpenses));
      const nisabValue = Number(userData?.calculation?.nisabRM || 0);
      const isWajib = Boolean(userData?.calculation?.isWajib || (netZakatableIncome >= nisabValue));
      const zakatAnnual = Number(userData?.calculation?.zakatAnnual || (isWajib ? netZakatableIncome * 0.025 : 0));
      const zakatMonthly = Number(userData?.calculation?.zakatMonthly || (zakatAnnual / 12));
      const zakatCategory = 'Income Zakat';
      const timestamp = new Date().toISOString();

      const displayName = (userData?.personalInfo?.name || userData?.documentData?.name || 'Ali bin Ahmad').trim();
      const faculty = (userData?.personalInfo?.faculty || 'Computing');
      let userIDHash = '0x';
      let taxDataHash = '0x';
      try {
        const enc = new TextEncoder();
        const idBuffer = await crypto.subtle.digest('SHA-256', enc.encode(displayName || 'anonymous'));
        userIDHash = '0x' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');// toHex(idBuffer);
        const taxPayload = JSON.stringify({ name: displayName, faculty, grossIncome, allowedExpenses, netZakatableIncome, nisabValue });
        const taxBuffer = await crypto.subtle.digest('SHA-256', enc.encode(taxPayload));
        taxDataHash = toHex(taxBuffer);
      } catch (e) {
        console.warn('Hashing failed, using placeholder values.', e);
        userIDHash = '0x' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        taxDataHash = '0x' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      }

      const metadata = {
        userIDHash,
        taxDataHash, // stored in Firebase
        timestamp,
        grossIncome,
        allowedExpenses,
        netZakatableIncome,
        nisabValue,
        isWajib,
        zakatAnnual,
        zakatMonthly,
        zakatCategory,
        status: 'Sent',
        name: displayName,
        faculty,
      };

      // Store metadata to Firebase via context (private network simulation)
      let docId = null;
      try {
        setSaveStatus('Uploading metadata to private network...');
        docId = await recordZakatMetadata(metadata);
        setSaveStatus('Metadata uploaded successfully!');
      } catch (firestoreError) {
        console.error('Error saving metadata to Firestore:', firestoreError);
        setSaveStatus('Warning: Upload attempted but could not be saved.');
      }

      const transactionDetails = {
        transactionId: docId || ('0x' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')),
        amount: 0,
        ethAmount: '0',
        rmToEthRate: 0,
        timestamp,
        status: 'Sent',
        categories: userData.selectedCategories.map(c => c.name).join(', '),
        walletAddress: currentAccount || null,
        zakatAnnual: zakatAnnual,
      };

      updateUserData({ transactionDetails, blockchainMetadata: metadata });

      // Persist explorer payload and a standardized admin record immediately upon store
      try {
        const payload = {
          transactionDetails: { ...transactionDetails },
          blockchainMetadata: { ...metadata }
        };
        sessionStorage.setItem('zakatExplorerData', JSON.stringify(payload));

        const d = new Date(timestamp);
        const dateStr = d.toISOString().slice(0, 10);
        const refSuffix = `${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
        const referenceNo = `ZKT-${String(d.getFullYear()).slice(-2)}-${refSuffix}-U001`;

        const adminRow = {
          id: 1,
          referenceNo,
          contributionType: 'Monthly Zakat Deduction',
          contributionAmount: Number(transactionDetails.amount) || 0,
          status: 'Sent',
          date: dateStr,
          transactionHash: transactionDetails.transactionId,
          user: {
            name: (userData?.personalInfo?.name || userData?.documentData?.name || 'N/A'),
            faculty: (userData?.personalInfo?.faculty || userData?.documentData?.faculty || '—'),
            phone: (userData?.personalInfo?.phone || '—'),
            email: (userData?.personalInfo?.email || '—'),
            userId: (userData?.personalInfo?.userId || userData?.documentData?.icPassport || '—'),
          },
          details: {
            contributionDetailsTitle: 'Zakat Contribution Details',
            payerAcknowledgement:
              'I acknowledge that I have assessed Zakat on income according to actual calculations and accept my obligation to fulfill Zakat on income.',
            contributionMethod: 'Monthly Zakat Deduction',
            contributionAmount: Number(transactionDetails.amount) || 0,
            monthlyContributionAmount: Number(userData?.calculation?.zakatMonthly || 0) || 0,
            zakatAffirmation:
              'I agree my salary will be deducted monthly to fulfill the obligatory zakat on my wealth for the next year for the sake of Allah Almighty.',
          },
        };

        sessionStorage.setItem('adminLatestZakatRow', JSON.stringify(adminRow));
      } catch (e) {
        console.warn('BlockchainPaymentStep: failed to persist explorer/admin row to sessionStorage', e);
      }

      // Refresh any on-chain views (optional; no ETH sent)
      try { await getZakatTransactions(); } catch (e) { /* no-op in store-only mode */ }

      nextStep();
    } catch (error) {
      console.error('Store details error:', error);
      setError('Upload failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Step 5: Store Details</h2>

      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-5">
        <h3 className="text-lg font-medium text-gray-800">Blockchain Metadata Summary</h3>

        <div className="p-4 bg-gray-50 rounded border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p><span className="text-gray-600">name:</span> <span className="text-gray-800">{(userData?.personalInfo?.name || userData?.documentData?.name || 'Ali bin Ahmad')}</span></p>
            <p><span className="text-gray-600">faculty:</span> <span className="text-gray-800">{(userData?.personalInfo?.faculty || 'Computing')}</span></p>
            <p><span className="text-gray-600">userIDHash:</span> <span className="text-gray-800 break-all">{userData?.userIDHash}</span></p>
            <p><span className="text-gray-600">taxDataHash:</span> <span className="text-gray-800 break-all">{userData?.taxDataHash}</span></p>
            <p><span className="text-gray-600">timestamp:</span> <span className="text-gray-800">{new Date().toISOString()}</span></p>
            <p><span className="text-gray-600">grossIncome:</span> <span className="text-gray-800">{Number(userData?.calculation?.grossIncome || 0).toFixed(2)}</span></p>
            <p><span className="text-gray-600">allowedExpenses:</span> <span className="text-gray-800">{Number(userData?.calculation?.allowedExpenses || 0).toFixed(2)}</span></p>
            <p><span className="text-gray-600">netZakatableIncome:</span> <span className="text-gray-800">{Number(userData?.calculation?.netZakatableIncome || Math.max(0, Number(userData?.calculation?.grossIncome || 0) - Number(userData?.calculation?.allowedExpenses || 0))).toFixed(2)}</span></p>
            <p><span className="text-gray-600">nisabValue:</span> <span className="text-gray-800">{Number(userData?.calculation?.nisabRM || 0).toFixed(2)}</span></p>
            <p><span className="text-gray-600">isWajib:</span> <span className="text-gray-800">{String(Boolean(userData?.calculation?.isWajib || (Number(userData?.calculation?.netZakatableIncome || 0) >= Number(userData?.calculation?.nisabRM || 0))))}</span></p>
            <p><span className="text-gray-600">zakatAnnual:</span> <span className="text-gray-800">{Number(userData?.calculation?.zakatAnnual || 0).toFixed(2)}</span></p>
            <p><span className="text-gray-600">zakatMonthly:</span> <span className="text-gray-800">{Number(userData?.calculation?.zakatMonthly || 0).toFixed(2)}</span></p>
            <p><span className="text-gray-600">zakatCategory:</span> <span className="text-gray-800">Income Zakat</span></p>
            <p><span className="text-gray-600">status:</span> <span className="text-gray-800">Sent</span></p>
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded border border-green-200">
          <p className="text-sm text-gray-800">
            I agree for my salary to be deducted starting from November by RM{Number(userData?.calculation?.zakatMonthly || 0).toFixed(2)} per month to fulfill my obligatory zakat payment for the upcoming year, sincerely for the sake of Allah Ta’ala.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          disabled={isProcessing || isLoading}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={processPayment}
          disabled={isProcessing || isLoading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center justify-center"
        >
          {isProcessing || isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading Metadata...
            </>
          ) : (
            'Confirm & Store'
          )}
        </button>
      </div>
      {saveStatus && (
        <div className={`text-sm text-center mt-2 ${
          saveStatus.includes('Warning') ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {saveStatus}
        </div>
      )}
    </div>
  );
};

export default BlockchainPaymentStep;
