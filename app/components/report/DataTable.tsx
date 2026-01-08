import React from 'react';

interface DataTableProps {
  headers: string[];
  rows: (string | number)[][];
  caption?: string;
  footnote?: string;
}

export default function DataTable({
  headers,
  rows,
  caption,
  footnote
}: DataTableProps) {
  return (
    <div className="my-6 avoid-break">
      {caption && (
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          {caption}
        </h4>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left font-semibold border border-blue-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${
                  rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-blue-50 print:hover:bg-gray-50 avoid-break`}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 border border-gray-300 text-gray-900"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footnote && (
        <p className="text-sm text-gray-600 mt-2 italic">
          {footnote}
        </p>
      )}
    </div>
  );
}
