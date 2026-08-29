import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import Input from '../../components/Input.js';
import Button from '../../components/Button.js';
import Toast from '../../components/Toast.js';

interface OwnerOption {
  id: string;
  name: string;
  email: string;
}

export const AddStore: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [ownerId, setOwnerId] = useState('');
  
  const [owners, setOwners] = useState<OwnerOption[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingOwners, setLoadingOwners] = useState(true);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res: any = await api.get('/users', {
          params: { limit: 100, role: 'STORE_OWNER' },
        });
        if (res.success && res.data) {
          setOwners(res.data);
        }
      } catch (e) {
        console.error('Failed to load store owners:', e);
      } finally {
        setLoadingOwners(false);
      }
    };
    fetchOwners();
  }, []);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!name) {
      tempErrors.name = 'Store name is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      tempErrors.email = 'Please enter a valid store email.';
    }
    if (!address || address.length > 400) {
      tempErrors.address = 'Store address is required and must not exceed 400 characters.';
    }
    if (!ownerId) {
      tempErrors.ownerId = 'Please select a store owner.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setIsLoading(true);
    try {
      await api.post('/stores', { name, email, address, ownerId });
      setToastMessage('Store registered successfully!');
      setTimeout(() => {
        navigate('/admin/stores');
      }, 1500);
    } catch (err: any) {
      setApiError(err.message || 'Failed to register new store.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-slate-100 rounded-lg shadow-md">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      <h2 className="text-xl font-bold text-slate-800 mb-6">Register New Retail Store</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded text-sm">
            {apiError}
          </div>
        )}

        <Input
          id="name"
          type="text"
          label="Store Name"
          placeholder="e.g. ABC Restaurant"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
        />

        <Input
          id="email"
          type="email"
          label="Contact Email"
          placeholder="contact@store.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />

        <Input
          id="address"
          type="text"
          label="Full Address (Max 400 characters)"
          placeholder="e.g. 123 FC Road, Pune"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          error={errors.address}
          required
        />

        <div className="flex flex-col">
          <label htmlFor="ownerId" className="text-sm font-medium text-slate-700 mb-1">
            Store Owner
          </label>
          <select
            id="ownerId"
            className="block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm text-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 disabled:opacity-50"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            disabled={loadingOwners}
            required
          >
            <option value="">-- Select Store Owner --</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </select>
          {errors.ownerId && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.ownerId}</p>
          )}
        </div>

        <div className="pt-4 flex justify-end space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/stores')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            Register Store
          </Button>
        </div>
      </form>
    </div>
  );
};
export default AddStore;
