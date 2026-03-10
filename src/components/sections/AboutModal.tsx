import { useState } from 'react'

import type { AboutMessages } from '../../i18n/utils'
import Modal from '../ui/Modal'

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
  isOpen: boolean
  onClose: () => void
  experience: Experience[]
  education: Education[]
  messages: AboutMessages
}

type Tab = 'personal' | 'experience' | 'education'

export default function AboutModal({
  isOpen,
  onClose,
  experience,
  education,
  messages,
}: Props): React.ReactElement {
  const [activeTab, setActiveTab] = useState<Tab>('personal')

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'personal', label: messages.modal.tabs.personal },
    { id: 'experience', label: messages.modal.tabs.experience },
    { id: 'education', label: messages.modal.tabs.education },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="about-popup-wrapper">
      <button className="modal-close-btn" onClick={onClose} aria-label={messages.modal.tabs.personal}>
        <img src="/img/svg/cancel.svg" alt="Close" width={24} height={24} />
      </button>

      <div className="about-modal-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`about-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id)
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="about-modal-content">
        {activeTab === 'personal' && (
          <div className="tab-panel">
            <h3>{messages.modal.personal.heading}</h3>
            <ul className="info-list">
              <li>
                <span>{messages.modal.personal.fullName}:</span> Hernán David Figueroa Cárdenas
              </li>
              <li>
                <span>{messages.modal.personal.location}:</span> Galan, Bogota, Colombia
              </li>
              <li>
                <span>{messages.modal.personal.phone}:</span> +57 3106961637
              </li>
              <li>
                <span>{messages.modal.personal.email}:</span> davshn@gmail.com
              </li>
              <li>
                <span>{messages.modal.personal.languages}:</span> Spanish, English
              </li>
              <li>
                <span>{messages.modal.personal.discord}:</span> Davshn#3361
              </li>
              <li>
                <span>{messages.modal.personal.freelance}:</span> {messages.modal.personal.freelanceValue}
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="tab-panel">
            <h3>{messages.modal.experience.heading}</h3>
            <ul className="timeline-list">
              {experience.map((item, i) => (
                <li key={i} className="timeline-item">
                  <span className="timeline-year">
                    {item.startYear}–{item.endYear}
                  </span>
                  <div>
                    <strong>{item.role}</strong>
                    <p>@ {item.company}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="tab-panel">
            <h3>{messages.modal.education.heading}</h3>
            <ul className="timeline-list">
              {education.map((item, i) => (
                <li key={i} className="timeline-item">
                  <span className="timeline-year">{item.year}</span>
                  <div>
                    <strong>{item.degree}</strong>
                    <p>@ {item.institution}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style>{`
        .about-modal-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .about-tab-btn {
          padding: 0.5rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          background: none;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          color: #7e7e7e;
          transition: all 0.2s ease;
        }
        .about-tab-btn.active,
        .about-tab-btn:hover {
          border-color: #34495e;
          background: #34495e;
          color: #fff;
        }
        .tab-panel h3 {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }
        .info-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .info-list li { font-size: 0.9rem; color: #7e7e7e; }
        .info-list span { font-weight: 600; color: #1a1a1a; margin-right: 0.5rem; }
        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .achievement-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem;
          border: 2px solid #f0f0f0;
          border-radius: 8px;
          text-align: center;
        }
        .achievement-number { font-size: 2.5rem; font-weight: 800; color: #34495e; }
        .achievement-label { font-size: 0.8rem; color: #7e7e7e; margin-top: 0.25rem; }
        .timeline-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 1rem; }
        .timeline-item { display: flex; gap: 1rem; align-items: flex-start; }
        .timeline-year {
          font-size: 0.75rem;
          font-weight: 600;
          color: #34495e;
          background: #f0f4f7;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .timeline-item strong { font-size: 0.9rem; color: #1a1a1a; display: block; }
        .timeline-item p { font-size: 0.85rem; color: #7e7e7e; margin: 0.25rem 0 0; }
      `}</style>
    </Modal>
  )
}
