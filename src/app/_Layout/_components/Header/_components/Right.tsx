import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../../../contexts/AuthContext';

interface RightProps {
  toggleMenu: () => void;
}

const Right: React.FC<RightProps> = ({ toggleMenu }) => {
  const history = useHistory();
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <div className="sm:flex sm:gap-4">
          <div className="flex items-center gap-4 text-primary-600">
            <button
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              className="hidden px-5 py-2.5 text-sm font-medium text-white transition sm:block header-button"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="sm:flex sm:gap-4">
          <button
            className="block px-5 py-2.5 text-sm font-medium text-white transition header-button"
            onClick={() => {
              history.push('/login');
            }}
          >
            Log in
          </button>

          <a
            className="hidden  px-5 py-2.5 text-sm font-medium text-white transition sm:block header-button"
            href="https://accounts.tacc.utexas.edu/register"
          >
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
