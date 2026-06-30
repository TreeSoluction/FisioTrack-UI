import { useEffect, useCallback } from 'react';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const backdropStyle: React.CSSProperties = {
  animation: 'fadeIn 0.15s ease-out',
};

const cardStyle: React.CSSProperties = {
  animation: 'scaleIn 0.15s ease-out',
};

const variantStyles = {
  danger: 'bg-danger text-white hover:bg-red-600',
  warning: 'bg-warning text-white hover:bg-yellow-600',
  info: 'bg-primary text-white hover:bg-primary-dark',
};

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
  variant = 'danger',
}: ConfirmDialogProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    },
    [onCancel]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
      style={backdropStyle}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <div
        className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        style={cardStyle}
      >
        <h3
          id="confirm-dialog-title"
          className="text-lg font-bold text-text dark:text-slate-100 mb-2"
        >
          {title}
        </h3>
        <p className="text-text-muted dark:text-text-muted-dark mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel || 'Cancel'}
          </Button>
          <Button className={variantStyles[variant]} onClick={onConfirm}>
            {confirmLabel || 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
}
