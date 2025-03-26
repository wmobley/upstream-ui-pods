import React, { useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { LatLngBounds, LatLngTuple, PM } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Modal from '../../../common/Modal';
import { GeomanControls } from 'react-leaflet-geoman-v2';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

interface FilteringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBoundingBoxSelect: (bounds: LatLngBounds) => void;
}

const FilteringMapModal: React.FC<FilteringModalProps> = ({
  isOpen,
  onClose,
  onBoundingBoxSelect,
}) => {
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  // Default center position and zoom level Austin, TX
  const center: LatLngTuple = [30.2672, -97.7431];
  const zoom = 13;

  interface CreateEventHandler {
    shape: PM.SUPPORTED_SHAPES;
    layer: L.Layer;
  }

  const handleCreate = ({ shape, layer }: CreateEventHandler) => {
    if (shape === 'Rectangle') {
      const bounds = layer.getBounds();
      setBounds(bounds);
    }
  };

  const handleApply = () => {
    if (bounds) {
      onBoundingBoxSelect(bounds);
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
          <FeatureGroup>
            <GeomanControls
              onCreate={handleCreate}
              options={{
                drawRectangle: true,
                drawCircle: false,
                drawCircleMarker: false,
                drawMarker: false,
                drawPolyline: false,
                drawPolygon: false,
                drawText: false,
                cutPolygon: false,
                removalMode: false,
                rotateMode: false,
                editMode: false,
                dragMode: false,
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </div>

      <div className="mt-2 text-sm text-gray-600">
        Use the drawing tools to create or edit the bounding box
      </div>

      {bounds && (
        <div className="mt-2 text-sm text-gray-600">
          Bounds: {bounds.toBBoxString()}
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onClose}
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
