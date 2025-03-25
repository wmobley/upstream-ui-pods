import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { LatLngBounds, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import Modal from '../../../common/Modal';

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
  const [featureGroup, setFeatureGroup] = useState<typeof FeatureGroup | null>(
    null,
  );
  //use ref to get the feature group
  const featureGroupRef = useRef<typeof FeatureGroup>(null);

  useEffect(() => {
    if (featureGroupRef.current) {
      setFeatureGroup(featureGroupRef.current);
    }
  }, [featureGroupRef]);

  // Default center position and zoom level Austin, TX
  const center: LatLngTuple = [30.2672, -97.7431];
  const zoom = 13;

  const handleCreated = (e: any) => {
    const layer = e.layer;
    if (layer) {
      setBounds(layer.getBounds());
    }
  };

  const handleEdited = (e: any) => {
    const layers = e.layers;
    layers.eachLayer((layer: any) => {
      setBounds(layer.getBounds());
    });
  };

  const handleDeleted = () => {
    setBounds(null);
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
          <FeatureGroup
            ref={(featureGroupRef) => {
              setFeatureGroup(featureGroupRef);
            }}
          >
            <EditControl
              position="topright"
              onCreated={handleCreated}
              onEdited={handleEdited}
              onDeleted={handleDeleted}
              draw={{
                rectangle: true,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
                polygon: false,
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </div>

      <div className="mt-2 text-sm text-gray-600">
        Use the drawing tools to create or edit the bounding box
      </div>

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
