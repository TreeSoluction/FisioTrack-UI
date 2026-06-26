import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import api from '../lib/api';

interface ConsentModalProps {
  missingDocuments: string[];
  onComplete: () => void;
}

export default function ConsentModal({ missingDocuments, onComplete }: ConsentModalProps) {
  const { t } = useTranslation();
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleConsentChange(docType: string, checked: boolean) {
    setConsents({ ...consents, [docType]: checked });
  }

  const allAccepted = missingDocuments.every((doc) => consents[doc]);

  async function handleSubmit() {
    if (!allAccepted) {
      setError(t('consent.required'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      for (const docType of missingDocuments) {
        await api.post('/consent', {
          documentType: docType,
          documentVersion: '1.0',
        });
      }
      onComplete();
    } catch (err: any) {
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark p-4">
      <Card className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text dark:text-slate-100">
            {t('consent.title')}
          </h1>
          <p className="text-text-muted dark:text-text-muted-dark mt-2">
            {t('consent.description')}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-danger/10 text-danger rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          {missingDocuments.includes('PRIVACY_POLICY') && (
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-border dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-700">
              <input
                type="checkbox"
                checked={!!consents['PRIVACY_POLICY']}
                onChange={(e) => handleConsentChange('PRIVACY_POLICY', e.target.checked)}
                className="mt-1 h-4 w-4 text-primary rounded border-gray-300"
              />
              <span className="text-sm text-text dark:text-slate-300">
                {t('consent.privacyPolicyCheck')}{' '}
                <Link to="/privacy-policy" target="_blank" className="text-primary hover:underline">
                  {t('lgpd.privacyPolicy.title')}
                </Link>
              </span>
            </label>
          )}

          {missingDocuments.includes('TERMS_OF_USE') && (
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-border dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-700">
              <input
                type="checkbox"
                checked={!!consents['TERMS_OF_USE']}
                onChange={(e) => handleConsentChange('TERMS_OF_USE', e.target.checked)}
                className="mt-1 h-4 w-4 text-primary rounded border-gray-300"
              />
              <span className="text-sm text-text dark:text-slate-300">
                {t('consent.termsOfUseCheck')}{' '}
                <Link to="/terms-of-use" target="_blank" className="text-primary hover:underline">
                  {t('lgpd.termsOfUse.title')}
                </Link>
              </span>
            </label>
          )}

          {missingDocuments.includes('CONSENT_TERMS') && (
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-border dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-700">
              <input
                type="checkbox"
                checked={!!consents['CONSENT_TERMS']}
                onChange={(e) => handleConsentChange('CONSENT_TERMS', e.target.checked)}
                className="mt-1 h-4 w-4 text-primary rounded border-gray-300"
              />
              <span className="text-sm text-text dark:text-slate-300">
                {t('consent.consentTermsCheck')}{' '}
                <Link to="/consent-terms" target="_blank" className="text-primary hover:underline">
                  {t('lgpd.consentTerms.title')}
                </Link>
              </span>
            </label>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={loading || !allAccepted}
        >
          {loading ? t('common.loading') : t('consent.acceptAll')}
        </Button>
      </Card>
    </div>
  );
}
