import React from 'react';
import { Construction, ArrowLeft, Home, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileNavBar from '../components/MobileNavBar';

const UnderDevelopmentPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex text-white min-h-screen">
      <Sidebar />
      
      <div className="flex-1">
        <div className="flex items-center sticky top-0 z-99999 bg-[#111827] border-b border-[#1677ff1c] gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#0f2b526e] rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className='py-4'>
            <h1 className="text-2xl font-bold mb-1">Under Development</h1>
            <p className="text-gray-400">This feature is coming soon</p>
          </div>
          <MobileNavBar />
        </div>

        <div className="p-4 md:p-6 lg:p-10">
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-8 border border-[#12315D] text-center">
              <div className="w-32 h-32 bg-[#10305A] rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-[#1677ff1c]">
                <Construction className="text-[#1678FF]" size={64} />
              </div>
              
              <h2 className="text-3xl font-bold mb-4">Page Under Construction</h2>
              
              <p className="text-gray-300 mb-8 text-lg">
                We're currently building this page. Our team is working hard to bring you 
                an amazing experience. Please check back soon!
              </p>
              
              <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-xl p-4 mb-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Wrench className="text-yellow-400" size={20} />
                  <span className="text-yellow-300 font-medium">Development in Progress</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Estimated completion: <span className="font-medium">January 2024</span>
                </p>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-3 px-6 rounded-xl font-medium bg-[#1678FF] hover:bg-[#1a6eff] transition-colors flex items-center justify-center gap-2"
                >
                  <Home size={20} />
                  Return to Dashboard
                </button>
                
                <button
                  onClick={() => navigate(-1)}
                  className="w-full py-3 px-6 rounded-xl font-medium bg-[#10305A] hover:bg-[#123660] border border-[#12315D] transition-colors"
                >
                  Go Back
                </button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-[#12315D]">
                <p className="text-gray-400 text-sm">
                  Need immediate assistance? Contact support@blockdagpay.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopmentPage;