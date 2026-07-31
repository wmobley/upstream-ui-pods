import { ResponseError } from '@upstream/upstream-api';

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
