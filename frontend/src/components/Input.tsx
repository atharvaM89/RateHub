import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 text-sm ${
          error ? 'border-rose-300 text-rose-900 focus:ring-rose-500 focus:border-rose-500 bg-rose-50' : 'border-slate-300 text-slate-900'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>
      )}
    </div>
  );
};
export default Input;
