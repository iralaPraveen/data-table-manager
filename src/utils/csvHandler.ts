import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { TableRow, ColumnConfig } from '@/types/table';

interface CSVRow {
  name?: string;
  email?: string;
  age?: string;
  role?: string;
  department?: string;
  location?: string;
  [key: string]: string | undefined;
}

export const parseCSV = (file: File): Promise<TableRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep as strings first for validation
      complete: (results) => {
        // Check for parsing errors
        if (results.errors.length > 0) {
          const errorMessages = results.errors
            .map(err => `Row ${err.row}: ${err.message}`)
            .join(', ');
          reject(new Error(`CSV parsing errors: ${errorMessages}`));
          return;
        }

        // Validate and transform data
        try {
          const parsedData = results.data.map((row: CSVRow, index: number) => {
            // Validate required fields
            if (!row.name || !row.email) {
              throw new Error(`Row ${index + 2}: Missing required fields (name or email)`);
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(row.email)) {
              throw new Error(`Row ${index + 2}: Invalid email format - ${row.email}`);
            }

            // Validate age
            const age = parseInt(row.age || '0');
            if (isNaN(age) || age < 0 || age > 150) {
              throw new Error(`Row ${index + 2}: Invalid age - ${row.age}`);
            }

            return {
              id: `row-${Date.now()}-${index}`,
              name: row.name.trim(),
              email: row.email.trim().toLowerCase(),
              age: age,
              role: row.role?.trim() || 'N/A',
              department: row.department?.trim() || '',
              location: row.location?.trim() || '',
            };
          });

          resolve(parsedData);
        } catch (validationError) {
          reject(validationError);
        }
      },
      error: (error) => {
        reject(new Error(`File reading error: ${error.message}`));
      },
    });
  });
};

export const exportToCSV = (data: TableRow[], columns: ColumnConfig[]) => {
  if (data.length === 0) {
    throw new Error('No data to export');
  }

  const visibleColumns = columns.filter(col => col.visible);
  
  const csvData = data.map(row => {
    const filteredRow: Record<string, string | number> = {};
    visibleColumns.forEach(col => {
      filteredRow[col.label] = row[col.id] || '';
    });
    return filteredRow;
  });

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `table-export-${Date.now()}.csv`);
};
