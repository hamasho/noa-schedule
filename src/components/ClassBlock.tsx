import { STAR_YELLOW } from '../lib/data'
import type { DecoLesson, Positioned } from '../types'

interface ClassCardContentProps {
  c: DecoLesson
  mobile: boolean
  onFav: (id: string) => void
  /** Fill and clip to the parent's height (calendar mode). List mode uses natural height. */
  fill?: boolean
}

/** The visual card shared by calendar (fixed-height, absolute) and list (natural-height) modes. */
export function ClassCardContent({ c, mobile, onFav, fill = false }: ClassCardContentProps) {
  return (
    <div
      className={
        'relative ' +
        (fill ? 'h-full overflow-hidden ' : '') +
        (mobile ? 'rounded-[7px] py-1.5 pr-2 pl-3' : 'rounded-[6px] py-1 pr-1.5 pl-[9px]')
      }
      style={{ background: c.color + '1A' }}
    >
      <div
        className={'absolute top-0 bottom-0 left-0 ' + (mobile ? 'w-1' : 'w-[3px]')}
        style={{ background: c.color }}
      />
      <div className={'flex items-start ' + (mobile ? 'gap-1' : 'gap-0.5')}>
        <div className="min-w-0 flex-1">
          <div className={'flex flex-wrap items-center ' + (mobile ? 'gap-1.5' : 'gap-[5px]')}>
            <span
              className={mobile ? 'text-[13px] leading-[1.25] font-bold' : 'text-[12px] leading-[1.2] font-bold'}
              style={{ color: c.color }}
            >
              {c.genre}
            </span>
            <span
              className={
                'rounded-full font-bold text-white whitespace-nowrap ' +
                (mobile ? 'px-[7px] py-px text-[10px]' : 'px-1.5 py-px text-[9.5px]')
              }
              style={{ background: c.color + 'CC' }}
            >
              {c.level}
            </span>
          </div>
          <div
            className={
              'mt-px font-medium opacity-85 ' + (mobile ? 'text-[11px]' : 'text-[10.5px] whitespace-nowrap')
            }
            style={{ color: c.color }}
          >
            {c.start} ~{c.end}
          </div>
        </div>
        <button
          onClick={() => onFav(c.id)}
          aria-label="お気に入り"
          className={
            'flex-shrink-0 border-none bg-transparent ' +
            (mobile ? 'mt-[-5px] mr-[-6px] h-[30px] w-[30px] text-[16px]' : 'mt-[-4px] mr-[-5px] h-[26px] w-[26px] text-[14px]')
          }
          style={{ color: c.fav ? STAR_YELLOW : '#C0C0B9' }}
        >
          {c.fav ? '★' : '☆'}
        </button>
      </div>
      <div className={'flex min-w-0 flex-wrap items-center ' + (mobile ? 'mt-1 gap-1.5' : 'mt-[3px] gap-[5px]')}>
        <img
          src={c.avatar}
          alt=""
          className={
            'flex-shrink-0 rounded-md bg-[#EBEBE6] object-cover ' + (mobile ? 'h-7 w-7' : 'h-6 w-6')
          }
        />
        <span className={'opacity-75 ' + (mobile ? 'text-[11px]' : 'text-[10.5px]')} style={{ color: c.color }}>
          {c.inst}
          {c.locTag}
        </span>
        {mobile && (
          <span className="ml-auto text-[10.5px] font-bold whitespace-nowrap" style={{ color: c.statusColor }}>
            {c.statusLabel}
          </span>
        )}
      </div>
      {!mobile && (
        <div className="mt-0.5 text-[10.5px] font-bold whitespace-nowrap" style={{ color: c.statusColor }}>
          {c.statusLabel}
        </div>
      )}
    </div>
  )
}

interface ClassBlockProps {
  c: DecoLesson & Positioned
  mobile: boolean
  onFav: (id: string) => void
}

export function ClassBlock({ c, mobile, onFav }: ClassBlockProps) {
  return (
    <div
      className={mobile ? 'absolute px-0.5' : 'absolute pr-0.5 pl-px'}
      style={{ top: c.top, height: c.height, left: c.left, width: c.width, opacity: c.dim ? 0.55 : 1 }}
    >
      <ClassCardContent c={c} mobile={mobile} onFav={onFav} fill />
    </div>
  )
}
