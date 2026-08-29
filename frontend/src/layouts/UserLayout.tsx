import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Store, KeyRound, LogOut } from 'lucide-react';

export const UserLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shadow-sm shrink-0">
        <div className="flex items-center space-x-8">
          <span className="text-xl font-bold text-slate-800 tracking-wide">RateHub</span>
          <nav className="flex space-x-4">
            <NavLink
              to="/stores"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? 'bg-slate-100 text-slate-900' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Store size={18} className="mr-2" />
              Stores Directory
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded">
              USER
            </span>
            <span className="text-sm font-medium text-slate-600">{user?.name}</span>
          </div>

          <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
            <NavLink
              to="/change-password"
              className="text-slate-500 hover:text-slate-800 transition-colors"
              title="Change Password"
            >
              <KeyRound size={18} />
            </NavLink>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-rose-600 transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 max-w-6xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
};
export default UserLayout;
