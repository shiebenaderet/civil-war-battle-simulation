# Per-Period Room Codes — Design

**Date:** 2026-05-26
**Status:** Approved for implementation planning (revised after code audit)
**Author:** Shie Benaderet (with Claude)

## Problem

The teacher dashboard at `teacher.html` is showing students who are not in any of Shie's four classes. The current architecture has zero gating on dashboard writes: `app.js:reportProgressToDashboard()` (line 704) writes every historical-mode student's progress to `rooms/shie-class/progress/<studentId>` using the hardcoded `TEACHER_DASHBOARD_ROOM` constant from `js/firebase-leaderboard.js:13`. There is no student-facing input that controls this — the dashboard captures every student who plays historical mode on the public site.

The student-typed room code on the leaderboard join form (`ui.js:joinRoom`) is a SEPARATE feature for end-of-game class leaderboard scores. It does not gate the dashboard. The original problem framing conflated the two.

Browser-side identifiers (IP, geolocation, fingerprinting) were considered and rejected. IPs are not exposed to JavaScript, schools NAT all traffic through shared egress, and IP/geo APIs introduce privacy disclosure burden for a classroom with minors without reliably answering "is this my student."

The fix is to add a gate where none exists today: a class code that students type on the name entry form. The code both selects which period room their progress writes to, and acts as the secret that keeps strangers out.

## Goal

Replace the unguarded `'shie-class'` dashboard room with four per-period codes that:

1. Gate dashboard writes — no valid code, no write. Random strangers stop appearing.
2. Auto-tag each student's period (eliminating the unreliable self-reported period dropdown).
3. Live in a single constants block so future rotation is a trivial edit.
4. Don't break the class leaderboard feature (separate flow, untouched).
5. Don't block gameplay for students who haven't entered a code — they just don't appear on the dashboard, with a banner offering them a way in.

Plus: give the teacher dashboard password-gated controls to delete individual students or clear all entries, so Shie can clean up stragglers and reset between units without opening the Firebase console.

## Out of Scope

- Authentication, SSO, or any identity system beyond the code itself.
- Server-side validation of which student belongs to which period (the code IS the validation).
- Automatic cleanup of the old Firebase tree (done manually in the Firebase console after deploy).
- Changes to the class leaderboard feature (`ui.js:joinRoom`, `submitScore`, `loadLeaderboard`).
- Changes to handouts (verified by grep — none print any room code).

## Design

### Room codes

Four codes, one per period:

- Period 1: `AMS-p1`
- Period 2: `AMS-p2`
- Period 4: `AMS-p4`
- Period 5: `AMS-p5`

Stored lowercase. Existing helpers already normalize with `.toLowerCase().trim()`, so students typing `AMS-P1`, `ams-p1`, or `Ams-P1` all resolve to `ams-p1`.

### Single source of truth

Add a `ROOM_CODES` map at the top of `js/firebase-leaderboard.js`, replacing the current `TEACHER_DASHBOARD_ROOM` constant:

```js
var ROOM_CODES = {
    '1': 'ams-p1',
    '2': 'ams-p2',
    '4': 'ams-p4',
    '5': 'ams-p5'
};
```

Plus a reverse lookup helper exposed on the wrapper API:

```js
function periodForRoom(code) {
    var normalized = String(code || '').toLowerCase().trim();
    for (var p in ROOM_CODES) {
        if (ROOM_CODES[p] === normalized) return p;
    }
    return null;
}
```

Returns the period string `'1'/'2'/'4'/'5'` for a valid code, `null` otherwise.

Remove `TEACHER_DASHBOARD_ROOM` and `getTeacherDashboardRoom()`. Replace with:

- `getAllPeriodRooms()` → returns a shallow copy of `ROOM_CODES` (for the dashboard).
- `periodForRoom(code)` → exposed for `app.js` and `teacher.html`.

### Student-facing change: name entry form

Today, `index.html:405-414` has a period dropdown:

```html
<select id="periodSelect" class="name-field-input">
    <option value="">--</option>
    <option value="1">1st</option>
    ...
</select>
```

Replace with a text input:

```html
<input type="text" id="classCodeInput" class="name-field-input"
       placeholder="AMS-p1" maxlength="12" autocomplete="off"
       aria-label="Class code from your teacher">
```

