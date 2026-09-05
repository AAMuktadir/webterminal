# Web Terminal functional audit

Audit completed September 6, 2026 against the local repository. Changes are local;
no commit, push, or deployment was performed.

## Findings and repairs

- Autocomplete previously displayed bare argument buttons that executed invalid
  commands. Choices now populate complete input, unique matches/common prefixes
  complete directly, and ambiguous choices remain clickable. Completion supports
  aliases, current-directory paths, nested paths, projects, themes, and sudo.
- The project directory list duplicated portfolio slugs and listed folders that
  did not exist. Directories now derive from projects, with readable README.txt
  files. cd and ls support home, absolute and relative paths, dot segments, and
  useful errors. Traversal cannot escape the virtual root or traverse a file.
- Other advertised virtual text files were unreadable. cat now renders summary,
  timeline, education, and contact content through the existing commands.
  cat resume and cat resume.txt still open the current text resume from anywhere.
- Help now documents path/file arguments, all commands/aliases, and keyboard use.
  Extra arguments produce usage errors. Project output links are clickable and
  suggestions derive from the complete project collection.
- History discarded drafts; ArrowDown could erase untouched input. Drafts now
  restore correctly, and output clearing preserves history. Startup initialization
  no longer overwrites a quickly entered first command.
- Shell clicks stole focus from buttons and links. Interactive elements keep
  focus; selection is preserved. Tab completion is limited to the input at the
  end of text, with Shift+Tab available to leave it. Composition Enter is ignored.
- Hidden settings controls remained keyboard reachable, and the trigger raced
  with outside-click dismissal. The closed panel is inert; opening focuses its
  first control; Escape restores trigger focus. Theme controls remain synchronized.
- The green fullscreen control was inside aria-hidden. It is now accessible;
  red/yellow decorative dots are no longer nonfunctional buttons. Resize also
  supports keyboard arrows. Fullscreen blocks drag/resize and Escape restores it.
- Window dimensions now account for short viewports; pointer cancellation and
  viewport changes reset manipulation. Direct dragging/resizing no longer lags
  behind CSS geometry transitions.
- Mobile font controls were overridden by fixed CSS. Long paths and URLs now wrap,
  inputs retain usable width, and the mobile tip cannot cover the command input.
  Dynamic viewport heights, bounded settings scrolling, focus outlines, and reduced
  motion are supported. Transparency now matches the slider percentage.
- Newly executed commands scroll into view even after browsing earlier output.
- SEO metadata used localhost as its production fallback; it now uses the stored
  public site URL.
- The old 2025 PDF was still publicly served. It is preserved in docs/archive
  rather than public. The identical root-level resume.txt was removed; the current
  public text and PDF files are untouched.
- Dependency audit found existing advisories. Next.js and its ESLint config were
  updated together to 16.3.4, compatible transitive fixes applied, and package-lock
  added for reproducible installation. Full npm audit reports zero vulnerabilities.

## Files changed

- utils/terminal/commandEngine.js: command validation, paths, completion and output.
- utils/data/portfolioContent.js: help descriptions; remove duplicated project tree.
- components/terminal.jsx: input/history, completion, focus and window handling.
- components/terminalHeader.jsx: accessible controls and hydration-safe clock.
- components/terminalOutput.jsx: completion actions, downloads and output scrolling.
- components/settingsPanel.jsx: toggle, inert state and focus handling.
- app/globals.css and app/layout.js: responsive/accessibility fixes and metadata.
- package.json, package-lock.json, playwright.config.mjs, tests/: tooling and tests.
- .gitignore, README.md and this report: test artifacts and behavior documentation.
- resume.txt removed; old PDF moved from public/file to docs/archive.

## Verification

- npm test: four focused groups cover every registered command and alias, blank
  input, unknown commands, argument errors, path normalization/traversal, readable
  virtual files, dynamic project/theme completion, project fallback links, career
  ordering/results, contact destinations, resume links and clear.
- npm run lint and npm run build pass.
- Ten Chromium browser acceptance tests pass and cover command execution, keyboard completion,
  clickable choices, history draft recovery, clear, theme synchronization, settings
  toggle/focus/sliders, pointer and keyboard resizing, drag boundaries, fullscreen
  restore, viewport transitions, and current resume download/resource responses.
  An actual text-resume tab, clipboard success/failure, and Ctrl+L history preservation
  also pass.
- Responsive tests at 320, 390, 768, 1024 and 1440 pixels include 22px output,
  long paths, overflow and unobstructed input checks. Desktop/mobile screenshots
  were visually reviewed. No page errors during the command acceptance sequence.
- Local text/PDF URLs return 200 with expected contents/types; the old PDF URL
  returns 404. The current PDF text/embedded links were inspected read-only.
- The live Netlify homepage responded HTTP 200; functional acceptance targets the
  changed local production build, not an unmodified live deployment.

## Intentionally preserved and limits

- Visual identity, professional facts, project data and current resume documents
  remain intact. DataSecure retains https://dataencryption.vercel.app/.
- Preferences and history remain session-only, as before. No real filesystem or
  complex shell semantics (quoting, pipes, flags) were added.
- The manually authored public resume has additional detail beyond structured
  portfolio data. It remains an editorial document; do not regenerate it blindly.
- External project/profile destinations are checked against structured data and
  browser-open arguments. This is not a guarantee of third-party uptime. Email
  composition depends on the visitor's configured mail handler; no email was sent.
- Browser verification uses Chromium with responsive viewports, not physical
  iOS/Android devices or an exhaustive Safari/Firefox matrix.
- No product decision is required for these fixes. Deployment remains a separate
  step; the live site will retain its previous behavior until changes are deployed.
