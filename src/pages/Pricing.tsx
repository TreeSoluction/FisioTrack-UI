import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import Button from '../components/ui/Button';
import api from '../lib/api';

interface Price {
  priceId: string;
  amount: number;
  currency: string;
  monthlyEquivalent?: number;
  discountPercent?: number;
}

interface PricingData {
  product: { id: string; name: string; description: string | null; images: string[] } | null;
  prices: {
    monthly: Price | null;
    yearly: Price | null;
  };
}

export default function Pricing() {
  const { t } = useTranslation();
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [interval, setInterval] = useState<'month' | 'year'>('month');

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
      const response = await api.post('/billing/checkout', { interval });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err: any) {
      alert(err.response?.data?.message || t('common.error'));
    } finally {
      setCheckoutLoading(false);
    }
  }

  const yearlyAmount = pricing?.prices.yearly?.amount || 0;
  const discountPercent = pricing?.prices.yearly?.discountPercent || 0;

  const features = [
    'Pacientes ilimitados',
    'Tratamentos ilimitados',
    'Relatórios avançados',
    'Suporte prioritário',
    'Multi-usuário',
  ];

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

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setInterval('month')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              interval === 'month'
                ? 'bg-primary text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-text dark:text-slate-200'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setInterval('year')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors relative ${
              interval === 'year'
                ? 'bg-primary text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-text dark:text-slate-200'
            }`}
          >
            Anual
            {discountPercent > 0 && (
              <span className="absolute -top-2 -right-2 bg-success text-white text-xs px-2 py-0.5 rounded-full">
                -{discountPercent}%
              </span>
            )}
          </button>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-primary/20 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white text-sm font-semibold px-4 py-1 rounded-full">
              Mais Popular
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text dark:text-slate-100 mb-2">PRO</h2>
              <p className="text-text-muted dark:text-text-muted-dark">Para clínicas pequenas</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-text dark:text-slate-100">
                  R$ {interval === 'month' ? '19,90' : `${(yearlyAmount / 100 / 12).toFixed(2).replace('.', ',')}`}
                </span>
                <span className="text-text-muted dark:text-text-muted-dark">/mês</span>
              </div>
              {interval === 'year' && discountPercent > 0 && (
                <p className="text-sm text-success mt-2">
                  Economia de {discountPercent}% no plano anual
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
              className="w-full bg-primary text-white hover:bg-primary-dark"
              disabled={checkoutLoading || loading}
            >
              {checkoutLoading ? 'Redirecionando...' : 'Assinar PRO'}
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-text-muted dark:text-text-muted-dark mt-6">
          Pagamento processado com segurança pela Stripe. Cancele a qualquer momento.
        </p>
      </div>
    </div>
  );
}
