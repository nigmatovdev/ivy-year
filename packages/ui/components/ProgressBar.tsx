import * as React from 'react';

export type ProgressBarVariant = 'default' | 'ielts' | 'sat-english' | 'sat-math';

export type ProgressBarProps = {
  /**
   * Progress value from 0 to 100.
   */
  value: number;
  /**
   * Accessible label for screen readers, e.g. "IELTS progress".
   */
  'aria-label'?: string;
  /**
   * Optional description used for aria-describedby.
   */
  descriptionId?: string;
  /**
   * If true, shows the numeric percentage on the right.
   */
  showLabel?: boolean;
  /**
   * Color variant for different test types.
   */
  variant?: ProgressBarVariant;
  /**
   * If true, animates the progress bar on mount/update.
   */
  animated?: boolean;
  /**
   * Remaining percentage to show (0-100).
   */
  remaining?: number;
  /**
   * Additional className for the outer wrapper.
   */
  className?: string;
};

const variantColors: Record<ProgressBarVariant, string> = {
  default: 'from-ivy-700 via-ivy-800 to-ivy-900',
  ielts: 'from-blue-500 via-blue-600 to-blue-700',
  'sat-english': 'from-purple-500 via-purple-600 to-purple-700',
  'sat-math': 'from-emerald-500 via-emerald-600 to-emerald-700',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  'aria-label': ariaLabel,
  descriptionId,
  showLabel = true,
  variant = 'default',
  animated = false,
  remaining,
  className,
}) => {
  const safeValue = Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) : 0;
  const [animatedValue, setAnimatedValue] = React.useState(animated ? 0 : safeValue);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!animated) {
      setAnimatedValue(safeValue);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start: number | null = null;
          const duration = 1200; // 1.2 second animation

          const animate = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min(1, (timestamp - start) / duration);
            // Cubic ease-out
            const eased = 1 - Math.pow(1 - progress, 3);
            const newValue = eased * safeValue;
            setAnimatedValue(newValue);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        } else {
          setAnimatedValue(0);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [safeValue, animated]);

  return (
    <div className={className} ref={ref}>
      <div className="flex items-center justify-between mb-3">
        {ariaLabel && (
          <span className="text-body-sm font-semibold text-primary-700">
            {ariaLabel}
          </span>
        )}
        {showLabel && (
          <span
            className="text-h4 font-bold text-ivy-900 tracking-tight"
            aria-hidden="true"
          >
            {animatedValue.toFixed(0)}%
          </span>
        )}
      </div>
      <div
        className="relative h-3 overflow-hidden rounded-full bg-ivy-100 shadow-soft"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
        aria-label={ariaLabel}
        aria-describedby={descriptionId}
        aria-valuetext={`${safeValue.toFixed(0)}% complete`}
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r ${variantColors[variant]} relative overflow-hidden shadow-soft-md transition-all duration-500`}
          style={{ width: `${animatedValue}%` }}
        >
          <span className="absolute inset-0 w-full h-full block bg-white/20 shimmer" />
        </div>
      </div>
      {remaining !== undefined && remaining > 0 && (
        <p className="mt-2 text-body-sm text-primary-600">
          {remaining.toFixed(0)}% remaining to reach target
        </p>
      )}
    </div>
  );
};
