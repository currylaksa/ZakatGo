import { useEffect, useMemo, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HalfCircleBackground } from '../../components';
import { TransactionContext } from '../../context/TransactionContext';

const hex = '0123456789abcdef';
const generateTxId = () => {
  let s = '0x';
  for (let i = 0; i < 64; i++) s += hex[Math.floor(Math.random() * hex.length)];
  return s;
};

const formatDate = (date) => {
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${mm}-${dd}-${yyyy} ${hh}:${min}:${ss}`;
};

const timeAgoSeconds = (date) => {
  const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  return `${secs} secs ago`;
};

const ZakatContractOverview = () => {
  const { address } = useParams();
  const { zakatTransactions, getZakatTransactions } = useContext(TransactionContext);
  const [tableRows, setTableRows] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getZakatTransactions?.();
  }, [getZakatTransactions]);

  useEffect(() => {
    // Build rows from session storage standardized admin record, optionally add a 'Completed' mirror if status updated by admin
    let uploadedSource = [];
    try {
      const raw = sessionStorage.getItem('adminLatestZakatRow');
      if (raw) {
        const latest = JSON.parse(raw);
        if (latest && latest.transactionHash) {
          uploadedSource.push({
            addressFrom: latest.user?.userId || '0xUSER',
            addressTo: address,
            amount: String(latest.contributionAmount || 0),
            timestamp: new Date(`${latest.date}T00:00:00Z`).toISOString(),
            keyword: 'zakat',
            transactionHash: latest.transactionHash,
            status: 'Sent',
          });
          if (latest.status === 'Completed') {
            uploadedSource.push({
              addressFrom: latest.user?.userId || '0xUSER',
              addressTo: address,
              amount: String(latest.contributionAmount || 0),
              timestamp: new Date(`${latest.date}T00:00:00Z`).toISOString(),
              keyword: 'zakat',
              transactionHash: latest.transactionHash,
              status: 'Completed',
            });
          }
        }
      }
    } catch (err) {
      console.warn('ZakatContractOverview: failed to read adminLatestZakatRow from sessionStorage', err);
    }

    // Fallback: if no session data, show nothing (demo expects single uploaded until approval)
    const source = uploadedSource;

    const rows = source.map((t, i) => ({
      id: t.transactionHash || generateTxId(),
      block: 679000 + i * 13,
      time: formatDate(t.timestamp || new Date().toISOString()),
      from: t.addressFrom,
      to: t.addressTo || address,
      amountEth: Number(t.amount || 0),
      status: t.status || 'Sent',
      age: timeAgoSeconds(t.timestamp || new Date().toISOString()),
      timestamp: t.timestamp || new Date().toISOString(),
    }));

    setTableRows(rows);
  }, [zakatTransactions, address]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return tableRows;
    return tableRows.filter((r) =>
      (r.id || '').toLowerCase().includes(q) ||
      String(r.block).includes(q) ||
      (r.from || '').toLowerCase().includes(q) ||
      (r.to || '').toLowerCase().includes(q) ||
      String(r.amountEth).includes(q) ||
      (r.status || '').toLowerCase().includes(q)
    );
  }, [search, tableRows]);

  const onChangeStatus = (id, newStatus) => {
    setTableRows((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      // When status changes, generate a new transaction id while keeping contract address
      return { ...r, status: newStatus, id: generateTxId() };
    }));
  };

  return (
    <HalfCircleBackground title="Contract Overview" bgClassName="bg-stone-50" titleClassName="text-xl font-bold text-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-stone-200 p-4">
            <div className="text-xs text-stone-500">ADDRESS</div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="text-sm font-mono break-all text-blue-700">
                {address}
              </div>
              <button
                className="text-xs px-2 py-1 rounded bg-stone-200 text-stone-700"
                onClick={() => navigator.clipboard?.writeText(address)}
              >
                Copy
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-stone-200 p-4">
            <div className="text-xs text-stone-500">ETH BALANCE</div>
            <div className="mt-2 flex items-center gap-2 text-stone-900"><span>♦</span><span>0</span></div>
          </div>
          <div className="bg-white rounded-lg border border-stone-200 p-4">
            <div className="text-xs text-stone-500">ACTIONS</div>
            <div className="mt-2 flex items-center gap-2">
              <Link to="/profile" className="text-blue-600 hover:underline text-xs">View My Transactions</Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-stone-200">
          <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between">
            <h3 className="text-base font-semibold text-stone-900">Transactions</h3>
            <input
              type="text"
              placeholder="Search by hash, from, to, status"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 px-3 py-2 text-sm rounded-md border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-stone-100 text-stone-700">
                  <th className="px-4 py-3 text-left font-semibold">Txn Hash</th>
                  <th className="px-4 py-3 text-left font-semibold">Block</th>
                  <th className="px-4 py-3 text-left font-semibold">Time</th>
                  <th className="px-4 py-3 text-left font-semibold">From</th>
                  <th className="px-4 py-3 text-left font-semibold">To</th>
                  <th className="px-4 py-3 text-left font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Age</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/zakat/explorer/${encodeURIComponent(row.id)}?status=${encodeURIComponent(row.status)}&timestamp=${encodeURIComponent(new Date(row.timestamp).toISOString())}`}
                          className="text-blue-600 font-mono hover:underline"
                        >
                          {`${row.id.slice(0, 10)}...${row.id.slice(-6)}`}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono">{row.block}</td>
                    <td className="px-4 py-3">{row.time}</td>
                    <td className="px-4 py-3 font-mono">{row.from}</td>
                    <td className="px-4 py-3 font-mono">{row.to}</td>
                    <td className="px-4 py-3">{row.amountEth} ETH</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${row.status === 'Completed' ? 'bg-green-100 text-green-800' : row.status === 'Sent' ? 'bg-amber-100 text-amber-800' : row.status === 'Approved' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{row.age}</td>
                    <td className="px-4 py-3">
                      <select
                        value={row.status}
                        onChange={(e) => onChangeStatus(row.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded border border-stone-300 bg-white"
                      >
                        <option value="Sent">Sent</option>
                        <option value="Completed">Completed</option>
                        <option value="Approved">Approved</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HalfCircleBackground>
  );
};

export default ZakatContractOverview;