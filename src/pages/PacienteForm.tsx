import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../lib/api';

export default function PacienteForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    email: '',
    endereco: '',
    historico: '',
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
      const response = await api.get(`/pacientes/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Erro ao carregar paciente:', error);
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
        await api.put(`/pacientes/${id}`, formData);
      } else {
        await api.post('/pacientes', formData);
      }
      navigate('/pacientes');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao salvar paciente');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/pacientes')}
          className="p-2 text-text-muted hover:text-text hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-text">
          {isEditing ? 'Editar Paciente' : 'Novo Paciente'}
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
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
            <Input
              label="CPF"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              required
            />
            <Input
              label="Data de Nascimento"
              name="dataNascimento"
              type="date"
              value={formData.dataNascimento}
              onChange={handleChange}
              required
            />
            <Input
              label="Telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label="Endereço"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Histórico Médico
            </label>
            <textarea
              name="historico"
              value={formData.historico}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-border bg-white text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
              placeholder="Descreva o histórico médico do paciente..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/pacientes')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}