import { ResponseError } from '@upstream/upstream-api';

/** Browser message for `res.json()` failing because the body is not JSON
 *  (e.g. an HTML page served by a proxy/SPA fallback while the API is
 *  still starting up). */
const NON_JSON_PARSE_PATTERN = /Unexpected token .+ is not valid JSON/;
/** Browser message when the network request itself failed. */
const NETWORK_FAILURE_PATTERN = /Failed to fetch|NetworkError|network error/i;

const API_NOT_READY_MESSAGE =
  'The API server is not responding yet — it may still be starting up or restarting. Please try again in a moment.';

const NETWORK_ERROR_MESSAGE =
  "Couldn't reach the API server. Check that it is running, then try again.";

/** True when the error is a JSON parse failure on an HTML/non-JSON body —
 *  the signature of hitting a proxy/SPA page instead of the live API. */
export function isNonJsonResponseError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.name === 'SyntaxError' &&
    NON_JSON_PARSE_PATTERN.test(error.message)
  );
}

/** Maps common failure modes to messages a user can act on, instead of
 *  leaking raw browser/JSON errors ("Unexpected token '<', \"<!doctype ...\"")
 *  onto the screen. */
export function friendlyErrorMessage(error: unknown): string {
  if (isNonJsonResponseError(error)) {
    return API_NOT_READY_MESSAGE;
  }
  if (error instanceof Error && NETWORK_FAILURE_PATTERN.test(error.message)) {
    return NETWORK_ERROR_MESSAGE;
  }
  if (typeof error === 'string' && error.trim()) {
    return error;
  }
  return error instanceof Error ? error.message : 'An unknown error occurred';
}

/**
 * Turns a thrown API/network error into a message worth showing a user.
 * The generated client's ResponseError always carries the generic message
 * "Response returned an error code" — the useful detail (FastAPI's `detail`
 * field, or a validation message) is only reachable via the raw Response
 * object it wraps, so this reads that body instead of trusting `.message`.
 */
export async function describeApiError(error: unknown): Promise<string> {
  if (error instanceof ResponseError) {
    const { response } = error;
    let detail: string | undefined;

    try {
      const body = await response.clone().json();
      if (typeof body?.detail === 'string') {
        detail = body.detail;
      } else if (Array.isArray(body?.detail)) {
        detail = body.detail
          .map((item: unknown) =>
            typeof item === 'object' && item !== null && 'msg' in item
              ? String((item as { msg?: unknown }).msg)
              : JSON.stringify(item),
          )
          .join('; ');
      } else if (typeof body?.message === 'string') {
        detail = body.message;
      }
    } catch {
      try {
        const text = await response.clone().text();
        // An HTML body means we hit a proxy/SPA fallback page, not the API —
        // not useful to show verbatim.
        if (text && !/^\s*</.test(text)) {
          detail = text;
        }
      } catch {
        // Body unreadable; fall through with no detail.
      }
    }

    const statusLabel = `${response.status}${response.statusText ? ` ${response.statusText}` : ''}`;
    return detail
      ? `${statusLabel}: ${detail}`
      : `${statusLabel} (no error details returned by the server)`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
}
