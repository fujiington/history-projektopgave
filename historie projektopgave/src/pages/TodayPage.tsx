import { useEffect, useState } from 'react'
import EventList from '../components/EventList'
import { fetchTodayHistory } from '../services/historyApi'
import type { HistoryEvent } from '../types/history'

function TodayPage() {
  const [events, setEvents] = useState<HistoryEvent[]>([])
  const [dateLabel, setDateLabel] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const data = await fetchTodayHistory()
        setEvents(data.data.Events)
        setDateLabel(data.date)
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Der opstod en ukendt fejl.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [])

  return (
    <section className="space-y-5">
      <header className="text-center">
        <p className="mx-auto max-w-[300px] rounded border border-[var(--line)] bg-[var(--panel-alt)] px-2 py-1 text-[12px] text-[var(--muted)] md:max-w-[420px] md:text-[14px]">
          Begivenheder for <strong>{dateLabel || 'i dag'}</strong>.
        </p>
      </header>

      <EventList events={events} isLoading={isLoading} errorMessage={errorMessage} />
    </section>
  )
}

export default TodayPage
