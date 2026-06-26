import { useEffect, useRef, useState } from 'react';

type AnimationType = 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale-in';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.05, rootMargin = '0px 0px -100px 0px', triggerOnce = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

export function getAnimationClass(type: AnimationType, isVisible: boolean): string {
  const base = 'transition-all';

  if (!isVisible) {
    switch (type) {
      case 'fade-in':
        return `${base} opacity-0`;
      case 'slide-up':
        return `${base} opacity-0 translate-y-12`;
      case 'slide-left':
        return `${base} opacity-0 -translate-x-12`;
      case 'slide-right':
        return `${base} opacity-0 translate-x-12`;
      case 'scale-in':
        return `${base} opacity-0 scale-95`;
      default:
        return `${base} opacity-0`;
    }
  }

  return `${base} opacity-100 translate-y-0 translate-x-0 scale-100`;
}

export function getAnimationStyle(delay: number): React.CSSProperties {
  return {
    transitionDuration: '800ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDelay: `${delay}ms`,
  };
}
