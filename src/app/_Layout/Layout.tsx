import React, { useState } from 'react';
import Header from './_components/Header/Header';
import Footer from './_components/Footer/Footer';
import Router from '../_Router/_Router';
import ToggleMenu from './_components/Header/_components/ToggleMenu';

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <div className="w-full flex flex-col min-h-screen">
        <Header toggleMenu={toggleMenu} />
        <main>
          {isMenuOpen && <ToggleMenu setIsMenuOpen={setIsMenuOpen} />}
          {!isMenuOpen && <Router />}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
