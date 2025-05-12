# Data Format Translation Program - Solution Design

## Overview

This solution provides a command-line utility to read CSV and PRN files from stdin and output JSON or HTML to stdout, as specified by command-line options. The utility ensures identical output regardless of input format, handles non-ASCII characters correctly, and preserves all content during translation.

## Architecture

The solution follows a modular architecture with clear separation of concerns:

```
┌─────────┐     ┌───────────────┐     ┌─────────────┐
│  Input  │     │ Transformation │     │   Output   │
│ Parsers │────▶│     Layer     │────▶│ Formatters │
└─────────┘     └───────────────┘     └─────────────┘
```

### Core Components

1. **Input Parsers**
   - CSVParser: Parses comma-separated values
   - PRNParser: Parses fixed-width records

2. **Data Transformation Layer**
   - DateTransformer: Normalizes date formats
   - NumberTransformer: Normalizes numeric values
   - Common data model to standardize records

3. **Output Formatters**
   - JSONFormatter: Generates JSON output
   - HTMLFormatter: Generates HTML output

4. **CLI Interface**
   - Handles command-line arguments
   - Manages stdin/stdout streams

## Implementation Details

### Data Model

The central data model ensures consistent representation regardless of input format:

```typescript
interface Record {
  name: string;
  address: string;
  postcode: string;
  phone: string;
  creditLimit: number; // Stored as decimal
  birthday: Date;      // Stored as Date object
}
```

### Input Parsing

- **CSV Format**:
  - Comma-separated values
  - Header row with column names
  - Some fields are quoted (especially those with commas)
  - Date format: DD/MM/YYYY
  - Credit limit: decimal numbers

- **PRN Format**:
  - Fixed-width records
  - Header row with column names
  - Date format: YYYYMMDD
  - Credit limit: multiplied by 100 (no decimal point)

### Data Transformation

- **Date Normalization**: Converts between DD/MM/YYYY and YYYYMMDD formats
- **Number Normalization**: Converts between decimal and integer*100 formats
- **Character Encoding**: Ensures proper handling of non-ASCII characters

### Output Formatting

- **JSON Output**: Well-formatted JSON array of records
- **HTML Output**: Responsive HTML table with proper styling

## Technical Choices

### Libraries

- **csv-parser**: Fast, streaming CSV parser with good error handling
- **fixed-width-parser**: TypeScript-friendly parser for fixed-width files
- **Node.js streams**: For efficient processing of large files

### TypeScript

The solution uses TypeScript for:
- Type safety across the codebase
- Clear interfaces between components
- Improved code documentation
- Better development experience

## Testing Strategy

The solution includes comprehensive tests targeting:

1. **Unit Tests**:
   - Individual parsers, transformers, and formatters
   - Utility functions

2. **Integration Tests**:
   - End-to-end processing pipeline
   - Command-line interface

3. **Edge Case Tests**:
   - Non-ASCII character handling
   - Various date and number formats
   - Malformed input handling
   - Empty files/lines

## Usage

```bash
# Output as HTML
cat ./Workbook2.csv | node dist/index.js csv html > output.html

# Output as JSON
cat ./Workbook2.prn | node dist/index.js prn json > output.json
```

## Project Structure

```
/
├── src/
│   ├── index.ts                # Entry point
│   ├── cli.ts                  # Command-line interface
│   ├── types.ts                # Type definitions
│   ├── parsers/
│   │   ├── index.ts            # Parser factory
│   │   ├── csv-parser.ts       # CSV parser implementation
│   │   └── prn-parser.ts       # PRN parser implementation
│   ├── formatters/
│   │   ├── index.ts            # Formatter factory
│   │   ├── json-formatter.ts   # JSON formatter implementation
│   │   └── html-formatter.ts   # HTML formatter implementation
│   └── transformers/
│       ├── index.ts            # Transformer factory
│       ├── date-transformer.ts # Date transformation utilities
│       └── number-transformer.ts # Number transformation utilities
├── test/
│   ├── parsers/                # Parser tests
│   ├── formatters/             # Formatter tests
│   └── transformers/           # Transformer tests
├── docs/
│   ├── DESIGN_DECISIONS.md     # Detailed design decisions and rationale
│   └── TEST_CASES.md           # Comprehensive test case documentation
├── package.json
├── tsconfig.json
└── jest.config.js              # Test configuration
```

## Edge Cases and Considerations

The solution handles the following edge cases:

1. **Character Encoding**: Proper handling of non-ASCII characters like 'ü' and 'ß'
2. **Date Formats**: Consistent transformation between different date representations
3. **Number Formats**: Handling of integers, decimals, and scaled numbers
4. **Error Handling**: Graceful handling of malformed input
5. **Performance**: Efficient processing for large files using streams

## Additional Documentation

For more detailed information, please refer to the following documents:

- [Design Decisions](./docs/DESIGN_DECISIONS.md): Detailed explanation of the design choices and their rationale
- [Test Cases](./docs/TEST_CASES.md): Comprehensive list of test cases covering edge cases and requirements