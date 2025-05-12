#!/usr/bin/env node

import { getParser } from './parsers';
import { getFormatter } from './formatters';
import { parseArgs } from './cli';

/**
 * Main program function
 */
async function main(): Promise<void> {
  try {
    // Parse command-line arguments
    const { inputFormat, outputFormat } = parseArgs();
    
    // Get appropriate parser and formatter
    const parser = getParser(inputFormat);
    const formatter = getFormatter(outputFormat);
    
    // Read from stdin
    let input = '';
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', (chunk) => {
      input += chunk;
    });
    
    process.stdin.on('end', async () => {
      try {
        // Parse the input data
        const records = await parser.parse(input);
        
        // Format the output
        const output = formatter.format(records);
        
        // Write to stdout
        process.stdout.write(output);
      } catch (error) {
        console.error('Error processing data:', error);
        process.exit(1);
      }
    });
    
    // Handle stdin errors
    process.stdin.on('error', (error) => {
      console.error('Error reading from stdin:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the program
main().catch((error) => {
  console.error('Uncaught error:', error);
  process.exit(1);
});