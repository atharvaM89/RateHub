import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'row' | 'text';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'text',
  count = 1,
}) => {
  const cards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 flex flex-col space-y-3">
          <div className="h-5 bg-slate-200 rounded w-2/3"></div>
          <div className="h-4 bg-slate-100 rounded w-1/2"></div>
          <div className="h-4 bg-slate-100 rounded w-3/4"></div>
          <div className="pt-4 mt-auto flex items-center justify-between border-t border-slate-50">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const rows = () => (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-white border border-slate-100 rounded-md">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-3 bg-slate-100 rounded w-3/4"></div>
          </div>
          <div className="h-6 bg-slate-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  );

  const text = () => (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-200 rounded w-full"></div>
      ))}
    </div>
  );

  if (type === 'card') return cards();
  if (type === 'row') return rows();
  return text();
};
export default LoadingSkeleton;
