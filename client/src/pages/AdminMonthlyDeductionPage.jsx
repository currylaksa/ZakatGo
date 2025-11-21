import { useEffect, useMemo, useState } from 'react';

const dummyUsers = [
  { id: 'U1001', name: 'Nurul Aisyah', email: 'nurul.aisyah@example.com', hasUploaded: true, monthlyIncome: 5200, walletAddress: '0x1234...ABCD' },
  { id: 'U1002', name: 'Muhammad Iqbal', email: 'iqbal@example.com', hasUploaded: true, monthlyIncome: 6800, walletAddress: '0x7890...DEFG' },
  { id: 'U1003', name: 'Siti Sarah', email: 'sarah@example.com', hasUploaded: false, monthlyIncome: 4300, walletAddress: '0x2468...LMNO' },
];

const AdminMonthlyDeductionPage = () => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [autoPay, setAutoPay] = useState(true);
  const [consent, setConsent] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const usersWithUploads = useMemo(() => dummyUsers.filter(u => u.hasUploaded), []);
  const selectedUser = useMemo(() => usersWithUploads.find(u => u.id === selectedUserId) || null, [usersWithUploads, selectedUserId]);

  useEffect(() => {
    // Default to first user with uploads
    if (usersWithUploads.length && !selectedUserId) {
      setSelectedUserId(usersWithUploads[0].id);
    }
  }, [usersWithUploads, selectedUserId]);

  const handleSave = () => {
    if (!selectedUser) {
      setStatusMessage('Please select a user.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setStatusMessage('Please enter a valid monthly amount.');
      return;
    }
    if (!startMonth) {
      setStatusMessage('Please select a start month.');
      return;
    }
    if (!consent) {
      setStatusMessage('Please confirm consent for monthly deduction.');
      return;
    }

    const config = {
      userId: selectedUser.id,
      name: selectedUser.name,
      email: selectedUser.email,
      walletAddress: selectedUser.walletAddress,
      amount: Number(amount),
      startMonth,
      frequency: 'monthly',
      autoPay,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('monthlyDeductionConfigs') || '[]');
      const updated = [config, ...existing];
      localStorage.setItem('monthlyDeductionConfigs', JSON.stringify(updated));
      setStatusMessage('Monthly deduction has been configured successfully.');
    } catch (e) {
      setStatusMessage('Failed to save configuration.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h1 className="text-2xl md:text-3xl font-bold text-[#5f0220] mb-2">Monthly Zakat Deduction</h1>
          <p className="text-gray-600">Configure monthly deductions for users who uploaded zakat info</p>
        </div>

        {/* Selection & Details */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Select User</label>
              <select
                className="w-full mt-1 border border-gray-300 rounded-lg p-2"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                {usersWithUploads.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
                ))}
              </select>

              {selectedUser && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-500">User Details</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Name</span>
                      <p className="font-medium">{selectedUser.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email</span>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Monthly Income</span>
                      <p className="font-medium">RM {selectedUser.monthlyIncome.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Wallet</span>
                      <p className="font-medium">{selectedUser.walletAddress}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Config Form */}
            <div>
              <label className="text-sm text-gray-600">Monthly Deduction Amount (RM)</label>
              <input
                type="number"
                min="0"
                className="w-full mt-1 border border-gray-300 rounded-lg p-2"
                placeholder="e.g. 150"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <label className="text-sm text-gray-600 mt-4 block">Start Month</label>
              <input
                type="month"
                className="w-full mt-1 border border-gray-300 rounded-lg p-2"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
              />

              <div className="mt-4 flex items-center gap-2">
                <input
                  id="autopay"
                  type="checkbox"
                  checked={autoPay}
                  onChange={(e) => setAutoPay(e.target.checked)}
                />
                <label htmlFor="autopay" className="text-sm text-gray-700">Enable Auto-Pay</label>
              </div>

              <div className="mt-2 text-xs text-gray-500">Auto-pay will generate monthly payment instructions with blockchain verification.</div>

              <div className="mt-4 flex items-center gap-2">
                <input
                  id="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <label htmlFor="consent" className="text-sm text-gray-700">I confirm the user has consented to monthly deduction</label>
              </div>

              <button
                onClick={handleSave}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
              >
                Save Configuration
              </button>

              {statusMessage && (
                <div className="mt-3 text-sm text-[#5f0220]">{statusMessage}</div>
              )}
            </div>
          </div>
        </div>

        {/* Previous Configurations */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200 mt-6">
          <h2 className="text-lg font-semibold mb-3 text-[#5f0220]">Recent Configurations</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-3 py-2">User</th>
                  <th className="text-left px-3 py-2">Amount (RM)</th>
                  <th className="text-left px-3 py-2">Start</th>
                  <th className="text-left px-3 py-2">Auto-Pay</th>
                  <th className="text-left px-3 py-2">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(() => {
                  try {
                    const items = JSON.parse(localStorage.getItem('monthlyDeductionConfigs') || '[]');
                    return items.map((cfg, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2">{cfg.name} ({cfg.userId})</td>
                        <td className="px-3 py-2">RM {cfg.amount}</td>
                        <td className="px-3 py-2">{cfg.startMonth}</td>
                        <td className="px-3 py-2">{cfg.autoPay ? 'Yes' : 'No'}</td>
                        <td className="px-3 py-2">{new Date(cfg.createdAt).toLocaleString()}</td>
                      </tr>
                    ));
                  } catch {
                    return (
                      <tr>
                        <td className="px-3 py-2" colSpan={5}>No records available</td>
                      </tr>
                    );
                  }
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMonthlyDeductionPage;