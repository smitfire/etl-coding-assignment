/**
 * Core data model to represent a record regardless of input format
 */
export interface Record {
  name: string;
  address: string;
  postcode: string;
  phone: string;
  creditLimit: number; // Stored as decimal
  birthday: Date;      // Stored as Date object
}

/**
 * Input format types
 */
export enum InputFormat {
  CSV = 'csv',
  PRN = 'prn'
}

/**
 * Output format types
 */
export enum OutputFormat {
  JSON = 'json',
  HTML = 'html'
}

/**
 * Interface for parser implementations
 */
export interface Parser {
  parse(input: string): Promise<Record[]>;
}

/**
 * Interface for formatter implementations
 */
export interface Formatter {
  format(records: Record[]): string;
}