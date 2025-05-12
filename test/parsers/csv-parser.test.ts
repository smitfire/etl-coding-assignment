import { CSVParser } from '../../src/parsers/csv-parser';

describe('CSVParser', () => {
  let parser: CSVParser;

  beforeEach(() => {
    parser = new CSVParser();
  });

  test('should parse a valid CSV string', async () => {
    const csvInput = `Name,Address,Postcode,Phone,Credit Limit,Birthday
"Johnson, John",Voorstraat 32,3122gg,020 3849381,10000,01/01/1987`;

    const result = await parser.parse(csvInput);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      name: 'Johnson, John',
      address: 'Voorstraat 32',
      postcode: '3122gg',
      phone: '020 3849381',
      creditLimit: 10000,
      birthday: new Date(1987, 0, 1) // Jan 1, 1987
    });
  });

  test('should handle multiple records', async () => {
    const csvInput = `Name,Address,Postcode,Phone,Credit Limit,Birthday
"Johnson, John",Voorstraat 32,3122gg,020 3849381,10000,01/01/1987
"Gibson, Mal",Vredenburg 21,3209 DD,06-48958986,54.5,09/11/1978`;

    const result = await parser.parse(csvInput);

    expect(result).toHaveLength(2);
    expect(result[1].name).toBe('Gibson, Mal');
    expect(result[1].creditLimit).toBe(54.5);
  });

  test('should handle non-ASCII characters', async () => {
    const csvInput = `Name,Address,Postcode,Phone,Credit Limit,Birthday
"Smith, John",Bürkestraße 32,87823,+44 728 889838,9898.3,20/09/1999`;

    const result = await parser.parse(csvInput);

    expect(result).toHaveLength(1);
    expect(result[0].address).toBe('Bürkestraße 32');
  });
});