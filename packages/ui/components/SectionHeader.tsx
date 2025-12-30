import * as React from 'react';

export type SectionHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  /**
   * Optional right-aligned action (button, link, etc.).
   */
  action?: React.ReactNode;
  className?: string;
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  eyebrow,
  description,
  action,
  className,
}) => {
  const descriptionId = React.useId();

  return (
    <header
      className={[
        'flex flex-col gap-4 border-b border-ivy-200 pb-5',
        'sm:flex-row sm:items-end sm:justify-between sm:gap-6',
        'dark:border-ivy-800',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-describedby={description ? descriptionId : undefined}
    >
      <div className="space-y-2.5">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600 dark:text-primary-400">
            {eyebrow}
          </p>
        )}
        <h2 className="text-h2 font-serif font-bold text-primary-900 dark:text-ivy-50 tracking-tight">
          {title}
        </h2>
        {description && (
          <p
            id={descriptionId}
            className="max-w-2xl text-body text-primary-700 dark:text-primary-300 leading-relaxed"
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
};
