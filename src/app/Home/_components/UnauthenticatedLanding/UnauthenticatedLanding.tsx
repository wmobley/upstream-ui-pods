import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaCodeBranch,
  FaDatabase,
  FaExternalLinkAlt,
  FaMapMarkedAlt,
  FaPython,
  FaSatelliteDish,
  FaSearchLocation,
  FaServer,
  FaUsers,
} from 'react-icons/fa';

const capabilities = [
  {
    title: 'Coordinate mixed deployments',
    body: 'Fixed stations, mobile platforms, temporary sensors, and field teams stay tied to one campaign structure.',
    icon: FaSatelliteDish,
  },
  {
    title: 'Keep context attached',
    body: 'Time, location, instrument, variable, notes, and deployment details remain connected to each observation.',
    icon: FaMapMarkedAlt,
  },
  {
    title: 'Discover across the campaign',
    body: 'Researchers can search by variable, date range, map area, station, or sensor instead of chasing files.',
    icon: FaSearchLocation,
  },
  {
    title: 'Move from fieldwork to reuse',
    body: 'The same campaign model supports exploration, Python workflows, HPC analysis, and CKAN publication.',
    icon: FaDatabase,
  },
];

const coordinationSteps = [
  {
    title: 'Teams, instruments, platforms',
    body: 'Field crews, stationary stations, mobile labs, and experimental sensors collect observations at campaign tempo.',
    icon: FaUsers,
  },
  {
    title: 'Shared campaign context',
    body: 'Upstream binds observations to time, place, sensor metadata, deployment notes, and access boundaries.',
    icon: FaMapMarkedAlt,
  },
  {
    title: 'Explore, compute, publish',
    body: 'Researchers move from the web explorer to Python, HPC workflows, and CKAN publication without losing context.',
    icon: FaServer,
  },
];

const resourceLinks = [
  {
    label: 'Python SDK',
    href: 'https://pypi.org/project/upstream-sdk/',
    description: 'Query campaign data from notebooks, scripts, and analysis pipelines.',
    icon: FaPython,
  },
  {
    label: 'API documentation',
    href: 'https://upstreamapi.pods.portals.tapis.io/docs',
    description: 'Use the same governed campaign, station, sensor, and measurement APIs as the UI.',
    icon: FaCodeBranch,
  },
  {
    label: 'CKAN publication',
    href: 'https://ckan.tacc.utexas.edu',
    description: 'Publish curated campaign outputs into the TACC data catalog for discovery and reuse.',
    icon: FaDatabase,
  },
];

