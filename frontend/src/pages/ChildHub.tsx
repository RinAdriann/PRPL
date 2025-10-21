import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
import BigCard from "@/components/BigCard";
import { useAuth } from "@/state/AuthContext";
import { useChild } from "@/state/ChildContext";

type Lesson = {
  id: number; title: string; topic: string; difficulty: string; quiz?: { id: number } | null; pages: any[];
};

export default function ChildHub() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const navigate = useNavigate();
  const { token, educatorId } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        let difficultyParam = "";
        if (token && educatorId) {
          const s = await api.get(`/educator/${educatorId}/settings`);
          difficultyParam = s.data.defaultDifficulty;
        }
        const res = await api.get("/lessons", { params: { difficulty: difficultyParam || undefined } });
        setLessons(res.data);
      } catch (e) {
        const res = await api.get("/lessons");
        setLessons(res.data);
      }
    }
    load();
  }, [token, educatorId]);

  return (
    <div className="container">
      <h2>Explore</h2>
      <div className="grid">
        {lessons.map(lsn => (
          <BigCard
            key={lsn.id}
            icon={<span role="img" aria-label={lsn.topic}>🌿</span>}
            label={lsn.title}
            onClick={() => navigate(`/lesson/${lsn.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
