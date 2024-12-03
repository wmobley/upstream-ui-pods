import React from 'react';
import Loading from '../Loading/Loading';

interface QueryWrapperProps {
  isLoading: boolean;
  error: any;
  children: React.ReactNode;
}

const QueryWrapper: React.FC<QueryWrapperProps> = ({
  isLoading,
  error,
  children,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loading loadingMessage="Cargando..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default QueryWrapper;
