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
            src="https://placehold.co/600x400"
            effect="opacity"
          />
        </div>
      </section>
    </div>
  );
};

export default cta;
