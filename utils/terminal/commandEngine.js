import { portfolioContent } from "../data/portfolioContent.js";

const content = portfolioContent;

const outputTone = {
  normal: "normal",
  muted: "muted",
  success: "success",
  error: "error",
  title: "title",
};

const resolveAlias = (value) =>
  Object.hasOwn(content.commands.aliases, value)
    ? content.commands.aliases[value]
    : value;

const normalizeInput = (rawInput) => rawInput.trim().replace(/\s+/g, " ");

// All nodes are virtual; project directories follow the structured project data.
const getDirectories = () => ({
  ...content.terminal.directories,
  "~/projects": content.projects.map((project) => project.slug),
  ...Object.fromEntries(
    content.projects.map((project) => [
      `~/projects/${project.slug}`,
      ["README.txt"],
    ]),
  ),
});
const isDirectory = (path) => Object.hasOwn(getDirectories(), path);
const getDirectoryItems = (cwd) =>
  isDirectory(cwd) ? getDirectories()[cwd] : [];

// Normalize each segment while validating traversal, including file/.. paths.
export const resolvePath = (cwd, raw = "~") => {
  const absolute = raw === "~" || raw.startsWith("~/") || raw.startsWith("/");
  const parts = absolute ? [] : cwd.split("/").slice(1);
  const segments = raw.replace(/^~(?=\/|$)/, "").split("/");
  for (const segment of segments) {
    if (!segment) continue;
    if (!isDirectory(["~", ...parts].join("/"))) return null;
    if (segment === "..") parts.pop();
    else if (segment !== ".") parts.push(segment);
  }
  const result = ["~", ...parts].join("/");
  return raw.endsWith("/") && !isDirectory(result) ? null : result;
};

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

export const getAutocompleteSuggestions = (input, cwd = "~") => {
  const normalized = input.trimStart().replace(/\s+/g, " ");
  const [cmd = "", ...args] = normalized.split(" ");
  const command = resolveAlias(cmd.toLowerCase());
  if (!args.length) {
    return [
      ...new Set([
        ...content.commands.list.map((item) => item.name.split(" ")[0]),
        ...Object.keys(content.commands.aliases),
      ]),
    ]
      .filter((name) => name.startsWith(cmd.toLowerCase()))
      .sort();
  }
  if (args.length > 1) return [];
  const partial = args[0];
  let candidates = [];
  if (["cd", "ls", "cat"].includes(command)) {
    const slash = partial.lastIndexOf("/");
    const prefix = slash < 0 ? "" : partial.slice(0, slash + 1);
    const parent = resolvePath(cwd, prefix || ".");
    candidates = getDirectoryItems(parent).map((name) => prefix + name);
    if (command === "cd") {
      candidates = candidates.filter((name) =>
        isDirectory(resolvePath(cwd, name)),
      );
    }
    if (!prefix) candidates.push("~", "..");
    if (command === "cat" && !prefix) candidates.push("resume", "resume.txt");
    if (partial === "~") candidates.push("~/");
  } else if (command === "open") {
    candidates = content.projects.map((project) => project.slug);
  } else if (command === "theme") {
    candidates = content.themes.map((theme) => theme.id);
  } else if (command === "sudo") {
    candidates = ["hire-me"];
  }
  return [...new Set(candidates)]
    .filter((value) => value.toLowerCase().startsWith(partial.toLowerCase()))
    .sort();
};

export const replaceCompletion = (input, value) =>
  input.trimStart().replace(/\s+/g, " ").replace(/\S*$/, value);

