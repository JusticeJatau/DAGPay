import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import your pages
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/Login.jsx';
import SignUpPage from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SendPage from './pages/SendPage.jsx';
import ReceivePage from './pages/ReceivePage.jsx';
import SwapPage from './pages/SwapPage.jsx';
import StakePage from './pages/StakePage.jsx';
import LendingPage from './pages/LendingPage.jsx';
import Settings from './pages/Settings.jsx';
import Request from './pages/Request.jsx';
import VerifyEmailPage from './pages/verifyEmailPage.jsx';
import UnderDevelopmentPage from './pages/UnderDevelopmentPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignUpPage /> },
      { path: 'verify-email/:token', element: <VerifyEmailPage /> },
      
      // Protected Routes - Only accessible when logged in
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'send',
        element: (
          <ProtectedRoute>
            <SendPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'receive',
        element: (
          <ProtectedRoute>
            <ReceivePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'swap',
        element: (
          <ProtectedRoute>
            <SwapPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'stake',
        element: (
          <ProtectedRoute>
            <StakePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'lend',
        element: (
          <ProtectedRoute>
            <LendingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: 'test',
        element: (
          <ProtectedRoute>
            <Request />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: (
          <UnderDevelopmentPage/>
        ),
      },
      
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);