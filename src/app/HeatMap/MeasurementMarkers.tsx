import { LatLngExpression } from 'leaflet';
import MeasurementMarker from './MeasurementMarker';
import { getIntervalByValue } from './helpers';
import { Interval, MeasurementPoint } from '../../hooks/campaign/useDetail';
import { HeatMapDataPoint } from './types';

interface MeasurementMarkersProps {
  coords: LatLngExpression[];
  measurements: MeasurementPoint[];
  intervals: Interval[];
  selectedPoint: HeatMapDataPoint | null;
  setSelectedPoint: (point: HeatMapDataPoint | null) => void;
}

const MeasurementMarkers = ({
  coords,
  measurements,
  intervals,
  selectedPoint,
  setSelectedPoint,
}: MeasurementMarkersProps) => {
  return (
    <>
      {coords.map((coord, index) => {
        const value = measurements[index].measurementvalue;
        return (
          <MeasurementMarker
            key={index}
            coord={coord as LatLngExpression}
            value={value}
            intervals={intervals}
            isSelected={selectedPoint?.position === coord}
            onMarkerClick={() => {
              const interval = getIntervalByValue(value, intervals);
              setSelectedPoint({
                value,
                percentile: interval?.minPercentile || 0,
                position: coord as LatLngExpression,
              });
            }}
          />
        );
      })}
    </>
  );
};

export default MeasurementMarkers;
