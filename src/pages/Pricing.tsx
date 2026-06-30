import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Check, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import { SkeletonCard, SkeletonText } from '../components/ui/Skeleton';
import api from '../lib/api';

interface PricingData {
  monthly: { amount: number; currency: string };
  yearly: { amount: number; currency: string; monthlyEquivalent: number; discountPercent: number };
  onetime: { amount: number; currency: string; durationDays: number };
}

export default function Pricing() {
  const { t } = useTranslation();
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [interval, setInterval] = useState<'month' | 'year' | 'onetime'>('month');

  useEffect(() => {
    fetchPricing();
  }, []);

  async function fetchPricing() {
    try {
      const response = await api.get('/billing/pricing');
      setPricing(response.data);
    } catch (err) {
      console.error('Failed to fetch pricing:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout() {
    setCheckoutLoading(true);
    try {
      let response;
      if (interval === 'onetime') {
        response = await api.post('/billing/checkout-onetime');
      } else {
        response = await api.post('/billing/checkout', { plan: interval });
      }

      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('common.error'));
    } finally {
      setCheckoutLoading(false);
    }
  }

  const getDisplayPrice = () => {
    if (!pricing) return '0,00';
    switch (interval) {
      case 'month':
        return (pricing.monthly.amount / 100).toFixed(2).replace('.', ',');
      case 'year':
        return (pricing.yearly.amount / 100 / 12).toFixed(2).replace('.', ',');
      case 'onetime':
        return (pricing.onetime.amount / 100).toFixed(2).replace('.', ',');
    }
  };

  const discountPercent = pricing?.yearly?.discountPercent || 0;

  const features = [
    t('pricing.feature1'),
    t('pricing.feature2'),
    t('pricing.feature3'),
    t('pricing.feature4'),
    t('pricing.feature5'),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark py-12">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <SkeletonText className="w-64 h-8 mx-auto" />
            <SkeletonText className="w-96 mx-auto" />
          </div>
          <div className="flex justify-center gap-2">
            <SkeletonText className="w-20 h-10" />
            <SkeletonText className="w-20 h-10" />
            <SkeletonText className="w-20 h-10" />
          </div>
          <div className="max-w-md mx-auto">
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-text dark:text-slate-100 mb-4">
            {t('landing.pricing.title')}
          </h1>
          <p className="text-lg text-text-muted dark:text-text-muted-dark">
            {t('landing.pricing.subtitle')}
          </p>
        </div>

        {/* Interval selector */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setInterval('month')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors ${
              interval === 'month'
                ? 'bg-primary text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-text dark:text-slate-200'
            }`}
          >
            {t('pricing.monthly')}
          </button>
          <button
            onClick={() => setInterval('year')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors relative ${
              interval === 'year'
                ? 'bg-primary text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-text dark:text-slate-200'
            }`}
          >
            {t('pricing.yearly')}
            {discountPercent > 0 && (
              <span className="absolute -top-2 -right-2 bg-success text-white text-xs px-2 py-0.5 rounded-full">
                -{discountPercent}%
              </span>
            )}
          </button>
          <button
            onClick={() => setInterval('onetime')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              interval === 'onetime'
                ? 'bg-accent text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-text dark:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            {t('pricing.onetime')}
          </button>
        </div>

        {/* Pricing card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-primary/20 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white text-sm font-semibold px-4 py-1 rounded-full">
              {interval === 'onetime' ? t('pricing.onetimeBadge') : t('pricing.mostPopular')}
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text dark:text-slate-100 mb-2">PRO</h2>
              <p className="text-text-muted dark:text-text-muted-dark">
                {interval === 'onetime' ? t('pricing.onetimeDescription') : t('pricing.proDescription')}
              </p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-text dark:text-slate-100">
                  R$ {getDisplayPrice()}
                </span>
                <span className="text-text-muted dark:text-text-muted-dark">
                  {interval === 'onetime' ? '' : '/mês'}
                </span>
              </div>
              {interval === 'year' && discountPercent > 0 && (
                <p className="text-sm text-success mt-2">
                  {t('pricing.yearlyDiscount', { percent: discountPercent })}
                </p>
              )}
              {interval === 'onetime' && (
                <p className="text-sm text-text-muted dark:text-text-muted-dark mt-2">
                  {t('pricing.onetimeNotice')}
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-text dark:text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={handleCheckout}
              className={`w-full ${
                interval === 'onetime'
                  ? 'bg-accent text-white hover:bg-accent/90'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
              disabled={checkoutLoading}
            >
              {checkoutLoading
                ? t('pricing.redirecting')
                : interval === 'onetime'
                  ? t('pricing.payOnetime')
                  : t('pricing.subscribePro')}
            </Button>

            {interval === 'onetime' && (
              <p className="text-center text-xs text-text-muted dark:text-text-muted-dark mt-4">
                {t('pricing.onetimePaymentMethods')}
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-text-muted dark:text-text-muted-dark mt-6">
          {t('pricing.pagarmeNotice')}
        </p>
      </div>
    </div>
  );
}
