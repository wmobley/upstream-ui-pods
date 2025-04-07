import { useDetail } from '../../../../hooks/station/useDetail';
import QueryWrapper from '../../../common/QueryWrapper';
import React, { useMemo, useState } from 'react';
import { SensorItem } from '@upstream/upstream-api';
import StatsSection from './StatsSection';
import FilterToolbar from '../../../common/FilterToolbar/FilterToolbar';
import { useList } from '../../../../hooks/sensor/useList';

interface StationDashboardProps {
  campaignId: string;
  stationId: string;
}

const StationDashboard: React.FC<StationDashboardProps> = ({
  campaignId,
  stationId,
}) => {
  const { station, isLoading, error } = useDetail(campaignId, stationId);

  const {
    data: sensors,
    isLoading: sensorsLoading,
    error: sensorsError,
  } = useList(campaignId, stationId);

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

            <FilterToolbar title="Filters">
              {/* <FilteringVariablesButton
              sensorVariables={sensorVariables}
              onSubmit={setSensorVariables}
              onClear={() => setSensorVariables([])}
            /> */}
            </FilterToolbar>
          </section>
        </QueryWrapper>
      </div>
    </QueryWrapper>
  );
};

export default StationDashboard;
