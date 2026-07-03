import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Ruler } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonText } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import api from '../lib/api';
import type { MetricDefinition } from '../types';

export default function MetricDefinitions() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<MetricDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMetric, setEditingMetric] = useState<MetricDefinition | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'NUMBER' as 'NUMBER' | 'TEXT',
    unit: '',
    min: '',
    max: '',
  });

  useEffect(() => {
    loadMetrics();
  }, []);

  async function loadMetrics() {
    try {
      setError(null);
      setLoading(true);
      const response = await api.get('/metric-definitions');
      setMetrics(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.errorLoadingData'));
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingMetric(null);
    setFormData({ name: '', type: 'NUMBER', unit: '', min: '', max: '' });
    setShowForm(true);
  }

  function openEditForm(metric: MetricDefinition) {
    setEditingMetric(metric);
    setFormData({
      name: metric.name,
      type: metric.type,
      unit: metric.unit || '',
      min: metric.min?.toString() || '',
      max: metric.max?.toString() || '',
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload = {
      name: formData.name.trim(),
      type: formData.type,
      ...(formData.unit && { unit: formData.unit }),
      ...(formData.type === 'NUMBER' && formData.min && { min: parseFloat(formData.min) }),
      ...(formData.type === 'NUMBER' && formData.max && { max: parseFloat(formData.max) }),
    };

    try {
      if (editingMetric) {
        await api.put(`/metric-definitions/${editingMetric.id}`, payload);
      } else {
        await api.post('/metric-definitions', payload);
      }
      toast.success(t('metrics.saved'));
      setShowForm(false);
      loadMetrics();
    } catch (err) {
      toast.error(t('common.error'));
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/metric-definitions/${id}`);
      setMetrics(metrics.filter((m) => m.id !== id));
      toast.success(t('metrics.deleted'));
    } catch (err) {
      toast.error(t('common.errorDeleting'));
    }
    setConfirmDeleteId(null);
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-text dark:text-slate-100">{t('metrics.title')}</h1>
        <ErrorState message={error} onRetry={loadMetrics} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/settings')}
          className="p-2 text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          aria-label={t('common.back')}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text dark:text-slate-100">{t('metrics.title')}</h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">{t('metrics.subtitle')}</p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="w-4 h-4 mr-2" />
          {t('metrics.newMetric')}
        </Button>
      </div>

      {showForm && (
        <Card>
          <h2 className="text-lg font-semibold text-text dark:text-slate-100 mb-4">
            {editingMetric ? t('metrics.editing') : t('metrics.creating')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('metrics.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('metrics.namePlaceholder')}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text dark:text-slate-200 mb-1">
                  {t('metrics.type')}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'NUMBER' | 'TEXT' })}
                  className="w-full h-10 px-3 rounded-lg border border-border dark:border-border-dark bg-white dark:bg-slate-800 text-text dark:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="NUMBER">{t('metrics.typeNumber')}</option>
                  <option value="TEXT">{t('metrics.typeText')}</option>
                </select>
              </div>
              <Input
                label={t('metrics.unit')}
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder={t('metrics.unitPlaceholder')}
              />
              {formData.type === 'NUMBER' && (
                <>
                  <Input
                    label={t('metrics.min')}
                    type="number"
                    value={formData.min}
                    onChange={(e) => setFormData({ ...formData, min: e.target.value })}
                  />
                  <Input
                    label={t('metrics.max')}
                    type="number"
                    value={formData.max}
                    onChange={(e) => setFormData({ ...formData, max: e.target.value })}
                  />
                </>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                {t('metrics.cancel')}
              </Button>
              <Button type="submit">{t('metrics.save')}</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <Card>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonText key={i} className="w-full" />
            ))}
          </div>
        </Card>
      ) : metrics.length === 0 && !showForm ? (
        <EmptyState
          icon={Ruler}
          title={t('metrics.noMetrics')}
          description={t('metrics.noMetricsDescription')}
          actionLabel={t('metrics.newMetric')}
          onAction={openCreateForm}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-text dark:text-slate-100">{metric.name}</h3>
                  <p className="text-sm text-text-muted dark:text-text-muted-dark">
                    {metric.type === 'NUMBER' ? t('metrics.typeNumber') : t('metrics.typeText')}
                    {metric.unit && ` · ${metric.unit}`}
                    {metric.min != null && metric.max != null && ` · ${metric.min}–${metric.max}`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditForm(metric)}
                    className="p-1.5 text-text-muted hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                    aria-label={t('common.edit')}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(metric.id)}
                    className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                    aria-label={t('common.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title={t('metrics.delete')}
        message={t('metrics.confirmDelete')}
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
        variant="danger"
      />
    </div>
  );
}
