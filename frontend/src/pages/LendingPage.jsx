import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Clock,
  Percent,
  Users,
  Shield,
  CheckCircle,
  ChevronDown,
  Copy,
  Loader2,
  Eye,
  Calculator,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileNavBar from '../components/MobileNavBar';

const LendingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lend'); // lend, borrow, myloans
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState(30); // days
  const [interestRate, setInterestRate] = useState('12.5');
  const [selectedAsset, setSelectedAsset] = useState('BDAG');
  const [isProcessing, setIsProcessing] = useState(false);

  // Simplified data for MVP
  const assets = [
    { symbol: 'BDAG', name: 'BlockDAG', apy: 8.5, color: 'blue' },
    { symbol: 'USDC', name: 'USD Coin', apy: 5.2, color: 'green' }
  ];

  const myLoans = [
    {
      id: 1,
      type: 'lent',
      borrower: '0x8a3f...c5d2',
      amount: 200,
      asset: 'BDAG',
      interestRate: 12.5,
      duration: 30,
      earned: 2.05,
      status: 'active'
    },
    {
      id: 2,
      type: 'borrowed',
      lender: '0x5f9a...8c3e',
      amount: 500,
      asset: 'BDAG',
      interestRate: 10.5,
      owed: 504.38,
      status: 'active'
    }
  ];

  const calculateEarnings = (amount, rate, duration) => {
    if (!amount || !rate || !duration) return 0;
    const principal = parseFloat(amount);
    const dailyRate = (parseFloat(rate) / 100) / 365;
    return (principal * dailyRate * duration).toFixed(2);
  };

  const handleLend = () => {
    if (!amount) {
      alert('Please enter an amount');
      return;
    }
    
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Success! Created lending offer for ${amount} ${selectedAsset} at ${interestRate}% for ${duration} days`);
      setAmount('');
      setActiveTab('myloans');
    }, 2000);
  };

  const handleBorrow = () => {
    if (!amount) {
      alert('Please enter an amount');
      return;
    }
    
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Success! Loan request submitted for ${amount} ${selectedAsset} for ${duration} days`);
      setAmount('');
      setActiveTab('myloans');
    }, 2000);
  };

  const renderLendTab = () => (
    <div className="space-y-8">
      {/* Simple Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#10305A] rounded-xl p-4 text-center">
          <div className="text-gray-400 text-sm mb-1">Wallet Balance</div>
          <div className="text-xl font-bold">2,481 BDAG</div>
        </div>
        <div className="bg-[#10305A] rounded-xl p-4 text-center">
          <div className="text-gray-400 text-sm mb-1">Available to Lend</div>
          <div className="text-xl font-bold text-green-400">1,500 BDAG</div>
        </div>
      </div>

      {/* Lend Form */}
      <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-6 border border-[#12315D]">
        <h3 className="text-lg text-center font-bold mb-6">Lend {selectedAsset}</h3>
        
        <div className="space-y-6">
          {/* Asset Selection */}
          <div>
            <label className="block text-gray-400 mb-3">Select Asset</label>
            <div className="grid grid-cols-2 gap-4">
              {assets.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => setSelectedAsset(asset.symbol)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedAsset === asset.symbol 
                      ? 'border-[#1678FF] bg-[#1678FF]/10' 
                      : 'border-[#12315D] bg-[#10305A] hover:border-[#1a4275]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${asset.color === 'blue' ? 'bg-blue-900/30' : 'bg-green-900/30'}`}>
                      <DollarSign className={asset.color === 'blue' ? 'text-blue-400' : 'text-green-400'} size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">{asset.symbol}</div>
                      <div className="text-gray-400 text-sm">{asset.apy}% APY</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-gray-400 mb-2">Amount to Lend</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#051837] border border-[#12315D] rounded-xl p-4 text-xl focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <span className="font-medium">{selectedAsset}</span>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-400 mb-2">Lending Duration</label>
            <div className="grid grid-cols-4 gap-2">
              {[7, 30, 60, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => setDuration(days)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    duration === days
                      ? 'bg-[#1678FF] text-white'
                      : 'bg-[#10305A] hover:bg-[#123660] text-gray-300'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-gray-400 mb-2">Interest Rate (%)</label>
            <div className="relative">
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g., 12.5"
                step="0.1"
                className="w-full bg-[#051837] border border-[#12315D] rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1678FF] pr-12"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
            </div>
          </div>

          {/* Earnings Preview */}
          {amount && interestRate && duration && (
            <div className="bg-gradient-to-r from-[#1678FF]/10 to-[#1678FF]/5 rounded-xl p-4">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Calculator size={20} />
                Earnings Preview
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Est. Earnings</span>
                  <span className="font-bold text-green-400">
                    {calculateEarnings(amount, interestRate, duration)} {selectedAsset}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Return</span>
                  <span className="font-bold">
                    {(parseFloat(amount || 0) + parseFloat(calculateEarnings(amount, interestRate, duration) || 0)).toFixed(2)} {selectedAsset}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderBorrowTab = () => (
    <div className="space-y-8">
      {/* Borrow Form */}
      <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-6 border border-[#12315D]">
        <h3 className="text-lg text-center font-bold mb-6">Borrow {selectedAsset}</h3>
        
        <div className="space-y-6">
          {/* Asset Selection */}
          <div>
            <label className="block text-gray-400 mb-3">Select Asset</label>
            <div className="grid grid-cols-2 gap-4">
              {assets.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => setSelectedAsset(asset.symbol)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedAsset === asset.symbol 
                      ? 'border-[#1678FF] bg-[#1678FF]/10' 
                      : 'border-[#12315D] bg-[#10305A] hover:border-[#1a4275]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${asset.color === 'blue' ? 'bg-blue-900/30' : 'bg-green-900/30'}`}>
                      <DollarSign className={asset.color === 'blue' ? 'text-blue-400' : 'text-green-400'} size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">{asset.symbol}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-gray-400 mb-2">Amount to Borrow</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#051837] border border-[#12315D] rounded-xl p-4 text-xl focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <span className="font-medium">{selectedAsset}</span>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-400 mb-2">Repayment Period</label>
            <div className="grid grid-cols-4 gap-2">
              {[7, 30, 60, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => setDuration(days)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    duration === days
                      ? 'bg-[#1678FF] text-white'
                      : 'bg-[#10305A] hover:bg-[#123660] text-gray-300'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>

          {/* Interest Info */}
          <div className="bg-[#10305A] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-400">Interest Rate</div>
                <div className="text-xl font-bold text-green-400">12.5% APY</div>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-sm">Credit Score: 750</div>
                <div className="text-sm text-green-400">Excellent</div>
              </div>
            </div>
          </div>

          {/* Collateral Info */}
          <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <div className="text-yellow-300 text-sm mb-1">Collateral Required</div>
                <div className="text-yellow-400/80 text-sm">
                  You'll need to provide ${(parseFloat(amount || 0) * 1.5).toFixed(2)} worth of assets as collateral.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMyLoansTab = () => (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#10305A] rounded-xl p-4 text-center">
          <div className="text-gray-400 text-sm mb-1">Active Loans Given</div>
          <div className="text-xl font-bold">{myLoans.filter(l => l.type === 'lent').length}</div>
        </div>
        <div className="bg-[#10305A] rounded-xl p-4 text-center">
          <div className="text-gray-400 text-sm mb-1">Active Loans Taken</div>
          <div className="text-xl font-bold">{myLoans.filter(l => l.type === 'borrowed').length}</div>
        </div>
      </div>

      {/* Loans List */}
      <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl border border-[#12315D]">
        <div className="p-6 border-b border-[#12315D]">
          <h3 className="text-lg text-center font-bold">My Loans</h3>
        </div>
        
        <div className="divide-y divide-[#12315D]">
          {myLoans.map((loan) => (
            <div key={loan.id} className="p-4 hover:bg-[#10305A]/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${loan.type === 'lent' ? 'bg-blue-900/30' : 'bg-purple-900/30'}`}>
                    {loan.type === 'lent' ? 
                      <TrendingUp className="text-blue-400" size={20} /> : 
                      <TrendingDown className="text-purple-400" size={20} />
                    }
                  </div>
                  <div>
                    <div className="font-medium">
                      {loan.type === 'lent' ? `Lent to ${loan.borrower}` : `Borrowed from ${loan.lender}`}
                    </div>
                    <div className="text-gray-400 text-sm">{loan.amount} {loan.asset}</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs ${
                  loan.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-gray-700 text-gray-400'
                }`}>
                  {loan.status}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Interest Rate</div>
                  <div className="font-medium">{loan.interestRate}%</div>
                </div>
                <div>
                  <div className="text-gray-400">
                    {loan.type === 'lent' ? 'Earned' : 'Owed'}
                  </div>
                  <div className={`font-bold ${loan.type === 'lent' ? 'text-green-400' : 'text-red-400'}`}>
                    {loan.type === 'lent' ? `${loan.earned} ${loan.asset}` : `${loan.owed} ${loan.asset}`}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                {loan.type === 'borrowed' && (
                  <button className="flex-1 py-2 bg-[#1678FF] hover:bg-[#1a6eff] rounded-lg text-sm transition-colors">
                    Repay Now
                  </button>
                )}
                <button className="p-2 hover:bg-[#10305A] rounded">
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex text-white min-h-screen">
      {/* Use Sidebar Component */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        <div className="flex items-center sticky top-0 z-10 bg-[#111827] border-b border-[#1677ff1c] gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#0f2b526e] rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className='py-4'>
            <h1 className="text-2xl font-bold mb-1">
              {activeTab === 'lend' ? 'Lend Assets' :
               activeTab === 'borrow' ? 'Borrow Funds' : 'My Loans'}
            </h1>
            <p className="text-gray-400">
              {activeTab === 'lend' && 'Earn interest by lending your assets'}
              {activeTab === 'borrow' && 'Get funds by borrowing against collateral'}
              {activeTab === 'myloans' && 'Manage your lending and borrowing'}
            </p>
          </div>
          <MobileNavBar/>
        </div>

        {/* Simple Tabs */}
        <div className='p-4 md:p-6 lg:p-10'>
          <div className="flex border-b border-[#12315D] mb-8">
            {[
              { id: 'lend', label: 'Lend' },
              { id: 'borrow', label: 'Borrow' },
              { id: 'myloans', label: 'My Loans' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-[#1678FF] border-b-2 border-[#1678FF]'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="max-w-2xl mx-auto">
            {activeTab === 'lend' && renderLendTab()}
            {activeTab === 'borrow' && renderBorrowTab()}
            {activeTab === 'myloans' && renderMyLoansTab()}
          </div>

          {/* Action Button */}
          {(activeTab === 'lend' || activeTab === 'borrow') && (
            <div className="max-w-2xl mx-auto mt-8">
              <button
                onClick={activeTab === 'lend' ? handleLend : handleBorrow}
                disabled={!amount}
                className="w-full py-4 px-6 rounded-xl font-medium bg-[#1678FF] hover:bg-[#1a6eff] disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </div>
                ) : (
                  activeTab === 'lend' ? 'Create Lending Offer' : 'Request Loan'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LendingPage;