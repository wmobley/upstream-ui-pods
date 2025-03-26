import { LatLngBounds, PM } from 'leaflet';
import { FeatureGroup } from 'react-leaflet';
import { GeomanControls } from 'react-leaflet-geoman-v2';

interface DrawLayerProps {
  onCreate: (e: PM.CreateEventHandler) => void;
  onChange: (e: PM.ChangeEventHandler) => void;
  bounds: LatLngBounds | null;
  setBounds: (bounds: LatLngBounds) => void;
}

const DrawLayer = ({
  onCreate,
  onChange,
  bounds,
  setBounds,
}: DrawLayerProps) => {
  return (
    <FeatureGroup>
      <GeomanControls
        onCreate={onCreate}
        onChange={onChange}
        options={{
          drawRectangle: bounds === null ? true : false,
          drawCircle: false,
          drawCircleMarker: false,
          drawMarker: false,
          drawPolyline: false,
          drawPolygon: false,
          drawText: false,
          cutPolygon: false,
          rotateMode: false,
          dragMode: false,
          editMode: false,
          removalMode: false,
        }}
      />
    </FeatureGroup>
  );
};

export default DrawLayer;
