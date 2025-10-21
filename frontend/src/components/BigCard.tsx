import React from "react";

export default function BigCard({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <div className="big-card" onClick={onClick} role="button" aria-label={label}>
      <span className="big-icon">{icon}</span>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{label}</div>
    </div>
  );
}
