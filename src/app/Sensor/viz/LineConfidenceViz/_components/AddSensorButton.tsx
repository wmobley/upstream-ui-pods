import React from 'react';
import { useLineConfidence } from '../context/LineConfidenceContext';

interface AddSensorButtonProps {
  className?: string;
}

export const AddSensorButton: React.FC<AddSensorButtonProps> = ({
  className,
}) => {
  const { addSensorModalOpen, setAddSensorModalOpen } = useLineConfidence();

  return (
    <div className={className}>
      {!addSensorModalOpen && (
        <button
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          onClick={() => setAddSensorModalOpen(true)}
        >
          Compare
        </button>
      )}
    </div>
  );
};
