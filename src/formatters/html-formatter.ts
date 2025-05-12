import { Record, Formatter } from '../types';

/**
 * Implementation of the Formatter interface for HTML output
 */
export class HTMLFormatter implements Formatter {
  /**
   * Format an array of Records as an HTML string
   * @param records The array of Records to format
   * @returns A formatted HTML string
   */
  format(records: Record[]): string {
    try {
      // Start building the HTML content
      let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Data Records</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 20px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    tr:hover {
      background-color: #f1f1f1;
    }
  </style>
</head>
<body>
  <h1>Data Records</h1>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Address</th>
        <th>Postcode</th>
        <th>Phone</th>
        <th>Credit Limit</th>
        <th>Birthday</th>
      </tr>
    </thead>
    <tbody>`;

      // Add each record as a table row
      for (const record of records) {
        html += `
      <tr>
        <td>${this.escapeHtml(record.name)}</td>
        <td>${this.escapeHtml(record.address)}</td>
        <td>${this.escapeHtml(record.postcode)}</td>
        <td>${this.escapeHtml(record.phone)}</td>
        <td>${record.creditLimit}</td>
        <td>${this.formatDate(record.birthday)}</td>
      </tr>`;
      }

      // Close the HTML structure
      html += `
    </tbody>
  </table>
</body>
</html>`;

      return html;
    } catch (error) {
      console.error('Error formatting HTML:', error);
      throw error;
    }
  }
  
  /**
   * Format a Date object as a string in DD/MM/YYYY format
   * @param date The Date object to format
   * @returns A formatted date string
   */
  private formatDate(date: Date): string {
    try {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date for HTML:', error);
      return '';
    }
  }
  
  /**
   * Escape HTML special characters to prevent XSS
   * @param str The string to escape
   * @returns An escaped string
   */
  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}