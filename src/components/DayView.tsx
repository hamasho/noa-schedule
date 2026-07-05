import { ClassBlock } from './ClassBlock'
import { HourMarks, type HourMark } from './HourMarks'
import type { DecoLesson, Positioned } from '../types'

interface DayViewProps {
  classes: (DecoLesson & Positioned)[]
  hourMarks: HourMark[]
  timelineHeight: number
  onFav: (id: string) => void
}

export function DayView({ classes, hourMarks, timelineHeight, onFav }: DayViewProps) {
  return (
    <div className="mx-auto max-w-[680px] px-3 pt-4 pb-40">
      {classes.length === 0 && (
        <div className="pt-10 pb-2.5 text-center text-[13px] text-[#A6A69F]">条件に合うレッスンがありません</div>
      )}
      <div className="relative" style={{ height: timelineHeight }}>
        <HourMarks marks={hourMarks} />
        {classes.map((c) => (
          <ClassBlock key={c.id} c={c} mobile onFav={onFav} />
        ))}
      </div>
    </div>
  )
}
