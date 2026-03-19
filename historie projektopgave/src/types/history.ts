export interface HistoryLink {
  title: string
  link: string
}

export interface HistoryEvent {
  year: string
  text: string
  html: string
  no_year_html: string
  links: HistoryLink[]
}

export interface HistoryApiResponse {
  date: string
  url: string
  data: {
    Events: HistoryEvent[]
    Births: HistoryEvent[]
    Deaths: HistoryEvent[]
  }
}
