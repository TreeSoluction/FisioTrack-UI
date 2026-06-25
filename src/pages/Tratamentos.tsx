import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../lib/api';
import type { Tratamento } from '../types';

export default function Tratamentos() {
  const [tratamentos, setTratamentos] = useState<Tratamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTratamentos();
  }, []);

  async function loadTratamentos() {
    try {
      const response = await api.get('/tratamentos');
      setTratamentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar tratamentos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (window.confirm('Tem certeza que deseja excluir este tratamento?')) {
      try {
        await api.delete(`/tratamentos/${id}`);
        setTratamentos(tratamentos.filter((t) => t.id !== id));
      } catch (error) {
        console.error('Erro ao excluir tratamento:', error);
      }
    }
  }

  const statusColors = {
    EM_ANDAMENTO: 'bg-success/10 text-success',
    PAUSADO: 'bg-warning/10 text-warning',
    CONCLUIDO: 'bg-slate-100 text-text-muted',
  };

  const statusLabels = {
    EM_ANDAMENTO: 'Em andamento',
    PAUSADO: 'Pausado',
    CONCLUIDO: 'Concluído',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Tratamentos</h1>
        <Link to="/tratamentos/novo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Tratamento
          </Button>
        </Link>
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-8 text-text-muted">Carregando...</div>
        ) : tratamentos.length === 0 ? (
          <div className="text-center py-8 text-text-muted">
            Nenhum tratamento registrado
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Paciente</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Tempo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Sessões</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Valor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tratamentos.map((tratamento) => (
                  <tr key={tratamento.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-text">
                        {tratamento.paciente?.nome || 'Paciente'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-muted">{tratamento.tempoEstimado}</td>
                    <td className="py-3 px-4 text-text-muted">{tratamento._count?.sessoes || 0}</td>
                    <td className="py-3 px-4 text-text-muted">
                      R$ {Number(tratamento.valor).toLocaleString('pt-BR')}
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
                          to={`/tratamentos/${tratamento.id}`}
                          className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/tratamentos/${tratamento.id}/editar`}
                          className="p-2 text-text-muted hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(tratamento.id)}
                          className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
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