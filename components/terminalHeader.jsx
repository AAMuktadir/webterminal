import { useEffect, useState } from "react";

const formatClock = () =>
  new Date().toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function TerminalHeader({
  prompt,
  themeLabel,
  onThemeCycle,
  onDragStart,
  isDragging,
}) {
  const [clock, setClock] = useState(formatClock);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(formatClock());
    }, 1000 * 30);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <header
      className={`terminal-header ${isDragging ? "is-dragging" : ""}`}
      aria-label="Terminal window controls"
      onPointerDown={onDragStart}
    >
      <div className="terminal-controls" aria-hidden="true">
        <button
          className="control close"
          type="button"
          tabIndex={-1}
          onPointerDown={(event) => event.stopPropagation()}
        />
        <button
          className="control minimize"
          type="button"
          tabIndex={-1}
          onPointerDown={(event) => event.stopPropagation()}
        />
        <button
          className="control expand"
          type="button"
          onClick={onThemeCycle}
          onPointerDown={(event) => event.stopPropagation()}
          title="Cycle terminal theme"
          aria-label="Cycle terminal theme"
        />
      </div>

      <div className="terminal-title" aria-live="polite">
        <span>{prompt}</span>
        <span className="terminal-title-divider">|</span>
        <span>{themeLabel}</span>
      </div>

      <div className="terminal-date" aria-label="Current date and time">
        {clock}
      </div>
    </header>
  );
}
