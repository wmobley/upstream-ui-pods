import Right from './_components/Right';
import Left from './_components/Left';
import Center from './_components/Center';

interface HeaderProps {
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  return (
    <header className="bg-black">
      <div className="branding">
        <a href="https://www.tacc.utexas.edu/" target="_blank" aria-label="Opens in new window.">
          <img src="/tacc-white.png" alt="TACC Logo">
          </img>
        </a>
        <span className="separator"></span>
        <a href="https://www.utexas.edu/" target="_blank" aria-label="Opens in new window.">
          <img src="/utaustin-white.png" alt="University of Texas at Austin Logo">
          </img>
        </a>
      </div>

      <div className="mx-auto flex h-16 items-center gap-8 px-4 sm:px-6 lg:px-8 h50">
        <Left />
        <Center />
        <Right toggleMenu={toggleMenu} />
      </div>
    </header>
  );
};

export default Header;
