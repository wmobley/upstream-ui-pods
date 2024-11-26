import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useDetail } from './hooks/campaign/useDetail';

export default function App() {
  const { coordinates } = useDetail();

  return (
    <div className="h-screen w-full">
      <MapContainer center={[29, -93]} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline
          positions={coordinates}
          pathOptions={{ color: 'blue', weight: 3 }}
        />
      </MapContainer>
    </div>
  );
}
