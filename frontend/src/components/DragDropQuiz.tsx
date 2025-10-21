import React, { useMemo, useState } from "react";
import { dropTick, errorChime, successChime } from "./sfx";

type Item = { key: string; label: string };
type Target = { key: string; label: string };

export type Mapping = Record<string, string>;

export default function DragDropQuiz({
  items, targets, onChange
}: { items: Item[]; targets: Target[]; onChange: (mapping: Mapping) => void }) {

  const [mapping, setMapping] = useState<Mapping>({});
  const [dragKey, setDragKey] = useState<string | null>(null);

  const remainingItems = useMemo(() => items.filter(i => !Object.keys(mapping).includes(i.key)), [items, mapping]);

  function handleDrop(targetKey: string) {
    if (dragKey) {
      const newMap = { ...mapping, [dragKey]: targetKey };
      setMapping(newMap);
      onChange(newMap);
      setDragKey(null);
      // Sound feedback without external assets
      dropTick().catch(()=>{});
    }
  }

  function reset() {
    setMapping({});
    onChange({});
  }

  return (
    <div>
      <div className="quiz-area">
        <div>
          <h3>Drag</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {remainingItems.map(i => (
              <div
                key={i.key}
                className="draggable"
                draggable
                onDragStart={() => setDragKey(i.key)}
                onDragEnd={() => setDragKey(null)}
                aria-label={`Draggable ${i.label}`}
              >
                {i.label}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3>Match</h3>
          <div style={{ display: "grid", gap: 8 }}>
            {targets.map(t => {
              const filled = Object.values(mapping).includes(t.key);
              const itemKey = Object.entries(mapping).find(([k, v]) => v === t.key)?.[0];
              const label = itemKey ? items.find(i => i.key === itemKey)?.label : "Drop here";
              return (
                <div
                  key={t.key}
                  className={`dropzone ${filled ? "filled" : ""}`}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDrop(t.key)}
                  aria-label={`Target ${t.label}`}
                >
                  <div style={{ fontSize: 14, opacity: 0.7, position: "absolute", transform: "translateY(-36px)" }}>{t.label}</div>
                  <div style={{ fontSize: 28 }}>{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="controls" style={{ marginTop: 16 }}>
        <button className="btn secondary" onClick={reset}>↩️ Reset</button>
      </div>
    </div>
  );
}

// Optional helper for external callers to play success/error sounds
export const QuizSFX = { successChime, errorChime };
