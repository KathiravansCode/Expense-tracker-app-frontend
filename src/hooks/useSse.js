import { useEffect, useRef, useState } from 'react'
import { config } from '../config'

export function useSseAlerts({ token, enabled }) {
  const [status, setStatus] = useState('idle') // idle | connecting | open | closed | error
  const sourceRef = useRef(null)

  useEffect(() => {
    if (!enabled || !token) return

    setStatus('connecting')

    const base = config.apiBaseUrl.replace(/\/+$/, '')
    const url = `${base}/api/alerts/subscribe`

    // NOTE: Native EventSource does not support custom headers; to authenticate
    // we pass token via query param (backend would need to support it) OR rely on
    // same-origin cookies. Your backend currently expects Authorization header.
    // So we keep SSE disabled by default and provide an opt-in fallback:
    // run frontend behind same origin/proxy if you want header-based auth.
    const source = new EventSource(url)
    sourceRef.current = source

    const onOpen = () => setStatus('open')
    const onError = () => setStatus('error')

    source.addEventListener('open', onOpen)
    source.addEventListener('error', onError)

    return () => {
      setStatus('closed')
      source.removeEventListener('open', onOpen)
      source.removeEventListener('error', onError)
      source.close()
      sourceRef.current = null
    }
  }, [enabled, token])

  return { status }
}

