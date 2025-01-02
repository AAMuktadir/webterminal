import React, { useEffect, useRef } from "react";

export default function TerminalOutput({ output }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div
      ref={containerRef}
      className="mb-4 overflow-y-auto h-60 sm:h-72 px-2 sm:px-0 pt-1 sm:pt-0"
    >
      {output.map((line, index) => (
        <p
          key={index}
          className="text-white text-xs sm:text-sm break-words font-mono"
        >
          {line}
        </p>
      ))}
    </div>
  );
}
