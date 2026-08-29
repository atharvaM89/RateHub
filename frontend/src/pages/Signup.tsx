import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import Input from '../components/Input.js';
import Button from '../components/Button.js';

export const Signup: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    if (password !== confirmPassword) {
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
      await signup({ name, email, address, password });
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setApiError(err.message || 'An account with this email already exists.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 border border-slate-100 rounded-lg shadow-md">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-800">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Sign up to rate stores in your area
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 px-4 py-6 rounded text-center">
            <h3 className="font-semibold text-base mb-1">Signup Successful!</h3>
            <p className="text-sm">Account created successfully. Redirecting you to login page...</p>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {apiError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded text-sm font-medium">
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

            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                Register Account
              </Button>
            </div>

            <div className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-slate-700 hover:text-slate-900 underline">
                Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default Signup;
