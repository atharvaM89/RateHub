import React from 'react';

export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
  sortByField?: string;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  isLoading?: boolean;
}

export function Table<T extends { id: string }>({
  columns,
  data,
  sortBy,
  sortOrder,
  onSort,
  isLoading = false,
}: TableProps<T>) {
  const handleSortClick = (col: TableColumn<T>) => {
    if (col.sortable && onSort) {
      const field = col.sortByField || (typeof col.accessor === 'string' ? (col.accessor as string) : '');
      if (field) {
        onSort(field);
      }
    }
  };

  return (
    <div className="w-full overflow-x-auto border border-slate-100 rounded-lg shadow-sm bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col, index) => {
              const isSortedThis = col.sortable && (col.sortByField === sortBy || (typeof col.accessor === 'string' && col.accessor === sortBy));
              return (
                <th
                  key={index}
                  onClick={() => handleSortClick(col)}
                  className={`px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider ${
                    col.sortable ? 'cursor-pointer select-none hover:text-slate-800' : ''
                  } ${col.className || ''}`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-slate-400">
                        {isSortedThis ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ' ⇅'}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {columns.map((_, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-slate-400">
                No data available
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                {columns.map((col, j) => {
                  let cellContent: React.ReactNode;
                  if (typeof col.accessor === 'function') {
                    cellContent = col.accessor(item);
                  } else {
                    cellContent = String(item[col.accessor] ?? '');
                  }
                  return (
                    <td key={j} className={`px-6 py-4 whitespace-nowrap text-sm text-slate-700 ${col.className || ''}`}>
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
export default Table;
