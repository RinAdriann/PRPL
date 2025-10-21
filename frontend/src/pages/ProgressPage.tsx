import React, { useEffect, useState } from "react";
import api from "@/services/api";
import ProgressMap from "@/components/ProgressMap";
import { useChild } from "@/state/ChildContext";

type Reward = { id: number; name: string; iconUrl: string };

function starDataUrl() {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffd54f"/>
        <stop offset="100%" stop-color="#ffb300"/>
      </linearGradient>
    </defs>
    <polygon points="32,4 39,24 60,24 43,36 50,56 32,44 14,56 21,36 4,24 25,24" fill="url(#g)" stroke="#ff8f00" stroke-width="2"/>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function ProgressPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [unlockedLvl, setUnlockedLvl] = useState<number>(1);
  const { childId } = useChild();

  useEffect(() => {
    async function load() {
      const res = await api.post("/progress/update", { childId });
      setRewards(res.data.rewards);
      setUnlockedLvl(res.data.unlockedLvl);
    }
    load();
  }, [childId]);

  return (
    <div className="container">
      <h2>Your Progress</h2>
      <h3>Badges</h3>
      <div className="badges">
        {rewards.map(r => (
          <div className="badge" key={r.id}>
            <img
              src={r.iconUrl}
              alt={r.name}
              width={28}
              height={28}
              onError={(e) => { e.currentTarget.src = starDataUrl(); }}
            />
            <span>{r.name}</span>
          </div>
        ))}
        {rewards.length === 0 && <div>No badges yet. Keep going! 💪</div>}
      </div>
      <h3 style={{ marginTop: 16 }}>Adventure Map</h3>
      <ProgressMap unlockedLvl={unlockedLvl} />
    </div>
  );
}
