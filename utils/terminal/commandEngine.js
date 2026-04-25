import { portfolioContent } from "@/utils/data/portfolioContent";

const content = portfolioContent;

const outputTone = {
  normal: "normal",
  muted: "muted",
  success: "success",
  error: "error",
  title: "title",
};

const resolveAlias = (value) =>
  content.commands.aliases[value] ? content.commands.aliases[value] : value;

const normalizeInput = (rawInput) => rawInput.trim().replace(/\s+/g, " ");

const getDirectoryItems = (cwd) => content.terminal.directories[cwd] || [];

const toLine = (text, tone = outputTone.normal, copyable = false) => ({
  type: "line",
  text,
  tone,
  copyable,
});

const toLink = (label, href, download = false) => ({
  type: "link",
  label,
  href,
  download,
});

const joinList = (items) => items.join("    ");

const canMoveTo = (targetDir) =>
  Boolean(content.terminal.directories[targetDir]);

const resolveCd = (cwd, targetRaw) => {
  if (!targetRaw || targetRaw === "~") {
    return "~";
  }

  if (targetRaw === "..") {
    if (cwd === "~") {
      return "~";
    }
    const parent = cwd.split("/").slice(0, -1).join("/");
    return parent || "~";
  }

  const target =
    targetRaw.startsWith("~/") || targetRaw === "~"
      ? targetRaw
      : cwd === "~"
        ? `~/${targetRaw}`
        : `${cwd}/${targetRaw}`;

  if (canMoveTo(target)) {
    return target;
  }

  return null;
};

const projectBySlug = (slug) =>
  content.projects.find(
    (project) => project.slug.toLowerCase() === slug.toLowerCase(),
  );

const parseCommand = (input) => {
  const normalized = normalizeInput(input);
  if (!normalized) {
    return { command: "", args: [], raw: "" };
  }

  const [first, ...rest] = normalized.split(" ");
  const command = resolveAlias(first.toLowerCase());
  return { command, args: rest, raw: normalized };
};

export const getAutocompleteSuggestions = (input, cwd) => {
  const normalized = input.replace(/\s+/g, " ");
  const [cmd = "", ...args] = normalized.trimStart().split(" ");
  const cmdLower = cmd.toLowerCase();
  const commandSource = [
    ...content.commands.list.map((item) => item.name.split(" ")[0]),
    ...Object.keys(content.commands.aliases),
  ];

  if (!cmd) {
    return Array.from(new Set(commandSource)).sort();
  }

  if (normalized.endsWith(" ")) {
    if (cmdLower === "cd") {
      return getDirectoryItems(cwd).filter((item) => !item.endsWith(".txt"));
    }

    if (cmdLower === "open") {
      return content.projects.map((project) => project.slug);
    }

    if (cmdLower === "theme") {
      return content.themes.map((theme) => theme.id);
    }

    return [];
  }

  if (args.length === 0) {
    return Array.from(new Set(commandSource))
      .filter((name) => name.startsWith(cmdLower))
      .sort();
  }

  const argText = args.join(" ").toLowerCase();

  if (cmdLower === "cd") {
    return getDirectoryItems(cwd)
      .filter((item) => !item.endsWith(".txt"))
      .filter((item) => item.startsWith(argText));
  }

  if (cmdLower === "open") {
    return content.projects
      .map((project) => project.slug)
      .filter((slug) => slug.startsWith(argText));
  }

  if (cmdLower === "theme") {
    return content.themes
      .map((theme) => theme.id)
      .filter((themeId) => themeId.startsWith(argText));
  }

  return [];
};

export const getPrompt = (cwd) =>
  `${content.terminal.username}@${content.terminal.host}:${cwd}$`;

export const getThemeById = (themeId) =>
  content.themes.find((theme) => theme.id === themeId) || content.themes[0];

export const getStartupEntries = () => [
  {
    type: "system",
    lines: [
      toLine(content.startup.title, outputTone.title),
      toLine(content.startup.subtitle, outputTone.muted),
      toLine("", outputTone.normal),
    ],
    suggestions: content.startup.suggestions,
  },
];

