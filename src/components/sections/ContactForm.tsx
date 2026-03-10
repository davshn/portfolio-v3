import { useRef } from 'react'

import type { ContactMessages } from '../../i18n/utils'

const TO_EMAIL = 'davshn@gmail.com'

interface Props {
  messages: ContactMessages
}

export default function ContactForm({ messages }: Props): React.ReactElement {
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    const name = nameRef.current?.value ?? ''
    const email = emailRef.current?.value ?? ''
    const message = messageRef.current?.value ?? ''

    const subject = encodeURIComponent(`Portfolio Contact from ${name}`)
    const body = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <label htmlFor="user_name">{messages.form.nameLabel}</label>
        <input
          id="user_name"
          type="text"
          name="user_name"
          placeholder={messages.form.namePlaceholder}
          required
          ref={nameRef}
        />
      </div>

      <div className="form-group">
        <label htmlFor="user_email">{messages.form.emailLabel}</label>
        <input
          id="user_email"
          type="email"
          name="user_email"
          placeholder={messages.form.emailPlaceholder}
          required
          ref={emailRef}
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">{messages.form.messageLabel}</label>
        <textarea
          id="message"
          name="message"
          placeholder={messages.form.messagePlaceholder}
          rows={5}
          required
          ref={messageRef}
        />
      </div>

      <button type="submit" className="submit-btn">
        {messages.form.submitButton}
      </button>

      <style>{`
        .contact-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group label { font-size: 0.85rem; font-weight: 600; color: #1a1a1a; }
        .form-group input,
        .form-group textarea {
          padding: 0.75rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          color: #1a1a1a;
          background: #fff;
          transition: border-color 0.2s ease;
          resize: vertical;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #34495e;
        }
        .submit-btn {
          padding: 0.85rem 2rem;
          background: #34495e;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s ease;
          align-self: flex-start;
        }
        .submit-btn:hover { opacity: 0.85; }
      `}</style>
    </form>
  )
}
