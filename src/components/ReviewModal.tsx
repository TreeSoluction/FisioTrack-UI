import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, X } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

interface ReviewModalProps {
  onSubmit: (rating: number, comment?: string) => Promise<void>;
  onDismiss: () => Promise<void>;
  onLater: () => void;
}

export default function ReviewModal({ onSubmit, onDismiss, onLater }: ReviewModalProps) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    const timer = setTimeout(() => {
      modalRef.current?.focus();
    }, 50);
    return () => {
      clearTimeout(timer);
      previousFocusRef.current?.focus();
    };
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onLater();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }, [onLater]);

  async function handleSubmit() {
    if (rating === 0) {
      setError(t('review.requiredRating'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(rating, comment || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }

  async function handleDismiss() {
    try {
      await onDismiss();
    } catch (err) {
      onLater();
    }
  }

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <Card className="w-full max-w-md relative">
        <button
          onClick={onLater}
          className="absolute top-4 right-4 text-text-muted hover:text-text dark:text-text-muted-dark dark:hover:text-slate-100"
          aria-label={t('common.close')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 id="review-modal-title" className="text-2xl font-bold text-text dark:text-slate-100 mb-2">
            {t('review.title')}
          </h2>
          <p className="text-text-muted dark:text-text-muted-dark">
            {t('review.subtitle')}
          </p>
        </div>

        {error && (
          <div role="alert" className="p-3 bg-danger/10 text-danger rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`${star} ${t('review.star')}`}
            >
              <Star
                className={`w-10 h-10 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label
            htmlFor="review-comment"
            className="block text-sm font-medium text-text dark:text-slate-200 mb-1"
          >
            {t('review.commentLabel')}
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-white dark:bg-slate-700 text-text dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={3}
            placeholder={t('review.commentPlaceholder')}
          />
        </div>

        <div className="space-y-3">
          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? t('common.loading') : t('review.submit')}
          </Button>

          <Button onClick={onLater} variant="ghost" className="w-full">
            {t('review.later')}
          </Button>

          <button
            onClick={handleDismiss}
            className="w-full text-sm text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-slate-100 underline"
          >
            {t('review.dismiss')}
          </button>
        </div>
      </Card>
    </div>
  );
}
