import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  RefreshCw,
  ArrowRightLeft,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Loader2,
  Copy,
  ExternalLink,
  Clock,
  Settings,
  Search,
  Check,
  X,
  History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileNavBar from '../components/MobileNavBar';

/*
  Full refactor of your SwapPage in a single-file React component.
  - Auto convert for merchant is a proper toggle (controlled boolean)
  - Currency selector is a reusable dropdown component
  - Clicking the ArrowRightLeft button swaps currencies and amounts (positions switch)
  - Breaks UI into small subcomponents for clarity
  - Uses Tailwind classes (keeps your original visual palette)

  Drop this file into your project (e.g. src/pages/SwapPage.jsx) and adjust imports/routes.
*/

const CURRENCIES = ['BDAG', 'USD', 'EUR', 'GBP', 'ETH', 'USDC'];

/* ----------------------------- Helper components ---------------------------- */
const IconButton = ({ onClick, children, className = '', ...props }) => (
  <button
    onClick={onClick}
    className={`rounded-full p-2 inline-flex items-center justify-center ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Toggle = ({ checked, onChange, label }) => (
  <div className="flex items-center gap-3">
    <div className="flex flex-col">
      <div className="text-sm font-medium">{label}</div>
    </div>
    <div
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full p-1 flex items-center cursor-pointer transition ${checked ? 'bg-[#1678FF]' : 'bg-gray-700'}`}
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onChange(!checked); }}
    >
      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : ''}`} />
    </div>
  </div>
);

const CurrencySelect = ({ value, onChange, currencies = CURRENCIES, label }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#051837] border border-[#12315D] rounded-lg px-4 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
      >
        {currencies.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
    </div>
  );
};

/* ------------------------------- Main page --------------------------------- */
const SwapPage = () => {
  const navigate = useNavigate();

  // UI state
  const [activeState, setActiveState] = useState('swap'); // swap | preview | processing | success

  // Amounts & currencies
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('BDAG');
  const [toCurrency, setToCurrency] = useState('USD');

  // Settings & toggles
  const [slippage, setSlippage] = useState(0.5);
  const [autoConvertForMerchant, setAutoConvertForMerchant] = useState(false);

  // Processing visualization
  const [isProcessing, setIsProcessing] = useState(false);
  const [swapProgress, setSwapProgress] = useState([false, false, false, false]);

  // For demo the exchange rate is fixed; in real app fetch this from API
  // exchangeRate means: 1 unit of fromCurrency = exchangeRate units of toCurrency
  const [exchangeRate, setExchangeRate] = useState(0.5);

  // Example balances (could come from user profile)
  const balances = useMemo(() => ({ BDAG: 2481.5, USD: 150.0 }), []);

  // recent swaps example
  const recentSwaps = useMemo(() => [
    { from: '20 BDAG', to: '10 USD', status: 'Complete', time: '2 hrs ago' },
    { from: '50 BDAG', to: '25 USD', status: 'Complete', time: '21 hrs ago' },
    { from: '1 USD', to: '0.5 BDAG', status: 'Complete', time: '1 day ago' }
  ], []);

  const processingSteps = useMemo(() => [
    { id: 1, label: 'Approving DAG' },
    { id: 2, label: 'Finding Best Route' },
    { id: 3, label: 'Executing Swap' },
    { id: 4, label: 'Confirming on BDAG' }
  ], []);

  // Derived: compute toAmount whenever fromAmount or exchangeRate changes
  useEffect(() => {
    if (fromAmount === '' || isNaN(parseFloat(fromAmount))) {
      setToAmount('');
      return;
    }
    const fa = parseFloat(fromAmount);
    const result = fa * exchangeRate;
    setToAmount(result % 1 === 0 ? String(result) : result.toFixed(2));
  }, [fromAmount, exchangeRate]);

  // Simulate processing progress
  useEffect(() => {
    if (activeState !== 'processing') return undefined;

    setIsProcessing(true);
    setSwapProgress([false, false, false, false]);

    const interval = setInterval(() => {
      setSwapProgress((prev) => {
        const next = [...prev];
        const firstFalse = next.indexOf(false);
        if (firstFalse !== -1) {
          next[firstFalse] = true;
        }
        return next;
      });
    }, 1400);

    // when all steps true -> success
    const checker = setInterval(() => {
      setSwapProgress((prev) => {
        if (prev.every(Boolean)) {
          clearInterval(interval);
          clearInterval(checker);
          setTimeout(() => {
            setIsProcessing(false);
            setActiveState('success');
          }, 800);
        }
        return prev;
      });
    }, 600);

    return () => {
      clearInterval(interval);
      clearInterval(checker);
    };
  }, [activeState]);

  // Swap action: go to preview
  const handleSwap = useCallback(() => {
    setActiveState('preview');
  }, []);

  // Confirm swap -> processing
  const handleConfirmSwap = useCallback(() => {
    setActiveState('processing');
  }, []);

  const handleBack = useCallback(() => {
    if (activeState === 'preview') setActiveState('swap');
    else if (activeState === 'processing' || activeState === 'success') setActiveState('swap');
    else navigate(-1);
  }, [activeState, navigate]);

  const handleMax = useCallback(() => {
    const max = balances[fromCurrency] ?? 0;
    setFromAmount(max.toString());
  }, [fromCurrency, balances]);

  // When clicking the ArrowRightLeft: swap currencies and amounts, and flip the exchange rate
  const handleCurrencySwap = useCallback(() => {
    // swap currency labels
    setFromCurrency((prev) => {
      const oldFrom = prev;
      setToCurrency(oldFrom);
      return (prev === toCurrency) ? fromCurrency : toCurrency; // safe fallback
    });

    // swap amounts
    setFromAmount((prevFrom) => {
      const prevTo = toAmount;
      // set toAmount to prevFrom after swap
      setToAmount(prevFrom || '');
      return prevTo || '';
    });

    // flip exchange rate (if based on inverse relationship)
    setExchangeRate((prev) => (prev === 0 ? 0 : +(1 / prev).toFixed(6)));
  }, [fromCurrency, toCurrency, toAmount]);

  // Renderers for the main card states
  const SwapCard = () => (
    <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-6 border border-[#12315D]">
      <h2 className="text-xl text-center font-bold mb-2">Cross-Chain Swap</h2>
      <p className="text-gray-400 text-center mb-6">Convert between BDAG and local currencies</p>

      <div className="space-y-6">
        {/* From */}
        <div className="bg-[#10305A] rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">From</span>
            <span className="text-gray-400 text-sm">Balance: <span className="text-white">{(balances[fromCurrency] ?? 0).toFixed(4)} {fromCurrency}</span></span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-3xl font-bold focus:outline-none placeholder-gray-500"
              />
              <div className="text-gray-400 text-sm mt-1">1 {fromCurrency} ≈ {exchangeRate} {toCurrency}</div>
            </div>

            <div className="flex items-center gap-2">
                <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="px-3 py-2 bg-[#111827] border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
                >
                    <option value="USDT">USDT</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="BNB">BNB</option>
                </select>

                <button
                    onClick={handleMax}
                    className="px-3 py-1 bg-[#1678FF] hover:bg-[#1a6eff] text-xs rounded-lg transition-colors"
                >
                    Max
                </button>
                </div>

          </div>
        </div>

        {/* Swap button (center) */}
        <div className="flex justify-center -my-2 z-10 relative">
          <button
            onClick={handleCurrencySwap}
            aria-label="swap-currencies"
            className="w-12 h-12 bg-[#1678FF] hover:bg-[#1a6eff] rounded-full flex items-center justify-center border-4 border-[#051837] transition-transform hover:scale-105"
          >
            <ArrowRightLeft className="text-white" size={20} />
          </button>
        </div>

        {/* To */}
        <div className="bg-[#10305A] rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">To</span>
            <span className="text-gray-400 text-sm">Balance: <span className="text-white">{(balances[toCurrency] ?? 0).toFixed(2)} {toCurrency}</span></span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input type="text" value={toAmount} readOnly className="w-full bg-transparent text-3xl font-bold focus:outline-none text-gray-300" />
              <div className="text-gray-400 text-sm mt-1">≈ {toAmount || '0.00'} {toCurrency}</div>
            </div>

            <div className="flex items-center gap-2">
                <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="px-3 py-2 bg-[#111827] border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
                >
                    <option value="USDT">USDT</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="BNB">BNB</option>
                </select>
            </div>
          </div>
        </div>

        {/* Auto convert toggle */}
        <div className="flex items-center justify-between p-4 bg-[#10305A] rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center">
              <RefreshCw className="text-blue-400" size={16} />
            </div>
            <div>
              <div className="font-medium">Auto Convert for Merchant</div>
              <div className="text-gray-400 text-sm">Automatically convert received payments to local currency</div>
            </div>
          </div>

          <Toggle checked={autoConvertForMerchant} onChange={setAutoConvertForMerchant} label="" />
        </div>

        {/* Exchange details */}
        <div className="bg-[#10305A] rounded-xl p-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Exchange Rate</span>
              <span className="font-medium">1 {fromCurrency} = {exchangeRate} {toCurrency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Network Fee</span>
              <span className="font-medium">0.0005 ETH = 0.5 USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">To Receive</span>
              <span className="font-medium">{toAmount || '0.00'} {toCurrency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Route</span>
              <span className="font-medium">{fromCurrency} → USDC → {toCurrency}</span>
            </div>
          </div>
        </div>

        {/* Slippage */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium">Slippage Tolerance</span>
            <div className="flex items-center gap-2">
              <Settings className="text-gray-400" size={16} />
              <span className="text-[#1678FF] text-sm">{slippage}%</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[0.1, 0.5, 1.0].map((value) => (
              <button key={value} onClick={() => setSlippage(value)} className={`p-3 rounded-lg text-center transition-colors ${slippage === value ? 'bg-[#1678FF] text-white' : 'bg-[#10305A] hover:bg-[#123660] text-gray-300'}`}>
                {value}%
              </button>
            ))}
            <div className="relative">
              <input type="number" value={slippage} onChange={(e) => setSlippage(parseFloat(e.target.value) || 0)} className="w-full bg-[#10305A] border border-[#12315D] rounded-lg p-3 text-center focus:outline-none focus:ring-2 focus:ring-[#1678FF]" step="0.1" min="0" max="100" />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
            </div>
          </div>
        </div>

        {/* Recent swaps */}
        <div>
          <h3 className="font-medium mb-4">Recent Swaps</h3>
          <div className="space-y-3">
            {recentSwaps.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#10305A] hover:bg-[#123660] rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-900/30">
                    <RefreshCw className="text-blue-400" size={16} />
                  </div>
                  <div>
                    <div className="font-medium">{s.from} → {s.to}</div>
                    <div className="text-gray-400 text-sm">{s.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-sm">{s.status}</span>
                  <CheckCircle className="text-green-400" size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );

  const PreviewCard = () => (
    <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-6 border border-[#12315D]">
      <h2 className="text-xl text-center font-bold mb-2">Review Swap</h2>
      <p className="text-gray-400 text-center mb-8">Confirm swap details before proceeding</p>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#10305A] rounded-xl p-6 text-center">
            <div className="text-gray-400 mb-2">You pay</div>
            <div className="text-3xl font-bold mb-2">{fromAmount || '0.00'} {fromCurrency}</div>
            <div className="text-gray-400">≈ ${(parseFloat(fromAmount || 0) * exchangeRate).toFixed(2)} {toCurrency}</div>
          </div>
          <div className="bg-[#10305A] rounded-xl p-6 text-center">
            <div className="text-gray-400 mb-2">You receive</div>
            <div className="text-3xl font-bold mb-2">{toAmount || '0.00'} {toCurrency}</div>
            <div className="text-gray-400">≈ ${toAmount || '0.00'} {toCurrency}</div>
          </div>
        </div>

        <div className="bg-[#10305A] rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Slippage Tolerance</span>
            <span className="font-medium">{slippage}%</span>
          </div>
        </div>

        <div className="bg-[#10305A] rounded-xl p-6">
          <h3 className="font-bold mb-4">TRANSACTION DETAILS</h3>
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-gray-400">Exchange Rate</span><span className="font-medium">1 {fromCurrency} = {exchangeRate} {toCurrency}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Network Fee</span><span className="font-medium">0.0005 ETH = 0.5 USD</span></div>
            <div className="flex justify-between"><span className="text-gray-400">To Receive</span><span className="font-medium">{toAmount || '0.00'} {toCurrency}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Route</span><span className="font-medium">{fromCurrency} → USDC → {toCurrency}</span></div>
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm">
              <div className="font-medium text-yellow-300 mb-1">Price Impact Warning</div>
              <div className="text-yellow-400/80">The swap price may differ from the current market rate due to slippage. You are protected up to {slippage}% slippage.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  const ProcessingCard = () => (
    <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-6 border border-[#12315D] text-center">
      <h2 className="text-xl font-bold mb-2">Processing Swap</h2>
      <p className="text-gray-400 mb-8 text-center">Swapping Token</p>

      <div className="space-y-8 max-w-md mx-auto">
        {processingSteps.map((step, i) => (
          <div key={step.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${swapProgress[i] ? 'bg-green-900/30 text-green-400' : i === 1 ? 'bg-blue-900/30 text-blue-400' : 'bg-gray-800 text-gray-500'}`}>
                {swapProgress[i] ? <Check size={20} /> : i === 1 ? <Loader2 size={20} className="animate-spin" /> : step.id}
              </div>
              <span className={swapProgress[i] ? 'text-green-400' : i === 1 ? 'text-blue-400' : 'text-gray-400'}>{step.label}</span>
            </div>
            <div className={`text-sm ${swapProgress[i] ? 'text-green-400' : i === 1 ? 'text-blue-400' : 'text-gray-500'}`}>
              {swapProgress[i] ? 'Completed' : i === 1 ? 'In progress...' : 'Pending'}
            </div>
          </div>
        ))}

        <div className="flex justify-center gap-4 mt-12">
          {[1,2,3,4].map((n) => (
            <div key={n} className={`w-2 h-2 rounded-full transition-all duration-300 ${swapProgress[n-1] ? 'bg-[#1678FF] scale-125' : 'bg-gray-700'}`}></div>
          ))}
        </div>

        <div className="bg-[#10305A] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Clock className="text-blue-400" size={20} />
            <div className="text-left">
              <div className="font-medium">Estimated Time</div>
              <div className="text-gray-400 text-sm">This swap should complete within 2-5 minutes</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  const SuccessCard = () => (
    <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-6 border border-[#12315D] text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Swap Successful</h2>
        <p className="text-gray-400">Your token has been swapped successfully</p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#10305A] rounded-xl p-6 text-center">
            <div className="text-gray-400 mb-2">You paid</div>
            <div className="text-2xl font-bold mb-2">{fromAmount || '2481.5'} {fromCurrency}</div>
            <div className="text-gray-400">≈ ${(parseFloat(fromAmount || 2481.5) * exchangeRate).toFixed(2)} {toCurrency}</div>
          </div>
          <div className="bg-[#10305A] rounded-xl p-6 text-center">
            <div className="text-gray-400 mb-2">You received</div>
            <div className="text-2xl font-bold mb-2">{toAmount || '124.08'} {toCurrency}</div>
            <div className="text-gray-400">≈ ${toAmount || '124.08'} {toCurrency}</div>
          </div>
        </div>

        <div className="bg-[#10305A] rounded-xl p-6 text-left">
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-gray-400">Transaction ID</span><span className="font-mono text-sm">SWAP-MIU9AP7R</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Network Fee</span><span className="font-medium">0.0005 ETH ≈ 0.5 USD</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Exchange Rate</span><span className="font-medium">1 {fromCurrency} ≈ {exchangeRate} {toCurrency}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Time</span><span className="font-medium">01:20 PM</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="text-green-400 font-medium">Completed</span></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 p-4 bg-[#10305A] hover:bg-[#123660] rounded-xl font-medium transition-colors">
            <ExternalLink size={20} />
            View Transaction
          </button>
          <button onClick={() => { setActiveState('swap'); setFromAmount(''); setToAmount(''); }} className="flex items-center justify-center gap-2 p-4 bg-[#1678FF] hover:bg-[#1a6eff] rounded-xl font-medium transition-colors">
            <RefreshCw size={20} />
            New Swap
          </button>
        </div>
      </div>
    </div>
  );

  const renderState = useCallback(() => {
    switch (activeState) {
      case 'swap': return <SwapCard />;
      case 'preview': return <PreviewCard />;
      case 'processing': return <ProcessingCard />;
      case 'success': return <SuccessCard />;
      default: return null;
    }
  }, [activeState, fromAmount, toAmount, swapProgress, exchangeRate, slippage, autoConvertForMerchant]);

  return (
    <div className="flex text-white min-h-screen">
      <Sidebar/>

      <div className="flex-1">
        <div className="flex items-center sticky top-0 z-99999 bg-[#111827] border-b border-[#1677ff1c] gap-4 mb-8">
          <button onClick={handleBack} className="p-2 hover:bg-[#0f2b526e] rounded-lg transition-colors"><ChevronLeft size={24} /></button>
          <div className='py-4'>
            <h1 className="text-2xl font-bold mb-1">{activeState === 'swap' ? 'Swap' : activeState === 'preview' ? 'Review Swap' : activeState === 'processing' ? 'Processing Swap' : 'Swap Successful'}</h1>
            <p className="text-gray-400">{activeState === 'swap' && 'Convert between BDAG and local currencies'}{activeState === 'preview' && 'Confirm swap details before proceeding'}{activeState === 'processing' && 'Swapping token'}{activeState === 'success' && 'Your token has been swapped successfully'}</p>
          </div>
          <MobileNavBar/>
        </div>

        <div className='p-4 md:p-6 lg:p-10'>
          <div className="max-w-4xl mx-auto">{renderState()}</div>

          {activeState === 'swap' && (
            <div className="max-w-4xl mx-auto mt-8">
              <button onClick={handleSwap} disabled={!fromAmount || parseFloat(fromAmount) <= 0} className="w-full py-4 px-6 rounded-xl font-medium bg-[#1678FF] hover:bg-[#1a6eff] disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors text-lg flex items-center justify-center gap-2">Preview Swap</button>
            </div>
          )}

          {activeState === 'preview' && (
            <div className="max-w-4xl mx-auto mt-8 flex gap-4">
              <button onClick={handleBack} className="flex-1 py-3 px-6 rounded-xl font-medium bg-[#0f2b526e] hover:bg-[#10305A] border border-[#12315D] transition-colors">Back</button>
              <button onClick={handleConfirmSwap} className="flex-1 py-3 px-6 rounded-xl font-medium bg-[#1678FF] hover:bg-[#1a6eff] transition-colors flex items-center justify-center gap-2"><RefreshCw size={20} />Confirm Swap</button>
            </div>
          )}

          {activeState === 'success' && (
            <div className="max-w-4xl mx-auto mt-8">
              <button onClick={() => navigate('/dashboard')} className="w-full py-3 px-6 rounded-xl font-medium bg-[#1678FF] hover:bg-[#1a6eff] transition-colors">Back to Dashboard</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapPage;