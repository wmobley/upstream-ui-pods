import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import ProjectDropdown from './ProjectDropdown';
import { useInstance } from '../../../../../contexts/InstanceContext';

const DEFAULT_API_DOCS_URL = 'https://upstreamapi.pods.portals.tapis.io/docs';

const staticDocumentationLinks = [
  {
    label: 'Documentation',
    href: '/docs/',
  },
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
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(false);
  const documentationMenuRef = useRef<HTMLLIElement | null>(null);
  const apiDocsUrl = selectedInstance
    ? `${selectedInstance.apiUrl}/docs`
    : DEFAULT_API_DOCS_URL;
  const documentationLinks = [
    ...staticDocumentationLinks,
    {
      label: 'API docs',
      href: apiDocsUrl,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        documentationMenuRef.current &&
        !documentationMenuRef.current.contains(event.target as Node)
      ) {
        setIsDocumentationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          <li className="relative" ref={documentationMenuRef}>
            <button
              type="button"
              className="flex items-center gap-1 text-secondary-500 transition hover:text-secondary-500/75"
              aria-expanded={isDocumentationOpen}
              aria-haspopup="menu"
              onClick={() => setIsDocumentationOpen((prev) => !prev)}
            >
              Documentation
              <FaChevronDown
                className={`text-xs transition-transform ${
                  isDocumentationOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isDocumentationOpen && (
              <div
                className="absolute left-0 top-full z-20 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5"
                role="menu"
              >
                {documentationLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setIsDocumentationOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
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
