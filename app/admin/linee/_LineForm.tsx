'use client'
import type { Line } from '@prisma/client'
import { useState } from 'react'
import { s } from '../_components/styles'

interface Props {
  action: (fd: FormData) => Promise<void>
  line?: Line
  deleteAction?: (fd: FormData) => Promise<void>
}

function ColorField({ label, name, value }: { label: string; name: string; value: string }) {
  const [hex, setHex] = useState(value)

  return (
    <div>
      <label style={s.label}>{label}<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Color swatch / native picker */}
        <label style={{ position: 'relative', width: 40, height: 36, borderRadius: 7, overflow: 'hidden', border: '1.5px solid #e5e7eb', cursor: 'pointer', flexShrink: 0, background: hex }}>
          <input
            type="color"
            value={hex}
            onChange={e => setHex(e.target.value)}
            style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer', padding: 0, border: 'none' }}
          />
        </label>
        {/* Hex input */}
        <input
          type="text"
          name={name}
          value={hex}
          onChange={e => {
            const v = e.target.value
            setHex(v)
          }}
          placeholder="#000000"
          maxLength={7}
          style={{ ...s.input, fontFamily: 'monospace', letterSpacing: '0.05em', flex: 1 }}
        />
        {/* Preview dot */}
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: hex, border: '1.5px solid #e5e7eb', flexShrink: 0 }} />
      </div>
    </div>
  )
}

export function LineForm({ action, line, deleteAction }: Props) {
  return (
    <>
      <form action={action}>
        {line && <input type="hidden" name="id" value={line.id} />}

        <div style={{ maxWidth: 520, ...s.stack(0) }}>
          <div style={s.cardPad}>
            <p style={s.cardTitle}>Dettagli linea</p>
            <div style={s.stack(14)}>
              <div>
                <label style={s.label}>Nome<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                <input name="name" required defaultValue={line?.name} placeholder="es. Linea Menopausa" style={s.input} />
              </div>
              <div>
                <label style={s.label}>Slug<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                <input name="slug" required defaultValue={line?.slug} placeholder="es. menopausa" style={{ ...s.input, fontFamily: 'monospace' }} />
                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, marginBottom: 0 }}>Identificatore URL, solo lettere minuscole e trattini.</p>
              </div>
            </div>
          </div>

          <div style={{ ...s.cardPad, marginTop: 12 }}>
            <p style={s.cardTitle}>Colori</p>
            <div style={s.stack(14)}>
              <ColorField label="Colore principale" name="color" value={line?.color ?? '#1a4a2e'} />
              <ColorField label="Colore chiaro (sfondo)" name="colorLight" value={line?.colorLight ?? '#f0fdf4'} />

              {/* Preview card */}
              <div style={{ marginTop: 4 }}>
                <p style={{ ...s.label, marginBottom: 8 }}>Anteprima</p>
                <LinePreview />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <button type="submit" style={s.btnPrimary}>
              {line ? 'Salva modifiche' : 'Crea linea'}
            </button>
          </div>
        </div>
      </form>

      {line && deleteAction && (
        <div style={{ marginTop: 24, maxWidth: 520 }}>
          <div style={{ ...s.cardPad, borderColor: '#fecaca', background: '#fff5f5' }}>
            <p style={{ ...s.cardTitle, color: '#dc2626', marginBottom: 6 }}>Zona pericolosa</p>
            <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 14, marginTop: 0 }}>
              Elimina la linea. I prodotti associati rimarranno senza linea.
            </p>
            <form action={deleteAction}>
              <input type="hidden" name="id" value={line.id} />
              <button type="submit" style={s.btnDanger}>Elimina linea</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

function LinePreview() {
  return (
    <div style={{ fontSize: 11, color: '#9ca3af', fontStyle: 'italic' }}>
      L&apos;anteprima è visibile dopo il salvataggio nella lista linee.
    </div>
  )
}
