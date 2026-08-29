import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import LoadingSkeleton from '../../components/LoadingSkeleton.js';
import Button from '../../components/Button.js';
import StarRating from '../../components/StarRating.js';

interface UserDetail {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  isActive: boolean;
  store?: {
    id: string;
    name: string;
    email: string;
    address: string;
    averageRating: number | null;
  } | null;
}

export const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res: any = await api.get(`/users/${id}`);
        if (res.success && res.data) {
          setUser(res.data);
        }
      } catch (err: any) {
        setError(err.message || 'User not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return <LoadingSkeleton type="row" count={4} />;
  }

  if (error || !user) {
    return (
      <div className="bg-rose-50 border border-rose-100 p-6 rounded-lg text-center">
        <p className="text-rose-700 font-medium mb-3">{error || 'User not found.'}</p>
        <Button onClick={() => navigate('/admin/users')}>Back to Users</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 border border-slate-100 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
            <p className="text-slate-500 text-sm mt-0.5">{user.email}</p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded">
              {user.role}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
              user.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Physical Address
            </span>
            <p className="text-slate-700 text-sm mt-1">{user.address}</p>
          </div>
        </div>
      </div>

      {user.role === 'STORE_OWNER' && (
        <div className="bg-white p-6 border border-slate-100 rounded-lg shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">
            Associated Store Operations
          </h3>
          {user.store ? (
            <div className="space-y-3">
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Store Name
                </span>
                <p className="text-slate-700 text-sm font-semibold mt-1">{user.store.name}</p>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Store Contact Email
                </span>
                <p className="text-slate-700 text-sm mt-1">{user.store.email}</p>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Store Location Address
                </span>
                <p className="text-slate-700 text-sm mt-1">{user.store.address}</p>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Store Average Rating
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  <StarRating rating={user.store.averageRating} size={18} />
                  <span className="text-sm font-bold text-slate-700">
                    {user.store.averageRating !== null ? user.store.averageRating : 'No reviews'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No store registered under this owner yet.</p>
          )}
        </div>
      )}

      <div className="flex justify-start">
        <Button onClick={() => navigate('/admin/users')} variant="outline">
          &larr; Back to Users
        </Button>
      </div>
    </div>
  );
};
export default UserDetails;
