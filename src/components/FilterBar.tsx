import { useEffect, useRef } from 'react'
import { LOCS, STAR_YELLOW, genreColor } from '../lib/data'

interface FilterBarProps {
  filterOpen: boolean
  locMenuOpen: boolean
  locId: number
  favLocs: number[]
  genres: string[]
  levels: string[]
  favOnly: boolean
  locName: string
  filterSummary: string
  /** Genre chips available for the loaded schedule. */
  genreOptions: string[]
  /** Level chips available for the loaded schedule. */
  levelOptions: string[]
  onToggleFilter: () => void
  onToggleLocMenu: () => void
  onSelectLoc: (id: number) => void
  onToggleFavLoc: (id: number) => void
  onToggleGenre: (g: string) => void
  onToggleLevel: (l: string) => void
  onToggleFavOnly: () => void
  onReset: () => void
  onClose: () => void
}

const chipStyle = (on: boolean) => ({
  background: on ? '#1A1A18' : '#FFFFFF',
  color: on ? '#FFFFFF' : '#55554F',
  borderColor: on ? '#1A1A18' : '#E0E0DA',
})

export function FilterBar(p: FilterBarProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { filterOpen, onClose } = p
  const locMenuRows = [
    { id: 0, name: '全スタジオ', hasStar: false },
    ...LOCS.map(([id, name]) => ({ id, name, hasStar: true })),
  ]

  useEffect(() => {
    if (!filterOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) onClose()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [filterOpen, onClose])

  return (
    <div ref={rootRef} className="fixed right-0 bottom-0 left-0 z-30">
      {p.filterOpen && (
        <div className="max-h-[68vh] overflow-y-auto border-t border-[#E8E8E4] bg-white shadow-[0_-14px_44px_rgba(20,20,16,0.10)]">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-[18px] px-[18px] pt-[18px] pb-2">
            <div className="flex flex-col gap-[9px]">
              <div className="text-[11px] font-bold tracking-[0.12em] text-[#8A8A84]">スタジオ</div>
              <div className="flex flex-wrap items-center gap-[7px]">
                <button
                  onClick={p.onToggleLocMenu}
                  className="flex min-h-[38px] items-center gap-2 rounded-[9px] border border-[#E0E0DA] bg-white px-3.5 py-1.5 text-[13px] font-bold text-[#1A1A18]"
                >
                  {p.locName} <span className="text-[10px] text-[#A6A69F]">{p.locMenuOpen ? '▾' : '▴'}</span>
                </button>
                {p.favLocs.map((id) => {
                  const name = (LOCS.find(([lid]) => lid === id) ?? [0, '?'])[1]
                  return (
                    <button
                      key={id}
                      onClick={() => p.onSelectLoc(id)}
                      className="min-h-[38px] rounded-full border px-3.5 py-1.5 text-[13px] font-bold"
                      style={chipStyle(p.locId === id)}
                    >
                      {name}
                    </button>
                  )
                })}
              </div>
              {p.locMenuOpen && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-0.5 rounded-xl border border-[#E8E8E4] bg-white p-1.5">
                  {locMenuRows.map((l) => {
                    const isFav = p.favLocs.includes(l.id)
                    const isSel = p.locId === l.id
                    return (
                      <div
                        key={l.id}
                        className="flex items-center rounded-lg"
                        style={{ background: isSel ? '#F1F1ED' : 'transparent' }}
                      >
                        <button
                          onClick={() => l.hasStar && p.onToggleFavLoc(l.id)}
                          aria-label="スタジオをお気に入り"
                          className="h-[38px] w-[38px] flex-shrink-0 border-none bg-transparent text-[16px]"
                          style={{
                            color: isFav ? STAR_YELLOW : '#C9C9C2',
                            visibility: l.hasStar ? 'visible' : 'hidden',
                          }}
                        >
                          {isFav ? '★' : '☆'}
                        </button>
                        <button
                          onClick={() => p.onSelectLoc(l.id)}
                          className="min-h-[38px] flex-1 border-none bg-transparent pr-1.5 text-left text-[13px] text-[#1A1A18]"
                          style={{ fontWeight: isSel ? 700 : 400 }}
                        >
                          {l.name}
                        </button>
                        <span className="pr-3 text-[12px] text-[#55554F]">{isSel ? '✓' : ''}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-[9px]">
              <div className="text-[11px] font-bold tracking-[0.12em] text-[#8A8A84]">ジャンル</div>
              <div className="-mx-[18px] flex gap-[7px] overflow-x-auto px-[18px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {p.genreOptions.map((g) => (
                  <button
                    key={g}
                    onClick={() => p.onToggleGenre(g)}
                    className="flex min-h-[38px] flex-shrink-0 items-center gap-[7px] rounded-full border px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap"
                    style={chipStyle(p.genres.includes(g))}
                  >
                    <span
                      className="h-[9px] w-[9px] flex-shrink-0 rounded-full"
                      style={{ background: genreColor(g) }}
                    />
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-[9px]">
              <div className="text-[11px] font-bold tracking-[0.12em] text-[#8A8A84]">レベル</div>
              <div className="flex flex-wrap gap-[7px]">
                {p.levelOptions.map((l) => (
                  <button
                    key={l}
                    onClick={() => p.onToggleLevel(l)}
                    className="min-h-[38px] rounded-full border px-3.5 py-1.5 text-[13px] font-medium"
                    style={chipStyle(p.levels.includes(l))}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pb-2">
              <button
                onClick={p.onToggleFavOnly}
                className="flex min-h-10 items-center gap-2.5 border-none bg-transparent p-0"
              >
                <span
                  className="relative inline-block h-[26px] w-11 flex-shrink-0 rounded-full transition-colors duration-150"
                  style={{ background: p.favOnly ? '#1A1A18' : '#D4D4CE' }}
                >
                  <span
                    className="absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-[left] duration-150"
                    style={{ left: p.favOnly ? 21 : 3 }}
                  />
                </span>
                <span className="text-[13px] font-bold text-[#55554F]">お気に入りのみ表示</span>
              </button>
              <button
                onClick={p.onReset}
                className="ml-auto min-h-10 rounded-full border-none bg-transparent px-3.5 py-1.5 text-[12px] font-medium text-[#8A8A84] hover:text-[#1A1A18]"
              >
                リセット
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-[#E8E8E4] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_28px_rgba(20,20,16,0.07)]">
        <div className="mx-auto flex max-w-[1280px] items-center gap-2.5 px-3.5 py-2">
          <button
            onClick={p.onToggleFilter}
            className="flex min-h-[46px] min-w-0 flex-1 items-center gap-2.5 border-none bg-transparent px-1.5 py-1 text-left"
          >
            <span className="text-[14px] font-bold whitespace-nowrap">{p.locName}</span>
            <span className="overflow-hidden text-[12px] text-ellipsis whitespace-nowrap text-[#8A8A84]">
              {p.filterSummary}
            </span>
            <span className="ml-auto text-[11px] whitespace-nowrap text-[#A6A69F]">
              {p.filterOpen ? '▾' : '▴'} 絞り込み
            </span>
          </button>
          <button
            onClick={p.onToggleFavOnly}
            aria-label="お気に入りのみ"
            className="min-h-[46px] rounded-full border px-4 py-1.5 text-[15px] font-bold whitespace-nowrap"
            style={{
              borderColor: p.favOnly ? STAR_YELLOW : '#E0E0DA',
              background: p.favOnly ? '#FDF6E7' : '#FFFFFF',
              color: p.favOnly ? STAR_YELLOW : '#8A8A84',
            }}
          >
            {p.favOnly ? '★' : '☆'}
          </button>
        </div>
      </div>
    </div>
  )
}
