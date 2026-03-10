import { useState } from 'react'

import type { AboutMessages } from '../../i18n/utils'
import AboutModal from './AboutModal'

interface Experience {
  startYear: string
  endYear: string
  role: string
  company: string
}

interface Education {
  year: string
  degree: string
  institution: string
}

interface Props {
  experience: Experience[]
  education: Education[]
  messages: AboutMessages
}

export default function AboutIsland({ experience, education, messages }: Props): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="btn-see-more"
        onClick={() => {
          setIsOpen(true)
        }}
        aria-label={messages.seeMoreButton}
      >
        {messages.seeMoreButton}
      </button>
      <AboutModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
        experience={experience}
        education={education}
        messages={messages}
      />
      <style>{`
        .btn-see-more {
          display: inline-block;
          padding: 0.75rem 1.75rem;
          border: 2px solid #7e7e7e;
          border-radius: 6px;
          background: transparent;
          color: #1a1a1a;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.05em;
        }
        .btn-see-more:hover {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }
      `}</style>
    </>
  )
}
