import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '@/services/api';
import { enroll, isEnrolled, unenroll } from '@/services/enrollment';
import { useAuth } from '@/state/AuthContext';

const LessonDetails: React.FC = () => {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<any|null>(null);
  const [err,setErr] = useState<string|null>(null);
  const enrolled = useMemo(() => isEnrolled(id), [id, lesson]);
  const isOwner = !!(user && user.role === 'educator' && lesson?.ownerId === user.id);

  useEffect(() => {
    api.getLesson(id)
      .then(setLesson)
      .catch(e => setErr(e.message));
  }, [id]);

  function doEnroll() {
    enroll(id);
    nav(`/lesson/${id}`);
  }
  function doUnenroll() {
    unenroll(id);
    setLesson({ ...lesson });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  if (err) return <div className="card"><p className="alert">{err}</p></div>;
  if (!lesson) return <div className="card"><p className="muted">Loading...</p></div>;

  return (
    <div className="card">
      <h2 style={{marginTop:0}}>{lesson.title}</h2>
      <p className="muted" style={{marginTop:-6}}>
        {lesson.description || 'This is a short introduction to the lesson.'}
      </p>

      {isOwner ? (
        <div style={{display:'flex',gap:10,marginTop:10}}>
          <Link to={`/lesson/${id}`}><button>Open Lesson</button></Link>
          <Link to="/dashboard"><button style={{background:'#0b8f6e'}}>Manage</button></Link>
          <Link to="/dashboard"><button style={{background:'#555'}}>Back</button></Link>
        </div>
      ) : !enrolled ? (
        <div style={{display:'flex',gap:10,marginTop:10}}>
          <button onClick={doEnroll}>Enroll & Start</button>
          <Link to="/dashboard"><button style={{background:'#555'}}>Back</button></Link>
        </div>
      ) : (
        <div style={{display:'flex',gap:10,marginTop:10}}>
          <Link to={`/lesson/${id}`}><button>Start Lesson</button></Link>
          <button style={{background:'#d64848'}} onClick={doUnenroll}>Unenroll</button>
          <Link to="/dashboard"><button style={{background:'#555'}}>Back</button></Link>
        </div>
      )}
    </div>
  );
};

export default LessonDetails;