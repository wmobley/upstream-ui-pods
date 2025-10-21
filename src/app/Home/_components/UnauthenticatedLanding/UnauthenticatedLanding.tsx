import { Link } from 'react-router-dom';

const UnauthenticatedLanding: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:items-center md:justify-between md:py-24">
        <section className="flex-1 space-y-6">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            Upstream Pods Preview
          </span>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Upstream keeps complex sensor campaigns simple
          </h1>
          <p className="max-w-xl text-base text-slate-600 sm:text-lg">
            It’s a modular stack—flexible database, programmable API, and collaboration-focused UI—
            built to store, query, and share high-resolution sensor data as soon as it’s collected.
            Authenticate with Tapis to access your campaigns, instruments, and measurements.
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

        <aside className="flex-1 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">What Upstream delivers</h2>
          <ol className="mt-4 space-y-4 text-sm text-slate-600">
            <li>
              <span className="font-medium text-slate-800">1. </span>
              A geospatial database tuned for high-frequency measurements across mobile and static sensors.
            </li>
            <li>
              <span className="font-medium text-slate-800">2. </span>
              REST APIs and a Python SDK for ingest, QA/QC automation, and downstream integrations.
            </li>
            <li>
              <span className="font-medium text-slate-800">3. </span>
              Secure sharing and filtering tools so campaign teams can explore data together in minutes.
            </li>
            <li>
              <span className="font-medium text-slate-800">4. </span>
              Hosted infrastructure at TACC that scales with multi-tenant environmental streams.
            </li>
          </ol>
          <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-xs text-blue-900">
            <p>
              Developing locally? Use the <code>🔧 Tapis Dev Tools</code> widget to seed test headers,
              or set <code>TAPIS_ENFORCE_AUTH_IN_DEV=true</code> to exercise the full login flow.
            </p>
          </div>
        </aside>
      </div>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-10 md:grid-cols-2">
          <article className="rounded-3xl bg-white/70 p-8 shadow-md ring-1 ring-slate-100">
            <h2 className="text-xl font-semibold text-slate-900">Why Upstream?</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>
                <span className="font-semibold text-slate-900">Open &amp; extensible:</span> From
                low-cost prototypes to industrial VOC analyzers, plug in any sensor and start
                streaming.
              </li>
              <li>
                <span className="font-semibold text-slate-900">APIs first:</span> Full REST coverage
                keeps dashboards, analytics, and IoT devices in sync.
              </li>
              <li>
                <span className="font-semibold text-slate-900">SDK support:</span> The Python SDK
                accelerates ingest, metadata management, and analysis workflows.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Hosted &amp; scalable:</span> Backed
                by Texas Advanced Computing Center infrastructure for resilient, multi-tenant
                streams.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Community-minded:</span> Built for
                FAIR data sharing and long-term monitoring projects.
              </li>
            </ul>
          </article>

          <article className="rounded-3xl bg-white/70 p-8 shadow-md ring-1 ring-slate-100">
            <h2 className="text-xl font-semibold text-slate-900">How it works</h2>
            <ol className="mt-4 space-y-3 text-sm text-slate-700">
              <li>
                <span className="font-semibold text-slate-900">Deploy sensors:</span> Connect custom
                hardware (temperature, VOC, air quality, soil moisture, etc.).
              </li>
              <li>
                <span className="font-semibold text-slate-900">Ingest data:</span> Use the REST API
                or Python SDK to post readings securely.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Store &amp; index:</span> Upstream
                captures metadata—location, type, timestamp—for fast querying.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Access &amp; integrate:</span> Pull
                structured data for visualization, ML, alerts, or dashboards.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Share &amp; collaborate:</span> Make
                datasets public or restricted so teams can build together.
              </li>
            </ol>
          </article>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 lg:flex-row">
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Who should use Upstream?</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              <li>Researchers profiling environmental change, urban microclimates, or ecosystems.</li>
              <li>Citizen scientists and makers deploying community sensor networks.</li>
              <li>Developers building IoT dashboards, alerting systems, or predictive analytics.</li>
              <li>Organizations standardizing sensor collection across regional or national projects.</li>
            </ul>
          </div>
          <div className="flex-1 space-y-4 rounded-3xl bg-slate-900 px-6 py-8 text-slate-100 shadow-xl">
            <h2 className="text-2xl font-semibold text-white">Get started in minutes</h2>
            <ul className="space-y-3 text-sm">
              <li>
                1. Explore the API docs at{' '}
                <a
                  href="https://api.upstream-dso.tacc.utexas.edu/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-200 underline"
                >
                  api.upstream-dso.tacc.utexas.edu/docs
                </a>
              </li>
              <li>
                2. Install the SDK:
                <pre className="mt-2 rounded-md bg-slate-800 px-3 py-2 text-xs text-slate-100">
                  pip install upstream-sdk
                </pre>
              </li>
              <li>3. Authorize with Tapis and post your first reading.</li>
              <li>4. Build dashboards, alerts, or models using live and historical data.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-6 text-sm text-slate-600">
          <h2 className="text-base font-semibold text-slate-900">About Upstream</h2>
          <p className="mt-3">
            Upstream is maintained by the Decision Support Office at the Texas Advanced Computing
            Center (TACC). Our mission is to provide resilient, open-data friendly infrastructure for
            environmental sensing—supporting everything from proof-of-concept sensors to city-scale
            deployments.
          </p>
        </div>
      </section>
    </div>
  );
};

export default UnauthenticatedLanding;
