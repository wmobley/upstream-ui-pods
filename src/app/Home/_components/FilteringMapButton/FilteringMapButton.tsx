import React, { useState } from 'react';
import { LatLngBounds } from 'leaflet';
import FilteringMapModal from '../FilteringMapModal/FilteringMapModal';
import { FaMapMarkedAlt } from 'react-icons/fa';

interface FilteringMapButtonProps {
  onBoundingBoxSelect: (bounds: LatLngBounds) => void;
}

const FilteringMapButton: React.FC<FilteringMapButtonProps> = ({
  onBoundingBoxSelect,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="map-filter" className="text-sm text-gray-600">
        Filter by area
      </label>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 bg-white hover:bg-gray-100"
      >
        <FaMapMarkedAlt className="text-black-500 text-xl" />
        Select
      </button>

      <FilteringMapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBoundingBoxSelect={onBoundingBoxSelect}
      />
    </div>
  );
};

export default FilteringMapButton;
