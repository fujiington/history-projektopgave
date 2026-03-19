import { useEffect, useState } from 'react'

function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 600)
    }

    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <button
      type="button"
      className="fixed bottom-4 right-4 z-30 rounded-full border border-[var(--line)] bg-[var(--panel-alt)] px-3 py-1.5 text-[11px] uppercase tracking-wider text-[var(--gold)] shadow-lg transition hover:bg-[var(--panel)]"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Tilbage til toppen"
    >
      Back To Top
    </button>
  )
}

export default BackToTopButton
