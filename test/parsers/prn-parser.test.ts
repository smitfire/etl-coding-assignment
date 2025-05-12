import { PRNParser } from '../../src/parsers/prn-parser';

describe('PRNParser', () => {
  let parser: PRNParser;

  beforeEach(() => {
    parser = new PRNParser();
  });

  test('should parse a valid PRN string', async () => {
    const prnInput = `Name            Address               Postcode Phone         Credit Limit Birthday
Johnson, John   Voorstraat 32         3122gg   020 3849381        1000000 19870101`;

    const result = await parser.parse(prnInput);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      name: 'Johnson, John',
      address: 'Voorstraat 32',
      postcode: '3122gg',
      phone: '020 3849381',
      creditLimit: 10000, // 1000000 / 100
      birthday: new Date(1987, 0, 1) // Jan 1, 1987
    });
  });

  test('should handle multiple records', async () => {
    const prnInput = `Name            Address               Postcode Phone         Credit Limit Birthday
Johnson, John   Voorstraat 32         3122gg   020 3849381        1000000 19870101
Gibson, Mal     Vredenburg 21         3209 DD  06-48958986           5450 19781109`;

    const result = await parser.parse(prnInput);

    expect(result).toHaveLength(2);
    expect(result[1].name).toBe('Gibson, Mal');
    expect(result[1].creditLimit).toBe(54.5); // 5450 / 100
  });

  test('should handle non-ASCII characters', async () => {
    const prnInput = `Name            Address               Postcode Phone         Credit Limit Birthday
Smith, John     Bürkestraße 32        87823    +44 728 889838      989830 19990920`;

    const result = await parser.parse(prnInput);

    expect(result).toHaveLength(1);
    expect(result[0].address).toBe('Bürkestraße 32');
  });
});