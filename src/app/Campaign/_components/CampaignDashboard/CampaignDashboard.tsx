import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDetail } from '../../../../hooks/campaign/useDetail';
import { useAuth } from '../../../../contexts/AuthContextState';
import { useCampaignNotes, useCampaignNoteLocations, useCreateCampaignNote, useDeleteNote, useUpdateNote } from '../../../../hooks/notes/useNotes';
import { NotesList } from '../../../common/Notes/NotesList';
import { useQueryClient } from '@tanstack/react-query';
import { useDelete } from '../../../../hooks/campaign/useDelete';
import { usePublish, useUnpublish } from '../../../../hooks/campaign/usePublish';
import { useDelete as useDeleteStations } from '../../../../hooks/station/useDelete';
import QueryWrapper from '../../../common/QueryWrapper';
import ConfirmDialog from '../../../common/ConfirmDialog';
import PublishErrorModal from '../../../common/PublishErrorModal';
import PublishSuccessModal from '../../../common/PublishSuccessModal';
import StationCard from '../../../Station/_components/StationCard';
import GeometryMap from '../../../common/GeometryMap/GeometryMap';
import EditMetadataModal from '../../../../components/MetadataFields/EditMetadataModal';
import { useUpdate as useUpdateCampaign } from '../../../../hooks/campaign/useUpdate';
import { useOrganizations } from '../../../../hooks/ckan/useOrganizations';
import {
  formatPublishError,
  formatPublishSuccess,
  type FormattedPublishError,
  type FormattedPublishSuccess,
} from '../../../../hooks/api/publishDebug';
// PublishButton was used previously; dropdown replicates its behavior here
import { hasValidGeometry } from '../../../../utils/geometryValidation';

interface CampaignDashboardProps {
  campaignId: string;
}

