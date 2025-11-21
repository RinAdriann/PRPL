const KEY = 'enrollments';

function load(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function save(ids: string[]) { localStorage.setItem(KEY, JSON.stringify(Array.from(new Set(ids)))); }

export function isEnrolled(id: string) { return load().includes(id); }
export function enroll(id: string) { const ids = load(); if (!ids.includes(id)) { ids.push(id); save(ids); } }
export function unenroll(id: string) { save(load().filter(x => x !== id)); }
export function getEnrollments() { return load(); }