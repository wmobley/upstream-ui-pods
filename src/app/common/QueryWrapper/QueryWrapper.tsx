import React from 'react';
import Loading from '../Loading/Loading';
import { friendlyErrorMessage } from '../../../utils/apiError';

interface QueryWrapperProps {
  isLoading: boolean;
  loadingMessage?: string;
  error: Error | null;
  onRetry?: () => void;
  children: React.ReactNode;
}

const QueryWrapper: React.FC<QueryWrapperProps> = ({
  isLoading,
  loadingMessage = 'Loading...',
  error,
  onRetry,
  children,
}) => {
  if (isLoading && !error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loading loadingMessage={loadingMessage} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 font-medium mb-4">{friendlyErrorMessage(error)}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default QueryWrapper;
