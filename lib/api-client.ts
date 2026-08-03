/**
 * Chiamate alle route API interne dal client.
 *
 * Lo stesso blocco fetch (method, headers, JSON.stringify, lettura della
 * risposta, gestione errore) era ricopiato in sei componenti, ognuno con una
 * gestione dell'errore leggermente diversa: alcuni ignoravano il corpo della
 * risposta, altri non intercettavano affatto gli errori di rete.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/** Messaggio mostrato quando la richiesta non parte o il server non risponde. */
export const NETWORK_ERROR_MESSAGE = 'Connessione non riuscita. Riprova.'

interface PostJsonOptions {
  /** Messaggio da usare se la risposta non contiene un errore leggibile. */
  fallbackError?: string
}

/**
 * Invia JSON a una route interna e restituisce il corpo della risposta.
 * Solleva ApiError con il messaggio del server se la risposta non è positiva.
 */
export async function postJson<T = Record<string, unknown>>(
  path: string,
  body: unknown,
  { fallbackError = 'Si è verificato un errore. Riprova.' }: PostJsonOptions = {}
): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new ApiError(NETWORK_ERROR_MESSAGE, 0)
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      (data as { error?: string; message?: string } | null)?.error ??
      (data as { message?: string } | null)?.message ??
      fallbackError
    throw new ApiError(message, response.status)
  }

  return (data ?? {}) as T
}
