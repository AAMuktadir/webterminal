import { test, expect } from "@playwright/test";
import { portfolioContent as content } from "../utils/data/portfolioContent.js";
const input = (page) =>
  page.getByRole("textbox", { name: "Terminal input", exact: true });
const run = async (page, command) => {
  await input(page).fill(command);
  await input(page).press("Enter");
};
const latest = (page) => page.locator(".terminal-entry").last();

test("acceptance sequence, autocomplete, links, history and keyboard escape", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(input(page)).toBeFocused();
  await input(page).fill("he");
  await input(page).press("Tab");
  await expect(input(page)).toHaveValue("help");
  await input(page).press("Enter");
  await expect(latest(page)).toContainText("Available commands");
  for (const command of [
    "about",
    "skills",
    "experience",
    "education",
    "achievements",
    "projects",
    "ls",
  ]) {
    await run(page, command);
    await expect(latest(page).locator(".terminal-line-error")).toHaveCount(0);
  }
  await input(page).fill("cd pro");
  await input(page).press("Tab");
  await expect(input(page)).toHaveValue("cd projects");
  await input(page).press("Enter");
  await run(page, "ls");
  for (const project of content.projects)
    await expect(latest(page)).toContainText(project.slug);
  // Capture browser-open destinations without contacting third-party sites.
  await page.evaluate(() => {
    window.opened = [];
    window.open = (...args) => {
      window.opened.push(args);
      return null;
    };
  });
  await run(page, "open web-terminal");
  await expect
    .poll(() => page.evaluate(() => window.opened.at(-1)[0]))
    .toBe(content.projects[0].live);
  for (const command of ["cd ..", "cd ~/projects", "cd invalid"])
    await run(page, command);
  await expect(latest(page)).toContainText("not a directory");
  await run(page, "cat resume");
  await expect
    .poll(() => page.evaluate(() => window.opened.at(-1)[0]))
    .toBe("/resume.txt");
  await run(page, "resume");
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download latest PDF resume" }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("Abdullah-Al-Muktadir.pdf");
  expect(await download.failure()).toBeNull();
  for (const theme of content.themes) {
    await run(page, `theme ${theme.id}`);
    await run(page, "theme");
    await expect(latest(page)).toContainText(theme.id + " (active)");
  }
  await run(page, "theme invalid");
  await expect(latest(page)).toContainText("unknown theme");
  await input(page).fill("my draft");
  await input(page).press("ArrowUp");
  await expect(input(page)).toHaveValue("theme invalid");
  await input(page).press("ArrowUp");
  await input(page).press("ArrowDown");
  await input(page).press("ArrowDown");
  await expect(input(page)).toHaveValue("my draft");
  await input(page).press("ArrowDown");
  await expect(input(page)).toHaveValue("my draft");
  for (const command of [
    "github",
    "linkedin",
    "contact",
    "socials",
    "whoami",
    "date",
    "sudo hire-me",
  ]) {
    await run(page, command);
    await expect(latest(page).locator(".terminal-line-error")).toHaveCount(0);
  }
  expect(
    await page.evaluate(() => window.opened.map((args) => args[0])),
  ).toContain(content.person.linkedin);
  await run(page, "clear");
  await expect(page.locator(".terminal-entry")).toHaveCount(0);
  await input(page).press("ArrowUp");
  await expect(input(page)).toHaveValue("clear");
  await run(page, "not-a-command");
  await expect(latest(page)).toContainText("command not found");
  await input(page).fill("open ");
  await input(page).press("Tab");
  await latest(page)
    .getByRole("button", { name: "open datasecure", exact: true })
    .click();
  await expect(input(page)).toHaveValue("open datasecure");
  await expect(input(page)).toBeFocused();
  await input(page).press("Enter");
  await expect
    .poll(() => page.evaluate(() => window.opened.at(-1)[0]))
    .toBe(content.projects[1].live);
  await input(page).fill("theme pa");
  await input(page).press("Tab");
  await expect(input(page)).toHaveValue("theme paper");
  await input(page).press("Shift+Tab");
  await expect(input(page)).not.toBeFocused();
  expect(errors).toEqual([]);
});

