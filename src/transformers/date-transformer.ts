/**
 * Transforms a date string from various formats into a JavaScript Date object
 * @param dateStr The date string to transform
 * @param format The format of the date string ('DD/MM/YYYY' or 'YYYYMMDD')
 * @returns A JavaScript Date object
 */
export function transformDate(dateStr: string, format: 'DD/MM/YYYY' | 'YYYYMMDD'): Date {
  if (!dateStr) {
    throw new Error('Date string is empty or undefined');
  }

  try {
    let day: number;
    let month: number;
    let year: number;

    if (format === 'DD/MM/YYYY') {
      // Check format first - strict format checking before parsing
      if (dateStr.includes('/')) {
        // Standard DD/MM/YYYY format
        const parts = dateStr.split('/');
        if (parts.length !== 3) {
          throw new Error(`Invalid date format, expected DD/MM/YYYY but got: ${dateStr}`);
        }
        
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
        year = parseInt(parts[2], 10);
      } else if (dateStr.includes('-')) {
        // This is not the expected format, so throw an error
        throw new Error(`Invalid date format, expected DD/MM/YYYY but got: ${dateStr}`);
      } else if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // This is not the expected format, so throw an error
        throw new Error(`Invalid date format, expected DD/MM/YYYY but got: ${dateStr}`);
      } else {
        // No recognized separators, throw error
        throw new Error(`Invalid date format, expected DD/MM/YYYY but got: ${dateStr}`);
      }
    } else if (format === 'YYYYMMDD') {
      // Parse date in format YYYYMMDD
      if (dateStr.length !== 8) {
        throw new Error(`Invalid date format, expected YYYYMMDD but got: ${dateStr}`);
      }
      
      year = parseInt(dateStr.substring(0, 4), 10);
      month = parseInt(dateStr.substring(4, 6), 10) - 1; // JavaScript months are 0-indexed
      day = parseInt(dateStr.substring(6, 8), 10);
    } else {
      throw new Error(`Unsupported date format: ${format}`);
    }

    // Validate day, month ranges
    if (day < 1 || day > 31) {
      throw new Error(`Invalid day: ${day} in date ${dateStr}`);
    }
    
    if (month < 0 || month > 11) {
      throw new Error(`Invalid month: ${month + 1} in date ${dateStr}`);
    }

    // Create Date object and validate it
    const date = new Date(year, month, day);
    
    // Verify the date is valid by checking if the components match after creation
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
      throw new Error(`Invalid date: ${dateStr} (parsed as ${year}-${month + 1}-${day})`);
    }
    
    return date;
  } catch (error) {
    console.error(`Error transforming date "${dateStr}" with format "${format}":`, error);
    throw error;
  }
}