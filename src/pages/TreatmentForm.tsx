import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../lib/api';
import type { Patient } from '../types';

export default function TratamentoForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = !!id;
  const pacienteIdFromUrl = searchParams.get('patientId');

  const [pacientes, setPacientes] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    patientId: pacienteIdFromUrl || '',
    estimatedTime: '',
    exercises: '',
    value: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPacientes();
    if (isEditing) {
      loadTratamento();
    }
  }, [id]);

  async function loadPacientes() {
    try {
      const response = await api.get('/patients');
      setPacientes(response.data);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error(t('common.error'));
    }
  }

  async function loadTratamento() {
    try {
      const response = await api.get(`/treatments/${id}`);
      setFormData({
        patientId: response.data.patientId,
        estimatedTime: response.data.estimatedTime,
        exercises: response.data.exercises,
        value: response.data.value,
        startDate: response.data.startDate?.split('T')[0] || '',
        endDate: response.data.endDate?.split('T')[0] || '',
      });
    } catch (error) {
      console.error('Error loading treatment:', error);
      toast.error(t('common.error'));
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
        value: parseFloat(formData.value),
      };

      if (isEditing) {
        await api.put(`/treatments/${id}`, data);
      } else {
        await api.post('/treatments', data);
      }
      toast.success(t('treatments.saved'));
      navigate('/treatments');
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
          onClick={() => navigate('/treatments')}
          className="p-2 text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-text dark:text-slate-100">
          {isEditing ? t('treatments.editing') : t('treatments.creating')}
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-danger/10 text-danger rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text dark:text-slate-200 mb-1">
              {t('treatments.patient')}
            </label>
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 rounded-lg border border-border dark:border-border-dark bg-white dark:bg-slate-800 text-text dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            >
              <option value="">{t('treatments.selectPatient')}</option>
              {pacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.name} - {paciente.cpf}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('treatments.estimatedTime')}
              name="estimatedTime"
              value={formData.estimatedTime}
              onChange={handleChange}
              placeholder={t('treatments.timePlaceholder')}
              required
            />
            <Input
              label={t('treatments.value') + ' (R$)'}
              name="value"
              type="number"
              step="0.01"
              value={formData.value}
              onChange={handleChange}
              required
            />
            <Input
              label={t('treatments.startDate')}
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
            />
            <Input
              label={t('treatments.endDate')}
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text dark:text-slate-200 mb-1">
              {t('treatments.exercises')}
            </label>
            <textarea
              name="exercises"
              value={formData.exercises}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-white dark:bg-slate-800 text-text dark:text-slate-100 placeholder:text-text-muted dark:placeholder:text-text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
              placeholder={t('treatments.exercisesPlaceholder')}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/treatments')}
            >
              {t('treatments.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? t('treatments.saving') : t('treatments.save')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
