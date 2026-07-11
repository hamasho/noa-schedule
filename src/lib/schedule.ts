import type { Lesson, LessonStatus } from '../types'

export function toMin(t: string): number {
  const [h, m] = t.split(':')
  return +h * 60 + +m
}

export function toHM(m: number): string {
  return Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0')
}

/**
 * Derives a lesson's reservation status from the real API flags.
 *
 * The schedule API exposes whether a lesson is bookable (`reserveFlg`) and
 * whether a substitute instructor is covering (`daikouFlg`), but not seat
 * counts — so there is no "残りわずか" here, unlike the old demo generator.
 */
export function reservationStatus(l: Lesson): LessonStatus {
  if (!l.reserveFlg) return { label: '受付終了', color: '#8A8A84', dim: true }
  if (l.daikouFlg) return { label: '代講', color: '#C08A2E', dim: false }
  return { label: '予約可', color: '#3E8A5B', dim: false }
}
