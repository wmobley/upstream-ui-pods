import { CircleMarker, Marker, Tooltip } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Interval } from '../../hooks/campaign/useDetail';
import { getColorByValue } from './helpers';

interface MapMarkerProps {
  coord: LatLngExpression;
  value: number;
  intervals: Interval[];
  isSelected: boolean;
  onMarkerClick: () => void;
}

export default function MeasurementMarker({
  coord,
  value,
  intervals,
  isSelected,
  onMarkerClick,
}: MapMarkerProps) {
  return (
    <>
      <CircleMarker
        center={coord}
        radius={6}
        pathOptions={{
          color: getColorByValue(value, intervals),
          fillOpacity: 1,
          weight: 1,
        }}
        eventHandlers={{
          click: onMarkerClick,
        }}
      />
      {isSelected && (
        <Marker position={coord}>
          <Tooltip direction="bottom" offset={[0, 20]} opacity={1} permanent>
            Value: {value.toFixed(2)}
          </Tooltip>
        </Marker>
      )}
    </>
  );
}
