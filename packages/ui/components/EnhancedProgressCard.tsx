import * as React from 'react';
import { ProgressBar, ProgressBarVariant } from './ProgressBar';
import { StatCard } from './StatCard';

export type EnhancedProgressCardProps = {
  /**
   * Title of the progress section.
   */
  title: string;
  /**
   * Description/explanation for parents.
   */
  description?: string;
  /**
   * Progress percentage (0-100).
   */
  progress: number;
  /**
   * Remaining percentage (0-100).
   */
  remaining: number;
  /**
   * Start score value.
   */
  startScore: number;
  /**
   * Current score value.
   */
  currentScore: number;
  /**
   * Target score value.
   */
  targetScore: number;
  /**
   * Maximum possible score (for display).
   */
  maxScore: number;
  /**
   * Score unit/label (e.g., "/9.0" or "/800").
   */
  scoreUnit: string;
  /**
   * Color variant for the progress bar.
   */
  variant: ProgressBarVariant;
  /**
   * Accessible label for the progress bar.
   */
  ariaLabel?: string;
  /**
   * Additional className.
   */
  className?: string;
};

export const EnhancedProgressCard: React.FC<EnhancedProgressCardProps> = ({
  title,
  description,
  progress,
  remaining,
  startScore,
  currentScore,
  targetScore,
  maxScore,
  scoreUnit,
  variant,
  ariaLabel,
  className,
}) => {
  const improvement = currentScore - startScore;
  const needsToReach = targetScore - currentScore;
  const hasReachedTarget = currentScore >= targetScore;

  return (
    <div className={className}>
      {title && (
        <div className="mb-8">
          <h3 className="text-h3 font-serif font-bold text-primary-900 mb-3 tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-body text-primary-700 leading-relaxed max-w-3xl">{description}</p>
          )}
        </div>
      )}

      <div className="space-y-8">
        {/* Progress Bar */}
        <div>
          <ProgressBar
            value={progress}
            remaining={remaining}
            variant={variant}
            animated={true}
            aria-label={ariaLabel || `${title} progress`}
            showLabel={true}
          />
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <StatCard
              label="Starting Score"
              value={`${startScore.toFixed(scoreUnit.includes('.') ? 1 : 0)}${scoreUnit}`}
              description="Initial assessment"
            />
          </div>
          <div className="transform hover:scale-105 transition-transform duration-300">
            <StatCard
              label="Current Score"
              value={`${currentScore.toFixed(scoreUnit.includes('.') ? 1 : 0)}${scoreUnit}`}
              description="Latest achievement"
              badge="Current"
            />
          </div>
          <div className="transform hover:scale-105 transition-transform duration-300">
            <StatCard
              label="Target Score"
              value={`${targetScore.toFixed(scoreUnit.includes('.') ? 1 : 0)}${scoreUnit}`}
              description="Goal for admission"
            />
          </div>
        </div>

        {/* Improvement Indicator */}
        <div
          className={`rounded-2xl p-6 border shadow-soft ${
            hasReachedTarget
              ? 'bg-emerald-50/80 border-emerald-200'
              : 'bg-ivy-50/80 border-ivy-200'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-soft ${
                hasReachedTarget ? 'bg-emerald-100' : 'bg-ivy-100'
              }`}
            >
              {hasReachedTarget ? (
                <svg
                  className="w-6 h-6 text-emerald-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-ivy-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              )}
            </div>
            <div>
              <p
                className={`text-body-sm font-semibold mb-1 ${
                  hasReachedTarget ? 'text-emerald-900' : 'text-ivy-900'
                }`}
              >
                {hasReachedTarget ? (
                  <>
                    Target achieved! 🎉{' '}
                    <span className="font-normal text-emerald-800">
                      ({improvement > 0 ? `+${improvement.toFixed(scoreUnit.includes('.') ? 1 : 0)}` : improvement.toFixed(scoreUnit.includes('.') ? 1 : 0)} point improvement)
                    </span>
                  </>
                ) : (
                  <>
                    Improvement: {improvement > 0 ? '+' : ''}
                    {improvement.toFixed(scoreUnit.includes('.') ? 1 : 0)} points
                  </>
                )}
              </p>
              {!hasReachedTarget && (
                <p className={`text-body-sm mt-1.5 ${hasReachedTarget ? 'text-emerald-700' : 'text-ivy-700'}`}>
                  Need{' '}
                  <span className="font-semibold">
                    {needsToReach.toFixed(scoreUnit.includes('.') ? 1 : 0)} points
                  </span>{' '}
                  to reach target ({remaining.toFixed(0)}% remaining)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
