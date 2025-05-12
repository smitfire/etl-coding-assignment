import { Record, Formatter } from '../types';

/**
 * Implementation of the Formatter interface for JSON output
 */
export class JSONFormatter implements Formatter {
  /**
   * Format an array of Records as a JSON string
   * @param records The array of Records to format
   * @returns A formatted JSON string
   */
  format(records: Record[]): string {
    try {
      // Convert the records to a JSON-friendly format
      const jsonRecords = records.map(record => ({
        name: record.name,
        address: record.address,
        postcode: record.postcode,
        phone: record.phone,
        creditLimit: record.creditLimit,
        birthday: this.formatDate(record.birthday)
      }));
      
      // Return the stringified JSON with pretty formatting
      return JSON.stringify(jsonRecords, null, 2);
    } catch (error) {
      console.error('Error formatting JSON:', error);
      throw error;
    }
  }
  
  /**
   * Format a Date object as a string in DD/MM/YYYY format
   * @param date The Date object to format
   * @returns A formatted date string
   */
  private formatDate(date: Date): string {
    try {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date for JSON:', error);
      return '';
    }
  }
}