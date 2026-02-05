import { Link } from 'react-router-dom';

const UnauthenticatedLanding: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-14 md:py-24">
        <section className="space-y-6">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            Campaign-scale data infrastructure
          </span>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">Upstream</h1>
          <h2 className="text-2xl font-semibold text-slate-800 sm:text-3xl">
            Campaign-scale data infrastructure for environmental sensing
          </h2>
          <p className="max-w-4xl text-base text-slate-700 sm:text-lg">
            Upstream helps research teams manage, explore, and publish high-resolution environmental sensor
            data—without building custom infrastructure for every campaign.
          </p>
          <p className="max-w-4xl text-base text-slate-700 sm:text-lg">
            Whether you’re running a mobile lab, deploying long-term monitoring stations, or experimenting with new
            sensor technologies, Upstream provides a reliable foundation for capturing observations, preserving
            context, and making data usable during—and long after—fieldwork.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign in with Tapis
            </Link>
            <a
              href="https://tapis.readthedocs.io/en/latest/technical/pythondev.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-semibold text-blue-700 transition hover:text-blue-900"
            >
              Learn about Tapis authentication →
            </a>
            <a
              href="https://pypi.org/project/upstream-sdk/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-semibold text-blue-700 transition hover:text-blue-900"
            >
              Explore the Upstream SDK (Python) →
            </a>
          </div>
        </section>

        <section className="rounded-3xl bg-white/80 p-8 shadow-md ring-1 ring-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Why Upstream exists</h2>
          <p className="mt-4 text-sm text-slate-700">
            Modern environmental sensors generate more data, faster, and in more diverse formats than traditional
            file-based workflows can support. Teams often spend more time finding, restructuring, and explaining data
            than analyzing it.
          </p>
          <p className="mt-4 text-sm text-slate-700">Upstream is designed for campaign-scale sensing, where:</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>Data arrives continuously from heterogeneous instruments.</li>
            <li>Multiple researchers need access at the same time.</li>
            <li>Context (where, when, how, and why data were collected) matters as much as the measurements.</li>
            <li>Reuse across deployments, seasons, and studies is essential.</li>
          </ul>
          <p className="mt-4 text-sm text-slate-700">
            Upstream keeps data accessible, interpretable, and ready for analysis, so infrastructure doesn’t become the
            bottleneck.
          </p>
        </section>

        <section className="rounded-3xl bg-white/80 p-8 shadow-md ring-1 ring-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">What you can do with Upstream</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>
              <span className="font-semibold text-slate-900">Organize sensing campaigns, not just files.</span> Group
              observations by campaign, deployment, station, and sensor so data stays meaningful across teams and over
              time.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Capture context as data arrives.</span> Bind measurements to
              time, location, instrument configuration, and campaign metadata at ingestion—when that information is
              easiest to get right.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Explore large datasets without moving everything.</span>{' '}
              Query subsets of data by time, space, sensor, or campaign to support early exploration, visualization,
              and analysis without bulk downloads.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Support collaborative research.</span> Enable multiple
              researchers to work with the same datasets concurrently, with clear access boundaries and shared context.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Expose clean access for people and tools.</span> Use the web
              interface for interactive exploration, or connect scripts, notebooks, and models through a consistent API
              and Python SDK.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Prepare data for reuse and publication.</span> Track
              provenance, versions, and releases so datasets can be discovered, cited, and reused with confidence.
            </li>
          </ul>
        </section>

        <section className="rounded-3xl bg-white/80 p-8 shadow-md ring-1 ring-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Work programmatically with the Upstream SDK</h2>
          <p className="mt-4 text-sm text-slate-700">
            Upstream includes a Python SDK for researchers who want to work directly from notebooks, scripts, and
            analysis pipelines.
          </p>
          <p className="mt-4 text-sm text-slate-700">With the SDK, you can:</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>Query subsets of campaign data by time, space, or sensor.</li>
            <li>Pull data directly into Jupyter, pandas, or modeling workflows.</li>
            <li>Automate ingestion, QA/QC, and derived product generation.</li>
            <li>Reproduce analyses without manual downloads or file wrangling.</li>
          </ul>
          <p className="mt-4 text-sm text-slate-700">
            The SDK uses the same governed access and semantics as the web interface, ensuring interactive exploration
            and automated workflows stay aligned.
          </p>
          <a
            href="https://pypi.org/project/upstream-sdk/"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center text-sm font-semibold text-blue-700 transition hover:text-blue-900"
          >
            Explore the Upstream SDK (Python) →
          </a>
        </section>

        <section className="rounded-3xl bg-white/80 p-8 shadow-md ring-1 ring-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Designed for real research workflows</h2>
          <p className="mt-4 text-sm text-slate-700">Upstream is built with input from active field campaigns and supports:</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>Mobile laboratories with high-frequency, spatially varying measurements.</li>
            <li>Long-running stationary sensors and observatories.</li>
            <li>Multi-instrument, multi-team collaborations.</li>
            <li>Iterative campaigns where instruments, methods, and questions evolve.</li>
          </ul>
        </section>

        <section className="rounded-3xl bg-white/80 p-8 shadow-md ring-1 ring-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Getting started</h2>
          <p className="mt-4 text-sm text-slate-700">
            Sign in using your Tapis credentials to explore existing campaigns or stand up your own sensing
            infrastructure.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign in with Tapis
            </Link>
            <a
              href="https://tapis.readthedocs.io/en/latest/technical/pythondev.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-semibold text-blue-700 transition hover:text-blue-900"
            >
              Learn about Tapis authentication →
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UnauthenticatedLanding;
