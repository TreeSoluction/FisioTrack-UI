import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { CreditCard, ExternalLink, AlertTriangle, CheckCircle, Download, Shield, XCircle, Mail, Trash2, Ruler } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { SkeletonCard } from '../components/ui/Skeleton';
import api from '../lib/api';

interface Subscription {
  plan: string;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  isOneTime?: boolean;
  oneTimeExpiresAt?: string | null;
}

export default function Settings() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [priceChanged, setPriceChanged] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState('');

  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmExportOpen, setConfirmExportOpen] = useState(false);
  const [confirmRevokeOpen, setConfirmRevokeOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmDeleteFinalOpen, setConfirmDeleteFinalOpen] = useState(false);

  useEffect(() => {
    fetchSubscription();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.priceChanged) {
      setPriceChanged(true);
    }

    const payment = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');
    const preferenceId = searchParams.get('preference_id');

    if (payment === 'success') {
      setPaymentStatus('success');
      setPaymentMessage(t('settings.paymentSuccess'));
      startPaymentPolling();
    } else if (payment === 'pending') {
      setPaymentStatus('pending');
      setPaymentMessage(t('settings.paymentPending'));
      startPaymentPolling();
    } else if (payment === 'failure') {
      setPaymentStatus('error');
      setPaymentMessage(t('settings.paymentFailed'));
    } else if (sessionId || preferenceId) {
      startPolling();
    }

    setSearchParams({});
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

  function startPaymentPolling() {
    setPolling(true);
    let attempts = 0;
    const maxAttempts = 20;

    const interval = setInterval(async () => {
      attempts++;
      try {
        const response = await api.get('/billing/subscription');
        setSubscription(response.data);

        if (response.data.plan === 'PRO') {
          setPaymentStatus('success');
          setPaymentMessage(t('settings.paymentActivated'));
          clearInterval(interval);
          setPolling(false);
        } else if (attempts >= maxAttempts) {
          setPaymentStatus('pending');
          setPaymentMessage(t('settings.paymentStillPending'));
          clearInterval(interval);
          setPolling(false);
        }
      } catch (err) {
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setPolling(false);
        }
      }
    }, 3000);
  }

  async function handleOpenPortal() {
    try {
      const response = await api.post('/billing/portal');
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('common.error'));
    }
  }

  async function handleCancelConfirm() {
    setConfirmCancelOpen(false);
    try {
      await api.post('/billing/cancel');
      fetchSubscription();
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('common.error'));
    }
  }

  async function handleReactivate() {
    try {
      await api.post('/billing/reactivate');
      fetchSubscription();
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('common.error'));
    }
  }

  async function handleExportConfirm() {
    setConfirmExportOpen(false);
    setExporting(true);
    try {
      const response = await api.get('/users/me/export');
      const data = response.data;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fisiotrack-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(t('lgpd.exportSuccess'));
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('common.error'));
    } finally {
      setExporting(false);
    }
  }

  async function handleRevokeConfirm() {
    setConfirmRevokeOpen(false);
    try {
      const types = ['PRIVACY_POLICY', 'TERMS_OF_USE', 'CONSENT_TERMS'];
      for (const type of types) {
        await api.delete(`/consent/${type}`).catch(() => {});
      }
      try { await api.post('/auth/logout'); } catch { /* continue */ }
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      toast.success(t('consent.revoked'));
      window.location.href = '/login';
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('common.error'));
    }
  }

  async function handleDeleteAccountFinalConfirm() {
    setConfirmDeleteFinalOpen(false);
    try {
      await api.delete('/users/me');
      try { await api.post('/auth/logout'); } catch { /* continue */ }
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      toast.success(t('settings.accountDeleted'));
      window.location.href = '/login';
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('common.error'));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark py-12">
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          <div className="text-3xl font-bold text-text dark:text-slate-100">{t('settings.title')}</div>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const isPro = subscription?.plan === 'PRO';
  const isCancelled = subscription?.cancelAtPeriodEnd;
  const isOneTime = subscription?.isOneTime;
  const oneTimeExpiresAt = subscription?.oneTimeExpiresAt;

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-text dark:text-slate-100 mb-8">{t('settings.title')}</h1>

        {priceChanged && (
          <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
            <p className="text-accent font-medium">
              {t('settings.priceChanged')}
            </p>
          </div>
        )}

        {paymentStatus && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            paymentStatus === 'success' ? 'bg-success/10 border border-success/30' :
            paymentStatus === 'pending' ? 'bg-warning/10 border border-warning/30' :
            'bg-danger/10 border border-danger/30'
          }`}>
            {paymentStatus === 'success' && <CheckCircle className="w-5 h-5 text-success" />}
            {paymentStatus === 'pending' && <div className="animate-spin w-5 h-5 border-2 border-warning border-t-transparent rounded-full" />}
            {paymentStatus === 'error' && <AlertTriangle className="w-5 h-5 text-danger" />}
            <p className={`font-medium ${
              paymentStatus === 'success' ? 'text-success' :
              paymentStatus === 'pending' ? 'text-warning' :
              'text-danger'
            }`}>
              {paymentMessage}
            </p>
          </div>
        )}

        {polling && !paymentStatus && (
          <div className="mb-6 p-4 bg-primary/10 text-primary rounded-lg flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
            {t('settings.checkingPayment')}
          </div>
        )}

        {/* Subscription */}
        <Card className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPro ? 'bg-primary/10' : 'bg-slate-100 dark:bg-slate-700'}`}>
              <CreditCard className={`w-6 h-6 ${isPro ? 'text-primary' : 'text-text-muted'}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text dark:text-slate-100">
                {t('settings.plan')} {subscription?.plan || 'FREE'}
              </h2>
              <p className="text-sm text-text-muted dark:text-text-muted-dark">
                {isPro ? t('settings.fullAccess') : t('settings.limitedFeatures')}
              </p>
            </div>
          </div>

          {isPro && subscription?.currentPeriodEnd && !isOneTime && (
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <p className="text-sm text-text-muted dark:text-text-muted-dark">
                {isCancelled ? t('settings.subscriptionEnds') : t('settings.nextBilling')}
              </p>
              <p className="font-semibold text-text dark:text-slate-100">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}

          {isPro && isOneTime && oneTimeExpiresAt && (
            <div className="mb-6 p-4 bg-warning/10 border border-warning/30 rounded-lg">
              <p className="text-sm text-warning font-medium">
                {t('settings.oneTimeAccess')}
              </p>
              <p className="font-semibold text-text dark:text-slate-100">
                {t('settings.accessUntil')} {new Date(oneTimeExpiresAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {!isPro ? (
              <Button
                onClick={() => window.location.href = '/pricing'}
                className="w-full bg-primary text-white hover:bg-primary-dark"
              >
                {t('settings.subscribePro')}
              </Button>
            ) : isOneTime ? (
              <Button
                onClick={() => window.location.href = '/pricing'}
                className="w-full bg-primary text-white hover:bg-primary-dark"
              >
                {t('settings.renewAccess')}
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleOpenPortal}
                  variant="ghost"
                  className="w-full justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t('settings.managePayment')}
                </Button>

                {isCancelled ? (
                  <Button
                    onClick={handleReactivate}
                    className="w-full bg-success text-white hover:bg-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t('settings.reactivate')}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setConfirmCancelOpen(true)}
                    variant="ghost"
                    className="w-full text-danger hover:bg-danger/10"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {t('settings.cancelSubscription')}
                  </Button>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Custom Metrics */}
        <Card className="mb-6">
          <Link
            to="/metric-definitions"
            className="flex items-center justify-between p-4 rounded-lg border border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Ruler className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-medium text-text dark:text-slate-100">{t('metrics.title')}</p>
                <p className="text-sm text-text-muted dark:text-text-muted-dark">{t('metrics.subtitle')}</p>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-text-muted dark:text-text-muted-dark" />
          </Link>
        </Card>

        {/* LGPD Data Rights */}
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-text dark:text-slate-100">{t('lgpd.yourRights')}</h2>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setConfirmExportOpen(true)}
              disabled={exporting}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-text dark:text-slate-100">{t('lgpd.exportData')}</p>
                  <p className="text-sm text-text-muted dark:text-text-muted-dark">{t('lgpd.exportDescription')}</p>
                </div>
              </div>
              {exporting && <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />}
            </button>

            <button
              onClick={() => setConfirmRevokeOpen(true)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-accent" />
                <div className="text-left">
                  <p className="font-medium text-text dark:text-slate-100">{t('lgpd.revokeConsent')}</p>
                  <p className="text-sm text-text-muted dark:text-text-muted-dark">{t('lgpd.revokeDescription')}</p>
                </div>
              </div>
            </button>

            <a
              href="mailto:soluctiontree@gmail.com?subject=FisioTrack - Dúvidas LGPD"
              className="w-full flex items-center justify-between p-4 rounded-lg border border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary" />
                <div className="text-left">
                  <p className="font-medium text-text dark:text-slate-100">{t('lgpd.contactDPO')}</p>
                  <p className="text-sm text-text-muted dark:text-text-muted-dark">soluctiontree@gmail.com</p>
                </div>
              </div>
            </a>
          </div>
        </Card>

        {/* Data Security Info */}
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-success" />
            <h2 className="text-xl font-bold text-text dark:text-slate-100">{t('lgpd.dataSecurity')}</h2>
          </div>
          <p className="text-sm text-text-muted dark:text-text-muted-dark leading-relaxed">
            {t('lgpd.dataSecurityInfo')}
          </p>
        </Card>

        {/* Danger Zone */}
        <Card className="border-danger/30">
          <h2 className="text-xl font-bold text-danger mb-4">{t('settings.dangerZone')}</h2>
          <button
            onClick={() => setConfirmDeleteOpen(true)}
            className="w-full flex items-center justify-between p-4 rounded-lg border border-danger/30 hover:bg-danger/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-danger" />
              <div className="text-left">
                <p className="font-medium text-danger">{t('settings.deleteAccount')}</p>
                <p className="text-sm text-text-muted dark:text-text-muted-dark">{t('settings.deleteAccountDescription')}</p>
              </div>
            </div>
          </button>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={confirmCancelOpen}
        title={t('settings.cancelSubscription')}
        message={t('settings.confirmCancelSubscription')}
        onConfirm={handleCancelConfirm}
        onCancel={() => setConfirmCancelOpen(false)}
        variant="warning"
      />

      <ConfirmDialog
        isOpen={confirmExportOpen}
        title={t('lgpd.exportData')}
        message={t('lgpd.exportDescription')}
        onConfirm={handleExportConfirm}
        onCancel={() => setConfirmExportOpen(false)}
        variant="info"
      />

      <ConfirmDialog
        isOpen={confirmRevokeOpen}
        title={t('lgpd.revokeConsent')}
        message={t('lgpd.revokeDescription')}
        onConfirm={handleRevokeConfirm}
        onCancel={() => setConfirmRevokeOpen(false)}
        variant="danger"
      />

      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        title={t('settings.deleteAccount')}
        message={t('settings.confirmDelete')}
        onConfirm={() => {
          setConfirmDeleteOpen(false);
          setConfirmDeleteFinalOpen(true);
        }}
        onCancel={() => setConfirmDeleteOpen(false)}
        variant="danger"
      />

      <ConfirmDialog
        isOpen={confirmDeleteFinalOpen}
        title={t('settings.deleteAccount')}
        message={t('settings.confirmDeleteFinal')}
        onConfirm={handleDeleteAccountFinalConfirm}
        onCancel={() => setConfirmDeleteFinalOpen(false)}
        variant="danger"
      />
    </div>
  );
}
