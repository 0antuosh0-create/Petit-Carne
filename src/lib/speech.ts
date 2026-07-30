import { useEffect, useMemo, useState } from "react";

export function useFrenchVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return;

    const update = () => setVoices(window.speechSynthesis.getVoices());
    update();
    window.speechSynthesis.addEventListener("voiceschanged", update);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", update);
  }, [supported]);

  const french = useMemo(
    () => voices.filter((voice) => voice.lang.toLowerCase().startsWith("fr")),
    [voices],
  );

  return { supported, voices, frenchVoices: french };
}

export function speak(
  text: string,
  options: {
    voiceURI?: string | null;
    rate?: number;
    onStart?: () => void;
    onEnd?: () => void;
  } = {},
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.rate = options.rate ?? 0.9;
  utterance.onstart = () => options.onStart?.();
  utterance.onend = () => options.onEnd?.();
  utterance.onerror = () => options.onEnd?.();

  const voices = window.speechSynthesis.getVoices();
  const chosen =
    voices.find((voice) => voice.voiceURI === options.voiceURI) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("fr"));

  if (chosen) {
    utterance.voice = chosen;
    utterance.lang = chosen.lang;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
