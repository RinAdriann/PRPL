import { Routes, Route, Navigate, Link } from "react-router-dom";
import ChildHub from "./pages/ChildHub";
import LessonPlayer from "./pages/LessonPlayer";
import QuizPage from "./pages/QuizPage";
import ProgressPage from "./pages/ProgressPage";
import LoginPage from "./pages/LoginPage";
import EducatorDashboard from "./pages/EducatorDashboard";
import SettingsPage from "./pages/SettingsPage";
import { useAuth } from "./state/AuthContext";

export default function App() {
  const { token } = useAuth();

  return (
    <div className="app-root">
      <header className="app-header">
        <Link to="/" className="brand">EduVillage</Link>
        <nav className="nav">
          <Link to="/">🏠</Link>
          <Link to="/progress">⭐</Link>
          <Link to="/educator/login">👩‍🏫</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<ChildHub />} />
        <Route path="/lesson/:lessonId" element={<LessonPlayer />} />
        <Route path="/quiz/:quizId" element={<QuizPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/educator/login" element={<LoginPage />} />
        <Route path="/educator/dashboard" element={token ? <EducatorDashboard /> : <Navigate to="/educator/login" />} />
        <Route path="/educator/settings" element={token ? <SettingsPage /> : <Navigate to="/educator/login" />} />
      </Routes>
    </div>
  );
}
