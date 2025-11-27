import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/state/AuthContext';
import { Link } from 'react-router-dom';

const EducatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const isEducator = user?.role === 'educator';
  const [lessons,setLessons] = useState<any[]>([]);
  const [title,setTitle] = useState('');
  const [desc,setDesc] = useState('');
  const [err,setErr] = useState<string|null>(null);
  const [selected,setSelected] = useState<string|null>(null);
  const [lessonProgress,setLessonProgress] = useState<any[]>([]);

  async function loadLessons() {
    try { setLessons(await api.lessons()); } catch(e:any){ setErr(e.message); }
  }
  useEffect(()=>{ loadLessons(); }, []);

  async function create() {
    if(!title.trim()) return;
    try {
      await api.createLesson({ title, description: desc.trim() || undefined });
      setTitle('');
      setDesc('');
      loadLessons();
    } catch(e:any){ setErr(e.message); }
  }

  async function remove(id:string) {
    try {
      await api.deleteLesson(id);
      if (selected===id) { setSelected(null); setLessonProgress([]); }
      loadLessons();
    } catch(e:any){ setErr(e.message); }
  }

  async function viewProgress(id:string) {
    setSelected(id);
    if (!isEducator) return;
    try { setLessonProgress(await api.lessonProgress(id)); } catch(e:any){ setErr(e.message); }
  }

  return (
    <div className="grid" style={{gap:30}}>
      <div className="card">
        <h2 className="section-title">Lessons</h2>
        {err && <div className="alert">{err}</div>}
        {isEducator && (
          <div style={{display:'flex',gap:10,marginBottom:16}}>
            <input
              className="input"
              placeholder="New lesson title"
              value={title}
              onChange={e=>setTitle(e.target.value)}
            />
            <input
              className="input"
              placeholder="Short description (optional)"
              value={desc}
              onChange={e=>setDesc(e.target.value)}
            />
            <button onClick={async ()=>{ await api.createLesson({ title, description: desc.trim() || undefined }); setTitle(''); setDesc(''); loadLessons(); }} disabled={!title.trim()}>Add</button>
          </div>
        )}
        <div className="grid cols-3">
          {lessons.map(l => {
            const owned = isEducator && l.ownerId === user?.id;
            return (
              <div
                key={l.id}
                className="card"
                style={{
                  padding:'16px 18px',
                  outline: owned ? '2px solid rgba(18,146,238,.35)' : undefined
                }}
              >
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <strong>{l.title}</strong>
                  {owned && <span className="badge">Yours</span>}
                </div>
                <p className="muted" style={{margin:'8px 0'}}>Quick intro to {l.title.toLowerCase()}.</p>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {owned ? (
                    <>
                      <Link to={`/lesson/${l.id}`}><button style={{flex:1}}>Open</button></Link>
                      <button onClick={()=>viewProgress(l.id)} style={{background:'#0b8f6e'}}>Manage</button>
                      <button onClick={()=>remove(l.id)} style={{background:'#d64848'}}>Delete</button>
                    </>
                  ) : (
                    <Link to={`/lessons/${l.id}`}><button style={{flex:1}}>Details</button></Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {lessons.length===0 && <p className="muted">No lessons yet.</p>}
      </div>

      {selected && (
        <div className="card">
          <h2 className="section-title">Lesson Progress</h2>
          {!isEducator && <p className="muted">Login as educator to view user progress.</p>}
          {isEducator && (
            <>
              {lessonProgress.length===0 && <p className="muted">No progress recorded.</p>}
              {lessonProgress.length>0 && (
                <table className="table">
                  <thead><tr><th>User ID</th><th>Percent</th></tr></thead>
                  <tbody>
                    {lessonProgress.map(p=>(
                      <tr key={p.id}>
                        <td>{p.userId}</td>
                        <td>{p.percent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EducatorDashboard;
