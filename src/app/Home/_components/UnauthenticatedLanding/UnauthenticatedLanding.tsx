import { Link } from 'react-router-dom';

const UnauthenticatedLanding: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-14 md:py-24">
        <section className="space-y-6">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            Upstream Environmental Sensor Database
          </span>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Manage your sensors, workflows, and data products in a unified, reproducible ecosystem.
          </h1>
          <p className="max-w-4xl text-base text-slate-700 sm:text-lg">
            Upstream lets any research group, field team, or instrument developer stand up a fully-functioning data
            infrastructure without building everything from scratch. Whether you’re running a mobile lab like SNIFFER,
            deploying long-term environmental monitors, or experimenting with novel high-resolution sensors, Upstream
            gives you the tools to capture, store, analyze, and publish your data with confidence.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign in with Tapis credentials
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

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white/80 p-8 shadow-md ring-1 ring-slate-100">
            <h2 className="text-xl font-semibold text-slate-900">What you can do</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>
                <span className="font-semibold text-slate-900">Manage sensors &amp; deployments:</span>{' '}
                Register custom sensors, track metadata, configure deployment locations, and automatically ingest data
                from field or lab instruments.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Ingest &amp; structure high-resolution data:</span>{' '}
                Handle raw feeds (CSV, streaming, etc.), apply QA/QC transformations, and organize everything into a
                queryable database built for time-series, spatial, and event data.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Build a user-facing API:</span>{' '}
                Provide colleagues, students, and collaborators with clean, documented endpoints for accessing datasets,
                metadata, and derived products.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Visualize and explore data:</span>{' '}
                Use the built-in dashboard or connect your own tools to produce maps, charts, calibration plots, and
                campaign summaries.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Publish FAIR data products:</span>{' '}
                Version, tag, and release datasets with rich metadata, DOIs, and clear provenance so your work is
                discoverable and reproducible.
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white/80 p-8 shadow-md ring-1 ring-slate-100">
            <h2 className="text-xl font-semibold text-slate-900">Why Upstream?</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>
                <span className="font-semibold text-slate-900">A stable foundation backed by PostgreSQL.</span>
              </li>
              <li>
                <span className="font-semibold text-slate-900">A FastAPI backend designed for custom, evolving schemas.</span>
              </li>
              <li>
                <span className="font-semibold text-slate-900">A consistent data model that supports analysis and publication.</span>
              </li>
              <li>
                <span className="font-semibold text-slate-900">Clean interfaces for integrating HPC workflows at TACC or beyond.</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UnauthenticatedLanding;
