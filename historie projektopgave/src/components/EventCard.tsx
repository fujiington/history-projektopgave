import type { HistoryEvent } from '../types/history'

interface EventCardProps {
  event: HistoryEvent
  align?: 'left' | 'right'
}

function createReadMoreUrl(event: HistoryEvent): string {
  if (event.links.length > 0 && event.links[0].link) {
    return event.links[0].link
  }

  return `https://wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(event.text)}`
}

function createTeaser(text: string): string {
  const maxLength = 200

  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trimEnd()}...`
}

function EventCard({ event, align = 'right' }: EventCardProps) {
  const readMoreUrl = createReadMoreUrl(event)
  const isLeft = align === 'left'

  return (
    <article
      className={`w-full max-w-[220px] ${isLeft ? 'text-right' : 'text-left'} md:max-w-[460px] xl:max-w-[560px]`}
    >
      <header>
        <p className="[font-family:'Cinzel',serif] text-[11px] uppercase tracking-[0.08em] text-[var(--gold)] md:text-[14px]">
          Year: {event.year}
        </p>
      </header>

      <p className="mt-1 text-[11px] leading-[1.28] text-[var(--ink)]/85 md:text-[15px]">
        {createTeaser(event.text)}
      </p>

      <a
        href={readMoreUrl}
        target="_blank"
        rel="noreferrer"
        className={`mt-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.06em] text-[var(--ink)]/80 md:text-[12px] ${isLeft ? 'ml-auto' : ''}`}
      >
        <span aria-hidden="true">[]</span>
        Laes mere
      </a>
    </article>
  )
}

export default EventCard
