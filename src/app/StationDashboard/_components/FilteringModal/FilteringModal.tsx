import React, { useState } from 'react';
import Modal from '../../../common/Modal';

interface FilteringModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const FilteringModal: React.FC<FilteringModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onClear,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleSubmit = () => {
    onSubmit(filters);
    onClose();
  };

  const handleCancel = () => {
    setFilters(initialFilters);
    onClose();
  };

  const handleClear = () => {
    setFilters({});
    onClear();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Sensors"
      className="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="unit"
              className="block text-sm font-medium text-gray-700"
            >
              Unit
            </label>
            <input
              type="text"
              id="unit"
              value={filters.unit || ''}
              onChange={(e) => setFilters({ ...filters, unit: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Filter by unit..."
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              value={filters.description || ''}
              onChange={(e) =>
                setFilters({ ...filters, description: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Filter by description..."
            />
          </div>

          <div>
            <label
              htmlFor="alias"
              className="block text-sm font-medium text-gray-700"
            >
              Alias
            </label>
            <input
              type="text"
              id="alias"
              value={filters.alias || ''}
              onChange={(e) =>
                setFilters({ ...filters, alias: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Filter by alias..."
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <button
            onClick={handleClear}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear all filters
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FilteringModal;
