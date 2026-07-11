export interface Lesson {
  id: string
  locId: number
  locName: string
  start: string
  startMin: number
  endMin: number
  genre: string
  level: string
  inst: string
}

export interface LessonStatus {
  label: string
  color: string
  dim: boolean
}

export interface DecoLesson extends Lesson {
  end: string
  locTag: string
  avatar: string
  dim: boolean
  fav: boolean
  color: string
  statusLabel: string
  statusColor: string
}

export interface Positioned {
  top: number
  height: number
  left: string
  width: string
}

/* ------------------------------------------------------------------ *
 * NOA schedule API (see src/lib/api.ts for the client + docs)
 *
 * These mirror the raw JSON returned by the live schedule endpoint.
 * Field names/casing are kept exactly as the API sends them (SCREAMING_
 * CASE) so the wire shape is self-documenting; map into the app's own
 * `Lesson` type with the helpers in api.ts rather than using these
 * directly in components.
 * ------------------------------------------------------------------ */

/** POST body accepted by the schedule endpoint. */
export interface NoaScheduleRequest {
  /** Studio/group IDs to include, as strings, e.g. `['8']` = 新宿. */
  location: string[]
  /** Genre codes to include (schedule-search filter code space). */
  genre: string[]
  /** Brand ID, e.g. `'1'` = NOA Dance Academy. */
  brand: string
  /** `true` fetches the whole month; `false` fetches a single week. */
  is_month: boolean
}

/**
 * One lesson occurrence. All values arrive as strings unless noted.
 * `*_FLG` booleans are real JSON booleans; `EVENT_FLG` is a number/null.
 */
export interface NoaLessonRecord {
  /** Unique occurrence id (the only genuinely per-record numeric key). */
  SEQ: number
  /** Studio code, letters, e.g. `'SA'` = 新宿 2F (see lesson-url.ts). */
  TENPO_CD: string
  /** Lesson date, `YYYYMMDD`. */
  HIDUKE: string
  /** Start / end wall-clock times, `HH:MM`. */
  Y_TIME_START: string
  Y_TIME_END: string
  /** Brand of this lesson: `'1'` NOA, `'2'`/`'6'` sibling brands. */
  BRAND_ID: string
  NOAH_CATEGORY_ID: string
  /** Numeric studio-group id matching data.ts LOCS, e.g. `'8'` = 新宿. */
  GROUP_ID: string
  /** Genre code (lesson-record code space; see lesson-url.ts caveats). */
  GENRE_CODE: string
  /** Human genre name, Japanese, e.g. `'ハウスダンス'`. */
  GENRE_SUB_NAME: string
  /** Secondary genre name; usually a single space `' '`. */
  GENRE2_SUB_NAME: string
  /** Studio display name, e.g. `'新宿 2F'`. */
  TENPO_NAME: string
  /** Room code / name within the studio, e.g. `'03'` / `'2Cst'`. */
  STUDIO_CODE: string
  STUDIO_NAME: string
  /** Level code / Japanese name, e.g. `'06'` / `'初級'`. */
  LEVEL_CODE: string
  LEVEL_NAME: string
  /** Instructor code (4 digits) / full name. */
  INSTRUCTOR_CODE: string
  INSTRUCTOR_NAME: string
  /** Instructor headshot URL. */
  INSTRUCTOR_IMG: string
  /** Instructor stage name, e.g. `'RiN.'`. */
  NICKNAME: string
  /** Instructor crew/team; `null` when unaffiliated. */
  TEAM: string | null
  /** Lesson detail page on noadance.com. */
  URL: string
  /** Women-only / men-only lesson flags. */
  WOMAN_FLG: boolean
  MAN_FLG: boolean
  /** Event marker: `0`/other number when part of an event, else `null`. */
  EVENT_FLG: number | null
  /** Event/workshop title when this is a special lesson, else `null`. */
  EVENT_LESSON_NAME: string | null
  /** `true` when a substitute instructor is covering (代講). */
  Y_DAIKOU_FLG: boolean
  /** Whether the lesson is currently bookable. */
  RESERVE_FLG: boolean
  /** Whether a trial/experience booking is available. */
  EXP_RESERVE_FLG: boolean
  MOVE_CONSENT_FLG: boolean
  /** Free-text notice shown on the schedule (pricing, etc.), else `null`. */
  SCHEDULE_HYOUJI_MEMO: string | null
  /** Day of week, JS getDay() numbering: `'0'`=日 … `'6'`=土. */
  LESSON_WEEKDAY: string
  /** Start / end times as `HHMM`, for building reserve URLs. */
  LESSON_TIME_FROM: string
  LESSON_TIME_TO: string
}

/** Lessons grouped under a starting time bucket. */
export interface NoaTimeSlot {
  /** Bucket label, `HH:MM` (the column/row heading). */
  time_class: string
  /** Same as `time_class` in observed responses. */
  time: string
  record: NoaLessonRecord[]
}

/** One weekday's worth of time slots. */
export interface NoaDayItem {
  /** Weekday code, `'MON'`…`'SUN'`. */
  YOUBI: string
  /** Weekday index, JS getDay() numbering as a string (`'0'`=日…`'6'`=土). */
  youbi_flg: string
  time_list: NoaTimeSlot[]
}

/** Full response envelope from the schedule endpoint. */
export interface NoaScheduleResponse {
  statusCode: number
  body: {
    /** Seven entries, MON–SUN, in that order. */
    Items: NoaDayItem[]
    /** Deployment stage marker, e.g. `'PRD'`. */
    Status: string
  }
}
