# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Common Commands

**Dependency Management**
- Install all dependencies (including Playwright browsers):
  ```bash
  npm ci
  npx playwright install --with-deps
  ```
- `package.json` has no `scripts` — invoke binaries directly via `npx`.

**Running Tests**
- **Cucumber (Gherkin) tests** — the primary suite for this project. Step definitions are in TypeScript and `ts-node` is registered via `cucumber.js`:
  ```bash
  npx cucumber-js                                      # run all features
  npx cucumber-js src/tests/features/<file>.feature    # one feature file
  npx cucumber-js --tags "@test"                       # one scenario by tag
  ```
- **Playwright test runner** — for `.spec.ts` files under `src/tests`:
  ```bash
  npx playwright test
  npx playwright test path/to/file.spec.ts
  npx playwright test --grep "test name"
  ```
  Note: `playwright.config.ts` is pinned to an absolute `testDir` (`/Users/manishkumar/AI Projects/playwright/src/tests`) — paths passed on the CLI must be absolute to be matched.

**Debugging / Development**
- Add a `@debug` tag to a scenario in the `.feature` file, then run:
  ```bash
  npx cucumber-js --tags "@debug"
  ```
- The Cucumber `Before` hook in `src/tests/support/hooks.ts` launches Chromium with `headless: false` — debugging runs visibly by default. To override for Playwright runner tests, use `npx playwright test --headed`.

**Reports**
- HTML Playwright report is written to `playwright-report/`.
- Cucumber JSON report is written to `reports/cucumber-report.json` (configured in `cucumber.js`).

**CI / GitHub Actions**
- `.github/workflows/playwright.yml` runs on push/PR to `main`/`master`: `npm ci` → `npx playwright install --with-deps` → `npx playwright test`. The CI step only runs the Playwright runner, not Cucumber.

---

## High‑Level Architecture

- **Two test frameworks coexist**: **Cucumber** for BDD-style Gherkin features (`src/tests/features/*.feature`) and **Playwright Test** for any `.spec.ts` files. The `playwright.config.ts` runner ignores `.feature` files; Cucumber ignores `.spec.ts` files. Step code is shared between them — it uses `@playwright/test`'s `Locator` / `expect` APIs.
- **TypeScript + ts-node**: `cucumber.js` registers `ts-node/register` so step definitions, hooks, and the custom world run as TypeScript without a separate build step. `tsconfig.json` targets ES2020 with CommonJS modules.
- **Page Object Model (POM)**:
  - `src/tests/locators/test.locator.ts` defines a `TestPage` class encapsulating locators for the EventHub login + Events tab flows (email, password, sign in, event list, add-event form fields, etc.).
  - `src/tests/locators/POManager.ts` provides a `PageManager` facade that lazy-instantiates page objects — access via `this.pageLocator.testPage`.
- **Custom World** (`src/tests/support/world.ts`): Extends Cucumber's `World` with `browser`, `context`, `page`, and `pageLocator: PageManager`. The `setWorldConstructor(CustomWorld)` call binds it to every scenario.
- **Hooks** (`src/tests/support/hooks.ts`): `Before` launches a new Chromium browser/context/page and wires up the `PageManager`; `After` closes them. This means **each scenario gets a fresh browser** — there is no shared state across scenarios.
- **Application Under Test**: EventHub at `https://eventhub.rahulshettyacademy.com/`. Step definitions hardcode the base URL and the demo credentials (`manish123@gmail.com` / `Manish9@@`) — see `src/tests/steps/test.ts`.

---

## Important Files & Entry Points

- `cucumber.js` — Cucumber CLI config: registers `ts-node`, points to step/support globs, and to `src/tests/features/**/*.feature`. Wires the JSON report to `reports/cucumber-report.json`.
- `playwright.config.ts` — Playwright runner config. Single Chromium project, HTML reporter, `trace: 'on-first-retry'`. `testDir` is an absolute path.
- `src/tests/steps/test.ts` — example step definitions covering login, navigation, and add-event flow. Reuse these step phrases when adding new scenarios.
- `src/tests/features/test.feature` — only feature file in the repo so far. Add new `.feature` files alongside it.
- `src/tests/locators/POManager.ts` and `src/tests/locators/test.locator.ts` — extend these to add new page objects/locators.
- `src/tests/support/world.ts` and `src/tests/support/hooks.ts` — extend the custom world for cross-scenario state; modify hooks with care (they run for every scenario).
- `.github/workflows/playwright.yml` — CI pipeline. Note: it does **not** run Cucumber.

---

## MCP Servers

- The project ships with a Playwright MCP server declared in `.mcp.json` at the repo root:
  ```json
  { "mcpServers": { "playwright": { "command": "npx", "args": ["-y", "@playwright/mcp"] } } }
  ```
  It launches a real Chromium via `npx @playwright/mcp` and exposes browser tools (`mcp__playwright__*` — navigate, snapshot, click, fill, etc.) for ad‑hoc exploration of the EventHub app. **Prefer these tools over WebFetch** when investigating live UI state, locating selectors, or verifying flows on `https://eventhub.rahulshettyacademy.com/`. The server is project‑scoped — on first use in a session, Claude Code will prompt for approval before connecting.

## Conventions Specific to This Repo

- **Adding a Cucumber scenario**: Create or extend a `.feature` file in `src/tests/features/`, write matching step phrases in `src/tests/steps/`, and add any new locators to `TestPage` (and expose them via `PageManager` if you add a new page object). Step phrases must match the wording in the feature file exactly.
- **Adding a new page object**: Create a new locator class in `src/tests/locators/`, add a private cached field + lazy getter on `PageManager`, then access it from steps as `this.pageLocator.<yourPage>`.
- **Browser isolation is automatic** — do not assume state persists between scenarios.
- **Hardcoded test data**: Credentials and the base URL are currently inline in `src/tests/steps/test.ts`. If you add more environments or credentials, refactor to a config module rather than spreading hardcoded values.
- **Debugging steps**: Insert `debugger;` inside a step definition and re-run with the `@debug` tag, or attach VS Code's debugger to the running Cucumber/Playwright process.
