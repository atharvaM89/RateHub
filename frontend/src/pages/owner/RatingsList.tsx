import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import LoadingSkeleton from '../../components/LoadingSkeleton.js';
import Button from '../../components/Button.js';
import Table from '../../components/Table.js';
import type { TableColumn } from '../../components/Table.js';
import EmptyState from '../../components/EmptyState.js';

interface ReviewItem {
  id: string;
  userName: string;
  email: string;
  rating: number;
  createdAt: string;
}

export const OwnerRatingsList: React.FC = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await api.get('/owner/ratings');
      if (res.success && res.data) {
        const mappedData = res.data.map((r: any, index: number) => ({
          ...r,
          id: r.id || String(index),
        }));
        setReviews(mappedData);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load ratings list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const columns: TableColumn<ReviewItem>[] = [
    { header: 'Customer Name', accessor: 'userName' },
    { header: 'Email Address', accessor: 'email' },
    { 
      header: 'Rating Score', 
      accessor: (r) => (
        <span className="inline-flex items-center text-sm font-bold text-slate-800">
          <span className="text-amber-400 mr-1">★</span> {r.rating} / 5
        </span>
      ),
    },
    { 
      header: 'Date Reviewed', 
      accessor: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
  ];

  if (loading) {
    return <LoadingSkeleton type="row" count={5} />;
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 p-6 rounded-lg text-center">
        <p className="text-rose-700 font-medium mb-3">{error}</p>
        <Button onClick={fetchReviews}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Store Ratings & Reviews</h2>
          <p className="text-slate-500 text-xs mt-0.5">List of customers who submitted feedback for your store.</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/owner/dashboard')}>
          Back to Dashboard
        </Button>
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews submitted yet"
          description="Your store has not received any customer feedback ratings yet."
        />
      ) : (
        <Table
          columns={columns}
          data={reviews}
          isLoading={loading}
        />
      )}
    </div>
  );
};
export default OwnerRatingsList;
