import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Eye, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { SkeletonText } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import api from '../lib/api';
import type { Patient } from '../types';

export default function Pacientes() {
  const { t } = useTranslation();
  const [pacientes, setPacientes] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadPacientes();
  }, []);

  async function loadPacientes() {
    try {
      setError(null);
      setLoading(true);
      const response = await api.get('/patients');
      setPacientes(response.data.data ?? response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pacientes.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/patients/${id}`);
      setPacientes(pacientes.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  }

  const filteredPacientes = pacientes.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.cpf.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-text dark:text-slate-100">{t('patients.title')}</h1>
        <Link to="/patients/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {t('patients.newPatient')}
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted dark:text-text-muted-dark" />
        <Input
          placeholder={t('patients.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {error && !loading && (
        <ErrorState message={error} onRetry={loadPacientes} />
      )}

      {!error && (
      <Card>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <SkeletonText className="w-1/4" />
                <SkeletonText className="w-1/5" />
                <SkeletonText className="w-1/5" />
                <SkeletonText className="w-1/6" />
              </div>
            ))}
          </div>
        ) : filteredPacientes.length === 0 ? (
          <EmptyState
            icon={Users}
            title={search ? t('patients.noResults') : t('patients.noData')}
            description={search ? t('patients.noResults') : t('patients.noData')}
            actionLabel={!search ? t('patients.newPatient') : undefined}
            onAction={!search ? () => window.location.href = '/patients/new' : undefined}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border dark:border-border-dark">
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted dark:text-text-muted-dark">{t('patients.name')}</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted dark:text-text-muted-dark">{t('patients.cpf')}</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted dark:text-text-muted-dark">{t('patients.phone')}</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted dark:text-text-muted-dark">{t('patients.status')}</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-text-muted dark:text-text-muted-dark">{t('patients.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPacientes.map((paciente) => (
                    <tr key={paciente.id} className="border-b border-border dark:border-border-dark last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700">
                      <td className="py-3 px-4">
                        <span className="font-medium text-text dark:text-slate-100">{paciente.name}</span>
                      </td>
                      <td className="py-3 px-4 text-text-muted dark:text-text-muted-dark">{paciente.cpf}</td>
                      <td className="py-3 px-4 text-text-muted dark:text-text-muted-dark">{paciente.phone}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            paciente.status === 'ACTIVE'
                              ? 'bg-success/10 text-success'
                              : 'bg-slate-100 dark:bg-slate-700 text-text-muted dark:text-text-muted-dark'
                          }`}
                        >
                          {paciente.status === 'ACTIVE' ? t('patients.active') : t('patients.inactive')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/patients/${paciente.id}`}
                            className="p-2 text-text-muted dark:text-text-muted-dark hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/patients/${paciente.id}/edit`}
                            className="p-2 text-text-muted dark:text-text-muted-dark hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setConfirmDeleteId(paciente.id)}
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

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-border dark:divide-border-dark">
              {filteredPacientes.map((paciente) => (
                <div key={paciente.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Link to={`/patients/${paciente.id}`} className="font-medium text-text dark:text-slate-100 hover:text-primary">
                      {paciente.name}
                    </Link>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        paciente.status === 'ACTIVE'
                          ? 'bg-success/10 text-success'
                          : 'bg-slate-100 dark:bg-slate-700 text-text-muted dark:text-text-muted-dark'
                      }`}
                    >
                      {paciente.status === 'ACTIVE' ? t('patients.active') : t('patients.inactive')}
                    </span>
                  </div>
                  <div className="text-sm text-text-muted dark:text-text-muted-dark space-y-0.5">
                    <p>{t('patients.cpf')}: {paciente.cpf}</p>
                    <p>{t('patients.phone')}: {paciente.phone}</p>
                  </div>
                  <div className="flex items-center gap-1 pt-1">
                    <Link
                      to={`/patients/${paciente.id}`}
                      className="p-2 text-text-muted dark:text-text-muted-dark hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      aria-label={t('common.view')}
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/patients/${paciente.id}/edit`}
                      className="p-2 text-text-muted dark:text-text-muted-dark hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                      aria-label={t('common.edit')}
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setConfirmDeleteId(paciente.id)}
                      className="p-2 text-text-muted dark:text-text-muted-dark hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                      aria-label={t('common.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
      )}

      <ConfirmDialog
        isOpen={confirmDeleteId !== null}
        title={t('patients.confirmDelete')}
        message={t('patients.confirmDelete')}
        onConfirm={() => {
          if (confirmDeleteId) {
            handleDelete(confirmDeleteId);
            setConfirmDeleteId(null);
          }
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
