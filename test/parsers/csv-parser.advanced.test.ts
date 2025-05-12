import { CSVParser } from '../../src/parsers/csv-parser';

describe('CSVParser Advanced Tests', () => {
  let parser: CSVParser;

  beforeEach(() => {
    parser = new CSVParser();
  });

  // Advanced character encoding tests
  describe('Character Encoding Tests', () => {
    test('should handle various non-ASCII characters', async () => {
      const csvInput = `Name,Address,Postcode,Phone,Credit Limit,Birthday
"Müller, Hans","Königsstraße 45",12345,030-12345,1000,01/01/1980
"García, María","Calle Mayor 123",28001,+34 91 123 45 67,2500.50,15/05/1975
"Dubois, Jean","Rue de la Liberté 42",75001,+33 1 23 45 67 89,3750.25,30/06/1990
"山田, 太郎","東京都新宿区1-2-3",123-4567,03-1234-5678,50000,10/12/1985`;

      const result = await parser.parse(csvInput);

      expect(result).toHaveLength(4);
      expect(result[0].name).toBe('Müller, Hans');
      expect(result[1].address).toBe('Calle Mayor 123');
      expect(result[2].postcode).toBe('75001');
      expect(result[3].name).toBe('山田, 太郎');
      expect(result[3].address).toBe('東京都新宿区1-2-3');
    });

    test('should handle special characters and symbols', async () => {
      const csvInput = `Name,Address,Postcode,Phone,Credit Limit,Birthday
"O'Neil, John","123 Main St., Apt. #42",12345,"(555) 123-4567",1234.56,01/01/1980
"Smith & Sons, Ltd.","1/2 Baker's Street",67890,"+1 (800) 555-1234",9876.54,31/12/1999
"Acme, Inc. [EU]","42° N, 71° W",10001,"N/A",100000,15/06/2000`;

      const result = await parser.parse(csvInput);

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('O\'Neil, John');
      expect(result[1].name).toBe('Smith & Sons, Ltd.');
      expect(result[2].address).toBe('42° N, 71° W');
    });
  });

  // Malformed input handling
  describe('Malformed Input Tests', () => {
    test('should handle empty CSV input', async () => {
      const result = await parser.parse('');
      expect(result).toEqual([]);
    });

    test('should handle CSV with only header row', async () => {
      const csvInput = `Name,Address,Postcode,Phone,Credit Limit,Birthday`;
      const result = await parser.parse(csvInput);
      expect(result).toEqual([]);
    });

    test('should reject records with missing required fields', async () => {
      const csvInput = `Name,Address,Postcode,Phone,Credit Limit,Birthday
"Johnson, John",Voorstraat 32,3122gg,020 3849381,100,01/01/1987
"Anderson, Paul",,4532 AA,030 3458986,,01/01/1990
,,,,0,01/01/1990`;

      const result = await parser.parse(csvInput);

      // Only the first record has all required fields filled in properly
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Johnson, John');
    });

    test('should handle CSV with extra fields', async () => {
      const csvInput = `Name,Address,Postcode,Phone,Credit Limit,Birthday,Extra1,Extra2
"Johnson, John",Voorstraat 32,3122gg,020 3849381,10000,01/01/1987,Value1,Value2`;

      const result = await parser.parse(csvInput);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Johnson, John');
      // Extra fields should be ignored
    });

    test('should handle quoted fields with embedded commas and quotes', async () => {
      const csvInput = `Name,Address,Postcode,Phone,Credit Limit,Birthday
"Johnson, ""Johnny""","Voorstraat, 32",3122gg,020 3849381,10000,01/01/1987
"Company ""The Best"", Inc.","First Floor, ""Big Building""",12345,123-456-7890,50000,15/06/1990`;

      const result = await parser.parse(csvInput);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Johnson, "Johnny"');
      expect(result[0].address).toBe('Voorstraat, 32');
      expect(result[1].name).toBe('Company "The Best", Inc.');
      expect(result[1].address).toBe('First Floor, "Big Building"');
    });
  });

  // Date format edge cases
  describe('Date Format Edge Cases', () => {
    test('should handle different date formats in the CSV', async () => {
      const csvInput = `Name,Address,Postcode,Phone,Credit Limit,Birthday
"Person 1",Address 1,12345,123-456-7890,1000,01/01/1990
"Person 2",Address 2,12345,123-456-7890,1000,1/1/1990
"Person 3",Address 3,12345,123-456-7890,1000,01/1/1990
"Person 4",Address 4,12345,123-456-7890,1000,1/01/1990`;

      const result = await parser.parse(csvInput);

      expect(result).toHaveLength(4);
      // All dates should be parsed to the same value
      expect(result[0].birthday).toEqual(new Date(1990, 0, 1));
      expect(result[1].birthday).toEqual(new Date(1990, 0, 1));
      expect(result[2].birthday).toEqual(new Date(1990, 0, 1));
      expect(result[3].birthday).toEqual(new Date(1990, 0, 1));
    });

    test('should reject records with invalid date formats', async () => {
      const csvInput = `Name,Address,Postcode,Phone,Credit Limit,Birthday
"Person 1",Address 1,12345,123-456-7890,1000,2990-01-01
"Person 2",Address 2,12345,123-456-7890,1000,01-01-1990
"Person 3",Address 3,12345,123-456-7890,1000,Jan 1 1990`;

      const result = await parser.parse(csvInput);
      
      // All records should be rejected due to invalid date formats
      expect(result).toHaveLength(0);
    });
  });

  // Currency and number format edge cases
  describe('Number Format Edge Cases', () => {
    test('should handle different number formats in the CSV', async () => {
      const csvInput = `Name,Address,Postcode,Phone,Credit Limit,Birthday
"Person 1",Address 1,12345,123-456-7890,1000,01/01/1990
"Person 2",Address 2,12345,123-456-7890,"1,000",01/01/1990
"Person 3",Address 3,12345,123-456-7890,$1000,01/01/1990
"Person 4",Address 4,12345,123-456-7890,1000.00,01/01/1990
"Person 5",Address 5,12345,123-456-7890,1.000e3,01/01/1990`;

      const result = await parser.parse(csvInput);

      expect(result).toHaveLength(5);
      // All credit limits should be parsed to 1000
      expect(result[0].creditLimit).toBe(1000);
      expect(result[1].creditLimit).toBe(1000);
      expect(result[2].creditLimit).toBe(1000); // Handles currency symbol
      expect(result[3].creditLimit).toBe(1000);
      expect(result[4].creditLimit).toBe(1000); // Handles scientific notation
    });

    test('should handle invalid number formats', async () => {
      const csvInput = `Name,Address,Postcode,Phone,Credit Limit,Birthday
"Person 1",Address 1,12345,123-456-7890,not a number,01/01/1990
"Person 2",Address 2,12345,123-456-7890,1000abc,01/01/1990`;

      const result = await parser.parse(csvInput);
      
      expect(result).toHaveLength(2);
      expect(result[0].creditLimit).toBe(0); // Invalid number should be 0
      expect(result[1].creditLimit).toBe(1000); // Partial number should be parsed correctly
    });
  });
});