import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ByDatePage from './pages/ByDatePage'
import SincePage from './pages/SincePage'
import TodayPage from './pages/TodayPage'

type Theme = 'light' | 'dark'

const THEME_KEY = 'history-theme'

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem(THEME_KEY)

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return 'light'
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Layout
              theme={theme}
              onToggleTheme={() =>
                setTheme((current) => (current === 'light' ? 'dark' : 'light'))
              }
            />
          }
        >
          <Route index element={<Navigate to="/today" replace />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/by-date" element={<ByDatePage />} />
          <Route path="/since" element={<SincePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
