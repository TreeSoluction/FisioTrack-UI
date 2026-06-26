import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from './Button';
import AnimatedSection from './AnimatedSection';

export default function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-secondary animate-gradient" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg animate-float" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection type="scale-in">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm text-white/90">{t('landing.cta.badge')}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {t('landing.cta.title')}
          </h2>
          
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {t('landing.cta.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                {t('landing.cta.button')}
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-white/60 mt-6">
            {t('landing.cta.note')}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
