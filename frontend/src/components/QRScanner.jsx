import { useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({ isActive, onScan }) => {
  const scannerRef = useRef(null);
  const qrCodeScannerRef = useRef(null);

  // Handle scanner start/stop
  const startScanner = async () => {
    try {
      qrCodeScannerRef.current = new Html5Qrcode("qr-reader");
      
      // Start scanning with camera
      await qrCodeScannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Handle successful scan
          onScan(decodedText);
          
          // Optionally stop scanner after successful scan
          stopScanner();
        },
        (errorMessage) => {
          // Ignore most errors, but log if needed
          console.log("QR Code scan error:", errorMessage);
        }
      );
      
      console.log("QR scanner started successfully");
    } catch (err) {
      console.error("Failed to start QR scanner:", err);
    }
  };

  const stopScanner = () => {
    if (qrCodeScannerRef.current) {
      qrCodeScannerRef.current.stop()
        .then(() => {
          console.log("QR scanner stopped");
          qrCodeScannerRef.current = null;
        })
        .catch((err) => {
          console.error("Failed to stop scanner:", err);
        });
    }
  };

  // Handle changes in isActive prop
  useEffect(() => {
    if (isActive) {
      startScanner();
    } else {
      stopScanner();
    }

    // Cleanup on component unmount
    return () => {
      stopScanner();
    };
  }, [isActive]);

  return (
    <div className="w-full">
      {/* Scanner viewfinder */}
      <div id="qr-reader" className="w-full h-64 bg-black rounded-xl overflow-hidden relative">
        {/* Optional scanning overlay */}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-blue-400 relative">
              {/* Scanning line animation */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan"></div>
            </div>
          </div>
        )}
        
        {/* Status message */}
        {!isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80">
            <div className="text-4xl mb-4">📱</div>
            <p className="text-white text-lg font-medium">Camera Ready</p>
            <p className="text-gray-400 text-sm">Press "Scan" to start</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;