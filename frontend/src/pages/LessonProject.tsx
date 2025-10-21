import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/services/api";
import AudioControls from "@/components/AudioControls";
import { useChild } from "@/state/ChildContext";

type Page = { pageNo: number; imageUrl: string; audioUrl: string; caption?: string };
type Lesson = { id: number; title: string; pages: Page[]; quiz?: { id: number } | null };

export default function LessonPlayer() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const navigate = useNavigate();
  const { childId } = useChild();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/lessons/${lessonId}`);
        setLesson(res.data);
        setPageIndex(0);
      } catch {
        alert("Audio or lesson not found");
      }
    }
    load();
  }, [lessonId]);

  const page = useMemo(() => lesson?.pages[pageIndex], [lesson, pageIndex]);
  if (!lesson || !page) return <div className="container">Loading...</div>;

  const atEnd = pageIndex === (lesson.pages.length - 1);

  async function completeLesson() {
    try {
      await api.post("/progress/lesson", { childId, lessonId: lesson.id });
    } catch {}
  }

  function next() {
    if (!atEnd) setPageIndex(i => i + 1);
    else {
      completeLesson();
      const a = new Audio("/assets/sounds/success.mp3"); a.play().catch(()=>{});
      if (lesson.quiz) {
        navigate(`/quiz/${lesson.quiz.id}`);
      } else {
        navigate("/progress");
      }
    }
  }

  function prev() {
    if (pageIndex > 0) setPageIndex(i => i - 1);
  }

  return (
    <div className="container">
      <h2>{lesson.title}</h2>
      <img className="lesson-image" src={page.imageUrl} alt={page.caption || `Page ${page.pageNo}`} />
      <AudioControls src={page.audioUrl} />
      <div className="controls">
        <button className="btn secondary" onClick={prev} disabled={pageIndex === 0}>⬅️ Prev</button>
        <button className="btn" onClick={next}>{atEnd ? "✅ Finish" : "➡️ Next"}</button>
      </div>
    </div>
  );
}
