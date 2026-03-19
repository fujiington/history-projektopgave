import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import EventList from '../components/EventList'
import { fetchHistoryByMonthDay, parseIsoDateToMonthDay } from '../services/historyApi'
import type { HistoryEvent } from '../types/history'

function getDefaultDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getInitialDate(dateParam: string | null): string {
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    return dateParam
  }

  return getDefaultDate()
}

function ByDatePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedDate, setSelectedDate] = useState(() =>
    getInitialDate(searchParams.get('date')),
  )
  const [events, setEvents] = useState<HistoryEvent[]>([])
  const [dateLabel, setDateLabel] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setSearchParams({ date: selectedDate }, { replace: true })
  }, [selectedDate, setSearchParams])

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')

        if (!selectedDate) {
          setEvents([])
          setDateLabel('')
          setErrorMessage('Vaelg en dato for at se begivenheder.')
          return
        }

        const { month, day } = parseIsoDateToMonthDay(selectedDate)
        const data = await fetchHistoryByMonthDay(month, day)

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
  }, [selectedDate])

  return (
    <section className="space-y-5">

      <form className="mx-auto w-full max-w-[260px] rounded border border-[var(--line)] bg-[var(--panel-alt)] p-2 md:max-w-[360px] md:p-3">
        <label
          htmlFor="history-date"
          className="mb-1 block text-sm uppercase tracking-[0.14em] text-[var(--gold)] md:text-base"
        >
          Dato
        </label>
        <input
          id="history-date"
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="w-full rounded border border-[var(--line)] bg-[var(--panel)] px-2 py-1.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold)] md:text-base"
        />
        <p className="mt-1 text-xs text-[var(--muted)] md:text-sm">
          Viser: {dateLabel || 'Vaelger dato...'}
        </p>
      </form>

      <EventList events={events} isLoading={isLoading} errorMessage={errorMessage} />
    </section>
  )
}

export default ByDatePage
