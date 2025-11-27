const API_BASE = import.meta.env.VITE_API_URL || window.location.origin

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers ? options.headers as Record<string, string> : {})
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, body: any) =>
    request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path: string, body: any) =>
    request(path, { method: 'PUT', body: JSON.stringify(body) })
}
