import { useEffect, useState } from "react";
import { apiGet } from "../api";
import {
  getLessons, getQuizzesByLesson, enrollLesson,
  createLesson, updateLesson, deleteLesson,
  createQuiz, updateQuiz, deleteQuiz, setModuleProgress
} from "../api.js";
import { useAuth } from "../state/auth.jsx";
import LessonCard from "../components/LessonCard.jsx";

export default function Lessons() {
  const { role } = useAuth();
  const isEducator = role === "educator";
  const [lessons, setLessons] = useState([]);
  const [msg, setMsg] = useState("");

  // Create/Edit lesson form (educator)
  const [newTitle, setNewTitle] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCover, setNewCover] = useState("");

  const load = async () => {
    setMsg("");
    try {
      const data = await getLessons();
      const arr = Array.isArray(data) ? data : [];
      // attach quizzes per-lesson
      const withQuizzes = await Promise.all(arr.map(async l => {
        const quizzes = await getQuizzesByLesson(l.id).catch(() => []);
        return { ...l, quizzes, quizzesCount: quizzes.length };
      }));
      setLessons(withQuizzes);
    } catch (e) { setMsg(e.message); }
  };

  useEffect(() => {
    apiGet("/lessons")
      .then(setLessons)
      .catch((e) => console.error("Failed to load lessons:", e));
  }, []);

  const handleEnroll = async (lessonId) => {
    try {
      await enrollLesson(lessonId);
      setMsg("Enrolled in lesson");
    } catch (e) { setMsg(e.message); }
  };

  const handleCreateLesson = async () => {
    try {
      const lesson = await createLesson({
        title: newTitle,
        topic: newTopic,
        description: newDesc,
        coverUrl: newCover
      });
      setLessons([ { ...lesson, quizzes: [], quizzesCount: 0 }, ...lessons ]);
      setNewTitle(""); setNewTopic(""); setNewDesc(""); setNewCover("");
      setMsg("Lesson created");
    } catch (e) { setMsg(e.message); }
  };

  const handleUpdateLesson = async (id) => {
    const newTitlePrompt = prompt("New title?");
    if (!newTitlePrompt) return;
    try {
      const updated = await updateLesson(id, { title: newTitlePrompt });
      setLessons(ls => ls.map(l => (l.id === id ? { ...l, ...updated } : l)));
    } catch (e) { setMsg(e.message); }
  };

  const handleDeleteLesson = async (id) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      await deleteLesson(id);
      setLessons(ls => ls.filter(l => l.id !== id));
    } catch (e) { setMsg(e.message); }
  };

  const handleCreateQuiz = async (lessonId, title, topic) => {
    try {
      const q = await createQuiz({ lessonId, title, topic, questions: [] });
      setLessons(ls => ls.map(l => l.id === lessonId
        ? { ...l, quizzes: [q, ...l.quizzes], quizzesCount: l.quizzesCount + 1 }
        : l));
      setMsg("Quiz created");
    } catch (e) { setMsg(e.message); }
  };

  const handleUpdateQuiz = async (quizId) => {
    const newTitlePrompt = prompt("New quiz title?");
    if (!newTitlePrompt) return;
    try {
      const updated = await updateQuiz(quizId, { title: newTitlePrompt });
      setLessons(ls => ls.map(l => ({
        ...l,
        quizzes: l.quizzes.map(q => q.id === quizId ? { ...q, ...updated } : q)
      })));
    } catch (e) { setMsg(e.message); }
  };

  const handleDeleteQuiz = async (quizId, lessonId) => {
    if (!confirm("Delete this quiz?")) return;
    try {
      await deleteQuiz(quizId);
      setLessons(ls => ls.map(l => l.id === lessonId
        ? { ...l, quizzes: l.quizzes.filter(q => q.id !== quizId), quizzesCount: Math.max(0, l.quizzesCount - 1) }
        : l));
    } catch (e) { setMsg(e.message); }
  };

  const handleToggleModule = async (lessonId, module) => {
    try {
      const completed = !module.completed;
      await setModuleProgress({ lessonId, moduleId: module.id, completed });
      setLessons(ls => ls.map(l => l.id === lessonId
        ? { ...l, modules: (l.modules || []).map(m => m.id === module.id ? { ...m, completed } : m) }
        : l));
    } catch (e) { setMsg(e.message); }
  };

  return (
    <main className="container">
      <div className="card">
        <div className="card-head">
          <div>
            <h3>Lessons</h3>
            <p className="muted">{isEducator ? "Manage lessons & quizzes" : "Browse, enroll, take quizzes"}</p>
          </div>
          <button className="btn primary" onClick={load}>Refresh</button>
        </div>
        <div className="card-body">
          {msg && <p className="muted">{msg}</p>}

          {isEducator && (
            <div className="form-grid">
              <input placeholder="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              <input placeholder="Topic" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} />
              <input placeholder="Cover Image URL" value={newCover} onChange={(e) => setNewCover(e.target.value)} />
              <button className="btn" onClick={handleCreateLesson}>Create</button>
            </div>
          )}

          <div className="grid">
            {lessons.map(l => (
              <LessonCard
                key={l.id}
                lesson={l}
                isEducator={isEducator}
                onEnroll={() => handleEnroll(l.id)}
                onEdit={() => handleUpdateLesson(l.id)}
                onDelete={() => handleDeleteLesson(l.id)}
                onCreateQuiz={(title, topic) => handleCreateQuiz(l.id, title, topic)}
                onEditQuiz={(quizId) => handleUpdateQuiz(quizId)}
                onDeleteQuiz={(quizId) => handleDeleteQuiz(quizId, l.id)}
                onToggleModule={(module) => handleToggleModule(l.id, module)}
              />
            ))}
          </div>

          {lessons.length === 0 && <p className="muted">No lessons available.</p>}
        </div>
      </div>
    </main>
  );
}