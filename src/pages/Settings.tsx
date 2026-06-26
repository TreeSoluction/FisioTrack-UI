import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CreditCard, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../lib/api';

interface Subscription {
  plan: string;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export default function Settings() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    fetchSubscription();

    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      startPolling();
      setSearchParams({});
    }
  }, []);

  async function fetchSubscription() {
    try {
      const response = await api.get('/billing/subscription');
      setSubscription(response.data);
    } catch (err) {
      console.error('Failed to fetch subscription:', err);
    } finally {
      setLoading(false);
    }
  }

  function startPolling() {
    setPolling(true);
    let attempts = 0;
    const maxAttempts = 15;

    const interval = setInterval(async () => {
      attempts++;
      try {
        const response = await api.get('/billing/subscription');
        setSubscription(response.data);

        if (response.data.plan === 'PRO' || attempts >= maxAttempts) {
          clearInterval(interval);
          setPolling(false);
        }
      } catch (err) {
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setPolling(false);
        }
      }
    }, 2000);
  }

  async function handleOpenPortal() {
    try {
      const response = await api.post('/billing/portal');
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err: any) {
      alert(err.response?.data?.message || t('common.error'));
    }
  }

  async function handleCancel() {
    if (!confirm('Tem certeza que deseja cancelar sua assinatura? Ela permanecerá ativa até o fim do período.')) {
      return;
    }

    try {
      await api.post('/billing/cancel');
      fetchSubscription();
    } catch (err: any) {
      alert(err.response?.data?.message || t('common.error'));
    }
  }

  async function handleReactivate() {
    try {
      await api.post('/billing/reactivate');
      fetchSubscription();
    } catch (err: any) {
      alert(err.response?.data?.message || t('common.error'));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark">
        <p className="text-text-muted">{t('common.loading')}</p>
      </div>
    );
  }

  const isPro = subscription?.plan === 'PRO';
  const isCancelled = subscription?.cancelAtPeriodEnd;

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-text dark:text-slate-100 mb-8">Configurações</h1>

        {polling && (
          <div className="mb-6 p-4 bg-primary/10 text-primary rounded-lg flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
            Verificando status do pagamento...
          </div>
        )}

        <Card className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPro ? 'bg-primary/10' : 'bg-slate-100 dark:bg-slate-700'}`}>
              <CreditCard className={`w-6 h-6 ${isPro ? 'text-primary' : 'text-text-muted'}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text dark:text-slate-100">
                Plano {subscription?.plan || 'Gratuito'}
              </h2>
              <p className="text-sm text-text-muted dark:text-text-muted-dark">
                {isPro ? 'Acesso completo a todas as funcionalidades' : 'Funcionalidades limitadas'}
              </p>
            </div>
          </div>

          {isPro && subscription?.currentPeriodEnd && (
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <p className="text-sm text-text-muted dark:text-text-muted-dark">
                {isCancelled ? 'Sua assinatura será cancelada em:' : 'Próxima cobrança:'}
              </p>
              <p className="font-semibold text-text dark:text-slate-100">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {!isPro ? (
              <Button
                onClick={() => window.location.href = '/pricing'}
                className="w-full bg-primary text-white hover:bg-primary-dark"
              >
                Assinar PRO
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleOpenPortal}
                  variant="ghost"
                  className="w-full justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Gerenciar Pagamento
                </Button>

                {isCancelled ? (
                  <Button
                    onClick={handleReactivate}
                    className="w-full bg-success text-white hover:bg-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Reativar Assinatura
                  </Button>
                ) : (
                  <Button
                    onClick={handleCancel}
                    variant="ghost"
                    className="w-full text-danger hover:bg-danger/10"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Cancelar Assinatura
                  </Button>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
