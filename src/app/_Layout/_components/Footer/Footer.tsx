const Footer = () => {
  return (
    <footer className="">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-center text-primary-600"></div>
        <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-secondary-500">
          Actify es una plataforma que te permite encontrar y reservar
          actividades de ocio para que seas más feliz. 😁
          <br />
          De <span className="text-primary-600">
            &quot;deportistas&quot;
          </span>{' '}
          para <span className="text-primary-600">deportistas</span>{' '}
          <span className="text-primary-600">❤️</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
