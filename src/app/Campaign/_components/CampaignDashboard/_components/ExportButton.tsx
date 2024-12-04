import React from 'react';
import { FaFileExport } from 'react-icons/fa';

interface ExportButtonProps {
  onExport: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExport }) => {
  return (
    <button
      onClick={onExport}
      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
    >
      <FaFileExport className="text-lg" />
      Export
    </button>
  );
};

export default ExportButton;
