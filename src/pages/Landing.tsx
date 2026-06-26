import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Activity,
  DollarSign,
  ArrowRight,
  Check,
  Sparkles,
  Zap,
  Shield,
  BarChart3,
} from 'lucide-react';
import Button from '../components/ui/Button';
import AnimatedSection from '../components/ui/AnimatedSection';
import StatsCounter from '../components/ui/StatsCounter';
import TestimonialCarousel from '../components/ui/TestimonialCarousel';
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
          <AnimatedSection type="fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm text-white/90">Plataforma #1 em Fisioterapia</span>
            </div>
          </AnimatedSection>

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
                <span>Gratuito para começar</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Suporte 24/7</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-800 border-y border-border dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatsCounter
              end={500}
              suffix="+"
              label={t('landing.stats.patients')}
              icon={<Users className="w-6 h-6 text-primary" />}
            />
            <StatsCounter
              end={10000}
              suffix="+"
              label={t('landing.stats.sessions')}
              icon={<Activity className="w-6 h-6 text-primary" />}
            />
            <StatsCounter
              end={150}
              suffix="+"
              label={t('landing.stats.clinics')}
              icon={<BarChart3 className="w-6 h-6 text-primary" />}
            />
            <StatsCounter
              end={98}
              suffix="%"
              label={t('landing.stats.satisfaction')}
              icon={<Sparkles className="w-6 h-6 text-primary" />}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-background dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection type="slide-up">
            <div className="text-center mb-16">
              <span className="inline-block text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
                Funcionalidades
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
                Como Funciona
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection type="slide-left">
              <span className="inline-block text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
                Por que nos escolher
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-text dark:text-slate-100 mb-6">
                {t('landing.about.title')}
              </h2>
              <p className="text-lg text-text-muted dark:text-text-muted-dark mb-8 leading-relaxed">
                {t('landing.about.description')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-text dark:text-slate-200">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <Link to="/register">
                <Button className="px-8 py-3 text-lg">
                  {t('landing.about.cta')}
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Button>
              </Link>
            </AnimatedSection>

            <AnimatedSection type="slide-right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-3xl transform rotate-3 scale-105 opacity-20" />
                <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-border dark:border-border-dark">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 text-center">
                      <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-text dark:text-slate-100">500+</div>
                      <div className="text-sm text-text-muted">Pacientes</div>
                    </div>
                    <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl p-6 text-center">
                      <Activity className="w-8 h-8 text-secondary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-text dark:text-slate-100">10k+</div>
                      <div className="text-sm text-text-muted">Sessões</div>
                    </div>
                    <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-6 text-center">
                      <BarChart3 className="w-8 h-8 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold text-text dark:text-slate-100">150+</div>
                      <div className="text-sm text-text-muted">Clínicas</div>
                    </div>
                    <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-2xl p-6 text-center">
                      <Sparkles className="w-8 h-8 text-success mx-auto mb-2" />
                      <div className="text-2xl font-bold text-text dark:text-slate-100">98%</div>
                      <div className="text-sm text-text-muted">Satisfação</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection type="slide-up">
            <div className="text-center mb-16">
              <span className="inline-block text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
                Depoimentos
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-text dark:text-slate-100 mb-4">
                {t('landing.testimonials.title')}
              </h2>
              <p className="text-lg text-text-muted dark:text-text-muted-dark max-w-2xl mx-auto">
                {t('landing.testimonials.subtitle')}
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection type="fade-in" delay={200}>
            <TestimonialCarousel />
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 md:py-32 bg-background dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection type="slide-up">
            <div className="text-center mb-16">
              <span className="inline-block text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
                Preços
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
