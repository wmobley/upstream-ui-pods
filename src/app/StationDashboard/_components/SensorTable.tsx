import React, { useMemo, useState } from 'react';
import { useList } from '../../../hooks/sensor/useList';
import {
  ListSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGetRequest,
  SortField,
} from '@upstream/upstream-api';
import DataTable from '../../common/DataTable';
import FilterToolbar, {
  CustomFilterConfig,
} from '../../common/FilterToolbar/FilterToolbar';
import FilteringVariablesButton from '../../Home/_components/CampaignFilterToolbar/_components/FilteringVariables/FilteringVariablesButton/FilteringVariablesButton';
import { FilteringButton } from './FilteringModal';
import QueryWrapper from '../../common/QueryWrapper';
import { useDeleteBySensor } from '../../../hooks/measurements/useDeleteBySensor';
import { useDeleteSensor } from '../../../hooks/sensor/useDeleteSensor';
import ConfirmDialog from '../../common/ConfirmDialog/ConfirmDialog';
import { useHistory } from 'react-router-dom';

interface SensorTableProps {
  campaignId: string;
  stationId: string;
}

// Map table column keys to API sort fields
const columnToSortField: Record<string, SortField> = {
  variablename: SortField.Variablename,
  alias: SortField.Alias,
  'statistics.count': SortField.Count,
  'statistics.avgValue': SortField.AvgValue,
  'statistics.minValue': SortField.MinValue,
  'statistics.maxValue': SortField.MaxValue,
  units: SortField.Units,
  postprocess: SortField.Postprocess,
  postprocessscript: SortField.Postprocessscript,
};

