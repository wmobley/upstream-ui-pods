import React, { useMemo, useState } from 'react';
import { useMetadataSchemaList } from '../../../hooks/metadataSchema/useMetadataSchemaList';
import {
  useCreateMetadataSchema,
  useDeleteMetadataSchema,
  useUpdateMetadataSchema,
} from '../../../hooks/metadataSchema/useMetadataSchemaMutations';
import { MetadataSchemaItem } from '../../../hooks/metadataSchema/types';

const defaultSchema: Omit<MetadataSchemaItem, 'id'> = {
  scope: 'campaign',
  key: '',
  label: '',
  field_type: 'string',
  required: false,
  help_text: '',
  units: '',
  ckan_field: '',
  ckan_mode: 'extra',
  order_index: 0,
  active: true,
  options: null,
};

type MetadataSchemaAdminProps = {
  canManage: boolean;
};

const MetadataSchemaAdmin: React.FC<MetadataSchemaAdminProps> = ({ canManage }) => {
  const { data, isLoading, error } = useMetadataSchemaList({ activeOnly: false });
  const createSchema = useCreateMetadataSchema();
  const updateSchema = useUpdateMetadataSchema();
  const deleteSchema = useDeleteMetadataSchema();

  const [formState, setFormState] = useState<Omit<MetadataSchemaItem, 'id'>>(defaultSchema);
  const [optionsText, setOptionsText] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const schemaItems = data?.items ?? [];
  const grouped = useMemo(() => {
    return schemaItems.reduce<Record<string, MetadataSchemaItem[]>>((acc, item) => {
      const scope = item.scope || 'unknown';
      acc[scope] = acc[scope] || [];
      acc[scope].push(item);
      return acc;
    }, {});
  }, [schemaItems]);

  const handleFormChange = (key: keyof Omit<MetadataSchemaItem, 'id'>, value: any) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreate = async () => {
    if (!canManage) {
      setFormError('Admin role required to manage metadata standards.');
      return;
    }
    setFormError(null);
    if (!formState.key.trim() || !formState.label.trim()) {
      setFormError('Key and label are required.');
      return;
    }

    let options: Record<string, any> | null = null;
    if (optionsText.trim()) {
      try {
        options = JSON.parse(optionsText);
      } catch {
        setFormError('Options must be valid JSON.');
        return;
      }
    }

    await createSchema.mutateAsync({
      ...formState,
      key: formState.key.trim(),
      label: formState.label.trim(),
      ckan_field: formState.ckan_field?.trim() || null,
      help_text: formState.help_text?.trim() || null,
      units: formState.units?.trim() || null,
      options,
    });
    setFormState(defaultSchema);
    setOptionsText('');
  };

  const handleToggleActive = async (item: MetadataSchemaItem) => {
    if (!canManage) return;
    await updateSchema.mutateAsync({
      id: item.id,
      patch: { active: !item.active },
    });
  };

  const handleDelete = async (item: MetadataSchemaItem) => {
    if (!canManage) return;
    if (!window.confirm(`Delete metadata field "${item.label}"?`)) return;
    await deleteSchema.mutateAsync(item.id);
  };

  return (
    <div className="space-y-6 p-4">
      <header>
        <h2 className="text-xl font-semibold text-gray-900">Metadata Standards</h2>
        <p className="text-sm text-gray-600">
          Define additional metadata fields for campaigns, stations, and sensors.
        </p>
      </header>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4 w-full">
        <h3 className="text-sm font-semibold text-gray-800">Add Metadata Field</h3>
        {!canManage && (
          <p className="text-sm text-yellow-700">
            Admin role required to add or edit metadata standards.
          </p>
        )}
        {formError && <p className="text-sm text-red-600">{formError}</p>}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Scope</label>
            <select
              value={formState.scope}
              onChange={(e) => handleFormChange('scope', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="campaign">Campaign</option>
              <option value="station">Station</option>
              <option value="sensor">Sensor</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Key</label>
            <input
              value={formState.key}
              onChange={(e) => handleFormChange('key', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              placeholder="e.g. mass_spectrometer_type"
            />
          </div>
          <div className="lg:col-span-1 md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
            <input
              value={formState.label}
              onChange={(e) => handleFormChange('label', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              placeholder="Mass Spectrometer Type"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Field Type</label>
            <select
              value={formState.field_type}
              onChange={(e) => handleFormChange('field_type', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="enum">Enum</option>
              <option value="bool">Boolean</option>
              <option value="json">JSON</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">CKAN Field (optional)</label>
            <input
              value={formState.ckan_field ?? ''}
              onChange={(e) => handleFormChange('ckan_field', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              placeholder="e.g. author"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">CKAN Mode</label>
            <select
              value={formState.ckan_mode ?? 'extra'}
              onChange={(e) => handleFormChange('ckan_mode', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="extra">Extras</option>
              <option value="top_level">Top-level</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
            <input
              type="number"
              value={formState.order_index ?? 0}
              onChange={(e) => handleFormChange('order_index', Number(e.target.value))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Units</label>
            <input
              value={formState.units ?? ''}
              onChange={(e) => handleFormChange('units', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              placeholder="e.g. ppm"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Help Text</label>
            <input
              value={formState.help_text ?? ''}
              onChange={(e) => handleFormChange('help_text', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Options (JSON for enum)</label>
            <textarea
              value={optionsText}
              onChange={(e) => setOptionsText(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm font-mono"
              rows={5}
              placeholder='{"values":["option-a","option-b"]}'
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex items-center gap-2">
            <input
              type="checkbox"
              checked={formState.required}
              onChange={(e) => handleFormChange('required', e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm text-gray-700">Required</span>
          </div>
        </div>
        <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCreate}
              disabled={!canManage || createSchema.isPending}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {createSchema.isPending ? 'Saving…' : 'Add Field'}
            </button>
        </div>
        {createSchema.error && (
          <p className="text-sm text-red-600">Failed to save: {createSchema.error.message}</p>
        )}
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading metadata fields…</p>
        ) : error ? (
          <p className="text-sm text-red-600">Failed to load metadata fields: {error.message}</p>
        ) : (
          Object.entries(grouped).map(([scope, items]) => (
            <div key={scope} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 capitalize">{scope} Fields</h3>
              {items.length ? (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.label} <span className="text-xs text-gray-500">({item.key})</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Type: {item.field_type} · CKAN: {item.ckan_mode || 'extra'}
                          {item.ckan_field ? `:${item.ckan_field}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          disabled={!canManage}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                        >
                          {item.active ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={!canManage}
                          className="text-xs font-semibold text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No fields defined.</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MetadataSchemaAdmin;
