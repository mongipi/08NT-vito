'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { Ingredient } from '@/types'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'

interface Props {
  ingredients: Ingredient[]
  color: string
}

export function IngredientsDisclosure({ ingredients, color }: Props) {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const [open, setOpen] = useState(false)
  const showVnr = ingredients.some((ing) => Boolean(ing.vnr?.trim()))

  return (
    <div className="v61-ingredients-disclosure" style={{ '--accent': color } as CSSProperties}>
      <button
        type="button"
        className="v61-ingredients-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>{t('ingredients_nutritional_values')}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={open ? 'm18 15-6-6-6 6' : 'm6 9 6 6 6-6'} />
        </svg>
      </button>

      {open && (
        <table className="v61-ingredients-table">
          <thead>
            <tr>
              <th>{t('ingredients_table_ingredient')}</th>
              <th>{t('ingredients_table_per_dose')}</th>
              {showVnr && <th>{t('ingredients_table_vnr')}</th>}
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ing, i) => (
              <tr key={`${ing.name}-${i}`}>
                <td><span />{ing.name}</td>
                <td>{ing.dosage ?? '-'}</td>
                {showVnr && <td>{ing.vnr || '-'}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
