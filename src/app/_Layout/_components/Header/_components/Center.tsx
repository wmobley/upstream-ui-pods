import { Link } from 'react-router-dom';
import ProjectDropdown from './ProjectDropdown';
import { useInstance } from '../../../../../contexts/InstanceContext';

const DEFAULT_API_DOCS_URL = 'https://upstreamapi.pods.portals.tapis.io/docs';

const staticLinks = [
  {
    label: 'Python SDK',
    href: 'https://pypi.org/project/upstream-sdk/',
  },
  {
    label: 'CKAN',
    href: 'https://ckan.tacc.utexas.edu',
  },
];

const Center = () => {
  const { selectedInstance } = useInstance();
  const apiDocsUrl = selectedInstance
    ? `${selectedInstance.apiUrl}/docs`
    : DEFAULT_API_DOCS_URL;

  return (
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
          {staticLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-secondary-500 transition hover:text-secondary-500/75"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={apiDocsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-secondary-500 transition hover:text-secondary-500/75"
            >
              API docs
            </a>
          </li>
        </ul>
      </nav>
      <div className="hidden md:flex items-center">
        <ProjectDropdown />
      </div>
    </div>
  );
};

export default Center;
