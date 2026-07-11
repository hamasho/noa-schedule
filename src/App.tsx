import { useEffect, useMemo, useState } from 'react'
import { Header, type DayTab } from './components/Header'
import { DayView } from './components/DayView'
import { WeekView, type WeekCol } from './components/WeekView'
import { FilterBar } from './components/FilterBar'
import type { HourMark } from './components/HourMarks'
import { CLOSED_DISPLAY, DAY_END, DAY_START, DOWS, GENRE_COLORS, LOCS, PPH } from './lib/data'
import { buildSchedule, status, toHM } from './lib/schedule'
import { layoutTimeline } from './lib/layout'
import type { DecoLesson, Lesson } from './types'

const SAVE_KEY = 'noa-sched-v1'

interface Saved {
  locId?: number
  genres?: string[]
  levels?: string[]
  favOnly?: boolean
  favs?: Record<string, boolean>
  favLocs?: number[]
}

function loadSaved(): Saved {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')
  } catch {
    return {}
  }
}

const saved = loadSaved()

const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function App() {
  const [selMs, setSelMs] = useState(startOfToday)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 760)
  const [filterOpen, setFilterOpen] = useState(false)
  const [locMenuOpen, setLocMenuOpen] = useState(false)
  const [locId, setLocId] = useState(saved.locId ?? 8)
  const [genres, setGenres] = useState<string[]>(saved.genres ?? [])
  const [levels, setLevels] = useState<string[]>(saved.levels ?? [])
  const [favOnly, setFavOnly] = useState(!!saved.favOnly)
  const [favs, setFavs] = useState<Record<string, boolean>>(saved.favs ?? {})
  const [favLocs, setFavLocs] = useState<number[]>(saved.favLocs ?? [8])

  const schedule = useMemo(buildSchedule, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 760)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ locId, genres, levels, favOnly, favs, favLocs }))
    } catch {
      // storage unavailable (private mode etc.) — filters just won't persist
    }
  }, [locId, genres, levels, favOnly, favs, favLocs])

  const sel = new Date(selMs)
  const monday = new Date(selMs)
  monday.setDate(sel.getDate() - ((sel.getDay() + 6) % 7))
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dateOf = (i: number) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  }
  const keyOf = (d: Date) => d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()

  const showLoc = locId === 0
  const passes = (c: Lesson) => {
    if (genres.length && !genres.includes(c.genre)) return false
    if (levels.length && !levels.includes(c.level)) return false
    if (favOnly && !favs[c.id]) return false
    return true
  }

  const decorate = (c: Lesson, dateKey: string): DecoLesson | null => {
    const st = status(dateKey, c.id)
    if (CLOSED_DISPLAY === '非表示' && st.dim) return null
    return {
      ...c,
      end: toHM(c.endMin),
      locTag: showLoc ? '　' + c.locName : '',
      avatar: 'https://i.pravatar.cc/64?u=noa-' + c.inst,
      dim: st.dim,
      fav: !!favs[c.id],
      color: st.dim ? '#8A8A84' : (GENRE_COLORS[c.genre] ?? '#55554F'),
      statusLabel: st.label,
      statusColor: st.color,
    }
  }

  const classesFor = (dayIdx: number, dateKey: string): DecoLesson[] => {
    let pool: Lesson[] = []
    if (showLoc) for (const [id] of LOCS) pool = pool.concat(schedule[id][dayIdx])
    else pool = schedule[locId] ? schedule[locId][dayIdx] : []
    const out: DecoLesson[] = []
    for (const c of pool) {
      if (!passes(c)) continue
      const dc = decorate(c, dateKey)
      if (dc) out.push(dc)
    }
    out.sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin || a.locName.localeCompare(b.locName))
    return out
  }

  const toggleFav = (id: string) => {
    setFavs((prev) => {
      const next = { ...prev }
      if (next[id]) delete next[id]
      else next[id] = true
      return next
    })
  }

  const selDayIdx = (sel.getDay() + 6) % 7
  const dayTabs: DayTab[] = DOWS.map((dw, i) => {
    const d = dateOf(i)
    return {
      dow: dw,
      date: String(d.getDate()),
      isSel: i === selDayIdx,
      isToday: d.getTime() === today.getTime(),
      onSelect: () => setSelMs(d.getTime()),
    }
  })
  const dayClasses = layoutTimeline(classesFor(selDayIdx, keyOf(sel)), 50)

  const hourMarks: HourMark[] = []
  for (let m = DAY_START; m <= DAY_END; m += 60) {
    hourMarks.push({ label: toHM(m), top: Math.round(((m - DAY_START) / 60) * PPH) })
  }
  const timelineHeight = Math.round(((DAY_END - DAY_START) / 60) * PPH) + 20

  const weekCols: WeekCol[] = DOWS.map((dw, i) => {
    const d = dateOf(i)
    return {
      dow: dw,
      date: d.getMonth() + 1 + '/' + d.getDate(),
      isToday: d.getTime() === today.getTime(),
      classes: layoutTimeline(classesFor(i, keyOf(d)), 0),
    }
  })

  const fmt = (d: Date) => d.getMonth() + 1 + '/' + d.getDate() + '（' + DOWS[(d.getDay() + 6) % 7] + '）'
  const rangeLabel = isMobile ? fmt(sel) : fmt(monday) + ' 〜 ' + fmt(dateOf(6))

  const locName = showLoc ? '全スタジオ' : (LOCS.find(([id]) => id === locId) ?? [0, ''])[1]
  const parts: string[] = []
  if (genres.length) parts.push('ジャンル' + genres.length)
  if (levels.length) parts.push('レベル' + levels.length)
  if (favOnly) parts.push('お気に入りのみ')
  const filterSummary = parts.length ? parts.join('・') : '絞り込みなし'

  const toggleList = (list: string[], v: string) =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v]

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A18]">
      <Header
        rangeLabel={rangeLabel}
        isMobile={isMobile}
        dayTabs={dayTabs}
        onPrev={() => setSelMs(selMs - 86400000 * (isMobile ? 1 : 7))}
        onNext={() => setSelMs(selMs + 86400000 * (isMobile ? 1 : 7))}
        onToday={() => setSelMs(today.getTime())}
      />
      {isMobile ? (
        <DayView classes={dayClasses} hourMarks={hourMarks} timelineHeight={timelineHeight} onFav={toggleFav} />
      ) : (
        <WeekView cols={weekCols} hourMarks={hourMarks} timelineHeight={timelineHeight} onFav={toggleFav} />
      )}
      <FilterBar
        filterOpen={filterOpen}
        locMenuOpen={locMenuOpen}
        locId={locId}
        favLocs={favLocs}
        genres={genres}
        levels={levels}
        favOnly={favOnly}
        locName={locName}
        filterSummary={filterSummary}
        onToggleFilter={() => {
          setFilterOpen(!filterOpen)
          setLocMenuOpen(false)
        }}
        onToggleLocMenu={() => setLocMenuOpen(!locMenuOpen)}
        onSelectLoc={(id) => {
          setLocId(id)
          setLocMenuOpen(false)
        }}
        onToggleFavLoc={(id) =>
          setFavLocs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
        }
        onToggleGenre={(g) => setGenres((prev) => toggleList(prev, g))}
        onToggleLevel={(l) => setLevels((prev) => toggleList(prev, l))}
        onToggleFavOnly={() => setFavOnly(!favOnly)}
        onClose={() => {
          setFilterOpen(false)
          setLocMenuOpen(false)
        }}
        onReset={() => {
          setGenres([])
          setLevels([])
          setFavOnly(false)
        }}
      />
    </div>
  )
}

export default App
