import React, { useState } from 'react';
import { FaMapMarkedAlt } from 'react-icons/fa';
import FilteringVariablesModal from '../FilteringVariablesModal/FilteringVariablesModal';

interface FilteringMapButtonProps {
  onSubmit: (variables: string[]) => void;
  onClear: () => void;
  sensorVariables: string[];
}

const FilteringVariablesButton: React.FC<FilteringMapButtonProps> = ({
  sensorVariables,
  onSubmit,
  onClear,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <div>
        <label htmlFor="map-filter" className="text-sm text-gray-600">
          Filter by variables
        </label>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 bg-white hover:bg-gray-100"
        >
          <FaMapMarkedAlt className="text-black-500 text-xl" />
          Select variables
          {sensorVariables.length > 0 ? (
            <span className="text-sm text-gray-600">
              ({sensorVariables.length})
            </span>
          ) : (
            ''
          )}
        </button>
      </div>

      <FilteringVariablesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onSubmit}
        onClear={onClear}
        sensorVariables={sensorVariables}
      />
    </div>
  );
};

export default FilteringVariablesButton;
