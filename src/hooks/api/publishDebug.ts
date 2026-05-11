import { PublishResponse } from '@upstream/upstream-api';

type PublishEntity = 'campaign' | 'station';

export type PublishDebugResponse = Partial<PublishResponse> & {
  success?: boolean;
  message?: string;
  detail?: string;
  errors?: string[];
  published_count?: number;
  publishedCount?: number;
  cascaded_items?: string[];
  error_code?: string;
  errorCode?: string;
  error_title?: string;
  errorTitle?: string;
  error_detail?: string;
  errorDetail?: string;
  ckan_dataset_name?: string;
  ckanDatasetName?: string;
  ckan_dataset_url?: string;
  ckanDatasetUrl?: string;
};

type PublishLikeError = Error & {
  __bodyText?: string;
  __requestId?: string;
  __publishResponse?: PublishDebugResponse;
};

export type FormattedPublishError = {
  title: string;
  message: string;
  details: string[];
  code?: string;
  requestId?: string;
  datasetName?: string;
  datasetUrl?: string;
};

export type FormattedPublishSuccess = {
  title: string;
  message: string;
  details: string[];
  publishedCount?: number;
  datasetName?: string;
  datasetUrl?: string;
};

export const createPublishRequestId = (entity: PublishEntity, ids: Array<number | string>) => {
  const suffix = ids.map(String).join('-');
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${entity}-publish-${suffix}-${randomPart}`;
};

export const buildPublishInitOverrides = () => ({
  headers: {
  },
});

export const appendPublishRequestId = (url: string, requestId: string) => {
  const parsed = new URL(url, window.location.origin);
  parsed.searchParams.set('_request_id', requestId);
  return parsed.toString();
};

export const logPublishResponse = (
  entity: PublishEntity,
  requestId: string,
  response: PublishDebugResponse
) => {
  console.info(`[publish][${entity}] response`, {
    requestId,
    success: response.success,
    message: response.message,
    errors: response.errors,
    publishedCount: response.published_count,
    cascadedItems: response.cascadedItems,
    isPublished: response.isPublished,
    publishedAt: response.publishedAt,
  });
};

export const ensurePublishSucceeded = (
  entity: PublishEntity,
  requestId: string,
  response: PublishDebugResponse
): PublishDebugResponse => {
  if (response.success) {
    return response;
  }

  const error = new Error(
    response.message || `Publish request failed for ${entity}.`
  ) as PublishLikeError;
  error.__requestId = requestId;
  error.__publishResponse = response;
  error.__bodyText = JSON.stringify(response);
  console.error(`[publish][${entity}] application failure`, {
    requestId,
    response,
  });
  throw error;
};

export const parsePublishResponseText = (
  text: string,
): PublishDebugResponse => {
  if (!text.trim()) {
    return {};
  }

  try {
    return JSON.parse(text) as PublishDebugResponse;
  } catch {
    return {
      message: text,
      detail: text,
    };
  }
};

const readPublishResponseFromError = (error: unknown): PublishDebugResponse | undefined => {
  const record = error as Record<string, unknown> | null;
  const direct = record?.__publishResponse;
  if (direct && typeof direct === 'object') {
    return direct as PublishDebugResponse;
  }

  const bodyText = record?.__bodyText;
  if (typeof bodyText === 'string') {
    return parsePublishResponseText(bodyText);
  }

  return undefined;
};

export const formatPublishError = (error: unknown): FormattedPublishError => {
  const response = readPublishResponseFromError(error);
  const record = error as Record<string, unknown> | null;
  const details = Array.isArray(response?.errors)
    ? response.errors.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];
  const code = response?.error_code || response?.errorCode;
  const title =
    response?.error_title ||
    response?.errorTitle ||
    (code ? code.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (char) => char.toUpperCase()) : 'Publishing failed');
  const message =
    response?.error_detail ||
    response?.errorDetail ||
    response?.detail ||
    response?.message ||
    details[0] ||
    (error instanceof Error ? error.message : 'The publish request failed.');

  return {
    title,
    message,
    details,
    code,
    requestId: typeof record?.__requestId === 'string' ? record.__requestId : undefined,
    datasetName: response?.ckan_dataset_name || response?.ckanDatasetName,
    datasetUrl: response?.ckan_dataset_url || response?.ckanDatasetUrl,
  };
};

export const formatPublishSuccess = (
  entityLabel: string,
  response: PublishDebugResponse,
): FormattedPublishSuccess => {
  const cascadedItems = response.cascaded_items || response.cascadedItems || [];
  const publishedCount = response.published_count ?? response.publishedCount;
  const details = Array.isArray(cascadedItems)
    ? cascadedItems.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];

  return {
    title: 'Published to CKAN',
    message: response.message || `The ${entityLabel} was published to CKAN.`,
    details,
    publishedCount,
    datasetName: response.ckan_dataset_name || response.ckanDatasetName,
    datasetUrl: response.ckan_dataset_url || response.ckanDatasetUrl,
  };
};
