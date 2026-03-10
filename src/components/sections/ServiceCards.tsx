import { useState } from 'react'
import Tilt from 'react-parallax-tilt'

import type { ServiceMessages } from '../../i18n/utils'
import Modal from '../ui/Modal'

interface ServiceItem {
  id: string
  title: string
  shortDescription: string
  body: string
  order: number
}

interface Props {
  services: ServiceItem[]
  messages: ServiceMessages
}

const SERVICE_ICONS: Record<string, string> = {
  'development-as-service': '💻',
  'custom-software': '⚙️',
  'vulnerability-scan': '🔒',
  'mobile-app-development': '📱',
}

const FALLBACK_ICON = '🛠️'
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- animation delay progression in ms; values are intentional design constants
const CARD_DELAYS = [100, 200, 300, 400] as const

const DEFAULT_DELAY = 100

export default function ServiceCards({ services, messages }: Props): React.ReactElement {
  const [activeService, setActiveService] = useState<string | null>(null)

  const activeItem = services.find((s) => s.id === activeService) ?? null

  return (
    <>
      <div className="services-grid">
        {services.map((service, i) => (
          <div
            key={service.id}
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-delay={CARD_DELAYS[i] ?? DEFAULT_DELAY}
          >
            <Tilt>
              <button
                className="service-card"
                onClick={() => {
                  setActiveService(service.id)
                }}
                aria-label={`Learn more about ${service.title}`}
              >
                <span className="service-icon">{SERVICE_ICONS[service.id] ?? FALLBACK_ICON}</span>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.shortDescription}</p>
              </button>
            </Tilt>
          </div>
        ))}
      </div>

      {activeItem !== null && (
        <Modal
          isOpen={activeService !== null}
          onClose={() => {
            setActiveService(null)
          }}
          className="custom-modal"
        >
          <button
            className="modal-close-btn"
            onClick={() => {
              setActiveService(null)
            }}
            aria-label={messages.modal.closeAriaLabel}
          >
            <img src="/img/svg/cancel.svg" alt="Close" width={24} height={24} />
          </button>
          <div className="service-modal-content">
            <span className="service-modal-icon">
              {SERVICE_ICONS[activeItem.id] ?? FALLBACK_ICON}
            </span>
            <h2>{activeItem.title}</h2>
            <p>{activeItem.body}</p>
          </div>
        </Modal>
      )}

      <style>{`
        .services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        @media (max-width: 600px) {
          .services-grid { grid-template-columns: 1fr; }
        }
        .service-card {
          background: #fff;
          border: 2px solid #f0f0f0;
          border-radius: 12px;
          padding: 2rem;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .service-card:hover {
          border-color: #34495e;
          box-shadow: 0 8px 30px rgba(52,73,94,0.15);
          transform: translateY(-2px);
        }
        .service-icon { font-size: 2.5rem; display: block; margin-bottom: 1rem; }
        .service-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }
        .service-desc { font-size: 0.85rem; color: #7e7e7e; line-height: 1.6; }
        .service-modal-content { padding-top: 1rem; }
        .service-modal-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
        .service-modal-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }
        .service-modal-content p { color: #7e7e7e; line-height: 1.8; }
      `}</style>
    </>
  )
}
