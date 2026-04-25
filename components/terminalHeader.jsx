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
      {/* Left: traffic-light controls — green triggers app fullscreen */}
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
