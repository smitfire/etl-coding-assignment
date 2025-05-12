import { Parser, InputFormat } from '../types';
import { CSVParser } from './csv-parser';
import { PRNParser } from './prn-parser';

/**
 * Factory function that returns the appropriate parser based on input format
 * @param format The input format (csv or prn)
 * @returns The appropriate parser implementation
 */
export function getParser(format: InputFormat): Parser {
  switch (format) {
    case InputFormat.CSV:
      return new CSVParser();
    case InputFormat.PRN:
      return new PRNParser();
    default:
      throw new Error(`Unsupported input format: ${format}`);
  }
}