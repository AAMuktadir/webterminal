"use client";
import { useEffect, useRef } from "react";
import { portfolioContent } from "@/utils/data/portfolioContent";

/**
 * SettingsPanel — macOS-style glassmorphic popover for terminal customization.
 * Props:
 *   isOpen         : boolean
 *   onClose        : () => void
 *   themeId        : string
 *   onThemeChange  : (id: string) => void
 *   transparency   : number  (0–100)
 *   onTransparency : (v: number) => void
 *   fontSize       : number  (px)
 *   onFontSize     : (v: number) => void
 *   brightness     : number  (0–100, 100 = normal)
 *   onBrightness   : (v: number) => void
 */
export default function SettingsPanel({
  isOpen,
  onClose,
  themeId,
  onThemeChange,
  transparency,
  onTransparency,
  fontSize,
  onFontSize,
  brightness,
  onBrightness,
}) {
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const themes = portfolioContent.themes;

  return (
    <div
      ref={panelRef}
      className={`settings-panel ${isOpen ? "settings-panel--open" : ""}`}
      role="dialog"
      aria-label="Terminal settings"
      aria-hidden={!isOpen}
    >
      {/* ── Theme ───────────────────────────────────────────────── */}
      <section className="settings-section">
        <p className="settings-label">Theme</p>
        <div className="settings-themes">
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`settings-theme-btn ${themeId === t.id ? "is-active" : ""}`}
              onClick={() => onThemeChange(t.id)}
              aria-pressed={themeId === t.id}
              style={{
                "--swatch-bg": t.vars["--terminal-bg"],
                "--swatch-accent": t.vars["--terminal-accent"],
              }}
            >
              <span className="settings-theme-swatch" aria-hidden="true" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="settings-divider" />

      {/* ── Transparency ────────────────────────────────────────── */}
      <section className="settings-section">
        <label className="settings-label" htmlFor="ctrl-transparency">
          Transparency
          <span className="settings-value">{transparency}%</span>
        </label>
        <input
          id="ctrl-transparency"
          type="range"
          min={0}
          max={80}
          step={1}
          value={transparency}
          onChange={(e) => onTransparency(Number(e.target.value))}
          className="settings-slider"
          aria-label="Terminal transparency"
        />
      </section>

      {/* ── Font Size ───────────────────────────────────────────── */}
      <section className="settings-section">
        <p className="settings-label">
          Font Size
          <span className="settings-value">{fontSize}px</span>
        </p>
        <div className="settings-stepper">
          <button
            type="button"
            className="settings-step-btn"
            onClick={() => onFontSize(Math.max(10, fontSize - 1))}
            aria-label="Decrease font size"
          >
            −
          </button>
          <span className="settings-step-val">{fontSize}</span>
          <button
            type="button"
            className="settings-step-btn"
            onClick={() => onFontSize(Math.min(22, fontSize + 1))}
            aria-label="Increase font size"
          >
            ＋
          </button>
        </div>
      </section>

      {/* ── Brightness ──────────────────────────────────────────── */}
      <section className="settings-section">
        <label className="settings-label" htmlFor="ctrl-brightness">
          Brightness
          <span className="settings-value">{brightness}%</span>
        </label>
        <input
          id="ctrl-brightness"
          type="range"
          min={30}
          max={100}
          step={1}
          value={brightness}
          onChange={(e) => onBrightness(Number(e.target.value))}
          className="settings-slider"
          aria-label="Terminal brightness"
        />
      </section>
    </div>
  );
}
