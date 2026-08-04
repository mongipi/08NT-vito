'use client'

import { useCallback, useState } from 'react'
import { ApiError, postJson } from '@/lib/api-client'

/**
 * Stato di invio di una form verso una route API interna.
 *
 * Sostituisce il trittico useState(loading) + useState(error) + useState(submitted)
 * che era ripetuto in ogni form del sito.
 */
export type ApiFormStatus = 'idle' | 'loading' | 'success' | 'error'

interface UseApiFormOptions<T> {
  path: string
  fallbackError?: string
  onSuccess?: (data: T) => void
}

export function useApiForm<T = Record<string, unknown>>({
  path,
  fallbackError,
  onSuccess,
}: UseApiFormOptions<T>) {
  const [status, setStatus] = useState<ApiFormStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)

  const submit = useCallback(
    async (body: unknown) => {
      setStatus('loading')
      setError(null)
      try {
        const result = await postJson<T>(path, body, { fallbackError })
        setData(result)
        setStatus('success')
        onSuccess?.(result)
        return result
      } catch (caught) {
        setError(caught instanceof ApiError ? caught.message : (fallbackError ?? 'Errore'))
        setStatus('error')
        return null
      }
    },
    [path, fallbackError, onSuccess]
  )

  const reset = useCallback(() => {
    setStatus('idle')
    setError(null)
    setData(null)
  }, [])

  return {
    submit,
    reset,
    status,
    error,
    data,
    loading: status === 'loading',
    succeeded: status === 'success',
  }
}
