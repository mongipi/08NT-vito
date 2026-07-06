'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { Ingredient } from '@/types'

interface Props {
  ingredients: Ingredient[]
  color: string
}

export function IngredientsDisclosure({ ingredients, color }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="v61-ingredients-disclosure" style={{ '--accent': color } as CSSProperties}>
      <button
        type="button"
        className="v61-ingredients-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>Contenuti medi per dose giornaliera</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={open ? 'm18 15-6-6-6 6' : 'm6 9 6 6 6-6'} />
        </svg>
      </button>

      {open && (
        <table className="v61-ingredients-table">
          <thead>
            <tr>
              <th>Ingrediente</th>
              <th>Per dose</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ing, i) => (
              <tr key={`${ing.name}-${i}`}>
                <td><span />{ing.name}</td>
                <td>{ing.dosage ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
