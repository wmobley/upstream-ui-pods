import { GetStationResponse } from '@upstream/upstream-api';
import GeometryMap from '../../common/GeometryMap/GeometryMap';
import { hasValidGeometry } from '../../../utils/geometryValidation';
import { useStationNoteLocations } from '../../../hooks/notes/useNotes';

interface StatsSectionProps {
  station: GetStationResponse;
  campaignId: number;
  stationId: number;
}

const StatsSection = ({ station, campaignId, stationId }: StatsSectionProps) => {
  const { data: noteLocationsData } = useStationNoteLocations(campaignId, stationId);

  const markers = (noteLocationsData?.items ?? [])
    .filter((note) => note.location)
    .map((note) => ({
      position: note.location as GeoJSON.Point,
      color: '#ea580c',
      label: note.content,
    }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Station Coverage</h2>
      <div className="h-3/4 w-full">
        {hasValidGeometry(station) ? (
          <GeometryMap geoJSON={station.geometry as GeoJSON.Geometry} markers={markers} />
        ) : (
          <div className='text-gray-600 flex justify-center items-center text-lg h-[280px]'>Geometry not available</div>
        )}
      </div>
    </div>
  );
};

export default StatsSection;
