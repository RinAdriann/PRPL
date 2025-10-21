import React, { useEffect, useRef } from "react";

export default function AudioControls({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    audioRef.current?.play().catch(() => {/* autoplay may be blocked */});
  }, [src]);

  return (
    <div className="controls">
      <button className="btn" onClick={() => audioRef.current?.play()}>🔊 Replay</button>
      <audio ref={audioRef} src={src} preload="auto" />
    </div>
  );
}
