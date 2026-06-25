import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../lib/api';
import type { Paciente } from '../types';

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPacientes();
  }, []);

  async function loadPacientes() {
    try {
      const response = await api.get('/pacientes');
      setPacientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      try {
        await api.delete(`/pacientes/${id}`);
        setPacientes(pacientes.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Erro ao excluir paciente:', error);
      }
    }
  }

  const filteredPacientes = pacientes.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.cpf.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Pacientes</h1>
        <Link to="/pacientes/novo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Paciente
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <Input
          placeholder="Buscar por nome ou CPF..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-8 text-text-muted">Carregando...</div>
        ) : filteredPacientes.length === 0 ? (
          <div className="text-center py-8 text-text-muted">
            {search ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Nome</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">CPF</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Telefone</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPacientes.map((paciente) => (
                  <tr key={paciente.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-text">{paciente.nome}</span>
                    </td>
                    <td className="py-3 px-4 text-text-muted">{paciente.cpf}</td>
                    <td className="py-3 px-4 text-text-muted">{paciente.telefone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          paciente.status === 'ATIVO'
                            ? 'bg-success/10 text-success'
                            : 'bg-slate-100 text-text-muted'
                        }`}
                      >
                        {paciente.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/pacientes/${paciente.id}`}
                          className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/pacientes/${paciente.id}/editar`}
                          className="p-2 text-text-muted hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(paciente.id)}
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