const BASE = import.meta.env.VITE_API_URL;

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet(path) {
  const res = await fetch(`${BASE}${path}`, { headers: { ...authHeader() } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Auth
export async function register({ email, password, role }) {
  const r = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role })
  });
  if (!r.ok) throw new Error("Registration failed");
  return r.json(); // { token, user: { id, role, email } }
}

export async function login({ email, password }) {
  const r = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!r.ok) throw new Error("Login failed");
  return r.json(); // { token, user: { id, role, email } }
}

export async function getHealth() {
  return request("/health");
}
export async function getQuizzes() {
  return request("/quizzes", { headers: authHeaders() });
}

// Lessons + modules
export async function getLessons() {
  const r = await fetch(`${API}/lessons`, { headers: authHeaders() });
  if (!r.ok) throw new Error("Failed to fetch lessons");
  return r.json(); // Expect fields: id,title,topic,description,coverUrl,modules:[{id,title,done}], ...
}

export async function createLesson(payload) {
  const r = await fetch(`${API}/lessons`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error("Failed to create lesson");
  return r.json();
}

export async function updateLesson(id, payload) {
  const r = await fetch(`${API}/lessons/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error("Failed to update lesson");
  return r.json();
}

export async function deleteLesson(id) {
  const r = await fetch(`${API}/lessons/${id}`, { method: "DELETE", headers: authHeaders() });
  if (!r.ok) throw new Error("Failed to delete lesson");
  return r.json();
}

export async function enrollLesson(lessonId) {
  const r = await fetch(`${API}/lessons/${lessonId}/enroll`, { method: "POST", headers: authHeaders() });
  if (!r.ok) throw new Error("Failed to enroll");
  return r.json();
}

// Quizzes (nested under lesson)
export async function getQuizzesByLesson(lessonId) {
  const r = await fetch(`${API}/lessons/${lessonId}/quizzes`, { headers: authHeaders() });
  if (!r.ok) throw new Error("Failed to fetch quizzes");
  return r.json();
}

export async function createQuiz(payload) {
  const r = await fetch(`${API}/quizzes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error("Failed to create quiz");
  return r.json();
}

export async function updateQuiz(id, payload) {
  const r = await fetch(`${API}/quizzes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error("Failed to update quiz");
  return r.json();
}

export async function deleteQuiz(id) {
  const r = await fetch(`${API}/quizzes/${id}`, { method: "DELETE", headers: authHeaders() });
  if (!r.ok) throw new Error("Failed to delete quiz");
  return r.json();
}

// Progress: per-module toggle
export async function setModuleProgress({ lessonId, moduleId, completed }) {
  const r = await fetch(`${API}/progress/module`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ lessonId, moduleId, completed })
  });
  if (!r.ok) throw new Error("Failed to set progress");
  return r.json();
}

export async function getProgress() {
  const r = await fetch(`${API}/progress`, { headers: authHeaders() });
  if (!r.ok) throw new Error("Failed to fetch progress");
  return r.json(); // Expect: [{ lessonId, moduleId, completedAt }]
}