import { MetadataJsonValue, MetadataSchemaItem } from '../hooks/metadataSchema/types';

export type MetadataValue = MetadataJsonValue | Date | undefined;

export type MetadataValues = Record<string, unknown>;

export type MetadataValidationResult = {
  metadata: Record<string, unknown>;
  errors: Record<string, string>;
};

const isEmptyValue = (value: unknown) =>
  value === undefined || value === null || value === '';

const isMetadataJsonValue = (value: unknown): value is MetadataJsonValue => {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every(isMetadataJsonValue);
  }
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).every(isMetadataJsonValue);
  }
  return false;
};

export const normalizeMetadata = (
  schema: MetadataSchemaItem[],
  values: MetadataValues,
): MetadataValidationResult => {
  const errors: Record<string, string> = {};
  const metadata: Record<string, unknown> = {};

  schema.forEach((field) => {
    const rawValue = values[field.key];
    const fieldType = (field.field_type || 'string').toLowerCase();

    if (field.required && isEmptyValue(rawValue)) {
      errors[field.key] = 'This field is required';
      return;
    }

    if (isEmptyValue(rawValue)) {
      return;
    }

    if (fieldType === 'json') {
      if (typeof rawValue === 'string') {
        try {
          const parsed = JSON.parse(rawValue) as unknown;
          if (isMetadataJsonValue(parsed)) {
            metadata[field.key] = parsed;
          } else {
            errors[field.key] = 'JSON must contain a serializable value';
          }
        } catch {
          errors[field.key] = 'Invalid JSON';
        }
        return;
      }
      if (isMetadataJsonValue(rawValue)) {
        metadata[field.key] = rawValue;
      } else {
        errors[field.key] = 'JSON must contain a serializable value';
      }
      return;
    }

    if (fieldType === 'date') {
      metadata[field.key] = rawValue;
      return;
    }

    metadata[field.key] = rawValue;
  });

  return { metadata, errors };
};
