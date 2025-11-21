
import { QRCodeSVG } from 'qrcode.react';
import { useEffect } from 'react';

const PaymentConfirmation = ({ userData }) => {
  const { transactionDetails = {}, selectedCategories = [] } = userData; // Default values
  const {
      transactionId = 'N/A',
      amount = 0, // RM amount
      ethAmount = 0, // ETH amount
      rmToEthRate = 0,
      timestamp = new Date().toISOString(), // Use current time if timestamp missing
      status = 'Unknown',
      categories = '' // Use stored category names if available
  } = transactionDetails;

  // Fallback if category names weren't stored in transactionDetails
   const categoryNames = categories || selectedCategories.map(category => category.name).join(', ');

  // Details from Review Information step
  const name = (userData?.personalInfo?.name || userData?.documentData?.name || 'N/A');
  const baseIncome = Number(userData?.documentData?.annualIncome || 0);
  const bonusFromDoc = Number(userData?.documentData?.bonus || 0);
  const manualDetails = userData?.manualDetails || {};
  const otherIncome = Number(manualDetails?.otherIncome || 0);
  const bonusManual = Number(manualDetails?.bonusManual || 0);
  const exp = manualDetails?.expensesBreakdown || {};
  const personalRelief = Number(exp?.personalRelief || 0);
  const spouseCount = Number(exp?.spouseCount || 0);
  const spouseRelief = Number(exp?.spouseRelief || 0);
  const childCount = Number(exp?.childCount || 0);
  const childRelief = Number(exp?.childRelief || 0);
  const parentsSupport = Number(exp?.parentsSupport || 0);
  const educationExpenses = Number(exp?.educationExpenses || 0);
  const medicalExpenses = Number(exp?.medicalExpenses || 0);
  const tabungHaji = Number(exp?.tabungHaji || 0);
  const epfContribution = Number(exp?.epfContribution || 0);

  const grossIncome = Number(userData?.calculation?.grossIncome || 0);
  const allowedExpenses = Number(userData?.calculation?.allowedExpenses || 0);
  const netZakatableIncome = Number(userData?.calculation?.netZakatableIncome || Math.max(0, grossIncome - allowedExpenses));
  const nisabValue = Number(userData?.calculation?.nisabRM || 0);
  const isWajib = Boolean(userData?.calculation?.isWajib || (netZakatableIncome >= nisabValue));
  const zakatAnnual = Number(userData?.calculation?.zakatAnnual || (isWajib ? netZakatableIncome * 0.025 : 0));
  const zakatMonthly = Number(userData?.calculation?.zakatMonthly || (zakatAnnual / 12));

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const explorerUrl = `${origin}/zakat/explorer/${encodeURIComponent(transactionId)}?status=${encodeURIComponent(status)}`;

  // Persist explorer data for the new page to hydrate from session
  useEffect(() => {
    try {
      const payload = {
        transactionDetails: { ...transactionDetails, status },
        blockchainMetadata: { ...(userData?.blockchainMetadata || {}), status }
      };
      sessionStorage.setItem('zakatExplorerData', JSON.stringify(payload));

      // Persist a standardized admin record so AdminZakatPage reflects the same data
      const d = new Date(timestamp);
      const dateStr = d.toISOString().slice(0, 10);
      const refSuffix = `${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
      const referenceNo = `ZKT-${String(d.getFullYear()).slice(-2)}-${refSuffix}-U001`;

      const adminRow = {
        id: 1,
        referenceNo,
        contributionType: 'Monthly Zakat Deduction',
        contributionAmount: Number(amount) || 0,
        status: 'Sent',
        date: dateStr,
        transactionHash: transactionId,
        user: {
          name,
          faculty: userData?.personalInfo?.faculty || userData?.documentData?.faculty || '—',
          phone: userData?.personalInfo?.phone || '—',
          email: userData?.personalInfo?.email || '—',
          userId: userData?.personalInfo?.userId || userData?.documentData?.icPassport || '—',
        },
        details: {
          contributionDetailsTitle: 'Zakat Contribution Details',
          payerAcknowledgement:
            'I acknowledge that I have assessed Zakat on income according to actual calculations and accept my obligation to fulfill Zakat on income.',
          contributionMethod: 'Monthly Zakat Deduction',
          contributionAmount: Number(amount) || 0,
          monthlyContributionAmount: Number(zakatMonthly) || 0,
          zakatAffirmation:
            'I agree my salary will be deducted monthly to fulfill the obligatory zakat on my wealth for the next year for the sake of Allah Almighty.',
        },
      };

      sessionStorage.setItem('adminLatestZakatRow', JSON.stringify(adminRow));
    } catch (_) {
      // no-op if storage fails
    }
  }, [transactionDetails, userData?.blockchainMetadata]);

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold text-green-700">Payment Confirmation</h2>

      {/* Review Details Summary */}
      <div className="p-6 md:p-8 border border-gray-200 bg-white rounded-lg shadow-sm space-y-4 max-w-3xl mx-auto text-left">
        <h3 className="text-lg font-semibold text-gray-800">Review Details Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <p><span className="text-gray-600">Name:</span> <span className="text-gray-800">{name}</span></p>
          <p><span className="text-gray-600">Base Income (doc):</span> <span className="text-gray-800">RM {baseIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          <p><span className="text-gray-600">Bonus (doc):</span> <span className="text-gray-800">RM {bonusFromDoc.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          <p><span className="text-gray-600">Other Income (manual):</span> <span className="text-gray-800">RM {otherIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          <p><span className="text-gray-600">Bonus (manual):</span> <span className="text-gray-800">RM {bonusManual.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          <p><span className="text-gray-600">Gross Income (Base + Bonus + Other):</span> <span className="text-gray-800">RM {grossIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          <p><span className="text-gray-600">Allowable Expenses (Total):</span> <span className="text-gray-800">RM {allowedExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          <p><span className="text-gray-600">Net Zakatable Income:</span> <span className="text-gray-800">RM {netZakatableIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          <p><span className="text-gray-600">Nisab Value:</span> <span className="text-gray-800">RM {nisabValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          <p><span className="text-gray-600">Obligation Status:</span> <span className="text-gray-800">{isWajib ? 'Wajib (≥ Nisab)' : 'Not Wajib (< Nisab)'}</span></p>
          <p><span className="text-gray-600">Annual Zakat (2.5%):</span> <span className="text-gray-800">RM {zakatAnnual.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          <p><span className="text-gray-600">Monthly Zakat:</span> <span className="text-gray-800">RM {zakatMonthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-100 text-xs text-gray-700">
          <p className="font-medium mb-2">Expenses Breakdown</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p>Personal Relief: RM {personalRelief.toLocaleString()}</p>
            <p>Spouse Count: {spouseCount} (Relief RM {spouseRelief.toLocaleString()})</p>
            <p>Children Count: {childCount} (Relief RM {childRelief.toLocaleString()})</p>
            <p>Parents’ Support: RM {parentsSupport.toLocaleString()}</p>
            <p>Education Expenses: RM {educationExpenses.toLocaleString()}</p>
            <p>Medical Expenses: RM {medicalExpenses.toLocaleString()}</p>
            <p>Tabung Haji: RM {tabungHaji.toLocaleString()}</p>
            <p>EPF (KWSP): RM {epfContribution.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Blockchain Explorer QR */}
      <div className="p-6 md:p-8 border border-green-200 bg-green-50 rounded-lg shadow-sm space-y-3 max-w-lg mx-auto">
        <h3 className="text-lg font-semibold text-gray-800">Blockchain Explorer</h3>
        <div className="flex justify-center">
          <QRCodeSVG value={explorerUrl} size={128} />
        </div>
        <p className="text-sm text-gray-600">Scan to open explorer or click the link:</p>
        <a href={explorerUrl} className="text-green-700 hover:text-green-800 underline break-all">{explorerUrl}</a>
      </div>

      {/* Transaction Details (retained) */}
      <div className="p-6 md:p-8 border border-green-200 bg-green-50 rounded-lg shadow-sm space-y-4 max-w-lg mx-auto">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
           <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
         </svg>

        <h3 className="text-xl font-semibold text-gray-800">Thank you for your contribution!</h3>
        <p className="text-gray-600">Your Zakat/donation payment has been processed successfully.</p>

        <div className="pt-4 border-t border-green-100 text-left space-y-2 text-sm">
          <h4 className="text-base font-medium text-gray-700 mb-2">Receipt Details:</h4>
          <p><strong className="text-gray-600">Transaction ID:</strong> <span className="text-gray-800 break-all">{transactionId}</span></p>
          <p><strong className="text-gray-600">Amount Donated:</strong> <span className="text-gray-800 font-semibold">RM {Number(amount).toFixed(6)}</span></p>
          <p><strong className="text-gray-600">Equivalent ETH:</strong> <span className="text-gray-800">{Number(ethAmount).toFixed(8)} ETH</span></p>
          {rmToEthRate > 0 && <p><strong className="text-gray-600">Rate Used:</strong> <span className="text-gray-800">1 RM ≈ {rmToEthRate.toPrecision(4)} ETH</span></p>}
          <p><strong className="text-gray-600">Date & Time:</strong> <span className="text-gray-800">{new Date(timestamp).toLocaleString()}</span></p>
          <p><strong className="text-gray-600">Status:</strong> <span className="font-medium text-green-600">{status}</span></p>
        </div>

        {categoryNames && (
            <div className="pt-4 border-t border-green-100 text-left space-y-2 text-sm">
              <h4 className="text-base font-medium text-gray-700 mb-2">Your donation will support:</h4>
               <p className="text-gray-800">{categoryNames}</p>
            </div>
        )}

        <div className="pt-6 text-center space-y-2">
           <p className="text-xs text-gray-500">A confirmation has been simulated. In a real application, this would be sent via email.</p>
          <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                  onClick={() => window.location.reload()}
          >
            Make Another Donation
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
