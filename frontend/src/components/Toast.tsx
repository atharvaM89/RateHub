import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-100 text-emerald-800',
    error: 'bg-rose-50 border-rose-100 text-rose-800',
    info: 'bg-slate-50 border-slate-100 text-slate-800',
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-bounce">
      <div className={`flex items-center p-4 rounded-lg border shadow-lg ${bgColors[type]} max-w-sm`}>
        <div className="text-sm font-medium">{message}</div>
        <button
          type="button"
          onClick={onClose}
          className="ml-4 text-slate-400 hover:text-slate-600 focus:outline-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
};
export default Toast;
