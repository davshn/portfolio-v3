import { ReactTyped } from 'react-typed'

interface Props {
  strings: string[]
}

export default function TypedHero({ strings }: Props): React.ReactElement {
  return (
    <ReactTyped
      strings={strings}
      typeSpeed={150}
      backSpeed={60}
      backDelay={1}
      loop
      showCursor
      cursorChar="|"
    />
  )
}
