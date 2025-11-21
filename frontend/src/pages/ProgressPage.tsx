import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/state/AuthContext";

type ProgressItem = {
  id: string;
  percent: number;
  lessonId: string;
  lesson?: { id: string; title: string };
};

const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<ProgressItem[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api
      .myProgress()
      .then((list: ProgressItem[]) => setItems(list))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user)
    return (
      <div className="card" style={{ maxWidth: 520 }}>
        <p>Login or guest to view tracked progress.</p>
      </div>
    );

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>My Progress</h2>
      {err && <div className="alert">{err}</div>}
      {loading && <p className="muted">Loading...</p>}
      {!loading && items.length === 0 && (
        <p className="muted">No progress yet.</p>
      )}

      <div className="grid" style={{ gap: 14 }}>
        {items.map((p) => {
          const pct = Math.max(0, Math.min(100, Math.round(p.percent)));
          const title = p.lesson?.title || p.lessonId;
          return (
            <div
              key={p.id}
              className="card"
              style={{ padding: "14px 16px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <strong>{title}</strong>
                <span className="muted">{pct}%</span>
              </div>
              <div className="progress">
                <div
                  className="progress__bar"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressPage;
