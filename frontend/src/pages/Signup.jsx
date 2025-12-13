// Updated SignUpPage.js
import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Building, 
  CheckCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { api, setAuthToken } from '../utils/api';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('individual');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');

  // Individual form state
  const [individualForm, setIndividualForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Organization form state
  const [organizationForm, setOrganizationForm] = useState({
    organizationName: '',
    organizationEmail: '',
    cacNumber: '',
    contactPerson: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Validation errors
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const validateIndividualForm = () => {
    const newErrors = {};
    
    if (!individualForm.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!individualForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(individualForm.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!individualForm.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!individualForm.password) {
      newErrors.password = 'Password is required';
    } else if (individualForm.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!individualForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (individualForm.password !== individualForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOrganizationForm = () => {
    const newErrors = {};
    
    if (!organizationForm.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }
    
    if (!organizationForm.organizationEmail.trim()) {
      newErrors.organizationEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(organizationForm.organizationEmail)) {
      newErrors.organizationEmail = 'Email is invalid';
    }
    
    if (!organizationForm.cacNumber.trim()) {
      newErrors.cacNumber = 'CAC number is required';
    }
    
    if (!organizationForm.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    
    if (!organizationForm.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!organizationForm.password) {
      newErrors.password = 'Password is required';
    } else if (organizationForm.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!organizationForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (organizationForm.password !== organizationForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleIndividualChange = (field, value) => {
    setIndividualForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleOrganizationChange = (field, value) => {
    setOrganizationForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    let isValid = false;
    let formData = {};
    
    if (role === 'individual') {
      isValid = validateIndividualForm();
      formData = {
        account_type: 'individual',
        email: individualForm.email,
        phone: individualForm.phone,
        password: individualForm.password,
        full_name: individualForm.fullName
      };
    } else {
      isValid = validateOrganizationForm();
      formData = {
        account_type: 'organization',
        email: organizationForm.organizationEmail,
        phone: organizationForm.phone,
        password: organizationForm.password,
        organization_name: organizationForm.organizationName,
        cac_number: organizationForm.cacNumber,
        contact_person: organizationForm.contactPerson,
        organization_email: organizationForm.organizationEmail
      };
    }
    
    if (!isValid) return;
    
    setIsLoading(true);
    
    try {
      const response = await api.signup(formData);
      
      if (!response.success) {
        throw new Error(response.error || 'Signup failed');
      }
      
      // Store the token if provided
      if (response.token) {
        setAuthToken(response.token);
      }
      
      // Store verification token for development mode
      if (response.verification_token) {
        setVerificationToken(response.verification_token);
      }
      
      setIsLoading(false);
      setStep(4); // Success step
      
    } catch (error) {
      setIsLoading(false);
      setApiError(error.message || 'An error occurred during signup');
      console.error('Signup error:', error);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationToken) return;
    
    setIsLoading(true);
    try {
      await api.verifyEmail(verificationToken);
      // Redirect to login after successful verification
      navigate('/login', { 
        state: { message: 'Email verified successfully! You can now login.' }
      });
    } catch (error) {
      setApiError(error.message || 'Failed to verify email');
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Join DAGPay</h2>
            <p className="text-gray-400 mb-8">Select your account type to get started</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => {
                  setRole('individual');
                  setStep(2);
                }}
                className="p-6 bg-gradient-to-br from-[#030D43]/30 to-[#000000]/30 rounded-2xl border border-[#12315D] hover:border-[#1678FF] transition-all hover:scale-[1.02]"
              >
                <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-blue-400" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Individual</h3>
                <p className="text-gray-400 text-sm">
                  For personal use, sending and receiving payments
                </p>
              </button>
              
              <button
                onClick={() => {
                  setRole('organization');
                  setStep(3);
                }}
                className="p-6 bg-gradient-to-br from-[#030D43]/30 to-[#000000]/30 rounded-2xl border border-[#12315D] hover:border-[#1678FF] transition-all hover:scale-[1.02]"
              >
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="text-purple-400" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Organization</h3>
                <p className="text-gray-400 text-sm">
                  For businesses, merchants, and organizations
                </p>
              </button>
            </div>
            
            <div className="mt-8">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-[#1678FF] hover:text-[#1a6eff] font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <div className="mb-8">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
              >
                <ArrowLeft size={20} />
                Back
              </button>
              <h2 className="text-3xl font-bold mb-2">Individual Registration</h2>
              <p className="text-gray-400">Create your personal DAGPay account</p>
            </div>
            
            {apiError && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
                <p className="text-red-400 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {apiError}
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-gray-400 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    value={individualForm.fullName}
                    onChange={(e) => handleIndividualChange('fullName', e.target.value)}
                    placeholder="John Doe"
                    className={`w-full bg-[#030D43]/30 border ${errors.fullName ? 'border-red-500' : 'border-[#12315D]'} rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#1678FF]`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="email"
                    value={individualForm.email}
                    onChange={(e) => handleIndividualChange('email', e.target.value)}
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

              {/* Phone */}
              <div>
                <label className="block text-gray-400 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="tel"
                    value={individualForm.phone}
                    onChange={(e) => handleIndividualChange('phone', e.target.value)}
                    placeholder="+1 234 567 8900"
                    className={`w-full bg-[#030D43]/30 border ${errors.phone ? 'border-red-500' : 'border-[#12315D]'} rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#1678FF]`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={individualForm.password}
                    onChange={(e) => handleIndividualChange('password', e.target.value)}
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
                <p className="text-gray-400 text-sm mt-2">Minimum 8 characters with letters and numbers</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-400 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={individualForm.confirmPassword}
                    onChange={(e) => handleIndividualChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-[#030D43]/30 border ${errors.confirmPassword ? 'border-red-500' : 'border-[#12315D]'} rounded-xl p-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#1678FF]`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (errors.terms) {
                      setErrors(prev => ({ ...prev, terms: null }));
                    }
                  }}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  I agree to the{' '}
                  <a href="#" className="text-[#1678FF] hover:text-[#1a6eff]">
                    Terms and Conditions
                  </a>
                  {' '}and{' '}
                  <a href="#" className="text-[#1678FF] hover:text-[#1a6eff]">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.terms}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#1678FF] to-[#1a6eff] hover:from-[#1a6eff] hover:to-[#1e7bff] rounded-xl font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-[#1678FF] hover:text-[#1a6eff] font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <div className="mb-8">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
              >
                <ArrowLeft size={20} />
                Back
              </button>
              <h2 className="text-3xl font-bold mb-2">Organization Registration</h2>
              <p className="text-gray-400">Create your organization DAGPay account</p>
            </div>
            
            {apiError && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
                <p className="text-red-400 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {apiError}
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization Name */}
              <div>
                <label className="block text-gray-400 mb-2">Organization Name</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    value={organizationForm.organizationName}
                    onChange={(e) => handleOrganizationChange('organizationName', e.target.value)}
                    placeholder="Acme Corporation"
                    className={`w-full bg-[#030D43]/30 border ${errors.organizationName ? 'border-red-500' : 'border-[#12315D]'} rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#1678FF]`}
                  />
                </div>
                {errors.organizationName && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.organizationName}
                  </p>
                )}
              </div>

              {/* CAC Number */}
              <div>
                <label className="block text-gray-400 mb-2">CAC Registration Number</label>
                <div className="relative">
                  <CheckCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    value={organizationForm.cacNumber}
                    onChange={(e) => handleOrganizationChange('cacNumber', e.target.value)}
                    placeholder="RC 1234567"
                    className={`w-full bg-[#030D43]/30 border ${errors.cacNumber ? 'border-red-500' : 'border-[#12315D]'} rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#1678FF]`}
                  />
                </div>
                {errors.cacNumber && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.cacNumber}
                  </p>
                )}
              </div>

              {/* Organization Email */}
              <div>
                <label className="block text-gray-400 mb-2">Organization Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="email"
                    value={organizationForm.organizationEmail}
                    onChange={(e) => handleOrganizationChange('organizationEmail', e.target.value)}
                    placeholder="admin@organization.com"
                    className={`w-full bg-[#030D43]/30 border ${errors.organizationEmail ? 'border-red-500' : 'border-[#12315D]'} rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#1678FF]`}
                  />
                </div>
                {errors.organizationEmail && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.organizationEmail}
                  </p>
                )}
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-gray-400 mb-2">Contact Person</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    value={organizationForm.contactPerson}
                    onChange={(e) => handleOrganizationChange('contactPerson', e.target.value)}
                    placeholder="John Doe"
                    className={`w-full bg-[#030D43]/30 border ${errors.contactPerson ? 'border-red-500' : 'border-[#12315D]'} rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#1678FF]`}
                  />
                </div>
                {errors.contactPerson && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.contactPerson}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-400 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="tel"
                    value={organizationForm.phone}
                    onChange={(e) => handleOrganizationChange('phone', e.target.value)}
                    placeholder="+1 234 567 8900"
                    className={`w-full bg-[#030D43]/30 border ${errors.phone ? 'border-red-500' : 'border-[#12315D]'} rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#1678FF]`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={organizationForm.password}
                    onChange={(e) => handleOrganizationChange('password', e.target.value)}
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

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-400 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={organizationForm.confirmPassword}
                    onChange={(e) => handleOrganizationChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-[#030D43]/30 border ${errors.confirmPassword ? 'border-red-500' : 'border-[#12315D]'} rounded-xl p-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#1678FF]`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="org-terms"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (errors.terms) {
                      setErrors(prev => ({ ...prev, terms: null }));
                    }
                  }}
                  className="mt-1"
                />
                <label htmlFor="org-terms" className="text-sm text-gray-400">
                  I agree to the{' '}
                  <a href="#" className="text-[#1678FF] hover:text-[#1a6eff]">
                    Terms and Conditions
                  </a>
                  {' '}and{' '}
                  <a href="#" className="text-[#1678FF] hover:text-[#1a6eff]">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.terms}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#1678FF] to-[#1a6eff] hover:from-[#1a6eff] hover:to-[#1e7bff] rounded-xl font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Creating Account...
                  </>
                ) : (
                  'Create Organization Account'
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-[#1678FF] hover:text-[#1a6eff] font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        );

      // In SignUpPage.js, update the success step (case 4)
      case 4:
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-400" size={40} />
            </div>
            <h2 className="text-3xl font-bold mb-4">Account Created Successfully!</h2>
            <p className="text-gray-400 mb-8">
              {role === 'individual' 
                ? 'Your personal DAGPay account has been created successfully.'
                : 'Your organization DAGPay account has been created successfully.'}
            </p>
            
            <div className="bg-[#030D43]/30 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="text-blue-400" size={24} />
                <div className="text-left">
                  <p className="text-gray-400 mb-1">Verification email sent to:</p>
                  <p className="text-xl font-medium">
                    {role === 'individual' ? individualForm.email : organizationForm.organizationEmail}
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={18} />
                  <div className="text-sm text-blue-300">
                    Please check your inbox (and spam folder) for the verification email.
                    Click the link in the email to activate your account.
                  </div>
                </div>
              </div>
              
              {/* Development mode warning */}
              {process.env.NODE_ENV === 'development' && verificationToken && (
                <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                  <p className="text-yellow-400 text-sm mb-2">⚠️ Development Mode</p>
                  <p className="text-yellow-300 text-xs">
                    In development, emails aren't actually sent. For testing:<br />
                    1. Copy this token: <code className="bg-black/30 p-1 rounded">{verificationToken.substring(0, 20)}...</code><br />
                    2. Visit: <Link to={`/verify-email/${verificationToken}`} className="underline">/verify-email/{verificationToken.substring(0, 20)}...</Link>
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-gradient-to-r from-[#1678FF] to-[#1a6eff] hover:from-[#1a6eff] hover:to-[#1e7bff] rounded-xl font-medium text-lg transition-all"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-4 bg-[#030D43]/30 hover:bg-[#030D43]/50 border border-[#12315D] rounded-xl font-medium text-lg transition-all"
              >
                Back to Home
              </button>
            </div>
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
          {renderStep()}
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

export default SignUpPage;