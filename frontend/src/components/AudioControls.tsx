import React, { useEffect, useRef, useState } from "react";

type Props = {
  src?: string;
  fallbackText?: string;
  auto?: boolean;
};

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  try {
    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.0;
    window.speechSynthesis.speak(utter);
  } catch {}
}

export default function AudioControls({ src, fallbackText, auto = true }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasAudio, setHasAudio] = useState<boolean>(!!src);

  useEffect(() => {
    setHasAudio(!!src);
  }, [src]);

  useEffect(() => {
    if (!auto) return;
    if (hasAudio && src) {
      audioRef.current?.play().catch(() => {
        // If native audio can’t autoplay or fails, fallback to TTS
        if (fallbackText) speak(fallbackText);
      });
    } else if (fallbackText) {
      speak(fallbackText);
    }
  }, [src, hasAudio, fallbackText, auto]);

  return (
    <div className="controls">
      <button
        className="btn"
        onClick={() => {
          if (hasAudio && src) {
            audioRef.current?.play().catch(() => {
              if (fallbackText) speak(fallbackText);
            });
          } else if (fallbackText) {
            speak(fallbackText);
          }
        }}
      >
        🔊 Replay
      </button>
      {src ? (
        <audio
          ref={audioRef}
          src={src}
          preload="auto"
          onError={() => setHasAudio(false)}
        />
      ) : null}
    </div>
  );
}
