import { Link } from 'react-router-dom';

interface RightProps {
  toggleMenu: () => void;
}

const Right: React.FC<RightProps> = ({ toggleMenu }) => {
  const authStatus: string = 'unauthenticated';
  const signOut = () => {};
  return (
    <div className="flex items-center gap-4">
      {authStatus === 'authenticated' ? (
        <div className="sm:flex sm:gap-4">
          <div className="flex items-center gap-4 text-primary-600">
            <a
              href="/reservations"
              className="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              Mis reservas
            </a>
            <button
              onClick={() => signOut()}
              className="hidden rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75 sm:block"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      ) : (
        <div className="sm:flex sm:gap-4">
          <Link
            className="block rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700"
            to="/login"
          >
            Iniciar sesión
          </Link>

          <Link
            className="hidden rounded-md bg-secondary-100 px-5 py-2.5 text-sm font-medium text-primary-600 transition hover:text-primary-600/75 sm:block"
            to="/signup"
          >
            Registrarse
          </Link>
        </div>
      )}

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
    </div>
  );
};

export default Right;
