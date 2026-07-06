import type { ReactNode } from 'react'

/**
 * Converte un testo con marcatori semplici in nodi React:
 * - "\n" -> <br />
 * - "**parola**" -> <em>parola</em>
 * Usato per titoli/headline che nella traduzione devono poter spostare
 * l'enfasi o andare a capo in un punto diverso dall'originale.
 */
export function richText(text: string): ReactNode {
  return text.split('\n').map((line, lineIndex, lines) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
    return (
      <span key={lineIndex}>
        {parts.map((part, i) =>
          part.startsWith('**') && part.endsWith('**')
            ? <em key={i}>{part.slice(2, -2)}</em>
            : <span key={i}>{part}</span>
        )}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    )
  })
}
