import React, { useState } from "react";
import {
  ChevronLeft,
  User,
  Bell,
  Shield,
  Lock,
  Globe,
  Moon,
  Palette,
  Download,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  Check,
  X,
  Save,
  Trash2,
  RefreshCw,
  Key,
  LogOut,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNavBar from "../components/MobileNavBar";

const Settings = () => {
  const navigate = useNavigate();
  
  // State for settings
  const [settings, setSettings] = useState({
    // Account
    email: "echo085@example.com",
    phoneNumber: "+1 (555) 123-4567",
    twoFactorAuth: true,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    transactionAlerts: true,
    priceAlerts: false,
    
    // Privacy & Security
    biometricAuth: true,
    autoLock: "1min",
    showBalance: true,
    
    // Preferences
    theme: "dark",
    currency: "USD",
    language: "en",
    
    // Wallet
    exportPrivateKey: false,
    clearHistory: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("account");

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      // Show success message
    }, 1000);
  };

  const handleReset = () => {
    setSettings({
      email: "echo085@example.com",
      phoneNumber: "+1 (555) 123-4567",
      twoFactorAuth: true,
      emailNotifications: true,
      pushNotifications: true,
      transactionAlerts: true,
      priceAlerts: false,
      biometricAuth: true,
      autoLock: "1min",
      showBalance: true,
      theme: "dark",
      currency: "USD",
      language: "en",
      exportPrivateKey: false,
      clearHistory: false,
    });
  };

  const sections = [
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "wallet", label: "Wallet", icon: Lock },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="space-y-6">
            <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-xl p-6 border border-[#12315D]">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <User size={20} className="text-blue-400" />
                Account Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Email Address</label>
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-gray-400" />
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                      className="flex-1 bg-[#051837] border border-[#12315D] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Phone Number</label>
                  <div className="flex items-center gap-3">
                    <Smartphone size={18} className="text-gray-400" />
                    <input
                      type="tel"
                      value={settings.phoneNumber}
                      onChange={(e) => setSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="flex-1 bg-[#051837] border border-[#12315D] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#12315D]">
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-gray-400 text-sm">Add an extra layer of security</div>
                  </div>
                  <button
                    onClick={() => handleToggle('twoFactorAuth')}
                    className={`w-12 h-6 rounded-full p-1 flex items-center ${settings.twoFactorAuth ? 'bg-[#1678FF] justify-end' : 'bg-gray-700 justify-start'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-xl p-6 border border-[#12315D]">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Key size={20} className="text-yellow-400" />
                Security
              </h3>
              
              <div className="space-y-4">
                <button className="w-full p-4 bg-[#10305A] hover:bg-[#123660] rounded-xl flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                    <RefreshCw size={20} className="text-blue-400" />
                    <div>
                      <div className="font-medium">Change Password</div>
                      <div className="text-gray-400 text-sm">Update your login password</div>
                    </div>
                  </div>
                  <ChevronLeft className="transform -rotate-90 text-gray-400" size={20} />
                </button>

                <button className="w-full p-4 bg-[#10305A] hover:bg-[#123660] rounded-xl flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                    <LogOut size={20} className="text-red-400" />
                    <div>
                      <div className="font-medium">Log Out All Devices</div>
                      <div className="text-gray-400 text-sm">Sign out from all active sessions</div>
                    </div>
                  </div>
                  <ChevronLeft className="transform -rotate-90 text-gray-400" size={20} />
                </button>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-xl p-6 border border-[#12315D]">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Bell size={20} className="text-yellow-400" />
                Notification Settings
              </h3>
              
              <div className="space-y-6">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Get alerts on your device' },
                  { key: 'transactionAlerts', label: 'Transaction Alerts', desc: 'Get notified for all transactions' },
                  { key: 'priceAlerts', label: 'Price Alerts', desc: 'Receive BDAG price updates' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-gray-400 text-sm">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => handleToggle(item.key)}
                      className={`w-12 h-6 rounded-full p-1 flex items-center ${settings[item.key] ? 'bg-[#1678FF] justify-end' : 'bg-gray-700 justify-start'}`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white"></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-xl p-6 border border-[#12315D]">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Shield size={20} className="text-green-400" />
                Privacy & Security
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Biometric Authentication</div>
                    <div className="text-gray-400 text-sm">Use fingerprint or face ID</div>
                  </div>
                  <button
                    onClick={() => handleToggle('biometricAuth')}
                    className={`w-12 h-6 rounded-full p-1 flex items-center ${settings.biometricAuth ? 'bg-[#1678FF] justify-end' : 'bg-gray-700 justify-start'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                  </button>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Auto Lock Timer</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['30sec', '1min', '5min', 'Never'].map((time) => (
                      <button
                        key={time}
                        onClick={() => setSettings(prev => ({ ...prev, autoLock: time }))}
                        className={`p-3 rounded-lg text-center ${settings.autoLock === time ? 'bg-[#1678FF] text-white' : 'bg-[#10305A] hover:bg-[#123660] text-gray-300'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#12315D]">
                  <div>
                    <div className="font-medium">Show Balance</div>
                    <div className="text-gray-400 text-sm">Display balance on dashboard</div>
                  </div>
                  <button
                    onClick={() => handleToggle('showBalance')}
                    className={`w-12 h-6 rounded-full p-1 flex items-center ${settings.showBalance ? 'bg-[#1678FF] justify-end' : 'bg-gray-700 justify-start'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-6">
            <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-xl p-6 border border-[#12315D]">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Palette size={20} className="text-purple-400" />
                Preferences
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-400 mb-2">Theme</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'dark', label: 'Dark', icon: Moon },
                      { id: 'light', label: 'Light', icon: '☀️' },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setSettings(prev => ({ ...prev, theme: theme.id }))}
                        className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 ${settings.theme === theme.id ? 'border-[#1678FF] bg-[#1678FF]/10' : 'border-[#12315D] bg-[#10305A] hover:border-[#1a4275]'}`}
                      >
                        <span className="text-lg">{theme.icon}</span>
                        <span>{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Default Currency</label>
                  <div className="relative">
                    <select
                      value={settings.currency}
                      onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full bg-[#051837] border border-[#12315D] rounded-lg p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="BDAG">BDAG - BlockDAG</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                    <ChevronLeft className="absolute right-3 top-1/2 transform -translate-y-1/2 -rotate-90 text-gray-400" size={20} />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Language</label>
                  <div className="relative">
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full bg-[#051837] border border-[#12315D] rounded-lg p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                    <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "wallet":
        return (
          <div className="space-y-6">
            <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-xl p-6 border border-[#12315D]">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Lock size={20} className="text-red-400" />
                Wallet Management
              </h3>
              
              <div className="space-y-4">
                <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm">
                      <div className="font-medium text-yellow-300 mb-1">Warning</div>
                      <div className="text-yellow-400/80">
                        These actions are irreversible. Make sure you understand the consequences before proceeding.
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full p-4 bg-[#10305A] hover:bg-[#123660] rounded-xl flex items-center justify-between transition-colors group">
                  <div className="flex items-center gap-3">
                    <Download size={20} className="text-blue-400" />
                    <div>
                      <div className="font-medium">Export Private Key</div>
                      <div className="text-gray-400 text-sm">Securely backup your wallet</div>
                    </div>
                  </div>
                  <ChevronLeft className="transform -rotate-90 text-gray-400 group-hover:text-white" size={20} />
                </button>

                <button className="w-full p-4 bg-[#10305A] hover:bg-[#123660] rounded-xl flex items-center justify-between transition-colors group">
                  <div className="flex items-center gap-3">
                    <Trash2 size={20} className="text-red-400" />
                    <div>
                      <div className="font-medium">Clear Transaction History</div>
                      <div className="text-gray-400 text-sm">Remove all transaction records</div>
                    </div>
                  </div>
                  <ChevronLeft className="transform -rotate-90 text-gray-400 group-hover:text-white" size={20} />
                </button>

                <button className="w-full p-4 bg-red-900/20 hover:bg-red-900/30 border border-red-800/30 rounded-xl flex items-center justify-between transition-colors group">
                  <div className="flex items-center gap-3">
                    <Trash2 size={20} className="text-red-400" />
                    <div>
                      <div className="font-medium text-red-400">Delete Wallet</div>
                      <div className="text-red-400/70 text-sm">Permanently delete your wallet</div>
                    </div>
                  </div>
                  <ChevronLeft className="transform -rotate-90 text-red-400 group-hover:text-red-300" size={20} />
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex text-white min-h-screen">
      <Sidebar />
      
      <div className="flex-1">
        <div className="flex items-center sticky top-0 z-99999 bg-[#111827] border-b border-[#1677ff1c] gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#0f2b526e] rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className='py-4'>
            <h1 className="text-2xl font-bold mb-1">Settings</h1>
            <p className="text-gray-400">Manage your account preferences and security</p>
          </div>
          <MobileNavBar/>
        </div>

        <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-xl border border-[#12315D] overflow-hidden">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full p-4 flex items-center gap-3 transition-colors ${
                        activeSection === section.id 
                          ? 'bg-[#1678FF]/10 border-r-4 border-[#1678FF]' 
                          : 'hover:bg-[#10305A]'
                      }`}
                    >
                      <Icon size={20} className={
                        activeSection === section.id ? 'text-[#1678FF]' : 'text-gray-400'
                      } />
                      <span className={
                        activeSection === section.id ? 'text-white font-medium' : 'text-gray-300'
                      }>
                        {section.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {renderContent()}
              
              {/* Save/Reset Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 py-3 px-6 bg-[#1678FF] hover:bg-[#1a6eff] rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="animate-spin" size={20} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  className="py-3 px-6 bg-[#10305A] hover:bg-[#123660] border border-[#12315D] rounded-xl font-medium transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;