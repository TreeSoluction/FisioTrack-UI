import { AlertTriangle } from 'lucide-react';
import Button from './Button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-danger/10 p-4 mb-4">
        <AlertTriangle className="w-12 h-12 text-danger" />
      </div>
      <h3 className="text-lg font-semibold text-text dark:text-slate-200 mb-2">Algo deu errado</h3>
      <p className="text-sm text-text-muted dark:text-text-muted-dark max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button variant="danger" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
