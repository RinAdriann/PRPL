import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Dashboard() {
  const [recentLessons, setRecentLessons] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recent_lessons") || "[]");
    setRecentLessons(stored);
  }, []);

  const goToLesson = (id) => {
    const existing = recentLessons.find(l => l.id === id);
    const filtered = recentLessons.filter(l => l.id !== id);
    const next = existing ? [existing, ...filtered].slice(0, 6) : filtered;
    localStorage.setItem("recent_lessons", JSON.stringify(next));
    setRecentLessons(next);
  };

  return (
    <main className="container">
      <div className="hero single">
        <div>
          <h1>Welcome</h1>
          <p className="muted">Continue your learning journey.</p>
          <div className="actions">
            <NavLink to="/lessons" className="btn primary">Lessons</NavLink>
            <NavLink to="/progress" className="btn">Progress</NavLink>
          </div>
        </div>
      </div>
      <section className="card">
        <div className="card-head">
          <div><h3>Recently Opened Lessons</h3><p className="muted">Your last accessed items</p></div>
        </div>
        <div className="card-body">
          {recentLessons.length === 0 && <p className="muted">No recent lessons.</p>}
          <div className="lesson-list">
            {recentLessons.map(l => (
              <button key={l.id} className="lesson-row" onClick={() => goToLesson(l.id)}>
                <span className="lesson-title">{l.title}</span>
                <span className="lesson-meta">{l.topic || "—"} · {l.quizzesCount ?? 0} quizzes</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}