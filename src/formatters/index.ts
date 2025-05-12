import { Formatter, OutputFormat } from '../types';
import { JSONFormatter } from './json-formatter';
import { HTMLFormatter } from './html-formatter';

/**
 * Factory function that returns the appropriate formatter based on output format
 * @param format The output format (json or html)
 * @returns The appropriate formatter implementation
 */
export function getFormatter(format: OutputFormat): Formatter {
  switch (format) {
    case OutputFormat.JSON:
      return new JSONFormatter();
    case OutputFormat.HTML:
      return new HTMLFormatter();
    default:
      throw new Error(`Unsupported output format: ${format}`);
  }
}