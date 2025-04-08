import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilteringModal from './FilteringModal';

interface FilteringButtonProps {
  onSubmit: (filters: {
    unit?: string;
    description?: string;
    alias?: string;
  }) => void;
  onClear: () => void;
  initialFilters?: {
    unit?: string;
    description?: string;
    alias?: string;
  };
}

const FilteringButton: React.FC<FilteringButtonProps> = ({
  onSubmit,
  onClear,
  initialFilters = {},
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasActiveFilters = Object.values(initialFilters).some(
    (value) => value !== undefined && value !== '',
  );

  return (
    <div className="flex flex-col gap-1">
      <div>
        <label htmlFor="text-filter" className="text-sm text-gray-600">
          Filter by text
        </label>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 bg-white hover:bg-gray-100"
        >
          <FaFilter className="text-black-500 text-xl" />
          {hasActiveFilters ? 'Edit filters' : 'Add filters'}
          {hasActiveFilters && (
            <span className="text-sm text-gray-600">
              ({Object.values(initialFilters).filter(Boolean).length})
            </span>
          )}
        </button>
      </div>

      <FilteringModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onSubmit}
        onClear={onClear}
        initialFilters={initialFilters}
      />
    </div>
  );
};

export default FilteringButton;
