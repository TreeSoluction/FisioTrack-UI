import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Activity,
  DollarSign,
  ArrowRight,
  Check,
  Zap,
  Shield,
  BarChart3,
} from 'lucide-react';
import Button from '../components/ui/Button';
import AnimatedSection from '../components/ui/AnimatedSection';
import PricingCard from '../components/ui/PricingCard';
import HowItWorks from '../components/ui/HowItWorks';
import CTASection from '../components/ui/CTASection';

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

  const benefitsList = t('landing.about.benefits', { returnObjects: true }) as string[];
  const benefits = [
    { icon: Zap, text: benefitsList[0] },
    { icon: Shield, text: benefitsList[1] },
    { icon: BarChart3, text: benefitsList[2] },
    { icon: Users, text: benefitsList[3] },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-secondary animate-gradient" />

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg animate-float" style={{ animationDelay: '4s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <AnimatedSection type="slide-up" delay={100}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {t('landing.heroTitle')}
            </h1>
          </AnimatedSection>

          <AnimatedSection type="slide-up" delay={200}>
            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto">
              {t('landing.heroSubtitle')}
            </p>
          </AnimatedSection>

          <AnimatedSection type="slide-up" delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  {t('landing.ctaRegister')}
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-white/10 text-white border border-white/30 hover:bg-white/20 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
                  {t('landing.ctaLogin')}
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection type="fade-in" delay={500}>
            <div className="mt-12 flex items-center justify-center gap-8 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{t('landing.hero.free')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{t('landing.hero.noCreditCard')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{t('landing.hero.support')}</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-background dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection type="slide-up">
            <div className="text-center mb-16">
              <span className="inline-block text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
                {t('landing.features.label')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-text dark:text-slate-100 mb-4">
                {t('landing.features.title')}
              </h2>
              <p className="text-lg text-text-muted dark:text-text-muted-dark max-w-2xl mx-auto">
                {t('landing.features.subtitle')}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 200} type="slide-up">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-border dark:border-border-dark hover-lift group">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-text dark:text-slate-100 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text-muted dark:text-text-muted-dark leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection type="slide-up">
            <div className="text-center mb-16">
              <span className="inline-block text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
                {t('landing.howItWorks.label')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-text dark:text-slate-100 mb-4">
                {t('landing.howItWorks.title')}
              </h2>
              <p className="text-lg text-text-muted dark:text-text-muted-dark max-w-2xl mx-auto">
                {t('landing.howItWorks.subtitle')}
              </p>
            </div>
          </AnimatedSection>

          <HowItWorks />
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-32 bg-background dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection type="slide-up">
              <span className="inline-block text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
                {t('landing.about.label')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-text dark:text-slate-100 mb-6">
                {t('landing.about.title')}
              </h2>
              <p className="text-lg text-text-muted dark:text-text-muted-dark mb-8 leading-relaxed">
                {t('landing.about.description')}
              </p>
            </AnimatedSection>

            <AnimatedSection type="slide-up" delay={200}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 justify-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-text dark:text-slate-200">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection type="slide-up" delay={400}>
              <Link to="/register">
                <Button className="px-8 py-3 text-lg">
                  {t('landing.about.cta')}
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection type="slide-up">
            <div className="text-center mb-16">
              <span className="inline-block text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
                {t('landing.pricing.label')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-text dark:text-slate-100 mb-4">
                {t('landing.pricing.title')}
              </h2>
              <p className="text-lg text-text-muted dark:text-text-muted-dark max-w-2xl mx-auto">
                {t('landing.pricing.subtitle')}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <AnimatedSection delay={0} type="slide-up">
              <PricingCard
                name={t('landing.pricing.free.name')}
                price={t('landing.pricing.free.price')}
                description={t('landing.pricing.free.description')}
                features={t('landing.pricing.free.features', { returnObjects: true }) as string[]}
                cta={t('landing.pricing.free.cta')}
                ctaLink="/register?plan=FREE"
              />
            </AnimatedSection>

            <AnimatedSection delay={200} type="slide-up">
              <PricingCard
                name={t('landing.pricing.pro.name')}
                price={t('landing.pricing.pro.price')}
                description={t('landing.pricing.pro.description')}
                features={t('landing.pricing.pro.features', { returnObjects: true }) as string[]}
                cta={t('landing.pricing.pro.cta')}
                ctaLink="/register?plan=PRO"
                popular
              />
            </AnimatedSection>

            <AnimatedSection delay={400} type="slide-up">
              <PricingCard
                name={t('landing.pricing.enterprise.name')}
                price={t('landing.pricing.enterprise.price')}
                description={t('landing.pricing.enterprise.description')}
                features={t('landing.pricing.enterprise.features', { returnObjects: true }) as string[]}
                cta={t('landing.pricing.enterprise.cta')}
                ctaLink="/enterprise-request"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