const UnauthenticatedLanding: React.FC = () => {
  return (
    <div className="bg-tacc-neutral-x-light text-tacc-neutral-xx-dark">
      <section className="relative overflow-hidden bg-tacc-accent-xx-dark text-white">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute left-0 top-12 h-px w-full bg-tacc-accent-x-light" />
          <div className="absolute left-0 top-44 h-px w-full bg-white" />
          <div className="absolute bottom-20 left-0 h-px w-full bg-tacc-tertiary-light" />
          <div className="absolute left-10 top-0 h-full w-px bg-white" />
          <div className="absolute right-16 top-0 h-full w-px bg-tacc-accent-x-light" />
          <div className="absolute left-1/2 top-0 hidden h-full w-px bg-white lg:block" />
        </div>

        <div className="absolute right-6 top-12 hidden w-[34rem] max-w-[42vw] lg:block">
          <div className="grid grid-cols-3 gap-3 text-xs text-white/80">
            {['Station 04', 'Mobile lab', 'Tower array', 'VOC sensor', 'Weather mast', 'QA note'].map((label) => (
              <div key={label} className="border border-white/20 bg-white/5 p-3">
                <span className="block h-2 w-10 bg-tacc-secondary-light" />
                <span className="mt-4 block">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-44 border border-white/20 bg-white/5 p-4">
            <div className="flex h-full items-end gap-2">
              {[38, 66, 42, 80, 55, 72, 48, 88, 60, 76, 52, 70].map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  className="flex-1 bg-tacc-tertiary-light/80"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-screen-xl px-6 py-16 md:px-8 md:py-20 lg:py-24">
          <div className="max-w-2xl lg:max-w-[37rem]">
            <p className="text-sm font-semibold uppercase text-tacc-accent-xx-light">
              Upstream for Intensive Observation Periods
            </p>
            <h1 className="mt-5 text-4xl font-bold text-white sm:text-5xl">
              One campaign. Many instruments. Connected observations.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-tacc-accent-xxx-light sm:text-lg">
              Upstream brings stationary sensors, mobile platforms, field teams, and observations
              into a shared campaign context—making research data easier to coordinate and discover
              across time, space, and instruments.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-tacc-secondary-light px-6 py-3 text-base font-semibold text-tacc-accent-xxx-dark transition hover:bg-tacc-secondary-x-light focus:outline-none focus:ring-2 focus:ring-tacc-accent-x-light"
              >
                Sign in with Tapis
                <FaArrowRight aria-hidden="true" />
              </Link>
              <a
                href="#iop-coordination"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-tacc-accent-x-light/40 px-6 py-3 text-base font-semibold text-white transition hover:border-tacc-secondary-light hover:text-tacc-secondary-light focus:outline-none focus:ring-2 focus:ring-tacc-accent-x-light"
              >
                See how IOP coordination works
              </a>
            </div>
          </div>

          <div className="mt-12 grid gap-3 text-sm text-tacc-accent-xx-light sm:grid-cols-2 lg:grid-cols-4">
            {[
              'Coordinate across teams',
              'Connect data in time & space',
              'Discover across instruments',
              'Preserve campaign context',
            ].map((label) => (
              <div key={label} className="border-l-2 border-tacc-secondary-light pl-4">
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="iop-coordination" className="bg-white px-6 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-screen-xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-tacc-accent-normal">Campaign coordination</p>
            <h2 className="mt-3 text-3xl font-bold text-tacc-neutral-xx-dark md:text-4xl">
              Turn a field campaign into shared research context.
            </h2>
            <p className="mt-4 text-base leading-7 text-tacc-neutral-dark">
              Intensive Observation Periods compress many instruments, teams, and decisions into a short window.
              Upstream keeps the operational context attached to the observations so the campaign can be explored,
              analyzed, and published after fieldwork ends.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
            {coordinationSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.title} className="contents">
                  <article className="border border-tacc-neutral-light bg-tacc-neutral-x-light p-5">
                    <Icon className="text-2xl text-tacc-accent-light" aria-hidden="true" />
                    <h3 className="mt-5 text-lg font-semibold text-tacc-neutral-xx-dark">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-tacc-neutral-dark">{step.body}</p>
                  </article>
                  {index < coordinationSteps.length - 1 && (
                    <div className="hidden items-center justify-center px-1 text-tacc-accent-light lg:flex">
                      <FaArrowRight aria-hidden="true" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-tacc-accent-xxx-light px-6 py-14 md:px-8">
        <div className="mx-auto grid max-w-screen-xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <h2 className="text-3xl font-bold text-tacc-accent-xxx-dark md:text-4xl">
            Find the observation, not the file.
          </h2>
          <div className="space-y-4 text-base leading-7 text-tacc-accent-x-dark">
            <p>
              File names and folder structures rarely capture what field teams need to know later. Upstream makes
              observations discoverable through campaign, sensor, variable, time window, and location.
            </p>
            <p>
              That structure lets researchers move from questions to usable subsets of data without rebuilding
              context for every analysis.
            </p>
          </div>
        </div>
      </section>

      <section id="iop-capabilities" className="bg-white px-6 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-screen-xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-tacc-accent-normal">IOP capabilities</p>
            <h2 className="mt-3 text-3xl font-bold text-tacc-neutral-xx-dark md:text-4xl">
              A shared operating layer for intensive field campaigns.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability) => {
              const Icon = capability.icon;

              return (
                <article key={capability.title} className="border border-tacc-neutral-light bg-white p-5 shadow-sm">
                  <Icon className="text-2xl text-tacc-tertiary-dark" aria-hidden="true" />
                  <h3 className="mt-5 text-lg font-semibold text-tacc-neutral-xx-dark">{capability.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-tacc-neutral-dark">{capability.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="developer-resources" className="bg-white px-6 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-screen-xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-tacc-accent-normal">Developer resources</p>
            <h2 className="mt-3 text-3xl font-bold text-tacc-neutral-xx-dark md:text-4xl">
              Use the same campaign model from the UI, scripts, and publications.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {resourceLinks.map((resource) => {
              const Icon = resource.icon;

              return (
                <a
                  key={resource.label}
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group border border-tacc-neutral-light bg-white p-5 shadow-sm transition hover:border-tacc-accent-light hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-4">
                    <Icon className="text-2xl text-tacc-accent-light" aria-hidden="true" />
                    <FaExternalLinkAlt
                      className="text-sm text-tacc-neutral-normal transition group-hover:text-tacc-accent-light"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-tacc-neutral-xx-dark">{resource.label}</h3>
                  <p className="mt-3 text-sm leading-6 text-tacc-neutral-dark">{resource.description}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-tacc-neutral-xx-dark px-6 py-12 text-white md:px-8">
        <div className="mx-auto grid max-w-screen-xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-tacc-secondary-light">TACC Decision Support Office</p>
          </div>
          <div className="flex items-center gap-5">
            <img className="h-7 w-auto" src="/tacc-white.png" alt="TACC" />
            <span className="h-8 w-px bg-white/40" />
            <img className="h-7 w-auto" src="/utaustin-white.png" alt="The University of Texas at Austin" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default UnauthenticatedLanding;
