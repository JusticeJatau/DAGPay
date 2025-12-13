import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  QrCode, 
  Grid2x2, 
  Smartphone, 
  Copy, 
  Share2, 
  Download, 
  Clock,
  CheckCircle,
  X,
  RefreshCw,
  Loader2,
  Printer,
  ChevronDown,
  Check,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileNavBar from '../components/MobileNavBar';

const ReceivePage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1); // 1-5 steps
  const [selectedMethod, setSelectedMethod] = useState(''); // qr, otp, ussd
  const [generatedCode, setGeneratedCode] = useState('000000');
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('waiting');
  const [qrImage, setQRImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Single state for all form data
  const [details, setDetails] = useState({
    merchant_id: localStorage.getItem("id") || "user_123",
    wallet_address: "0x123456789abcdef", // Hardcoded for now
    amount: "",
    currency: "USD",
    type: "", // This will be set from selectedMethod
    memo: "",
    expiry_minutes: 10,
    merchant: "Echo085",
    //network: "BlockDAG",
  });

  const steps = [
    { number: 1, label: 'Choose Method' },
    { number: 2, label: 'Create Request' },
    { number: 3, label: 'Share' },
    { number: 4, label: 'Processing' },
    { number: 5, label: 'Complete' }
  ];

  const receiveMethods = [
    { 
      id: 'qr', 
      icon: QrCode, 
      label: 'QR Code', 
      description: 'Customer scans your QR code to pay instantly',
      color: 'text-blue-400'
    },
    { 
      id: 'otp', 
      icon: Grid2x2, 
      label: 'Generate OTP', 
      description: 'Create a 6-digit OTP for customer to enter',
      color: 'text-green-400'
    },
    // { 
    //   id: 'ussd', 
    //   icon: Smartphone, 
    //   label: 'USSD Code', 
    //   description: 'Share USSD code for underbanked users',
    //   color: 'text-purple-400'
    // }    //if needed in the future, uncomment and edit the payments.js file inn th ebackend dir to access USSD tooand not just type === otp && qr
  ];

  const expiryOptions = [
    { label: '5 min', value: 5 },
    { label: '10 min', value: 10 },
    { label: '30 min', value: 30 },
    { label: '60 min', value: 60 }
  ];

  const processingSteps = [
    { id: 1, label: 'Request Created', status: 'completed' },
    { id: 2, label: 'Payment Sent', status: 'pending' },
    { id: 3, label: 'BlockDAG Confirmation', status: 'pending' },
    { id: 4, label: 'Funds Received', status: 'pending' }
  ];

  // Timer effect
  useEffect(() => {
    let interval;
    if (activeStep >= 3 && activeStep <= 4 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeStep, timer]);

  // Simulate payment processing
  useEffect(() => {
    if (activeStep === 4) {
      const timeout = setTimeout(() => {
        setIsProcessing(true);
        // Simulate payment completion
        setTimeout(() => {
          setPaymentStatus('completed');
          setActiveStep(5);
        }, 3000);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [activeStep]);

  // Handle input changes for the form
  const handleInputChange = (field, value) => {
    setDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    // Also update the type in details state
    handleInputChange('type', methodId);
  };

  const handleNextStep = () => {
    if (activeStep < 5) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    } else {
      navigate(-1);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (activeStep === 2) {
      // Validate required fields
      if (!details.amount || !details.currency) {
        setError('Please fill in all required fields');
        return;
      }

      setIsSubmitting(true);
      setError('');

      try {
        // Prepare the data to send
        const payload = {
          merchant: details.merchant,
          merchant_id: details.merchant_id,
          amount: parseFloat(details.amount),
          currency: details.currency,
          wallet_address: details.wallet_address,
          // network: details.network,
          memo: details.memo,
          type: details.type.toUpperCase()
          // expiry_minutes: details.expiry_minutes
        };

        console.log('Sending payment data:', payload);

        const response = await fetch("http://localhost:5000/api/payments/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('Response from server:', data);

        if (response.ok) {
          // If QR is generated, store the QR image
          if (data.qr) {
            setQRImage(data.qr);
          }
          
          // Store the generated code if available
          if (data.otp) {
            setGeneratedCode(data.otp);
          }
          
          // Move to next step
          handleNextStep();
        } else {
          setError(data.message || 'Failed to create payment');
        }
      } catch (err) {
        console.error('Error submitting form:', err);
        setError('Network error. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      handleNextStep();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    // Show toast notification
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Payment Request',
        text: `Please send ${details.amount} ${details.currency} using ${selectedMethod === 'qr' ? 'QR code' : selectedMethod === 'otp' ? 'OTP' : 'USSD code'}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(generatedCode);
      // Show copy notification
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-6 border border-[#12315D] mx-auto text-center">
            <h2 className="text-xl font-bold mb-6">Choose how you want to receive payments</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {receiveMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleMethodSelect(method.id)}
                  className={`
                    grid place-items-center p-4 rounded-xl border-2 transition-all duration-200
                    ${selectedMethod === method.id 
                      ? 'border-[#1678FF] bg-[#1678FF]/10' 
                      : 'border-[#12315D] bg-[#10305A] hover:border-[#1a4275]'
                    }
                    hover:scale-[1.02]
                  `}
                >
                  <div className={`p-3 rounded-lg mb-3 w-fit ${
                    selectedMethod === method.id ? 'bg-[#1678FF]/20' : 'bg-[#051837]'
                  } ${method.color}`}>
                    <method.icon className={
                      selectedMethod === method.id ? 'text-[#1678FF]' : method.color
                    } size={24} />
                  </div>
                  <div className="text-center">
                    <div className="font-bold mb-1">{method.label}</div>
                    <div className="text-sm text-gray-400">{method.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-6 border border-[#12315D]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-lg ${selectedMethod === 'qr' ? 'bg-blue-900/30' : selectedMethod === 'otp' ? 'bg-green-900/30' : 'bg-purple-900/30'}`}>
                {selectedMethod === 'qr' && <QrCode className="text-blue-400" size={24} />}
                {selectedMethod === 'otp' && <Grid2x2 className="text-green-400" size={24} />}
                {selectedMethod === 'ussd' && <Smartphone className="text-purple-400" size={24} />}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {selectedMethod === 'qr' ? 'QR Code Payment' :
                   selectedMethod === 'otp' ? 'OTP Payment' : 'USSD Payment'}
                </h2>
                <p className="text-gray-400">Create payment request details</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Currency Selector */}
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <div className="relative">
                  <select 
                    value={details.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full bg-[#051837] border border-[#12315D] rounded-xl p-4 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
                  >
                    <option value="USD">USD</option>
                    <option value="BDAG">BDAG</option>
                    <option value="EUR">EUR</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Amount to Receive</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">$</span>
                  <input
                    type="number"
                    value={details.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#051837] border border-[#12315D] rounded-xl p-4 pl-12 text-2xl focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
                    required
                  />
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Customer will pay in BDAG at current exchange rate
                </p>
              </div>

              {/* Memo Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Memo (Optional)</label>
                <input
                  type="text"
                  value={details.memo}
                  onChange={(e) => handleInputChange('memo', e.target.value)}
                  placeholder="e.g. Coffee payment, Invoice #123"
                  className="w-full bg-[#051837] border border-[#12315D] rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
                />
              </div>

              {/* Expiry Time - Only for OTP and USSD */}
              {(selectedMethod === 'otp' || selectedMethod === 'ussd') && (
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Time</label>
                  <div className="grid grid-cols-4 gap-2">
                    {expiryOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleInputChange('expiry_minutes', option.value)}
                        className={`p-3 rounded-lg transition-colors ${
                          details.expiry_minutes === option.value
                            ? 'bg-[#1678FF] text-white'
                            : 'bg-[#10305A] hover:bg-[#123660] text-gray-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* User Info */}
              <div className="bg-[#10305A] rounded-xl p-4">
                <h3 className="font-medium mb-3">Your Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="font-medium">{details.merchant}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Address:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{details.wallet_address}</span>
                      <button 
                        type="button"
                        onClick={() => navigator.clipboard.writeText(details.wallet_address)}
                        className="p-1 hover:bg-[#051837] rounded"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </form>
        );

      case 3:
        return (
          <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-6 border border-[#12315D]">
            <h2 className="text-xl text-center font-bold mb-2">
              {selectedMethod === 'qr' ? 'QR Code Generated' :
               selectedMethod === 'otp' ? 'OTP Generated' : 'USSD Code Generated'}
            </h2>
            <p className="text-gray-400 mb-6 text-center">Share to receive payment</p>

            <div className="space-y-6">
              {/* Generated Code Display */}
              <div className="bg-[#051837] rounded-xl p-8 text-center">
                {selectedMethod === 'qr' ? (
                  <div className="flex flex-col items-center">
                    {qrImage ? (
                      <div className="w-48 h-48 bg-white p-4 rounded-lg mb-4">
                        <img 
                          src={qrImage} 
                          alt="QR Code" 
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-48 bg-white p-4 rounded-lg mb-4">
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          <QrCode size={80} className="text-white" />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 bg-[#10305A] px-4 py-3 rounded-lg">
                      <span className="font-mono text-sm">{generatedCode}</span>
                      <button 
                        onClick={handleCopyToClipboard} 
                        className="p-1 hover:bg-[#0f2b526e] rounded"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-5xl font-bold tracking-widest mb-6 font-mono">
                      {selectedMethod === 'otp' 
                        ? generatedCode.split('').join(' ')
                        : generatedCode
                      }
                    </div>
                    <div className="text-gray-400">
                      {selectedMethod === 'otp' 
                        ? 'Recipient should enter this OTP to complete payment'
                        : 'Recipient should dial this USSD code on their phone'
                      }
                    </div>
                  </div>
                )}

                {/* Timer */}
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Clock size={16} className="text-yellow-400" />
                  <span className="text-yellow-400">Expires in: {formatTime(timer)}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-[#10305A] rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="font-bold text-xl">{details.amount || '0.00'} {details.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expires:</span>
                    <span className="font-medium">{details.expiry_minutes} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Method:</span>
                    <span className="font-medium">
                      {selectedMethod === 'qr' ? 'QR Code' :
                       selectedMethod === 'otp' ? 'OTP' : 'USSD'}
                    </span>
                  </div>
                  {details.memo && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Memo:</span>
                      <span className="font-medium">{details.memo}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 p-4 bg-[#1678FF] hover:bg-[#1a6eff] rounded-xl font-medium transition-colors"
                >
                  <Share2 size={20} />
                  Share
                </button>
                <button 
                  type="button"
                  className="flex items-center justify-center gap-2 p-4 bg-[#10305A] hover:bg-[#123660] rounded-xl font-medium transition-colors"
                >
                  <Download size={20} />
                  Save {selectedMethod === 'qr' ? 'QR Image' : 'Details'}
                </button>
              </div>

              {/* Additional Actions */}
              <div className="space-y-4">
                <button
                  onClick={() => setActiveStep(4)}
                  className="w-full p-4 bg-[#10305A] hover:bg-[#123660] rounded-xl font-medium transition-colors"
                >
                  View Status
                </button>
                <button 
                  type="button"
                  className="w-full p-4 border border-[#12315D] hover:bg-[#10305A] rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} />
                  Generate New {selectedMethod === 'qr' ? 'QR Code' : selectedMethod === 'otp' ? 'OTP' : 'USSD Code'}
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-6 border border-[#12315D]">
            <h2 className="text-xl text-center font-bold mb-2">Payment Request Status</h2>
            <p className="text-gray-400 mb-8 text-center">Track your payment request</p>

            <div className="space-y-8">
              {/* Payment Details */}
              <div className="bg-[#10305A] rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount</span>
                    <span className="font-bold">{details.amount || '150'} {details.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className={`font-medium ${
                      paymentStatus === 'waiting' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {paymentStatus === 'waiting' ? 'Waiting for payment' : 'Payment Received'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Method</span>
                    <span className="font-medium">
                      {selectedMethod === 'qr' ? 'QR Code' :
                       selectedMethod === 'otp' ? 'OTP' : 'USSD'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expires in</span>
                    <span className="font-medium text-yellow-400">{formatTime(timer)}</span>
                  </div>
                </div>
              </div>

              {/* Processing Steps */}
              <div className="space-y-6">
                {processingSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      ${step.status === 'completed' ? 'bg-green-900/30 text-green-400' : 
                        'bg-gray-800 text-gray-500 border border-[#12315D]'}
                    `}>
                      {step.status === 'completed' ? <Check size={20} /> : step.id}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{step.label}</div>
                      <div className={`
                        text-sm
                        ${step.status === 'completed' ? 'text-green-400' : 'text-gray-400'}
                      `}>
                        {step.status === 'completed' ? 'Just now' : 'Pending'}
                      </div>
                    </div>
                    {isProcessing && step.id === 2 && (
                      <Loader2 className="animate-spin text-blue-400" size={20} />
                    )}
                  </div>
                ))}
              </div>

              {/* Status Message */}
              {paymentStatus === 'waiting' && (
                <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="text-yellow-400" size={20} />
                    <div className="text-sm">
                      <div className="font-medium text-yellow-300 mb-1">Waiting for payment</div>
                      <div className="text-yellow-400/80">
                        Share the {selectedMethod === 'qr' ? 'QR code' : selectedMethod === 'otp' ? 'OTP' : 'USSD code'} with the payer.
                        The request will expire in {formatTime(timer)}.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-6 border border-[#12315D] text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Received Successfully</h2>
              <p className="text-gray-400">Your payment has been received successfully</p>
            </div>
            
            <div className="bg-[#10305A] rounded-xl p-6 max-w-md mx-auto mb-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="font-mono">TX-MIRZKZ0W</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount Received</span>
                  <span className="font-bold">{details.amount || '150'} {details.currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Sender</span>
                  <span className="font-medium">H3ndr1x33</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Time</span>
                  <span className="font-medium">11:07 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 font-medium">Completed</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button 
                type="button"
                className="flex items-center gap-2 px-6 py-3 bg-[#10305A] hover:bg-[#123660] rounded-xl transition-colors"
              >
                <Share2 size={20} />
                Share
              </button>
              <button 
                type="button"
                className="flex items-center gap-2 px-6 py-3 bg-[#10305A] hover:bg-[#123660] rounded-xl transition-colors"
              >
                <Printer size={20} />
                Print
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex text-white min-h-screen">
      <Sidebar/>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex items-center sticky top-0 z-99999 bg-[#111827] border-b border-[#1677ff1c] gap-4 mb-8">
          <button
            type="button"
            onClick={handlePreviousStep}
            className="p-2 hover:bg-[#0f2b526e] rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className='py-4'>
            <h1 className="text-2xl font-bold mb-1">
              {activeStep === 4 ? 'Payment Status' :
               activeStep === 5 ? 'Payment Complete' : 'Receive Payment'}
            </h1>
            <p className="text-gray-400">
              {activeStep === 1 && 'Choose how you want to receive payments'}
              {activeStep === 2 && 'Create payment request details'}
              {activeStep === 3 && 'Share to receive payment'}
              {activeStep === 4 && 'Track your payment request'}
              {activeStep === 5 && 'Payment received successfully'}
            </p>
          </div>
          <MobileNavBar/>
        </div>

        {/* Progress Steps */}
        <div className='p-4 md:p-6 lg:p-10'>
          {activeStep <= 4 && (
            <div className="flex justify-between max-w-2xl mx-auto mb-8 relative">
              {steps.slice(0, 4).map((step) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center z-10">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mb-2
                      ${activeStep >= step.number 
                        ? 'bg-[#1678FF] text-white' 
                        : 'bg-[#0F2B52] text-gray-400 border border-[#12315D]'
                      }
                      ${activeStep === step.number ? 'ring-2 ring-[#1678FF] ring-offset-2 ring-offset-[#051837]' : ''}
                    `}>
                      {activeStep > step.number ? <Check size={20} /> : step.number}
                    </div>
                    <span className="text-sm text-gray-400 hidden md:block">{step.label}</span>
                  </div>
                  {step.number < 4 && (
                    <div className="absolute top-5 left-10 right-10 h-0.5 bg-[#0F2B52]">
                      <div 
                        className={`h-full bg-[#1678FF] transition-all duration-300 ${
                          activeStep > step.number ? 'w-full' : activeStep === step.number ? 'w-1/2' : 'w-0'
                        }`}
                      ></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Step Content */}
          <div className="max-w-4xl mx-auto">
            {renderStepContent()}
          </div>

          {/* Action Buttons */}
          {activeStep < 5 && activeStep !== 4 && activeStep !== 3 && (
            <div className="max-w-4xl mx-auto mt-8 flex gap-4">
              <button 
                type="button"
                onClick={handlePreviousStep}
                className="flex-1 py-3 px-6 rounded-xl font-medium bg-[#0f2b526e] hover:bg-[#10305A] border border-[#12315D] transition-colors"
              >
                {activeStep === 1 ? 'Cancel' : 'Back'}
              </button>
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={(activeStep === 1 && !selectedMethod) || 
                         (activeStep === 2 && (!details.amount || !details.currency)) ||
                         isSubmitting}
                className="flex-1 py-3 px-6 rounded-xl font-medium bg-[#1678FF] hover:bg-[#1a6eff] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    {activeStep === 1 ? 'Continue' :
                    activeStep === 2 ? `Generate ${selectedMethod === 'qr' ? 'QR Code' : selectedMethod === 'otp' ? 'OTP' : 'USSD Code'}` : 'Next'}
                  </>
                )}
              </button>
            </div>
          )}

          {activeStep === 5 && (
            <div className="max-w-4xl mx-auto mt-8">
              <button 
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 px-6 rounded-xl font-medium bg-[#1678FF] hover:bg-[#1a6eff] transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceivePage;