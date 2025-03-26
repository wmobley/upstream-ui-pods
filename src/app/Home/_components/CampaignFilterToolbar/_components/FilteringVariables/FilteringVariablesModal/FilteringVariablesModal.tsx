import React, { useState } from 'react';
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
    setLocalSelectedVariables(selectedVariables); // Reset to original selection
    onClear();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Variables"
      className="max-w-2xl"
    >
      <div className="space-y-2">
        {variables.map((variable) => (
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
        <div className="flex justify-end gap-2">
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
    </Modal>
  );
};

export default FilteringVariablesModal;
