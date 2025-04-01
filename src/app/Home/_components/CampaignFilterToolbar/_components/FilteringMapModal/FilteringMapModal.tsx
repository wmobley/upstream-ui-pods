import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngBounds, LatLngTuple, PM } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Modal from '../../../../../common/Modal';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import DrawLayer from './DrawLayer';

interface FilteringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBoundingBoxSelect: (bounds: LatLngBounds | null) => void;
}

const FilteringMapModal: React.FC<FilteringModalProps> = ({
  isOpen,
  onClose,
  onBoundingBoxSelect,
}) => {
  // Default center position and zoom level Austin, TX
  const center: LatLngTuple = [30.2672, -97.7431];
  const zoom = 13;
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

  const handleCreate = (e: PM.CreateEventHandler) => {
    // @ts-expect-error
    if (e.shape === 'Rectangle') {
      // @ts-expect-error
      const bounds = e.layer.getBounds();
      setBounds(bounds);
    }
  };

  const handleChange = (e: PM.ChangeEventHandler) => {
    console.log(e);
  };

  const handleApply = () => {
    if (bounds) {
      onBoundingBoxSelect(bounds);
      setBounds(null);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Area"
      className="max-w-2xl"
    >
      <div className="relative h-[500px] w-full">
        <MapContainer center={center} zoom={zoom} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DrawLayer
            onCreate={handleCreate}
            onChange={handleChange}
            bounds={bounds}
          />
        </MapContainer>
      </div>

      <div className="mt-2 text-sm text-gray-600">
        Use the drawing tools to create or edit the bounding box
      </div>

      <div className="mt-2 text-sm text-gray-600">
        {bounds ? (
          <p>
            North West: {bounds.getNorthWest().lat}, {bounds.getNorthWest().lng}
            <br />
            South East: {bounds.getSouthEast().lat}, {bounds.getSouthEast().lng}
          </p>
        ) : (
          <p>No bounds selected</p>
        )}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => {
            onBoundingBoxSelect(null);
            onClose();
          }}
          className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          disabled={!bounds}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300"
        >
          Apply
        </button>
      </div>
    </Modal>
  );
};

export default FilteringMapModal;
