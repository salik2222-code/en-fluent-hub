// Global Web Speech API hooks — 100% free, no external APIs
import { useState, useRef, useCallback } from "react";

/** Pick the best English voice available */
function getBestEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.name.includes("Google US English")) ||
    voices.find((v) => v.lang === "en-US" && v.name.includes("Google")) ||
    voices.find((v) => v.lang === "en-US") ||
    voices.find((v) => v.lang.startsWith("en")) ||
    null
  );
}

/** Text-to-Speech hook */
export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string, rate = 1.0) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    const voice = getBestEnglishVoice();
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}

/** Speech-to-Text hook */
export function useSTT() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(
    (onResult?: (text: string) => void, onError?: (err: string) => void) => {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) {
        onError?.("Speech recognition not supported. Please use Chrome.");
        return;
      }
      const recognition = new SR();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        onResult?.(text);
      };
      recognition.onerror = (event: any) => {
        setIsListening(false);
        onError?.(event.error === "not-allowed" ? "Please allow microphone access." : "Could not recognize speech.");
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
      setTranscript("");
    },
    []
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { startListening, stopListening, isListening, transcript };
}
