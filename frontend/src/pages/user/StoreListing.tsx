import React, { useEffect, useState } from 'react';
import api from '../../services/api.js';
import LoadingSkeleton from '../../components/LoadingSkeleton.js';
import EmptyState from '../../components/EmptyState.js';
import StarRating from '../../components/StarRating.js';
import Modal from '../../components/Modal.js';
import Button from '../../components/Button.js';
import Input from '../../components/Input.js';
import Toast from '../../components/Toast.js';

interface StoreItem {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: number | null;
  totalRatings: number;
  userRating: number | null;
}

export const StoreListing: React.FC = () => {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search parameters
  const [search, setSearch] = useState('');
  const [address, setAddress] = useState('');

  // Rating Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreItem | null>(null);
  const [userRatingVal, setUserRatingVal] = useState<number>(5);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchStores = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await api.get('/stores', {
        params: {
          search: search || undefined,
          address: address || undefined,
        },
      });
      if (res.success && res.data) {
        setStores(res.data);
      }
    } catch (e: any) {
      setError(e.message || 'Unable to load store listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStores();
  };

  const handleClearSearch = () => {
    setSearch('');
    setAddress('');
    setTimeout(() => {
      fetchStores();
    }, 0);
  };

  const openRatingModal = (store: StoreItem) => {
    setSelectedStore(store);
    setUserRatingVal(store.userRating || 5);
    setIsModalOpen(true);
  };

  const handleRatingSubmit = async () => {
    if (!selectedStore) return;
    setSubmitLoading(true);
    try {
      if (selectedStore.userRating !== null) {
        await api.patch(`/stores/${selectedStore.id}/ratings`, { rating: userRatingVal });
        setToastMessage('Rating updated successfully!');
      } else {
        await api.post(`/stores/${selectedStore.id}/ratings`, { rating: userRatingVal });
        setToastMessage('Rating submitted successfully!');
      }
      setIsModalOpen(false);
      fetchStores();
    } catch (e: any) {
      alert(e.message || 'Failed to submit rating.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      <div>
        <h2 className="text-2xl font-bold text-slate-800">Discover Retail Stores</h2>
        <p className="text-slate-500 text-sm mt-0.5">Browse overall customer feedback and submit your own ratings.</p>
      </div>

      <form onSubmit={handleSearchSubmit} className="bg-white p-6 border border-slate-100 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <Input
          id="search-name"
          label="Search Store Name"
          placeholder="Filter by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Input
          id="search-address"
          label="Location"
          placeholder="Filter by city/street..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="flex space-x-2">
          <Button type="submit" className="flex-1">Search</Button>
          <Button type="button" variant="secondary" onClick={handleClearSearch}>Clear</Button>
        </div>
      </form>

      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : error ? (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-lg text-center">
          <p className="text-rose-700 font-medium mb-3">{error}</p>
          <Button onClick={fetchStores}>Retry</Button>
        </div>
      ) : stores.length === 0 ? (
        <EmptyState
          title="No stores match your search"
          description="Try adjusting your filter settings or search terms."
          actionLabel="Clear Search"
          onAction={handleClearSearch}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div key={store.id} className="bg-white p-6 border border-slate-100 rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800">{store.name}</h3>
                <p className="text-slate-500 text-xs">{store.address}</p>
                
                <div className="pt-2 flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Global:
                  </span>
                  <StarRating rating={store.averageRating} size={16} />
                  <span className="text-sm font-bold text-slate-700">
                    {store.averageRating !== null ? store.averageRating : 'N/A'}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({store.totalRatings})
                  </span>
                </div>

                <div className="pt-1 flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Your Rating:
                  </span>
                  {store.userRating !== null ? (
                    <span className="inline-flex items-center text-sm font-bold text-slate-800">
                      <span className="text-amber-400 mr-1">★</span> {store.userRating}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Not rated yet</span>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 mt-6 flex justify-end">
                <Button
                  size="sm"
                  variant={store.userRating !== null ? 'outline' : 'primary'}
                  onClick={() => openRatingModal(store)}
                >
                  {store.userRating !== null ? 'Modify Rating' : 'Submit Rating'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedStore?.userRating !== null ? 'Update Your Rating' : `Rate ${selectedStore?.name}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleRatingSubmit} isLoading={submitLoading}>
              Submit Rating
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-center">
          <p className="text-slate-600 text-sm">
            Select a rating from 1 to 5 stars for **{selectedStore?.name}**:
          </p>
          <div className="flex justify-center py-4">
            <StarRating
              rating={userRatingVal}
              interactive={true}
              onChange={setUserRatingVal}
              size={32}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default StoreListing;
