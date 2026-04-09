import React from 'react';
import { MetadataSchemaItem } from '../../hooks/metadataSchema/types';

type MetadataFieldsProps = {
  schema: MetadataSchemaItem[];
  values: Record<string, unknown>;
  errors?: Record<string, string>;
  onChange: (key: string, value: unknown) => void;
};

const getEnumOptions = (options?: Record<string, unknown> | null): string[] => {
  if (!options) return [];
  if (Array.isArray(options)) return options as string[];
  if (Array.isArray(options.values)) return options.values as string[];
  return [];
};

const MetadataFields: React.FC<MetadataFieldsProps> = ({ schema, values, errors = {}, onChange }) => {
  if (!schema.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      {schema.map((field) => {
        const rawValue = values[field.key];
        const fieldType = (field.field_type || 'string').toLowerCase();
        const fieldError = errors[field.key];

        const commonLabel = (
          <label htmlFor={`meta-${field.key}`} className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required ? ' *' : ''}
          </label>
        );

        const helpText = field.help_text ? (
          <p className="mt-1 text-xs text-gray-500">{field.help_text}</p>
        ) : null;

        const errorText = fieldError ? <p className="mt-1 text-sm text-red-600">{fieldError}</p> : null;

        if (fieldType === 'bool') {
          return (
            <div key={field.key}>
              <label className="flex items-center">
                <input
                  id={`meta-${field.key}`}
                  type="checkbox"
                  checked={Boolean(rawValue)}
                  onChange={(e) => onChange(field.key, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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

        if (fieldType === 'enum') {
          const options = getEnumOptions(field.options);
          const selectValue =
            typeof rawValue === 'string' || typeof rawValue === 'number'
              ? String(rawValue)
              : '';
          return (
            <div key={field.key}>
              {commonLabel}
              <select
                id={`meta-${field.key}`}
                value={selectValue}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an option</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {helpText}
              {errorText}
            </div>
          );
        }

        if (fieldType === 'date') {
          const dateValue =
            rawValue instanceof Date
              ? rawValue.toISOString().split('T')[0]
              : typeof rawValue === 'string'
              ? rawValue.split('T')[0]
              : '';
          return (
            <div key={field.key}>
              {commonLabel}
              <input
                id={`meta-${field.key}`}
                type="date"
                value={dateValue}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {helpText}
              {errorText}
            </div>
          );
        }

        if (fieldType === 'number') {
          const numberValue =
            typeof rawValue === 'number' || typeof rawValue === 'string'
              ? rawValue
              : '';
          return (
            <div key={field.key}>
              {commonLabel}
              <input
                id={`meta-${field.key}`}
                type="number"
                value={numberValue}
                onChange={(e) => onChange(field.key, e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {helpText}
              {errorText}
            </div>
          );
        }

        if (fieldType === 'json') {
          const jsonValue =
            typeof rawValue === 'string'
              ? rawValue
              : rawValue == null
                ? ''
                : JSON.stringify(rawValue, null, 2);
          return (
            <div key={field.key}>
              {commonLabel}
              <textarea
                id={`meta-${field.key}`}
                rows={4}
                value={jsonValue}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder='{"key":"value"}'
              />
              {helpText}
              {errorText}
            </div>
          );
        }

        return (
          <div key={field.key}>
            {commonLabel}
            {(() => {
              const textValue =
                typeof rawValue === 'string' || typeof rawValue === 'number'
                  ? String(rawValue)
                  : '';
              return (
            <input
              id={`meta-${field.key}`}
              type="text"
              value={textValue}
              onChange={(e) => onChange(field.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
              );
            })()}
            {helpText}
            {errorText}
          </div>
        );
      })}
    </div>
  );
};

export default MetadataFields;
