"use client";
import React from "react";
import { useEffect, useRef } from "react";

export default function TerminalInput({
  userInput,
  setUserInput,
  handleKeyDown,
  currentDirectory,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return (
    <div className="flex items-center">
      <span className="text-white text-sm mr-2">
        ~/muktadir/portfolio{currentDirectory}$
      </span>
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-gray-800 text-white outline-none rounded px-2 py-1"
      />
    </div>
  );
}
