import { transformDate } from '../../src/transformers/date-transformer';

describe('DateTransformer Advanced Tests', () => {
  // Different date formats and edge cases
  describe('Edge Date Cases', () => {
    test('should handle leap year dates correctly', () => {
      // February 29 in leap years
      expect(transformDate('29/02/2020', 'DD/MM/YYYY')).toEqual(new Date(2020, 1, 29));
      expect(transformDate('20200229', 'YYYYMMDD')).toEqual(new Date(2020, 1, 29));
    });

    test('should throw error for non-leap year February 29th', () => {
      expect(() => transformDate('29/02/2019', 'DD/MM/YYYY')).toThrow();
      expect(() => transformDate('20190229', 'YYYYMMDD')).toThrow();
    });

    test('should handle end-of-month dates correctly', () => {
      // Month with 31 days
      expect(transformDate('31/01/2022', 'DD/MM/YYYY')).toEqual(new Date(2022, 0, 31));
      // Month with 30 days
      expect(transformDate('30/04/2022', 'DD/MM/YYYY')).toEqual(new Date(2022, 3, 30));
    });

    test('should throw error for invalid dates', () => {
      // Invalid day for month
      expect(() => transformDate('31/04/2022', 'DD/MM/YYYY')).toThrow();
      // Invalid month
      expect(() => transformDate('01/13/2022', 'DD/MM/YYYY')).toThrow();
    });
  });

  // Date ranges
  describe('Date Range Tests', () => {
    test('should handle dates from different centuries', () => {
      // 19th century
      expect(transformDate('01/01/1899', 'DD/MM/YYYY')).toEqual(new Date(1899, 0, 1));
      expect(transformDate('18990101', 'YYYYMMDD')).toEqual(new Date(1899, 0, 1));
      
      // 20th century
      expect(transformDate('31/12/1999', 'DD/MM/YYYY')).toEqual(new Date(1999, 11, 31));
      expect(transformDate('19991231', 'YYYYMMDD')).toEqual(new Date(1999, 11, 31));
      
      // 21st century
      expect(transformDate('01/01/2000', 'DD/MM/YYYY')).toEqual(new Date(2000, 0, 1));
      expect(transformDate('20000101', 'YYYYMMDD')).toEqual(new Date(2000, 0, 1));
    });

    test('should handle future dates', () => {
      const futureYear = new Date().getFullYear() + 10;
      const futureDateDDMMYYYY = `01/01/${futureYear}`;
      const futureDateYYYYMMDD = `${futureYear}0101`;
      
      expect(transformDate(futureDateDDMMYYYY, 'DD/MM/YYYY')).toEqual(new Date(futureYear, 0, 1));
      expect(transformDate(futureDateYYYYMMDD, 'YYYYMMDD')).toEqual(new Date(futureYear, 0, 1));
    });
  });

  // Error handling tests
  describe('Error Handling', () => {
    test('should throw error for empty date strings', () => {
      expect(() => transformDate('', 'DD/MM/YYYY')).toThrow();
      expect(() => transformDate('', 'YYYYMMDD')).toThrow();
    });

    test('should throw error for malformed date strings', () => {
      // Wrong separators
      expect(() => transformDate('01-01-2022', 'DD/MM/YYYY')).toThrow();
      // Missing parts
      expect(() => transformDate('01/2022', 'DD/MM/YYYY')).toThrow();
      // Too few digits
      expect(() => transformDate('2020010', 'YYYYMMDD')).toThrow();
    });

    test('should throw error for invalid component values', () => {
      // Day out of range
      expect(() => transformDate('00/01/2022', 'DD/MM/YYYY')).toThrow();
      expect(() => transformDate('32/01/2022', 'DD/MM/YYYY')).toThrow();
      
      // Month out of range
      expect(() => transformDate('01/00/2022', 'DD/MM/YYYY')).toThrow();
      expect(() => transformDate('01/13/2022', 'DD/MM/YYYY')).toThrow();
    });
  });
});