import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import EventList from '../components/EventList'
import { fetchTodayHistory } from '../services/historyApi'
import type { HistoryEvent } from '../types/history'

const MIN_YEAR = 1000

function SincePage() {
  const currentYear = new Date().getFullYear()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedYear, setSelectedYear] = useState(() => {
    const yearParam = Number(searchParams.get('year'))

    if (!Number.isNaN(yearParam) && yearParam >= MIN_YEAR && yearParam <= currentYear) {
      return yearParam
    }

    return 1947
  })
  const [allEvents, setAllEvents] = useState<HistoryEvent[]>([])
  const [dateLabel, setDateLabel] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const data = await fetchTodayHistory()
        setAllEvents(data.data.Events)
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

  const yearOptions = useMemo(() => {
    const years: number[] = []

    for (let year = currentYear; year >= MIN_YEAR; year -= 1) {
      years.push(year)
    }

    return years
  }, [currentYear])

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => Number(event.year) >= selectedYear)
  }, [allEvents, selectedYear])

  useEffect(() => {
    setSearchParams({ year: String(selectedYear) }, { replace: true })
  }, [selectedYear, setSearchParams])

  return (
    <section className="space-y-5">

      <form className="mx-auto w-full max-w-[260px] rounded border border-[var(--line)] bg-[var(--panel-alt)] p-2 md:max-w-[360px] md:p-3">
        <label
          htmlFor="since-year"
          className="mb-1 block text-sm uppercase tracking-[0.14em] text-[var(--gold)] md:text-base"
        >
          Vælg årstal
        </label>
        <select
          id="since-year"
          value={selectedYear}
          onChange={(event) => setSelectedYear(Number(event.target.value))}
          className="w-full rounded border border-[var(--line)] bg-[var(--panel)] px-2 py-1.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold)] md:text-base"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-[var(--muted)] md:text-sm">
          Viser events fra {selectedYear} og frem pa {dateLabel || 'dagens dato'}.
        </p>
      </form>

      <EventList
        events={filteredEvents}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </section>
  )
}

export default SincePage
