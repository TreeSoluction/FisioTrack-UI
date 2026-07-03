import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../lib/api';
import { maskCNPJ, maskPhone } from '../lib/masks';

export default function EnterpriseRequest() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [existingRequest, setExistingRequest] = useState<any>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    cnpj: '',
    teamSize: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    checkExistingRequest();
  }, []);

  async function checkExistingRequest() {
    try {
      const response = await api.get('/enterprise/status');
      if (response.data) {
        setExistingRequest(response.data);
      }
    } catch (err) {
      // No existing request
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    let masked = value;
    if (name === 'cnpj') masked = maskCNPJ(value);
    if (name === 'phone') masked = maskPhone(value);
    setFormData({ ...formData, [name]: masked });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/enterprise/request', {
        companyName: formData.companyName,
        cnpj: formData.cnpj || undefined,
        teamSize: parseInt(formData.teamSize),
        phone: formData.phone,
        message: formData.message || undefined,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }

  if (existingRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark p-4">
        <Card className="w-full max-w-md text-center">
          <Building2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text dark:text-slate-100 mb-2">
            {t('enterprise.title')}
          </h1>
          <p className="text-text-muted dark:text-text-muted-dark mb-6">
            {t('enterprise.alreadyRequested')}
          </p>
          <div className={`p-4 rounded-lg ${
            existingRequest.status === 'PENDING'
              ? 'bg-warning/10 text-warning'
              : existingRequest.status === 'APPROVED'
              ? 'bg-success/10 text-success'
              : 'bg-danger/10 text-danger'
          }`}>
            {t(`enterprise.status.${existingRequest.status.toLowerCase()}`)}
          </div>
          <Button
            className="w-full mt-6"
            onClick={() => navigate('/')}
          >
            {t('common.back')}
          </Button>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark p-4">
        <Card className="w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text dark:text-slate-100 mb-2">
            {t('enterprise.title')}
          </h1>
          <p className="text-text-muted dark:text-text-muted-dark mb-6">
            {t('enterprise.success')}
          </p>
          <Button
            className="w-full"
            onClick={() => navigate('/')}
          >
            {t('common.back')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text dark:text-slate-100">{t('enterprise.title')}</h1>
          <p className="text-text-muted dark:text-text-muted-dark mt-1">{t('enterprise.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-danger/10 text-danger rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label={t('enterprise.form.companyName')}
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Sua empresa"
            required
          />

          <Input
            label={t('enterprise.form.cnpj')}
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            placeholder="00.000.000/0001-00"
          />

          <Input
            label={t('enterprise.form.teamSize')}
            name="teamSize"
            type="number"
            value={formData.teamSize}
            onChange={handleChange}
            placeholder="10"
            min="1"
            required
          />

          <Input
            label={t('enterprise.form.phone')}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(11) 99999-9999"
            required
          />

          <div>
            <label className="block text-sm font-medium text-text dark:text-slate-200 mb-1">
              {t('enterprise.form.message')}
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-white dark:bg-slate-700 text-text dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              placeholder="Descreva suas necessidades..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('enterprise.form.submitting') : t('enterprise.form.submit')}
          </Button>
        </form>
      </Card>
    </div>
  );
}
