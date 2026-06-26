import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
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
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text dark:text-slate-100 mb-4">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-text-muted dark:text-text-muted-dark">
                <Mail className="w-4 h-4" />
                contato@fisiotrack.com
              </li>
              <li className="flex items-center gap-2 text-sm text-text-muted dark:text-text-muted-dark">
                <Phone className="w-4 h-4" />
                (11) 99999-9999
              </li>
              <li className="flex items-center gap-2 text-sm text-text-muted dark:text-text-muted-dark">
                <MapPin className="w-4 h-4" />
                São Paulo, SP
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
