import csvParser from 'csv-parser';
import { Readable } from 'stream';
import { Record, Parser } from '../types';
import { transformDate } from '../transformers/date-transformer';
import { transformNumber } from '../transformers/number-transformer';

/**
 * Implementation of the Parser interface for CSV files
 */
export class CSVParser implements Parser {
  /**
   * Parse a CSV string into an array of Records
   * @param input The CSV string to parse
   * @returns Promise resolving to an array of Records
   */
  async parse(input: string): Promise<Record[]> {
    const results: Record[] = [];
    
    if (!input || input.trim() === '') {
      return results;
    }
    
    return new Promise((resolve, reject) => {
      // Create a readable stream from the input string
      const readableStream = Readable.from([input]);
      
      readableStream
        .pipe(csvParser())
        .on('data', (data: any) => {
          try {
            // Validate required fields before transformation
            if (!data['Name'] || !data['Birthday'] || !data['Credit Limit']) {
              console.error('Skipping record: Missing required fields');
              return; // Skip this record
            }
            
            // Try to transform the date first - if this fails, reject the entire record
            const birthday = transformDate(data['Birthday'], 'DD/MM/YYYY');
            
            // If date transformation succeeds, proceed with creating the record
            const record: Record = {
              name: data['Name']?.trim() || '',
              address: data['Address']?.trim() || '',
              postcode: data['Postcode']?.trim() || '',
              phone: data['Phone']?.trim() || '',
              creditLimit: transformNumber(data['Credit Limit']),
              birthday: birthday
            };
            
            results.push(record);
          } catch (error) {
            // Record is rejected - log error but continue processing other records
            console.error('Rejecting record due to validation error:', error);
          }
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}