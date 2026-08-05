/**
 * Normalizzazione degli indirizzi email.
 *
 * PostgreSQL confronta le stringhe rispettando maiuscole e minuscole, e il
 * vincolo di unicità su User.email fa lo stesso: senza normalizzare,
 * "mario@esempio.it" e "Mario@esempio.it" sono due account distinti, e chi si
 * registra con una grafia diversa non riesce piu' ad accedere con l'altra.
 *
 * Nessun provider di posta reale distingue le maiuscole, quindi l'indirizzo va
 * ridotto a minuscolo prima di ogni lettura e di ogni scrittura.
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}