export const getCommonPrefix = (values) =>
  values.reduce((prefix, value) => {
    while (!value.startsWith(prefix)) prefix = prefix.slice(0, -1);
    return prefix;
  }, values[0] || "");

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

  const maxArgs = ["cd", "ls", "cat", "open", "theme", "sudo"].includes(command)
    ? 1
    : 0;
  const known = content.commands.list.find(
    (item) => item.name.split(" ")[0] === command,
  );
  if (known && args.length > maxArgs) {
    return {
      nextState,
      entries: [
        {
          type: "command",
          prompt: getPrompt(cwd),
          input: parsed.raw,
          lines: [toLine(`Usage: ${known.name}`, outputTone.error)],
          links: [],
          suggestions: [],
        },
      ],
      meta,
    };
  }

  switch (command) {
    case "help":
      lines.push(toLine("Available commands:", outputTone.title));
      content.commands.list.forEach((item) => {
        lines.push(toLine(`- ${item.name} ${item.description}`));
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
      lines.push(
        toLine(
          "Tab completes or shows choices; Shift+Tab leaves input. ↑/↓ history; Ctrl+L clears; Escape cancels.",
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
      lines.push(toLine("Featured Projects", outputTone.title));
      lines.push(toLine(""));

      content.projects.forEach((project) => {
        lines.push(
          toLine(`${project.title} (${project.slug})`, outputTone.title),
        );
        lines.push(toLine(project.description));
        lines.push(toLine(`Tech: ${project.stack.join(", ")}`));

        project.highlights.forEach((item) => lines.push(toLine(`- ${item}`)));

        if (project.github) {
          links.push(toLink(`${project.title} — GitHub`, project.github));
        }

        if (project.live) {
          links.push(toLink(`${project.title} — Live`, project.live));
        }

        lines.push(toLine(""));
      });

      suggestions.push(
        ...content.projects.map((project) => `open ${project.slug}`),
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
      const target = resolvePath(cwd, args[0] || ".");
      if (isDirectory(target)) {
        const items = getDirectoryItems(target);
        lines.push(
          toLine(
            items.length
              ? joinList(
                  items.map((item) =>
                    isDirectory(`${target}/${item}`) ? item + "/" : item,
                  ),
                )
              : "(empty directory)",
          ),
        );
      } else if (
        target &&
        getDirectoryItems(target.split("/").slice(0, -1).join("/")).includes(
          target.split("/").at(-1),
        )
      ) {
        lines.push(toLine(target.split("/").at(-1)));
      } else {
        lines.push(
          toLine(`ls: no such file or directory: ${args[0]}`, outputTone.error),
        );
      }
      break;
    }

    case "cd": {
      const target = resolvePath(cwd, args[0] || "~");
      if (isDirectory(target)) nextState.cwd = target;
      else
        lines.push(toLine(`cd: not a directory: ${args[0]}`, outputTone.error));
      break;
    }

    case "cat": {
      const raw = args[0];
      const target = ["resume", "resume.txt"].includes(raw)
        ? "~/resume.txt"
        : resolvePath(cwd, raw);
      const fileCommands = {
        "~/about/summary.txt": "about",
        "~/experience/timeline.txt": "experience",
        "~/education/degrees.txt": "education",
        "~/contact/links.txt": "contact",
      };
      if (!raw) {
        lines.push(
          toLine(
            "Usage: cat <file> (for example: cat resume)",
            outputTone.error,
          ),
        );
      } else if (target === "~/resume.txt") {
        links.push(toLink("Open resume.txt", content.resume.textUrl));
        lines.push(
          toLine("Opening text resume in a new tab...", outputTone.success),
        );
        meta.openInNewTab = content.resume.textUrl;
      } else if (Object.hasOwn(fileCommands, target)) {
        const entry = executeCommand(fileCommands[target], state).entries[0];
        lines.push(...entry.lines);
        links.push(...entry.links);
      } else if (
        target?.startsWith("~/projects/") &&
        target.endsWith("/README.txt") &&
        projectBySlug(target.split("/")[2])
      ) {
        const project = projectBySlug(target.split("/")[2]);
        lines.push(
          toLine(project.title, outputTone.title),
          toLine(project.description),
          toLine(`Tech: ${project.stack.join(", ")}`),
          ...project.highlights.map((item) => toLine(`- ${item}`)),
        );
        if (project.live) links.push(toLink("Live Demo", project.live));
        if (project.github) links.push(toLink("GitHub", project.github));
        suggestions.push(`open ${project.slug}`);
      } else {
        lines.push(
          toLine(
            `cat: ${raw}: ${isDirectory(target) ? "Is a directory" : "No such file"}`,
            outputTone.error,
          ),
        );
      }
      break;
    }

    case "open": {
      const slug = args[0];
      if (!slug) {
        lines.push(toLine("Usage: open <project-slug>", outputTone.error));
        suggestions.push(
          ...content.projects.map((project) => `open ${project.slug}`),
        );
        break;
      }

      const project = projectBySlug(slug);
      if (!project) {
        lines.push(
          toLine(
            `open: project not found: ${slug}. Use projects to list valid slugs.`,
            outputTone.error,
          ),
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
            `No public link is currently available for ${project.title}.`,
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
