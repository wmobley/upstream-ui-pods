# Cerebrum

> OpenWolf's learning memory. Updated automatically as the AI learns from interactions.
> Do not edit manually unless correcting an error.
> Last updated: 2026-07-16

## User Preferences

<!-- How the user likes things done. Code style, tools, patterns, communication. -->

## Key Learnings

- **Project:** viz
- **Description:** [![DOI](https://zenodo.org/badge/1076822803.svg)](https://doi.org/10.5281/zenodo.17664816)
- **[2026-07-17] `InstanceContext.tsx`'s `permission` field on a `ProjectInstance` is NOT Tapis pod/stack permission** — it's resolved from each project's own backend DB `user_roles` table via `GET {apiUrl}/api/v1/user-roles/me` (Bearer: Tapis token). Don't reintroduce a Tapis-pod-permission read here; that's a separate infra/ops concept (see upstream-docker-pods cerebrum for the split).
- **[2026-07-17] Per-instance async work in `fetchInstances()` must use `Promise.allSettled` (with a concurrency cap — see `mapWithConcurrency` helper), never `Promise.all`.** One discovered project pod being down/slow must not blank out the whole dropdown for every other project.
- **[2026-07-17] `Permission` type includes `'UNKNOWN'`** (rendered as an "Unverified" group in `ProjectDropdown.tsx`) for when a per-project role lookup fails for reasons unrelated to access (network error, 5xx, pod restarting) — distinct from `NONE`/401/403 which means real no-access and the instance is dropped entirely.

## Do-Not-Repeat

<!-- Mistakes made and corrected. Each entry prevents the same mistake recurring. -->
<!-- Format: [YYYY-MM-DD] Description of what went wrong and what to do instead. -->
- [2026-07-17] Don't drop a discovered project instance from the dropdown just because its role-lookup request failed/errored — that conflates "couldn't check" with "no access" and can make a real project silently vanish from a user's dropdown just because that project's pod was mid-restart. Only drop on a resolved `NONE` role or 401/403; keep-and-badge everything else.

## Decision Log

<!-- Significant technical decisions with rationale. Why X was chosen over Y. -->
- [2026-07-17] `ProjectDropdown`/`InstanceContext` permission grouping switched from (never-fully-implemented) Tapis stack permission to the app's own per-project DB role, resolved via a new backend self-lookup endpoint. Full rationale, alternatives considered, and reviewer sign-off recorded in `upstream-docker-pods/docs/design/2026-07-09-unified-ui-tapis-auth-multi-instance.md` (Decisions, 2026-07-17).
