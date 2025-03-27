import React, { useState, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import Modal from '../../../../../../common/Modal';
import { useList } from '../../../../../../../hooks/sensorVariables/useList';

interface FilteringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (variables: string[]) => void;
  onClear: () => void;
  sensorVariables: string[];
}

const ITEMS_PER_PAGE = 50;

const FilteringVariablesModal: React.FC<FilteringModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onClear,
  sensorVariables: selectedVariables,
}) => {
  const { variables, isLoading, error } = useList();
  const [localSelectedVariables, setLocalSelectedVariables] =
    useState<string[]>(selectedVariables);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredVariables = useMemo(() => {
    return variables.filter((variable) =>
      variable.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [variables, searchTerm]);

  const totalPages = Math.ceil(filteredVariables.length / ITEMS_PER_PAGE);
  const paginatedVariables = filteredVariables.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleCheckboxChange = (variable: string) => {
    setLocalSelectedVariables((prev) => {
      if (prev.includes(variable)) {
        return prev.filter((v) => v !== variable);
      }
      return [...prev, variable];
    });
  };

  const handleSubmit = () => {
    onSubmit(localSelectedVariables);
    onClose();
  };

  const handleCancel = () => {
    setLocalSelectedVariables(selectedVariables);
    onClear();
    onClose();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Variables"
      className="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search variables..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto border border-gray-200 rounded-md">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-red-500 text-center">
              Error loading variables. Please try again.
            </div>
          ) : (
            <>
              <div className="space-y-1">
                {paginatedVariables.map((variable) => (
                  <div
                    key={variable}
                    className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      id={variable}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-blue-500"
                      checked={localSelectedVariables.includes(variable)}
                      onChange={() => handleCheckboxChange(variable)}
                    />
                    <label
                      htmlFor={variable}
                      className="text-gray-700 cursor-pointer select-none"
                    >
                      {variable}
                    </label>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <span className="text-sm text-gray-600">
            {localSelectedVariables.length} variables selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={localSelectedVariables.length === 0}
              className="rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FilteringVariablesModal;