The label changes from "Period" to "Class code". The dropdown markup is removed (not just hidden). The `getPeriodFromForm()` helper in `js/ui.js:184` is updated: it reads `classCodeInput`, calls `firebaseLeaderboard.periodForRoom(value)`, and returns the resulting period string (`'1'/'2'/'4'/'5'`) or `''` if the code is invalid or empty.

`gameState.period` semantics are unchanged — still a string period number or empty. The change is that it's now derived from a code lookup rather than a dropdown selection.

### Saved class code in localStorage

Add a new localStorage key `civilWarClassCode` so students don't retype the code every battle. The name entry form pre-fills from this on load. Helper functions in `firebase-leaderboard.js`:

```js
var CLASS_CODE_KEY = 'civilWarClassCode';

function getSavedClassCode() {
    try { return localStorage.getItem(CLASS_CODE_KEY) || ''; }
    catch (e) { return ''; }
}

function saveClassCode(code) {
    try { localStorage.setItem(CLASS_CODE_KEY, String(code || '').toLowerCase().trim()); }
    catch (e) {}
}
```

The existing `civilWarRoomCode` key (used by the leaderboard) is independent and untouched.

### Dashboard write path

`app.js:reportProgressToDashboard()` (around line 701-715) currently does:

```js
firebaseLeaderboard.writeProgress(
    firebaseLeaderboard.getTeacherDashboardRoom(),
    { ...progress... period: gameState.period || '', ... }
);
```

Changes to:

```js
function reportProgressToDashboard(finished) {
    if (gameState.mode !== 'historical') return;
    if (typeof firebaseLeaderboard === 'undefined' || !firebaseLeaderboard.isAvailable()) return;

    var savedCode = firebaseLeaderboard.getSavedClassCode();
    var period = firebaseLeaderboard.periodForRoom(savedCode);
    if (!period) return; // No valid code → silently skip. Banner UX nudges student to enter one.

    firebaseLeaderboard.writeProgress(
        savedCode,
        {
            name: gameState.studentName || 'Student',
            period: period,
            currentBattle: gameState.currentBattle || 0,
            totalBattles: (typeof battles !== 'undefined' ? battles.length : 13),
            side: gameState.side || '',
            finished: !!finished
        }
    );
}
```

Note: `gameState.period` is no longer the source of truth for the write — `periodForRoom(savedCode)` is. They should match (the form sets `gameState.period` from the same lookup), but if they ever diverge, the code wins.

### "Your teacher can't see you" banner

In historical mode, if the student has no valid class code saved, show a non-blocking banner at the top of the game UI:

> ⚠ Your teacher won't see your progress. [Enter class code]

Clicking the link opens a small inline form (modal or expanding panel) with a single text input and "Save" / "Skip" buttons. On save, validate via `periodForRoom`, store via `saveClassCode`, dismiss the banner, and call `reportProgressToDashboard(false)` to send the current state. On skip, dismiss for the session (sessionStorage flag) — don't nag.

Banner trigger: appears on first battle render in historical mode when `getSavedClassCode()` returns no valid code. Disappears once a valid code is saved.

Banner location: top of the game area, above the battle UI. Use existing toast/banner styling if one exists; otherwise a simple yellow bar consistent with the app's visual language.

### Teacher dashboard

`teacher.html` currently calls `firebaseLeaderboard.subscribeToProgress(room, callback)` with a single room from `getTeacherDashboardRoom()` (line 252).

Change: subscribe to all four period rooms in parallel and merge entries into one in-memory list. Each entry's `period` field is overridden by the room it came from (defense in depth — even if a write somehow lands with a wrong period field, the dashboard trusts the room path).

Implementation sketch:

```js
var rooms = firebaseLeaderboard.getAllPeriodRooms(); // {'1':'ams-p1', ...}
var perRoom = {}; // period -> entries[]

Object.keys(rooms).forEach(function(period) {
    firebaseLeaderboard.subscribeToProgress(rooms[period], function(entries, err) {
        if (err) { setStatus(err, true); return; }
        perRoom[period] = (entries || []).map(function(e) {
            e.period = period;
            return e;
        });
        state.entries = Object.keys(perRoom).reduce(function(acc, p) {
            return acc.concat(perRoom[p]);
        }, []);
        state.lastUpdate = Date.now();
        render();
        setStatus('Updated ' + new Date().toLocaleTimeString() + ' · ' + state.entries.length + ' student' + (state.entries.length === 1 ? '' : 's'));
    });
});
```

