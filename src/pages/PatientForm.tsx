import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../lib/api';

export default function PacienteForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    medicalHistory: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadPaciente();
    }
  }, [id]);

  async function loadPaciente() {
    try {
      const response = await api.get(`/patients/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Error loading patient:', error);
      toast.error(t('common.error'));
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await api.put(`/patients/${id}`, formData);
      } else {
        await api.post('/patients', formData);
      }
      toast.success(t('patients.saved'));
      navigate('/patients');
    } catch (error: any) {
      setError(error.response?.data?.message || t('common.error'));
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/patients')}
          className="p-2 text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-text dark:text-slate-100">
          {isEditing ? t('patients.editing') : t('patients.creating')}
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-danger/10 text-danger rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('patients.name')}
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label={t('patients.cpf')}
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              required
            />
            <Input
              label={t('patients.birthDate')}
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
            <Input
              label={t('patients.phone')}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              required
            />
            <Input
              label={t('patients.email')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label={t('patients.address')}
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text dark:text-slate-200 mb-1">
              {t('patients.medicalHistory')}
            </label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-white dark:bg-slate-800 text-text dark:text-slate-100 placeholder:text-text-muted dark:placeholder:text-text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
              placeholder={t('patients.historyPlaceholder')}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/patients')}
            >
              {t('patients.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? t('patients.saving') : t('patients.save')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
