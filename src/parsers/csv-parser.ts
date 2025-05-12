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
    
    return new Promise((resolve, reject) => {
      // Create a readable stream from the input string
      const readableStream = Readable.from([input]);
      
      readableStream
        .pipe(csvParser())
        .on('data', (data: any) => {
          try {
            // Transform and normalize the data
            const record: Record = {
              name: data['Name']?.trim() || '',
              address: data['Address']?.trim() || '',
              postcode: data['Postcode']?.trim() || '',
              phone: data['Phone']?.trim() || '',
              creditLimit: transformNumber(data['Credit Limit'] || '0'),
              birthday: transformDate(data['Birthday'] || '', 'DD/MM/YYYY')
            };
            
            results.push(record);
          } catch (error) {
            console.error('Error processing CSV row:', error);
            // Continue processing other rows even if one fails
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