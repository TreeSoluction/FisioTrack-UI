import { useTranslation } from 'react-i18next';

export default function ConsentTerms() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-text dark:text-slate-100 mb-8">
        {t('lgpd.consentTerms.title')}
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-text dark:text-slate-300">
        <section>
          <h2 className="text-xl font-semibold text-text dark:text-slate-100 mb-3">
            {t('lgpd.consentTerms.section1.title')}
          </h2>
          <p>{t('lgpd.consentTerms.section1.content')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text dark:text-slate-100 mb-3">
            {t('lgpd.consentTerms.section2.title')}
          </h2>
          <p>{t('lgpd.consentTerms.section2.content')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text dark:text-slate-100 mb-3">
            {t('lgpd.consentTerms.section3.title')}
          </h2>
          <p>{t('lgpd.consentTerms.section3.content')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text dark:text-slate-100 mb-3">
            {t('lgpd.consentTerms.section4.title')}
          </h2>
          <p>{t('lgpd.consentTerms.section4.content')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text dark:text-slate-100 mb-3">
            {t('lgpd.consentTerms.section5.title')}
          </h2>
          <p>{t('lgpd.consentTerms.section5.content')}</p>
        </section>
      </div>
    </div>
  );
}