The existing period filter pills, sort modes, and group views need no changes. `periodKey()` at `teacher.html:309` already handles `'1'/'2'/'4'/'5'` correctly. The "No period" filter pill now always returns zero (since period is always derived from a known room) — leave it visible as a no-op rather than removing it.

### Teacher dashboard: delete + clear controls

Password-gate the entire dashboard on page load. On `init()` in `teacher.html`, before subscribing to rooms:

```js
var DASHBOARD_PASSWORD = 'amsmustangs';
var SESSION_AUTH_KEY = 'teacherDashboardAuthed';

function requireAuth() {
    if (sessionStorage.getItem(SESSION_AUTH_KEY) === '1') return true;
    var entered = window.prompt('Teacher password:');
    if (entered === DASHBOARD_PASSWORD) {
        sessionStorage.setItem(SESSION_AUTH_KEY, '1');
        return true;
    }
    var deny = document.createElement('div');
    deny.style.cssText = 'padding:40px;text-align:center;font-family:sans-serif';
    deny.textContent = 'Access denied.';
    document.body.replaceChildren(deny);
    return false;
}
```

(Using `replaceChildren` + `textContent` instead of `innerHTML` to avoid normalizing an unsafe pattern in our codebase.)

`init()` calls `requireAuth()` first; bails if false. Session-scoped, so closing the tab clears it. Honest about its limits: the password is in client source. This is friction against curious students, not real authentication.

**Per-student delete:** Each `student-chip` in `chip()` (`teacher.html:330`) gets a trailing `✕` button. Clicking it confirms ("Delete <Name> from dashboard?"), then calls a new wrapper method `firebaseLeaderboard.deleteProgressEntry(roomCode, studentId, callback)` which does `db.ref('rooms/<code>/progress/<studentId>').remove()`. Each entry already carries `studentId` (set in `subscribeToProgress` at line 184) and now also carries the source `period`, so the dashboard knows which room to target. The live subscription removes the chip automatically when the delete lands.

**Clear all:** New button in the controls row (next to Refresh): "Clear all". On click, confirms with a strong message ("Delete ALL student progress from ALL four periods? This cannot be undone.") and on confirm calls a new wrapper method `firebaseLeaderboard.clearAllProgress(roomCodes, callback)` which does `db.ref('rooms/<code>/progress').remove()` for each of the four codes in parallel. Live subscriptions empty out the dashboard automatically.

Neither control is shown if `requireAuth()` failed (whole page is replaced with "Access denied"), so no extra per-button auth check is needed.

### Firebase wrapper API summary

In `js/firebase-leaderboard.js`:

| Change | Detail |
|---|---|
| Remove | `TEACHER_DASHBOARD_ROOM` constant (line 13) |
| Remove | `getTeacherDashboardRoom` from exports (line 236) |
| Add | `ROOM_CODES` constant block |
| Add | `CLASS_CODE_KEY` constant |
| Add | `periodForRoom(code)` |
| Add | `getAllPeriodRooms()` |
| Add | `getSavedClassCode()` |
| Add | `saveClassCode(code)` |
| Add | `deleteProgressEntry(roomCode, studentId, cb)` |
| Add | `clearAllProgress(roomCodes, cb)` |

`validateRoom`, `submitScore`, `writeProgress`, `subscribeToProgress`, `loadLeaderboard` are all unchanged in signature. The leaderboard feature continues to use `rooms/<code>` paths against Firebase-validated rooms, independent of the dashboard.

### Old room cleanup

After deploy, Shie deletes `rooms/shie-class/progress` from the Firebase console manually. (Leaving `rooms/shie-class/scores` is fine — old leaderboard entries are harmless.)

Anyone with a cached browser tab still pointed at `'shie-class'` will stop writing to it the moment the new code is deployed, because `reportProgressToDashboard` no longer references the old constant.

## Data Flow

**Student starts historical mode:**

