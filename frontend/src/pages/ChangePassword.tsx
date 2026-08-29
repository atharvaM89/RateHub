import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import Input from '../components/Input.js';
import Button from '../components/Button.js';

export const ChangePassword: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!currentPassword) {
      tempErrors.currentPassword = 'Current password is required.';
    }
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_]).{8,16}$/;
    if (!newPassword || !passRegex.test(newPassword)) {
      tempErrors.newPassword = 'Password must be 8-16 characters and contain at least one uppercase letter and one special character.';
    }
    if (newPassword !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match.';
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
      await api.patch('/auth/password', { currentPassword, newPassword, confirmPassword });
      setIsSuccess(true);
      setTimeout(async () => {
        await logout();
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setApiError(err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg border border-slate-100 shadow-md">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Change Password</h2>

      {isSuccess ? (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 px-4 py-4 rounded text-center">
          <p className="font-medium text-sm">Password updated successfully. Logging you out, please sign in again...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {apiError && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded text-sm">
              {apiError}
            </div>
          )}

          <Input
            id="currentPassword"
            type="password"
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={errors.currentPassword}
            required
          />

          <Input
            id="newPassword"
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
            required
          />

          <Input
            id="confirmPassword"
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            required
          />

          <div className="pt-2 flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
            >
              Update Password
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
export default ChangePassword;
