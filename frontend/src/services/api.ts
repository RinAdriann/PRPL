const RAW_BASE = import.meta.env.VITE_API_URL;
const BASE = (typeof RAW_BASE === 'string' && RAW_BASE) ? RAW_BASE.replace(/\/+$/,'') : 'http://localhost:4000/api';

console.log('[API BASE]', BASE);

function token() { return localStorage.getItem('token'); }

async function request(path: string, opts: RequestInit = {}) {
  const t = token();
  const headers: Record<string,string> = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (t) headers.Authorization = `Bearer ${t}`;
  const url = path.startsWith('/') ? `${BASE}${path}` : `${BASE}/${path}`;
  const res = await fetch(url, { ...opts, headers });
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

const get  = (p: string) => request(p);
const post = (p: string, body?: any) => request(p, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
const put  = (p: string, body?: any) => request(p, { method: 'PUT', body: body ? JSON.stringify(body) : undefined });
const del  = (p: string) => request(p, { method: 'DELETE' });

export const api = {
  login: (email: string, password: string) => post('/auth/login', { email, password }),
  register: (email: string, password: string, role: string = 'educator') => post('/auth/register', { email, password, role }),
  guest: () => post('/auth/guest', {}),
  me: () => get('/auth/me'),
  lessons: () => get('/lessons'),
  getLesson: (id: string) => get(`/lessons/${id}`),
  createLesson: (title: string, description?: string) => post('/lessons', { title, description }),
  deleteLesson: (id: string) => request(`/lessons/${id}`, { method: 'DELETE' }),
  myProgress: () => get('/progress/mine'),
  updateProgress: (lessonId: string, percent: number) => post('/progress', { lessonId, percent }),
  lessonProgress: (lessonId: string) => get(`/progress/lesson/${lessonId}`)
};

export default api;
