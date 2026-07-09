import 'leaflet/dist/leaflet.css';
import Layout from './app/_Layout/Layout';
import { AuthProvider } from './providers/AuthProvider';
import { InstanceProvider } from './contexts/InstanceContext';
import DevTapisAuthHelper from './components/DevTapisAuthHelper';

export default function App() {
  return (
    <AuthProvider>
      <InstanceProvider>
        <Layout />
        <DevTapisAuthHelper />
      </InstanceProvider>
    </AuthProvider>
  );
}
