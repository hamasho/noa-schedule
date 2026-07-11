import { ClassCardContent } from './ClassBlock'
import type { DecoLesson } from '../types'

export interface WeekListCol {
  dow: string
  date: string
  isToday: boolean
  classes: DecoLesson[]
}

interface WeekListProps {
  cols: WeekListCol[]
  onFav: (id: string) => void
}

/** List mode (desktop): 7 day columns, each a vertical list of cards with no time scale. */
export function WeekList({ cols, onFav }: WeekListProps) {
  const empty = cols.every((c) => c.classes.length === 0)
  return (
    <div className="mx-auto max-w-[1400px] px-[18px] pt-4 pb-[130px]">
      <div className="mb-2 flex">
        {cols.map((d, i) => (
          <div key={i} className="min-w-0 flex-1 px-0.5">
            <div
              className="rounded-[10px] py-[7px] text-center"
              style={{
                background: d.isToday ? '#1A1A18' : '#F1F1ED',
                color: d.isToday ? '#FFFFFF' : '#55554F',
              }}
            >
              <span className="text-[11px] opacity-75">{d.dow}</span>
              <span className="ml-[5px] text-[15px] font-bold">{d.date}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-start">
        {cols.map((d, i) => (
          <div key={i} className="flex min-w-0 flex-1 flex-col gap-2 px-0.5">
            {d.classes.map((c) => (
              <div key={c.id} style={{ opacity: c.dim ? 0.55 : 1 }}>
                <ClassCardContent c={c} mobile={false} onFav={onFav} />
              </div>
            ))}
          </div>
        ))}
      </div>
      {empty && (
        <div className="py-[30px] text-center text-[13px] text-[#A6A69F]">条件に合うレッスンがありません</div>
      )}
    </div>
  )
}
