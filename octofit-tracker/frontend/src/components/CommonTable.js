import React from 'react';

// Renders a Bootstrap table from an array of objects.
// If data is a single object, it wraps it into an array.
export default function CommonTable({ data, columns }) {
  if (!data) return null;

  const rows = Array.isArray(data) ? data : [data];
  if (rows.length === 0) {
    return (
      <div className="alert alert-info mb-0">No data available.</div>
    );
  }

  const inferredColumns = columns && columns.length > 0
    ? columns
    : Object.keys(rows[0] || {});

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead className="table-light">
          <tr>
            {inferredColumns.map((col) => (
              <th key={col} scope="col" className="text-capitalize">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {inferredColumns.map((col) => (
                <td key={col}>
                  {typeof row[col] === 'object' && row[col] !== null
                    ? JSON.stringify(row[col])
                    : String(row[col] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
