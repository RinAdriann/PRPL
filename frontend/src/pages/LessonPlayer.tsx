import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuth } from '@/state/AuthContext';

type Lesson = { id: string; title: string; description?: string | null; audioUrl?: string | null; imageUrl?: string | null };

const LessonPlayer: React.FC = () => {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [mediaReady, setMediaReady] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const readyTimeout = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);
    setMediaReady(false);

    api.getLesson(id)
      .then((l: Lesson) => {
        if (!alive) return;
        setLesson(l);
        // If no media, stop loading immediately
        if (!l.audioUrl && !l.imageUrl) {
          setMediaReady(true);
        } else {
          // Safety: stop showing "loading" after 3s even if media never fires
          readyTimeout.current = window.setTimeout(() => setMediaReady(true), 3000);
        }
      })
      .catch((e: any) => alive && setErr(e.message))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
      if (readyTimeout.current) window.clearTimeout(readyTimeout.current);
    };
  }, [id]);

  function clamp(n:number){ return Math.max(0, Math.min(100, Math.round(n))); }
  async function saveProgress(percent: number) {
    if (!user) return alert('Login (or guest) to save progress.');
    try { 
      const position = clamp(percent);
      const completed = percent === 100;
      await api.updateProgress(lesson.id, { position, completed }); 
    } catch {} 
  }

  if (err) return <div className="card"><p className="alert">{err}</p></div>;
  if (loading || !lesson) return <div className="card"><p className="muted">Loading lesson...</p></div>;

  const hasAudio = !!lesson.audioUrl;
  const hasImage = !!lesson.imageUrl;

  return (
    <div className="card">
      <h2 style={{marginTop:0}}>{lesson.title}</h2>
      <p className="muted" style={{marginTop:-6}}>{lesson.description || 'No description provided.'}</p>

      {!hasAudio && !hasImage && (
        <div className="card" style={{marginTop:12}}>
          <p className="muted">This lesson has no audio or image. You can still mark progress below.</p>
        </div>
      )}

      {hasImage && (
        <img
          src={lesson.imageUrl as string}
          alt={lesson.title}
          style={{maxWidth:'100%', borderRadius:8, marginTop:12}}
          onLoad={() => setMediaReady(true)}
          onError={() => setMediaReady(true)}
        />
      )}

      {hasAudio && (
        <audio
          style={{width:'100%', marginTop:12}}
          controls
          src={lesson.audioUrl as string}
          onCanPlayThrough={() => setMediaReady(true)}
          onError={() => setMediaReady(true)}
        />
      )}

      {!mediaReady && <p className="muted" style={{marginTop:10}}>Preparing media...</p>}

      <div style={{display:'flex',gap:10,marginTop:16,flexWrap:'wrap'}}>
        <button onClick={() => saveProgress(25)}>Mark 25%</button>
        <button onClick={() => saveProgress(50)}>Mark 50%</button>
        <button onClick={() => saveProgress(100)} style={{background:'#0b8f6e'}}>Complete</button>
      </div>
    </div>
  );
};

export default LessonPlayer;
