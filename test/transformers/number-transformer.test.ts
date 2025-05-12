import { transformNumber } from '../../src/transformers/number-transformer';

describe('NumberTransformer', () => {
  test('should transform regular decimal numbers correctly', () => {
    expect(transformNumber('10000')).toBe(10000);
    expect(transformNumber('54.5')).toBe(54.5);
    expect(transformNumber('9898.3')).toBe(9898.3);
  });

  test('should transform scaled integers correctly', () => {
    expect(transformNumber('1000000', true)).toBe(10000);
    expect(transformNumber('5450', true)).toBe(54.5);
    expect(transformNumber('989830', true)).toBe(9898.3);
  });

  test('should handle empty strings', () => {
    expect(transformNumber('')).toBe(0);
  });

  test('should handle numbers with commas', () => {
    expect(transformNumber('1,000')).toBe(1000);
    expect(transformNumber('1,000.50')).toBe(1000.5);
  });

  test('should round to 2 decimal places', () => {
    expect(transformNumber('100.555')).toBe(100.56);
    expect(transformNumber('10055.5', true)).toBe(100.56);
  });
});