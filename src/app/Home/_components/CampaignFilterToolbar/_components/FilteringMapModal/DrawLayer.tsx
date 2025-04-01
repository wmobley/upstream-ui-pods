import { LatLngBounds, PM } from 'leaflet';
import { FeatureGroup } from 'react-leaflet';
import { GeomanControls } from 'react-leaflet-geoman-v2';

interface DrawLayerProps {
  onCreate: (e: PM.CreateEventHandler) => void;
  onChange: (e: PM.ChangeEventHandler) => void;
  bounds: LatLngBounds | null;
}

const DrawLayer = ({ onCreate, onChange, bounds }: DrawLayerProps) => {
  return (
    <FeatureGroup>
      <GeomanControls
        // @ts-expect-error
        onCreate={(e) => onCreate(e)}
        // @ts-expect-error
        onChange={(e) => onChange(e)}
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
