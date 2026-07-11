export type ViewMode = 'calendar' | 'list'

export interface DayTab {
  dow: string
  date: string
  isSel: boolean
  isToday: boolean
  onSelect: () => void
}

interface HeaderProps {
  rangeLabel: string
  isMobile: boolean
  dayTabs: DayTab[]
  viewMode: ViewMode
  onSetViewMode: (m: ViewMode) => void
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export function Header({ rangeLabel, isMobile, dayTabs, viewMode, onSetViewMode, onPrev, onNext, onToday }: HeaderProps) {
  const modes: { mode: ViewMode; icon: string; label: string }[] = [
    { mode: 'calendar', icon: '📅', label: 'カレンダー' },
    { mode: 'list', icon: '☰', label: 'リスト' },
  ]
  return (
    <div className="sticky top-0 z-20 border-b border-[#E8E8E4] bg-[rgba(250,250,248,0.94)] backdrop-blur-[10px]">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3.5 px-[18px] pt-3 pb-2.5">
        <div className="text-[17px] font-black tracking-[0.08em] whitespace-nowrap">
          NOA <span className="font-medium text-[#8A8A84]">SCHEDULE</span>
        </div>
        <div className="overflow-hidden text-[13px] font-medium text-ellipsis whitespace-nowrap text-[#55554F]">
          {rangeLabel}
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={onPrev}
            className="h-[34px] w-[34px] rounded-[9px] border border-[#E0E0DA] bg-white text-[14px] text-[#55554F] hover:bg-[#F1F1ED]"
          >
            ‹
          </button>
          <button
            onClick={onToday}
            className="h-[34px] rounded-[9px] border border-[#E0E0DA] bg-white px-3 text-[12px] font-bold whitespace-nowrap text-[#55554F] hover:bg-[#F1F1ED]"
          >
            今日
          </button>
          <button
            onClick={onNext}
            className="h-[34px] w-[34px] rounded-[9px] border border-[#E0E0DA] bg-white text-[14px] text-[#55554F] hover:bg-[#F1F1ED]"
          >
            ›
          </button>
          <div className="ml-1 flex h-[34px] items-center gap-0.5 rounded-[9px] border border-[#E0E0DA] bg-white p-0.5">
            {modes.map((m) => {
              const active = viewMode === m.mode
              return (
                <button
                  key={m.mode}
                  onClick={() => onSetViewMode(m.mode)}
                  aria-label={m.label}
                  aria-pressed={active}
                  className={
                    'flex h-[28px] items-center gap-1 rounded-[7px] px-2 text-[12px] font-bold whitespace-nowrap ' +
                    (active ? 'bg-[#1A1A18] text-white' : 'bg-transparent text-[#55554F] hover:bg-[#F1F1ED]')
                  }
                >
                  <span className="text-[13px] leading-none">{m.icon}</span>
                  {!isMobile && <span>{m.label}</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      {isMobile && (
        <div className="flex gap-1.5 overflow-x-auto px-3.5 pb-2.5">
          {dayTabs.map((t, i) => (
            <button
              key={i}
              onClick={t.onSelect}
              className="flex min-h-12 min-w-11 flex-1 flex-col items-center justify-center gap-px rounded-[11px] border py-[5px]"
              style={{
                background: t.isSel ? '#1A1A18' : '#FFFFFF',
                color: t.isSel ? '#FFFFFF' : t.isToday ? '#B5493C' : '#55554F',
                borderColor: t.isSel ? '#1A1A18' : '#E0E0DA',
              }}
            >
              <span className="text-[10px] opacity-75">{t.dow}</span>
              <span className="text-[15px] font-bold">{t.date}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
