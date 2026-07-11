import { ClassCardContent } from './ClassBlock'
import type { DecoLesson } from '../types'

interface DayListProps {
  classes: DecoLesson[]
  onFav: (id: string) => void
}

/** List mode (mobile): all lessons for the day stacked in start-time order, no time scale. */
export function DayList({ classes, onFav }: DayListProps) {
  return (
    <div className="mx-auto max-w-[680px] px-3 pt-4 pb-40">
      {classes.length === 0 ? (
        <div className="pt-10 pb-2.5 text-center text-[13px] text-[#A6A69F]">条件に合うレッスンがありません</div>
      ) : (
        <div className="flex flex-col gap-2">
          {classes.map((c) => (
            <div key={c.id} style={{ opacity: c.dim ? 0.55 : 1 }}>
              <ClassCardContent c={c} mobile onFav={onFav} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
