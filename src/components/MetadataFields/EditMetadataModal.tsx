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

export type EditMetadataModalOption = {
  label: string;
  value: string;
};

export type EditMetadataModalField = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'email' | 'checkbox' | 'select';
  required?: boolean;
  helpText?: string;
  options?: EditMetadataModalOption[];
};

type EditMetadataModalProps = {
  isOpen: boolean;
  onClose: () => void;
  scope: MetadataSchemaScope;
  title: string;
  initialMetadata?: Record<string, unknown> | null;
  extraFields?: EditMetadataModalField[];
  initialValues?: Record<string, unknown>;
  isSaving: boolean;
  saveError?: string | null;
  onSave: (
    payload: Partial<CampaignUpdate & StationUpdate> & {
      metadata?: Record<string, unknown> | null;
    },
  ) => Promise<void>;
};

const EditMetadataModal: React.FC<EditMetadataModalProps> = ({
  isOpen,
  onClose,
  scope,
  title,
  initialMetadata,
  extraFields = [],
  initialValues,
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
  const [extraValues, setExtraValues] = useState<Record<string, unknown>>({});
  const [metadataErrors, setMetadataErrors] = useState<Record<string, string>>(
    {},
  );
  const [extraErrors, setExtraErrors] = useState<Record<string, string>>({});

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
    setExtraValues(initialValues ?? {});
    setMetadataErrors({});
    setExtraErrors({});
  }, [initialValues, isOpen, normalizedInitialMetadata]);

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

  const handleExtraChange = (key: string, value: unknown) => {
    setExtraValues((prev) => ({ ...prev, [key]: value }));
    if (extraErrors[key]) {
      setExtraErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { metadata, errors } = normalizeMetadata(effectiveSchema, metadataValues);
    const nextExtraErrors: Record<string, string> = {};
    for (const field of extraFields) {
      const value = extraValues[field.key];
      const isEmpty = value === undefined || value === null || value === '';
      if (field.required && isEmpty) {
        nextExtraErrors[field.key] = 'This field is required';
      } else if (
        field.type === 'email' &&
        typeof value === 'string' &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        nextExtraErrors[field.key] = 'Please enter a valid email address';
      }
    }
    if (Object.keys(errors).length) {
      setMetadataErrors(errors);
    }
    if (Object.keys(nextExtraErrors).length) {
      setExtraErrors(nextExtraErrors);
    }
    if (Object.keys(errors).length || Object.keys(nextExtraErrors).length) {
      return;
    }
    await onSave({
      ...normalizeExtraValues(extraFields, extraValues),
      metadata,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {extraFields.length ? (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">
              CKAN Fields
            </h3>
            <div className="space-y-4">
              {extraFields.map((field) => {
                const rawValue = extraValues[field.key];
                const errorText = extraErrors[field.key] ? (
                  <p className="mt-1 text-sm text-red-600">
                    {extraErrors[field.key]}
                  </p>
                ) : null;
                const helpText = field.helpText ? (
                  <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
                ) : null;

                if (field.type === 'textarea') {
                  return (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                        {field.required ? ' *' : ''}
                      </label>
                      <textarea
                        rows={4}
                        value={typeof rawValue === 'string' ? rawValue : ''}
                        onChange={(e) =>
                          handleExtraChange(field.key, e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {helpText}
                      {errorText}
                    </div>
                  );
                }

                if (field.type === 'date') {
                  const dateValue =
                    rawValue instanceof Date
                      ? rawValue.toISOString().split('T')[0]
                      : typeof rawValue === 'string'
                        ? rawValue.split('T')[0]
                        : '';
                  return (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                        {field.required ? ' *' : ''}
                      </label>
                      <input
                        type="date"
                        value={dateValue}
                        onChange={(e) =>
                          handleExtraChange(field.key, e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {helpText}
                      {errorText}
                    </div>
                  );
                }

                if (field.type === 'checkbox') {
                  return (
                    <div key={field.key}>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={Boolean(rawValue)}
                          onChange={(e) =>
                            handleExtraChange(field.key, e.target.checked)
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {field.label}
                          {field.required ? ' *' : ''}
                        </span>
                      </label>
                      {helpText}
                      {errorText}
                    </div>
                  );
                }

                if (field.type === 'select') {
                  return (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                        {field.required ? ' *' : ''}
                      </label>
                      <select
                        value={
                          typeof rawValue === 'string' ? rawValue : ''
                        }
                        onChange={(e) =>
                          handleExtraChange(field.key, e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select an option</option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {helpText}
                      {errorText}
                    </div>
                  );
                }

                return (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required ? ' *' : ''}
                    </label>
                    <input
                      type={field.type === 'email' ? 'email' : 'text'}
                      value={
                        typeof rawValue === 'string' ? rawValue : ''
                      }
                      onChange={(e) =>
                        handleExtraChange(field.key, e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {helpText}
                    {errorText}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

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

function normalizeExtraValues(
  fields: EditMetadataModalField[],
  values: Record<string, unknown>,
): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};

  for (const field of fields) {
    const value = values[field.key];

    if (field.type === 'date') {
      normalized[field.key] =
        typeof value === 'string' && value ? new Date(value) : null;
      continue;
    }

    if (field.type === 'checkbox') {
      normalized[field.key] = Boolean(value);
      continue;
    }

    normalized[field.key] =
      value === '' || value === undefined ? null : value;
  }

  return normalized;
}
