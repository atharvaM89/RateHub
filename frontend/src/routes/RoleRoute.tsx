import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import LoadingSkeleton from '../components/LoadingSkeleton.js';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: ('ADMIN' | 'USER' | 'STORE_OWNER')[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
        <div className="w-full max-w-md">
          <LoadingSkeleton type="row" count={3} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = allowedRoles.includes(user.role);
  if (!hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
export default RoleRoute;
