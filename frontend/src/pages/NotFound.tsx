import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.js';
import { useAuth } from '../context/AuthContext.js';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (user.role === 'STORE_OWNER') {
      navigate('/owner/dashboard');
    } else {
      navigate('/stores');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <h1 className="text-6xl font-extrabold text-slate-800 mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-700 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 mb-6 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button onClick={handleGoHome}>
        Go Home
      </Button>
    </div>
  );
};
export default NotFound;
