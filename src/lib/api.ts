/**
 * Client for the live NOA schedule API.
 *
 * The public schedule endpoint returns real class data for a studio (group)
 * and set of genres. It needs no authentication and serves permissive CORS
 * headers (`Access-Control-Allow-Origin: *`), so the browser can call it
 * directly — no proxy required.
 *
 *   POST https://r8t00r3qx7.execute-api.ap-northeast-1.amazonaws.com/PRD
 *   body: {"location":["8"],"genre":[...],"brand":"1","is_month":true}
 *
 * Request body (see {@link NoaScheduleRequest}):
 *   - location  studio/group IDs, e.g. `['8']` = 新宿 (matches data.ts LOCS)
 *   - genre     genre codes to include (schedule-search filter code space —
 *               a different space from the `GENRE_CODE` on records; see
 *               lesson-url.ts for the code-space caveats)
 *   - brand     brand ID, `'1'` = NOA Dance Academy
 *   - is_month  `true` = whole month, `false` = single week
 *
 * Response (see {@link NoaScheduleResponse}):
 *
 *   { statusCode, body: { Status, Items: [ perWeekday ] } }
 *
 * `body.Items` always holds seven entries, MON→SUN. Each has a `time_list`
 * of starting-time buckets, and each bucket a `record[]` of the concrete
 * lesson occurrences ({@link NoaLessonRecord}) at that time. The nesting is
 * awkward to consume directly, so most callers want {@link fetchNoaLessons}
 * (flat, app-domain {@link Lesson}s) rather than {@link fetchNoaSchedule}
 * (the raw envelope).
 *
 * Field-level docs live on the types in ../types.ts.
 */

import { LOCS } from './data'
import { toMin } from './schedule'
import type {
  Lesson,
  NoaLessonRecord,
  NoaScheduleRequest,
  NoaScheduleResponse,
} from '../types'

/** Live schedule endpoint (API Gateway, ap-northeast-1). */
export const NOA_API_URL =
  'https://r8t00r3qx7.execute-api.ap-northeast-1.amazonaws.com/PRD'

/** Brand ID for NOA Dance Academy. */
export const NOA_BRAND_ID = '1'

/**
 * Genre codes for the "all dance genres" view, in the schedule-search
 * filter code space the request expects. Taken from the site's own default
 * query; pass a narrower list to filter server-side.
 */
export const ALL_GENRE_CODES = [
  '09', '10', '02', '08', '07', '06', '04', '01', '18', '03', '15',
] as const

/** Options for {@link fetchNoaSchedule} / {@link fetchNoaLessons}. */
export interface FetchScheduleOptions {
  /**
   * Studio/group ID(s), e.g. `8` = 新宿 (data.ts LOCS). Pass an array to pull
   * several studios in one request (the "全スタジオ" view); each record still
   * carries its own `GROUP_ID`.
   */
  locId: number | number[]
  /** Genre codes to include; defaults to {@link ALL_GENRE_CODES}. */
  genre?: readonly string[]
  /** Brand ID; defaults to {@link NOA_BRAND_ID}. */
  brand?: string
  /** `true` (default) fetches the month, `false` a single week. */
  isMonth?: boolean
  /** Optional AbortSignal to cancel the request. */
  signal?: AbortSignal
}

/** GROUP_ID (as number) → display studio name, from data.ts LOCS. */
const LOC_NAMES = new Map<number, string>(LOCS.map(([id, name]) => [id, name]))

function buildRequest(opts: FetchScheduleOptions): NoaScheduleRequest {
  const ids = Array.isArray(opts.locId) ? opts.locId : [opts.locId]
  return {
    location: ids.map(String),
    genre: [...(opts.genre ?? ALL_GENRE_CODES)],
    brand: opts.brand ?? NOA_BRAND_ID,
    is_month: opts.isMonth ?? true,
  }
}

/**
 * Fetches the raw schedule envelope for one studio.
 *
 * Throws if the network request fails or the endpoint returns a non-2xx
 * status; the returned value is the parsed JSON exactly as sent.
 */
export async function fetchNoaSchedule(
  opts: FetchScheduleOptions,
): Promise<NoaScheduleResponse> {
  const res = await fetch(NOA_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildRequest(opts)),
    signal: opts.signal,
  })
  if (!res.ok) {
    throw new Error(`NOA API request failed: ${res.status} ${res.statusText}`)
  }
  return (await res.json()) as NoaScheduleResponse
}

/**
 * Flattens the nested `Items → time_list → record` tree into a single list
 * of raw lesson records, preserving document order (MON→SUN, then by time).
 */
export function flattenNoaRecords(
  response: NoaScheduleResponse,
): NoaLessonRecord[] {
  const out: NoaLessonRecord[] = []
  for (const day of response.body.Items) {
    for (const slot of day.time_list) {
      out.push(...slot.record)
    }
  }
  return out
}

/**
 * Maps one raw record to the app's {@link Lesson} domain type.
 *
 * Note: `genre` and `level` here are the API's Japanese display names
 * (`GENRE_SUB_NAME` / `LEVEL_NAME`), which are a different value space from
 * the demo `GENRES`/`LEVELS` in data.ts — don't assume GENRE_COLORS keys
 * will match. `inst` prefers the instructor's stage NICKNAME.
 */
export function recordToLesson(r: NoaLessonRecord): Lesson {
  const locId = Number(r.GROUP_ID)
  return {
    id: String(r.SEQ),
    locId,
    locName: LOC_NAMES.get(locId) ?? r.TENPO_NAME,
    start: r.Y_TIME_START,
    startMin: toMin(r.Y_TIME_START),
    endMin: toMin(r.Y_TIME_END),
    genre: r.GENRE_SUB_NAME,
    level: r.LEVEL_NAME,
    inst: r.NICKNAME || r.INSTRUCTOR_NAME,
    instImg: r.INSTRUCTOR_IMG,
    url: r.URL,
    reserveFlg: r.RESERVE_FLG,
    daikouFlg: r.Y_DAIKOU_FLG,
  }
}

/**
 * Groups records into the app's weekly shape: seven `Lesson[]` lists indexed
 * Mon(0)…Sun(6), each sorted by start then end time. The API's month view
 * returns one representative occurrence per weekday, so this is effectively
 * the recurring weekly pattern the UI renders across every week.
 */
export function groupLessonsByWeekday(records: NoaLessonRecord[]): Lesson[][] {
  const week: Lesson[][] = [[], [], [], [], [], [], []]
  for (const r of records) {
    // LESSON_WEEKDAY is JS getDay() numbering (0=日…6=土); the UI is Mon-first.
    const idx = (Number(r.LESSON_WEEKDAY) + 6) % 7
    week[idx].push(recordToLesson(r))
  }
  for (const day of week) {
    day.sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin)
  }
  return week
}

/**
 * Convenience: fetch a studio's schedule and return it as the app's weekly
 * `Lesson[][]` (Mon–Sun). This is what the scheduler UI consumes.
 */
export async function fetchNoaWeek(
  opts: FetchScheduleOptions,
): Promise<Lesson[][]> {
  const response = await fetchNoaSchedule(opts)
  return groupLessonsByWeekday(flattenNoaRecords(response))
}

/**
 * Convenience: fetch a studio's schedule and return it already flattened and
 * mapped to app-domain {@link Lesson}s. Most UI code should call this.
 */
export async function fetchNoaLessons(
  opts: FetchScheduleOptions,
): Promise<Lesson[]> {
  const response = await fetchNoaSchedule(opts)
  return flattenNoaRecords(response).map(recordToLesson)
}
