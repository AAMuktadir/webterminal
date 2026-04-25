import { useEffect, useRef } from "react";

export default function TerminalOutput({ entries, onSuggestionClick, onCopy }) {
  const containerRef = useRef(null);
  const shouldStickToBottomRef = useRef(true);

  const getLineClassName = (tone) => {
    if (tone === "title") {
      return "terminal-line terminal-line-title";
    }
    if (tone === "muted") {
      return "terminal-line terminal-line-muted";
    }
    if (tone === "success") {
      return "terminal-line terminal-line-success";
    }
    if (tone === "error") {
      return "terminal-line terminal-line-error";
    }

    return "terminal-line";
  };

  useEffect(() => {
    if (containerRef.current && shouldStickToBottomRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [entries]);

  const handleScroll = () => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    const distanceFromBottom =
      node.scrollHeight - node.scrollTop - node.clientHeight;
    shouldStickToBottomRef.current = distanceFromBottom < 72;
  };

  return (
    <div
      ref={containerRef}
      className="terminal-output"
      onScroll={handleScroll}
      aria-live="polite"
    >
      {entries.map((entry, index) => (
        <div key={`${entry.type}-${index}`} className="terminal-entry">
          {entry.type === "command" ? (
            <p className="terminal-command-line">
              <span className="terminal-prompt">{entry.prompt}</span>
              <span>{entry.input}</span>
            </p>
          ) : null}

          {(entry.lines || []).map((line, lineIndex) => (
            <div key={`${index}-${lineIndex}`} className="terminal-line-wrap">
              <p className={getLineClassName(line.tone)}>{line.text}</p>
              {line.copyable && line.text ? (
                <button
                  type="button"
                  className="terminal-copy-btn"
                  onClick={() => onCopy(line.text)}
                  aria-label="Copy line text"
                >
                  copy
                </button>
              ) : null}
            </div>
          ))}

          {(entry.links || []).length > 0 ? (
            <div className="terminal-links">
              {entry.links.map((link) => (
                <a
                  key={link.href + link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? "_self" : "_blank"}
                  rel="noreferrer"
                  download={link.download ? "" : undefined}
                  className="terminal-link"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}

          {(entry.suggestions || []).length > 0 ? (
            <div className="terminal-suggestions">
              {entry.suggestions.map((item) => (
                <button
                  type="button"
                  key={`${entry.type}-${item}`}
                  onClick={() => onSuggestionClick(item)}
                  className="terminal-suggestion-btn"
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
