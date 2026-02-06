import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { StationCreate, StationType, GetCampaignResponse } from '@upstream/upstream-api';
import { useCreate } from '../../../../hooks/station/useCreate';
import { useMetadataSchemaList } from '../../../../hooks/metadataSchema/useMetadataSchemaList';
import MetadataFields from '../../../../components/MetadataFields/MetadataFields';
import { normalizeMetadata } from '../../../../utils/metadata';

interface CreateStationFormProps {
  campaignId: string;
  campaign: GetCampaignResponse;
  onCancel?: () => void;
}

const CreateStationForm: React.FC<CreateStationFormProps> = ({ campaignId, onCancel }) => {
  const history = useHistory();
  const createStation = useCreate(campaignId);
  const { data: metadataSchemaResponse, isLoading: metadataSchemaLoading } = useMetadataSchemaList({
    scope: 'station',
    activeOnly: true,
  });
  const metadataSchema = metadataSchemaResponse?.items ?? [];

  const [formData, setFormData] = useState<StationCreate>({
    name: '',
    description: '',
    contactName: '',
    contactEmail: '',
    active: true,
    startDate: new Date(),
    stationType: StationType.Static,
  });
  const [metadataValues, setMetadataValues] = useState<Record<string, any>>({});

  const [errors, setErrors] = useState<Partial<Record<keyof StationCreate, string>>>({});
  const [metadataErrors, setMetadataErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof StationCreate, value: string | Date | boolean | StationType) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  const handleMetadataChange = (key: string, value: any) => {
    setMetadataValues(prev => ({ ...prev, [key]: value }));
    if (metadataErrors[key]) {
      setMetadataErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StationCreate, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Station name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    const { errors: metaErrors } = normalizeMetadata(metadataSchema, metadataValues);
    setMetadataErrors(metaErrors);
    return Object.keys(newErrors).length === 0 && Object.keys(metaErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const { metadata, errors: metaErrors } = normalizeMetadata(metadataSchema, metadataValues);
      if (Object.keys(metaErrors).length) {
        setMetadataErrors(metaErrors);
        return;
      }
      const response = await createStation.mutateAsync({ ...formData, metadata });
      // Navigate to the new station
      history.push(`/campaigns/${campaignId}/stations/${response.id}`);
    } catch (error) {
      console.error('Failed to create station:', error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      history.push(`/campaigns/${campaignId}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Station</h2>
      <div className="mb-6 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
        <p>Required fields are marked. You can save drafts and complete later.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Station Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Station Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Enter station name"
          />
          <p className="mt-1 text-xs text-gray-500">
            Use a clear, searchable title (e.g., “2026 Q1 Incident Logs”).
          </p>
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter station description"
          />
          <p className="mt-1 text-xs text-gray-500">
            Summarize scope and source (who, when, where).
          </p>
        </div>

        {/* Contact Name */}
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
            Contact Name
          </label>
          <input
            type="text"
            id="contactName"
            value={formData.contactName || ''}
            onChange={(e) => handleInputChange('contactName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter contact name"
          />
        </div>

        {/* Contact Email */}
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Contact Email
          </label>
          <input
            type="email"
            id="contactEmail"
            value={formData.contactEmail || ''}
            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.contactEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter contact email"
          />
          {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
            onChange={(e) => handleInputChange('startDate', e.target.value ? new Date(e.target.value) : new Date())}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.startDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <p className="mt-1 text-xs text-gray-500">
            Set the date range to match the data contents, not the upload date.
          </p>
          {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
        </div>

        {/* Station Type */}
        <div>
          <label htmlFor="stationType" className="block text-sm font-medium text-gray-700 mb-2">
            Station Type
          </label>
          <select
            id="stationType"
            value={formData.stationType || StationType.Static}
            onChange={(e) => handleInputChange('stationType', e.target.value as StationType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={StationType.Static}>Static</option>
            <option value={StationType.Mobile}>Mobile</option>
          </select>
        </div>

        {/* Active Status */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.active ?? true}
              onChange={(e) => handleInputChange('active', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Active Station</span>
          </label>
          <p className="mt-1 text-sm text-gray-500">Check this box if the station is currently active</p>
        </div>

        {/* Metadata Fields */}
        {metadataSchemaLoading ? (
          <div className="text-sm text-gray-500">Loading metadata fields…</div>
        ) : metadataSchema.length ? (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Metadata</h3>
            <MetadataFields
              schema={metadataSchema}
              values={metadataValues}
              errors={metadataErrors}
              onChange={handleMetadataChange}
            />
          </div>
        ) : null}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createStation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createStation.isPending ? 'Creating...' : 'Create Station'}
          </button>
        </div>

        {/* Error Message */}
        {createStation.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
              Failed to create station: {createStation.error.message}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateStationForm;
