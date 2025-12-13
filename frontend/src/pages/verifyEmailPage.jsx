// src/components/VerifyEmailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  MailCheck,
  AlertCircle
} from 'lucide-react';
import { api } from '../utils/api';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('No verification token provided');
        setLoading(false);
        return;
      }

      try {
        const response = await api.verifyEmail(token);
        
        setSuccess(true);
        setMessage(response.message || 'Email verified successfully!');
        
        // Store token if provided
        if (response.token) {
          localStorage.setItem('dagpay_token', response.token);
        }
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
        
      } catch (err) {
        setError(err.message || 'Failed to verify email');
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030D43] to-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-[#1678FF] text-white font-bold px-3 py-2 rounded-lg text-xl">
              DP
            </div>
            <span className="text-2xl font-semibold">DAGPay</span>
          </div>
          <p className="text-gray-400">Email Verification</p>
        </div>

        {/* Verification Container */}
        <div className="bg-gradient-to-br from-[#030D43]/30 to-black/30 backdrop-blur-sm rounded-2xl p-8 border border-[#12315D] shadow-2xl text-center">
          {loading ? (
            <div>
              <div className="w-20 h-20 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="text-blue-400 animate-spin" size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Verifying Your Email</h2>
              <p className="text-gray-400">Please wait while we verify your email address...</p>
            </div>
          ) : success ? (
            <div>
              <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-400" size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Verification Successful!</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <MailCheck className="text-green-400" size={20} />
                  <div className="text-left">
                    <div className="font-medium text-green-300">Account Activated</div>
                    <div className="text-green-400/80 text-sm">
                      You can now access all features of DAGPay
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-gray-400 text-sm">
                Redirecting to dashboard...
              </div>
              <div className="mt-6">
                <Link
                  to="/dashboard"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-[#1678FF] to-[#1a6eff] hover:from-[#1a6eff] hover:to-[#1e7bff] rounded-xl font-medium transition-all"
                >
                  Go to Dashboard Now
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="text-red-400" size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Verification Failed</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-400" size={20} />
                  <div className="text-left">
                    <div className="font-medium text-red-300">Possible Issues</div>
                    <div className="text-red-400/80 text-sm">
                      • Link expired (valid for 24 hours)<br />
                      • Already verified<br />
                      • Invalid verification link
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 bg-gradient-to-r from-[#1678FF] to-[#1a6eff] hover:from-[#1a6eff] hover:to-[#1e7bff] rounded-xl font-medium transition-all"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full py-3 bg-[#030D43]/30 hover:bg-[#030D43]/50 border border-[#12315D] rounded-xl font-medium transition-all"
                >
                  Create New Account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 DAGPay. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;