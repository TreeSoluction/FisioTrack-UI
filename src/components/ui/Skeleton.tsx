import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const roundedMap = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, width, height, rounded = 'md', style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-slate-200 dark:bg-slate-700 animate-shimmer',
          roundedMap[rounded],
          className
        )}
        style={{ width, height, ...style }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

function SkeletonText({ className, ...props }: Omit<SkeletonProps, 'height' | 'rounded'>) {
  return <Skeleton className={cn('h-4 w-full', className)} rounded="md" {...props} />;
}

function SkeletonCircle({ className, size = 40, ...props }: Omit<SkeletonProps, 'height' | 'width' | 'rounded'> & { size?: number }) {
  return <Skeleton className={cn(size, className)} rounded="full" {...props} />;
}

function SkeletonCard({ className, ...props }: Omit<SkeletonProps, 'height' | 'rounded'>) {
  return (
    <div className={cn('rounded-xl border border-border dark:border-border-dark p-6 space-y-3', className)}>
      <Skeleton className="h-5 w-1/3" rounded="md" {...props} />
      <SkeletonText className="w-full" />
      <SkeletonText className="w-5/6" />
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonCircle, SkeletonCard };
export default Skeleton;
