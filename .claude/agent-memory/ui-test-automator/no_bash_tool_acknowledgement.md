---
name: no-bash-tool-acknowledgement
description: This environment has no Bash tool — Playwright/cucumber commands can only be triggered indirectly via the mcp__ide__executeCode kernel, and that kernel is often unavailable. State the blocker honestly rather than fabricating run output.
metadata:
  type: feedback
---

In the current Claude Code configuration this project is operated from, the standard tool set does NOT include a Bash/Shell tool. The only execution path is the Jupyter kernel exposed by `mcp__ide__executeCode`, and that kernel reports "No active notebook editor found" in this session even though the workspace is not a notebook.

**Why:** honest reporting matters more than appearing green. Past incidents in other repos where the agent silently skipped the run and then claimed "all tests pass" led to user-visible production breakage when the suite was actually broken. The task brief explicitly instructs: "If any step fails because the actual UI differs from what the JSON test cases assume ... REPORT THE FAILURE clearly with the actual vs expected behavior. Do not paper over failures."

**How to apply:**
1. Never invent pass/fail counts. If the only execution channel is unreachable, say so explicitly.
2. Static verification that IS available: `mcp__ide__getDiagnostics` for TS type-checking (use it to catch syntax/import errors before declaring "done").
3. When selector verification against the live app is impossible (e.g. WebFetch is gated behind authentication), explicitly mark each locator as best-guess and list which patterns were assumed (e.g. `.booking-card`, `#nav-bookings`, `.modal.show`).
4. Always finish with a "selectors that should be manually verified on the live site" section so the user can audit the guesses.
