import { useTranslation } from 'react-i18next';
import AnimatedSection from './AnimatedSection';
import { UserPlus, ClipboardList, BarChart3 } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: UserPlus,
      number: '01',
      title: t('landing.howItWorks.step1.title'),
      description: t('landing.howItWorks.step1.description'),
    },
    {
      icon: ClipboardList,
      number: '02',
      title: t('landing.howItWorks.step2.title'),
      description: t('landing.howItWorks.step2.description'),
    },
    {
      icon: BarChart3,
      number: '03',
      title: t('landing.howItWorks.step3.title'),
      description: t('landing.howItWorks.step3.description'),
    },
  ];

  return (
    <div className="relative">
      {/* Connection line */}
      <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {steps.map((step, index) => (
          <AnimatedSection key={index} delay={index * 200} type="slide-up">
            <div className="relative text-center">
              <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white mb-6 shadow-lg animate-pulse-glow">
                <step.icon className="w-8 h-8" />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl bg-primary/10 animate-ping opacity-20" />
              
              <div className="text-sm font-bold text-primary mb-2">
                PASSO {step.number}
              </div>
              <h3 className="text-xl font-bold text-text dark:text-slate-100 mb-3">
                {step.title}
              </h3>
              <p className="text-text-muted dark:text-text-muted-dark">
                {step.description}
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
