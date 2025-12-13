// src/components/Sidebar.jsx
import React from 'react';
import { 
  Menu, 
  X, 
  Home,
  Send,
  Download,
  RefreshCw,
  PieChart,
  DollarSign,
  Settings as SettingsIcon,
  User,
  LogOut,
  ChevronRight
} from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Send, label: 'Send', path: '/send' },
    { icon: Download, label: 'Receive', path: '/receive' },
    { icon: RefreshCw, label: 'Swap', path: '/swap' },
    { icon: DollarSign, label: 'Lending', path: '/lend' },
    { icon: PieChart, label: 'Stake', path: '/stake' },
  ];

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Send, label: "Send", path: "/send" },
    { icon: Download, label: "Receive", path: "/receive" },
    { icon: RefreshCw, label: "Swap", path: "/swap" },
    { icon: PieChart, label: "Stake", path: "/stake" },
    { icon: DollarSign, label: "Lend", path: "/lending" },
    { icon: SettingsIcon, label: "Settings", path: "/settings" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="hidden lg:flex flex-col w-72 bg-gradient-to-b from-[#0A1F44] via-[#0C244C] to-[#09213E] p-2 border-r border-[#1E3A70]/30 h-screen sticky top-0 shadow-2xl shadow-black/30">
      {/* Logo Section with Modern Design */}
      <div className="flex items-center gap-4 pl-3 pt-3 flex-shrink-0 border-b border-[#1E3A70] pb-5">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-[#1678FF] via-[#4A90E2] to-[#1678FF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1678FF]/30">
            <span className="text-white font-bold text-lg">DP</span>
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1678FF]/20 to-transparent rounded-2xl blur-sm"></div>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            DAGPay
          </span>
          <span className="text-xs text-[#8CA6DB] font-medium">Blockchain Payments</span>
        </div>
      </div>
      
      {/* Navigation Menu with Modern Cards */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto hover-scrollbar scrollbar-hidden pt-2 px-2">
        <div className="mb-4 pl-3 flex-shrink-0">
          <span className="text-xs uppercase tracking-wider text-[#8CA6DB] font-semibold">Navigation</span>
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 flex-shrink-0
                ${isActive 
                  ? 'bg-gradient-to-r from-[#1678FF] to-[#4A90E2] text-white shadow-lg shadow-[#1678FF]/40' 
                  : 'bg-[#0F2B52]/60 hover:bg-[#10305A]/80 text-gray-300 hover:text-white'
                }
                hover:translate-x-1 hover:shadow-lg active:scale-[0.98]
                before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:rounded-r-full
                ${isActive ? 'before:bg-white' : 'before:bg-transparent group-hover:before:bg-[#1678FF]/50'}
              `}
            >
              <span className={`
                text-xl transition-transform duration-300
                ${isActive ? 'scale-110' : 'group-hover:scale-110'}
              `}>
                <Icon size={20}/>
              </span>
              <span className="font-medium text-sm tracking-wide">{item.label}</span>
              {isActive && (
                <div className="ml-auto animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full shadow-lg shadow-white"></div>
                </div>
              )}
              {!isActive && (
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-1 h-1 bg-[#1678FF] rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
        
        {/* Add padding to ensure content doesn't hide behind fixed bottom */}
        <div className="h-32 flex-shrink-0"></div>
      </div>
      
      {/* Fixed Bottom Section with User & Logout */}
      <div className="mt-auto px-2 border-t border-[#1E3A70]/30 bg-gradient-to-t from-[#0A1F44] via-[#0C244C] to-transparent">
        {/* User Info Card */}
        
        
        {/* Logout Button */}
        <div className=" pt-6 border-t border-[#12315D]">
          <button 
            className="w-full flex items-center gap-3 p-3 font-semibold text-[#ff3939] hover:bg-red-900/20 rounded-lg transition-colors"
            onClick={()=>{
              logout();
              navigate('/');
            }}
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#1678FF]/20 to-transparent"></div>
    </div>
  );
};

export default Sidebar;