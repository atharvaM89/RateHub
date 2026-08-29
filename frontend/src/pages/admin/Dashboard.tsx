import React, { useEffect, useState } from 'react';
import api from '../../services/api.js';
import LoadingSkeleton from '../../components/LoadingSkeleton.js';
import { Users, Store, Star } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await api.get('/admin/dashboard');
      if (res.success && res.data) {
        setStats(res.data);
      } else {
        setError('Failed to load metrics.');
      }
    } catch (e: any) {
      setError(e.message || 'Unable to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSkeleton type="card" count={3} />;
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 p-6 rounded-lg text-center">
        <p className="text-rose-700 font-medium mb-3">{error}</p>
        <button
          onClick={fetchStats}
          className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none"
        >
          Retry
        </button>
      </div>
    );
  }

  const cards = [
    { title: 'Total Registered Users', value: stats?.totalUsers ?? 0, icon: Users, color: 'text-blue-500 bg-blue-50 border-blue-100' },
    { title: 'Total Registered Stores', value: stats?.totalStores ?? 0, icon: Store, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
    { title: 'Total Ratings Submitted', value: stats?.totalRatings ?? 0, icon: Star, color: 'text-amber-500 bg-amber-50 border-amber-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white p-6 border border-slate-100 rounded-lg shadow-sm flex items-center space-x-4">
              <div className={`p-3 rounded-lg border ${card.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AdminDashboard;
