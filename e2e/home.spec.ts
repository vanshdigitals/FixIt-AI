import { test, expect } from "@playwright/test";
test("sample diff completes a demo review", async ({ page }) => { await page.goto("/"); await page.getByRole("button", {name:"Review & Fix"}).click(); await expect(page.getByText("Verdict:")).toBeVisible(); await expect(page.getByText("SQL injection in login")).toBeVisible(); });
