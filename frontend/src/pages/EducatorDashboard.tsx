import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/state/AuthContext";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Link } from "react-router-dom";
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function EducatorDashboard() {
  const { educatorId, name, logout } = useAuth();
  const [topic, setTopic] = useState<string>("");
  const [summary, setSummary] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const s = await api.get(`/performance/${educatorId}`, { params: { topic: topic || undefined } });
      setSummary(s.data);
      const c = await api.get(`/performance/${educatorId}/children`, { params: { topic: topic || undefined } });
      setChildren(c.data.children);
    }
    load();
  }, [educatorId, topic]);

  if (!summary) return <div className="container">Loading...</div>;

  const lessons = Object.keys(summary.completionRateByLesson);
  const rates = Object.values(summary.completionRateByLesson);

  return (
    <div className="container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2>Welcome, {name}</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to="/educator/settings" className="btn secondary">⚙️ Settings</Link>
          <button className="btn red" onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Filter by topic: </label>
        <select value={topic} onChange={e => setTopic(e.target.value)} style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc" }}>
          <option value="">All</option>
          <option value="Nature">Nature</option>
        </select>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 12 }}>
          <h3>Average Quiz Score</h3>
          <Doughnut data={{
            labels: ["Average", "Remaining"],
            datasets: [{ data: [summary.averageQuizScore, 100 - summary.averageQuizScore], backgroundColor: ["#4caf50", "#e0e0e0"] }]
          }} />
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 12 }}>
          <h3>Completion Rate by Lesson</h3>
          <Bar data={{
            labels: lessons,
            datasets: [{ label: "% Completed", data: rates, backgroundColor: "#42a5f5" }]
          }} options={{ scales: { y: { suggestedMax: 100 } } }} />
        </div>
      </div>

      <div style={{ marginTop: 16, background: "#fff", borderRadius: 12, padding: 12 }}>
        <h3>Children Performance</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Child</th>
                <th style={th}>Avg Score</th>
                <th style={th}>Attempts</th>
                <th style={th}>Lessons Completed</th>
              </tr>
            </thead>
            <tbody>
              {children.map((c) => (
                <tr key={c.childId}>
                  <td style={td}>{c.name}</td>
                  <td style={td}>{c.avgScore}%</td>
                  <td style={td}>{c.attempts}</td>
                  <td style={td}>{c.completedLessons}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const th: React.CSSProperties = { textAlign: "left", borderBottom: "1px solid #eee", padding: 8 };
const td: React.CSSProperties = { borderBottom: "1px solid #f5f5f5", padding: 8 };
