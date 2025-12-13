import { Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function App() {
  const { loading } = useAuth();

  return (
    <>
      {loading ? (
        <div className="min-h-screen bg-gradient-to-b from-[#030D43] to-black flex items-center justify-center">
          <div className="text-white text-xl">Loading DAGPay...</div>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default App;