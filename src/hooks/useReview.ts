import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

interface ReviewStatus {
  canReview: boolean;
  hasReviewed: boolean;
  wasDismissed: boolean;
  accountAgeDays: number;
  reason: string;
}

export function useReview() {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState<ReviewStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const checkStatus = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/reviews/status');
      setStatus(response.data);

      if (response.data.canReview) {
        setShowModal(true);
      }
    } catch (err) {
      // User not authenticated or error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const submitReview = async (rating: number, comment?: string) => {
    await api.post('/reviews', { rating, comment });
    setShowModal(false);
    setStatus((prev) => prev ? { ...prev, hasReviewed: true, canReview: false } : null);
  };

  const dismissReview = async () => {
    await api.post('/reviews/dismiss');
    setShowModal(false);
    setStatus((prev) => prev ? { ...prev, wasDismissed: true, canReview: false } : null);
  };

  const closeLater = () => {
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  return {
    showModal,
    canReview: status?.canReview ?? false,
    hasReviewed: status?.hasReviewed ?? false,
    loading,
    submitReview,
    dismissReview,
    closeLater,
    openModal,
    checkStatus,
  };
}
