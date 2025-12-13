import React from 'react';
import { Play, Shield, Zap, Smartphone, Globe, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <span className="text-blue-400">DAGPay</span>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors">
          Launch App
        </button>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Secure Your <span className="text-blue-400">Data</span>,
            <br />
            Secure Yourself
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Fast payments with auto-currency conversion on BlockDAG. Send BDAG,
            merchants receive local currency automatically.
          </p>
          <div className='flex flex-col mb-16 max-w-100 sm:w-100'>
            <Link 
              to='/login'
              className="w-full bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium text-lg flex items-center justify-center gap-2 mx-auto mb-4 transition-colors">
              GET STARTED
            </Link>
            <Link 
              to='/'
              className="w-full border border-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium text-lg flex items-center justify-center gap-2 mx-auto transition-colors">
              <Play size={20} />
              WATCH DEMO
            </Link>
          </div>

          {/* Balance Card */}
          <div className="bg-transparent rounded-2xl p-6 max-w-100 border-10 border-gray-700">
            <div className="text-gray-400 mb-2">Total Balance</div>
            <div className="text-3xl font-bold mb-2">$1,240.50</div>
            <div className="text-blue-400 text-xl">= 2,481 BDAG</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-8">
              <div className="bg-[#2564eb80] border border-blue-600 p-4 rounded-xl flex flex-col items-center transition-colors">
                <div className="text-2xl">↑</div>
                <span>Send</span>
              </div>
              <div className="bg-[#2564eb80] border border-blue-600 p-4 rounded-xl flex flex-col items-center transition-colors">
                <div className="text-2xl">↓</div>
                <span>Receive</span>
              </div>
              <div className="bg-[#2564eb80] border border-blue-600 p-4 rounded-xl flex flex-col items-center transition-colors">
                <div className="text-2xl">⇄</div>
                <span>Swap</span>
              </div>
              <div className="bg-[#2564eb80] border border-blue-600 p-4 rounded-xl flex flex-col items-center transition-colors">
                <div className="text-2xl">★</div>
                <span>Stake</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="container mx-auto px-10 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">WHAT WE DO</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Provide Cross-border payments and empowering underbanked users with
            fast, low-cost easy to make payments
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* USSD Feature */}
          <div className="grid place-items-center text-center bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="bg-blue-900/30 p-3 rounded-lg w-fit mb-4">
              <Smartphone className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">USSD Feature for Phone</h3>
            <p className="text-gray-300">
              No smartphone? Use USSD codes to send and receive payments.
            </p>
          </div>

          {/* Auto Conversion */}
          <div className="grid place-items-center text-center bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="bg-blue-900/30 p-3 rounded-lg w-fit mb-4">
              <Globe className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Auto-Currency Conversion</h3>
            <p className="text-gray-300">
              Pay in BDAG, merchant receives local currency automatically via DEX.
            </p>
          </div>

          {/* Speed */}
          <div className="grid place-items-center text-center bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="bg-blue-900/30 p-3 rounded-lg w-fit mb-4">
              <Zap className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Speed</h3>
            <p className="text-gray-300">
              Payments made within seconds, no hassle. Instant settlements.
            </p>
          </div>

          {/* Security */}
          <div className="grid place-items-center text-center bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 md:col-span-2 lg:col-span-1">
            <div className="bg-blue-900/30 p-3 rounded-lg w-fit mb-4">
              <Shield className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Transactions</h3>
            <p className="text-gray-300">
              End-to-end encryption with immutable BlockDAG record system.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-12">HOW IT WORKS</h2>
        <p className="text-center text-gray-300 mb-8">
          Three simple steps to fast payments
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="text-center">
            <div className="bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">1</div>
            <h3 className="text-xl font-bold mb-2">Create Payment</h3>
            <p className="text-gray-300">Merchant generates QR code or OTP</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">2</div>
            <h3 className="text-xl font-bold mb-2">Pay with BDAG</h3>
            <p className="text-gray-300">Customer scans or enters OTP</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">3</div>
            <h3 className="text-xl font-bold mb-2">Auto-Convert</h3>
            <p className="text-gray-300">DAGPay swap to merchant currency via DEX</p>
          </div>
        </div>

        {/* USSD Instructions */}
        <div className="bg-gray-800/30 backdrop-blur-sm p-8 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">How to pay with USSD:</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[
                "Dial *789# on your phone",
                "Select 'Send Money' option",
                "Enter recipient phone number",
                "Enter amount and confirm with OTP",
                "Transaction completes in seconds"
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-300">{step}</p>
                </div>
              ))}
            </div>
            <div className="bg-black rounded-xl p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <p className="text-lg">No smartphone needed</p>
                <p className="text-gray-400 text-sm">Works on any mobile phone</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="grid place-items-center container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Experience Fast Payments?</h2>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of users sending instant payments with auto-currency conversion.
        </p>
        <div className='flex flex-col mb-16 max-w-100 sm:w-100'>
          <Link 
            to='/login'
            className="w-full bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium text-lg flex items-center justify-center gap-2 mx-auto mb-4 transition-colors">
            GET STARTED
          </Link>
          <Link
            to='/'
            className="w-full border border-blue-600 text-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium text-lg flex items-center justify-center gap-2 mx-auto transition-colors">
            READ DOCUMENTATION
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid place-items-center text-center md:grid-cols-4 gap-8 mb-8 ">
            <div>
              <div className="text-2xl font-bold mb-4">
                DP <span className="text-blue-400">DAGPay</span>
              </div>
              <p className="text-gray-400">
                Fast payments with auto-currency conversion on BlockDAG.
              </p>
              <div className="flex justify-center flex gap-4 mt-4">
                {['Twitter', 'Telegram', 'Github', 'Discord'].map((social) => (
                  <a key={social} href="#" className="text-gray-400 hover:text-white transition-colors">
                    {social}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                {['Features', 'API', 'Documentation'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                {['About', 'Blog', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                {['Privacy Policy', 'Terms'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 DAGPay. Built on BlockDAG Network.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;