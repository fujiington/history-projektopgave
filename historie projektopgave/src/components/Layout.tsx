import { NavLink, Outlet, useLocation } from 'react-router-dom'
import type { NavLinkRenderProps } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import BackToTopButton from './BackToTopButton'

type Theme = 'light' | 'dark'

interface LayoutProps {
  theme: Theme
  onToggleTheme: () => void
}

function Layout({ theme, onToggleTheme }: LayoutProps) {
  const location = useLocation()

  const activeClass =
    'text-[var(--gold)] underline decoration-[0.8px] underline-offset-[2px] text-[0.85rem] md:text-[0.98rem] font-semibold'
  const idleClass =
    'text-[var(--muted)] hover:text-[var(--gold)]'

  const searchParams = new URLSearchParams(location.search)
  const selectedDate = searchParams.get('date')
  const selectedYear = searchParams.get('year')

  const plaqueTitle = (() => {
    if (location.pathname === '/by-date') {
      if (selectedDate && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
        const [, month, day] = selectedDate.split('-')
        return `ON: ${day}/${month}`
      }

      return 'ON: 22/08'
    }

    if (location.pathname === '/since') {
      return `SINCE: ${selectedYear || '1900'}`
    }

    return 'ON THIS DAY'
  })()

  const plaqueSubtitle =
    location.pathname === '/today'
      ? 'What happened on this day - historical events, deaths and births throughout time'
      : 'What happened on this day - Here you can enter a specific date to only get events that happened on this day, since that year.'

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <div className="w-full border-x border-[var(--line)] bg-[var(--panel)]">
        <header className="relative h-[310px] bg-[url('https://unsplash.com/photos/Fo5dTm6ID1Y/download?force=true&w=2000')] bg-cover bg-center md:h-[400px] xl:h-[500px]">
          <div className="history-card absolute left-1/2 top-[56%] w-[78%] max-w-[360px] -translate-x-1/2 rounded-[1px] px-4 py-5 text-center md:top-[56%] md:w-[64%] md:max-w-[760px] md:px-8 md:py-6 xl:w-[56%] xl:max-w-[860px] xl:py-7">
            <p className="plaque-title">
              {plaqueTitle}
            </p>
            <p className="mx-auto mt-1 max-w-[32ch] text-[10px] leading-[1.35] text-[var(--muted)] md:max-w-[42ch] md:text-[11px]">
              {plaqueSubtitle}
            </p>

            <span className="history-pin left-2 top-2" aria-hidden="true" />
            <span className="history-pin right-2 top-2" aria-hidden="true" />
            <span className="history-pin bottom-2 left-2" aria-hidden="true" />
            <span className="history-pin bottom-2 right-2" aria-hidden="true" />
          </div>
        </header>

        <nav
          className="mt-0 grid grid-cols-3 items-center border-y border-[var(--line)] bg-[var(--panel)] px-3 text-center text-[0.68rem] uppercase tracking-[0.08em] md:text-[0.8rem]"
          aria-label="Primar navigation"
        >
          <NavLink
            to="/by-date"
            className={({ isActive }: NavLinkRenderProps) =>
              `${isActive ? activeClass : idleClass} py-2.5`
            }
          >
            By Date
          </NavLink>
          <NavLink
            to="/today"
            className={({ isActive }: NavLinkRenderProps) =>
              `${isActive ? activeClass : idleClass} py-2.5`
            }
          >
            Today
          </NavLink>
          <NavLink
            to="/since"
            className={({ isActive }: NavLinkRenderProps) =>
              `${isActive ? activeClass : idleClass} py-2.5`
            }
          >
            Since
          </NavLink>
        </nav>

        <main className="min-h-[60vh] px-2 pb-10 pt-5 md:px-8 md:pt-8 xl:px-14 xl:pt-10">
          <Outlet />
        </main>

        <footer className="border-t border-[var(--line)] px-3 py-2 text-right text-[10px] text-[var(--muted)]">
          Data from history.muffinlabs.com
        </footer>

        <BackToTopButton />
        <div className="fixed bottom-4 left-4 z-30">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </div>
  )
}

export default Layout
