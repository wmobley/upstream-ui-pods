import React, { useMemo, useState } from 'react';
import { useList } from '../../../hooks/sensor/useList';
import { ListSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGetRequest } from '@upstream/upstream-api';
import DataTable from '../../common/DataTable';
import FilterToolbar, {
  CustomFilterConfig,
} from '../../common/FilterToolbar/FilterToolbar';
import FilteringVariablesButton from '../../Home/_components/CampaignFilterToolbar/_components/FilteringVariables/FilteringVariablesButton/FilteringVariablesButton';
import { FilteringButton } from './FilteringModal';
import QueryWrapper from '../../common/QueryWrapper';

interface SensorTableProps {
  campaignId: string;
  stationId: string;
}

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
      }),
      [
        campaignId,
        stationId,
        variableNames,
        variableUnit,
        variableDescription,
        variableAliases,
        page,
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
              { key: 'postprocess', label: 'Postprocess' },
              { key: 'postprocessscript', label: 'Postprocess Script' },
            ]}
            currentPage={page}
            setCurrentPage={setPage}
            itemsPerPage={10}
            setItemsPerPage={(page) => console.log(page)}
            getRowLink={(item) =>
              `/campaigns/${campaignId}/stations/${stationId}/sensors/${item.id}`
            }
          />
        )}
      </QueryWrapper>
    </section>
  );
};
