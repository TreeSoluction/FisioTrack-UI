import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../lib/api';

export default function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
      });
      navigate('/login');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao registrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 mb-4">
            <UserPlus className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-2xl font-bold text-text">Criar Conta</h1>
          <p className="text-text-muted mt-1">Registre-se para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-danger/10 text-danger rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Seu nome"
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            required
          />

          <Input
            label="Senha"
            name="senha"
            type="password"
            value={formData.senha}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Input
            label="Confirmar Senha"
            name="confirmarSenha"
            type="password"
            value={formData.confirmarSenha}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}