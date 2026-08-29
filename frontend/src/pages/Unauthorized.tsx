import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.js';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Access Denied</h1>
      <p className="text-sm text-slate-500 mb-6 max-w-sm">
        You do not have permission to view this page. If you believe this is an error, please contact your administrator.
      </p>
      <Button onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </div>
  );
};
export default Unauthorized;
