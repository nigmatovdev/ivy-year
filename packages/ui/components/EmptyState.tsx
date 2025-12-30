import * as React from 'react';

export type EmptyStateProps = {
  title: string;
  description?: string;
  /**
   * Optional primary action (button, link, etc.).
   */
  action?: React.ReactNode;
  /**
   * Optional icon element rendered above the title.
   */
  icon?: React.ReactNode;
  className?: string;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
  className,
}) => {
  return (
    <section
      aria-label={title}
      className={[
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-6 py-10 text-center',
        'dark:border-gray-800 dark:bg-gray-900/60',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && (
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
          <span className="text-gray-500 dark:text-gray-300">{icon}</span>
        </div>
      )}
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </section>
  );
};


