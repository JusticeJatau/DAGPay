import React, { useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  RefreshCw,
  PieChart,
  DollarSign,
  History,
  User,
  Settings,
  HelpCircle,
  ExternalLink,
  Wallet,
  TrendingUp,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import MobileNavBar from "../components/MobileNavBar";
import Button from "../components/Button";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const quickActions = [
    { icon: ArrowUp, label: "Send", color: "text-blue-400", path: "/send" },
    { icon: ArrowDown, label: "Receive", color: "text-green-400", path: "/receive" },
    { icon: RefreshCw, label: "Swap", color: "text-orange-400", path: "/swap" },
    { icon: PieChart, label: "Stake", color: "text-purple-400", path: "/stake" },
    { icon: DollarSign, label: "Lend", color: "text-yellow-400", path: "/lend" },
  ];

  const moreOptions = [
    { icon: User, label: "Profile", path: "/profile", color: "text-blue-300" },
    { icon: History, label: "History", path: "/history", color: "text-purple-300" },
    { icon: Settings, label: "Settings", path: "/settings", color: "text-gray-300" },
    { icon: HelpCircle, label: "Help", path: "/help", color: "text-green-300" },
  ];

  const transactions = [
    {
      id: 1,
      type: "send",
      to: "Merchant ABC",
      time: "2 min ago",
      amount: "-50 USD",
      amountColor: "text-red-400",
      status: "completed",
    },
    {
      id: 2,
      type: "receive",
      from: "Alice Smith",
      time: "2 hrs ago",
      amount: "+100 BDAG",
      amountColor: "text-green-400",
      status: "completed",
    },
    {
      id: 3,
      type: "send",
      to: "Coffee Shop",
      time: "Yesterday",
      amount: "-5 USD",
      amountColor: "text-red-400",
      status: "pending",
    },
    {
      id: 4,
      type: "swap",
      action: "BDAG → USD",
      time: "2 days ago",
      amount: "+20 USD",
      amountColor: "text-green-400",
      status: "completed",
    },
  ];

  const ActionButton = ({ icon: Icon, label, color, onClick }) => (
    <button
      onClick={onClick}
      className="flex flex-col items-center bg-[#10305A] p-4 rounded-xl hover:bg-[#123660] transition-all duration-200 hover:scale-105"
    >
      <Icon size={26} className={color} />
      <span className="text-xs mt-2">{label}</span>
    </button>
  );

  // If no user data yet, show loading
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#030D43] to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  // Get user display name
  const getUserDisplayName = () => {
    if (user.account_type === 'individual' && user.full_name) {
      return user.full_name;
    } else if (user.account_type === 'organization' && user.organization_name) {
      return user.organization_name;
    }
    return user.email.split('@')[0]; // Default to username from email
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex text-white min-h-screen">
      <Sidebar />
      
      <div className="flex-1">
        <div className="flex items-center sticky top-0 z-99999 bg-[#111827] border-b border-[#1677ff1c] gap-4 mb-8">
          <div className='flex justify-between w-full p-4'>
            <div className="hidden lg:flex">
              <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
              {/* <p className="text-gray-400">Welcome back, {getUserDisplayName()}!</p> */}
            </div>
            <div className="justify-center items-center gap-4 flex flex-row-reverse lg:flex-row">
              <div className="grid lg:text-right">
                <p className="text-gray-400 text-lg font-bold lg:hidden">Welcome back</p>
                <span>{getUserDisplayName()}</span>
                <span className="hidden text-[#ffffff8f] capitalize lg:flex">
                  {user.account_type} Account
                  {!user.is_verified && ' (Pending Verification)'}
                </span>
              </div>
              <div className="grid place-items-center text-3xl font-normal bg-[#1678FF] w-12 h-12 rounded-full">
                {getUserInitials()}
              </div>
            </div>
            <MobileNavBar/>
          </div>
        </div>
        
        {/* Account Status Banner */}
        {!user.is_verified && (
          <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto mb-6">
            <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-900/50 rounded-full flex items-center justify-center">
                  <HelpCircle className="text-yellow-400" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-yellow-300">Account Verification Required</h3>
                  <p className="text-yellow-200/80 text-sm">
                    Please verify your email address to access all features. Check your inbox at {user.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    // You can implement resend verification email here
                    alert(`Resend verification email to ${user.email}`);
                  }}
                  className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 rounded-lg text-white text-sm"
                >
                  Resend Email
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Balance Card */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-[#1677ff3a] to-[#1677ff1a] p-6 lg:p-8 rounded-2xl border border-[#1677ff7e]">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="text-center lg:text-left">
                  <div className="text-gray-400 mb-2 text-sm lg:text-base">Total Balance</div>
                  <div className="text-3xl lg:text-5xl font-bold mb-2 text-[#1678FF]">$1,240.50</div>
                  <div className="text-[#ffffffc9] font-semibold text-lg lg:text-xl">= 2,481 BDAG</div>
                  <div className="text-gray-400 text-sm mt-2">
                    Account Type: <span className="capitalize font-medium">{user.account_type}</span>
                  </div>
                </div>
                <div className="flex justify-center lg:justify-end gap-3">
                  <Button 
                    isLink={true} 
                    to={"/send"} 
                    text={"Send"} 
                    className="px-6 lg:px-8 py-3 text-sm lg:text-base"
                  />
                  <Button 
                    isLink={true} 
                    to={"/add"} 
                    text={"Add"} 
                    className="bg-transparent border border-[#1678FF] px-6 lg:px-8 py-3 text-sm lg:text-base hover:bg-[#1678FF]/10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & More Options - Side by side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Quick Actions */}
            <div className="bg-[#0f2b526e] backdrop-blur-sm p-6 rounded-2xl border border-[#12315D]">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <RefreshCw size={20} className="text-blue-400" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
                {quickActions.map((action, i) => (
                  <ActionButton
                    key={i}
                    icon={action.icon}
                    label={action.label}
                    color={action.color}
                    onClick={() => navigate(action.path)}
                  />
                ))}
              </div>
            </div>

            {/* More Options */}
            <div className="bg-[#0f2b526e] backdrop-blur-sm p-6 rounded-2xl border border-[#12315D]">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Settings size={20} className="text-purple-400" />
                More Options
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {moreOptions.map((option, i) => (
                  <ActionButton
                    key={i}
                    icon={option.icon}
                    label={option.label}
                    color={option.color}
                    onClick={() => navigate(option.path)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions - Full width below */}
          <div className="bg-[#0f2b526e] backdrop-blur-sm p-6 rounded-2xl border border-[#12315D]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Recent Transactions</h2>
                <p className="text-gray-400">Your latest financial activity</p>
              </div>
              <button 
                onClick={() => navigate("/transactions")}
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 self-start sm:self-auto"
              >
                <span className="font-medium">View all transactions</span>
                <ExternalLink size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {transactions.map((t) => (
                <div
                  key={t.id}
                  className="bg-[#10305A] hover:bg-[#123660] p-4 rounded-xl flex justify-between items-center transition-all duration-200 cursor-pointer group hover:scale-[1.02]"
                  onClick={() => navigate("/transactions")}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg transition-all duration-200 group-hover:scale-110 ${
                      t.type === "send" ? "bg-red-900/20" :
                      t.type === "receive" ? "bg-green-900/20" :
                      "bg-purple-900/20"
                    }`}>
                      {t.type === "send" && <ArrowUp className="text-red-400" size={20} />}
                      {t.type === "receive" && <ArrowDown className="text-green-400" size={20} />}
                      {t.type === "swap" && <RefreshCw className="text-purple-400" size={20} />}
                    </div>
                    <div>
                      <div className="font-medium">
                        {t.type === "send" && `Sent to ${t.to}`}
                        {t.type === "receive" && `Received from ${t.from}`}
                        {t.type === "swap" && t.action}
                      </div>
                      <div className="text-gray-400 text-sm">{t.time}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`font-bold text-lg ${t.amountColor}`}>
                      {t.amount}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      t.status === "completed" 
                        ? "bg-green-900/30 text-green-400" 
                        : "bg-yellow-900/30 text-yellow-400"
                    }`}>
                      {t.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;