"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Keyboard, RefreshCw } from "lucide-react";
import { faker } from "@faker-js/faker";
import { Input } from "@/components/ui/input";


export default function TypingTest() {
  const [words, setWords] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "typing" | "finished">("idle");
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const initTest = () => {
    setWords(faker.lorem.words(50).split(" "));
    setInput("");
    setCurrentWordIndex(0);
    setStatus("idle");
    setTimeLeft(60);
    setWpm(0);
    setAccuracy(100);
    setCorrectKeystrokes(0);
    setTotalKeystrokes(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    initTest();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "typing" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && status === "typing") {
      setStatus("finished");
      const grossWpm = (totalKeystrokes / 5) / 1; // 60 sec = 1 min
      const netWpm = Math.max(0, grossWpm - ((totalKeystrokes - correctKeystrokes) / 5));
      setWpm(Math.round(netWpm));
      setAccuracy(totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 0);
    }
    return () => clearInterval(timer);
  }, [status, timeLeft, totalKeystrokes, correctKeystrokes]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === "finished") return;
    if (status === "idle") setStatus("typing");

    const val = e.target.value;
    const currentWord = words[currentWordIndex];

    if (val.endsWith(" ")) {
      // Space pressed, move to next word
      const typedWord = val.trim();
      setTotalKeystrokes(prev => prev + 1); // for the space
      if (typedWord === currentWord) {
        setCorrectKeystrokes(prev => prev + 1); // for space
      }
      setCurrentWordIndex((prev) => prev + 1);
      setInput("");
      
      // If we run out of words, generate more
      if (currentWordIndex === words.length - 2) {
          setWords(prev => [...prev, ...faker.lorem.words(30).split(" ")]);
      }
    } else {
      setInput(val);
      setTotalKeystrokes(prev => prev + 1);
      // naive keystroke accuracy: check if the current input matches the prefix of the word
      if (currentWord.startsWith(val)) {
        setCorrectKeystrokes(prev => prev + 1);
      }
    }
  };

  return (
    <ToolLayout id="typing-test" name="Typing Test" description="Check your Words Per Minute (WPM) and accuracy in a 60-second test.">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-8 text-center">
            <div>
              <div className="text-2xl font-sans font-semibold text-white">{timeLeft}s</div>
              <div className="text-[10px] text-text-muted uppercase tracking-widest">Time Left</div>
            </div>
            {status === "finished" && (
                <>
                <div>
                  <div className="text-2xl font-sans font-semibold text-accent-secondary">{wpm}</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-widest">WPM</div>
                </div>
                <div>
                  <div className="text-2xl font-sans font-semibold text-accent-primary">{accuracy}%</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-widest">Accuracy</div>
                </div>
                </>
            )}
          </div>
          <button 
            onClick={initTest}
            className="flex items-center gap-2 bg-bg-panel border border-border-line px-4 py-2 rounded-lg hover:border-accent-primary hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Restart
          </button>
        </div>

        <div 
          className="bg-bg-panel border border-border-line rounded-xl p-8 mb-8 text-xl leading-relaxed font-mono relative overflow-hidden"
          onClick={() => inputRef.current?.focus()}
        >
          {status === "finished" ? (
             <div className="absolute inset-0 bg-bg-panel/90 flex flex-col items-center justify-center backdrop-blur-sm z-10">
                <div className="text-4xl font-bold text-white mb-2">{wpm} WPM</div>
                <div className="text-text-muted">Accuracy: {accuracy}%</div>
             </div>
          ) : null}

          <div className="flex flex-wrap gap-2 text-text-muted select-none">
            {words.map((word, i) => {
              if (i < currentWordIndex - 5 || i > currentWordIndex + 15) return null; // Only show a window of words
              
              const isCurrent = i === currentWordIndex;
              const isPast = i < currentWordIndex;
              
              let className = "";
              if (isPast) className = "text-white/30"; // Omit red/green for past words to keep it simple, just fade
              else if (isCurrent) {
                  const isError = !word.startsWith(input.trim());
                  className = isError ? "text-accent-danger bg-accent-danger/20" : "text-white bg-white/10";
              }

              return (
                <span key={i} className={`px-1 rounded ${className}`}>
                  {word}
                </span>
              );
            })}
          </div>
          
          <Input
            ref={inputRef}
            type="text"
            className="opacity-0 absolute top-0 left-0 w-full h-full cursor-default"
            value={input}
            onChange={handleInput}
            disabled={status === "finished"}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
        
        <p className="text-center text-xs text-text-muted">Start typing the words above to begin the 60-second timer.</p>
      </div>
    </ToolLayout>
  );
}