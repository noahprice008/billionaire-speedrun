/** Tiny GPU/CPU-cheap WebAudio blips for game feedback. No assets, no autoplay. */
let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, dur: number, gain = 0.06, type: OscillatorType = "triangle") {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + start);
  vol.gain.setValueAtTime(0.0001, ac.currentTime + start);
  vol.gain.exponentialRampToValueAtTime(gain, ac.currentTime + start + 0.01);
  vol.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  osc.connect(vol).connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.02);
}

export type SoundName = "click" | "spin" | "win" | "lose" | "cash";

export function playSound(name: SoundName, enabled: boolean) {
  if (!enabled) return;
  try {
    if (name === "click") tone(660, 0, 0.07);
    if (name === "spin") [420, 520, 620].forEach((f, i) => tone(f, i * 0.07, 0.08, 0.04, "square"));
    if (name === "win") [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.22, 0.07));
    if (name === "lose") [320, 240].forEach((f, i) => tone(f, i * 0.12, 0.2, 0.05, "sawtooth"));
    if (name === "cash") [784, 988, 1319].forEach((f, i) => tone(f, i * 0.06, 0.18, 0.06));
  } catch {
    /* audio unavailable */
  }
}
