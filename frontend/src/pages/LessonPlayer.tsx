import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/services/api";
import AudioControls from "@/components/AudioControls";
import { useChild } from "@/state/ChildContext";

type Page = { pageNo: number; imageUrl: string; audioUrl: string; caption?: string };
type Lesson = { id: number; title: string; pages: Page[]; quiz?: { id: number } | null };

function placeholderImageDataUrl(text: string) {
  const safe = (text || "EduVillage").replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#a5d6a7"/>
        <stop offset="100%" stop-color="#80deea"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="150" cy="150" r="80" fill="#ffeb3b" opacity="0.7"/>
    <text x="50%" y="55%" text-anchor="middle" font-size="56" fill="#0d47a1" font-family="Verdana, sans-serif">${safe}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function LessonPlayer() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [imgOverride, setImgOverride] = useState<string | null>(null);
  const navigate = useNavigate();
  const { childId } = useChild();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/lessons/${lessonId}`);
        setLesson(res.data);
        setPageIndex(0);
        setImgOverride(null);
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
      // soft success tone if no assets present
      try { (window as any).AudioContext && new (window.AudioContext || (window as any).webkitAudioContext)(); } catch {}
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

  const captionText = page.caption || lesson.title;

  return (
    <div className="container">
      <h2>{lesson.title}</h2>
      <img
        className="lesson-image"
        src={imgOverride || page.imageUrl}
        alt={captionText}
        onError={() => setImgOverride(placeholderImageDataUrl(captionText))}
      />
      <AudioControls src={page.audioUrl} fallbackText={captionText} />
      <div className="controls">
        <button className="btn secondary" onClick={prev} disabled={pageIndex === 0}>⬅️ Prev</button>
        <button className="btn" onClick={next}>{atEnd ? "✅ Finish" : "➡️ Next"}</button>
      </div>
    </div>
  );
}
