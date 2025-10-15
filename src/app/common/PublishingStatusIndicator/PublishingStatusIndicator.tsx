import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface PublishingStatusIndicatorProps {
  isPublished: boolean;
  publishedAt?: Date | null;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const PublishingStatusIndicator: React.FC<PublishingStatusIndicatorProps> = ({
  isPublished,
  publishedAt,
  size = 'md',
  showText = true
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isPublished) {
    const publishedText = publishedAt ? `Published ${formatDate(publishedAt)}` : 'Published';

    return (
      <div
        className={`inline-flex items-center gap-2 bg-green-100 text-green-800 rounded-full ${sizeClasses[size]}`}
        title={publishedText}
      >
        <FaEye className={iconSizeClasses[size]} />
        {showText && <span>Published</span>}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 bg-gray-100 text-gray-600 rounded-full ${sizeClasses[size]}`}
      title="Not published - only visible to authenticated users"
    >
      <FaEyeSlash className={iconSizeClasses[size]} />
      {showText && <span>Draft</span>}
    </div>
  );
};

export default PublishingStatusIndicator;