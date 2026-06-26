import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar?: string;
}

export default function TestimonialCarousel() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      name: 'Dr. Maria Silva',
      role: 'Fisioterapeuta',
      content: t('landing.testimonials.testimonial1.content'),
    },
    {
      name: 'Dr. João Santos',
      role: 'Coordenador Clínico',
      content: t('landing.testimonials.testimonial2.content'),
    },
    {
      name: 'Ana Costa',
      role: 'Gestora de Clínica',
      content: t('landing.testimonials.testimonial3.content'),
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  function next() {
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  }

  function prev() {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  }

  return (
    <div
      className="relative max-w-4xl mx-auto"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 shadow-lg border border-border dark:border-border-dark">
                <Quote className="w-10 h-10 text-primary/20 mb-6" />
                <p className="text-lg md:text-xl text-text dark:text-slate-200 mb-8 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-text dark:text-slate-100">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-text-muted dark:text-text-muted-dark">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white dark:bg-slate-700 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-text dark:text-slate-200" />
      </button>

      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white dark:bg-slate-700 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-text dark:text-slate-200" />
      </button>

      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index);
              setIsAutoPlaying(false);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === current
                ? 'bg-primary w-6'
                : 'bg-slate-300 dark:bg-slate-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
