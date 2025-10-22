import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { HalfCircleBackground, Button } from '../../components';

const ZakatExplorer = () => {
  const { txId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

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

  const transactionId = txId || details.transactionId || 'N/A';
  const timestamp = details.timestamp || metadata.timestamp || new Date().toISOString();
  const sender = details.walletAddress || 'N/A';
  const receiver = import.meta.env.VITE_RECEIVER_ADDRESS || 'N/A';
  const amountEth = Number(details.ethAmount || 0);

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
              <div className="text-sm text-stone-900">N/A</div>
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
              <div className="text-xs text-stone-500">Amount</div>
              <div className="md:col-span-2 text-sm text-stone-900">{amountEth} ETH</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
              <div className="text-xs text-stone-500">Receiver</div>
              <div className="md:col-span-2 text-sm font-mono text-stone-900 break-all">{receiver}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
              <div className="text-xs text-stone-500">Value</div>
              <div className="md:col-span-2 text-sm text-stone-900">{amountEth} ETH</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
              <div className="text-xs text-stone-500">Gas Price</div>
              <div className="md:col-span-2 text-sm text-stone-900">1 Gwei</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
              <div className="text-xs text-stone-500">Transaction Fee</div>
              <div className="md:col-span-2 text-sm text-stone-900">0.000023688 ETH</div>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-stone-50 rounded-md p-3">
                <div className="text-xs text-stone-500">Note</div>
                <div className="text-sm text-stone-900">Monthly Zakat Deduction</div>
              </div>
              <div className="bg-stone-50 rounded-md p-3">
                <div className="text-xs text-stone-500">OnComplete</div>
                <div className="text-sm text-stone-900">Uploaded</div>
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