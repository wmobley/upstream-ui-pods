import { useState } from 'react';
import {
  ListSensorsResponsePagination,
  SensorItem,
} from '@upstream/upstream-api';
import { PageButtons } from './PageButtons';
import { ItemsPerPage } from './ItemsPerPage';
import { Link } from 'react-router-dom';
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
  getRowLink?: (item: SensorItem) => string;
}

const DataCell = ({
  item,
  column,
  getRowLink,
}: {
  item: SensorItem;
  column: string;
  getRowLink?: (item: SensorItem) => string;
}) => {
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      {getRowLink ? (
        // @ts-ignore
        <Link to={getRowLink(item)}>{item[column]}</Link>
      ) : (
        // @ts-ignore
        item[column]
      )}
    </td>
  );
};

const DataTable = <T extends Record<string, string | number | boolean | null>>({
  data,
  columns,
  itemsPerPageOptions = [5, 10, 15],
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  getRowLink,
}: DataTableProps<T>) => {
  const totalPages = data.pages;
  const paginatedData = data.items;
  const [hideItemsPerPage] = useState(false);

  return (
    <div className="w-full">
      {hideItemsPerPage && (
        <ItemsPerPage
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          itemsPerPageOptions={itemsPerPageOptions}
        />
      )}
      <PageButtons
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
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
                    <DataCell
                      key={column.key}
                      item={item}
                      column={column.key}
                      getRowLink={getRowLink}
                    />
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
