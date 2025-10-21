let ctx: AudioContext | null = null;

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return ctx!;
}

export function playTone(frequency = 880, durationMs = 200, type: OscillatorType = "sine", gain = 0.08) {
  const audio = getCtx();
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  g.gain.value = gain;
  osc.connect(g).connect(audio.destination);
  osc.start();
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      osc.stop();
      resolve();
    }, durationMs);
  });
}

export async function successChime() {
  await playTone(880, 120, "sine");
  await playTone(1320, 180, "sine");
}

export async function errorChime() {
  await playTone(200, 200, "square");
  await playTone(160, 200, "square");
}

export function dropTick() {
  return playTone(660, 100, "triangle");
}
