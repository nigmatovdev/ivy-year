import * as React from 'react';

export type BadgeVariant =
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'outline';

export type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  /**
   * Optional ARIA label override if the content is not self-descriptive.
   */
  'aria-label'?: string;
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral:
    'bg-ivy-100 text-ivy-800 ring-1 ring-ivy-200 dark:bg-ivy-900 dark:text-ivy-100 dark:ring-ivy-700',
  success:
    'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-100 dark:ring-emerald-800',
  warning:
    'bg-amber-50 text-amber-900 ring-1 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-100 dark:ring-amber-800',
  danger:
    'bg-rose-50 text-rose-900 ring-1 ring-rose-200 dark:bg-rose-900/40 dark:text-rose-100 dark:ring-rose-800',
  outline:
    'bg-transparent text-ivy-800 ring-1 ring-ivy-300 dark:text-ivy-100 dark:ring-ivy-600',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className,
  'aria-label': ariaLabel,
}) => {
  return (
    <span
      aria-label={ariaLabel}
      className={[
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        'backdrop-blur-sm shadow-soft',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
};
