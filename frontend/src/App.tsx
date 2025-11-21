import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './state/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EducatorDashboard from './pages/EducatorDashboard';
import LessonPlayer from './pages/LessonPlayer';
import ProgressPage from './pages/ProgressPage';
import HomePage from './pages/HomePage';
import LessonDetails from './pages/LessonDetails';

const App: React.FC = () => {
  const { user, loading, logout, guestLogin } = useAuth();

  return (
    <>
      <header className="header">
        <div className="brand">EduVillage</div>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Lessons</Link>
          {user && <Link to="/progress">My Progress</Link>}
          {!user && <button onClick={guestLogin}>Guest</button>}
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/register">Register</Link>}
          {user && <button onClick={logout}>Logout</button>}
        </nav>
      </header>
      <main className="layout">
        {loading ? <p className="muted">Loading session...</p> : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<EducatorDashboard />} />
            <Route path="/lessons/:id" element={<LessonDetails />} />
            <Route path="/lesson/:id" element={<LessonPlayer />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        )}
      </main>
      <div className="footer">© {new Date().getFullYear()} EduVillage</div>
    </>
  );
};

export default App;