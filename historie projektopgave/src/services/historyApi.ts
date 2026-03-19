import type { HistoryApiResponse } from '../types/history'

const BASE_URL = 'https://history.muffinlabs.com'

async function request(path: string): Promise<HistoryApiResponse> {
  const response = await fetch(`${BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error('Kunne ikke hente historiske data. Prøv igen om lidt.')
  }

  return (await response.json()) as HistoryApiResponse
}

export async function fetchTodayHistory(): Promise<HistoryApiResponse> {
  return request('/date')
}

export async function fetchHistoryByMonthDay(
  month: number,
  day: number,
): Promise<HistoryApiResponse> {
  return request(`/date/${month}/${day}`)
}

export function parseIsoDateToMonthDay(isoDate: string): {
  month: number
  day: number
} {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!match) {
    throw new Error('Ugyldig dato. Vaelg venligst en gyldig dato.')
  }

  const month = Number(match[2])
  const day = Number(match[3])

  if (
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    throw new Error('Ugyldig dato. Vaelg venligst en gyldig dato.')
  }

  return {
    month,
    day,
  }
}
