---
name: bookings-empty-state-strategy
description: For TC-BOOK-003 (My Bookings empty state) on an account that may already have bookings, the chosen strategy is cancel-all-then-verify-empty, not a separate test user.
metadata:
  type: feedback
---

When the same test account (`manish123@gmail.com`) is used for both "view bookings" and "empty bookings" scenarios (TC-BOOK-001 requires it to have bookings, TC-BOOK-003 requires it to have none), do NOT introduce a second test account or skip-with-warning. Cancel every existing booking first as a precondition step, then assert the empty state.

**Why:** the user explicitly called out three valid options in the task brief — separate test user, cancel-all, or try/catch + skip — and the cancel-all strategy was selected because (a) no second credential exists in `test.ts`, (b) it keeps all three scenarios runnable with one command and one user, and (c) the cancel flow from TC-BOOK-002 already exists in the same file so the step is reused rather than duplicated.

**How to apply:** implement TC-BOOK-003's precondition as `When user ensures no bookings exist` which iterates over all `.booking-cards` Cancel buttons, clicks each, confirms the modal, and exits the loop when none remain (hard-cap 20 iterations as a safety net). The empty-state `Then` assertions come AFTER this and verify both the empty-state heading/container AND that `bookingCards.count() === 0`. If a card refuses to cancel, break out and let the assertions surface the real state — do not mask failures with a try/catch around the assertion.
