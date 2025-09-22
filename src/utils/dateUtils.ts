/**
 * Date utilities for formatting dates in Philippine timezone
 */

/**
 * Formats a date string to Philippine time (Asia/Manila timezone)
 * @param dateString - The date string or Date object to format
 * @param options - Additional formatting options
 * @returns Formatted date string in Philippine time
 */
export const formatPhilippineDate = (
  dateString: string | Date | null | undefined,
  options?: {
    includeTime?: boolean;
    includeSeconds?: boolean;
    shortFormat?: boolean;
  }
): string => {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  const { includeTime = true, includeSeconds = false, shortFormat = false } = options || {};
  
  // Base formatting options for Philippine timezone
  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Manila',
    weekday: shortFormat ? undefined : 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  // Add time formatting if requested
  if (includeTime) {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
    formatOptions.hour12 = true; // Use 12-hour format (AM/PM)
    
    if (includeSeconds) {
      formatOptions.second = '2-digit';
    }
  }
  
  return date.toLocaleDateString('en-US', formatOptions);
};

/**
 * Formats a date for short display (e.g., in cards or tables)
 * @param dateString - The date string to format
 * @returns Short formatted date in Philippine time
 */
export const formatShortPhilippineDate = (dateString: string | Date | null | undefined): string => {
  return formatPhilippineDate(dateString, { shortFormat: true });
};

/**
 * Formats a date without time (date only) in Philippine timezone
 * @param dateString - The date string to format
 * @returns Formatted date without time in Philippine time
 */
export const formatPhilippineDateOnly = (dateString: string | Date | null | undefined): string => {
  return formatPhilippineDate(dateString, { includeTime: false });
};

/**
 * Gets the current Philippine time
 * @returns Current date/time in Philippine timezone
 */
export const getCurrentPhilippineTime = (): string => {
  return formatPhilippineDate(new Date());
};

/**
 * Formats relative time (e.g., "2 hours ago") in Philippine context
 * @param dateString - The date string to format
 * @returns Relative time string
 */
export const formatRelativePhilippineTime = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  
  // For older dates, show the actual Philippine date
  return formatShortPhilippineDate(dateString);
};