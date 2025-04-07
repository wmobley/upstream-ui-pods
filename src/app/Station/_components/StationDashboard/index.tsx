import { useDetail } from '../../../../hooks/station/useDetail';
import QueryWrapper from '../../../common/QueryWrapper';
import React, { useMemo, useState } from 'react';
import StatsSection from './StatsSection';
import FilterToolbar, {
  CustomFilterConfig,
} from '../../../common/FilterToolbar/FilterToolbar';
import { useList } from '../../../../hooks/sensor/useList';
import FilteringVariablesButton from '../../../Home/_components/CampaignFilterToolbar/_components/FilteringVariables/FilteringVariablesButton/FilteringVariablesButton';
import { ListSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGetRequest } from '@upstream/upstream-api';

interface StationDashboardProps {
  campaignId: string;
  stationId: string;
}

const StationDashboard: React.FC<StationDashboardProps> = ({
  campaignId,
  stationId,
}) => {
  const { station, isLoading, error } = useDetail(campaignId, stationId);

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
      }),
      [
        campaignId,
        stationId,
        variableNames,
        variableUnit,
        variableDescription,
        variableAliases,
      ],
    );

  const {
    data: sensors,
    isLoading: sensorsLoading,
    error: sensorsError,
  } = useList({ filters });

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
  ];
  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <header className="mb-8">
          <div className="mt-6">
            <h1 className="text-3xl font-bold">{station?.name}</h1>
            <p className="text-gray-600">{station?.description}</p>
          </div>
        </header>

        <section className="h-[400px] grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {station && <StatsSection station={station} />}
        </section>

        <QueryWrapper isLoading={sensorsLoading} error={sensorsError}>
          <section className="flex flex-col gap-10">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Explore sensors
            </h2>

            <FilterToolbar title="Filters" filters={filterConfigs} />
            {sensors && JSON.stringify(sensors)}
          </section>
        </QueryWrapper>
      </div>
    </QueryWrapper>
  );
};

export default StationDashboard;
