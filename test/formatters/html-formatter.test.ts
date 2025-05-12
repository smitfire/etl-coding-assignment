import { HTMLFormatter } from '../../src/formatters/html-formatter';
import { Record } from '../../src/types';

describe('HTMLFormatter', () => {
  let formatter: HTMLFormatter;
  let testRecords: Record[];

  beforeEach(() => {
    formatter = new HTMLFormatter();
    
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

  test('should format records as HTML', () => {
    const result = formatter.format(testRecords);
    
    // Basic validations for HTML output
    expect(result).toContain('<!DOCTYPE html>');
    expect(result).toContain('<table>');
    expect(result).toContain('<th>Name</th>');
    expect(result).toContain('Johnson, John');
    expect(result).toContain('01/01/1987');
    expect(result).toContain('Gibson, Mal');
    expect(result).toContain('54.5');
    expect(result).toContain('09/11/1978');
  });

  test('should escape HTML special characters', () => {
    const recordWithHtmlChars: Record = {
      name: 'Smith, John',
      address: '<script>alert("XSS")</script>',
      postcode: '87823',
      phone: '+44 728 889838',
      creditLimit: 9898.3,
      birthday: new Date(1999, 8, 20) // Sep 20, 1999
    };
    
    const result = formatter.format([recordWithHtmlChars]);
    
    expect(result).not.toContain('<script>alert("XSS")</script>');
    expect(result).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
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
    
    expect(result).toContain('Bürkestraße 32');
  });
});