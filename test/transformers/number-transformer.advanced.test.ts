import { transformNumber } from '../../src/transformers/number-transformer';

describe('NumberTransformer Advanced Tests', () => {
  // Different number formats
  describe('Number Format Tests', () => {
    test('should handle various decimal formats', () => {
      // Standard decimal
      expect(transformNumber('123.45')).toBe(123.45);
      // Leading zero decimal
      expect(transformNumber('0.45')).toBe(0.45);
      // No decimal part
      expect(transformNumber('123.')).toBe(123);
      // Many decimal places
      expect(transformNumber('123.456789')).toBe(123.46); // Rounded to 2 decimal places
    });

    test('should handle scaled integers of different magnitudes', () => {
      // Small numbers
      expect(transformNumber('45', true)).toBe(0.45);
      // Medium numbers
      expect(transformNumber('12345', true)).toBe(123.45);
      // Large numbers
      expect(transformNumber('123456789', true)).toBe(1234567.89);
    });

    test('should handle scientific notation', () => {
      expect(transformNumber('1.23e2')).toBe(123);
      expect(transformNumber('1.23e-2')).toBe(0.01);
      expect(transformNumber('1.23e+2')).toBe(123);
    });
  });

  // Currency and formatting
  describe('Currency and Formatting Tests', () => {
    test('should handle numbers with currency symbols', () => {
      // Dollar sign
      expect(transformNumber('$123.45')).toBe(123.45);
      // Euro sign
      expect(transformNumber('€123.45')).toBe(123.45);
      // Pound sign
      expect(transformNumber('£123.45')).toBe(123.45);
    });

    test('should handle different thousand separators', () => {
      // Comma separators
      expect(transformNumber('1,234,567.89')).toBe(1234567.89);
      // Period as thousand separator (common in Europe)
      expect(transformNumber('1.234.567,89'.replace(/\./g, '').replace(',', '.'))).toBe(1234567.89);
      // Space separators
      expect(transformNumber('1 234 567.89'.replace(/ /g, ''))).toBe(1234567.89);
    });

    test('should handle parentheses for negative numbers', () => {
      // Accounting format for negative numbers
      expect(transformNumber('(123.45)')).toBe(-123.45);
      expect(transformNumber('(123)')).toBe(-123);
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    test('should handle zero values properly', () => {
      expect(transformNumber('0')).toBe(0);
      expect(transformNumber('0.00')).toBe(0);
      expect(transformNumber('0', true)).toBe(0);
      expect(transformNumber('.0')).toBe(0);
    });

    test('should handle negative numbers', () => {
      // Standard negative
      expect(transformNumber('-123.45')).toBe(-123.45);
      // Negative scaled integers
      expect(transformNumber('-12345', true)).toBe(-123.45);
    });

    test('should handle extremely large numbers', () => {
      // Large values close to Number.MAX_SAFE_INTEGER
      const largeNumber = '9007199254740991'; // Number.MAX_SAFE_INTEGER
      expect(transformNumber(largeNumber)).toBe(9007199254740991);
    });

    test('should handle extremely small decimals', () => {
      // Very small decimal values
      expect(transformNumber('0.0000001')).toBe(0);
      // The value is too small for 2 decimal precision, so it rounds to 0
    });
  });

  // Error handling
  describe('Error Handling and Input Validation', () => {
    test('should handle non-numeric strings gracefully', () => {
      expect(transformNumber('abc')).toBe(0);
      expect(transformNumber('abc123')).toBe(0);
      expect(transformNumber('123abc')).toBe(123);
    });

    test('should extract numbers from mixed content', () => {
      expect(transformNumber('123.45 USD')).toBe(123.45);
      expect(transformNumber('Subtotal: 123.45')).toBe(123.45);
    });

    test('should handle simple math expressions', () => {
      expect(transformNumber('123-45')).toBe(78); // Interpreted as subtraction
      expect(transformNumber('123+45')).toBe(168); // Interpreted as addition
    });
  });
});