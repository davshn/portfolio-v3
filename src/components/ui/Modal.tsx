import { useEffect } from 'react'
import ReactModal from 'react-modal'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  className?: string
  children: React.ReactNode
}

export default function Modal({
  isOpen,
  onClose,
  className = '',
  children,
}: ModalProps): React.ReactElement {
  useEffect((): void => {
    // setAppElement must run client-side only — document is not available during SSR
    if (typeof document !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- react-modal lacks setAppElement type; assertion is safe at runtime
      ;(ReactModal as unknown as { setAppElement: (el: HTMLElement) => void }).setAppElement(
        document.body,
      )
    }
  }, [])

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={`custom-modal ${className}`.trim()}
      overlayClassName="custom-overlay"
      closeTimeoutMS={500}
    >
      {children}
    </ReactModal>
  )
}
