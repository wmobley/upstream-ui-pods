import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../../../contexts/AuthContextState';

import { FaChevronDown, FaUser, FaUserCircle, FaRegUserCircle } from 'react-icons/fa';

interface RightProps {
  toggleMenu: () => void;
}

const Right: React.FC<RightProps> = ({ toggleMenu }) => {
  const history = useHistory();
  const { isAuthenticated, username, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const displayName = username || 'User';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    window.location.href = '/login';
  };

  const handleAdminNavigation = () => {
    setIsMenuOpen(false);
    history.push('/admin');
  };
  const handleCampaignNavigation = () => {
    setIsMenuOpen(false);
    history.push('/');
  };

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <div className="sm:flex sm:gap-4">
          <div className="relative flex items-center gap-4 text-primary-600" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="px-5 py-2.5 text-sm font-medium text-white transition header-button flex items-center gap-2"
            >
              <FaUser className="text-gray-100 text-lg" />
              <span className="text-left">{displayName}</span>
              <FaChevronDown
                className={`text-gray-100 text-xs transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 z-20">
                <button
                  onClick={handleCampaignNavigation}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Campaigns
                </button>
                <button
                  onClick={handleAdminNavigation}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Admin
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="sm:flex sm:gap-4">
          <button
            className="px-3 py-2.5 text-sm font-medium text-white transition header-button flex items-center"
            onClick={() => {
              history.push('/login');
            }}
          >
            <FaUserCircle className="text-gray-100 text-lg mr-3" />
            Log in
          </button>

          <a
            className="px-3 py-2.5 text-sm font-medium text-white transition header-button md:flex items-center hidden"
            href="https://accounts.tacc.utexas.edu/register"
          >
            <FaRegUserCircle className="text-gray-100 text-lg mr-3" />
            Sign up
          </a>
        </div>
      )}

      <button
        className="block rounded bg-secondary-100 p-2.5 text-secondary-600 transition hover:text-secondary-600/75 md:hidden"
        onClick={toggleMenu}
        type="button"
        aria-label="Toggle menu"
      >
        <span className="sr-only">Toggle menu</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default Right;
