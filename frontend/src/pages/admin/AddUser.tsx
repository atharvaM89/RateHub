import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import Input from '../../components/Input.js';
import Button from '../../components/Button.js';
import Toast from '../../components/Toast.js';

export const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(2); // Default to Normal USER

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!name || name.length < 20 || name.length > 60) {
      tempErrors.name = 'Name must be between 20 and 60 characters.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }
    if (!address || address.length > 400) {
      tempErrors.address = 'Address is required and must not exceed 400 characters.';
    }
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_]).{8,16}$/;
    if (!password || !passRegex.test(password)) {
      tempErrors.password = 'Password must be 8-16 characters and contain at least one uppercase letter and one special character.';
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
      await api.post('/users', { name, email, address, password, roleId });
      setToastMessage('User created successfully!');
      setTimeout(() => {
        navigate('/admin/users');
      }, 1500);
    } catch (err: any) {
      setApiError(err.message || 'Failed to create user account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-slate-100 rounded-lg shadow-md">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      <h2 className="text-xl font-bold text-slate-800 mb-6">Create New User Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded text-sm">
            {apiError}
          </div>
        )}

        <Input
          id="name"
          type="text"
          label="Full Name (Min 20 characters)"
          placeholder="e.g. Johnathan Doe Senior"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
        />

        <Input
          id="email"
          type="email"
          label="Email Address"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />

        <Input
          id="address"
          type="text"
          label="Address (Max 400 characters)"
          placeholder="123 Street Name, Pune"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          error={errors.address}
          required
        />

        <Input
          id="password"
          type="password"
          label="Password (8-16 chars, 1 uppercase, 1 special char)"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />

        <div className="flex flex-col">
          <label htmlFor="roleId" className="text-sm font-medium text-slate-700 mb-1">
            Account Access Role
          </label>
          <select
            id="roleId"
            className="block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm text-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
            value={roleId}
            onChange={(e) => setRoleId(Number(e.target.value))}
          >
            <option value={2}>USER (Normal User)</option>
            <option value={3}>STORE_OWNER (Store Owner)</option>
            <option value={1}>ADMIN (System Administrator)</option>
          </select>
        </div>

        <div className="pt-4 flex justify-end space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/users')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            Create User
          </Button>
        </div>
      </form>
    </div>
  );
};
export default AddUser;
