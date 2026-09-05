import test from "node:test";
import assert from "node:assert/strict";
import { portfolioContent as content } from "../utils/data/portfolioContent.js";
import {
  executeCommand,
  getAutocompleteSuggestions as suggest,
  resolvePath,
  replaceCompletion,
  getCommonPrefix,
} from "../utils/terminal/commandEngine.js";
const state = { cwd: "~", themeId: "graphite" };
const run = (input, cwd = "~") => executeCommand(input, { ...state, cwd });
const text = (result) =>
  result.entries
    .flatMap((entry) => entry.lines.map((line) => line.text))
    .join("\n");
const error = (result) =>
  result.entries.some((entry) =>
    entry.lines.some((line) => line.tone === "error"),
  );

test("all registered commands and aliases execute; help accurately documents them", () => {
  const examples = {
    cd: "cd",
    cat: "cat resume",
    open: "open web-terminal",
    theme: "theme",
    sudo: "sudo hire-me",
    ls: "ls",
  };
  for (const item of content.commands.list) {
    const name = item.name.split(" ")[0];
    assert.equal(error(run(examples[name] || name)), false, name);
    assert.ok(text(run("help")).includes(item.name));
  }
  for (const [alias, command] of Object.entries(content.commands.aliases)) {
    const actual = run(`  ${alias.toUpperCase()}  `);
    const expected = run(command);
    assert.deepEqual(actual.nextState, expected.nextState);
    assert.deepEqual(actual.meta, expected.meta);
    assert.equal(text(actual), text(expected));
  }
  assert.equal(run("   ").entries.length, 0);
  for (const input of [
    "unknown",
    "constructor",
    "toString",
    "open foo extra",
    "cd projects extra",
    "theme paper extra",
    "help extra",
    "sudo",
    "cat",
  ])
    assert.ok(error(run(input)), input);
});

test("virtual paths normalize safely and every listed directory and file is usable", () => {
  let current = state;
  for (const [command, cwd] of [
    ["cd projects", "~/projects"],
    ["cd web-terminal", "~/projects/web-terminal"],
    ["cd ../..", "~"],
    ["cd ~/projects/", "~/projects"],
    ["cd ./../education", "~/education"],
    ["cd", "~"],
    ["cd /projects", "~/projects"],
  ]) {
    const result = executeCommand(command, current);
    assert.equal(result.nextState.cwd, cwd, command);
    current = result.nextState;
  }
  assert.equal(resolvePath("~", "../../../"), "~");
  for (const path of [
    "missing/..",
    "resume.txt/..",
    "projects/missing",
    "__proto__",
    "constructor",
  ]) {
    assert.ok(error(run(`cd ${path}`)), path);
    assert.equal(run(`cd ${path}`).nextState.cwd, "~");
  }
  for (const [dir, file, expected] of [
    ["about", "summary.txt", content.person.name],
    ["experience", "timeline.txt", content.experience[0].company],
    ["education", "degrees.txt", content.education[0].result],
    ["contact", "links.txt", content.person.email],
  ]) {
    assert.ok(text(run(`ls ~/${dir}`)).includes(file));
    assert.ok(text(run(`cat ${file}`, `~/${dir}`)).includes(expected));
  }
  assert.ok(error(run("cat projects")));
  assert.ok(error(run("ls missing")));
  assert.equal(text(run("ls ~/resume.txt")), "resume.txt");
  for (const project of content.projects) {
    assert.ok(text(run("ls", "~/projects")).includes(project.slug + "/"));
    assert.ok(
      text(run("cat README.txt", `~/projects/${project.slug}`)).includes(
        project.description,
      ),
    );
    assert.equal(
      run(`open ${project.slug}`).meta.openInNewTab,
      project.live || project.github,
    );
  }
});

test("completion follows current data, aliases, paths, spacing and argument boundaries", () => {
  assert.deepEqual(suggest("he"), ["help"]);
  assert.deepEqual(suggest("cd pro", "~"), ["projects"]);
  assert.deepEqual(suggest("cd ~/pro", "~/about"), ["~/projects"]);
  assert.deepEqual(suggest("cd ../pro", "~/about"), ["../projects"]);
  assert.deepEqual(
    suggest("cd ~/projects/", "~"),
    content.projects.map((p) => "~/projects/" + p.slug).sort(),
  );
  assert.deepEqual(
    suggest("open ", "~"),
    content.projects.map((p) => p.slug).sort(),
  );
  assert.deepEqual(suggest("theme "), content.themes.map((t) => t.id).sort());
  assert.deepEqual(suggest("theme pa"), ["paper"]);
  assert.deepEqual(suggest("sudo h"), ["hire-me"]);
  assert.deepEqual(suggest("open web-terminal "), []);
  assert.deepEqual(suggest("cat sum", "~/about"), ["summary.txt"]);
  assert.ok(!suggest("cd ", "~").includes("resume.txt"));
  assert.equal(
    replaceCompletion("  open   web", "web-terminal"),
    "open web-terminal",
  );
  assert.equal(getCommonPrefix(["projects", "pro"]), "pro");
  content.commands.aliases.o = "open";
  content.projects.push({ slug: "future-project" });
  try {
    assert.ok(suggest("o ").includes("future-project"));
    assert.ok(text(run("ls ~/projects")).includes("future-project"));
  } finally {
    delete content.commands.aliases.o;
    content.projects.pop();
  }
});

test("themes, resume resources, career mappings, contact destinations and clear", () => {
  for (const theme of content.themes)
    assert.equal(run(`theme ${theme.id}`).nextState.themeId, theme.id);
  assert.ok(error(run("theme missing")));
  assert.equal(run("theme missing").nextState.themeId, "graphite");
  assert.ok(text(run("theme")).includes("graphite (active)"));
  for (const input of [
    "cat resume",
    "cat resume.txt",
    "cat ~/resume.txt",
    "cat /resume.txt",
  ]) {
    assert.equal(
      run(input, "~/projects").meta.openInNewTab,
      content.resume.textUrl,
    );
  }
  assert.ok(
    run("resume").entries[0].links.some(
      (link) => link.download && link.href === content.resume.pdfUrl,
    ),
  );
  assert.equal(run("github").meta.openInNewTab, content.person.github);
  assert.equal(run("linkedin").meta.openInNewTab, content.person.linkedin);
  assert.equal(
    run("email").meta.openInNewTab,
    `mailto:${content.person.email}`,
  );
  for (const education of content.education)
    assert.ok(text(run("education")).includes(education.result));
  const experience = text(run("experience"));
  assert.ok(
    experience.indexOf(content.experience[0].company) <
      experience.indexOf(content.experience[1].company),
  );
  assert.ok(text(run("sudo hire-me")).includes(content.person.email));
  assert.ok(run("clear").meta.clear);
  assert.equal(
    run("open datasecure").meta.openInNewTab,
    "https://dataencryption.vercel.app/",
  );
});
