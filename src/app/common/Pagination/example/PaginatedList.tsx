import React from 'react';
import Pagination from '../Pagination';

// Example interface for paginated data
interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Example component that uses pagination
interface PaginatedListProps<T> {
  data: PaginatedData<T>;
  onPageChange: (page: number) => void;
  renderItem: (item: T) => React.ReactNode;
  className?: string;
}

function PaginatedList<T>({
  data,
  onPageChange,
  renderItem,
  className = '',
}: PaginatedListProps<T>) {
  return (
    <div className={className}>
      {/* Render your list of items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.items.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
      </div>

      {/* Add the pagination component at the bottom */}
      <Pagination
        currentPage={data.page}
        totalPages={data.pages}
        onPageChange={onPageChange}
        className="mt-6"
      />
    </div>
  );
}

export default PaginatedList;
