import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { LayoutDashboard, Star, KeyRound, LogOut } from 'lucide-react';

export const OwnerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout();
      navigate('/login');
    }
  };

  const navItems = [
    { label: 'Store Dashboard', to: '/owner/dashboard', icon: LayoutDashboard },
    { label: 'Customer Reviews', to: '/owner/ratings', icon: Star },
    { label: 'Change Password', to: '/change-password', icon: KeyRound },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <span className="text-xl font-bold text-white tracking-wide">RateHub Owner</span>
          </div>
          <nav className="p-4 space-y-1">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={i}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      isActive 
                        ? 'bg-slate-800 text-white' 
                        : 'hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} className="mr-3 text-slate-400" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shadow-sm shrink-0">
          <h1 className="text-lg font-bold text-slate-800">Store Feedback Center</h1>
          <div className="flex items-center space-x-3">
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded">
              OWNER
            </span>
            <span className="text-sm font-medium text-slate-600">{user?.name}</span>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default OwnerLayout;
