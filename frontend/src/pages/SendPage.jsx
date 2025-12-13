import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, 
  Grid2x2, 
  Send, 
  Camera, 
  Upload,
  ChevronLeft,
  X,
  CheckCircle,
  AlertCircle,
  Copy,
  Clock,
  Share2,
  Printer,
  ArrowUp,
  Search,
  UserCircle,
  Check,
  Loader2,
  Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/QRScanner';
import Sidebar from '../components/Sidebar';
import MobileNavBar from '../components/MobileNavBar';

const SendPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1); // 1-7 steps
  const [selectedMethod, setSelectedMethod] = useState('qr'); // qr, otp, address
  const [scanned, setScanned] = useState(false);
  const [address, setAddress] = useState('');
  const [otp, setOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [scannedData, setScannedData] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [memo, setMemo] = useState("");
  
  // Timer effect
  useEffect(() => {
    if (activeStep === 4) { // OTP verification step
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeStep]);

  const steps = [
    { number: 1, label: 'Select Method' },
    { number: 2, label: 'Enter Details' },
    { number: 3, label: 'Review' },
    { number: 4, label: 'Verify' },
    { number: 5, label: 'Process' },
    { number: 6, label: 'Complete' }
  ];

  const paymentMethods = [
    { id: 'qr', icon: QrCode, label: 'Scan QR', description: 'Scan merchant QR code' },
    { id: 'otp', icon: Grid2x2, label: 'Enter OTP', description: 'Use one-time password' },
    { id: 'address', icon: Send, label: 'Send to Address', description: 'Enter wallet address' }
  ];

  const recentContacts = [
    { id: 1, initial: 'H', name: 'H3ndr1x33', address: '0x13382...', amount: '$50', time: '2 days ago' },
    { id: 2, initial: 'A', name: 'Abraham John', address: '0x13327...', amount: '$100', time: '1 week ago' },
    { id: 3, initial: 'E', name: 'Echo085', address: '0x14567...', amount: '$50', time: '2 days ago' },
    { id: 4, initial: 'J', name: 'Justice Jatau', address: '0x18923...', amount: '$100', time: '1 week ago' }
  ];

  const currencies = ["USD", "BDAG", "EUR"];

  const handleNextStep = () => {
    if (activeStep < 6) {
      if (activeStep === 4) {
        setIsProcessing(true);
      }
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Processing Animation Component
  const ProcessingPaymentAnimation = () => {
    const [processingSteps, setProcessingSteps] = useState([
      { id: 1, label: 'Validating OTP', status: 'pending' },
      { id: 2, label: 'Initiating Transfer', status: 'pending' },
      { id: 3, label: 'Confirming on BlockDAG', status: 'pending' },
      { id: 4, label: 'Completing Transaction', status: 'pending' }
    ]);

    const [dots, setDots] = useState(1);
    
    // Processing Ball Animation
    const containerRef = useRef(null);
    const ballsRef = useRef([null, null, null]);
    const animationRef = useRef(null);
    const SPEED_MULTIPLIER = 0.5;
    
    // Ball positions and velocities
    const ballsData = useRef([
      { x: 60, y: 60, dx: 1.5, dy: 1.2 },
      { x: 40, y: 80, dx: -1.8, dy: 1.5 },
      { x: 80, y: 40, dx: 1.2, dy: -1.8 }
    ]);

    // Animation loop
    useEffect(() => {
      const updateBalls = () => {
        ballsData.current.forEach((ball, index) => {
          // Update position
          ball.x += ball.dx * SPEED_MULTIPLIER;
          ball.y += ball.dy * SPEED_MULTIPLIER;
          
          // Container boundaries (container is 160px, ball is 40px, so radius limit is 60px)
          const radius = 60; // (container radius 80px - ball radius 20px)
          const centerX = 20;
          const centerY = 20;
          
          // Calculate distance from center
          const dx = ball.x - centerX;
          const dy = ball.y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // If ball hits boundary, bounce
          if (distance > radius) {
            // Normalize the vector from center to ball
            const nx = dx / distance;
            const ny = dy / distance;
            
            // Calculate dot product of velocity and normal
            const dot = ball.dx * nx + ball.dy * ny;
            
            // Reflect velocity
            ball.dx = ball.dx - 2 * dot * nx;
            ball.dy = ball.dy - 2 * dot * ny;
            
            // Move ball back inside boundary
            ball.x = centerX + nx * radius * 0.95;
            ball.y = centerY + ny * radius * 0.95;
          }
          
          // Update ball position in DOM
          if (ballsRef.current[index]) {
            ballsRef.current[index].style.transform = `translate(${ball.x - 20}px, ${ball.y - 20}px)`;
          }
        });
        
        animationRef.current = requestAnimationFrame(updateBalls);
      };
      
      animationRef.current = requestAnimationFrame(updateBalls);
      
      // Cleanup
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, []);

    useEffect(() => {
      // Animate dots
      const dotsInterval = setInterval(() => {
        setDots(prev => prev === 4 ? 1 : prev + 1);
      }, 300);

      // Simulate processing steps
      const stepTimers = [
        setTimeout(() => {
          setProcessingSteps(prev => {
            const newSteps = [...prev];
            newSteps[0].status = 'completed';
            newSteps[1].status = 'in-progress';
            return newSteps;
          });
        }, 1000),
        
        setTimeout(() => {
          setProcessingSteps(prev => {
            const newSteps = [...prev];
            newSteps[1].status = 'completed';
            newSteps[2].status = 'in-progress';
            return newSteps;
          });
        }, 3000),
        
        setTimeout(() => {
          setProcessingSteps(prev => {
            const newSteps = [...prev];
            newSteps[2].status = 'completed';
            newSteps[3].status = 'in-progress';
            return newSteps;
          });
        }, 5000),
        
        setTimeout(() => {
          setProcessingSteps(prev => {
            const newSteps = [...prev];
            newSteps[3].status = 'completed';
            return newSteps;
          });
          
          // Move to next step after completion
          setTimeout(() => {
            setActiveStep(6);
          }, 1500);
        }, 7000)
      ];

      return () => {
        clearInterval(dotsInterval);
        stepTimers.forEach(timer => clearTimeout(timer));
      };
    }, []);

    return (
      <div className=''>
        <div 
          ref={containerRef}
          className="relative flex items-center justify-center h-40 w-40 rounded-full border-2 border-[#1677ff79] mb-10 mx-auto"
        >
          {/* Ball 1 */}
          <div 
            ref={el => ballsRef.current[0] = el}
            className="ball absolute h-8 w-8 rounded-full bg-[#1677ff]"
            style={{
              transform: 'translate(40px, 40px)',
              boxShadow: '0 4px 8px rgba(22, 119, 255, 0.3)'
            }}
          />
          
          {/* Ball 2 */}
          <div 
            ref={el => ballsRef.current[1] = el}
            className="ball absolute h-8 w-8 rounded-full bg-[#1677ff]"
            style={{
              transform: 'translate(20px, 60px)',
              boxShadow: '0 4px 8px rgba(22, 119, 255, 0.3)'
            }}
          />
          
          {/* Ball 3 */}
          <div 
            ref={el => ballsRef.current[2] = el}
            className="ball absolute h-8 w-8 rounded-full bg-[#1677ff]"
            style={{
              transform: 'translate(60px, 20px)',
              boxShadow: '0 4px 8px rgba(22, 119, 255, 0.3)'
            }}
          />
        </div>
        <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-6 text-center border border-[#12315D]">
          <h2 className="text-xl font-bold mb-6">Processing Payment</h2>
          <p className="text-gray-400 mb-8 text-center">Sending 20.00 BDAG to H3ndr1x33</p>
          
          <div className="space-y-6 max-w-md mx-auto">
            {processingSteps.map((step) => (
              <div key={step.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${step.status === 'completed' ? 'bg-green-900/30 text-green-400' : 
                      step.status === 'in-progress' ? 'bg-blue-900/30 text-blue-400' : 
                      'bg-gray-800 text-gray-500'}
                  `}>
                    {step.status === 'completed' ? <Check size={16} /> : 
                    step.status === 'in-progress' ? <Loader2 size={16} className="animate-spin" /> : 
                    step.id}
                  </div>
                  <span className={step.status === 'completed' ? 'text-green-400' : 
                    step.status === 'in-progress' ? 'text-blue-400' : 'text-gray-400'}>
                    {step.label}
                  </span>
                </div>
                <div className={`
                  text-sm
                  ${step.status === 'completed' ? 'text-green-400' : 
                    step.status === 'in-progress' ? 'text-blue-400' : 'text-gray-500'}
                `}>
                  {step.status === 'completed' ? 'Completed' : 
                  step.status === 'in-progress' ? 'In progress...' : 'Pending'}
                </div>
              </div>
            ))}
          </div>

          {/* Animated dots like in the image */}
          <div className="flex justify-center gap-4 mt-12">
            {[1, 2, 3, 4].map((num) => (
              <div 
                key={num} 
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${num <= dots ? 'bg-[#1678FF] scale-110' : 'bg-gray-600'}
                `}
              ></div>
            ))}
          </div>
          
          <div className="text-center mt-8 text-gray-500 text-sm">
            Processing{'.'.repeat(dots)}
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-6 border border-[#12315D] mx-auto text-center">
            <h2 className="text-xl font-bold mb-6">Select Payment Method</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedMethod(method.id);
                  }}
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
                  }`}>
                    <method.icon className={
                      selectedMethod === method.id ? 'text-[#1678FF]' : 'text-gray-300'
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
        if (selectedMethod === 'qr') {
          return (
            <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-6 border border-[#12315D]">
              <h2 className="text-xl text-center font-bold mb-6">Scan QR Code</h2>
              
              <div className="text-center mb-8">
                <p className="text-gray-400 mb-6">Point your camera at the merchant's QR code</p>
                
                <div className="relative max-w-md mx-auto">
                  <QRScanner
                    isActive={scanned}
                    onScan={(decodedText) => {
                      console.log("QR Code Scanned:", decodedText);
                      setScanned(true);
                      setScannedData(decodedText);
                      
                      setTimeout(() => {
                        handleNextStep();
                      }, 1500);
                    }}
                  />

                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <button
                      onClick={() => setScanned(!scanned)}
                      className={`
                        p-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all
                        ${scanned 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-[#1678FF] hover:bg-[#1a6eff] text-white'
                        }
                      `}
                      disabled={scanned}
                    >
                      <Camera size={20} />
                      {scanned ? 'Scanned' : 'Scan'}
                    </button>
                    <button className="rounded-xl font-medium bg-[#10305A] hover:bg-[#123660] flex items-center justify-center gap-2 transition-colors">
                      <Upload size={20} />
                      Upload QR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (selectedMethod === 'otp') {
          return (
            <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-6 border border-[#12315D] text-center">
              <h2 className="text-xl font-bold mb-4">Enter OTP from Merchant</h2>
              <p className="text-gray-400 mb-6">Ask the merchant for their 6-digit OTP</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Enter 6-digit OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full bg-[#051837] border border-[#12315D] rounded-xl p-4 text-center text-3xl tracking-widest focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
                    maxLength={6}
                  />
                </div>
                
                <div className="bg-[#10305A] rounded-xl p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">OTP expires in 10 minutes</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Merchant will provide OTP at checkout
                  </p>
                </div>
              </div>
            </div>
          );
        }

        if (selectedMethod === 'address') {
          return (
            <div className="bg-[#0f2b526e] backdrop-blur-sm rounded-2xl p-6 border border-[#12315D]">
              <h2 className="text-xl font-bold mb-6">Send to Wallet Address</h2>
              
              <div className="space-y-6">
                {/* Wallet Address Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Recipient Wallet Address</label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="0x123456789abcdef..."
                      className="w-full bg-[#051837] border border-[#12315D] rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
                    />
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    Enter the recipient's BlockDAG wallet address
                  </p>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Amount to Send</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#051837] border border-[#12315D] rounded-xl p-4 pl-12 text-2xl focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <select 
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="bg-transparent border-none focus:outline-none text-gray-300"
                      >
                        {currencies.map(curr => (
                          <option key={curr} value={curr}>{curr}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Memo Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Memo (Optional)</label>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="e.g. Coffee payment, Invoice #123"
                    className="w-full bg-[#051837] border border-[#12315D] rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
                  />
                </div>

                {/* Recent Contacts */}
                <div>
                  <h3 className="font-bold mb-4">Recent Contacts</h3>
                  <div className="space-y-3">
                    {recentContacts.map((contact) => (
                      <button
                        key={contact.id}
                        type="button"
                        onClick={() => {
                          setAddress(contact.address);
                          // You could pre-fill name or other details here
                        }}
                        className="w-full bg-[#10305A] hover:bg-[#123660] p-4 rounded-xl flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#1678FF] flex items-center justify-center font-bold">
                            {contact.initial}
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-sm text-gray-400">{contact.address}</div>
                          </div>
                        </div>
                        {contact.amount && (
                          <div className="text-right">
                            <div className="font-medium">{contact.amount}</div>
                            <div className="text-sm text-gray-400">{contact.time}</div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Send Options */}
                <div>
                  <h3 className="font-bold mb-4">Quick Send Amounts</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 20, 50].map((quickAmount) => (
                      <button
                        key={quickAmount}
                        type="button"
                        onClick={() => setAmount(quickAmount.toString())}
                        className={`p-3 rounded-lg transition-colors ${
                          amount === quickAmount.toString() 
                            ? 'bg-[#1678FF] text-white' 
                            : 'bg-[#10305A] hover:bg-[#123660] text-gray-300'
                        }`}
                      >
                        ${quickAmount}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }
        break;

      case 3:
        return (
          <div className=" backdrop-blur-sm rounded-2xl p-0 text-center md:border md:border-[#12315D] md:bg-[#0f2b526e] md:p-6">
            <h2 className="text-xl font-bold mb-6">Review Payment</h2>
            <p className="text-gray-400 mb-8">Confirm payment details before sending</p>
            
            <div className="space-y-6">
              <div className="bg-[#0f2b526e] border border-[#12315D] rounded-xl p-6 md:bg-[#10305A]">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Payment Method</span>
                    <span className="font-medium">
                      {selectedMethod === 'qr' ? 'QR Code' :
                       selectedMethod === 'otp' ? 'OTP Payment' :
                       'Wallet Address'}
                    </span>
                  </div>
                  
                  {selectedMethod === 'address' && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">To Address</span>
                        <span className="font-mono text-sm">{address || '0x123...'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Amount</span>
                        <span className="font-medium">{amount || '0.00'} {currency}</span>
                      </div>
                      {memo && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Memo</span>
                          <span className="font-medium">{memo}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {(selectedMethod === 'qr' || selectedMethod === 'otp') && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">To</span>
                        <span className="font-medium">Coffee Shop</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Amount</span>
                        <span className="font-medium">10.00 USD ≈ 20.00 BDAG</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Memo</span>
                        <span className="font-medium">Coffee payment</span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Network Fee</span>
                    <span className="font-medium">$0.10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Exchange Rate</span>
                    <span className="font-medium">1 BDAG = $0.5 USD</span>
                  </div>
                  
                  <div className="border-t border-[#12315D] pt-4 mt-4 md:border-[#ffffff27]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">Total to Pay</span>
                      <span className="text-xl font-bold">20.00 USD</span>
                    </div>
                    <div className="text-right text-[#1678FF]">≈ 20.00 BDAG</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-[#0f2b526e] text-center backdrop-blur-sm rounded-2xl p-6 border border-[#12315D]">
            <h2 className="text-xl font-bold mb-6">Security Verification</h2>
            <p className="text-gray-400 mb-8">Enter OTP sent to your phone for authorization</p>
            
            <div className="space-y-6">
              <div className="bg-[#10305A] rounded-xl p-6 mb-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Sending</span>
                    <span className="font-bold">20.00 BDAG</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">To</span>
                    <span className="font-medium">H3ndr1x33</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Fee</span>
                    <span className="font-medium">$0.10</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Enter 6-digit OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full bg-[#051837] border border-[#12315D] rounded-xl p-4 text-center text-3xl tracking-widest focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
                  maxLength={6}
                />
              </div>

              <div className="grid place-items-center space-y-4">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-sm text-[#F59E0B]">OTP expires in: {formatTime(timer)}</span>
                </div>
                
                <div className="flex gap-4">
                  <button className="text-[#1678FF] hover:text-[#1a6eff] text-sm">
                    Resend OTP
                  </button>
                  <button 
                    onClick={handlePreviousStep}
                    className="text-gray-400 hover:text-gray-300 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return <ProcessingPaymentAnimation />;

      case 6:
        return (
          <div className="backdrop-blur-sm rounded-2xl text-center md:p-6 md:bg-[#0F2B52] md:border border-[#12315D]">
            <div className="grid place-items-center w-30 h-30 bg-green-900/30 rounded-full items-center justify-center mx-auto mb-6 md:hidden">
              <CheckCircle size={60} className="text-green-400" />
            </div>
            <div className="mb-8">
              <div className="hidden w-20 h-20 bg-green-900/30 rounded-full items-center justify-center mx-auto mb-6 md:flex">
                <CheckCircle size={40} className="text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful</h2>
              <p className="text-gray-400">Your payment has been processed successfully</p>
            </div>
            
            <div className="bg-[#0f2b526e] rounded-xl p-6 max-w-md mx-auto mb-8 md:bg-[#10305A]">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="font-mono">TX-MIRZKZOW</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount Sent</span>
                  <span className="font-bold">20.00 BDAG</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Recipient</span>
                  <span className="font-medium">H3ndr1x33</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Method</span>
                  <span className="font-medium">
                    {selectedMethod === 'qr' ? 'QR Code' :
                     selectedMethod === 'otp' ? 'OTP' :
                     'Wallet Address'}
                  </span>
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
              <button className="flex items-center gap-2 px-6 py-3 bg-[#10305A] hover:bg-[#123660] rounded-xl transition-colors">
                <Share2 size={20} />
                Share
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#10305A] hover:bg-[#123660] rounded-xl transition-colors">
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
      {/* Desktop Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex items-center sticky top-0 z-99999 bg-[#111827] gap-4 mb-8 border-b border-[#1677ff1c]">
          <button
            onClick={handlePreviousStep}
            className="p-2 hover:bg-[#0F2B52] rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className='py-4'>
            <h1 className="text-2xl font-bold mb-1">
              {activeStep === 5 ? 'Processing...' : 
               activeStep === 6 ? 'Payment Complete' : 'Send Payment'}
            </h1>
            <p className="text-gray-400">
              {activeStep === 1 && 'Choose how you want to send payment'}
              {activeStep === 2 && 'Enter payment details'}
              {activeStep === 3 && 'Review your transaction'}
              {activeStep === 4 && 'Verify with OTP'}
              {activeStep === 5 && 'Transaction is being processed'}
              {activeStep === 6 && 'Payment completed successfully'}
            </p>
          </div>
          <MobileNavBar/>
        </div>

        <div className='p-4 md:p-6 lg:p-10'>
          {/* Progress Steps */}
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
          {activeStep < 6 && activeStep !== 5 && (
            <div className="max-w-4xl mx-auto mt-8 flex gap-4">
              <button 
                onClick={handlePreviousStep}
                className="flex-1 py-3 px-6 rounded-xl font-medium bg-[#0F2B52] hover:bg-[#10305A] border border-[#12315D] transition-colors"
              >
                {activeStep === 1 ? 'Cancel' : 'Back'}
              </button>
              <button 
                onClick={handleNextStep}
                className="flex-1 py-3 px-6 rounded-xl font-medium bg-[#1678FF] hover:bg-[#1a6eff] transition-colors flex items-center justify-center gap-2"
                disabled={(activeStep === 2 && selectedMethod === 'qr' && !scanned) || 
                        (activeStep === 2 && selectedMethod === 'address' && (!address || !amount)) ||
                        (activeStep === 2 && selectedMethod === 'otp' && otp.length !== 6) ||
                        (activeStep === 4 && otp.length !== 6)}
              >
                {activeStep === 4 ? 'Verify OTP' : 
                activeStep === 3 ? 'Confirm & Send' : 'Continue'}
                {activeStep < 4 && <ArrowUp size={20} />}
              </button>
            </div>
          )}

          {activeStep === 6 && (
            <div className="max-w-4xl mx-auto mt-8">
              <button 
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

export default SendPage;