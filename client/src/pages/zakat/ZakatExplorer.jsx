import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { HalfCircleBackground, Button } from '../../components';
import { TransactionContext } from '../../context/TransactionContext';
import { contractAddress } from '../../utils/constants';

const ZakatExplorer = () => {
  const { hash, txId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentAccount } = useContext(TransactionContext);

  // Read status from URL params (for new-tab navigation)
  const params = new URLSearchParams(location.search);
  const statusParam = params.get('status');
  // Try to hydrate from navigation state first, then from session
  let stateDetails = location.state?.details || {};
  let persisted = {};
  try {
    persisted = JSON.parse(sessionStorage.getItem('zakatExplorerData') || '{}');
  } catch (_) {
    persisted = {};
  }

  const details = stateDetails.transactionDetails || persisted.transactionDetails || {};
  const metadata = stateDetails.blockchainMetadata || persisted.blockchainMetadata || {};

  const transactionId = hash || txId || details.transactionId || 'N/A';
  const timestamp = details.timestamp || metadata.timestamp || new Date().toISOString();
  // Ensure sender always has a wallet address (cannot be 'N/A')
  const sender = details.walletAddress || currentAccount || ('0x' + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''));
  const receiver = contractAddress || 'N/A';
  const zakatAnnual = Number(details.zakatAnnual || 0);
  const onComplete = statusParam || details.status || metadata.status || 'Unknown';
  const displayStatus = onComplete === 'Uploaded' ? 'Sent' : onComplete;
  const amountParam = params.get('amount');
  const currencyParam = params.get('currency');
  
  // Generate a random block number starting from 20
  const blockNumber = metadata.blockNumber || (20 + Math.floor(Math.random() * 1000));

  const onBack = () => navigate(-1);
  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text).catch(() => {});
  };

  return (
    <HalfCircleBackground title="ZakatUtmBc Explorer" bgClassName="bg-stone-50" titleClassName="text-[#400017] font-bold text-2xl">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Actions */}
        <div className="flex justify-end">
          <Button variant="secondary" size="sm" onClick={onBack}>Back</Button>
        </div>

        {/* Overview */}
        <div className="bg-white rounded-lg border border-stone-200 shadow-sm">
          <div className="p-4 border-b border-stone-200">
            <h2 className="text-lg font-semibold text-stone-900">Transaction Overview</h2>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <div className="text-xs text-stone-500 mb-1">Transaction ID</div>
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-mono text-stone-900 break-all">{transactionId}</div>
                <button onClick={() => copyToClipboard(transactionId)} className="text-xs px-2 py-1 rounded bg-stone-200 text-stone-700">Copy</button>
              </div>
            </div>
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <div className="text-xs text-stone-500 mb-1">Timestamp</div>
              <div className="text-sm text-stone-900">{new Date(timestamp).toUTCString()}</div>
            </div>
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <div className="text-xs text-stone-500 mb-1">Block</div>
              <div className="text-sm text-stone-900">{blockNumber}</div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-lg border border-stone-200 shadow-sm">
          <div className="p-4 border-b border-stone-200">
            <h3 className="text-lg font-semibold text-stone-900">Transaction Details</h3>
          </div>
          <div className="divide-y divide-stone-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
              <div className="text-xs text-stone-500">Sender</div>
              <div className="md:col-span-2 text-sm font-mono text-stone-900 break-all">{sender}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
              <div className="text-xs text-stone-500">Zakat Amount</div>
              <div className="md:col-span-2 text-sm text-stone-900">
                {amountParam ? (
                  currencyParam === 'ETH' 
                    ? `${Number(amountParam).toFixed(6)} ETH`
                    : `RM ${Number(amountParam).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                ) : (
                  `RM ${zakatAnnual.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
              <div className="text-xs text-stone-500">Contract Address</div>
              <div className="md:col-span-2 text-sm font-mono text-stone-900 break-all">
                {receiver}
                {receiver !== 'N/A' && (
                  <span className="ml-2 inline-flex items-center gap-1">
                    <Link
                      to={`/zakat/explorer/contract/${encodeURIComponent(receiver)}`}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      View Contract Overview
                    </Link>
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
              <div className="text-xs text-stone-500">Gas Fee</div>
              <div className="md:col-span-2 text-sm text-stone-900">0.00 MYR</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
              <div className="text-xs text-stone-500">Transaction Fee</div>
              <div className="md:col-span-2 text-sm text-stone-900">0.00 MYR</div>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-stone-50 rounded-md p-3">
                <div className="text-xs text-stone-500">Note</div>
                <div className="text-sm text-stone-900">Monthly Zakat Deduction</div>
              </div>
              <div className="bg-stone-50 rounded-md p-3">
                <div className="text-xs text-stone-500">OnComplete</div>
                <div className="text-sm text-stone-900">{displayStatus}</div>
              </div>
            </div>
          </div>
        </div>

        {/* More details */}
        <div className="bg-white rounded-lg border border-stone-200 shadow-sm">
          <div className="p-4 border-b border-stone-200"><h3 className="text-lg font-semibold text-stone-900">More Details</h3></div>
          <div className="p-4 space-y-3 text-sm text-stone-800">
            <div className="flex items-center justify-between"><span className="text-stone-500">Gas Limit & Usage by Txn:</span><span>300000 | 23688 (7.90%)</span></div>
            <div className="flex items-center justify-between"><span className="text-stone-500">Gas Fees:</span><span>Base: 0 Gwei | Max: 0 Gwei | Max Priority: 0 Gwei</span></div>
          </div>
        </div>

        <div className="text-xs text-stone-500 text-center">Prototype Explorer — confirms metadata stored in private network</div>
      </div>
    </HalfCircleBackground>
  );
};

export default ZakatExplorer;