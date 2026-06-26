import type { ReactNode } from 'react';
import { useScrollAnimation, getAnimationClass, getAnimationStyle } from '../../hooks/useScrollAnimation';

type AnimationType = 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale-in';

interface AnimatedSectionProps {
  children: ReactNode;
  type?: AnimationType;
  className?: string;
  delay?: number;
}

export default function AnimatedSection({
  children,
  type = 'slide-up',
  className = '',
  delay = 0,
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const animationClass = getAnimationClass(type, isVisible);
  const animationStyle = getAnimationStyle(delay);

  return (
    <div
      ref={ref}
      className={`${animationClass} ${className}`}
      style={animationStyle}
    >
      {children}
    </div>
  );
}
