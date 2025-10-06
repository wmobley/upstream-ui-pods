import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';

interface PublishButtonProps {
  isPublished: boolean;
  onPublish: (cascade?: boolean) => Promise<void>;
  onUnpublish: () => Promise<void>;
  entityType: 'campaign' | 'station' | 'sensor' | 'measurement';
  showCascadeOption?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const PublishButton: React.FC<PublishButtonProps> = ({
  isPublished,
  onPublish,
  onUnpublish,
  entityType,
  showCascadeOption = false,
  disabled = false,
  size = 'md'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCascadeMenu, setShowCascadeMenu] = useState(false);

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const iconSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const handleAction = async (action: 'publish' | 'unpublish', cascade = false) => {
    setIsLoading(true);
    setShowCascadeMenu(false);

    try {
      if (action === 'publish') {
        await onPublish(cascade);
      } else {
        await onUnpublish();
      }
    } catch (error) {
      console.error(`Failed to ${action} ${entityType}:`, error);
      // You could add toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <button
        disabled
        className={`flex items-center gap-2 bg-gray-400 text-white rounded-lg shadow-md ${sizeClasses[size]}`}
      >
        <FaSpinner className={`animate-spin ${iconSizeClasses[size]}`} />
        {isPublished ? 'Unpublishing...' : 'Publishing...'}
      </button>
    );
  }

  if (isPublished) {
    return (
      <button
        onClick={() => handleAction('unpublish')}
        disabled={disabled}
        className={`flex items-center gap-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]}`}
        title={`Unpublish this ${entityType}`}
      >
        <FaEyeSlash className={iconSizeClasses[size]} />
        Unpublish
      </button>
    );
  }

  // Unpublished state
  if (showCascadeOption) {
    return (
      <div className="relative inline-flex items-center">
        <button
          onClick={() => handleAction('publish', false)}
          disabled={disabled}
          className={`flex items-center gap-2 bg-green-500 text-white rounded-l-lg shadow-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]}`}
          title={`Publish this ${entityType}`}
        >
          <FaEye className={iconSizeClasses[size]} />
          Publish
        </button>
        <button
          onClick={() => setShowCascadeMenu((s) => !s)}
          disabled={disabled}
          className={`flex items-center justify-center bg-green-600 text-white rounded-r-lg px-2 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${iconSizeClasses[size]}`}
          title="More publish options"
        >
          ▼
        </button>

        {showCascadeMenu && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-max">
            <button
              onClick={() => handleAction('publish', false)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 border-b border-gray-200"
            >
              Publish {entityType} only
            </button>
            <button
              onClick={() => handleAction('publish', true)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
            >
              Publish with children
            </button>
          </div>
        )}

        {showCascadeMenu && (
          <div
            className="fixed inset-0 z-5"
            onClick={() => setShowCascadeMenu(false)}
          />
        )}
      </div>
    );
  }

  // Simple publish button (no cascade option)
  return (
    <button
      onClick={() => handleAction('publish')}
      disabled={disabled}
      className={`flex items-center gap-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]}`}
      title={`Publish this ${entityType}`}
    >
      <FaEye className={iconSizeClasses[size]} />
      Publish
    </button>
  );
};

export default PublishButton;