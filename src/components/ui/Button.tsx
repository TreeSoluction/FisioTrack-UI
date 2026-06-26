import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary': variant === 'primary',
            'bg-secondary text-white hover:bg-secondary-dark focus-visible:ring-secondary': variant === 'secondary',
            'bg-accent text-white hover:bg-accent-dark focus-visible:ring-accent': variant === 'accent',
            'bg-transparent text-text dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 focus-visible:ring-slate-400': variant === 'ghost',
            'bg-danger text-white hover:bg-red-600 focus-visible:ring-danger': variant === 'danger',
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;
