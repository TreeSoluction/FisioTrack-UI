import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ConsentModal from './ConsentModal';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'consent.title': 'Termos',
        'consent.description': 'Aceite os termos',
        'consent.privacyPolicyCheck': 'Privacidade',
        'consent.termsOfUseCheck': 'Uso',
        'consent.consentTermsCheck': 'Consentimento',
        'consent.acceptAll': 'Aceitar',
        'consent.required': 'Aceite todos',
        'common.loading': 'Carregando...',
        'common.error': 'Erro',
        'lgpd.privacyPolicy.title': 'Política',
        'lgpd.termsOfUse.title': 'Termos',
        'lgpd.consentTerms.title': 'Consent',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('../lib/api', () => ({
  default: { post: vi.fn() },
}));

import api from '../lib/api';

function renderConsent(docs = ['PRIVACY_POLICY', 'TERMS_OF_USE', 'CONSENT_TERMS']) {
  const onComplete = vi.fn();
  return {
    onComplete,
    ...render(
      <MemoryRouter>
        <ConsentModal missingDocuments={docs} onComplete={onComplete} />
      </MemoryRouter>
    ),
  };
}

describe('ConsentModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render checkboxes for each missing document', () => {
    renderConsent();
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
  });

  it('should render submit button as disabled initially', () => {
    renderConsent();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should enable submit when all checkboxes checked', async () => {
    renderConsent();

    for (const cb of screen.getAllByRole('checkbox')) {
      fireEvent.click(cb);
    }

    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  it('should call api.post for each document on submit', async () => {
    (api.post as any).mockResolvedValue({});
    const { onComplete } = renderConsent(['PRIVACY_POLICY', 'TERMS_OF_USE']);

    for (const cb of screen.getAllByRole('checkbox')) {
      fireEvent.click(cb);
    }

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(2);
      expect(onComplete).toHaveBeenCalled();
    });
  });

  it('should show error when API fails', async () => {
    (api.post as any).mockRejectedValue({
      response: { data: { message: 'Failed' } },
    });

    renderConsent(['PRIVACY_POLICY']);

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Failed')).toBeDefined();
    });
  });

  it('should render only specified documents', () => {
    renderConsent(['PRIVACY_POLICY']);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(1);
  });
});
