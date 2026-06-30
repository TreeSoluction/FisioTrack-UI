import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4 mb-4">
        <Icon className="w-12 h-12 text-text-muted dark:text-text-muted-dark" />
      </div>
      <h3 className="text-lg font-semibold text-text dark:text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-text-muted dark:text-text-muted-dark max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
