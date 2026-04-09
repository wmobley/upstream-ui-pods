import { PublishResponse } from '@upstream/upstream-api';

type PublishEntity = 'campaign' | 'station';

export type PublishDebugResponse = Partial<PublishResponse> & {
  success?: boolean;
  message?: string;
  detail?: string;
  errors?: string[];
  published_count?: number;
};

type PublishLikeError = Error & {
  __bodyText?: string;
  __requestId?: string;
  __publishResponse?: PublishDebugResponse;
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
