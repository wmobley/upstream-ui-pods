import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CampaignsIn } from '@upstream/upstream-api';
import { useCreate } from '../../../../hooks/campaign/useCreate';
import { useQueryClient } from '@tanstack/react-query';

interface CreateCampaignFormProps {
  onCancel?: () => void;
}

const CreateCampaignForm: React.FC<CreateCampaignFormProps> = ({ onCancel }) => {
  const history = useHistory();
  const createCampaign = useCreate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CampaignsIn>({
    name: '',
    contactName: '',
    contactEmail: '',
    description: '',
    startDate: null,
    endDate: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CampaignsIn, string>>>({});

  const handleInputChange = (field: keyof CampaignsIn, value: string | Date | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CampaignsIn, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }

    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await createCampaign.mutateAsync(formData);
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

  return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Create New Campaign</h2>

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
              disabled={createCampaign.isPending}
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