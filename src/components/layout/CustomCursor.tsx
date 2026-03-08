import { useEffect, useState } from 'react'

// AnimatedCursor is loaded dynamically to avoid SSR issues
type CursorProps = Record<string, unknown>

export default function CustomCursor(): React.ReactElement | null {
  const [AnimatedCursor, setAnimatedCursor] = useState<React.ComponentType<CursorProps> | null>(
    null,
  )

  useEffect((): void => {
    void import('react-animated-cursor').then(
      (mod: { default: React.ComponentType<CursorProps> }) => {
        setAnimatedCursor(() => mod.default)
      },
    )
  }, [])

  if (AnimatedCursor === null) return null

  return (
    <AnimatedCursor
      innerSize={8}
      outerSize={44}
      color="153,153,255"
      outerAlpha={0.3}
      innerScale={0.7}
      outerScale={1.4}
      innerStyle={{ zIndex: 9999 }}
      outerStyle={{ zIndex: 9999 }}
    />
  )
}
