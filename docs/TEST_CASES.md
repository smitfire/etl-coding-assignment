# Test Cases for Data Format Translation Program

This document outlines the test cases to ensure our data format translation program functions correctly, especially for edge cases and specific requirements mentioned in the assignment.

## Basic Functionality Tests

### Input Format Parsing

1. **CSV Parsing Test**
   - Verify correct parsing of CSV header row
   - Verify correct parsing of quoted fields (e.g., "Johnson, John")
   - Verify correct parsing of unquoted fields
   - Verify correct handling of commas within quoted fields

2. **PRN Parsing Test**
   - Verify correct parsing of PRN header row
   - Verify correct extraction of fields based on fixed widths
   - Verify handling of leading/trailing spaces in fields

### Output Format Generation

1. **JSON Output Test**
   - Verify JSON structure is valid
   - Verify all fields are correctly included
   - Verify field names match the input headers

2. **HTML Output Test**
   - Verify HTML is well-formed
   - Verify table structure includes headers and all rows
   - Verify data is correctly placed in table cells

### End-to-End Tests

1. **CSV to JSON Test**
   - Verify complete pipeline from CSV input to JSON output
   - Compare output against expected JSON structure

2. **CSV to HTML Test**
   - Verify complete pipeline from CSV input to HTML output
   - Compare output against expected HTML structure

3. **PRN to JSON Test**
   - Verify complete pipeline from PRN input to JSON output
   - Compare output against expected JSON structure

4. **PRN to HTML Test**
   - Verify complete pipeline from PRN input to HTML output
   - Compare output against expected HTML structure

5. **Identical Output Test**
   - Verify that CSV and PRN inputs produce identical JSON outputs
   - Verify that CSV and PRN inputs produce identical HTML outputs

## Data Transformation Tests

### Date Format Handling

1. **CSV Date Format Test**
   - Verify correct parsing of DD/MM/YYYY format (e.g., "01/01/1987")
   - Verify correct transformation to standardized date format

2. **PRN Date Format Test**
   - Verify correct parsing of YYYYMMDD format (e.g., "19870101")
   - Verify correct transformation to standardized date format

3. **Date Edge Cases**
   - Test handling of leap years
   - Test handling of different century dates

### Number Format Handling

1. **CSV Credit Limit Format Test**
   - Verify correct parsing of decimal numbers (e.g., "10000", "54.5")
   - Verify correct transformation to standardized number format

2. **PRN Credit Limit Format Test**
   - Verify correct parsing of integer*100 format (e.g., "1000000" for 10000.00)
   - Verify correct transformation to standardized number format

3. **Number Edge Cases**
   - Test handling of very large numbers
   - Test handling of zero values
   - Test handling of negative values (if applicable)

## Character Encoding Tests

1. **Non-ASCII Character Test**
   - Verify correct handling of non-ASCII characters (e.g., "Bürkestraße")
   - Verify preservation of these characters in output formats

2. **UTF-8 Encoding Test**
   - Verify all output is correctly encoded in UTF-8
   - Verify no data loss during encoding/decoding

## Error Handling Tests

1. **Malformed Input Tests**
   - Test handling of CSV with missing fields
   - Test handling of PRN with incorrect line lengths
   - Test handling of invalid date formats
   - Test handling of invalid number formats

2. **Empty Input Tests**
   - Test handling of empty input files
   - Test handling of files with only headers
   - Test handling of files with empty lines

## Performance Tests

1. **Large File Test**
   - Test processing of large CSV files (e.g., 10,000+ rows)
   - Test processing of large PRN files (e.g., 10,000+ rows)
   - Verify memory usage remains reasonable

2. **Stream Processing Test**
   - Verify correct handling of streamed input
   - Verify correct streaming of output

## Command Line Interface Tests

1. **CLI Argument Tests**
   - Test correct handling of input format argument (csv/prn)
   - Test correct handling of output format argument (json/html)
   - Test handling of invalid arguments

2. **Pipeline Tests**
   - Test program as part of a command pipeline
   - Verify correct reading from stdin
   - Verify correct writing to stdout