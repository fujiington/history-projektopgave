import { useEffect, useMemo, useRef, useState } from 'react'
import EventCard from './EventCard'
import type { HistoryEvent } from '../types/history'

const PAGE_SIZE = 10

interface EventListProps {
  events: HistoryEvent[]
  isLoading: boolean
  errorMessage: string
}

function EventList({ events, isLoading, errorMessage }: EventListProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [events])

  const visibleEvents = useMemo(() => {
    return events.slice(0, visibleCount)
  }, [events, visibleCount])

  useEffect(() => {
    const sentinel = sentinelRef.current

    if (!sentinel || visibleCount >= events.length) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]

        if (first.isIntersecting) {
          setVisibleCount((current) => Math.min(current + PAGE_SIZE, events.length))
        }
      },
      {
        rootMargin: '120px',
      },
    )

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [events.length, visibleCount])

  if (isLoading) {
    return (
      <p className="rounded border border-[var(--line)] bg-[var(--panel-alt)] px-3 py-2 text-center text-xs text-[var(--muted)]">
        Henter historiske begivenheder...
      </p>
    )
  }

  if (errorMessage) {
    return (
      <p className="rounded border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
        {errorMessage}
      </p>
    )
  }

  if (events.length === 0) {
    return (
      <p className="rounded border border-[var(--line)] bg-[var(--panel-alt)] px-3 py-2 text-center text-xs text-[var(--muted)]">
        Ingen begivenheder fundet for valget.
      </p>
    )
  }

  return (
    <div className="relative px-1">
      <div className="absolute right-1 top-0 text-[13px] text-[var(--ink)]/70">◌</div>
      <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-[var(--gold)]/80 md:block" />
      <div className="pointer-events-none absolute bottom-0 left-5 top-0 w-px bg-[var(--gold)]/80 md:hidden" />

      <div className="pointer-events-none absolute left-1/2 top-0 hidden -translate-x-1/2 md:block">
        <span className="block size-3 rounded-full bg-[var(--gold)]" />
      </div>
      <div className="pointer-events-none absolute left-5 top-0 -translate-x-1/2 md:hidden">
        <span className="block size-3 rounded-full bg-[var(--gold)]" />
      </div>

      <ul className="space-y-5 pt-8" aria-live="polite">
        {visibleEvents.map((event, index) => (
          <li
            key={`${event.year}-${event.text.slice(0, 20)}-${index}`}
            className="grid grid-cols-[28px_1fr] gap-2 md:grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)] md:gap-4"
          >
            <div className={`hidden md:block ${index % 2 === 0 ? 'order-1' : 'order-3'}`}>
              {index % 2 === 0 && (
                <div className="flex w-full items-start justify-end gap-3 pr-3 xl:pr-6">
                  <div className="mt-[10px] h-px w-14 bg-[var(--gold)]/70 xl:w-20" />
                  <EventCard event={event} align="left" />
                </div>
              )}
            </div>

            <div className="order-1 flex justify-center md:order-2">
              <span className="mt-[7px] size-[7px] rounded-full border border-[var(--gold)] bg-[var(--panel)]" />
            </div>

            <div className="order-2 md:order-3">
              <div className="md:hidden">
                <div className="flex items-start gap-2">
                  <div className="mt-[10px] h-px w-5 bg-[var(--gold)]/70" />
                  <EventCard event={event} align="right" />
                </div>
              </div>
              {index % 2 === 1 && (
                <div className="hidden md:block">
                  <div className="flex w-full items-start gap-3 pl-3 xl:pl-6">
                    <div className="mt-[10px] h-px w-14 bg-[var(--gold)]/70 xl:w-20" />
                    <EventCard event={event} align="right" />
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="pt-3 text-center text-[8px] uppercase tracking-[0.08em] text-[var(--muted)]">
        Scroll down for more
      </div>
      <div className="pb-1 text-center text-[15px] leading-none text-[var(--gold)]">↓</div>

      <div className="absolute bottom-0 right-1 text-[12px] text-[var(--ink)]/70">ⓘ</div>

      {visibleCount < events.length && (
        <div ref={sentinelRef} className="h-8" aria-hidden="true" />
      )}
    </div>
  )
}

export default EventList
