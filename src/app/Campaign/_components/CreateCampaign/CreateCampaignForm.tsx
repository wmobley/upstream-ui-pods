import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CampaignsIn } from '@upstream/upstream-api';
import { useCreate } from '../../../../hooks/campaign/useCreate';
import { useQueryClient } from '@tanstack/react-query';
import useOrganizations from '../../../../hooks/ckan/useOrganizations';
import { useAuth } from '../../../../contexts/AuthContextState';
import { useMetadataSchemaList } from '../../../../hooks/metadataSchema/useMetadataSchemaList';
import MetadataFields from '../../../../components/MetadataFields/MetadataFields';
import { normalizeMetadata } from '../../../../utils/metadata';

interface CreateCampaignFormProps {
  onCancel?: () => void;
}

const CreateCampaignForm: React.FC<CreateCampaignFormProps> = ({ onCancel }) => {
  const history = useHistory();
  const createCampaign = useCreate();
  const queryClient = useQueryClient();
  const { role } = useAuth();
  const roleUpper = (role || '').toUpperCase();
  const canCreate = roleUpper === 'USER' || roleUpper === 'ADMIN' || roleUpper === 'APPROVEDADMIN';
  const {
    data: organizations,
    isLoading: isOrgLoading,
    error: orgError,
  } = useOrganizations();
  const { data: metadataSchemaResponse, isLoading: metadataSchemaLoading } = useMetadataSchemaList({
    scope: 'campaign',
    activeOnly: true,
  });
  const metadataSchema = metadataSchemaResponse?.items ?? [];

  const [formData, setFormData] = useState<CampaignsIn>({
    name: '',
    contactName: '',
    contactEmail: '',
    description: '',
    startDate: null,
    endDate: null,
    allocation: '',
  });
  const [metadataValues, setMetadataValues] = useState<Record<string, any>>({});

  const [errors, setErrors] = useState<Partial<Record<keyof CampaignsIn, string>>>({});
  const [metadataErrors, setMetadataErrors] = useState<Record<string, string>>({});

  const hasOrganizations = useMemo(() => (organizations?.length ?? 0) > 0, [organizations]);

  const handleInputChange = (field: keyof CampaignsIn, value: string | Date | null) => {
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
    const newErrors: Partial<Record<keyof CampaignsIn, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }
    if (!formData.allocation?.trim()) {
      newErrors.allocation = 'CKAN organization selection is required';
    }

    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
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
      const response = await createCampaign.mutateAsync({ ...formData, metadata });
      // Wait for cache invalidation to complete before navigating
      await queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      // Navigate to the new campaign
      history.push(`/campaigns/${response.id}`);
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      history.goBack();
    }
  };

  if (!canCreate) {
    return (
      <div className="max-w-xl mx-auto rounded-lg bg-yellow-50 border border-yellow-200 p-6 text-sm text-yellow-900 space-y-3">
        <h2 className="text-lg font-semibold text-yellow-900">Write access required</h2>
        <p>
          Your account does not have permission to create campaigns. Request a role upgrade from an administrator
          if you need to publish new campaigns.
        </p>
        <button
          type="button"
          onClick={() => history.goBack()}
          className="inline-flex items-center rounded bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-700"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Create New Campaign</h2>
        <div className="mb-6 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
          <p>Register IOP campaigns for downstream processing and reporting.</p>
          <p>Required fields are marked. You can save drafts and complete later.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter campaign name"
            />
            <p className="mt-1 text-xs text-gray-500">
              Use a clear, searchable title (e.g., “2026 Q1 Incident Logs”).
            </p>
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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

          {/* CKAN Organization */}
          <div>
            <label htmlFor="allocation" className="block text-sm font-medium text-gray-700 mb-2">
              CKAN Organization *
            </label>
            {isOrgLoading ? (
              <p className="text-sm text-gray-500">Loading organizations…</p>
            ) : hasOrganizations ? (
              <select
                id="allocation"
                value={formData.allocation ?? ''}
                onChange={(e) => handleInputChange('allocation', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.allocation ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select an organization</option>
                {organizations?.map((org) => (
                  <option key={org.name} value={org.name}>
                    {org.display_name || org.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-red-600">
                {orgError?.message || 'You do not have editor or admin access to any CKAN organizations.'}
              </p>
            )}
            {errors.allocation && <p className="mt-1 text-sm text-red-600">{errors.allocation}</p>}
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
              placeholder="Enter campaign description"
            />
            <p className="mt-1 text-xs text-gray-500">
              Summarize scope and source (who, when, where).
            </p>
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => handleInputChange('startDate', e.target.value ? new Date(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Set the date range to match the data contents, not the upload date.
            </p>
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ''}
              onChange={(e) => handleInputChange('endDate', e.target.value ? new Date(e.target.value) : null)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.endDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
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
              disabled={createCampaign.isPending || !hasOrganizations}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createCampaign.isPending ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>

          {/* Error Message */}
          {createCampaign.error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                Failed to create campaign: {createCampaign.error.message}
              </p>
            </div>
          )}
        </form>
      </div>
  );
};

export default CreateCampaignForm;
