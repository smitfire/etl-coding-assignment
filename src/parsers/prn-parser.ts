import { FixedWidthParser } from 'fixed-width-parser';
import { Record, Parser } from '../types';
import { transformDate } from '../transformers/date-transformer';
import { transformNumber } from '../transformers/number-transformer';

/**
 * Implementation of the Parser interface for PRN (fixed-width) files
 */
export class PRNParser implements Parser {
  // Fixed-width column definitions for the PRN format
  private readonly columnDefs = [
    { name: 'name', start: 0, width: 16 },
    { name: 'address', start: 16, width: 22 },
    { name: 'postcode', start: 38, width: 9 },
    { name: 'phone', start: 47, width: 14 },
    { name: 'creditLimit', start: 61, width: 13 },
    { name: 'birthday', start: 74, width: 8 }
  ];

  /**
   * Parse a PRN string into an array of Records
   * @param input The PRN string to parse
   * @returns Promise resolving to an array of Records
   */
  async parse(input: string): Promise<Record[]> {
    // Create a fixed-width parser with our column definitions
    const fixedWidthParser = new FixedWidthParser(this.columnDefs);
    
    // Skip the header row by splitting the input by lines and slicing
    const lines = input.split('\n');
    if (lines.length <= 1) {
      return []; // Return empty array if there's only a header or empty input
    }
    
    const dataLines = lines.slice(1).filter(line => line.trim().length > 0);
    const dataInput = dataLines.join('\n');
    
    try {
      // Parse the fixed-width data
      const parsedData = fixedWidthParser.parse(dataInput);
      
      // Transform the parsed data into our Record type
      return parsedData.map(row => ({
        name: String(row.name || '').trim(),
        address: String(row.address || '').trim(),
        postcode: String(row.postcode || '').trim(),
        phone: String(row.phone || '').trim(),
        creditLimit: transformNumber(String(row.creditLimit || '0'), true), // PRN format has creditLimit * 100
        birthday: transformDate(String(row.birthday || ''), 'YYYYMMDD')
      }));
    } catch (error) {
      console.error('Error parsing PRN data:', error);
      throw error;
    }
  }
}