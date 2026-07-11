interface LoadingOverlayProps {
  show: boolean
  label?: string
}

// Full-screen translucent cover shown while the schedule is being fetched.
export function LoadingOverlay({ show, label = '読み込み中…' }: LoadingOverlayProps) {
  if (!show) return null
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-[#FAFAF8]/70 backdrop-blur-[1px]"
      role="status"
      aria-live="polite"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#DEDED8] border-t-[#1A1A18]" />
      <span className="text-[11px] tracking-[0.08em] text-[#8A8A84]">{label}</span>
    </div>
  )
}
