import { transformDate } from '../../src/transformers/date-transformer';

describe('DateTransformer', () => {
  test('should transform DD/MM/YYYY format correctly', () => {
    const result = transformDate('01/01/1987', 'DD/MM/YYYY');
    expect(result).toEqual(new Date(1987, 0, 1));
  });

  test('should transform YYYYMMDD format correctly', () => {
    const result = transformDate('19870101', 'YYYYMMDD');
    expect(result).toEqual(new Date(1987, 0, 1));
  });

  test('should handle leap years correctly', () => {
    const result = transformDate('29/02/2020', 'DD/MM/YYYY');
    expect(result).toEqual(new Date(2020, 1, 29));
  });

  test('should throw error for invalid dates', () => {
    expect(() => transformDate('31/02/2020', 'DD/MM/YYYY')).toThrow();
  });

  test('should throw error for invalid formats', () => {
    expect(() => transformDate('2020-01-01', 'DD/MM/YYYY')).toThrow();
  });
});