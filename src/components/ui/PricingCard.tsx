import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta?: string;
  ctaLink?: string;
  onClick?: () => void;
}

export default function PricingCard({
  name,
  price,
  period = '/mês',
  description,
  features,
  popular = false,
  cta = 'Começar',
  ctaLink,
  onClick,
}: PricingCardProps) {
  const ButtonContent = () => (
    <Button
      className={`w-full ${
        popular
          ? 'bg-white text-primary hover:bg-white/90'
          : 'bg-primary text-white hover:bg-primary-dark'
      }`}
      onClick={onClick}
    >
      {cta}
    </Button>
  );

  return (
    <div
      className={`relative rounded-2xl p-8 transition-all duration-300 hover-lift ${
        popular
          ? 'bg-gradient-to-br from-primary to-primary-dark text-white scale-105 shadow-xl'
          : 'bg-white dark:bg-slate-800 border border-border dark:border-border-dark shadow-lg'
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white text-sm font-semibold px-4 py-1 rounded-full">
          Mais Popular
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className={`text-xl font-bold mb-2 ${popular ? 'text-white' : 'text-text dark:text-slate-100'}`}>
          {name}
        </h3>
        <p className={`text-sm ${popular ? 'text-white/80' : 'text-text-muted dark:text-text-muted-dark'}`}>
          {description}
        </p>
        <div className="mt-4">
          <span className={`text-4xl font-bold ${popular ? 'text-white' : 'text-text dark:text-slate-100'}`}>
            {price}
          </span>
          <span className={`text-sm ${popular ? 'text-white/70' : 'text-text-muted dark:text-text-muted-dark'}`}>
            {period}
          </span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <Check className={`w-5 h-5 flex-shrink-0 ${popular ? 'text-white' : 'text-success'}`} />
            <span className={`text-sm ${popular ? 'text-white/90' : 'text-text dark:text-slate-300'}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {ctaLink ? (
        <Link to={ctaLink}>
          <ButtonContent />
        </Link>
      ) : (
        <ButtonContent />
      )}
    </div>
  );
}
