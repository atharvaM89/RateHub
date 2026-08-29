import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import LoadingSkeleton from '../../components/LoadingSkeleton.js';
import Button from '../../components/Button.js';
import StarRating from '../../components/StarRating.js';
import { Star, MessageSquare } from 'lucide-react';

interface OwnerStats {
  store: {
    id: string;
    name: string;
  };
  averageRating: number | null;
  totalRatings: number;
}

export const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await api.get('/owner/dashboard');
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (e: any) {
      setError(e.message || 'Unable to load your store information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSkeleton type="card" count={2} />;
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 p-6 rounded-lg text-center">
        <p className="text-rose-700 font-medium mb-3">{error}</p>
        <Button onClick={fetchStats}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-8 border border-slate-100 rounded-lg shadow-sm">
        <h2 className="text-3xl font-extrabold text-slate-800">{stats?.store.name}</h2>
        <p className="text-slate-500 text-sm mt-1">Feedback overview dashboard for your retail store location.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 border border-slate-100 rounded-lg shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 border border-amber-100 text-amber-500 rounded-lg">
            <Star size={24} className="fill-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Average Store Rating</p>
            <div className="flex items-center space-x-2 mt-1">
              <StarRating rating={stats?.averageRating ?? null} size={20} />
              <span className="text-xl font-bold text-slate-800">
                {stats?.averageRating !== null && stats?.averageRating !== undefined 
                  ? stats.averageRating 
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border border-slate-100 rounded-lg shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 border border-blue-100 text-blue-500 rounded-lg">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Customer Reviews</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats?.totalRatings ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border border-slate-100 rounded-lg shadow-sm flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800">View Detailed Reviewer Info</h3>
          <p className="text-xs text-slate-500 mt-0.5">Inspect user names and contact details of people who rated your store.</p>
        </div>
        <Button onClick={() => navigate('/owner/ratings')}>
          View Reviews List
        </Button>
      </div>
    </div>
  );
};
export default OwnerDashboard;
