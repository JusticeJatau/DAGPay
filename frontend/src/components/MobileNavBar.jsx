import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const MobileNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Send, label: "Send", path: "/send" },
    { icon: Download, label: "Receive", path: "/receive" },
    { icon: RefreshCw, label: "Swap", path: "/swap" },
    { icon: PieChart, label: "Stake", path: "/stake" },
    { icon: DollarSign, label: "Lend", path: "/lend" },
    { icon: SettingsIcon, label: "Settings", path: "/settings" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="mobile-nav lg:hidden top-4 ml-auto mr-5">
      {/* Mobile Toggle Button - Only visible on mobile and md screens */}
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-[#0f2b526e] backdrop-blur-sm border border-[#12315D] rounded-lg text-white hover:bg-[#10305A] transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="absolute left-0 top-0 h-full w-64 bg-[#111827] border-r border-[#12315D] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Info */}
            <div className="p-6 border-b border-[#12315D]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1678FF] to-[#1a6eff] flex items-center justify-center">
                  <span className="font-bold">E</span>
                </div>
                <div>
                  <div className="font-bold">Echo085</div>
                  <div className="text-gray-400 text-sm">Premium User</div>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="p-4">
              <div className="space-y-1">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = window.location.pathname === item.path;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        navigate(item.path);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-[#1678FF]/10 text-[#1678FF]' 
                          : 'text-gray-300 hover:bg-[#10305A]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight size={16} />
                    </button>
                  );
                })}
              </div>

              {/* Logout Button */}
              <div className="mt-8 pt-6 border-t border-[#12315D]">
                <button 
                  className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavBar;