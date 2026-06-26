import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../lib/api';

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [consents, setConsents] = useState({
    privacyPolicy: false,
    termsOfUse: false,
    consentTerms: false,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleConsentChange(e: React.ChangeEvent<HTMLInputElement>) {
    setConsents({ ...consents, [e.target.name]: e.target.checked });
  }

  const allConsentsAccepted = consents.privacyPolicy && consents.termsOfUse && consents.consentTerms;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    if (!allConsentsAccepted) {
      setError(t('consent.required'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/login');
    } catch (error: any) {
      setError(error.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 mb-4">
            <UserPlus className="w-8 h-8 text-secondary" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-text dark:text-slate-100">{t('auth.createAccount')}</h1>
          <p className="text-text-muted dark:text-text-muted-dark mt-1">{t('auth.registerSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div role="alert" className="p-3 bg-danger/10 text-danger rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label={t('auth.name')}
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('auth.name')}
            required
          />

          <Input
            label={t('auth.email')}
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            required
          />

          <Input
            label={t('auth.password')}
            name="password"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Input
            label={t('auth.confirmPassword')}
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <div className="space-y-3 pt-4 border-t border-border dark:border-border-dark">
            <p className="text-sm font-medium text-text dark:text-slate-100">{t('consent.title')}</p>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="privacyPolicy"
                checked={consents.privacyPolicy}
                onChange={handleConsentChange}
                className="mt-1 h-4 w-4 text-primary rounded border-gray-300"
              />
              <span className="text-sm text-text-muted dark:text-text-muted-dark">
                {t('consent.privacyPolicyCheck')}{' '}
                <Link to="/privacy-policy" target="_blank" className="text-primary hover:underline">
                  {t('lgpd.privacyPolicy.title')}
                </Link>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="termsOfUse"
                checked={consents.termsOfUse}
                onChange={handleConsentChange}
                className="mt-1 h-4 w-4 text-primary rounded border-gray-300"
              />
              <span className="text-sm text-text-muted dark:text-text-muted-dark">
                {t('consent.termsOfUseCheck')}{' '}
                <Link to="/terms-of-use" target="_blank" className="text-primary hover:underline">
                  {t('lgpd.termsOfUse.title')}
                </Link>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="consentTerms"
                checked={consents.consentTerms}
                onChange={handleConsentChange}
                className="mt-1 h-4 w-4 text-primary rounded border-gray-300"
              />
              <span className="text-sm text-text-muted dark:text-text-muted-dark">
                {t('consent.consentTermsCheck')}{' '}
                <Link to="/consent-terms" target="_blank" className="text-primary hover:underline">
                  {t('lgpd.consentTerms.title')}
                </Link>
              </span>
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted dark:text-text-muted-dark mt-6">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
            {t('auth.loginNow')}
          </Link>
        </p>
      </Card>
    </div>
  );
}
