import TypingEffect from '../TypingEffect/TypingEffect';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css'; // optional fade effect

const cta = () => {
  return (
    <div className="mx-auto max-w-screen-xl px-4 lg:px-8 ">
      <section className="sm:grid sm:grid-cols-2 sm:items-center ">
        <div className=" p-8 md:p-12 lg:px-16 lg:py-24 lg:h-full flex items-center">
          <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
            <TypingEffect
              fixedText=""
              textPool={[
                '  Explore campaigns',
                '  Find VOC trends',
                '  Get data insights',
              ]}
              speed={50}
            />

            <p className=" text-black-500 text-lg mt-4 md:mt-8 lg:mt-12">
              Start by selecting a campaign or searching for specific data to
              dive deeper into air quality analysis. Let’s make every data point
              count! 🌍✨
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
                Start
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <LazyLoadImage
            alt="Campaigns"
            src="https://images.unsplash.com/photo-1464582883107-8adf2dca8a9f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            effect="opacity"
            placeholderSrc="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwPENBLzMzLy0zPVBCR0JHMy1LVEVZWVlQXF5fOERnaWZaZ11ZXF7/2wBDARUXFx4aHR4eHF7LJSUly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8v/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=" // optional - base64 encoded placeholder
          />
        </div>
      </section>
    </div>
  );
};

export default cta;
