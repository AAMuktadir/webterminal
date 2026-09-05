"use client";
import { useState, useEffect, useRef } from "react";
import TerminalHeader from "./terminalHeader";
import SettingsPanel from "./settingsPanel";
import TerminalInput from "./terminalInput";
import TerminalOutput from "./terminalOutput";
import {
  executeCommand,
  getAutocompleteSuggestions,
  getPrompt,
  getStartupEntries,
  getThemeById,
  replaceCompletion,
  getCommonPrefix,
} from "@/utils/terminal/commandEngine";
import { portfolioContent } from "@/utils/data/portfolioContent";

const MIN_WIDTH = 560;
const MIN_HEIGHT = 360;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const computeBounds = () => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const boundedWidth = Math.max(1, Math.min(viewportWidth - 16, 1060));
  const boundedHeight = Math.max(1, Math.min(viewportHeight - 16, 780));

  return {
    viewportWidth,
    viewportHeight,
    boundedWidth,
    boundedHeight,
    isMobile: viewportWidth < 768,
  };
};

export default function Terminal() {
  const [entries, setEntries] = useState(getStartupEntries);
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
  const [isAppFullscreen, setIsAppFullscreen] = useState(false);
  // Settings state
  const [transparency, setTransparency] = useState(0);
  const [fontSize, setFontSize] = useState(14);
  const [brightness, setBrightness] = useState(100);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsAnchorRef = useRef(null);
  const terminalRootRef = useRef(null);
  const inputRef = useRef(null);
  const initializedRef = useRef(false);
  const draftRef = useRef("");

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
      setDragState(null);
      setResizeState(null);

      if (!initializedRef.current) {
        const initialWidth = clamp(
          viewportWidth - 56,
          Math.min(MIN_WIDTH, boundedWidth),
          Math.min(980, boundedWidth),
        );
        const initialHeight = clamp(
          viewportHeight - 120,
          Math.min(MIN_HEIGHT, boundedHeight),
          Math.min(740, boundedHeight),
        );
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
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [dragState, resizeState]);

  const startDrag = (event) => {
    if (isMobileViewport || isAppFullscreen || event.button !== 0) {
      return;
    }

    setDragState({
      startX: event.clientX,
      startY: event.clientY,
      startRect: windowRect,
    });
  };

  const startResize = (event) => {
    if (isMobileViewport || isAppFullscreen || event.button !== 0) {
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
    draftRef.current = "";

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
      if (result.meta.openInNewTab.startsWith("mailto:")) {
        window.location.href = result.meta.openInNewTab;
      } else {
        window.open(result.meta.openInNewTab, "_blank", "noopener,noreferrer");
      }
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

    const common = getCommonPrefix(suggestions);
    if (
      suggestions.length === 1 ||
      common.length > userInput.trimStart().split(/\s/).at(-1).length
    ) {
      setUserInput(replaceCompletion(userInput, common));
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
        suggestions: suggestions.map((value) =>
          replaceCompletion(userInput, value),
        ),
        completion: true,
      },
    ]);
  };

  const handleKeyDown = (event) => {
    if (event.nativeEvent.isComposing) return;
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
      if (historyIndex < 0) draftRef.current = userInput;
      const nextIndex =
        historyIndex < 0 ? history.length - 1 : Math.max(historyIndex - 1, 0);
      setHistoryIndex(nextIndex);
      setUserInput(history[nextIndex]);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex < 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setUserInput(draftRef.current);
      } else {
        setHistoryIndex(nextIndex);
        setUserInput(history[nextIndex]);
      }
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      setEntries([]);
      return;
    }

    if (
      event.key === "Tab" &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.altKey &&
      inputRef.current.selectionStart === userInput.length &&
      inputRef.current.selectionEnd === userInput.length &&
      getAutocompleteSuggestions(userInput, terminalState.cwd).length > 0
    ) {
      event.preventDefault();
      commitAutocomplete();
      return;
    }

    if (event.key === "Escape") {
      setHistoryIndex(-1);
      draftRef.current = "";
      setIsAppFullscreen(false);
      setUserInput("");
      return;
    }
  };

  const activeTheme = getThemeById(terminalState.themeId);

  const toggleAppFullscreen = () => {
    setDragState(null);
    setResizeState(null);
    setIsAppFullscreen((prev) => !prev);
  };

  const handleThemeChange = (id) => {
    setTerminalState((prev) => ({ ...prev, themeId: id }));
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

  // Compose dynamic CSS variables from settings
  const terminalStyle = {
    ...activeTheme.vars,
    "--terminal-font-size": `${fontSize}px`,
    // brightness: slider range 30-100, CSS filter range 0.3-1.0
    "--terminal-brightness": `${brightness / 100}`,
    // transparency: slider range 0-80, CSS variable range 0.0-1.0
    "--terminal-transparency": `${transparency / 100}`,
  };

  const terminalWindowStyle = isAppFullscreen
    ? {
        width: "100vw",
        height: "100dvh",
        transform: "translate(0,0)",
        zIndex: 200,
      }
    : isMobileViewport
      ? undefined
      : {
          width: `${windowRect.width}px`,
          height: `${windowRect.height}px`,
          transform: `translate(${windowRect.x}px, ${windowRect.y}px)`,
        };

  return (
    <div
      className="terminal-page"
      onKeyDown={(event) => {
        if (event.key === "Escape" && !settingsOpen && isAppFullscreen) {
          setIsAppFullscreen(false);
        }
      }}
    >
      <div
        className={`terminal-window ${!isMobileViewport ? "is-floating" : ""} ${
          isWindowReady ? "is-visible" : ""
        } ${isAppFullscreen ? "is-app-fullscreen" : ""}`}
        style={terminalWindowStyle}
      >
        <div
          ref={terminalRootRef}
          className="terminal-shell"
          style={terminalStyle}
          onClick={(event) => {
            if (
              !event.target.closest("button, a, input") &&
              !window.getSelection()?.toString()
            ) {
              inputRef.current?.focus();
            }
          }}
        >
          <TerminalHeader
            prompt={getPrompt(terminalState.cwd)}
            themeLabel={activeTheme.label}
            onDragStart={startDrag}
            isDragging={Boolean(dragState)}
            isAppFullscreen={isAppFullscreen}
            onToggleFullscreen={toggleAppFullscreen}
          />

          <TerminalOutput
            entries={entries}
            onSuggestionClick={runSuggestion}
            onCompletionClick={(value) => {
              setUserInput(value);
              setHistoryIndex(-1);
              inputRef.current?.focus();
            }}
            onCopy={handleCopy}
          />

          <TerminalInput
            inputRef={inputRef}
            userInput={userInput}
            setUserInput={(value) => {
              setUserInput(value);
              setHistoryIndex(-1);
            }}
            handleKeyDown={handleKeyDown}
            prompt={getPrompt(terminalState.cwd)}
          />

          {!isMobileViewport && !isAppFullscreen ? (
            <button
              type="button"
              className="terminal-resize-handle"
              onPointerDown={startResize}
              onKeyDown={(event) => {
                const directions = {
                  ArrowRight: [20, 0],
                  ArrowLeft: [-20, 0],
                  ArrowUp: [0, -20],
                  ArrowDown: [0, 20],
                };
                if (!directions[event.key]) return;
                event.preventDefault();
                const [dx, dy] = directions[event.key];
                setWindowRect((prev) => ({
                  ...prev,
                  width: clamp(
                    prev.width + dx,
                    Math.min(MIN_WIDTH, window.innerWidth - prev.x - 8),
                    window.innerWidth - prev.x - 8,
                  ),
                  height: clamp(
                    prev.height + dy,
                    Math.min(MIN_HEIGHT, window.innerHeight - prev.y - 8),
                    window.innerHeight - prev.y - 8,
                  ),
                }));
              }}
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

      {/* App-level settings button — fixed top-right of viewport */}
      <div ref={settingsAnchorRef} className="app-settings-anchor">
        <button
          type="button"
          className={`settings-trigger app-settings-trigger ${settingsOpen ? "is-active" : ""}`}
          onClick={() => setSettingsOpen((v) => !v)}
          aria-label="Open settings"
          aria-expanded={settingsOpen}
          aria-controls="terminal-settings"
          title="Settings"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="10" cy="10" r="3" />
            <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" />
          </svg>
        </button>

        <SettingsPanel
          isOpen={settingsOpen}
          onClose={(restoreFocus = false) => {
            setSettingsOpen(false);
            if (restoreFocus)
              settingsAnchorRef.current?.querySelector("button")?.focus();
          }}
          themeId={terminalState.themeId}
          onThemeChange={handleThemeChange}
          transparency={transparency}
          onTransparency={setTransparency}
          fontSize={fontSize}
          onFontSize={setFontSize}
          brightness={brightness}
          onBrightness={setBrightness}
        />
      </div>

      <p className="mobile-tip">
        Mobile tip: use command shortcuts like h, me, exp, edu, pro and the
        suggestion buttons for faster navigation.
      </p>
    </div>
  );
}
