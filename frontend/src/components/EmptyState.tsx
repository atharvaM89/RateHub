import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button.js';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-dashed border-slate-200 rounded-lg text-center shadow-sm">
      <Inbox size={48} className="text-slate-300 mb-3" />
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
export default EmptyState;
