import { useEffect, useState } from "react";
import { getProgress, getLessons } from "../api.js";

export default function Progress() {
  const [progress, setProgress] = useState([]);
  const [lessonsIndex, setLessonsIndex] = useState({});

  useEffect(() => {
    async function load() {
      const [prog, lessons] = await Promise.all([
        getProgress().catch(() => []),
        getLessons().catch(() => [])
      ]);
      setProgress(Array.isArray(prog) ? prog : []);
      const idx = {};
      (Array.isArray(lessons) ? lessons : []).forEach(l => {
        idx[l.id] = { title: l.title, modules: l.modules || [] };
      });
      setLessonsIndex(idx);
    }
    load();
  }, []);

  return (
    <main className="container">
      <div className="card">
        <div className="card-head">
          <div><h3>Progress</h3><p className="muted">Module completion per lesson</p></div>
        </div>
        <div className="card-body">
          {progress.length === 0 && <p className="muted">No progress yet.</p>}
          <div className="progress-list">
            {progress.map((p, idx) => {
              const lesson = lessonsIndex[p.lessonId];
              const module = lesson?.modules?.find(m => m.id === p.moduleId);
              return (
                <div key={`${p.lessonId}-${p.moduleId}-${idx}`} className="progress-row">
                  <div className="progress-title">{lesson?.title || p.lessonId}</div>
                  <div className="progress-module">{module?.title || p.moduleId}</div>
                  <div className="progress-status">{p.completedAt ? "Completed" : "Pending"}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}