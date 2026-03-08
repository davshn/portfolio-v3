import { useState } from 'react'
// react-slick is a CJS-only package; .default fallback handles Vite ESM interop
import SliderLib from 'react-slick'
import { Tooltip } from 'react-tooltip'

import Modal from '../ui/Modal'

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-type-assertion -- CJS/ESM interop: fallback handles both { default: Fn } and direct Fn cases */
const Slider: React.ComponentType<Record<string, unknown>> = (
  ((SliderLib as any).default ?? SliderLib) as React.ComponentType<Record<string, unknown>>
)
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-type-assertion */

const DESKTOP_SPEED = 800
const DESKTOP_SLIDES = 3
const MOBILE_BREAKPOINT = 575
const MOBILE_SPEED = 300
const MOBILE_SLIDES = 1
const SCROLL_AMOUNT = 1

interface Project {
  id: string
  title: string
  client: string
  category: string
  date: string
  liveUrl?: string
  stack: string[]
  thumbnail: string
  description: string
  body: string
}

interface Props {
  projects: Project[]
}

export default function PortfolioCarousel({ projects }: Props): React.ReactElement {
  const [activeProject, setActiveProject] = useState<string | null>(null)

  const activeItem = projects.find((p) => p.id === activeProject) ?? null

  const settings = {
    dots: true,
    infinite: true,
    speed: DESKTOP_SPEED,
    slidesToShow: DESKTOP_SLIDES,
    slidesToScroll: SCROLL_AMOUNT,
    draggable: false,
    arrows: true,
    responsive: [
      {
        breakpoint: MOBILE_BREAKPOINT,
        settings: {
          slidesToShow: MOBILE_SLIDES,
          slidesToScroll: SCROLL_AMOUNT,
          speed: MOBILE_SPEED,
          draggable: true,
          dots: true,
          arrows: false,
        },
      },
    ],
  }

  return (
    <>
      <div className="portfolio-carousel-wrapper" data-aos="fade-up" data-aos-duration="1200">
        <Slider {...settings}>
          {projects.map((project) => (
            <div key={project.id} className="portfolio-slide">
              <button
                className="portfolio-card"
                onClick={() => {
                  setActiveProject(project.id)
                }}
                data-tooltip-id={`tooltip-${project.id}`}
                data-tooltip-content={project.title}
                aria-label={`View ${project.title} project`}
              >
                {/* Replace with real image once available */}
                <div className="portfolio-thumb-placeholder">
                  {/* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 0 is the first character index */}
                  <span>{project.title.charAt(0)}</span>
                </div>
                <div className="portfolio-card-info">
                  <h3>{project.title}</h3>
                  <p>{project.category}</p>
                </div>
              </button>
              <Tooltip id={`tooltip-${project.id}`} place="bottom" variant="light" float />
            </div>
          ))}
        </Slider>
      </div>

      {activeItem !== null && (
        <Modal
          isOpen={activeProject !== null}
          onClose={() => {
            setActiveProject(null)
          }}
        >
          <button
            className="modal-close-btn"
            onClick={() => {
              setActiveProject(null)
            }}
            aria-label="Close modal"
          >
            <img src="/img/svg/cancel.svg" alt="Close" width={24} height={24} />
          </button>
          <div className="project-modal-content">
            <h2>{activeItem.title}</h2>
            <div className="project-meta">
              <span>
                <strong>Client:</strong> {activeItem.client}
              </span>
              <span>
                <strong>Category:</strong> {activeItem.category}
              </span>
              <span>
                <strong>Date:</strong> {activeItem.date}
              </span>
            </div>
            <p className="project-desc">{activeItem.description}</p>
            {activeItem.body !== '' && (
              <p className="project-desc">{activeItem.body}</p>
            )}
            <div className="project-stack">
              {activeItem.stack.map((tech) => (
                <span key={tech} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
            {activeItem.liveUrl !== undefined && activeItem.liveUrl !== '' && (
              <a
                href={activeItem.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-live-link"
              >
                View Live Project →
              </a>
            )}
          </div>
        </Modal>
      )}

      <style>{`
        .portfolio-carousel-wrapper { padding: 0 2.5rem 2rem; }
        .portfolio-carousel-wrapper .slick-prev,
        .portfolio-carousel-wrapper .slick-next {
          width: 36px; height: 36px;
          background: #34495e;
          border-radius: 50%;
          z-index: 10;
        }
        .portfolio-carousel-wrapper .slick-prev { left: -8px; }
        .portfolio-carousel-wrapper .slick-next { right: -8px; }
        .portfolio-carousel-wrapper .slick-prev::before,
        .portfolio-carousel-wrapper .slick-next::before {
          font-size: 18px;
          line-height: 36px;
          color: #fff;
          opacity: 1;
        }
        .portfolio-carousel-wrapper .slick-dots li button::before {
          font-size: 10px;
          color: #34495e;
          opacity: 0.4;
        }
        .portfolio-carousel-wrapper .slick-dots li.slick-active button::before {
          opacity: 1;
        }
        .portfolio-slide { padding: 0 0.75rem; }
        .portfolio-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: none;
          width: 100%;
          text-align: left;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }
        .portfolio-card:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          transform: translateY(-4px);
        }
        .portfolio-thumb-placeholder {
          width: 100%;
          aspect-ratio: 4/3;
          background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
        }
        .portfolio-card-info { padding: 1rem; }
        .portfolio-card-info h3 { font-size: 1rem; font-weight: 700; color: #1a1a1a; margin-bottom: 0.25rem; }
        .portfolio-card-info p { font-size: 0.8rem; color: #7e7e7e; }
        .project-modal-content h2 { font-size: 1.5rem; font-weight: 700; color: #1a1a1a; margin-bottom: 1rem; }
        .project-meta { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
        .project-meta span { font-size: 0.85rem; color: #7e7e7e; }
        .project-meta strong { color: #1a1a1a; }
        .project-desc { color: #7e7e7e; line-height: 1.8; margin-bottom: 1rem; }
        .project-stack { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
        .tech-tag {
          padding: 0.25rem 0.75rem;
          background: #f0f4f7;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #34495e;
        }
        .project-live-link {
          display: inline-block;
          padding: 0.6rem 1.25rem;
          background: #34495e;
          color: #fff;
          border-radius: 6px;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          transition: opacity 0.2s ease;
        }
        .project-live-link:hover { opacity: 0.85; }
      `}</style>
    </>
  )
}
