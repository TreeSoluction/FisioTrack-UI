import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Activity, DollarSign, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Landing() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Users,
      title: t('landing.features.patients.title'),
      description: t('landing.features.patients.description'),
    },
    {
      icon: Activity,
      title: t('landing.features.treatments.title'),
      description: t('landing.features.treatments.description'),
    },
    {
      icon: DollarSign,
      title: t('landing.features.financial.title'),
      description: t('landing.features.financial.description'),
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('landing.heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            {t('landing.heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button className="bg-white text-primary hover:bg-white/90 px-8 py-3 text-lg">
                {t('landing.ctaLogin')}
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-white/10 text-white border border-white/30 hover:bg-white/20 px-8 py-3 text-lg">
                {t('landing.ctaRegister')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text dark:text-slate-100 mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-text-muted dark:text-text-muted-dark max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-border dark:border-border-dark hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text dark:text-slate-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-muted dark:text-text-muted-dark">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-text dark:text-slate-100 mb-6">
              {t('landing.about.title')}
            </h2>
            <p className="text-lg text-text-muted dark:text-text-muted-dark mb-8">
              {t('landing.about.description')}
            </p>
            <Link to="/register">
              <Button className="px-8 py-3 text-lg">
                {t('landing.about.cta')}
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
