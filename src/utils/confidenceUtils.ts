/**
 * Utility functions for handling confidence scores
 */

/**
 * Gets the display confidence score with a boost
 * @param originalScore - The original confidence score from database
 * @param boost - The boost amount to add (default: 30)
 * @returns The boosted confidence score, capped at 100
 */
export const getDisplayConfidenceScore = (originalScore: number | null | undefined, boost: number = 30): number | null => {
  if (originalScore === null || originalScore === undefined) {
    return null;
  }
  
  // Add boost and cap at 100
  return Math.min(100, originalScore + boost);
};

/**
 * Gets the confidence score color class based on the display score
 * @param displayScore - The boosted confidence score for display
 * @returns CSS class string for text color
 */
export const getConfidenceTextColor = (displayScore: number | null): string => {
  if (displayScore === null) return 'text-gray-500 dark:text-gray-400';
  
  if (displayScore >= 80) {
    return 'text-green-600 dark:text-green-400';
  } else if (displayScore >= 60) {
    return 'text-yellow-600 dark:text-yellow-400';
  } else {
    return 'text-red-600 dark:text-red-400';
  }
};

/**
 * Gets the confidence score badge class based on the display score
 * @param displayScore - The boosted confidence score for display
 * @returns CSS class string for badge background and text
 */
export const getConfidenceBadgeColor = (displayScore: number | null): string => {
  if (displayScore === null) return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300';
  
  if (displayScore >= 80) {
    return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
  } else if (displayScore >= 60) {
    return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
  } else {
    return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
  }
};

/**
 * Gets the confidence level text based on the display score
 * @param displayScore - The boosted confidence score for display
 * @returns String describing the confidence level
 */
export const getConfidenceLevelText = (displayScore: number | null): string => {
  if (displayScore === null) return 'Unknown';
  
  if (displayScore >= 80) {
    return 'High';
  } else if (displayScore >= 60) {
    return 'Medium';
  } else {
    return 'Low';
  }
};