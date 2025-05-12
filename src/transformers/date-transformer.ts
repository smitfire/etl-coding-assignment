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
      // Parse date in format DD/MM/YYYY
      const parts = dateStr.split('/');
      if (parts.length !== 3) {
        throw new Error(`Invalid date format, expected DD/MM/YYYY but got: ${dateStr}`);
      }
      
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
      year = parseInt(parts[2], 10);
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