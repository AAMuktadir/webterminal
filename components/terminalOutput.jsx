import React, { useEffect, useRef } from "react";

export default function TerminalOutput({ output }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div ref={containerRef} className="mb-4 overflow-y-auto h-72">
      {output.map((line, index) => (
        <p key={index} className="text-white text-sm">
          {line}
        </p>
      ))}
    </div>
  );
}
