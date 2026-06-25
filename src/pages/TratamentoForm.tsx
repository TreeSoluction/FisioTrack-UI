import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../lib/api';
import type { Paciente } from '../types';

export default function TratamentoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = !!id;
  const pacienteIdFromUrl = searchParams.get('pacienteId');

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [formData, setFormData] = useState({
    pacienteId: pacienteIdFromUrl || '',
    tempoEstimado: '',
    exercicios: '',
    valor: '',
    dataInicio: '',
    dataFim: '',
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
      const response = await api.get('/pacientes');
      setPacientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    }
  }

  async function loadTratamento() {
    try {
      const response = await api.get(`/tratamentos/${id}`);
      setFormData({
        pacienteId: response.data.pacienteId,
        tempoEstimado: response.data.tempoEstimado,
        exercicios: response.data.exercicios,
        valor: response.data.valor,
        dataInicio: response.data.dataInicio?.split('T')[0] || '',
        dataFim: response.data.dataFim?.split('T')[0] || '',
      });
    } catch (error) {
      console.error('Erro ao carregar tratamento:', error);
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
        valor: parseFloat(formData.valor),
      };

      if (isEditing) {
        await api.put(`/tratamentos/${id}`, data);
      } else {
        await api.post('/tratamentos', data);
      }
      navigate('/tratamentos');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao salvar tratamento');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/tratamentos')}
          className="p-2 text-text-muted hover:text-text hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-text">
          {isEditing ? 'Editar Tratamento' : 'Novo Tratamento'}
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
            <label className="block text-sm font-medium text-text mb-1">
              Paciente
            </label>
            <select
              name="pacienteId"
              value={formData.pacienteId}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 rounded-lg border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            >
              <option value="">Selecione um paciente</option>
              {pacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.nome} - {paciente.cpf}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tempo Estimado"
              name="tempoEstimado"
              value={formData.tempoEstimado}
              onChange={handleChange}
              placeholder="Ex: 8 semanas"
              required
            />
            <Input
              label="Valor (R$)"
              name="valor"
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={handleChange}
              required
            />
            <Input
              label="Data de Início"
              name="dataInicio"
              type="date"
              value={formData.dataInicio}
              onChange={handleChange}
            />
            <Input
              label="Data de Término"
              name="dataFim"
              type="date"
              value={formData.dataFim}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Exercícios Prescritos
            </label>
            <textarea
              name="exercicios"
              value={formData.exercicios}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-border bg-white text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
              placeholder="Descreva os exercícios prescritos..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/tratamentos')}
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