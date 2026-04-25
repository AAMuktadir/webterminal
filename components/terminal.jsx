"use client";
import { useState, useEffect, useRef } from "react";
import TerminalHeader from "./terminalHeader";
import TerminalInput from "./terminalInput";
import TerminalOutput from "./terminalOutput";
import {
  executeCommand,
  getAutocompleteSuggestions,
  getPrompt,
  getStartupEntries,
  getThemeById,
} from "@/utils/terminal/commandEngine";
import { portfolioContent } from "@/utils/data/portfolioContent";

const MIN_WIDTH = 560;
const MIN_HEIGHT = 360;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const computeBounds = () => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const boundedWidth = clamp(viewportWidth - 20, 320, 1060);
  const boundedHeight = clamp(viewportHeight - 84, 300, 780);

  return {
    viewportWidth,
    viewportHeight,
    boundedWidth,
    boundedHeight,
    isMobile: viewportWidth < 768,
  };
};

export default function Terminal() {
  const [entries, setEntries] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [terminalState, setTerminalState] = useState({
    cwd: portfolioContent.terminal.defaultDirectory,
    themeId: portfolioContent.themes[0].id,
  });
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [windowRect, setWindowRect] = useState({
    x: 0,
    y: 0,
    width: 960,
    height: 680,
  });
  const [isWindowReady, setIsWindowReady] = useState(false);
  const [dragState, setDragState] = useState(null);
  const [resizeState, setResizeState] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [toastMessage, setToastMessage] = useState("");
  const terminalRootRef = useRef(null);
  const inputRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setEntries(getStartupEntries());
      inputRef.current?.focus();
    }, 200);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const syncViewport = () => {
      const {
        viewportWidth,
        viewportHeight,
        boundedWidth,
        boundedHeight,
        isMobile,
      } = computeBounds();
      setIsMobileViewport(isMobile);

      if (!initializedRef.current) {
        const initialWidth = clamp(viewportWidth - 56, MIN_WIDTH, 980);
        const initialHeight = clamp(viewportHeight - 120, MIN_HEIGHT, 740);
        setWindowRect({
          width: initialWidth,
          height: initialHeight,
          x: Math.max(10, (viewportWidth - initialWidth) / 2),
          y: Math.max(16, (viewportHeight - initialHeight) / 2),
        });
        initializedRef.current = true;
        setIsWindowReady(true);
        return;
      }

      setWindowRect((prev) => {
        const width = clamp(prev.width, MIN_WIDTH, boundedWidth);
        const height = clamp(prev.height, MIN_HEIGHT, boundedHeight);
        const x = clamp(prev.x, 8, Math.max(8, viewportWidth - width - 8));
        const y = clamp(prev.y, 8, Math.max(8, viewportHeight - height - 8));
        return { x, y, width, height };
      });
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToastMessage(""), 1400);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    if (!dragState && !resizeState) {
      return undefined;
    }

    const onPointerMove = (event) => {
      const { viewportWidth, viewportHeight, boundedWidth, boundedHeight } =
        computeBounds();

      if (dragState) {
        const deltaX = event.clientX - dragState.startX;
        const deltaY = event.clientY - dragState.startY;

        setWindowRect((prev) => {
          const x = clamp(
            dragState.startRect.x + deltaX,
            8,
            Math.max(8, viewportWidth - prev.width - 8),
          );
          const y = clamp(
            dragState.startRect.y + deltaY,
            8,
            Math.max(8, viewportHeight - prev.height - 8),
          );
          return { ...prev, x, y };
        });
      }

      if (resizeState) {
        const deltaX = event.clientX - resizeState.startX;
        const deltaY = event.clientY - resizeState.startY;

        const nextWidth = clamp(
          resizeState.startRect.width + deltaX,
          MIN_WIDTH,
          boundedWidth,
        );
        const nextHeight = clamp(
          resizeState.startRect.height + deltaY,
          MIN_HEIGHT,
          boundedHeight,
        );

        setWindowRect((prev) => {
          const x = clamp(
            prev.x,
            8,
            Math.max(8, viewportWidth - nextWidth - 8),
          );
          const y = clamp(
            prev.y,
            8,
            Math.max(8, viewportHeight - nextHeight - 8),
          );
          return { x, y, width: nextWidth, height: nextHeight };
        });
      }
    };

    const onPointerUp = () => {
      setDragState(null);
      setResizeState(null);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragState, resizeState]);

  const startDrag = (event) => {
    if (isMobileViewport || event.button !== 0) {
      return;
    }

    setDragState({
      startX: event.clientX,
      startY: event.clientY,
      startRect: windowRect,
    });
  };

  const startResize = (event) => {
    if (isMobileViewport || event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    setResizeState({
      startX: event.clientX,
      startY: event.clientY,
      startRect: windowRect,
    });
  };

  const runCommand = (commandText) => {
    const trimmed = commandText.trim();
    if (!trimmed) {
      return;
    }

    setHistory((prev) => {
      if (prev[prev.length - 1] === trimmed) {
        return prev;
      }
      return [...prev, trimmed];
    });
    setHistoryIndex(-1);

    const result = executeCommand(trimmed, terminalState);
    setTerminalState(result.nextState);

    if (result.meta.clear) {
      setEntries([]);
      setUserInput("");
      return;
    }

    if (result.entries.length > 0) {
      setEntries((prev) => [...prev, ...result.entries]);
    }

    if (result.meta.openInNewTab) {
      window.open(result.meta.openInNewTab, "_blank", "noopener,noreferrer");
    }
  };

  const commitAutocomplete = () => {
    const suggestions = getAutocompleteSuggestions(
      userInput,
      terminalState.cwd,
    );
    if (suggestions.length === 0) {
      return;
    }

    if (suggestions.length === 1) {
      const [single] = suggestions;
      const hasTrailingSpace = userInput.endsWith(" ");
      const parts = userInput.trimStart().split(" ");

      if (parts.length <= 1 && !hasTrailingSpace) {
        setUserInput(single);
        return;
      }

      if (hasTrailingSpace) {
        setUserInput(`${userInput}${single}`);
        return;
      }

      parts[parts.length - 1] = single;
      setUserInput(parts.join(" "));
      return;
    }

    setEntries((prev) => [
      ...prev,
      {
        type: "system",
        lines: [
          {
            type: "line",
            text: `Suggestions: ${suggestions.join(", ")}`,
            tone: "muted",
            copyable: false,
          },
        ],
        suggestions: suggestions.slice(0, 8),
      },
    ]);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      runCommand(userInput);
      setUserInput("");
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) {
        return;
      }
      const nextIndex =
        historyIndex < 0 ? history.length - 1 : Math.max(historyIndex - 1, 0);
      setHistoryIndex(nextIndex);
      setUserInput(history[nextIndex]);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (history.length === 0) {
        return;
      }
      const nextIndex =
        historyIndex < 0 ? -1 : Math.min(historyIndex + 1, history.length - 1);

      if (
        nextIndex === history.length - 1 &&
        historyIndex === history.length - 1
      ) {
        setHistoryIndex(-1);
        setUserInput("");
        return;
      }

      if (nextIndex < 0) {
        setHistoryIndex(-1);
        setUserInput("");
        return;
      }

      setHistoryIndex(nextIndex);
      setUserInput(history[nextIndex]);
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      setEntries([]);
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      commitAutocomplete();
      return;
    }

    if (event.key === "Escape") {
      setUserInput("");
      return;
    }
  };

  const activeTheme = getThemeById(terminalState.themeId);

  const cycleTheme = () => {
    const themes = portfolioContent.themes;
    const currentIndex = themes.findIndex(
      (item) => item.id === terminalState.themeId,
    );
    const next = themes[(currentIndex + 1) % themes.length];
    setTerminalState((prev) => ({ ...prev, themeId: next.id }));
    setToastMessage(`Theme: ${next.label}`);
  };

  const runSuggestion = (command) => {
    runCommand(command);
    setUserInput("");
    inputRef.current?.focus();
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage("Copied to clipboard");
    } catch {
      setToastMessage("Copy failed");
    }
  };

  const terminalStyle = {
    ...activeTheme.vars,
  };

  const terminalWindowStyle = isMobileViewport
    ? undefined
    : {
        width: `${windowRect.width}px`,
        height: `${windowRect.height}px`,
        transform: `translate(${windowRect.x}px, ${windowRect.y}px)`,
      };

  return (
    <div className="terminal-page">
      <div
        className={`terminal-window ${!isMobileViewport ? "is-floating" : ""} ${
          isWindowReady ? "is-visible" : ""
        }`}
        style={terminalWindowStyle}
      >
        <div
          ref={terminalRootRef}
          className="terminal-shell"
          style={terminalStyle}
          onClick={() => inputRef.current?.focus()}
        >
          <TerminalHeader
            prompt={getPrompt(terminalState.cwd)}
            themeLabel={activeTheme.label}
            onThemeCycle={cycleTheme}
            onDragStart={startDrag}
            isDragging={Boolean(dragState)}
          />

          <TerminalOutput
            entries={entries}
            onSuggestionClick={runSuggestion}
            onCopy={handleCopy}
          />

          <TerminalInput
            inputRef={inputRef}
            userInput={userInput}
            setUserInput={setUserInput}
            handleKeyDown={handleKeyDown}
            prompt={getPrompt(terminalState.cwd)}
          />

          {!isMobileViewport ? (
            <button
              type="button"
              className="terminal-resize-handle"
              onPointerDown={startResize}
              aria-label="Resize terminal window"
              title="Resize"
            />
          ) : null}

          {toastMessage ? (
            <p className="terminal-toast" role="status" aria-live="polite">
              {toastMessage}
            </p>
          ) : null}
        </div>
      </div>

      <p className="mobile-tip">
        Mobile tip: use command shortcuts like h, me, exp, edu, pro and the
        suggestion buttons for faster navigation.
      </p>
    </div>
  );
}
