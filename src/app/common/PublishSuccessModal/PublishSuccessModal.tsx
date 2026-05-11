import Modal from '../Modal';
import type { FormattedPublishSuccess } from '../../../hooks/api/publishDebug';

type PublishSuccessModalProps = {
  result: FormattedPublishSuccess | null;
  entityLabel: string;
  onClose: () => void;
};

const PublishSuccessModal = ({
  result,
  entityLabel,
  onClose,
}: PublishSuccessModalProps) => {
  if (!result) return null;

  return (
    <Modal isOpen={Boolean(result)} onClose={onClose} title={result.title} className="max-w-xl">
      <div className="space-y-4">
        <div className="rounded-md border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-900">
            The {entityLabel} was published successfully.
          </p>
          <p className="mt-2 text-sm text-green-800">{result.message}</p>
        </div>

        {(typeof result.publishedCount === 'number' || result.datasetName || result.datasetUrl) && (
          <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-2 text-sm">
            {typeof result.publishedCount === 'number' && (
              <>
                <dt className="font-medium text-gray-600">Published</dt>
                <dd className="text-gray-800">{result.publishedCount}</dd>
              </>
            )}
            {result.datasetName && (
              <>
                <dt className="font-medium text-gray-600">Dataset</dt>
                <dd className="break-all text-gray-800">{result.datasetName}</dd>
              </>
            )}
            {result.datasetUrl && (
              <>
                <dt className="font-medium text-gray-600">URL</dt>
                <dd className="break-all text-gray-800">{result.datasetUrl}</dd>
              </>
            )}
          </dl>
        )}

        {result.details.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-800">Included items</p>
            <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-3">
              {result.details.map((detail, index) => (
                <li key={`${detail}-${index}`} className="text-sm text-gray-700">
                  {detail}
                </li>
              ))}
            </ul>
          </div>
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

export default PublishSuccessModal;
