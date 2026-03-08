import { ReactTyped } from 'react-typed'

export default function TypedHero(): React.ReactElement {
  return (
    <ReactTyped
      strings={['Senior Mobile Engineer', 'React Native Architect', 'Fintech & Secure Payments', 'Fullstack Developer']}
      typeSpeed={150}
      backSpeed={60}
      backDelay={1}
      loop
      showCursor
      cursorChar="|"
    />
  )
}
