import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../lib/api';

export default function SessaoForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tratamentoId = searchParams.get('tratamentoId');

  const [formData, setFormData] = useState({
    peso: '',
    escalaDor: '5',
    braco: '',
    coxa: '',
    cintura: '',
    observacoes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tratamentoId) {
      setError('Tratamento não especificado');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = {
        peso: formData.peso ? parseFloat(formData.peso) : undefined,
        escalaDor: parseInt(formData.escalaDor),
        medidas: {
          ...(formData.braco && { braco: parseFloat(formData.braco) }),
          ...(formData.coxa && { coxa: parseFloat(formData.coxa) }),
          ...(formData.cintura && { cintura: parseFloat(formData.cintura) }),
        },
        observacoes: formData.observacoes || undefined,
      };

      await api.post(`/sessoes/${tratamentoId}`, data);
      navigate(`/tratamentos/${tratamentoId}`);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao salvar sessão');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-text-muted hover:text-text hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-text">Nova Sessão</h1>
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
              label="Peso (kg)"
              name="peso"
              type="number"
              step="0.1"
              value={formData.peso}
              onChange={handleChange}
              placeholder="Ex: 75.5"
            />

            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Escala de Dor (0-10)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="escalaDor"
                  min="0"
                  max="10"
                  value={formData.escalaDor}
                  onChange={handleChange}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="w-12 text-center text-lg font-bold text-text">
                  {formData.escalaDor}
                </span>
              </div>
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>Sem dor</span>
                <span>Dor máxima</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-medium text-text mb-3">Medidas (opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Braço (cm)"
                name="braco"
                type="number"
                step="0.1"
                value={formData.braco}
                onChange={handleChange}
              />
              <Input
                label="Coxa (cm)"
                name="coxa"
                type="number"
                step="0.1"
                value={formData.coxa}
                onChange={handleChange}
              />
              <Input
                label="Cintura (cm)"
                name="cintura"
                type="number"
                step="0.1"
                value={formData.cintura}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Observações
            </label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-white text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
              placeholder="Observações sobre a sessão..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
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