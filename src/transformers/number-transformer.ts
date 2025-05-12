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
    // Handle accounting notation with parentheses (negative numbers)
    let isNegative = false;
    let workingStr = numStr.trim();
    
    // Check for parentheses notation (accounting format for negatives)
    if (workingStr.startsWith('(') && workingStr.endsWith(')')) {
      isNegative = true;
      workingStr = workingStr.substring(1, workingStr.length - 1);
    }
    
    // Remove currency symbols and commas
    workingStr = workingStr.replace(/[$£€]/g, '').replace(/,/g, '').trim();
    
    // Handle mathematical expressions like "123-45" or "123+45"
    if (workingStr.includes('-') && workingStr.indexOf('-') > 0) {
      const parts = workingStr.split('-');
      if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
        return Number(parts[0]) - Number(parts[1]);
      }
    }
    
    if (workingStr.includes('+') && workingStr.indexOf('+') > 0) {
      const parts = workingStr.split('+');
      if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
        return Number(parts[0]) + Number(parts[1]);
      }
    }
    
    // Handle scientific notation
    if (/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)$/.test(workingStr)) {
      const num = Number(workingStr);
      const result = isNegative ? -num : num;
      return Math.round(result * 100) / 100;
    }
    
    // Extract number from text with various formats
    let numericMatch = workingStr.match(/[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/);
    
    if (!numericMatch) {
      return 0;
    }
    
    // Check if the text comes before the number (prefix) or after (suffix)
    const startsWithLetter = /^[a-zA-Z]/.test(workingStr);
    const numericPart = numericMatch[0];
    const numericIndex = workingStr.indexOf(numericPart);
    
    // Make sure we can distinguish between prefix and suffix
    // If the number is at the start or right after a prefix with a delimiter, we accept it
    // e.g., "123 USD" or "Subtotal: 123.45" - we extract the 123.45
    if (startsWithLetter && numericIndex > 0) {
      // Check if there's a delimiter before the number (: or space)
      const delimiter = workingStr.substring(numericIndex - 1, numericIndex);
      if (delimiter !== ':' && delimiter !== ' ' && delimiter !== '-') {
        return 0; // No clear delimiter, reject the extraction
      }
    }
    
    let num = parseFloat(numericPart);
    
    // Handle scaled integers (divide by 100 if specified)
    if (isScaledInteger) {
      num = num / 100;
    }
    
    // Apply negative sign if needed
    if (isNegative) {
      num = -num;
    }
    
    // Round to 2 decimal places for consistency
    return Math.round(num * 100) / 100;
  } catch (error) {
    console.error(`Error transforming number "${numStr}":`, error);
    return 0;
  }
}