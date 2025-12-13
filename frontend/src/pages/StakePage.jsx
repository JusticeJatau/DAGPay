import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Lock, 
  TrendingUp,
  Wallet,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileNavBar from '../components/MobileNavBar';

const StakePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stake'); // stake, mystakes
  const [amount, setAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);

  // Simple stats
  const walletBalance = 981.5;
  const totalStaked = 1500;
  const pendingRewards = 5.25;

  // Simple staking pools
  const stakingPools = [
    { 
      id: 1, 
      name: '7-Days', 
      apr: 12.5, 
      lockPeriod: 7, 
      minStake: 10,
      color: 'blue'
    },
    { 
      id: 2, 
      name: '30-Days', 
      apr: 18.5, 
      lockPeriod: 30, 
      minStake: 50,
      color: 'green'
    },
    { 
      id: 3, 
      name: '90-Days', 
      apr: 24.8, 
      lockPeriod: 90, 
      minStake: 100,
      color: 'purple'
    }
  ];

  // Simple user stakes
  const myStakes = [
    { 
      id: 1, 
      poolName: '30-Days', 
      stakedAmount: 1000,
      status: 'Active',
      color: 'green'
    },
    { 
      id: 2, 
      poolName: '90-Days', 
      stakedAmount: 500,
      status: 'Active',
      color: 'purple'
    }
  ];

  const handleStake = () => {
    if (!selectedPool || !amount || parseFloat(amount) < selectedPool.minStake) return;
    
    setIsProcessing(true);
    setTransactionStatus('processing');
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setTransactionStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setAmount('');
        setSelectedPool(null);
        setTransactionStatus(null);
        setActiveTab('mystakes');
      }, 2000);
    }, 3000);
  };

  const handleMaxAmount = () => {
    setAmount(walletBalance.toString());
  };

  const renderStakeTab = () => (
    <div className="space-y-8">
      {/* Simple Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#10305A] rounded-xl p-6 text-center">
          <div className="text-gray-400 mb-2">Wallet Balance</div>
          <div className="text-3xl font-bold">{walletBalance} BDAG</div>
        </div>
        <div className="bg-[#10305A] rounded-xl p-6 text-center">
          <div className="text-gray-400 mb-2">Total Staked</div>
          <div className="text-3xl font-bold">{totalStaked} BDAG</div>
        </div>
        <div className="bg-[#10305A] rounded-xl p-6 text-center">
          <div className="text-gray-400 mb-2">Pending Rewards</div>
          <div className="text-3xl font-bold text-green-400">{pendingRewards} BDAG</div>
        </div>
      </div>

      {/* Simple Pools Selection */}
      <div>
        <h3 className="text-lg text-center font-bold mb-4">Choose Staking Pool</h3>
        <p className="text-gray-400 text-center mb-6">Select a pool to stake your BDAG</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stakingPools.map((pool) => (
            <button
              key={pool.id}
              onClick={() => setSelectedPool(pool)}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedPool?.id === pool.id 
                  ? 'border-[#1678FF] bg-[#1678FF]/10' 
                  : 'border-[#12315D] bg-[#10305A] hover:border-[#1a4275]'
              }`}
            >
              <div className="text-center">
                <div className={`p-3 rounded-lg w-16 h-16 mx-auto mb-4 ${
                  pool.color === 'blue' ? 'bg-blue-900/30' :
                  pool.color === 'green' ? 'bg-green-900/30' :
                  'bg-purple-900/30'
                }`}>
                  <Lock className={
                    pool.color === 'blue' ? 'text-blue-400' :
                    pool.color === 'green' ? 'text-green-400' :
                    'text-purple-400'
                  } size={24} />
                </div>
                
                <div className="space-y-2">
                  <div className="font-bold text-xl">BDAG {pool.name}</div>
                  <div className="text-green-400 text-xl font-bold">{pool.apr}% APR</div>
                  <div className="text-gray-400">Lock: {pool.lockPeriod} days</div>
                  <div className="text-gray-400 text-sm">Min: {pool.minStake} BDAG</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Simple Stake Form */}
      <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-6 border border-[#12315D]">
        <h3 className="text-lg text-center font-bold mb-6">Stake BDAG</h3>
        
        <div className="space-y-6">
          {/* Amount Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-400">Amount to Stake</label>
              <div className="text-gray-400 text-sm">Available: {walletBalance} BDAG</div>
            </div>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#051837] border border-[#12315D] rounded-xl p-4 text-2xl focus:outline-none focus:ring-2 focus:ring-[#1678FF] pr-32"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <span className="font-medium">BDAG</span>
                <button
                  onClick={handleMaxAmount}
                  className="px-3 py-1 bg-[#1678FF] hover:bg-[#1a6eff] text-xs rounded-lg transition-colors"
                >
                  Max
                </button>
              </div>
            </div>
          </div>

          {/* Pool Info */}
          {selectedPool && (
            <div className="bg-[#10305A] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-400 text-sm">Selected Pool</div>
                  <div className="font-medium">BDAG {selectedPool.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 text-sm">APR</div>
                  <div className="font-medium text-green-400">{selectedPool.apr}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Validation */}
          {selectedPool && amount && parseFloat(amount) < selectedPool.minStake && (
            <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-4">
              <div className="text-center">
                <div className="font-medium text-red-300">Minimum stake not met</div>
                <div className="text-red-400/80 text-sm">
                  Minimum stake is {selectedPool.minStake} BDAG
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMyStakesTab = () => (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#10305A] rounded-xl p-6 text-center">
          <div className="text-gray-400 mb-2">Total Staked</div>
          <div className="text-3xl font-bold">{totalStaked} BDAG</div>
        </div>
        <div className="bg-[#10305A] rounded-xl p-6 text-center">
          <div className="text-gray-400 mb-2">Pending Rewards</div>
          <div className="text-3xl font-bold text-green-400">{pendingRewards} BDAG</div>
        </div>
        <div className="bg-[#10305A] rounded-xl p-6 text-center">
          <div className="text-gray-400 mb-2">Active Stakes</div>
          <div className="text-3xl font-bold">{myStakes.length}</div>
        </div>
      </div>

      {/* Simple Stakes List */}
      <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl border border-[#12315D]">
        <div className="p-6 border-b border-[#12315D]">
          <h3 className="text-lg text-center font-bold">My Active Stakes</h3>
          <p className="text-gray-400 text-sm text-center">Your staked positions</p>
        </div>
        
        <div className="space-y-4 p-6">
          {myStakes.map((stake) => (
            <div key={stake.id} className="bg-[#10305A] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    stake.color === 'green' ? 'bg-green-900/30' : 'bg-purple-900/30'
                  }`}>
                    <Lock className={
                      stake.color === 'green' ? 'text-green-400' : 'text-purple-400'
                    } size={20} />
                  </div>
                  <div>
                    <div className="font-bold">BDAG {stake.poolName}</div>
                    <div className="text-gray-400 text-sm">Staked Amount</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold">{stake.stakedAmount} BDAG</div>
                  <div className={`text-sm ${
                    stake.status === 'Active' ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {stake.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Summary */}
      <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-6 border border-[#12315D]">
        <h3 className="text-lg text-center font-bold mb-6">Rewards Summary</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#10305A] rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-green-900/30">
                <TrendingUp className="text-green-400" size={20} />
              </div>
              <div>
                <div className="font-medium">Total Pending Rewards</div>
                <div className="text-gray-400 text-sm">Ready to claim</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-green-400">{pendingRewards} BDAG</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex text-white min-h-screen">
      <Sidebar/>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex items-center sticky top-0 z-99999 bg-[#111827] border-b border-[#1677ff1c] gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#0f2b526e] rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className='py-4'>
            <h1 className="text-2xl font-bold mb-1">Staking</h1>
            <p className="text-gray-400">
              {activeTab === 'stake' && 'Earn rewards by staking BDAG tokens'}
              {activeTab === 'mystakes' && 'Your staked positions'}
            </p>
          </div>
          <MobileNavBar/>
        </div>

        {/* Simple Tabs */}
        <div className='p-4 md:p-6 lg:p-10'>
          <div className="flex border-b border-[#12315D] mb-8">
            {[
              { id: 'stake', label: 'Stake', icon: '💰' },
              { id: 'mystakes', label: 'My Stakes', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#1678FF] text-[#1678FF]'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Processing Overlay */}
          {isProcessing && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-4 border border-[#12315D]">
                <div className="text-center">
                  <Loader2 className="animate-spin mx-auto mb-6 text-[#1678FF]" size={48} />
                  <h3 className="text-xl font-bold mb-2">Staking BDAG</h3>
                  <p className="text-gray-400 mb-6">
                    Processing your staking transaction...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {transactionStatus === 'success' && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-4 border border-[#12315D]">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} className="text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Staking Successful!</h3>
                  <p className="text-gray-400 mb-6">
                    Your BDAG tokens have been successfully staked.
                  </p>
                  <button
                    onClick={() => {
                      setTransactionStatus(null);
                      setIsProcessing(false);
                    }}
                    className="w-full py-3 bg-[#1678FF] hover:bg-[#1a6eff] rounded-xl font-medium transition-colors"
                  >
                    View My Stakes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'stake' && renderStakeTab()}
            {activeTab === 'mystakes' && renderMyStakesTab()}
          </div>

          {/* Action Button */}
          {activeTab === 'stake' && (
            <div className="max-w-4xl mx-auto mt-8">
              <button
                onClick={handleStake}
                disabled={!selectedPool || !amount || parseFloat(amount) < selectedPool.minStake}
                className="w-full py-4 px-6 rounded-xl font-medium bg-[#1678FF] hover:bg-[#1a6eff] disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors text-lg"
              >
                Stake BDAG
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StakePage;