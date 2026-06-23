import Link from 'next/link'
import { createDiscount } from '@/lib/actions/admin/discounts'
import { s } from '../../_components/styles'

export const metadata = { title: 'Nuovo coupon' }

export default function NuovoScontoPage() {
  return (
    <>
      <div style={s.breadcrumb}>
        <Link href="/admin/sconti" style={s.link}>← Sconti</Link>
        <span style={{ color: '#d1d5db' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>Nuovo coupon</span>
      </div>

      <div style={{ maxWidth: 520 }}>
        <form action={createDiscount} style={s.stack(0)}>
          <div style={s.cardPad}>
            <p style={s.cardTitle}>Crea coupon sconto</p>
            <div style={s.stack(14)}>
              <div>
                <label style={s.label}>Codice coupon<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                <input name="code" required placeholder="es. ESTATE20" style={s.input} />
              </div>

              <div style={s.grid2}>
                <div>
                  <label style={s.label}>Tipo sconto<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                  <select name="type" required style={s.select}>
                    <option value="percent">Percentuale (%)</option>
                    <option value="fixed">Fisso (€)</option>
                  </select>
                </div>
                <div>
                  <label style={s.label}>Valore<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                  <input name="value" type="number" required placeholder="es. 20" style={s.input} />
                </div>
              </div>

              <div style={s.grid2}>
                <div>
                  <label style={s.label}>Importo minimo (€)</label>
                  <input name="minOrderAmount" type="number" placeholder="opzionale" style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Usi massimi</label>
                  <input name="maxUses" type="number" placeholder="opzionale" style={s.input} />
                </div>
              </div>

              <div style={s.grid2}>
                <div>
                  <label style={s.label}>Applicabile a</label>
                  <select name="applicableTo" style={s.select}>
                    <option value="all">Tutti</option>
                    <option value="b2b">Solo B2B</option>
                    <option value="consumer">Solo Consumer</option>
                  </select>
                </div>
                <div>
                  <label style={s.label}>Scadenza</label>
                  <input name="expiresAt" type="date" style={s.input} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '0' }}>
            <button type="submit" style={{ ...s.btnPrimary, marginTop: 16, borderRadius: 8, padding: '11px 0' }}>
              Crea coupon
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
