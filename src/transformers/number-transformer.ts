/**
 * Transforms a number string to a standardized number format
 * @param numStr The number string to transform
 * @param isScaledInteger Whether the number is a scaled integer (multiplied by 100)
 * @returns The transformed number
 */
export function transformNumber(numStr: string, isScaledInteger: boolean = false): number {
  if (!numStr) {
    return 0;
  }
  
  try {
    // Handle potential commas in the number string (e.g., "1,000")
    const cleanNumStr = numStr.replace(/,/g, '');
    
    // Parse the number
    let num = parseFloat(cleanNumStr);
    
    // If the number is a scaled integer (PRN format), divide by 100 to get decimal
    if (isScaledInteger) {
      num = num / 100;
    }
    
    // Return the number with 2 decimal places for consistency
    return Math.round(num * 100) / 100;
  } catch (error) {
    console.error(`Error transforming number "${numStr}":`, error);
    return 0;
  }
}