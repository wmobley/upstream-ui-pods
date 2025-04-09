interface PageButtonsProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalEntries: number;
  pageSize: number;
}

export const PageButtons = ({
  currentPage,
  setCurrentPage,
  totalPages,
  totalEntries,
  pageSize,
}: PageButtonsProps) => {
  return (
    <div className="mb-4 flex justify-between items-center">
      <div>
        <span className="text-sm">
          Showing {totalEntries > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
          {Math.min(pageSize)} of {totalEntries} entries
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
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
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
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
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
  );
};
