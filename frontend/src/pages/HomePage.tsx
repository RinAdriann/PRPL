import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { useAuth } from '@/state/AuthContext';

const HomePage: React.FC = () => {
  const [featured, setFeatured] = useState<any[]>([]);
  const { user, guestLogin } = useAuth();

  useEffect(() => {
    api.lessons().then(ls => setFeatured(ls.slice(0, 3))).catch(() => setFeatured([]));
  }, []);

  return (
    <div className="grid" style={{gap:24}}>
      <div className="card">
        <h1 style={{marginTop:0}}>Welcome to EduVillage</h1>
        <p className="muted">Explore lessons freely. Enroll to start. Sign in or use guest to track progress.</p>
        <div style={{display:'flex', gap:10, marginTop:10}}>
          <Link to="/dashboard"><button>Browse Lessons</button></Link>
          {user ? (
            <Link to="/progress"><button style={{background:'#0b8f6e'}}>My Progress</button></Link>
          ) : (
            <button style={{background:'#555'}} onClick={guestLogin}>Login / Guest</button>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">Featured lessons</h2>
        <div className="grid cols-3">
          {featured.map((l: any) => (
            <div key={l.id} className="card" style={{padding:'14px 16px'}}>
              <strong>{l.title}</strong>
              <p className="muted" style={{margin:'8px 0 12px'}}>Quick intro to {l.title.toLowerCase()}.</p>
              <Link to={`/lessons/${l.id}`}><button>Details</button></Link>
            </div>
          ))}
          {featured.length===0 && <p className="muted">No lessons yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default HomePage;