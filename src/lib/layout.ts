import { DAY_START, PPH } from './data'
import type { Positioned } from '../types'

/**
 * Assign lanes to overlapping classes within clusters and convert times to
 * absolute positions. gutterPx is the left offset reserved for hour labels
 * (0 inside week columns).
 */
export function layoutTimeline<T extends { startMin: number; endMin: number }>(
  list: T[],
  gutterPx: number,
): (T & Positioned)[] {
  const clusters: T[][] = []
  let cur: T[] = []
  let curEnd = -1
  for (const c of list) {
    if (cur.length && c.startMin < curEnd) {
      cur.push(c)
      curEnd = Math.max(curEnd, c.endMin)
    } else {
      if (cur.length) clusters.push(cur)
      cur = [c]
      curEnd = c.endMin
    }
  }
  if (cur.length) clusters.push(cur)

  const out: (T & Positioned)[] = []
  const base = gutterPx ? gutterPx + 'px + ' : ''
  const avail = gutterPx ? '(100% - ' + gutterPx + 'px)' : '100%'
  for (const cluster of clusters) {
    const laneEnds: number[] = []
    const lanes = new Map<T, number>()
    for (const c of cluster) {
      let lane = laneEnds.findIndex((e) => e <= c.startMin)
      if (lane === -1) {
        lane = laneEnds.length
        laneEnds.push(0)
      }
      laneEnds[lane] = c.endMin
      lanes.set(c, lane)
    }
    const n = laneEnds.length
    const frac = 1 / n
    for (const c of cluster) {
      out.push({
        ...c,
        top: Math.round(((c.startMin - DAY_START) / 60) * PPH) + 1,
        height: Math.round(((c.endMin - c.startMin) / 60) * PPH) - 4,
        left: 'calc(' + base + avail + ' * ' + (lanes.get(c)! * frac).toFixed(4) + ')',
        width: 'calc(' + avail + ' * ' + frac.toFixed(4) + ')',
      })
    }
  }
  return out
}
