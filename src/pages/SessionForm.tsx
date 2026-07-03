import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../lib/api';

export default function SessaoForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const tratamentoId = searchParams.get('treatmentId');

  const [formData, setFormData] = useState({
    weight: '',
    painScale: '5',
    arm: '',
    thigh: '',
    waist: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function validateField(name: string, value: string): string {
    switch (name) {
      case 'painScale':
        if (!value) return t('validation.painScaleRequired');
        const pain = parseInt(value);
        if (isNaN(pain) || pain < 0 || pain > 10) return t('validation.painScaleRange');
        return '';
      default:
        return '';
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tratamentoId) {
      toast.error(t('common.error'));
      return;
    }

    const painError = validateField('painScale', formData.painScale);
    if (painError) {
      setTouched({ ...touched, painScale: true });
      setErrors({ ...errors, painScale: painError });
      return;
    }

    setLoading(true);

    try {
      const data = {
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        painScale: parseInt(formData.painScale),
        measurements: {
          ...(formData.arm && { arm: parseFloat(formData.arm) }),
          ...(formData.thigh && { thigh: parseFloat(formData.thigh) }),
          ...(formData.waist && { waist: parseFloat(formData.waist) }),
        },
        notes: formData.notes || undefined,
      };

      await api.post(`/sessions/${tratamentoId}`, data);
      toast.success(t('sessions.saved'));
      navigate(`/treatments/${tratamentoId}`);
    } catch (error: any) {
      toast.error(t('common.errorLoadingData'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-text dark:text-slate-100">{t('sessions.title')}</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('sessions.weight')}
              name="weight"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={handleChange}
              placeholder={t('sessions.weightPlaceholder')}
            />

            <div>
              <label className="block text-sm font-medium text-text dark:text-slate-200 mb-1">
                {t('sessions.painScale')}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="painScale"
                  min="0"
                  max="10"
                  value={formData.painScale}
                  onChange={handleChange}
                  className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="w-12 text-center text-lg font-bold text-text dark:text-slate-100">
                  {formData.painScale}
                </span>
              </div>
              <div className="flex justify-between text-xs text-text-muted dark:text-text-muted-dark mt-1">
                <span>{t('sessions.noPain')}</span>
                <span>{t('sessions.maxPain')}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border dark:border-border-dark pt-4">
            <h3 className="text-sm font-medium text-text dark:text-slate-200 mb-3">{t('sessions.measurements')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label={t('sessions.arm')}
                name="arm"
                type="number"
                step="0.1"
                value={formData.arm}
                onChange={handleChange}
              />
              <Input
                label={t('sessions.thigh')}
                name="thigh"
                type="number"
                step="0.1"
                value={formData.thigh}
                onChange={handleChange}
              />
              <Input
                label={t('sessions.waist')}
                name="waist"
                type="number"
                step="0.1"
                value={formData.waist}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text dark:text-slate-200 mb-1">
              {t('sessions.notes')}
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-white dark:bg-slate-800 text-text dark:text-slate-100 placeholder:text-text-muted dark:placeholder:text-text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
              placeholder={t('sessions.notesPlaceholder')}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              {t('sessions.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? t('sessions.saving') : t('sessions.save')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
