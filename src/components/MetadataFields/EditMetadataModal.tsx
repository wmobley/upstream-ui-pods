import React, { useEffect, useMemo, useState } from 'react';
import { CampaignUpdate, StationUpdate } from '@upstream/upstream-api';
import Modal from '../../app/common/Modal';
import { useMetadataSchemaList } from '../../hooks/metadataSchema/useMetadataSchemaList';
import {
  MetadataSchemaItem,
  MetadataSchemaScope,
} from '../../hooks/metadataSchema/types';
import { normalizeMetadata } from '../../utils/metadata';
import MetadataFields from './MetadataFields';

type EditMetadataModalProps = {
  isOpen: boolean;
  onClose: () => void;
  scope: MetadataSchemaScope;
  title: string;
  initialMetadata?: Record<string, unknown> | null;
  isSaving: boolean;
  saveError?: string | null;
  onSave: (payload: CampaignUpdate | StationUpdate) => Promise<void>;
};

const EditMetadataModal: React.FC<EditMetadataModalProps> = ({
  isOpen,
  onClose,
  scope,
  title,
  initialMetadata,
  isSaving,
  saveError,
  onSave,
}) => {
  const { data, isLoading } = useMetadataSchemaList({
    scope,
    activeOnly: true,
  });
  const [metadataValues, setMetadataValues] = useState<Record<string, unknown>>(
    {},
  );
  const [metadataErrors, setMetadataErrors] = useState<Record<string, string>>(
    {},
  );

  const normalizedInitialMetadata = useMemo(
    () => initialMetadata ?? {},
    [initialMetadata],
  );
  const effectiveSchema = useMemo<MetadataSchemaItem[]>(() => {
    const schema = data?.items ?? [];
    const definedKeys = new Set(schema.map((item) => item.key));
    const inferredFields = Object.entries(normalizedInitialMetadata)
      .filter(([key]) => !definedKeys.has(key))
      .map(([key, value], index) => ({
        id: -1 - index,
        scope,
        key,
        label: key
          .split('_')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' '),
        field_type: inferFieldType(value),
        required: false,
        help_text: 'Existing metadata field',
        units: null,
        ckan_field: null,
        ckan_mode: 'extra',
        order_index: schema.length + index,
        active: true,
        options: null,
      }));

    return [...schema, ...inferredFields];
  }, [data?.items, normalizedInitialMetadata, scope]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setMetadataValues(normalizedInitialMetadata);
    setMetadataErrors({});
  }, [isOpen, normalizedInitialMetadata]);

  const handleMetadataChange = (key: string, value: unknown) => {
    setMetadataValues((prev) => ({ ...prev, [key]: value }));
    if (metadataErrors[key]) {
      setMetadataErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { metadata, errors } = normalizeMetadata(effectiveSchema, metadataValues);
    if (Object.keys(errors).length) {
      setMetadataErrors(errors);
      return;
    }
    await onSave({ metadata });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading metadata fields…</div>
        ) : effectiveSchema.length ? (
          <MetadataFields
            schema={effectiveSchema}
            values={metadataValues}
            errors={metadataErrors}
            onChange={handleMetadataChange}
          />
        ) : (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            No active metadata fields are configured for this item.
          </div>
        )}

        {saveError ? <p className="text-sm text-red-600">{saveError}</p> : null}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving…' : 'Save Metadata'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditMetadataModal;

function inferFieldType(value: unknown): string {
  if (typeof value === 'boolean') {
    return 'bool';
  }
  if (typeof value === 'number') {
    return 'number';
  }
  if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
    return 'json';
  }
  return 'string';
}
