import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useReview } from './useReview';

vi.mock('../lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import api from '../lib/api';

describe('useReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should return initial state with loading false when no token', async () => {
    const { result } = renderHook(() => useReview());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.showModal).toBe(false);
    expect(result.current.canReview).toBe(false);
    expect(api.get).not.toHaveBeenCalled();
  });

  it('should fetch status and show modal when canReview', async () => {
    localStorage.setItem('token', 'test-token');
    (api.get as any).mockResolvedValue({
      data: { canReview: true, hasReviewed: false },
    });

    const { result } = renderHook(() => useReview());

    await waitFor(() => {
      expect(result.current.showModal).toBe(true);
    });

    expect(result.current.canReview).toBe(true);
  });

  it('should not show modal when cannot review', async () => {
    localStorage.setItem('token', 'test-token');
    (api.get as any).mockResolvedValue({
      data: { canReview: false, hasReviewed: true },
    });

    const { result } = renderHook(() => useReview());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.showModal).toBe(false);
  });

  it('should submit review and update status', async () => {
    localStorage.setItem('token', 'test-token');
    (api.get as any).mockResolvedValue({
      data: { canReview: true, hasReviewed: false },
    });
    (api.post as any).mockResolvedValue({});

    const { result } = renderHook(() => useReview());

    await waitFor(() => {
      expect(result.current.showModal).toBe(true);
    });

    await act(async () => {
      await result.current.submitReview(5, 'Great app');
    });

    expect(api.post).toHaveBeenCalledWith('/reviews', { rating: 5, comment: 'Great app' });
    expect(result.current.showModal).toBe(false);
    expect(result.current.hasReviewed).toBe(true);
  });

  it('should dismiss review and hide modal', async () => {
    localStorage.setItem('token', 'test-token');
    (api.get as any).mockResolvedValue({
      data: { canReview: true, hasReviewed: false },
    });
    (api.post as any).mockResolvedValue({});

    const { result } = renderHook(() => useReview());

    await waitFor(() => {
      expect(result.current.showModal).toBe(true);
    });

    await act(async () => {
      await result.current.dismissReview();
    });

    expect(api.post).toHaveBeenCalledWith('/reviews/dismiss');
    expect(result.current.showModal).toBe(false);
    expect(result.current.canReview).toBe(false);
  });

  it('should close modal later without API call', async () => {
    localStorage.setItem('token', 'test-token');
    (api.get as any).mockResolvedValue({ data: { canReview: true } });

    const { result } = renderHook(() => useReview());

    await waitFor(() => {
      expect(result.current.showModal).toBe(true);
    });

    act(() => {
      result.current.closeLater();
    });

    expect(result.current.showModal).toBe(false);
  });

  it('should open modal manually', async () => {
    localStorage.setItem('token', 'test-token');
    (api.get as any).mockResolvedValue({ data: { canReview: false } });

    const { result } = renderHook(() => useReview());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.openModal();
    });

    expect(result.current.showModal).toBe(true);
  });

  it('should handle API error gracefully', async () => {
    localStorage.setItem('token', 'test-token');
    (api.get as any).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useReview());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.showModal).toBe(false);
  });
});