const CampaignDashboard: React.FC<CampaignDashboardProps> = ({
  campaignId,
}) => {
  const history = useHistory();
  const { campaign, isLoading, error } = useDetail(campaignId);
  const { username } = useAuth();
  const campaignIdNum = parseInt(campaignId);
  const { data: notesData, isLoading: notesLoading } = useCampaignNotes(campaignIdNum);
  const { data: noteLocationsData } = useCampaignNoteLocations(campaignIdNum);
  const createNote = useCreateCampaignNote(campaignIdNum);
  const deleteNote = useDeleteNote(['notes', 'campaign', campaignIdNum]);
  const updateNote = useUpdateNote(['notes', 'campaign', campaignIdNum]);
  // Since we removed allocations, allow all authenticated users to manage campaigns
  const canDeleteData = true; // Previously: useIsOwner(campaignId)
  const deleteCampaign = useDelete();
  const deleteStations = useDeleteStations(campaignId);
  const publishCampaign = usePublish();
  const unpublishCampaign = useUnpublish();
  const updateCampaign = useUpdateCampaign();
  const { data: organizations } = useOrganizations();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteStationsDialog, setShowDeleteStationsDialog] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [showStationsActionDropdown, setShowStationsActionDropdown] = useState(false);
  const [showEditMetadataModal, setShowEditMetadataModal] = useState(false);
  const [publishOverride, setPublishOverride] = useState<boolean | null>(null);
  const [publishError, setPublishError] = useState<FormattedPublishError | null>(null);
  const [publishSuccess, setPublishSuccess] = useState<FormattedPublishSuccess | null>(null);

  const handleDeleteCampaign = async () => {
    try {
      await deleteCampaign.mutateAsync(campaignId);
      history.push('/');
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    }
  };

  const handleDeleteStations = async () => {
    try {
      await deleteStations.mutateAsync();
      setShowDeleteStationsDialog(false);
    } catch (error) {
      console.error('Failed to delete stations:', error);
    }
  };

  const handlePublish = async (cascade?: boolean) => {
    try {
      setPublishError(null);
      setPublishSuccess(null);
      const response = await publishCampaign.mutateAsync({
        campaignId: parseInt(campaignId),
        cascade: cascade || false,
      });
      // Optimistically update campaign cache so UI shows the unpublish state immediately
      try {
        queryClient.setQueryData(['campaign', campaignId], (old: unknown) => {
          if (!old) return old;
          const oldObj = old as Record<string, unknown>;
          return {
            ...oldObj,
            isPublished: true,
          };
        });
      } catch {
        // ignore
      }
      setPublishOverride(true);
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      setPublishSuccess(formatPublishSuccess('campaign', response));
    } catch (error) {
      console.error('Failed to publish campaign:', error);
      const requestId = (error as Record<string, unknown>).__requestId;
      const publishResponse = (error as Record<string, unknown>).__publishResponse;
      console.error('[publish][campaign] dashboard failure', {
        requestId,
        publishResponse,
      });
      setPublishError(formatPublishError(error));
    }
  };

  const handleUnpublish = async () => {
    try {
      setPublishError(null);
      setPublishSuccess(null);
      await unpublishCampaign.mutateAsync(parseInt(campaignId));
      setPublishOverride(false);
    } catch (error) {
      console.error('Failed to unpublish campaign:', error);
      setPublishError(formatPublishError(error));
    }
  };

  const handleSaveMetadata = async (payload: {
    name?: string | null;
    description?: string | null;
    contactName?: string | null;
    contactEmail?: string | null;
    allocation?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    metadata?: Record<string, unknown> | null;
  }) => {
    await updateCampaign.mutateAsync({
      campaignId,
      campaignUpdate: {
        name: payload.name ?? campaign?.name ?? '',
        description: payload.description ?? null,
        contactName: payload.contactName ?? null,
        contactEmail: payload.contactEmail ?? null,
        allocation: payload.allocation ?? null,
        startDate: payload.startDate ?? null,
        endDate: payload.endDate ?? null,
        metadata: payload.metadata ?? {},
      },
    });
    setShowEditMetadataModal(false);
  };
  const _campaignObj = campaign as unknown as Record<string, unknown>;
  console.log(_campaignObj)
  // Check multiple possible locations for published flag (snake_case, camelCase, summary)
  const raw = campaign as unknown as Record<string, unknown>;
  const topIsPublished = Boolean(raw?.['is_published'] || raw?.['isPublished'] || raw?.['published_at'] || raw?.['publishedAt']);
  const summary = _campaignObj?.['summary'] as Record<string, unknown> | undefined;
  const summaryIsPublished = Boolean(summary?.['is_published'] || summary?.['isPublished']);
  const hasStations = Array.isArray(campaign?.stations) && campaign.stations.length > 0;

  // Also consider publish mutation error which may have reported "already published"
  const publishErrBody = (publishCampaign as unknown as { error?: unknown })?.error
    ? ((publishCampaign as unknown as { error?: { __bodyText?: unknown } }).error?.__bodyText as string | undefined)
    : undefined;
  let publishErrIndicatesPublished = false;
  if (publishErrBody && typeof publishErrBody === 'string') {
    try {
      const parsed = JSON.parse(publishErrBody);
      const detail = parsed && parsed.detail ? parsed.detail : parsed;
      if (typeof detail === 'string' && detail.toLowerCase().includes('already published')) {
        publishErrIndicatesPublished = true;
      }
    } catch {
      if ((publishErrBody as string).toLowerCase().includes('already published')) {
        publishErrIndicatesPublished = true;
      }
    }
  }

  const isPublishedFlag = (publishOverride !== null)
    ? publishOverride
    : (topIsPublished || summaryIsPublished || publishErrIndicatesPublished);

  React.useEffect(() => {
    // debug: log campaign object and published flag when page loads
    console.log('Campaign debug', { campaign, isPublishedFlag });
  }, [campaign, isPublishedFlag]);

  React.useEffect(() => {
    const serverPublished = topIsPublished || summaryIsPublished || publishErrIndicatesPublished;
    if (publishOverride !== null && publishOverride !== serverPublished) {
      console.warn('[publish][campaign] publishOverride masking server-derived state', {
        campaignId,
        publishOverride,
        serverPublished,
      });
    }
  }, [
    campaignId,
    publishOverride,
    topIsPublished,
    summaryIsPublished,
    publishErrIndicatesPublished,
  ]);

  React.useEffect(() => {
    setPublishOverride(null);
  }, [campaignId]);

  if (!campaign) {
    return null;
  }

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      <div className="px-4 md:px-8 lg:px-12 lg:py-12 lg:h-5/6 py-12 bg-secondary-100">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
          <div className='breadcrumbs'>
            <a href='/'>Explore campaigns</a>
            <span>&gt;</span>
            <a href='#' className='active'>{campaign?.name}</a>
          </div>
          {/* Header Section */}
          <header className="mb-8">
            {/* <Navigation /> */}
            <div className="mt-6 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{campaign?.name}</h1>
                {isPublishedFlag && (
                  <div className="inline-block ml-3 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Published
                  </div>
                )}
                <p className="text-gray-600">
                  {campaign?.startDate?.toLocaleDateString()} -{' '}
                  {campaign?.endDate?.toLocaleDateString()}
                </p>
              </div>
              <div className="relative">
                <div className="flex gap-3">
                  {canDeleteData && (
                    <div className="relative">
                      <button
                        onClick={() => setShowActionDropdown((s) => !s)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center gap-2"
                      >
                        Actions
                        <svg
                          className={`w-4 h-4 transition-transform`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                        {showActionDropdown && (
                          <div
                            className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-[99999]"
                            style={{ zIndex: 99999 }}
                          >
                          {/* Publish / Unpublish */}
                          {hasStations ? (
                            isPublishedFlag ? (
                              <button
                                onClick={async () => {
                                  setShowActionDropdown(false);
                                  await handleUnpublish();
                                }}
                                className="block w-full text-left px-4 py-3 text-sm text-orange-600 hover:bg-orange-50 hover:text-orange-900 transition-colors border-b border-gray-100"
                              >
                                Unpublish Campaign
                              </button>
                            ) : (
                              <button
                                onClick={async () => {
                                  setShowActionDropdown(false);
                                  await handlePublish(true);
                                }}
                                className="block w-full text-left px-4 py-3 text-sm text-green-600 hover:bg-green-50 hover:text-green-900 transition-colors border-b border-gray-100"
                              >
                                Publish Campaign
                              </button>
                            )
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 border-b border-gray-100">
                              Add a station to enable CKAN publishing
                            </div>
                          )}

                          {/* Station actions */}
                          <button
                            onClick={() => {
                              setShowActionDropdown(false);
                              setShowEditMetadataModal(true);
                            }}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors border-b border-gray-100"
                          >
                            Edit Metadata
                          </button>

                          <button
                            onClick={() => {
                              setShowActionDropdown(false);
                              history.push(`/campaigns/${campaignId}/stations/new`);
                            }}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors border-b border-gray-100"
                          >
                            Create New Station
                          </button>

                          <button
                            onClick={() => {
                              setShowActionDropdown(false);
                              setShowDeleteStationsDialog(true);
                            }}
                            disabled={!campaign?.stations || campaign.stations.length === 0}
                            className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-100"
                          >
                            Delete All Stations
                          </button>

                          <button
                            onClick={() => {
                              setShowActionDropdown(false);
                              setShowDeleteDialog(true);
                            }}
                            className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-900 transition-colors"
                          >
                            Delete Campaign
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {hasValidGeometry(campaign) && (
            <section className="col-span-2 grid grid-cols-1 gap-8 mb-8 h-96 w-full">
              <div className="bg-white rounded-lg shadow-md p-6 w-full">
                <h2 className="text-xl font-semibold mb-4">
                  Campaign Coverage
                </h2>
                <div className="h-3/4 w-full">
                  <GeometryMap
                    geoJSON={campaign.geometry as GeoJSON.Geometry}
                    markers={(noteLocationsData?.items ?? [])
                      .filter((note) => note.location)
                      .map((note) => ({
                        position: note.location as GeoJSON.Point,
                        color: '#ea580c',
                        label: note.content,
                      }))}
                  />
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="px-4 md:px-8 lg:px-12 pt-8">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
          <NotesList
            notes={notesData?.items ?? []}
            isLoading={notesLoading}
            currentUsername={username ?? undefined}
            canWrite={Boolean(username)}
            onAdd={(content) => createNote.mutate(content)}
            onDelete={(noteId) =>
              deleteNote.mutate({
                noteId,
                deletePath: `/campaigns/${campaignIdNum}/notes/${noteId}`,
              })
            }
            onUpdate={(noteId, content) =>
              updateNote.mutate({
                updatePath: `/campaigns/${campaignIdNum}/notes/${noteId}`,
                content,
              })
            }
            isAdding={createNote.isPending}
            isDeleting={deleteNote.isPending}
            isUpdating={updateNote.isPending}
          />
        </div>
      </div>

      <div className="px-4 md:px-8 lg:px-12 lg:py-12 lg:h-5/6 py-12">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Stations</h2>
            <div className="flex gap-3">
              {canDeleteData && (
                <div className="relative">
                  <button
                    onClick={() => setShowStationsActionDropdown((s) => !s)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center gap-2"
                  >
                    Actions
                    <svg
                      className={`w-4 h-4 transition-transform`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showStationsActionDropdown && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-[99999]"
                      style={{ zIndex: 99999 }}
                    >
                      <button
                        onClick={() => {
                          setShowStationsActionDropdown(false);
                          history.push(`/campaigns/${campaignId}/stations/new`);
                        }}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors border-b border-gray-100"
                      >
                        Create New Station
                      </button>

                      <button
                        onClick={() => {
                          setShowStationsActionDropdown(false);
                          setShowDeleteStationsDialog(true);
                        }}
                        disabled={!campaign?.stations || campaign.stations.length === 0}
                        className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-100"
                      >
                        Delete All Stations
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {campaign &&
                campaign?.stations?.map((station) => (
                  <StationCard
                    key={station.id}
                    station={station}
                    campaignId={campaignId}
                    to={`/campaigns/${campaignId}/stations/${station.id}`}
                  />
                ))}
            </div>
            <div className="flex gap-4">
              {/* <FilterControls /> */}
              {/* <ExportButton onExport={() => {}} /> */}
            </div>
            {/* <HeatMap campaignId={campaignId} /> */}
          </section>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${campaign?.name}"? This action will permanently delete the campaign and all its stations, sensors, and measurements. This cannot be undone.`}
        confirmText="Delete Campaign"
        cancelText="Cancel"
        onConfirm={handleDeleteCampaign}
        onCancel={() => setShowDeleteDialog(false)}
        isLoading={deleteCampaign.isPending}
        danger={true}
      />

      <ConfirmDialog
        isOpen={showDeleteStationsDialog}
        title="Delete All Stations"
        message={`Are you sure you want to delete all stations in "${campaign?.name}"? This action will permanently delete all stations, their sensors, and measurements. This cannot be undone.`}
        confirmText="Delete All Stations"
        cancelText="Cancel"
        onConfirm={handleDeleteStations}
        onCancel={() => setShowDeleteStationsDialog(false)}
        isLoading={deleteStations.isPending}
        danger={true}
      />

      <PublishErrorModal
        error={publishError}
        entityLabel="campaign"
        onClose={() => setPublishError(null)}
      />

      <PublishSuccessModal
        result={publishSuccess}
        entityLabel="campaign"
        onClose={() => setPublishSuccess(null)}
      />

      <EditMetadataModal
        isOpen={showEditMetadataModal}
        onClose={() => setShowEditMetadataModal(false)}
        scope="campaign"
        title={`Edit Metadata: ${campaign?.name ?? 'Campaign'}`}
        extraFields={[
          {
            key: 'name',
            label: 'Dataset Name',
            type: 'text',
            required: true,
            helpText: 'Used as the campaign title and CKAN dataset title.',
          },
          {
            key: 'allocation',
            label: 'Organization',
            type: 'select',
            required: true,
            helpText: 'CKAN organization used when publishing the dataset.',
            options: (organizations ?? []).map((organization) => ({
              label:
                organization.display_name ||
                organization.title ||
                organization.name,
              value: organization.name,
            })),
          },
          {
            key: 'description',
            label: 'Description',
            type: 'textarea',
            helpText: 'Used as the CKAN dataset description.',
          },
          {
            key: 'contactName',
            label: 'Contact Name',
            type: 'text',
            helpText: 'Maps to the CKAN author/maintainer name when configured.',
          },
          {
            key: 'contactEmail',
            label: 'Contact Email',
            type: 'email',
            helpText: 'Maps to the CKAN author/maintainer email when configured.',
          },
          {
            key: 'startDate',
            label: 'Start Date',
            type: 'date',
            helpText: 'Used for CKAN temporal coverage start when available.',
          },
          {
            key: 'endDate',
            label: 'End Date',
            type: 'date',
            helpText: 'Used for CKAN temporal coverage end when available.',
          },
        ]}
        initialValues={{
          name: campaign?.name ?? '',
          allocation: campaign?.allocation ?? '',
          description: campaign?.description ?? '',
          contactName: campaign?.contactName ?? '',
          contactEmail: campaign?.contactEmail ?? '',
          startDate: campaign?.startDate ?? null,
          endDate: campaign?.endDate ?? null,
        }}
        initialMetadata={campaign?.metadata as
          | Record<string, unknown>
          | null
          | undefined}
        isSaving={updateCampaign.isPending}
        saveError={updateCampaign.error?.message ?? null}
        onSave={handleSaveMetadata}
      />
    </QueryWrapper>
  );
};

export default CampaignDashboard;
