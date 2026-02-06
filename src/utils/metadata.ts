import { MetadataSchemaItem } from '../hooks/metadataSchema/types';

export type MetadataValidationResult = {
  metadata: Record<string, any>;
  errors: Record<string, string>;
};

const isEmptyValue = (value: any) =>
  value === undefined || value === null || value === '';

export const normalizeMetadata = (
  schema: MetadataSchemaItem[],
  values: Record<string, any>,
): MetadataValidationResult => {
  const errors: Record<string, string> = {};
  const metadata: Record<string, any> = {};

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
          metadata[field.key] = JSON.parse(rawValue);
        } catch {
          errors[field.key] = 'Invalid JSON';
        }
        return;
      }
      metadata[field.key] = rawValue;
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
