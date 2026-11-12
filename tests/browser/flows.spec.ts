import { test, expect } from "@playwright/test";
test("homepage sample generator and honest waitlist error", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Make Every Connection More Meaningful.",
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Generate sample suggestions" })
    .click();
  await expect(page.getByText("A personal take on books")).toBeVisible();
  await expect(
    page.getByText("Sample demonstration · Uses templates, not live AI."),
  ).toBeVisible();
  await page.getByLabel("Your name", { exact: true }).fill("QA visitor");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("qa@example.com");
  await page.getByRole("button", { name: "Get early access" }).click();
  await expect(page.locator('.waitlist-form [role="alert"]')).toContainText(
    "not configured",
  );
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  expect(overflow).toBe(false);
});
test("create, edit, persist, and delete a person", async ({ page }) => {
  await page.goto("/dashboard/people?demo=1");
  await page.getByRole("button", { name: "Add a person" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name", { exact: true }).fill("Taylor QA");
  await dialog.getByLabel("Interests & preferences").fill("Painting, jazz");
  await dialog.getByLabel("Important date").fill("2027-05-01");
  await dialog.getByLabel("What’s the occasion?").fill("Birthday");
  await dialog
    .getByRole("button", { name: "Save this little thought" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Taylor QA", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Taylor QA", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Edit Taylor QA", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByLabel("Name", { exact: true })
    .fill("Taylor updated");
  await page.getByRole("button", { name: "Save this little thought" }).click();
  await expect(
    page.getByRole("heading", { name: "Taylor updated", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete Taylor updated", exact: true })
    .click();
  await page.getByRole("button", { name: "Confirm deletion" }).click();
  await expect(
    page.getByRole("heading", { name: "Taylor updated", exact: true }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});
test("create, complete, reopen, edit, and delete a reminder", async ({
  page,
}) => {
  await page.goto("/dashboard/reminders?demo=1");
  await page.getByRole("button", { name: "New reminder" }).click();
  let dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("What would you like to remember?")
    .fill("A little QA moment");
  await dialog.getByLabel("Date", { exact: true }).fill("2027-04-10");
  await dialog.getByLabel("Time", { exact: true }).fill("14:30");
  await dialog
    .getByRole("button", { name: "Save this little thought" })
    .click();
  await page
    .getByRole("button", { name: "Complete A little QA moment", exact: true })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Reopen A little QA moment",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Reopen A little QA moment", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Edit A little QA moment", exact: true })
    .click();
  dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("What would you like to remember?")
    .fill("Updated QA moment");
  await dialog
    .getByRole("button", { name: "Save this little thought" })
    .click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Updated QA moment" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete Updated QA moment", exact: true })
    .click();
  await page.getByRole("button", { name: "Confirm deletion" }).click();
  await expect(
    page.getByRole("heading", { name: "Updated QA moment" }),
  ).toHaveCount(0);
});
test("workspace routes, settings persistence, and account guard", async ({
  page,
}) => {
  for (const path of ["", "/ai-assistant", "/insights", "/settings"]) {
    await page.goto(`/dashboard${path}?demo=1`);
    await expect(page.locator(".demo-banner")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
  }
  await page.getByLabel("Your name", { exact: true }).fill("Morgan");
  await page.getByRole("button", { name: "Save preferences" }).click();
  await expect(page.getByRole("status")).toContainText("saved");
  await page.reload();
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue(
    "Morgan",
  );
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
  await expect(
    page.getByText("Accounts open when our backend is connected."),
  ).toBeVisible();
});
test("all public routes, metadata, mobile navigation, and screenshots", async ({
  page,
}, testInfo) => {
  for (const path of ["/privacy", "/terms", "/contact", "/login", "/signup"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(
      page
        .getByRole("heading", {
          level: path === "/login" || path === "/signup" ? 2 : 1,
        })
        .first(),
    ).toBeVisible();
  }
  for (const path of [
    "/robots.txt",
    "/sitemap.xml",
    "/manifest.webmanifest",
    "/icon.svg",
    "/opengraph-image",
  ]) {
    const response = await page.request.get(path);
    expect(response.status()).toBe(200);
  }
  await page.goto("/");
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Features", exact: true })
      .click();
    await expect(page).toHaveURL(/#features/);
  }
  await page.goto("/");
  await page.screenshot({
    path: `test-results/home-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.goto("/dashboard?demo=1");
  await expect(
    page.getByRole("heading", { name: /Hello, Alex/ }),
  ).toBeVisible();
  await page.screenshot({
    path: `test-results/workspace-${testInfo.project.name}.png`,
    fullPage: true,
  });
});