1. Student opens `index.html`, picks historical mode, sees name entry form.
2. Pre-fill: First name, last initial, and class code text input pre-fill from localStorage if available.
3. Student types `AMS-p2` (or it's pre-filled). Picks side. Clicks Begin.
4. `startWithSide()` in `app.js:680` reads `gameState.studentName` and `gameState.period`.
5. `getPeriodFromForm()` calls `periodForRoom('ams-p2')` → `'2'`. Returns `'2'`. Saves code via `saveClassCode('ams-p2')`.
6. `reportProgressToDashboard(false)` fires:
   - Reads `getSavedClassCode()` → `'ams-p2'`.
   - Calls `periodForRoom('ams-p2')` → `'2'`. Valid.
   - Writes to `rooms/ams-p2/progress/<studentId>` with period `'2'`.

**Student without a code:**

1. Student picks historical mode, leaves class code blank, clicks Begin.
2. `getPeriodFromForm()` returns `''`. `gameState.period = ''`.
3. `reportProgressToDashboard()` fires: `periodForRoom('')` → `null`. Skip write.
4. First battle renders. Banner appears: "Your teacher won't see your progress. [Enter class code]"
5. Student either enters a valid code (dashboard catches up from current state) or skips (banner dismissed for session).

**Teacher dashboard loads:**

1. `teacher.html` calls `getAllPeriodRooms()` → `{'1':'ams-p1', ..., '5':'ams-p5'}`.
2. Subscribes to all four. As each callback fires, merges entries with `period` stamped from source room.
3. Renders with existing battle/period/name sort modes.

## Error Handling

- **Invalid code in form:** `periodForRoom` returns `null`. `getPeriodFromForm()` returns `''`. Treated identically to "no code entered" — banner appears, no write.
- **Firebase unavailable for one room but not others:** Dashboard shows entries from the rooms that succeeded. Status line surfaces the failure once; doesn't spam per-room errors.
- **Firebase entirely unavailable:** Existing offline-fallback path in `teacher.html:255` still works.
- **Old `civilWarPeriod` localStorage from earlier versions:** If present, ignored. The new `civilWarClassCode` key is independent. No migration needed — students just retype once.

## Testing

Manual verification on a Chromebook (Shie's classroom environment):

1. Open `index.html`, pick historical mode, leave class code blank → confirm banner appears on first battle, no dashboard write.
2. Enter `ams-p1` in banner's inline form → confirm banner dismisses, dashboard shows student in Period 1.
3. Reload page → confirm code pre-fills and dashboard write happens silently.
4. Try `AMS-P2` (mixed case) → confirm Period 2 lands correctly.
5. Try `shie-class` (old code) → confirm rejected, banner stays.
6. Try `garbage` → confirm rejected, banner stays.
7. Open `teacher.html` → confirm all four periods' students appear, filter pills work, "No period" pill shows zero.

No automated tests. Static site, manual classroom QA.

## Communication of New Codes

Out of scope for the code change. Shie distributes the codes out-of-band (whiteboard, Google Classroom post, slides). Handouts do not print any room code (verified by grep of `handouts/`), so they need no update.

## Future Rotation

To rotate codes (e.g. start of next school year, or after a code leaks):

1. Edit the four strings in the `ROOM_CODES` constant in `js/firebase-leaderboard.js`.
2. Deploy.
3. Delete the old `rooms/<oldcode>/progress` trees from the Firebase console.
4. Tell students the new codes.

If only one period's code leaks, edit one string and delete one tree. Other periods continue uninterrupted.

## Risks

- **Student has `civilWarClassCode` for a code that was rotated:** They'll silently write to a now-empty room. Dashboard won't show them. Banner won't fire because they have a "saved code." Mitigation: `getPeriodForCode` returns `null` for any code not in the current `ROOM_CODES`, and `reportProgressToDashboard` skips the write. But the banner relies on `getSavedClassCode()` being empty. **Fix:** banner condition is `periodForRoom(getSavedClassCode()) === null`, not `getSavedClassCode() === ''`. Documented as a plan step.
- **Banner UX feels naggy:** Mitigated by sessionStorage "skip for session" flag. Reappears next browser session, which is intended — start of class is when teachers most need accurate dashboards.
- **Class leaderboard accidentally affected:** The leaderboard uses `civilWarRoomCode` and `rooms/<code>/scores`. These are completely independent from `civilWarClassCode` and `rooms/<code>/progress`. Grep verifies no shared code paths.
