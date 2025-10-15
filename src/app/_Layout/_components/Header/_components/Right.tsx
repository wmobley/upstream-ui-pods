import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../../../contexts/AuthContext';

import { FaUser } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import { FaRegUserCircle } from 'react-icons/fa';

interface RightProps {
  toggleMenu: () => void;
}

const Right: React.FC<RightProps> = ({ toggleMenu }) => {
  const history = useHistory();
  const { isAuthenticated, isTapisAuth, username, logout } = useAuth();

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <div className="sm:flex sm:gap-4">
          <div className="flex items-center gap-4 text-primary-600">
            {isTapisAuth ? (
              // Tapis authentication - show username, no logout (managed by Tapis)
              <div className="px-5 py-2.5 text-sm font-medium text-white flex items-center">
                <FaUser className="text-gray-100 text-lg mr-3" />
                <span>{username || 'User'}</span>
              </div>
            ) : (
              // JWT authentication - show logout button
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/login';
                }}
                className="px-5 py-2.5 text-sm font-medium text-white transition header-button flex items-center"
              >
                <FaUser className="text-gray-100 text-lg mr-3" />
                <span>Logout</span>
              </button>
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

      {false &&
      <button
        className="block rounded bg-secondary-100 p-2.5 text-secondary-600 transition hover:text-secondary-600/75 md:hidden"
        onClick={toggleMenu}
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
      }
    </div>
  );
};

export default Right;
