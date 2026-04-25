"use client";
import { useEffect } from "react";

export default function TerminalInput({
  inputRef,
  userInput,
  setUserInput,
  handleKeyDown,
  prompt,
}) {
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  return (
    <div
      className="terminal-input-row"
      role="group"
      aria-label="Terminal command input"
    >
      <span className="terminal-prompt" aria-hidden="true">
        {prompt}
      </span>
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="terminal-input"
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        aria-label="Terminal input"
      />

      <span
        className={`terminal-cursor ${userInput ? "is-hidden" : ""}`}
        aria-hidden="true"
      />
    </div>
  );
}
