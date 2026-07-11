/**
 * Builder for real NOA reservation URLs.
 *
 * The live site links each lesson to a reservation page like:
 *
 *   https://www.noadance.com/reserve/?tn=SA&g=04&l=01&i=0552&b=1&tf=1515&tt=1640&wd=1
 *
 * There is no lesson ID in the URL — the params form a composite key
 * (studio + genre + level + instructor + weekday + time slot) identifying a
 * recurring weekly lesson. The reserve page POSTs them to the lesson-detail
 * API to look up the concrete upcoming dates that can be booked.
 *
 * Param → API field mapping (from the site's web_lesson_reserve.js):
 *
 * | Param   | API field          | Meaning                                          |
 * |---------|--------------------|--------------------------------------------------|
 * | tn      | tenpo              | Studio code, letters (e.g. Shinjuku splits into  |
 * |         |                    | SA = 新宿 2F, S = 新宿 6F, SV = 新宿 9F)          |
 * | g       | genre              | Genre code, 2 digits (04 = リズムトレーニング,    |
 * |         |                    | 06 = ジャズダンス, ...)                           |
 * | l       | level              | Level code, 2 digits (01 = 超入門, 02 = 入門, ...)|
 * | i       | instructor         | Instructor code, 4 digits (e.g. 0552 = Tossy)    |
 * | b       | brand              | Brand ID (1 = NOA Dance Academy)                 |
 * | tf / tt | lesson_time_from/to| Start / end time as HHMM                         |
 * | wd      | lesson_weekday     | Day of week, JS getDay() numbering (0=日, 1=月)  |
 *
 * Caveats:
 * - The lesson-record genre codes (`g`) are a different code space from the
 *   genre codes in the schedule-search filter UI (there 04 means KIDS), and
 *   finer-grained than the display genres in data.ts GENRES.
 * - The letter `tn` codes are also a different id space from the numeric
 *   `location=` codes used by /schedule_search/ (and mirrored in data.ts
 *   LOCS), e.g. location 8 (新宿) covers tn codes S / SA / SV per floor.
 */

import type { Lesson } from '../types'

export const RESERVE_BASE_URL = 'https://www.noadance.com/reserve/'

export const NOA_DANCE_BRAND_ID = 1

export interface LessonUrlParams {
  /** Studio (店舗) code, e.g. 'SA' for 新宿 2F */
  tenpoCode: string
  /** Lesson-record genre code, e.g. 4 for リズムトレーニング */
  genreCode: number
  /** Level code, e.g. 1 for 超入門 */
  levelCode: number
  /** Instructor code, e.g. 552 for Tossy (藤川俊夫) */
  instructorCode: number
  /** Brand ID; defaults to NOA Dance Academy (1) */
  brandId?: number
  /** Lesson start in minutes since midnight (Lesson.startMin) */
  startMin: number
  /** Lesson end in minutes since midnight (Lesson.endMin) */
  endMin: number
  /** Day of week, JS getDay() numbering: 0=日, 1=月, ..., 6=土 */
  weekday: number
}

const pad = (n: number, width: number) => String(n).padStart(width, '0')

/** Formats minutes since midnight as HHMM, e.g. 915 → '1515' */
const toHHMM = (min: number) => pad(Math.floor(min / 60), 2) + pad(min % 60, 2)

/**
 * Builds a reservation URL for a recurring weekly lesson, e.g.
 * `https://www.noadance.com/reserve/?tn=SA&g=04&l=01&i=0552&b=1&tf=1515&tt=1640&wd=1`
 */
export function createLessonUrl({
  tenpoCode,
  genreCode,
  levelCode,
  instructorCode,
  brandId = NOA_DANCE_BRAND_ID,
  startMin,
  endMin,
  weekday,
}: LessonUrlParams): string {
  return (
    RESERVE_BASE_URL +
    `?tn=${tenpoCode}` +
    `&g=${pad(genreCode, 2)}` +
    `&l=${pad(levelCode, 2)}` +
    `&i=${pad(instructorCode, 4)}` +
    `&b=${brandId}` +
    `&tf=${toHHMM(startMin)}` +
    `&tt=${toHHMM(endMin)}` +
    `&wd=${weekday}`
  )
}

/** Builds the reservation URL for an app-domain {@link Lesson}. */
export function lessonReserveUrl(l: Lesson): string {
  return createLessonUrl({
    tenpoCode: l.tenpoCode,
    genreCode: l.genreCode,
    levelCode: l.levelCode,
    instructorCode: l.instructorCode,
    startMin: l.startMin,
    endMin: l.endMin,
    weekday: l.weekday,
  })
}
