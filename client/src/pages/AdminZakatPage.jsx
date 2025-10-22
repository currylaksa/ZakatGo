import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, HalfCircleBackground } from '../components';

const AdminZakatPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Admin auth guard: restrict access to admin only
  useEffect(() => {
    const isAdminAuthed = localStorage.getItem('isAdminAuthed') === 'true';
    if (!isAdminAuthed) {
      navigate('/login?redirect=/admin/zakat');
    }
  }, []);

  // Dummy zakat list data
  const dummyZakatList = [
    {
      id: 1,
      referenceNo: 'ZG-2025-0001',
      contributionType: 'Monthly Zakat Deduction',
      contributionAmount: 2500.0,
      status: 'Completed',
      date: '2025-04-20',
      transactionHash: '0xdeadbeef00000000000000000000000000000000000000000000000000000001',
      details: {
        contributionDetailsTitle: 'Zakat Contribution Details',
        payerAcknowledgement:
          'I acknowledge that I have assessed Zakat on income according to actual calculations and accept my obligation to fulfill Zakat on income.',
        contributionMethod: 'Monthly Zakat Deduction',
        contributionAmount: 2500.0,
        monthlyContributionAmount: 208.33,
        zakatAffirmation:
          'I agree my salary will be deducted starting November by RM50.00 monthly to fulfill the obligatory zakat on my wealth for the next year for the sake of Allah Almighty.',
      },
    },
    {
      id: 2,
      referenceNo: 'ZG-2025-0002',
      contributionType: 'Monthly Zakat Deduction',
      contributionAmount: 1800.0,
      status: 'Uploaded',
      date: '2025-04-21',
      transactionHash: '0xdeadbeef00000000000000000000000000000000000000000000000000000002',
      details: {
        contributionDetailsTitle: 'Zakat Contribution Details',
        payerAcknowledgement:
          'I acknowledge that I have assessed Zakat on income according to actual calculations and accept my obligation to fulfill Zakat on income.',
        contributionMethod: 'Monthly Zakat Deduction',
        contributionAmount: 1800.0,
        monthlyContributionAmount: 150.0,
        zakatAffirmation:
          'I agree my salary will be deducted starting November by RM50.00 monthly to fulfill the obligatory zakat on my wealth for the next year for the sake of Allah Almighty.',
      },
    },
    {
      id: 3,
      referenceNo: 'ZG-2025-0003',
      contributionType: 'One-time Zakat Payment',
      contributionAmount: 500.0,
      status: 'Cancelled',
      date: '2025-04-22',
      transactionHash: '0xdeadbeef00000000000000000000000000000000000000000000000000000003',
      details: {
        contributionDetailsTitle: 'Zakat Contribution Details',
        payerAcknowledgement:
          'I acknowledge that I have assessed Zakat on income according to actual calculations and accept my obligation to fulfill Zakat on income.',
        contributionMethod: 'One-time Payment',
        contributionAmount: 500.0,
        monthlyContributionAmount: 0.0,
        zakatAffirmation:
          'I agree my salary will be deducted starting November by RM50.00 monthly to fulfill the obligatory zakat on my wealth for the next year for the sake of Allah Almighty.',
      },
    },
    {
      id: 4,
      referenceNo: 'ZG-2025-0004',
      contributionType: 'Monthly Zakat Deduction',
      contributionAmount: 3000.0,
      status: 'Completed',
      date: '2025-04-23',
      transactionHash: '0xdeadbeef00000000000000000000000000000000000000000000000000000004',
      details: {
        contributionDetailsTitle: 'Zakat Contribution Details',
        payerAcknowledgement:
          'I acknowledge that I have assessed Zakat on income according to actual calculations and accept my obligation to fulfill Zakat on income.',
        contributionMethod: 'Monthly Zakat Deduction',
        contributionAmount: 3000.0,
        monthlyContributionAmount: 250.0,
        zakatAffirmation:
          'I agree my salary will be deducted starting November by RM50.00 monthly to fulfill the obligatory zakat on my wealth for the next year for the sake of Allah Almighty.',
      },
    },
  ];

  // Use state for list so approvals/cancellations reflect in table
  const [zakatList, setZakatList] = useState(dummyZakatList);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return zakatList;
    return zakatList.filter((row) =>
      String(row.id).includes(q) ||
      row.referenceNo.toLowerCase().includes(q) ||
      row.contributionType.toLowerCase().includes(q) ||
      String(row.contributionAmount).toLowerCase().includes(q) ||
      row.status.toLowerCase().includes(q) ||
      row.date.toLowerCase().includes(q) ||
      (row.transactionHash || '').toLowerCase().includes(q)
    );
  }, [search, zakatList]);

  const onRowClick = (row) => {
    setSelectedRow(row);
    setShowDetails(true);
  };

  const onCloseDetails = () => {
    setShowDetails(false);
    setSelectedRow(null);
  };

  const onApprove = () => {
    if (!selectedRow) return;
    setZakatList((prev) => prev.map((r) => r.id === selectedRow.id ? { ...r, status: 'Completed' } : r));
    setSelectedRow((prev) => prev ? { ...prev, status: 'Completed' } : prev);
  };

  const onCancel = () => {
    if (!selectedRow) return;
    setZakatList((prev) => prev.map((r) => r.id === selectedRow.id ? { ...r, status: 'Cancelled' } : r));
    setSelectedRow((prev) => prev ? { ...prev, status: 'Cancelled' } : prev);
  };
  const onPrint = () => {
    window.print();
  };

  return (
    <HalfCircleBackground title="Admin • Zakat Management" bgClassName="bg-stone-50" titleClassName="text-xl font-bold text-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
            <Link to="/" className="hover:underline">Home</Link>
            <span className="text-stone-400">/</span>
            <span className="font-medium">Admin • Zakat</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by no., reference, type, status, date"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72 px-3 py-2 text-sm rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-stone-100 text-stone-700">
                  <th className="px-4 py-3 text-left font-semibold">No.</th>
                  <th className="px-4 py-3 text-left font-semibold">Reference No</th>
                  <th className="px-4 py-3 text-left font-semibold">Contribution Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Contribution Amount (RM)</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Transaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-stone-50 cursor-pointer"
                    onClick={() => onRowClick(row)}
                  >
                    <td className="px-4 py-3">{row.id}</td>
                    <td className="px-4 py-3 font-mono">{row.referenceNo}</td>
                    <td className="px-4 py-3">{row.contributionType}</td>
                    <td className="px-4 py-3">{row.contributionAmount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${row.status === 'Completed' ? 'bg-green-100 text-green-800' : row.status === 'Uploaded' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}> 
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{row.date}</td>
                    <td className="px-4 py-3">
                      {row.transactionHash ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{`${row.transactionHash.slice(0, 6)}...${row.transactionHash.slice(-4)}`}</span>
                          <a href={`https://saturn-explorer.swanchain.io/tx/${row.transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-xs">Explorer</a>
                        </div>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showDetails && selectedRow && (
          <div className="fixed inset-0 bg-white/90 dark:bg-white/90 flex items-center justify-center z-50" role="dialog" aria-modal="true">
            <div className="bg-white rounded-xl shadow-lg border border-stone-200 w-full max-w-2xl">
              <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-stone-900">{selectedRow.details.contributionDetailsTitle}</h3>
                  <p className="text-xs text-stone-600">Reference: {selectedRow.referenceNo}</p>
                </div>
                <button onClick={onCloseDetails} className="text-stone-500 hover:text-stone-800" aria-label="Close">
                  ✕
                </button>
              </div>

              <div className="px-5 py-4 space-y-4">
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-sm text-stone-700">
                    <span className="font-medium">Payer Acknowledgement:</span> {selectedRow.details.payerAcknowledgement}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-stone-50 rounded-lg p-3">
                    <p className="text-xs text-stone-500">Contribution Method</p>
                    <p className="text-sm font-medium text-stone-900">{selectedRow.details.contributionMethod}</p>
                  </div>
                  <div className="bg-stone-50 rounded-lg p-3">
                    <p className="text-xs text-stone-500">Contribution Amount</p>
                    <p className="text-sm font-medium text-stone-900">RM {selectedRow.details.contributionAmount.toFixed(2)}</p>
                  </div>
                  <div className="bg-stone-50 rounded-lg p-3">
                    <p className="text-xs text-stone-500">Monthly Contribution Amount</p>
                    <p className="text-sm font-medium text-stone-900">RM {selectedRow.details.monthlyContributionAmount.toFixed(2)}</p>
                  </div>
                  <div className="bg-stone-50 rounded-lg p-3 sm:col-span-2">
                    <p className="text-xs text-stone-500">Zakat Payment Affirmation</p>
                    <p className="text-sm font-medium text-stone-900">{selectedRow.details.zakatAffirmation}</p>
                  </div>
                  <div className="bg-stone-50 rounded-lg p-3 sm:col-span-2">
                    <p className="text-xs text-stone-500">Transaction</p>
                    {selectedRow.transactionHash ? (
                      <a href={`https://saturn-explorer.swanchain.io/tx/${selectedRow.transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-blue-600 hover:underline">
                        {`${selectedRow.transactionHash.slice(0, 10)}...${selectedRow.transactionHash.slice(-6)}`}
                      </a>
                    ) : (
                      <p className="text-sm text-stone-500">No transaction</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-stone-200 flex items-center justify-between">
                <div className="text-xs text-stone-700">Status: <span className={`font-semibold ${selectedRow.status === 'Completed' ? 'text-green-800' : selectedRow.status === 'Uploaded' ? 'text-amber-800' : 'text-red-800'}`}>{selectedRow.status}</span></div>
                <div className="flex gap-2">
                  {selectedRow.status === 'Uploaded' && (
                    <>
                      <Button variant="success" size="sm" onClick={onApprove}>Approve</Button>
                      <Button variant="danger" size="sm" onClick={onCancel}>Cancel</Button>
                    </>
                  )}
                  <Button variant="secondary" size="sm" onClick={onCloseDetails}>Exit</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </HalfCircleBackground>
  );
};

export default AdminZakatPage;