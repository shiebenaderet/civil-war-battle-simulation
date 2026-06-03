# "Join Class" Menu Item

Date: 2026-06-03
Status: Approved, pre-implementation

## Problem

Some students start Historical Mode without entering a class code, or lose
their connection to the teacher dashboard mid-session ("get out of their
class"). Today the only way to enter a code after starting is the top-of-screen
"no teacher" banner, which a student may have dismissed or never seen. They need
a reliable, always-available way to (re)join their class from the menu.

## Goal

Add a "Join Class" item to the settings menu that lets a student enter (or
correct) their class code at any time during Historical Mode, reusing the
existing class-code validation and dashboard-reporting logic. It must be purely
additive: a student who never uses it experiences no change, and no in-progress
save or flow is affected.

## Decisions (locked during brainstorming)

- **Entry style:** a browser `prompt()` for the code (matches the existing
  "Send Feedback" menu item, which also uses `prompt`; reuses existing
  validation). No new modal/markup beyond the menu button.
- **Visibility:** always present in the menu (so a student who joined the WRONG
  period can re-enter and switch). The label adapts to current state.
- **Historical-mode only:** class tracking is historical-mode-only (matching
  `reportProgressToDashboard`), so the item is shown only in historical mode,
  gated the same way other historical-only menu items are.

## Behavior

Clicking "Join Class":
1. `prompt()` for the code (e.g. "Enter your class code:").
2. Blank or cancel -> do nothing.
3. Lowercase + trim, validate via the existing
   `firebaseLeaderboard.periodForRoom(code)`.
4. **Valid** -> `firebaseLeaderboard.saveClassCode(code)`, set
   `gameState.period = period`, call `reportProgressToDashboard(false)` so the
   student appears on the dashboard immediately, and confirm (e.g.
   `alert("You're connected to Period " + period + "!")`).
5. **Invalid** -> inform (e.g.
   `alert("Code not recognized. Check with your teacher.")`).

This is the exact validate -> saveClassCode -> set period -> report sequence the
existing no-teacher banner save button already performs (`js/ui.js`,
`wireNoTeacherBanner`).

### Label / visibility logic

When the settings menu is opened (or on mode change), the item updates:
- Historical mode + no valid saved class code -> visible, label "Join Class".
- Historical mode + a valid saved class code (e.g. AMS-p1) -> visible, label
  "Class: Period <n> - change" (gives feedback + lets them switch/correct).
- Not historical mode -> hidden (`display:none`).

The visible-even-when-joined choice is deliberate: it lets a student who joined
the wrong period self-correct from the menu.

## Architecture

Reuses existing functions; adds no Firebase code and no new game state.

- `firebaseLeaderboard.periodForRoom(code)` - validate code -> period or null.
- `firebaseLeaderboard.saveClassCode(code)` - persist the code (localStorage).
- `firebaseLeaderboard.getSavedClassCode()` - read current code for the label.
- `reportProgressToDashboard(false)` (in js/app.js) - the existing gated write
  that surfaces the student on the dashboard.

### Files touched

- `index.html`: one new `<button class="settings-item" id="joinClassMenuBtn" ...>`
  in the settings menu, alongside the other items.
- `js/app.js`: wire the click handler (the prompt flow) and update the item's
  label/visibility when the menu opens / mode changes, mirroring how other
  historical-only items are toggled. A small helper may live in `js/ui.js`.

No CSS (reuses `.settings-item`). No `js/game.js` change. No save-shape change.
No Firebase rules change.

## Safety / non-impact on in-progress students (REQUIRED)

This change must not affect students currently playing:
- It only ADDS a menu item + handler; it modifies no existing handler or flow.
- It writes no new persisted field. `gameState.period` already exists and is
  set during normal start. The class code already lives in localStorage.
- `js/game.js` (gameState, save/load) is NOT touched -> saved games load
  unchanged.
- A student who never opens the menu or clicks the item sees zero difference.
- The implementation step set will explicitly verify game.js is untouched and
  that no existing menu handler was modified.

## Error handling / edge cases

- Firebase unavailable/offline: `saveClassCode` still persists locally;
  `reportProgressToDashboard` is internally gated (no-ops when Firebase is
  unavailable), so the click is harmless offline. The label still reflects the
  saved code.
- Wrong period entered: re-clicking the item lets them enter a different valid
  code, overwriting the saved one (and re-reporting).
- Cancel / empty input: no-op.
- Menu opened in Free-play or on non-historical screens: item hidden.

## Verification

- `node --check` on changed JS; HTML well-formed (balanced tags, single new id).
- Logic test of the validate/label helper: valid code -> period + "change"
  label; invalid -> rejected; blank -> no-op.
- Served-page check: the item exists in the menu markup.
- Manual: in Historical Mode, open menu -> "Join Class" -> enter AMS-p1 ->
  confirmation -> student appears on dashboard; re-open menu shows "Class:
  Period 1 - change"; entering a bad code shows the not-recognized message.
- Safety: `git diff` shows no change to js/game.js and no modification of
  existing menu-item handlers.

## Risk

Very low. Additive menu item reusing proven validation + reporting code; no save
or flow changes; explicit non-impact verification.