test("settings toggle, keyboard focus, synchronized themes and display controls", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open settings" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("button", { name: "Graphite" })).toBeFocused();
  await dialog.getByRole("button", { name: "Paper" }).click();
  await expect(page.locator(".terminal-title")).toContainText("Paper");
  await expect(dialog.getByRole("button", { name: "Paper" })).toBeFocused();
  await dialog
    .getByRole("slider", { name: "Terminal transparency" })
    .fill("45");
  await dialog.getByRole("slider", { name: "Terminal brightness" }).fill("70");
  await dialog.getByRole("button", { name: "Increase font size" }).click();
  await expect(page.locator(".terminal-shell")).toHaveCSS(
    "--terminal-font-size",
    "15px",
  );
  await expect(page.locator(".terminal-shell")).toHaveCSS(
    "--terminal-transparency",
    "0.45",
  );
  await expect(page.locator(".terminal-shell")).toHaveCSS(
    "filter",
    "brightness(0.7)",
  );
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await run(page, "theme classic");
  await trigger.click();
  await expect(dialog.getByRole("button", { name: "Classic" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await input(page).click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("drag, resize, keyboard resize, fullscreen restore and viewport changes", async ({
  page,
}) => {
  await page.goto("/");
  const win = page.locator(".terminal-window");
  await expect(win).toHaveClass(/is-visible/);
  const original = await win.boundingBox();
  const header = await page.locator(".terminal-header").boundingBox();
  await page.mouse.move(header.x + header.width / 2, header.y + 20);
  await page.mouse.down();
  await page.mouse.move(2000, 2000, { steps: 5 });
  await page.mouse.up();
  let rect = await win.boundingBox();
  expect(rect.x).not.toBe(original.x);
  expect(rect.x + rect.width).toBeLessThanOrEqual(1280);
  expect(rect.y + rect.height).toBeLessThanOrEqual(900);
  const handle = page.getByRole("button", { name: "Resize terminal window" });
  await handle.focus();
  await handle.press("ArrowLeft");
  await expect
    .poll(async () => (await win.boundingBox()).width)
    .toBeLessThan(rect.width);
  const resize = await handle.boundingBox();
  await page.mouse.move(resize.x + 8, resize.y + 8);
  await page.mouse.down();
  await page.mouse.move(resize.x - 100, resize.y - 100, { steps: 5 });
  await page.mouse.up();
  await expect
    .poll(async () => (await win.boundingBox()).width)
    .toBeLessThan(rect.width - 50);
  rect = await win.boundingBox();
  await page.getByRole("button", { name: "Enter app fullscreen" }).click();
  await expect(win).toHaveCSS("width", "1280px");
  await expect(handle).toHaveCount(0);
  await page.getByRole("button", { name: "Exit app fullscreen" }).click();
  await expect
    .poll(async () => Math.round((await win.boundingBox()).width))
    .toBe(Math.round(rect.width));
  await page.setViewportSize({ width: 800, height: 420 });
  await expect
    .poll(async () => {
      const r = await win.boundingBox();
      return (
        r.x >= 0 && r.y >= 0 && r.x + r.width <= 800 && r.y + r.height <= 420
      );
    })
    .toBe(true);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(handle).toHaveCount(0);
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(handle).toHaveCount(1);
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`readable content and settings at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    for (const command of [
      "help",
      "projects",
      "experience",
      "cd ~/projects/overseas-management",
    ])
      await run(page, command);
    const trigger = page.getByRole("button", { name: "Open settings" });
    await trigger.click();
    for (let i = 0; i < 8; i++)
      await page.getByRole("button", { name: "Increase font size" }).click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.locator(".settings-panel")).toHaveCSS("opacity", "0");
    await expect(page.locator(".terminal-line").first()).toHaveCSS(
      "font-size",
      "22px",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .locator(".terminal-output")
        .evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
    const bounds = await input(page).boundingBox();
    expect(bounds.width).toBeGreaterThan(80);
    const winBounds = await page.locator(".terminal-window").boundingBox();
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(
      winBounds.y + winBounds.height,
    );
    expect(
      await input(page).evaluate((el) => {
        const r = el.getBoundingClientRect();
        return (
          document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) ===
          el
        );
      }),
    ).toBe(true);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    await page.screenshot({ path: `test-results/layout-${width}.png` });
  });
}

test("current resume resources resolve and old PDF is not publicly served", async ({
  request,
}) => {
  const txt = await request.get("/resume.txt");
  expect(txt.status()).toBe(200);
  expect(await txt.text()).toContain("March 2026");
  const pdf = await request.get(content.resume.pdfUrl);
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  expect(
    (await request.get("/file/Abdullah-Al-Muktadir-2025.pdf")).status(),
  ).toBe(404);
});

test("real resume tab, clipboard success/failure and Ctrl+L history", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const popupEvent = context.waitForEvent("page");
  await run(page, "cat resume");
  const popup = await popupEvent;
  await popup.waitForLoadState();
  expect(popup.url()).toBe("http://localhost:3000/resume.txt");
  await expect(popup.locator("body")).toContainText("Abdullah Al Muktadir");
  await popup.close();
  await run(page, "contact");
  await latest(page)
    .getByRole("button", { name: "Copy line text" })
    .first()
    .click();
  await expect(page.getByRole("status")).toHaveText("Copied to clipboard");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    content.person.email,
  );
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new Error("Clipboard unavailable");
    };
  });
  await latest(page)
    .getByRole("button", { name: "Copy line text" })
    .first()
    .click();
  await expect(page.getByRole("status")).toHaveText("Copy failed");
  await input(page).focus();
  await input(page).press("Control+l");
  await expect(page.locator(".terminal-entry")).toHaveCount(0);
  await input(page).press("ArrowUp");
  await expect(input(page)).toHaveValue("contact");
});
