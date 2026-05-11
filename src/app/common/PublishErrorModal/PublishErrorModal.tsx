import Modal from '../Modal';
import type { FormattedPublishError } from '../../../hooks/api/publishDebug';

type PublishErrorModalProps = {
  error: FormattedPublishError | null;
  entityLabel: string;
  onClose: () => void;
};

const PublishErrorModal = ({
  error,
  entityLabel,
  onClose,
}: PublishErrorModalProps) => {
  if (!error) return null;

  return (
    <Modal isOpen={Boolean(error)} onClose={onClose} title={error.title} className="max-w-xl">
      <div className="space-y-4">
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-900">
            The {entityLabel} was not published to CKAN.
          </p>
          <p className="mt-2 text-sm text-red-800">{error.message}</p>
        </div>

        {error.details.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-800">Details</p>
            <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-3">
              {error.details.map((detail, index) => (
                <li key={`${detail}-${index}`} className="text-sm text-gray-700">
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(error.code || error.requestId || error.datasetName || error.datasetUrl) && (
          <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-2 text-sm">
            {error.code && (
              <>
                <dt className="font-medium text-gray-600">Code</dt>
                <dd className="text-gray-800">{error.code}</dd>
              </>
            )}
            {error.datasetName && (
              <>
                <dt className="font-medium text-gray-600">Dataset</dt>
                <dd className="break-all text-gray-800">{error.datasetName}</dd>
              </>
            )}
            {error.datasetUrl && (
              <>
                <dt className="font-medium text-gray-600">URL</dt>
                <dd className="break-all text-gray-800">{error.datasetUrl}</dd>
              </>
            )}
            {error.requestId && (
              <>
                <dt className="font-medium text-gray-600">Request</dt>
                <dd className="break-all text-gray-800">{error.requestId}</dd>
              </>
            )}
          </dl>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PublishErrorModal;
