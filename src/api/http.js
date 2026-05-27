import { config } from '../config'

function buildUrl(path, query) {
  const baseRaw = (config.apiBaseUrl || '').trim()
  const base = baseRaw ? baseRaw.replace(/\/+$/, '') : window.location.origin
  const p = path.startsWith('/') ? path : `/${path}`
  const url = new URL(p, base)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

async function readBody(response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return response.json()
  return response.text()
}

export class ApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export async function apiRequest(path, { method = 'GET', token, query, body, headers } = {}) {
  const url = buildUrl(path, query)

  const resolvedHeaders = {
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers || {}),
  }

  const response = await fetch(url, {
    method,
    headers: resolvedHeaders,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 204) return null

  const payload = await readBody(response)

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && (payload.message || payload.error)) ||
      (typeof payload === 'string' && payload) ||
      'Request failed'
    throw new ApiError(message, { status: response.status, payload })
  }

  return payload
}

export function unwrapApiResponse(payload) {
  if (payload && typeof payload === 'object' && 'success' in payload && 'data' in payload) {
    if (!payload.success) throw new ApiError(payload.message || 'Request failed', { status: 400, payload })
    return payload.data
  }
  return payload
}
