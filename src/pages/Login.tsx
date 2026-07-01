import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../lib/api';
import ConsentModal from '../components/ConsentModal';
import { validateEmail } from '../lib/validations';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConsent, setShowConsent] = useState(false);
  const [missingDocuments, setMissingDocuments] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function validateField(name: string, value: string): string {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email é obrigatório';
        if (!validateEmail(value)) return 'Email inválido';
        return '';
      case 'password':
        if (!value) return 'Senha é obrigatória';
        if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
        return '';
      default:
        return '';
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  }

  function handleFieldChange(name: string, value: string) {
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const allTouched = { email: true, password: true };
    const allErrors = {
      email: validateField('email', email),
      password: validateField('password', password),
    };
    setTouched(allTouched);
    setErrors(allErrors);

    if (Object.values(allErrors).some((e) => e)) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
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
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            onBlur={handleBlur}
            error={touched.email ? errors.email : undefined}
            placeholder="seu@email.com"
            required
          />

          <Input
            label={t('auth.password')}
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => handleFieldChange('password', e.target.value)}
            onBlur={handleBlur}
            error={touched.password ? errors.password : undefined}
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
