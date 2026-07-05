export interface HourMark {
  label: string
  top: number
}

export function HourMarks({ marks }: { marks: HourMark[] }) {
  return (
    <>
      {marks.map((h) => (
        <div key={h.label} className="absolute right-0 left-0 flex items-center gap-2" style={{ top: h.top }}>
          <span className="w-[38px] translate-y-[-1px] text-right text-[11px] text-[#A6A69F]">{h.label}</span>
          <div className="h-px flex-1 bg-[#E8E8E4]" />
        </div>
      ))}
    </>
  )
}
