import { useState } from 'react';
import { ListSensorsResponsePagination } from '@upstream/upstream-api';
import { PageButtons } from './PageButtons';
import { ItemsPerPage } from './ItemsPerPage';
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
  const totalPages = data.pages;
  const paginatedData = data.items;
  const [hideItemsPerPage] = useState(false);

  return (
    <div className="w-full">
      {hideItemsPerPage && (
        <ItemsPerPage
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          itemsPerPageOptions={itemsPerPageOptions}
        />
      )}
      <PageButtons
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        totalEntries={data.total}
        pageSize={data.size}
      />
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
    </div>
  );
};

export default DataTable;
