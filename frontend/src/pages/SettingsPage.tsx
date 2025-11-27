import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/state/AuthContext";

export default function SettingsPage() {
  const { educatorId } = useAuth();
  const [difficulty, setDifficulty] = useState<string>("BASIC");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const s = await api.get(`/educator/${educatorId}/settings`);
      setDifficulty(s.data.defaultDifficulty);
    }
    load();
  }, [educatorId]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await api.post(`/educator/${educatorId}/settings`, { defaultDifficulty: difficulty });
    setSaving(false);
  };

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h2>Content Settings</h2>
      <div style={{ display: "grid", gap: 12 }}>
        <label>
          Difficulty:
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={{ marginLeft: 8, padding: 8, borderRadius: 8 }}>
            <option value="BASIC">Basic</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </label>
        <button className="btn" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
      </div>
    </div>
  );
}
