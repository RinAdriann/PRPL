import React from "react";

export default function ProgressMap({ unlockedLvl }: { unlockedLvl: number }) {
  const dots = Array.from({ length: 8 }, (_, i) => i + 1);
  return (
    <div className="map">
      {dots.map(d => (
        <span key={d} className={`level-dot ${d <= unlockedLvl ? "active" : ""}`} title={`Level ${d}`} />
      ))}
    </div>
  );
}
