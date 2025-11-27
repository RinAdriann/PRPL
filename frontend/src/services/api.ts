const API_BASE = import.meta.env.VITE_API_URL || window.location.origin

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    ...(options.headers ? options.headers as Record<string,string> : {})
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, body: any) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path: string, body: any) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path: string) => request(path, { method: 'DELETE' }),
  // lessons
  lessons: () => request('/lessons'),
  getLesson: (id: string) => request(`/lessons/${id}`),
  createLesson: (data: any) => request('/lessons', { method: 'POST', body: JSON.stringify(data) }),
  deleteLesson: (id: string) => request(`/lessons/${id}`, { method: 'DELETE' }),
  // progress
  lessonProgress: (lessonId: string) => request(`/progress/lesson/${lessonId}`),
  updateProgress: (lessonId: string, data: any) =>
    request(`/progress/lesson/${lessonId}`, { method: 'PUT', body: JSON.stringify(data) }),
  myProgress: () => request('/progress/my'),
  // quizzes
  getQuiz: async (lessonId: string) => {
    const data = await request(`/quizzes/${lessonId}`)
    // normalize questions so answerMap exists
    if (Array.isArray(data?.questions)) {
      data.questions = data.questions.map((q: any) => ({
        ...q,
        answerMap: q.answerMap ?? {},  // ensure object
      }))
    }
    return data
  },
  submitQuiz: (quizId: string, payload: any) =>
    request(`/quizzes/${quizId}/submit`, { method: 'POST', body: JSON.stringify(payload) }),
  // educator
  educatorChildren: (educatorId: string) => request(`/educator/${educatorId}/children`)
}
