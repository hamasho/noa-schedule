import { GENRES, INSTRUCTORS, LEVELS, LOCS } from './data'
import type { Lesson, LessonStatus } from '../types'

export function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function rng(seed: number): () => number {
  let t = seed
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), t | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function toMin(t: string): number {
  const [h, m] = t.split(':')
  return +h * 60 + +m
}

export function toHM(m: number): string {
  return Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0')
}

const ROOM_STARTS = [
  ['10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30', '21:00'],
  ['11:00', '12:30', '14:30', '16:00', '17:30', '19:00', '20:30'],
]

/** Deterministic demo schedule: per studio, an array of 7 day lists (Mon–Sun). */
export function buildSchedule(): Record<number, Lesson[][]> {
  const sched: Record<number, Lesson[][]> = {}
  for (const [id, name] of LOCS) {
    sched[id] = []
    for (let day = 0; day < 7; day++) {
      const r = rng(hash('sch' + id + '-' + day))
      const list: Lesson[] = []
      for (let room = 0; room < ROOM_STARTS.length; room++) {
        for (const t of ROOM_STARTS[room]) {
          if (r() < 0.38) continue
          const genre = GENRES[Math.floor(r() * GENRES.length)]
          const level = genre === 'リズムトレーニング' ? '超入門' : LEVELS[Math.floor(r() * LEVELS.length)]
          const inst = INSTRUCTORS[Math.floor(r() * INSTRUCTORS.length)]
          const dur = r() < 0.5 ? 75 : 85
          const startMin = toMin(t)
          list.push({
            id: id + '-' + day + '-' + room + '-' + t,
            locId: id,
            locName: name,
            start: t,
            startMin,
            endMin: startMin + dur,
            genre,
            level,
            inst,
          })
        }
      }
      list.sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin)
      sched[id].push(list)
    }
  }
  return sched
}

export function status(dateKey: string, classId: string): LessonStatus {
  const r = rng(hash(dateKey + '|' + classId))()
  if (r < 0.55) return { label: '予約可', color: '#3E8A5B', dim: false }
  if (r < 0.72) return { label: '残りわずか', color: '#C08A2E', dim: false }
  if (r < 0.88) return { label: '満員', color: '#8A8A84', dim: true }
  return { label: '休講', color: '#B5493C', dim: true }
}
