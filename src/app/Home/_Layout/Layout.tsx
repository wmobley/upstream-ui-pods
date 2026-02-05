import CampaignList from '../_components/CampaignList/CampaignList';
import UnauthenticatedLanding from '../_components/UnauthenticatedLanding';
import { useAuth } from '../../../contexts/AuthContextState';
import { Loading } from '../../common/Loading';

const Layout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <UnauthenticatedLanding />;
  }

  return <CampaignList />;
};

export default Layout;
