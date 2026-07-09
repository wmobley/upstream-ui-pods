import { Link } from 'react-router-dom';
import ProjectDropdown from './ProjectDropdown';

const Center = () => (
  <div className="flex flex-1 items-center justify-end md:justify-between">
    <nav aria-label="Global" className="hidden md:block">
      <ul className="flex items-center gap-6 text-sm">
        <li>
          <Link
            className="text-secondary-500 transition hover:text-secondary-500/75"
            to="/"
          >
            Campaigns
          </Link>
        </li>
      </ul>
    </nav>
    <div className="hidden md:flex items-center">
      <ProjectDropdown />
    </div>
  </div>
);

export default Center;
