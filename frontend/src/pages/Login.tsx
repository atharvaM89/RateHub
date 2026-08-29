import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import Input from '../components/Input.js';
import Button from '../components/Button.js';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      // Role-based redirection
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'STORE_OWNER') {
        navigate('/owner/dashboard', { replace: true });
      } else {
        navigate('/stores', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 border border-slate-100 rounded-lg shadow-md">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-800">
            RateHub
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Sign in to manage and rate stores
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded text-sm font-medium">
              {error}
            </div>
          )}

          <div className="rounded-md space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </div>

          <div className="text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-slate-700 hover:text-slate-900 underline">
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
