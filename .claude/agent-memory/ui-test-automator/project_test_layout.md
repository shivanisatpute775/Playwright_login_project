---
name: project-test-layout
description: Concrete shape of the EventHub Cucumber + Playwright + TS project (file layout, POM facade, custom world, cucumber.js globs, demo creds).
metadata:
  type: project
---

This repo is a Cucumber + Playwright (TypeScript) BDD test suite for the EventHub demo app at https://eventhub.rahulshettyacademy.com/.

Layout (must follow exactly when adding new tests):
- Feature files: `src/tests/features/*.feature` — loaded via `cucumber.js` glob `'src/tests/features/**/*.feature'`
- Step definitions: `src/tests/steps/*.ts` — auto-loaded via glob `'src/tests/steps/**/*.ts'`. There is no per-step registration; just declare new `Given/When/Then` functions and they are picked up. Today `test.ts` holds login + event-creation steps; new feature areas belong in their own file under `steps/`.
- POM locators: `src/tests/locators/*.ts`. There is **one** page class today — `TestPage` in `test.locator.ts` — that holds ALL locators for the app (login, events, future bookings, etc.). New pages should extend `TestPage` rather than spawn new classes unless there is strong reason. The facade `PageManager` in `POManager.ts` exposes it as `pageLocator.testPage`.
- Custom world: `src/tests/support/world.ts` extends Cucumber's `World` and exposes `browser`, `context`, `page`, and `pageLocator: PageManager`. Steps use `this: CustomWorld` for type-safety.
- Hooks: `src/tests/support/hooks.ts` launches Chromium with `headless: false`, fresh browser/context/page per scenario.

TS config (`tsconfig.json`): ES2020, CommonJS, `esModuleInterop: true`, no strict mode flags — so unused locals won't block compilation, but TS will surface "Hint" diagnostics. ts-node is registered via `--require-module ts-node/register` in `cucumber.js`.

Demo creds live only in `src/tests/steps/test.ts` (`Given user login into the app`): `manish123@gmail.com` / `Manish9@@`. Do NOT hardcode creds in new step files — reuse that step.

**Why:** the project consciously centralizes the POM class to avoid the proliferation of tiny page classes; new feature areas extend `TestPage` so `PageManager` stays a single facade. The `cucumber.js` glob is the registration mechanism — there's no manual wiring.

**How to apply:** when adding a feature area, create (1) a new `.feature` under `src/tests/features/`, (2) a new `*.ts` under `src/tests/steps/` (separate file from `test.ts`), (3) extend `TestPage` with the new locators, (4) update `PageManager` only if you genuinely need a separate page class. Reuse the `user login into the app` step via the Background; do not redefine it.

Related: [[bookings-empty-state-strategy]] for how to handle the TC-BOOK-003 empty-state precondition.
