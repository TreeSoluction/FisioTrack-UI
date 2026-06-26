import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Star, MessageCircle } from 'lucide-react';

interface FooterProps {
  onReviewClick?: () => void;
  canReview?: boolean;
}

const WHATSAPP_MESSAGE = encodeURIComponent('Olá, estou procurando suporte do FisioTrack');
const WHATSAPP_NUMBERS = [
  { number: '5554999997564', display: '(54) 99999-7564' },
  { number: '5527992612834', display: '(27) 99261-2834' },
];

export default function Footer({ onReviewClick, canReview }: FooterProps) {
  const { t } = useTranslation();
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-border dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-primary mb-2">FisioTrack</h3>
            <p className="text-text-muted dark:text-text-muted-dark text-sm">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-text dark:text-slate-100 mb-4">
              {t('footer.navigation')}
            </h4>
            <ul className="space-y-2">
              {isAuthenticated && (
                <>
                  <li>
                    <Link to="/dashboard" className="text-sm text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors">
                      {t('nav.dashboard')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/patients" className="text-sm text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors">
                      {t('nav.patients')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/treatments" className="text-sm text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors">
                      {t('nav.treatments')}
                    </Link>
                  </li>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <li>
                    <Link to="/login" className="text-sm text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors">
                      {t('auth.login')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-sm text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors">
                      {t('auth.register')}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text dark:text-slate-100 mb-4">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-sm text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors">
                  {t('lgpd.privacyPolicy.title')}
                </Link>
              </li>
              <li>
                <Link to="/terms-of-use" className="text-sm text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors">
                  {t('lgpd.termsOfUse.title')}
                </Link>
              </li>
              <li>
                <Link to="/consent-terms" className="text-sm text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors">
                  {t('lgpd.consentTerms.title')}
                </Link>
              </li>
              {isAuthenticated && canReview && onReviewClick && (
                <li>
                  <button
                    onClick={onReviewClick}
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark font-medium transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    {t('footer.review')}
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text dark:text-slate-100 mb-4">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:soluctiontree@gmail.com"
                  className="flex items-center gap-2 text-sm text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  soluctiontree@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:soluction@soluctiontree.com"
                  className="flex items-center gap-2 text-sm text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  soluction@soluctiontree.com
                </a>
              </li>
              {WHATSAPP_NUMBERS.map((whatsapp) => (
                <li key={whatsapp.number}>
                  <a
                    href={`https://wa.me/${whatsapp.number}?text=${WHATSAPP_MESSAGE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-text-muted dark:text-text-muted-dark hover:text-success transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 flex-shrink-0" />
                    {whatsapp.display}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-2 text-sm text-text-muted dark:text-text-muted-dark">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                Erechim, RS
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border dark:border-border-dark text-center">
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            © {new Date().getFullYear()} FisioTrack. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
