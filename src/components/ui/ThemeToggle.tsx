import { useState, useEffect } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'

export default function ThemeToggle(): React.ReactElement {
  const [isDark, setIsDark] = useState(false)

  useEffect((): void => {
    setIsDark(document.body.classList.contains('theme-dark'))
  }, [])

  function toggle(): void {
    const next = isDark ? 'theme-light' : 'theme-dark'
    document.body.className = next
    localStorage.setItem('theme-color', next)
    setIsDark(!isDark)
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        background: 'none',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '6px',
        padding: '0.5rem 1rem',
        color: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.85rem',
        transition: 'all 0.3s ease',
      }}
    >
      {isDark ? <FaSun size={14} /> : <FaMoon size={14} />}
      {isDark ? 'Light' : 'Dark'}
    </button>
  )
}
