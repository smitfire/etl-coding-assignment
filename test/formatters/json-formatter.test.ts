import { JSONFormatter } from '../../src/formatters/json-formatter';
import { Record } from '../../src/types';

describe('JSONFormatter', () => {
  let formatter: JSONFormatter;
  let testRecords: Record[];

  beforeEach(() => {
    formatter = new JSONFormatter();
    
    testRecords = [
      {
        name: 'Johnson, John',
        address: 'Voorstraat 32',
        postcode: '3122gg',
        phone: '020 3849381',
        creditLimit: 10000,
        birthday: new Date(1987, 0, 1) // Jan 1, 1987
      },
      {
        name: 'Gibson, Mal',
        address: 'Vredenburg 21',
        postcode: '3209 DD',
        phone: '06-48958986',
        creditLimit: 54.5,
        birthday: new Date(1978, 10, 9) // Nov 9, 1978
      }
    ];
  });

  test('should format records as JSON string', () => {
    const result = formatter.format(testRecords);
    
    // Parse the result back to verify it's valid JSON
    const parsed = JSON.parse(result);
    
    expect(parsed).toHaveLength(2);
    expect(parsed[0].name).toBe('Johnson, John');
    expect(parsed[0].birthday).toBe('01/01/1987');
    expect(parsed[1].name).toBe('Gibson, Mal');
    expect(parsed[1].creditLimit).toBe(54.5);
    expect(parsed[1].birthday).toBe('09/11/1978');
  });

  test('should handle non-ASCII characters', () => {
    const recordWithNonAscii: Record = {
      name: 'Smith, John',
      address: 'Bürkestraße 32',
      postcode: '87823',
      phone: '+44 728 889838',
      creditLimit: 9898.3,
      birthday: new Date(1999, 8, 20) // Sep 20, 1999
    };
    
    const result = formatter.format([recordWithNonAscii]);
    const parsed = JSON.parse(result);
    
    expect(parsed[0].address).toBe('Bürkestraße 32');
  });
});