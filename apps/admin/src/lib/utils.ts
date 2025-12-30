/**
 * Generate a URL-friendly slug from a name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a slug from full name and academic year
 * Format: firstname-lastname-academic-year
 * Example: "John Doe" + "2024-2025" -> "john-doe-2024-2025"
 */
export function generateSlugFromNameAndYear(
  fullName: string,
  academicYear: string
): string {
  const nameSlug = generateSlug(fullName);
  const yearSlug = generateSlug(academicYear);
  
  if (!nameSlug) {
    return yearSlug || 'student';
  }
  
  if (!yearSlug) {
    return nameSlug;
  }
  
  return `${nameSlug}-${yearSlug}`;
}

/**
 * Generate a unique slug by appending a number if collision occurs
 * Example: "john-doe-2024-2025" -> "john-doe-2024-2025-2" if first exists
 */
export function generateUniqueSlug(
  baseSlug: string,
  existingSlugs: string[],
  excludeSlug?: string
): string {
  // Filter out the excludeSlug if provided (for edit operations)
  const slugsToCheck = excludeSlug
    ? existingSlugs.filter((slug) => slug !== excludeSlug)
    : existingSlugs;
  
  // If base slug is unique, return it
  if (!slugsToCheck.includes(baseSlug)) {
    return baseSlug;
  }
  
  // Try appending numbers until we find a unique slug
  let counter = 2;
  let candidateSlug = `${baseSlug}-${counter}`;
  
  while (slugsToCheck.includes(candidateSlug)) {
    counter++;
    candidateSlug = `${baseSlug}-${counter}`;
    
    // Safety limit to prevent infinite loops
    if (counter > 1000) {
      // Fallback: append timestamp
      candidateSlug = `${baseSlug}-${Date.now()}`;
      break;
    }
  }
  
  return candidateSlug;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate score range (typically 0-1600 for SAT, 0-9 for IELTS)
 */
export function isValidScore(score: number, min: number = 0, max: number = 1600): boolean {
  return Number.isInteger(score) && score >= min && score <= max;
}
