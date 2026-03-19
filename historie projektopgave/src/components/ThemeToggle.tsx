type Theme = 'light' | 'dark'

interface ThemeToggleProps {
  theme: Theme
  onToggle: () => void
}

function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/35 px-2 py-1 text-[10px] text-white backdrop-blur-sm transition hover:bg-black/55 md:px-2.5 md:text-[11px]"
      onClick={onToggle}
      aria-label="Skift tema"
    >
      <span className="size-3.5 rounded-full bg-[var(--gold)] md:size-4" aria-hidden="true" />
      <span>{theme === 'light' ? 'Light' : 'Dark'}</span>
    </button>
  )
}

export default ThemeToggle
