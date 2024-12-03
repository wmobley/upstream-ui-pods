import TypingEffect from '../TypingEffect/TypingEffect';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css'; // optional fade effect
import { Link } from 'react-router-dom';

const cta = () => {
  return (
    <div className="mx-auto max-w-screen-xl px-4 lg:px-8 min-h-screen">
      <section className="sm:grid sm:grid-cols-2 sm:items-center ">
        <div className=" p-8 md:p-12 lg:px-16 lg:py-24 lg:h-full flex items-center">
          <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
            <TypingEffect
              fixedText="Encuentra compañeros y lugares para"
              textPool={['  jugar tenis', '  aprender a bucear', '  bailar']}
              speed={50}
            />

            <p className=" text-black-500 text-lg mt-4 md:mt-8 lg:mt-12">
              Conectamos entusiastas con lugares donde desarrollar sus
              actividades, derribando las barreras que inhiben la entretención.
            </p>

            <div className="mt-4 md:mt-8 lg:mt-12">
              <a
                href="#category-list"
                className="inline-block rounded bg-primary-600 px-12 py-3 text-lg font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring focus:ring-yellow-400"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById('category-list')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Buscar actividades
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <LazyLoadImage
            alt="Actividades deportivas"
            src="https://dev1a696-dev.s3.us-west-1.amazonaws.com/public/gbm/main/gbm-main.jpeg"
            effect="opacity"
            placeholderSrc="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwPENBLzMzLy0zPVBCR0JHMy1LVEVZWVlQXF5fOERnaWZaZ11ZXF7/2wBDARUXFx4aHR4eHF7LJSUly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8v/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=" // optional - base64 encoded placeholder
          />
          <span className="text-center text-sm text-gray-500">
            Fotografía corresponde a{' '}
            <Link to="/gbm" className="text-primary-600 underline">
              Academia GBM
            </Link>{' '}
          </span>
        </div>
      </section>
    </div>
  );
};

export default cta;
