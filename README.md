# Web Terminal

An interactive terminal-style developer portfolio built with Next.js and React.

Instead of presenting portfolio content through a traditional website layout, Web Terminal provides a macOS-inspired command-line experience where visitors can explore my experience, projects, skills, education, and contact information through terminal commands.

🌐 **Live:** https://mywebterminal.netlify.app/  
💻 **GitHub:** https://github.com/AAMuktadir/webterminal

---

## Overview

Web Terminal is a personal portfolio project focused on combining developer experience, UI engineering, and interactive frontend architecture.

The application includes a custom command engine, virtual file system, autocomplete, command history, theme switching, configurable display settings, and draggable/resizable terminal behavior.

It is designed to be both functional and playful while remaining usable across desktop and mobile devices.

---

## Features

### Interactive Command Line

- 20+ supported commands
- Command aliases
- Command history with ↑ / ↓ navigation
- Context-aware autocomplete
- Clickable command suggestions
- Helpful command-not-found responses

Example commands:

```bash
help
about
skills
projects
experience
education
contact
resume
github
linkedin
ls
cd projects
open web-terminal
theme graphite
sudo hire-me
```

### Virtual File System

Navigate portfolio content using familiar terminal commands:

```bash
ls
cd projects
cd ..
cat resume
```

Virtual directories include:

```text
~
├── about
├── projects
├── experience
├── education
├── contact
└── resume.txt
```

### Window Management

- Draggable desktop-style terminal window
- Resizable interface
- Viewport boundary detection
- Fullscreen mode
- Responsive mobile behavior

### Customization

Three built-in terminal themes:

- Graphite
- Paper
- Classic

Users can also adjust:

- Font size
- Window transparency
- Brightness
- Fullscreen state

Changes are reflected immediately through CSS custom properties.

### Portfolio Integration

Terminal commands provide access to:

- Professional summary
- Technical skills
- Work experience
- Education
- Featured projects
- GitHub
- LinkedIn
- Contact information
- Downloadable resume

---

## Tech Stack

### Core

- Next.js
- React
- JavaScript
- Tailwind CSS

### Frontend Architecture

- React Hooks
- CSS Custom Properties
- Pointer Events
- Clipboard API
- Responsive viewport handling

### Tooling

- ESLint
- Next.js App Router
- Netlify

---

## Architecture

The project separates portfolio content, command processing, and UI components to keep the application maintainable and data-driven.

```text
webterminal/
├── app/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── settingsPanel.jsx
│   ├── terminal.jsx
│   ├── terminalHeader.jsx
│   ├── terminalInput.jsx
│   └── terminalOutput.jsx
├── public/
│   ├── file/
│   ├── img/
│   └── resume.txt
├── utils/
│   ├── data/
│   │   └── portfolioContent.js
│   └── terminal/
│       └── commandEngine.js
└── README.md
```

### Data-Driven Portfolio

Professional information is stored separately in:

```text
utils/data/portfolioContent.js
```

This includes:

- Personal information
- SEO metadata
- Skills
- Experience
- Education
- Projects
- Achievements
- Terminal configuration
- Themes

This makes portfolio updates possible without modifying the terminal UI.

### Command Engine

The command engine handles:

- Command parsing
- Aliases
- Command execution
- Directory navigation
- Autocomplete
- Project lookup
- Theme switching
- Command responses

```text
utils/terminal/commandEngine.js
```

This keeps portfolio data, terminal behavior, and UI components separated.

---

## Interesting Technical Implementation

### Command Parsing

User input is normalized and parsed into commands and arguments before execution.

Aliases such as:

```bash
h
me
exp
edu
pro
gh
li
```

are mapped to their corresponding commands.

### Context-Aware Autocomplete

Suggestions change depending on the active command.

Examples:

```bash
cd <directory>
open <project>
theme <theme-name>
```

Project suggestions are generated dynamically from portfolio data.

### Dynamic Window Management

Dragging and resizing use pointer events while tracking:

- Starting cursor position
- Terminal dimensions
- Viewport boundaries
- Fullscreen state

The window is prevented from moving outside the visible browser area.

### Theme System

Theme values are managed through CSS custom properties:

```css
--terminal-bg
--terminal-surface
--terminal-text
--terminal-muted
--terminal-accent
--terminal-error
--terminal-link
```

This allows themes and display settings to update dynamically.

### Virtual File Navigation

The terminal maintains a virtual current working directory and supports commands such as:

```bash
cd projects
ls
cd ..
```

The filesystem is simulated through application state rather than the user's real operating system.

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/AAMuktadir/webterminal.git
cd webterminal
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Build

```bash
npm run build
npm start
```

---

## Updating Portfolio Content

Most portfolio information can be updated from:

```text
utils/data/portfolioContent.js
```

Example structure:

```js
export const portfolioContent = {
  person: {},
  skills: {},
  experience: [],
  education: [],
  projects: [],
};
```

The terminal command engine consumes this data dynamically.

---

## Resume

The terminal supports both text and PDF versions of my resume.

```text
/public/resume.txt
/public/file/Abdullah-Al-Muktadir.pdf
```

Users can access them through:

```bash
resume
```

or:

```bash
cat resume
```

---

## Deployment

The project is deployed on Netlify.

🌐 https://mywebterminal.netlify.app/

---

## Project Status

**Active**

The project is actively maintained as my alternative interactive portfolio.

---

## Future Improvements

- Persist user theme and display preferences between sessions
- Expand virtual filesystem behavior
- Add additional terminal commands
- Improve accessibility and keyboard navigation
- Add command-based project filtering
- Add automated testing for the command engine
- Continue improving the mobile terminal experience

---

## About Me

I'm **Abdullah Al Muktadir**, a Full Stack Developer with 4+ years of experience building enterprise applications, internal business systems, e-commerce platforms, and modern web applications.

My primary areas of work include:

- Next.js
- React
- TypeScript
- Node.js
- REST APIs
- PostgreSQL
- AWS
- Docker
- Linux
- CI/CD

---

## Connect

- **Portfolio:** https://muktadir.netlify.app
- **LinkedIn:** https://linkedin.com/in/aa-muktadir
- **GitHub:** https://github.com/AAMuktadir
- **Email:** muktadir.96@gmail.com

---

## Usage

This project is primarily intended as a personal portfolio and learning project.

Feel free to explore the code and use ideas from the implementation for learning purposes.
