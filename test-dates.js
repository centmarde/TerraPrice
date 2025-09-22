// Test Philippine date formatting
const formatPhilippineDate = (
  dateString,
  options = {}
) => {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  const { includeTime = true, includeSeconds = false, shortFormat = false } = options;
  
  // Base formatting options for Philippine timezone
  const formatOptions = {
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

// Test with sample dates
console.log('Original US format: Sep 23, 2025, 05:25 AM');
console.log('Philippine format:', formatPhilippineDate('2025-09-23T05:25:00Z'));
console.log('Philippine short format:', formatPhilippineDate('2025-09-23T05:25:00Z', { shortFormat: true }));
console.log('Current Philippine time:', formatPhilippineDate(new Date()));