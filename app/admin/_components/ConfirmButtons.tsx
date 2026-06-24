'use client'

import { useRef, useState } from 'react'
import { ConfirmModal } from './ConfirmModal'

interface SaveProps {
  label: string
  title?: string
  message?: string
  style?: React.CSSProperties
}

/** Intercetta il submit del form padre e mostra conferma prima di procedere */
export function ConfirmSaveButton({ label, title = 'Conferma salvataggio', message = 'Vuoi salvare le modifiche?', style }: SaveProps) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  function handleClick() {
    setOpen(true)
  }

  function handleConfirm() {
    setOpen(false)
    // Trova il form antenato e lo invia
    btnRef.current?.closest('form')?.requestSubmit()
  }

  return (
    <>
      <button ref={btnRef} type="button" onClick={handleClick} style={style}>
        {label}
      </button>
      <ConfirmModal
        open={open}
        title={title}
        message={message}
        confirmLabel="Salva"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}

interface DeleteProps {
  formAction: (fd: FormData) => Promise<void>
  hiddenFields?: Record<string, string>
  title?: string
  message?: string
  buttonLabel?: string
  buttonStyle?: React.CSSProperties
}

/** Form di eliminazione con conferma */
export function ConfirmDeleteButton({ formAction, hiddenFields, title = 'Conferma eliminazione', message = 'Questa operazione è irreversibile. Continuare?', buttonLabel = 'Elimina', buttonStyle }: DeleteProps) {
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function handleConfirm() {
    setOpen(false)
    formRef.current?.requestSubmit()
  }

  return (
    <>
      <form ref={formRef} action={formAction}>
        {hiddenFields && Object.entries(hiddenFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <button type="button" onClick={() => setOpen(true)} style={buttonStyle}>
          {buttonLabel}
        </button>
      </form>
      <ConfirmModal
        open={open}
        title={title}
        message={message}
        confirmLabel="Elimina"
        danger
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
