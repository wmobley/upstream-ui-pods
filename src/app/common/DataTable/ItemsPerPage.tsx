interface ItemsPerPageProps {
  itemsPerPage: number;
  setItemsPerPage: (itemsPerPage: number) => void;
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
  itemsPerPageOptions: number[];
}

export const ItemsPerPage = ({
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  itemsPerPageOptions,
}: ItemsPerPageProps) => {
  return (
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
  );
};
