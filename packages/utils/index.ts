// Shared utility functions for academic progress & score calculations.
// These are fully typed and reusable across both apps.

export type ProgressInput = {
  startScore: number;
  currentScore: number;
  targetScore: number;
};

type NumberLike = number | null | undefined;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const isValidNumber = (value: NumberLike): value is number =>
  typeof value === 'number' && Number.isFinite(value);

/**
 * Calculate progress as a percentage from start -> target.
 *
 * - Returns a value between 0 and 100.
 * - Handles edge cases like missing values, zero or negative ranges.
 */
export function calculateProgressPercentage(
  input: ProgressInput,
): number {
  const { startScore, currentScore, targetScore } = input;

  if (
    !isValidNumber(startScore) ||
    !isValidNumber(currentScore) ||
    !isValidNumber(targetScore)
  ) {
    return 0;
  }

  // If start and target are the same, treat as 0% or 100% depending on current.
  if (targetScore === startScore) {
    return currentScore >= targetScore ? 100 : 0;
  }

  const range = targetScore - startScore;

  // If the target is below the start (unusual), fall back to simple comparison.
  if (range <= 0) {
    return currentScore >= targetScore ? 100 : 0;
  }

  const raw = ((currentScore - startScore) / range) * 100;
  return clamp(raw, 0, 100);
}

/**
 * Calculate remaining percentage to reach the target.
 *
 * - Returns a value between 0 and 100.
 * - 0 means target reached or exceeded, 100 means no progress yet.
 */
export function calculateRemainingPercentage(
  input: ProgressInput,
): number {
  const progress = calculateProgressPercentage(input);
  const remaining = 100 - progress;
  return clamp(remaining, 0, 100);
}

export type NormalizeOptions = {
  /**
   * If true (default), clamps score into [min, max] before normalizing.
   */
  clamp?: boolean;
  /**
   * If true (default), returns percentage 0-100; otherwise returns 0-1.
   */
  asPercentage?: boolean;
};

/**
 * Normalize a raw score into a 0-100 scale (or 0-1 if asPercentage=false).
 *
 * Useful for combining different exams (IELTS, SAT, etc.) into a common scale.
 */
export function normalizeScore(
  score: NumberLike,
  min: NumberLike,
  max: NumberLike,
  options: NormalizeOptions = {},
): number {
  const { clamp: shouldClamp = true, asPercentage = true } = options;

  if (!isValidNumber(score) || !isValidNumber(min) || !isValidNumber(max)) {
    return 0;
  }

  if (max === min) {
    return 0;
  }

  const low = Math.min(min, max);
  const high = Math.max(min, max);

  const clampedScore =
    shouldClamp ? clamp(score, low, high) : score;

  const normalized = (clampedScore - low) / (high - low);

  if (!Number.isFinite(normalized) || normalized < 0) {
    return 0;
  }

  if (asPercentage) {
    return clamp(normalized * 100, 0, 100);
  }

  return clamp(normalized, 0, 1);
}

/**
 * Simple example inputs for quick manual testing & storybook docs.
 *
 * These are not a full test suite, but help validate behaviour.
 */
export const exampleCalculations = {
  ielts: {
    input: { startScore: 5, currentScore: 6.5, targetScore: 7.5 },
    progress: calculateProgressPercentage({
      startScore: 5,
      currentScore: 6.5,
      targetScore: 7.5,
    }),
    remaining: calculateRemainingPercentage({
      startScore: 5,
      currentScore: 6.5,
      targetScore: 7.5,
    }),
  },
  satEnglish: {
    input: { startScore: 500, currentScore: 650, targetScore: 750 },
    progress: calculateProgressPercentage({
      startScore: 500,
      currentScore: 650,
      targetScore: 750,
    }),
    remaining: calculateRemainingPercentage({
      startScore: 500,
      currentScore: 650,
      targetScore: 750,
    }),
  },
  normalization: {
    raw: 6.5,
    normalizedIELTS: normalizeScore(6.5, 0, 9, {
      asPercentage: true,
    }),
    normalizedSAT: normalizeScore(1400, 400, 1600, {
      asPercentage: true,
    }),
  },
};

