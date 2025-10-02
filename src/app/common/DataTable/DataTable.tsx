import { useState } from 'react';
import {
  ListSensorsResponsePagination,
  SensorItem,
  SensorStatistics,
} from '@upstream/upstream-api';
import { PageButtons } from './PageButtons';
import { ItemsPerPage } from './ItemsPerPage';
import { Link } from 'react-router-dom';
import { formatNumber } from '../../common/NumberFormatter/NumberFortatterUtils';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { renderChm } from '../../../utils/helpers';

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
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  actions?: (item: SensorItem) => React.ReactNode;
}

type SortDirection = 'asc' | 'desc' | null;

const DataCell = ({
  item,
  column,
  getRowLink,
}: {
  item: SensorItem;
  column: string;
  getRowLink?: (item: SensorItem) => string;
}) => {
  if (column.includes('statistics')) {
    //console.log(item.statistics);
    const key = column.split('.')[1] as keyof SensorStatistics;
    return (
      <td className="px-6 py-4 whitespace-nowrap">
        {item.statistics &&
        item.statistics[key] !== null &&
        item.statistics[key] !== undefined
          ? typeof item.statistics[key] === 'number'
            ? formatNumber(item.statistics[key])
            : 'N/A'
          : 'N/A'}
      </td>
    );
  }
  // @ts-ignore
  let cur : string = item[column]
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      {getRowLink ? (
        <Link to={getRowLink(item)}> {
                      cur && typeof cur === 'string' ?
                      renderChm(cur)
                      : cur
        } </Link>
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
  onSort,
  actions,
}: DataTableProps<T>) => {
  const totalPages = data.pages;
  const paginatedData = data.items;
  const [hideItemsPerPage] = useState(false);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (column: string) => {
    let newDirection: SortDirection = 'asc';

    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        newDirection = 'desc';
      } else if (sortDirection === 'desc') {
        newDirection = null;
      }
    }

    setSortColumn(newDirection ? column : null);
    setSortDirection(newDirection);

    if (onSort && newDirection) {
      onSort(column, newDirection);
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return <FaSort className="ml-1" />;
    if (sortDirection === 'asc') return <FaSortUp className="ml-1" />;
    if (sortDirection === 'desc') return <FaSortDown className="ml-1" />;
    return <FaSort className="ml-1" />;
  };

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
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              )}
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
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-4 text-center">
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
