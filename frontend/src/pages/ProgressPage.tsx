import React, { useEffect, useState } from "react";
import api from "@/services/api";
import ProgressMap from "@/components/ProgressMap";
import { useChild } from "@/state/ChildContext";

type Reward = { id: number; name: string; iconUrl: string };

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
            <img src={r.iconUrl} alt={r.name} width={28} height={28} />
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
