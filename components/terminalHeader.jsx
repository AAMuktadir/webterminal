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
  onDragStart,
  isDragging,
  isAppFullscreen,
  onToggleFullscreen,
}) {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const initial = window.setTimeout(() => setClock(formatClock()), 0);
    const timer = window.setInterval(() => {
      setClock(formatClock());
    }, 1000 * 30);

    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <header
      className={`terminal-header ${isDragging ? "is-dragging" : ""}`}
      aria-label="Terminal window controls"
      onPointerDown={onDragStart}
    >
      {/* Left: traffic-light controls — green triggers app fullscreen */}
      <div className="terminal-controls">
        <span className="control close" aria-hidden="true" />
        <span className="control minimize" aria-hidden="true" />
        <button
          className="control expand"
          type="button"
          onClick={onToggleFullscreen}
          onPointerDown={(event) => event.stopPropagation()}
          title={isAppFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          aria-label={
            isAppFullscreen ? "Exit app fullscreen" : "Enter app fullscreen"
          }
        />
      </div>

      {/* Centre: title */}
      <div className="terminal-title" aria-live="polite">
        <span>{prompt}</span>
        <span className="terminal-title-divider">|</span>
        <span>{themeLabel}</span>
      </div>

      {/* Right: clock */}
      <div className="terminal-date" aria-label="Current date and time">
        {clock}
      </div>
    </header>
  );
}
