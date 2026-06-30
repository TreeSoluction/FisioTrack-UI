import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../lib/api';
import ConsentModal from '../components/ConsentModal';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConsent, setShowConsent] = useState(false);
  const [missingDocuments, setMissingDocuments] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify({
        ...response.data.user,
        priceChanged: response.data.priceChanged,
      }));

      if (response.data.requiresConsent) {
        setMissingDocuments(response.data.missingDocuments);
        setShowConsent(true);
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }

  function handleConsentComplete() {
    setShowConsent(false);
    navigate('/dashboard');
  }

  if (showConsent) {
    return (
      <ConsentModal
        missingDocuments={missingDocuments}
        onComplete={handleConsentComplete}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <LogIn className="w-8 h-8 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-text dark:text-slate-100">FisioTrack</h1>
          <p className="text-text-muted dark:text-text-muted-dark mt-1">{t('auth.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div role="alert" className="p-3 bg-danger/10 text-danger rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label={t('auth.email')}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />

          <Input
            label={t('auth.password')}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('auth.entering') : t('auth.enter')}
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted dark:text-text-muted-dark mt-6">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-primary hover:text-primary-dark font-medium">
            {t('auth.registerNow')}
          </Link>
        </p>
      </Card>
    </div>
  );
}
