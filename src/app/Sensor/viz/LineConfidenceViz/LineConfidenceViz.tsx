import { useState } from 'react';
import QueryWrapper from '../../../common/QueryWrapper';
import MeasurementSummary from '../../../SensorDashboard/_components/MeasurementSummary';
import { Chart } from './_components/Chart';
import { AdditionalSensorsList } from './_components/AdditionalSensorsList';
import { LineConfidenceProvider } from './context/LineConfidenceContext';
import { useLineConfidence } from './context/LineConfidenceContextState';
import Controls from './_components/Controls';
import SensorFilteringModal from './_components/SensorFilteringModal';
import {useDetail as campaignInfo} from '../../../../hooks/campaign/useDetail';
import { useDetail as stationInfo } from '../../../../hooks/station/useDetail';
import { useDetail } from '../../../../hooks/sensor/useDetail';
import { renderChm } from '../../../../utils/helpers';
import { NotesList } from '../../../common/Notes/NotesList';
import { useMeasurementNotes, useCreateMeasurementNote, useDeleteNote, useUpdateNote } from '../../../../hooks/notes/useNotes';
import { useAuth } from '../../../../contexts/AuthContextState';

interface MeasurementsSummaryProps {
  campaignId: string;
  stationId: string;
  sensorId: string;
}

// Main Line Confidence component which wraps everything in the provider
const LineConfidenceViz = ({
  campaignId,
  stationId,
  sensorId,
}: MeasurementsSummaryProps) => {
  const { campaign } = campaignInfo(campaignId);
  const { station } = stationInfo(campaignId, stationId);
  const { data:sensor } = useDetail(campaignId, stationId, sensorId);
  const [selectedMeasurementId, setSelectedMeasurementId] = useState<number | null>(null);

  return (
    <div className="px-4 md:px-8 lg:px-12 lg:py-12 lg:h-5/6 py-12">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8 mb-6">
        <div className='breadcrumbs text-xs'>
          <a href='/'>Campaigns</a>
          <span>&gt;</span>
          <a href={'/campaigns/' + campaignId}>{ campaign?.name || "campaign " + campaignId + " ..." }</a>
          <span>&gt;</span>
          <a href={'/campaigns/' + campaignId + "/stations/" + stationId}>{ station?.name || "station " + campaignId + " ..." }</a>
          <span>&gt;</span>
          <a href={'/campaigns/' + campaignId + "/stations/" + stationId + '/sensors/' + sensorId}>
            {renderChm(sensor?.variablename || sensor?.alias || 'sensor ' + sensorId)}
          </a>
          <span>&gt;</span>
          <a href='#' className='active'>Confidence</a>
        </div>
      </div>
      <LineConfidenceProvider
        campaignId={campaignId}
        stationId={stationId}
        sensorId={sensorId}
      >
        <LineConfidenceContent
          campaignId={campaignId}
          stationId={stationId}
          sensorId={sensorId}
          selectedMeasurementId={selectedMeasurementId}
          onSelectMeasurementForNote={setSelectedMeasurementId}
        />
      </LineConfidenceProvider>
    </div>
  );
};

interface LineConfidenceContentProps {
  campaignId: string;
  stationId: string;
  sensorId: string;
  selectedMeasurementId: number | null;
  onSelectMeasurementForNote: (id: number) => void;
}

// Inner component that uses the context
const LineConfidenceContent = ({
  campaignId,
  stationId,
  sensorId,
  selectedMeasurementId,
  onSelectMeasurementForNote,
}: LineConfidenceContentProps) => {
  const { data, isLoading, error, addSensorModalOpen } = useLineConfidence();
  const { username } = useAuth();
  const campaignIdNum = parseInt(campaignId);
  const stationIdNum = parseInt(stationId);
  const sensorIdNum = parseInt(sensorId);
  const noteQueryKey = selectedMeasurementId
    ? ['notes', 'measurement', campaignIdNum, stationIdNum, selectedMeasurementId]
    : [];
  const { data: notesData, isLoading: notesLoading } = useMeasurementNotes(
    campaignIdNum, stationIdNum, sensorIdNum, selectedMeasurementId ?? 0
  );
  const createNote = useCreateMeasurementNote(campaignIdNum, stationIdNum, sensorIdNum, selectedMeasurementId ?? 0);
  const deleteNote = useDeleteNote(noteQueryKey);
  const updateNote = useUpdateNote(noteQueryKey);

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      {data && (
        <div className="mx-auto flex flex-col max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <MeasurementSummary data={data} />
          <Controls />
          <AdditionalSensorsList />
          <Chart onSelectMeasurementForNote={onSelectMeasurementForNote} />
          {addSensorModalOpen && <SensorFilteringModal />}
          {selectedMeasurementId !== null && (
            <div className="mt-6">
              <p className="mb-2 text-xs text-gray-500">
                Notes for measurement #{selectedMeasurementId} —{' '}
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => onSelectMeasurementForNote(selectedMeasurementId)}
                >
                  change
                </button>
              </p>
              <NotesList
                notes={notesData?.items ?? []}
                isLoading={notesLoading}
                currentUsername={username ?? undefined}
                canWrite={Boolean(username)}
                onAdd={(content) => createNote.mutate(content)}
                onDelete={(noteId) =>
                  deleteNote.mutate({
                    noteId,
                    deletePath: `/campaigns/${campaignIdNum}/stations/${stationIdNum}/sensors/${sensorIdNum}/measurements/${selectedMeasurementId}/notes/${noteId}`,
                  })
                }
                onUpdate={(noteId, content) =>
                  updateNote.mutate({
                    updatePath: `/campaigns/${campaignIdNum}/stations/${stationIdNum}/sensors/${sensorIdNum}/measurements/${selectedMeasurementId}/notes/${noteId}`,
                    content,
                  })
                }
                isAdding={createNote.isPending}
                isDeleting={deleteNote.isPending}
                isUpdating={updateNote.isPending}
              />
            </div>
          )}
        </div>
      )}
    </QueryWrapper>
  );
};

export default LineConfidenceViz;
