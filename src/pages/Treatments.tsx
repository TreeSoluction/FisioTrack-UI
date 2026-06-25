import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../lib/api';
import type { Treatment } from '../types';

export default function Tratamentos() {
  const { t } = useTranslation();
  const [tratamentos, setTratamentos] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTratamentos();
  }, []);

  async function loadTratamentos() {
    try {
      const response = await api.get('/treatments');
      setTratamentos(response.data);
    } catch (error) {
      console.error('Error loading treatments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (window.confirm(t('treatments.noData'))) {
      try {
        await api.delete(`/treatments/${id}`);
        setTratamentos(tratamentos.filter((t) => t.id !== id));
      } catch (error) {
        console.error('Error deleting treatment:', error);
      }
    }
  }

  const statusColors = {
    IN_PROGRESS: 'bg-success/10 text-success',
    PAUSED: 'bg-warning/10 text-warning',
    COMPLETED: 'bg-slate-100 dark:bg-slate-700 text-text-muted dark:text-text-muted-dark',
  };

  const statusLabels = {
    IN_PROGRESS: t('treatments.inProgress'),
    PAUSED: t('treatments.paused'),
    COMPLETED: t('treatments.completed'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text dark:text-slate-100">{t('treatments.title')}</h1>
        <Link to="/treatments/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {t('treatments.newTreatment')}
          </Button>
        </Link>
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-8 text-text-muted dark:text-text-muted-dark">{t('common.loading')}</div>
        ) : tratamentos.length === 0 ? (
          <div className="text-center py-8 text-text-muted dark:text-text-muted-dark">
            {t('treatments.noData')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border dark:border-border-dark">
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted dark:text-text-muted-dark">{t('treatments.patient')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted dark:text-text-muted-dark">{t('treatments.estimatedTime')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted dark:text-text-muted-dark">{t('treatments.sessions')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted dark:text-text-muted-dark">{t('treatments.value')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted dark:text-text-muted-dark">{t('treatments.status')}</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-text-muted dark:text-text-muted-dark">{t('patients.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {tratamentos.map((tratamento) => (
                  <tr key={tratamento.id} className="border-b border-border dark:border-border-dark last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <td className="py-3 px-4">
                      <span className="font-medium text-text dark:text-slate-100">
                        {tratamento.patient?.name || t('treatments.patient')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-muted dark:text-text-muted-dark">{tratamento.estimatedTime}</td>
                    <td className="py-3 px-4 text-text-muted dark:text-text-muted-dark">{tratamento._count?.sessions || 0}</td>
                    <td className="py-3 px-4 text-text-muted dark:text-text-muted-dark">
                      R$ {Number(tratamento.value).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          statusColors[tratamento.status]
                        }`}
                      >
                        {statusLabels[tratamento.status]}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/treatments/${tratamento.id}`}
                          className="p-2 text-text-muted dark:text-text-muted-dark hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/treatments/${tratamento.id}/edit`}
                          className="p-2 text-text-muted dark:text-text-muted-dark hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(tratamento.id)}
                          className="p-2 text-text-muted dark:text-text-muted-dark hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
