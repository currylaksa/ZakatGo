import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const ExplorerDashboardMYRPage = () => {
  const { history, blocks, latestTx, stats } = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const txc = i % 13 === 0 ? 2 : i % 7 === 0 ? 1 : 0;
      days.push({ date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), tx: txc });
    }
    const b = [];
    for (let i = 0; i < 10; i++) {
      const num = 5986 - i;
      const hash = `0x${Math.random().toString(16).slice(2,6)}...${Math.random().toString(16).slice(2,6)}`;
      const ago = `${9 + i * 5} secs ago`;
      b.push({ num, hash, txs: 0, ago });
    }
    const tx1 = '0xdeadbeef00000000000000000000000000000002';
    const tx = [
      { hash: `0xdead...02`, from: '0xf17f...98843', to: '0x47c2f...3118de', amountMYR: 18.90, status: 'Approved', ago: '1627 seconds ago' },
      { hash: `0x460D...89`, from: '0xf17f...98843', to: '0x47c2f...3118de', amountMYR: 18.90, status: 'Sent', ago: '1724 seconds ago' },
      { hash: `0x${Math.random().toString(16).slice(2,4)}87c...${Math.random().toString(16).slice(2,4)}`, from: '0xf17f...98843', to: '0x78c2f...ba669', amountMYR: 100.10,status: 'Sent', ago: '1725 seconds ago' },
      { hash: `0x${Math.random().toString(16).slice(2,4)}87c...${Math.random().toString(16).slice(2,4)}`, from: '0xf17f...98843', to: '0x78c2f...ba669', amountMYR: 100.10, status: 'Sent', ago: '27250 seconds ago' },
      { hash: `0x${Math.random().toString(16).slice(2,4)}87c...${Math.random().toString(16).slice(2,4)}`, from: '0xf17f...98843', to: '0x78c2f...ba669', amountMYR: 100.10, status: 'Sent', ago: '77300 seconds ago' },
      { hash: `0x${Math.random().toString(16).slice(2,4)}87c...${Math.random().toString(16).slice(2,4)}`, from: '0xf17f...98843', to: '0x78c2f...ba669', amountMYR: 100.10, status: 'Sent', ago: '172700 seconds ago' },
    
    ];
    const s = { blockSpeedSec: 5, blocksCount: 5986, txCount: 20, maxTxPerDay: 2 };
    return { history: days, blocks: b, latestTx: tx, stats: s };
  }, []);

  return (
    <div className="max-h-screen bg-gradient-to-b from-[#0b0b0f] to-[#400017] text-white md:p-8 mt-20">
      <div className="max-w-7xl mx-auto mt-10">
        <div className="bg-gray-900 rounded-xl shadow-lg border border-[#5f0220] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            <div className="lg:col-span-2 p-4">
              <div className="text-sm font-semibold text-[#fbe9ed] mb-2">TRANSACTION HISTORY (last 30 days)</div>
              <div className="h-72 bg-[#0f1218] rounded-md p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: '#e5e7eb', fontSize: 12 }} stroke="#374151" />
                    <YAxis tick={{ fill: '#e5e7eb', fontSize: 12 }} stroke="#374151" />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#e5e7eb' }} />
                    <Line type="monotone" dataKey="tx" stroke="#f43f5e" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="p-4 lg:border-l border-[#5f0220]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#fbe9ed]"><span className="inline-block w-2 h-2 rounded-full bg-[#f43f5e]"></span>BLOCK SPEED</div>
                  <div className="text-right">{stats.blockSpeedSec} secs</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#fbe9ed]"><span className="inline-block w-2 h-2 rounded-full bg-[#10b981]"></span>BLOCKS</div>
                  <div className="text-right">{stats.blocksCount}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#fbe9ed]"><span className="inline-block w-2 h-2 rounded-full bg-[#3b82f6]"></span>TRANSACTIONS</div>
                  <div className="text-right">{stats.txCount}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#fbe9ed]"><span className="inline-block w-2 h-2 rounded-full bg-[#f59e0b]"></span>MAX TRANSACTION/DAY</div>
                  <div className="text-right">{stats.maxTxPerDay}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-900 rounded-xl shadow-lg border border-[#5f0220]">
            <div className="flex items-center justify-between p-4 border-b border-[#5f0220]">
              <div className="text-sm font-semibold text-[#fbe9ed]">Latest Blocks</div>
              <Link to="/ledger" className="text-xs text-[#fbe9ed] hover:text-white">VIEW ALL BLOCKS →</Link>
            </div>
            <div className="divide-y divide-gray-800">
              {blocks.map((b, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <span className="text-[#f43f5e]">{b.num}</span>
                    <span className="text-gray-300">Hash: <span className="text-[#fbe9ed]">{b.hash}</span></span>
                    <span className="text-gray-300">Txs: {b.txs}</span>
                  </div>
                  <div className="text-gray-400 text-xs">{b.ago}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl shadow-lg border border-[#5f0220]">
            <div className="flex items-center justify-between p-4 border-b border-[#5f0220]">
              <div className="text-sm font-semibold text-[#fbe9ed]">Latest Transactions</div>
              <Link to="/transactions-myr" className="text-xs text-[#fbe9ed] hover:text-white">VIEW ALL TRANSACTIONS →</Link>
            </div>
            <div className="divide-y divide-gray-800">
              {latestTx.map((t, idx) => (
                <div key={idx} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Link
                        to={`/zakat/explorer/${encodeURIComponent(t.hash)}?status=${t.status}&amount=${encodeURIComponent(t.amountMYR)}&currency=RM&timestamp=${encodeURIComponent(new Date().toISOString())}&contractAddress=0x47c2f8bb91d0a6f2443bde0e5c1e79aa64f923118de`}
                        className="text-[#fbe9ed] hover:underline"
                      >
                        Hash: {t.hash}
                      </Link>
                    </div>
                    <div className="text-right text-green-400 font-medium">Amount: RM {t.amountMYR.toFixed(2)}</div>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <div className="text-gray-300">From: <span className="text-[#dc6e85]">{t.from}</span></div>
                    <div className="text-gray-300">To: <span className="text-[#dc6e85]">{t.to}</span></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{t.ago}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorerDashboardMYRPage;
