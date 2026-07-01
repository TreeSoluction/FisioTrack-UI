import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'auth.subtitle': 'Gestão para Fisioterapia',
        'auth.email': 'Email',
        'auth.password': 'Senha',
        'auth.entering': 'Entrando...',
        'auth.enter': 'Entrar',
        'auth.noAccount': 'Não tem conta?',
        'auth.registerNow': 'Registre-se',
        'common.error': 'Erro',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock api
vi.mock('../lib/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock ConsentModal
vi.mock('../components/ConsentModal', () => ({
  default: ({ missingDocuments, onComplete }: any) => (
    <div data-testid="consent-modal">
      <span data-testid="missing-docs">{JSON.stringify(missingDocuments)}</span>
      <button onClick={onComplete}>Complete</button>
    </div>
  ),
}));

import api from '../lib/api';

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render email and password inputs', () => {
    renderLogin();
    expect(screen.getByLabelText('Email')).toBeDefined();
    expect(screen.getByLabelText('Senha')).toBeDefined();
  });

  it('should render submit button', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeDefined();
  });

  it('should show validation error for empty email on blur', async () => {
    renderLogin();
    fireEvent.blur(screen.getByLabelText('Email'));
    await waitFor(() => {
      expect(screen.getByText(/email é obrigatório/i)).toBeDefined();
    });
  });

  it('should show validation error for short password', async () => {
    renderLogin();
    const passwordInput = screen.getByLabelText('Senha');
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.blur(passwordInput);
    await waitFor(() => {
      expect(screen.getByText(/pelo menos 6 caracteres/i)).toBeDefined();
    });
  });

  it('should call api.post on valid submit', async () => {
    (api.post as any).mockResolvedValue({
      data: {
        access_token: 'token-123',
        refresh_token: 'refresh-123',
        user: { id: '1', name: 'Test', email: 'test@test.com', role: 'THERAPIST', plan: 'FREE' },
        requiresConsent: false,
      },
    });

    renderLogin();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@test.com',
        password: 'password123',
      });
    });
  });

  it('should store tokens in localStorage on success', async () => {
    (api.post as any).mockResolvedValue({
      data: {
        access_token: 'token-123',
        refresh_token: 'refresh-123',
        user: { id: '1', name: 'Test', email: 'test@test.com', role: 'THERAPIST', plan: 'FREE' },
        requiresConsent: false,
      },
    });

    renderLogin();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('token-123');
      expect(localStorage.getItem('refresh_token')).toBe('refresh-123');
    });
  });

  it('should show consent modal when requiresConsent is true', async () => {
    (api.post as any).mockResolvedValue({
      data: {
        access_token: 'token-123',
        refresh_token: 'refresh-123',
        user: { id: '1', name: 'Test', email: 'test@test.com', role: 'THERAPIST', plan: 'FREE' },
        requiresConsent: true,
        missingDocuments: ['PRIVACY_POLICY'],
      },
    });

    renderLogin();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByTestId('consent-modal')).toBeDefined();
    });
  });

  it('should display API error message', async () => {
    (api.post as any).mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    renderLogin();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeDefined();
    });
  });
});
