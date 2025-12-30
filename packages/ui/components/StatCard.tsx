import * as React from 'react';

export type StatCardProps = {
  label: string;
  value: React.ReactNode;
  /**
   * Optional subtle description or sub-label.
   */
  description?: string;
  /**
   * Optional badge element (e.g. for trend / status).
   */
  badge?: React.ReactNode;
  className?: string;
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  description,
  badge,
  className,
}) => {
  return (
    <section
      aria-label={label}
      className={[
        'group relative overflow-hidden rounded-2xl border border-ivy-200/80 bg-white/90',
        'shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-md',
        'dark:border-ivy-800 dark:bg-ivy-950/80',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ivy-50/60 via-transparent to-ivy-100/40 dark:from-ivy-950/80 dark:via-ivy-900/0 dark:to-ivy-800/80" />

      <div className="relative flex flex-col gap-3 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-600 dark:text-primary-400">
              {label}
            </p>
            <div className="text-2xl font-bold text-ivy-900 dark:text-ivy-50 tracking-tight">
              {value}
            </div>
          </div>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
        {description && (
          <p className="text-xs text-primary-600 dark:text-primary-400 leading-relaxed">{description}</p>
        )}
      </div>
    </section>
  );
};
