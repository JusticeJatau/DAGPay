import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  Eye,
  EyeOff,
  CheckCircle,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Key,
  Shield,
  ChevronLeft
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  // Forgot password state
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [verificationSent, setVerificationSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Steps for forgot password
  const [step, setStep] = useState(1);

  // Check for success message from location state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear location state
      window.history.replaceState({}, document.title);
    }
    
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [location, isAuthenticated, navigate]);

  const validateLoginForm = () => {
    const newErrors = {};
    
    if (!loginForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!loginForm.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForgotPasswordForm = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!forgotPasswordForm.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(forgotPasswordForm.email)) {
        newErrors.email = 'Email is invalid';
      }
    }
    
    if (step === 2) {
      if (!forgotPasswordForm.verificationCode.trim()) {
        newErrors.verificationCode = 'Verification code is required';
      }
    }
    
    if (step === 3) {
      if (!forgotPasswordForm.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (forgotPasswordForm.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      
      if (!forgotPasswordForm.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (forgotPasswordForm.newPassword !== forgotPasswordForm.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateLoginForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await login(loginForm.email, loginForm.password);
      
      if (result.success) {
        // Remember me functionality
        if (rememberMe) {
          // Store email for future logins (optional)
          localStorage.setItem('dagpay_remembered_email', loginForm.email);
        } else {
          localStorage.removeItem('dagpay_remembered_email');
        }
        
        // Redirect to intended page or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setApiError(result.error || 'Login failed');
      }
    } catch (error) {
      setApiError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForgotPasswordForm()) return;
    
    setIsLoading(true);
    
    try {
      if (step === 1) {
        // Send forgot password email
        const response = await api.forgotPassword(forgotPasswordForm.email);
        
        if (response.success) {
          setVerificationSent(true);
          setStep(2);
          setApiError('');
        } else {
          setApiError(response.error || 'Failed to send reset email');
        }
      } else if (step === 2) {
        // In a real app, you'd verify the code with your backend
        // For now, we'll simulate it
        if (forgotPasswordForm.verificationCode === '1234') {
          setEmailVerified(true);
          setStep(3);
          setApiError('');
        } else {
          setApiError('Invalid verification code');
        }
      } else if (step === 3) {
        // Reset password
        const response = await api.resetPassword(
          'temporary_token', // In real app, get this from step 1 response
          forgotPasswordForm.newPassword
        );
        
        if (response.success) {
          setStep(4);
          // Reset form after success
          setTimeout(() => {
            setMode('login');
            setStep(1);
            setForgotPasswordForm({
              email: '',
              verificationCode: '',
              newPassword: '',
              confirmPassword: ''
            });
            setVerificationSent(false);
            setEmailVerified(false);
          }, 3000);
        } else {
          setApiError(response.error || 'Failed to reset password');
        }
      }
    } catch (error) {
      setApiError(error.response?.data?.error || error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginChange = (field, value) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleForgotPasswordChange = (field, value) => {
    setForgotPasswordForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Pre-fill email if remembered
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('dagpay_remembered_email');
    if (rememberedEmail) {
      setLoginForm(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const renderLoginMode = () => (
    <div>
      {successMessage && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-700/50 rounded-xl">
          <p className="text-green-400 flex items-center gap-2">
            <CheckCircle size={16} />
            {successMessage}
          </p>
        </div>
      )}
      
      <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
      <p className="text-gray-400 mb-8">Sign in to your DAGPay account</p>
      
      {apiError && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
          <p className="text-red-400 flex items-center gap-2">
            <AlertCircle size={16} />
            {apiError}
          </p>
        </div>
      )}
      
      <form onSubmit={handleLogin} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-gray-400 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => handleLoginChange('email', e.target.value)}
              placeholder="john@example.com"
              className={`w-full bg-[#030D43]/30 border ${errors.email ? 'border-red-500' : 'border-[#12315D]'} rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#1678FF]`}
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-gray-400">Password</label>
            <button
              type="button"
              onClick={() => setMode('forgot-password')}
              className="text-[#1678FF] hover:text-[#1a6eff] text-sm"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              value={loginForm.password}
              onChange={(e) => handleLoginChange('password', e.target.value)}
              placeholder="••••••••"
              className={`w-full bg-[#030D43]/30 border ${errors.password ? 'border-red-500' : 'border-[#12315D]'} rounded-xl p-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#1678FF]`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="remember" className="text-gray-400">
              Remember me
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-[#1678FF] to-[#1a6eff] hover:from-[#1a6eff] hover:to-[#1e7bff] rounded-xl font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
      
      <div className="mt-8 text-center">
        <p className="text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#1678FF] hover:text-[#1a6eff] font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );

  const renderForgotPasswordMode = () => {
    switch (step) {
      case 1: // Email Input
        return (
          <div>
            <div className="mb-8">
              <button
                onClick={() => setMode('login')}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
              >
                <ArrowLeft size={20} />
                Back to Login
              </button>
              <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
              <p className="text-gray-400">Enter your email to receive a verification code</p>
            </div>
            
            {apiError && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
                <p className="text-red-400 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {apiError}
                </p>
              </div>
            )}
            
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm">
                    <div className="font-medium text-blue-300 mb-1">Security Check</div>
                    <div className="text-blue-400/80">
                      We'll send a verification code to your email address.
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="email"
                    value={forgotPasswordForm.email}
                    onChange={(e) => handleForgotPasswordChange('email', e.target.value)}
                    placeholder="john@example.com"
                    className={`w-full bg-[#030D43]/30 border ${errors.email ? 'border-red-500' : 'border-[#12315D]'} rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#1678FF]`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#1678FF] to-[#1a6eff] hover:from-[#1a6eff] hover:to-[#1e7bff] rounded-xl font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Sending Code...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </form>
          </div>
        );

      case 2: // Verification Code
        return (
          <div>
            <div className="mb-8">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
              >
                <ChevronLeft size={20} />
                Back
              </button>
              <h2 className="text-3xl font-bold mb-2">Enter Verification Code</h2>
              <p className="text-gray-400">
                We sent a code to <span className="font-medium">{forgotPasswordForm.email}</span>
              </p>
            </div>
            
            {apiError && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
                <p className="text-red-400 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {apiError}
                </p>
              </div>
            )}
            
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="text-center">
                <div className="flex justify-center gap-3 mb-6">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={index} className="relative">
                      <input
                        type="text"
                        maxLength={1}
                        value={forgotPasswordForm.verificationCode[index - 1] || ''}
                        onChange={(e) => {
                          const newCode = forgotPasswordForm.verificationCode.split('');
                          newCode[index - 1] = e.target.value.replace(/\D/g, '');
                          handleForgotPasswordChange('verificationCode', newCode.join(''));
                          
                          // Auto-focus next input
                          if (e.target.value && index < 4) {
                            document.getElementById(`code-${index + 1}`)?.focus();
                          }
                        }}
                        id={`code-${index}`}
                        className="w-16 h-16 bg-[#030D43]/30 border border-[#12315D] rounded-xl text-2xl text-center focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
                      />
                    </div>
                  ))}
                </div>
                
                {errors.verificationCode && (
                  <p className="text-red-400 text-sm mt-2 flex items-center justify-center gap-1">
                    <AlertCircle size={14} />
                    {errors.verificationCode}
                  </p>
                )}
                
                <div className="text-gray-400 text-sm mt-4">
                  Code expires in <span className="text-yellow-400 font-medium">04:59</span>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    // Resend code logic
                    handleForgotPassword({ preventDefault: () => {} });
                  }}
                  className="text-[#1678FF] hover:text-[#1a6eff] text-sm"
                >
                  Didn't receive code? Resend
                </button>
              </div>
              
              <button
                type="submit"
                disabled={isLoading || forgotPasswordForm.verificationCode.length !== 4}
                className="w-full py-4 bg-gradient-to-r from-[#1678FF] to-[#1a6eff] hover:from-[#1a6eff] hover:to-[#1e7bff] rounded-xl font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </button>
            </form>
          </div>
        );

      case 3: // New Password
        return (
          <div>
            <div className="mb-8">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
              >
                <ChevronLeft size={20} />
                Back
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-400" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Email Verified</h2>
                  <p className="text-gray-400 text-sm">Now create your new password</p>
                </div>
              </div>
            </div>
            
            {apiError && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
                <p className="text-red-400 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {apiError}
                </p>
              </div>
            )}
            
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2">New Password</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={forgotPasswordForm.newPassword}
                    onChange={(e) => handleForgotPasswordChange('newPassword', e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-[#030D43]/30 border ${errors.newPassword ? 'border-red-500' : 'border-[#12315D]'} rounded-xl p-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#1678FF]`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.newPassword}
                  </p>
                )}
                <p className="text-gray-400 text-sm mt-2">Minimum 8 characters with letters and numbers</p>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Confirm New Password</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={forgotPasswordForm.confirmPassword}
                    onChange={(e) => handleForgotPasswordChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-[#030D43]/30 border ${errors.confirmPassword ? 'border-red-500' : 'border-[#12315D]'} rounded-xl p-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#1678FF]`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#1678FF] to-[#1a6eff] hover:from-[#1a6eff] hover:to-[#1e7bff] rounded-xl font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Updating Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </div>
        );

      case 4: // Success
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-400" size={40} />
            </div>
            <h2 className="text-3xl font-bold mb-4">Password Reset Successful!</h2>
            <p className="text-gray-400 mb-8">
              Your password has been updated successfully. You can now sign in with your new password.
            </p>
            <button
              onClick={() => setMode('login')}
              className="w-full py-4 bg-gradient-to-r from-[#1678FF] to-[#1a6eff] hover:from-[#1a6eff] hover:to-[#1e7bff] rounded-xl font-medium text-lg transition-all"
            >
              Sign In Now
            </button>
          </div>
        );

      default:
        return null;
    }
  };

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
          <p className="text-gray-400">Secure Your Data, Secure Yourself</p>
        </div>

        {/* Form Container */}
        <div className="bg-gradient-to-br from-[#030D43]/30 to-black/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#12315D] shadow-2xl">
          {mode === 'login' ? renderLoginMode() : renderForgotPasswordMode()}
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

export default LoginPage;