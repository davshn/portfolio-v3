import { useState, useEffect } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'

interface Props {
  labelDark?: string
  labelLight?: string
  ariaLabelDark?: string
  ariaLabelLight?: string
}

export default function ThemeToggle({
  labelDark = 'Dark',
  labelLight = 'Light',
  ariaLabelDark = 'Switch to dark mode',
  ariaLabelLight = 'Switch to light mode',
}: Props): React.ReactElement {
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
      aria-label={isDark ? ariaLabelLight : ariaLabelDark}
      className="theme-toggle-btn"
    >
      {isDark ? <FaSun size={14} /> : <FaMoon size={14} />}
      <span>{isDark ? labelLight : labelDark}</span>
    </button>
  )
}
