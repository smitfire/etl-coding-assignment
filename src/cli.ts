import { InputFormat, OutputFormat } from './types';

/**
 * Parses command-line arguments
 * @returns Object containing parsed input and output formats
 */
export function parseArgs(): { inputFormat: InputFormat; outputFormat: OutputFormat } {
  // Get arguments (skipping node and script name)
  const args = process.argv.slice(2);
  
  // Check if we have enough arguments
  if (args.length < 2) {
    displayHelp();
    process.exit(1);
  }
  
  // Parse input format
  const inputFormatArg = args[0].toLowerCase();
  let inputFormat: InputFormat;
  
  if (inputFormatArg === 'csv') {
    inputFormat = InputFormat.CSV;
  } else if (inputFormatArg === 'prn') {
    inputFormat = InputFormat.PRN;
  } else {
    console.error(`Error: Invalid input format '${inputFormatArg}'. Must be 'csv' or 'prn'.`);
    displayHelp();
    process.exit(1);
  }
  
  // Parse output format
  const outputFormatArg = args[1].toLowerCase();
  let outputFormat: OutputFormat;
  
  if (outputFormatArg === 'json') {
    outputFormat = OutputFormat.JSON;
  } else if (outputFormatArg === 'html') {
    outputFormat = OutputFormat.HTML;
  } else {
    console.error(`Error: Invalid output format '${outputFormatArg}'. Must be 'json' or 'html'.`);
    displayHelp();
    process.exit(1);
  }
  
  return { inputFormat, outputFormat };
}

/**
 * Displays help information
 */
export function displayHelp(): void {
  console.log(`
Data Format Translation Program

Usage:
  cat input-file | data-translator <input-format> <output-format>

  <input-format>   : 'csv' or 'prn'
  <output-format>  : 'json' or 'html'

Examples:
  cat data.csv | data-translator csv json > output.json
  cat data.prn | data-translator prn html > output.html
`);
}