import { ClassBlock } from './ClassBlock'
import { HourMarks, type HourMark } from './HourMarks'
import type { DecoLesson, Positioned } from '../types'

export interface WeekCol {
  dow: string
  date: string
  isToday: boolean
  classes: (DecoLesson & Positioned)[]
}

interface WeekViewProps {
  cols: WeekCol[]
  hourMarks: HourMark[]
  timelineHeight: number
  onFav: (id: string) => void
}

export function WeekView({ cols, hourMarks, timelineHeight, onFav }: WeekViewProps) {
  const empty = cols.every((c) => c.classes.length === 0)
  return (
    <div className="mx-auto max-w-[1400px] px-[18px] pt-4 pb-[130px]">
      <div className="mb-2 flex">
        <div className="w-[46px] flex-shrink-0" />
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
      <div className="relative" style={{ height: timelineHeight }}>
        <HourMarks marks={hourMarks} />
        <div className="absolute top-0 right-0 bottom-0 left-[46px] flex">
          {cols.map((d, i) => (
            <div key={i} className="relative min-w-0 flex-1 border-l border-[#E3E2E2EB]">
              {d.classes.map((c) => (
                <ClassBlock key={c.id} c={c} mobile={false} onFav={onFav} />
              ))}
            </div>
          ))}
        </div>
      </div>
      {empty && (
        <div className="py-[30px] text-center text-[13px] text-[#A6A69F]">条件に合うレッスンがありません</div>
      )}
    </div>
  )
}
