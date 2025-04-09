import { useState } from 'react';
import { ListSensorsResponsePagination } from '@upstream/upstream-api';
interface DataTableProps<
  T extends Record<string, string | number | boolean | null>,
> {
  data: ListSensorsResponsePagination;
  columns: Array<{ key: keyof T & string; label: string }>;
  itemsPerPageOptions?: number[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (page: number) => void;
}

const DataTable = <T extends Record<string, string | number | boolean | null>>({
  data,
  columns,
  itemsPerPageOptions = [5, 10, 15],
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
}: DataTableProps<T>) => {
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);

  const totalPages = data.pages;
  const paginatedData = data.items;

  return (
    <div className="p-4 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-4">Data Table</h1>
      <div className="mb-4 flex items-center">
        <label className="text-sm font-medium mr-2">Items per page:</label>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="p-1 border rounded"
        >
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {item[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div>
          <span className="text-sm">
            Showing{' '}
            {data.items.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}{' '}
            to {Math.min(data.size)} of {data.total} entries
          </span>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 border rounded ${
                  currentPage === pageNum ? 'bg-blue-500 text-white' : ''
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