export const SensorTable: React.FC<SensorTableProps> = ({
  campaignId,
  stationId,
}) => {
  /** Filtering by pre existing variables */
  const [variableNames, setVariableNames] = useState<string[]>([]);

  /** Free text filter */
  const [variableUnit, setVariableUnit] = useState<string | undefined>(
    undefined,
  );
  const [variableDescription, setVariableDescription] = useState<
    string | undefined
  >(undefined);
  const [variableAliases, setVariableAliases] = useState<string | undefined>(
    undefined,
  );
  const [page, setPage] = useState<number>(1);

  /** Sorting state */
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    null,
  );

  /** Delete confirmation dialog state */
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    sensorId: string;
    sensorName: string;
    deleteType: 'sensor' | 'measurements';
  }>({
    isOpen: false,
    sensorId: '',
    sensorName: '',
    deleteType: 'measurements',
  });

  const deleteMeasurementsMutation = useDeleteBySensor();
  const deleteSensorMutation = useDeleteSensor();
  const history = useHistory();

  /** Dropdown state for each sensor */
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  const filters: ListSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGetRequest =
    useMemo(
      () => ({
        campaignId: parseInt(campaignId),
        stationId: parseInt(stationId),
        variableName: variableNames.length > 0 ? variableNames[0] : undefined,
        units: variableUnit ? variableUnit : undefined,
        descriptionContains: variableDescription
          ? variableDescription
          : undefined,
        alias: variableAliases ? variableAliases : undefined,
        page: page,
        sortBy: sortColumn ? columnToSortField[sortColumn] : undefined,
        sortOrder: sortDirection || undefined,
      }),
      [
        campaignId,
        stationId,
        variableNames,
        variableUnit,
        variableDescription,
        variableAliases,
        page,
        sortColumn,
        sortDirection,
      ],
    );

  const {
    data: sensors,
    isLoading: sensorsLoading,
    error: sensorsError,
  } = useList({ filters });

  const handleTextFiltersSubmit = (filters: {
    unit?: string;
    description?: string;
    alias?: string;
  }) => {
    setVariableUnit(filters.unit);
    setVariableDescription(filters.description);
    setVariableAliases(filters.alias);
  };

  const handleTextFiltersClear = () => {
    setVariableUnit(undefined);
    setVariableDescription(undefined);
    setVariableAliases(undefined);
  };

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    // Only set sort if the column is in our mapping
    if (column in columnToSortField) {
      setSortColumn(column);
      setSortDirection(direction);
      setPage(1); // Reset to first page when sorting changes
    }
  };

  const handleDeleteClick = (sensorId: string, sensorName: string, deleteType: 'sensor' | 'measurements') => {
    setDeleteDialog({
      isOpen: true,
      sensorId,
      sensorName,
      deleteType,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.deleteType === 'sensor') {
      deleteSensorMutation.mutate({
        campaignId,
        stationId,
        sensorId: deleteDialog.sensorId,
      });
    } else {
      deleteMeasurementsMutation.mutate({
        campaignId,
        stationId,
        sensorId: deleteDialog.sensorId,
      });
    }
    setDeleteDialog({ isOpen: false, sensorId: '', sensorName: '', deleteType: 'measurements' });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, sensorId: '', sensorName: '', deleteType: 'measurements' });
  };

  const toggleDropdown = (sensorId: string) => {
    const newOpenDropdowns = new Set(openDropdowns);
    if (newOpenDropdowns.has(sensorId)) {
      newOpenDropdowns.delete(sensorId);
    } else {
      newOpenDropdowns.add(sensorId);
    }
    setOpenDropdowns(newOpenDropdowns);
  };

  const handleViewSensor = (sensorId: string) => {
    history.push(`/campaigns/${campaignId}/stations/${stationId}/sensors/${sensorId}`);
    setOpenDropdowns(new Set()); // Close all dropdowns
  };

  const filterConfigs = [
    {
      type: 'custom' as const,
      id: 'variable-filter',
      component: (
        <FilteringVariablesButton
          sensorVariables={variableNames}
          onSubmit={setVariableNames}
          onClear={() => setVariableNames([])}
        />
      ),
    } as CustomFilterConfig,
    {
      type: 'custom' as const,
      id: 'text-filter',
      component: (
        <FilteringButton
          onSubmit={handleTextFiltersSubmit}
          onClear={handleTextFiltersClear}
          initialFilters={{
            unit: variableUnit,
            description: variableDescription,
            alias: variableAliases,
          }}
        />
      ),
    } as CustomFilterConfig,
  ];

  return (
    <section className="flex flex-col gap-10">
      <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
        Explore sensors
      </h2>
      <FilterToolbar title="Filters" filters={filterConfigs} />
      <QueryWrapper isLoading={sensorsLoading} error={sensorsError}>
        {sensors && (
          <DataTable
            data={sensors}
            columns={[
              { key: 'variablename', label: 'Variable Name' },
              { key: 'alias', label: 'Alias' },
              { key: 'statistics.count', label: 'Count' },
              { key: 'statistics.avgValue', label: 'Average' },
              { key: 'statistics.minValue', label: 'Min' },
              { key: 'statistics.maxValue', label: 'Max' },
              { key: 'units', label: 'Units' },
              { key: 'postprocess', label: 'Post.' },
              { key: 'postprocessscript', label: 'Script' },
            ]}
            currentPage={page}
            setCurrentPage={setPage}
            itemsPerPage={10}
            setItemsPerPage={(page) => console.log(page)}
            getRowLink={(item) =>
              `/campaigns/${campaignId}/stations/${stationId}/sensors/${item.id}`
            }
            onSort={handleSort}
            actions={(item) => (
              <div className="relative">
                <button
                  onClick={() => toggleDropdown(item.id.toString())}
                  className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Actions ▼
                </button>
                {openDropdowns.has(item.id.toString()) && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                    <button
                      onClick={() => handleViewSensor(item.id.toString())}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      View
                    </button>
                    <div className="border-t border-gray-200"></div>
                    <button
                      onClick={() => {
                        handleDeleteClick(item.id.toString(), item.variablename || 'Unknown', 'sensor');
                        setOpenDropdowns(new Set()); // Close dropdown
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      disabled={deleteSensorMutation.isPending}
                    >
                      Delete Sensor
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteClick(item.id.toString(), item.variablename || 'Unknown', 'measurements');
                        setOpenDropdowns(new Set()); // Close dropdown
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      disabled={deleteMeasurementsMutation.isPending}
                    >
                      Delete Measurements
                    </button>
                  </div>
                )}
              </div>
            )}
          />
        )}
      </QueryWrapper>
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title={deleteDialog.deleteType === 'sensor' ? 'Delete Sensor' : 'Delete Sensor Measurements'}
        message={
          deleteDialog.deleteType === 'sensor'
            ? `Are you sure you want to permanently delete sensor "${deleteDialog.sensorName}"? This will remove the sensor and all its measurement data. This action cannot be undone.`
            : `Are you sure you want to delete all measurements for sensor "${deleteDialog.sensorName}"? The sensor will remain but all its measurement data will be permanently removed. This action cannot be undone.`
        }
        confirmText={deleteDialog.deleteType === 'sensor' ? 'Delete Sensor' : 'Delete Measurements'}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={deleteDialog.deleteType === 'sensor' ? deleteSensorMutation.isPending : deleteMeasurementsMutation.isPending}
        danger={true}
      />
    </section>
  );
};
