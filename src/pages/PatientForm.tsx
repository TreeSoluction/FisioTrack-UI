import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../lib/api';
import { validateCPF, validateEmail, validatePhone } from '../lib/validations';
import { maskCPF, maskPhone } from '../lib/masks';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
      toast.error(t('common.errorLoadingData'));
    }
  }

  function validateField(name: string, value: string): string {
    switch (name) {
      case 'name':
        if (!value.trim()) return t('validation.nameRequired');
        if (value.trim().length < 2) return t('validation.nameMinLength');
        return '';
      case 'cpf':
        if (!value.trim()) return t('validation.cpfRequired');
        if (!validateCPF(value)) return t('validation.cpfInvalid');
        return '';
      case 'phone':
        if (!value.trim()) return t('validation.phoneRequired');
        if (!validatePhone(value)) return t('validation.phoneInvalid');
        return '';
      case 'email':
        if (!value.trim()) return t('validation.emailRequired');
        if (!validateEmail(value)) return t('validation.emailInvalid');
        return '';
      default:
        return '';
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    let masked = value;
    if (name === 'cpf') masked = maskCPF(value);
    if (name === 'phone') masked = maskPhone(value);
    setFormData({ ...formData, [name]: masked });
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, masked) });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const allTouched: Record<string, boolean> = {};
    const allErrors: Record<string, string> = {};
    for (const [key, value] of Object.entries(formData)) {
      allTouched[key] = true;
      allErrors[key] = validateField(key, value);
    }
    setTouched(allTouched);
    setErrors(allErrors);

    if (Object.values(allErrors).some((e) => e)) return;

    setLoading(true);

    try {
      const payload = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== '')
      );
      if (isEditing) {
        await api.put(`/patients/${id}`, payload);
      } else {
        await api.post('/patients', payload);
      }
      toast.success(t('patients.saved'));
      navigate('/patients');
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('patients.name')}
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name ? errors.name : undefined}
              required
            />
            <Input
              label={t('patients.cpf')}
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.cpf ? errors.cpf : undefined}
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
              onBlur={handleBlur}
              error={touched.phone ? errors.phone : undefined}
              placeholder="(00) 00000-0000"
              required
            />
            <Input
              label={t('patients.email')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? errors.email : undefined}
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
