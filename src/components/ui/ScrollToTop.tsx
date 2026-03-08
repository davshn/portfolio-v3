import { useState, useEffect } from 'react'

const SCROLL_THRESHOLD = 500
const SCROLL_TOP = 0
const BUTTON_Z_INDEX = 999

export default function ScrollToTop(): React.ReactElement | null {
  const [visible, setVisible] = useState(false)

  useEffect((): (() => void) => {
    function onScroll(): void {
      setVisible(window.scrollY > SCROLL_THRESHOLD)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  function scrollTop(): void {
    window.scrollTo({ top: SCROLL_TOP, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollTop}
      aria-label="Scroll to top"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'var(--color-brand, #34495e)',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: BUTTON_Z_INDEX,
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        transition: 'opacity 0.3s ease',
        fontSize: '1.2rem',
      }}
    >
      ↑
    </button>
  )
}
