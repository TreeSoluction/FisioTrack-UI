import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadPacientes();
    if (isEditing) {
      loadTratamento();
    }
    if (pacienteIdFromUrl) {
      setTouched((prev) => ({ ...prev, patientId: true }));
    }
  }, [id]);

  async function loadPacientes() {
    try {
      const response = await api.get('/patients');
      setPacientes(response.data.items);
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

  function validateField(name: string, value: string): string {
    switch (name) {
      case 'patientId':
        if (!value) return 'Paciente é obrigatório';
        return '';
      case 'estimatedTime':
        if (!value.trim()) return 'Tempo estimado é obrigatório';
        return '';
      case 'value':
        if (!value) return 'Valor é obrigatório';
        if (parseFloat(value) <= 0) return 'Valor deve ser positivo';
        return '';
      default:
        return '';
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const requiredFields = ['patientId', 'estimatedTime', 'value'];
    const allTouched: Record<string, boolean> = {};
    const allErrors: Record<string, string> = {};
    for (const key of requiredFields) {
      allTouched[key] = true;
      allErrors[key] = validateField(key, formData[key as keyof typeof formData]);
    }
    setTouched(allTouched);
    setErrors(allErrors);

    if (Object.values(allErrors).some((e) => e)) return;

    setLoading(true);

    try {
      const payload = {
        patientId: formData.patientId,
        estimatedTime: formData.estimatedTime,
        exercises: formData.exercises,
        value: parseFloat(formData.value),
        ...(formData.startDate && { startDate: formData.startDate }),
        ...(formData.endDate && { endDate: formData.endDate }),
      };

      if (isEditing) {
        await api.put(`/treatments/${id}`, payload);
      } else {
        await api.post('/treatments', payload);
      }
      toast.success(t('treatments.saved'));
      navigate('/treatments');
    } catch (error: any) {
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
          <Select
            label={t('treatments.patient')}
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.patientId ? errors.patientId : undefined}
            required
          >
            <option value="">{t('treatments.selectPatient')}</option>
            {pacientes.map((paciente) => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.name} - {paciente.cpf}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('treatments.estimatedTime')}
              name="estimatedTime"
              value={formData.estimatedTime}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.estimatedTime ? errors.estimatedTime : undefined}
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
              onBlur={handleBlur}
              error={touched.value ? errors.value : undefined}
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

          <Textarea
            label={t('treatments.exercises')}
            name="exercises"
            value={formData.exercises}
            onChange={handleChange}
            rows={4}
            placeholder={t('treatments.exercisesPlaceholder')}
            required
          />

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
