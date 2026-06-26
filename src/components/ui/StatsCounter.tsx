import { useEffect, useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface StatsCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  label: string;
  icon: React.ReactNode;
}

export default function StatsCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 2000,
  label,
  icon,
}: StatsCounterProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return (
    <div ref={ref} className="text-center p-6">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
        {icon}
      </div>
      <div className="text-4xl md:text-5xl font-bold text-text dark:text-slate-100 mb-2">
        {prefix}{count}{suffix}
      </div>
      <div className="text-text-muted dark:text-text-muted-dark">
        {label}
      </div>
    </div>
  );
}