export const executeCommand = (input, state) => {
  const parsed = parseCommand(input);
  const command = parsed.command;
  const args = parsed.args;
  const cwd = state.cwd;
  const nextState = { ...state };

  if (!command) {
    return {
      nextState,
      entries: [],
      meta: { clear: false },
    };
  }

  const lines = [];
  const links = [];
  const suggestions = [];
  const meta = { clear: false, openInNewTab: null };

  switch (command) {
    case "help":
      lines.push(toLine("Available commands:", outputTone.title));
      content.commands.list.forEach((item) => {
        lines.push(
          toLine(`- ${item.name.padEnd(16, " ")} ${item.description}`),
        );
      });
      lines.push(toLine(""));
      lines.push(
        toLine(
          `Aliases: ${Object.entries(content.commands.aliases)
            .map(([alias, original]) => `${alias} -> ${original}`)
            .join(", ")}`,
          outputTone.muted,
        ),
      );
      suggestions.push("about", "skills", "projects");
      break;

    case "about":
      lines.push(toLine(content.person.name, outputTone.title));
      lines.push(toLine(content.person.role));
      lines.push(toLine(content.person.location, outputTone.muted));
      lines.push(toLine(""));
      lines.push(toLine(content.person.summary));
      suggestions.push("experience", "skills", "contact");
      break;

    case "skills":
      lines.push(toLine("Development", outputTone.title));
      content.skills.development.forEach((item) =>
        lines.push(toLine(`- ${item}`)),
      );
      lines.push(toLine(""));
      lines.push(toLine("Operational", outputTone.title));
      content.skills.operational.forEach((item) =>
        lines.push(toLine(`- ${item}`)),
      );
      lines.push(toLine(""));
      lines.push(toLine("Programming", outputTone.title));
      content.skills.programming.forEach((item) =>
        lines.push(toLine(`- ${item}`)),
      );
      lines.push(toLine(""));
      lines.push(toLine("Soft Skills", outputTone.title));
      content.skills.soft.forEach((item) => lines.push(toLine(`- ${item}`)));
      break;

    case "projects":
      lines.push(
        toLine(
          "Projects are currently placeholders because project specifics are not listed in the resume. Update them in utils/data/portfolioContent.js.",
          outputTone.muted,
        ),
      );
      lines.push(toLine(""));
      content.projects.forEach((project) => {
        lines.push(
          toLine(`${project.title} (${project.slug})`, outputTone.title),
        );
        lines.push(toLine(project.description));
        lines.push(toLine(`Tech: ${project.stack.join(", ")}`));
        project.highlights.forEach((item) => lines.push(toLine(`- ${item}`)));
        lines.push(toLine(`GitHub: ${project.github || "[placeholder]"}`));
        lines.push(toLine(`Live: ${project.live || "[placeholder]"}`));
        lines.push(toLine(""));
      });
      suggestions.push(
        "open project-placeholder-1",
        "open project-placeholder-2",
      );
      break;

    case "experience":
      content.experience.forEach((job) => {
        lines.push(toLine(`${job.role} - ${job.company}`, outputTone.title));
        lines.push(toLine(job.period));
        lines.push(toLine(job.location, outputTone.muted));
        job.highlights.forEach((item) => lines.push(toLine(`- ${item}`)));
        lines.push(toLine(""));
      });
      break;

    case "education":
      content.education.forEach((item) => {
        lines.push(toLine(item.degree, outputTone.title));
        lines.push(toLine(`${item.institute}, ${item.location}`));
        lines.push(toLine(item.result));
        lines.push(toLine(item.period, outputTone.muted));
        lines.push(toLine(""));
      });
      break;

    case "achievements":
      lines.push(toLine("Selected achievements", outputTone.title));
      content.achievements.forEach((item) => lines.push(toLine(`- ${item}`)));
      break;

    case "contact":
      lines.push(toLine("Contact", outputTone.title));
      lines.push(
        toLine(`Email: ${content.person.email}`, outputTone.normal, true),
      );
      lines.push(
        toLine(`Phone: ${content.person.phone}`, outputTone.normal, true),
      );
      lines.push(toLine(`Location: ${content.person.location}`));
      links.push(toLink("GitHub", content.person.github));
      links.push(toLink("LinkedIn", content.person.linkedin));
      links.push(toLink("Email", `mailto:${content.person.email}`));
      break;

    case "resume":
      lines.push(toLine("Resume files", outputTone.title));
      links.push(toLink("View plain text resume", content.resume.textUrl));
      links.push(toLink("Open latest PDF resume", content.resume.pdfUrl));
      links.push(
        toLink("Download latest PDF resume", content.resume.pdfUrl, true),
      );
      links.push(toLink("Open previous PDF resume", content.resume.oldPdfUrl));
      lines.push(
        toLine(
          "Tip: use `cat resume` to open text resume quickly.",
          outputTone.muted,
        ),
      );
      break;

    case "socials":
      lines.push(toLine("Social links", outputTone.title));
      links.push(toLink("GitHub", content.person.github));
      links.push(toLink("LinkedIn", content.person.linkedin));
      links.push(toLink("Email", `mailto:${content.person.email}`));
      break;

    case "github":
      lines.push(toLine("Opening GitHub profile...", outputTone.success));
      links.push(toLink(content.person.github, content.person.github));
      meta.openInNewTab = content.person.github;
      break;

    case "linkedin":
      lines.push(toLine("Opening LinkedIn profile...", outputTone.success));
      links.push(toLink(content.person.linkedin, content.person.linkedin));
      meta.openInNewTab = content.person.linkedin;
      break;

    case "email":
      lines.push(
        toLine(`mailto:${content.person.email}`, outputTone.success, true),
      );
      links.push(toLink("Compose email", `mailto:${content.person.email}`));
      meta.openInNewTab = `mailto:${content.person.email}`;
      break;

    case "whoami":
      lines.push(
        toLine(
          `${content.person.name} - ${content.person.role} | ${content.person.location}`,
          outputTone.normal,
          true,
        ),
      );
      break;

    case "ls": {
      const items = getDirectoryItems(cwd);
      lines.push(toLine(joinList(items), outputTone.normal));
      break;
    }

    case "cd": {
      const target = args[0];
      const resolved = resolveCd(cwd, target);
      if (!resolved) {
        lines.push(
          toLine(
            `cd: no such file or directory: ${target || ""}`,
            outputTone.error,
          ),
        );
      } else {
        nextState.cwd = resolved;
      }
      break;
    }

    case "cat": {
      const target = args.join(" ");
      if (target === "resume" || target === "resume.txt") {
        links.push(toLink("Open resume.txt", content.resume.textUrl));
        lines.push(
          toLine("Opening text resume in a new tab...", outputTone.success),
        );
        meta.openInNewTab = content.resume.textUrl;
      } else {
        lines.push(toLine(`cat: ${target}: No such file`, outputTone.error));
      }
      break;
    }

    case "open": {
      const slug = args[0];
      if (!slug) {
        lines.push(toLine("open: provide a project slug", outputTone.error));
        break;
      }

      const project = projectBySlug(slug);
      if (!project) {
        lines.push(
          toLine(`open: project not found: ${slug}`, outputTone.error),
        );
        break;
      }

      if (project.live) {
        lines.push(
          toLine(`Opening live demo for ${project.title}`, outputTone.success),
        );
        links.push(toLink("Live Demo", project.live));
        meta.openInNewTab = project.live;
      } else if (project.github) {
        lines.push(
          toLine(`Opening repository for ${project.title}`, outputTone.success),
        );
        links.push(toLink("GitHub", project.github));
        meta.openInNewTab = project.github;
      } else {
        lines.push(
          toLine(
            `No URL is set for ${project.slug}. Update project links in utils/data/portfolioContent.js.`,
            outputTone.muted,
          ),
        );
      }
      break;
    }

    case "theme": {
      const selected = args[0];
      if (!selected) {
        lines.push(toLine("Available themes", outputTone.title));
        content.themes.forEach((theme) => {
          lines.push(
            toLine(
              `- ${theme.id}${state.themeId === theme.id ? " (active)" : ""}`,
            ),
          );
        });
        break;
      }

      const nextTheme = content.themes.find((theme) => theme.id === selected);
      if (!nextTheme) {
        lines.push(
          toLine(
            `theme: unknown theme \"${selected}\". Use: ${content.themes
              .map((theme) => theme.id)
              .join(", ")}`,
            outputTone.error,
          ),
        );
      } else {
        nextState.themeId = nextTheme.id;
        lines.push(
          toLine(`Theme switched to ${nextTheme.label}`, outputTone.success),
        );
      }
      break;
    }

    case "date":
      lines.push(toLine(new Date().toString()));
      break;

    case "clear":
      meta.clear = true;
      break;

    case "sudo": {
      const subcommand = args.join(" ").toLowerCase();
      if (subcommand === "hire-me") {
        lines.push(
          toLine("[sudo] password for recruiter: ********", outputTone.muted),
        );
        lines.push(
          toLine("Access granted. Great decision.", outputTone.success),
        );
        lines.push(
          toLine(
            `Reach out at ${content.person.email} or ${content.person.linkedin}`,
            outputTone.normal,
            true,
          ),
        );
        links.push(toLink("Send email", `mailto:${content.person.email}`));
      } else {
        lines.push(
          toLine(`sudo: command not found: ${subcommand}`, outputTone.error),
        );
      }
      break;
    }

    default:
      lines.push(
        toLine(
          `command not found: ${command}. Type \"help\" to see available commands.`,
          outputTone.error,
        ),
      );
      break;
  }

  return {
    nextState,
    entries: [
      {
        type: "command",
        prompt: getPrompt(cwd),
        input: parsed.raw,
        lines,
        links,
        suggestions,
      },
    ],
    meta,
  };
};
