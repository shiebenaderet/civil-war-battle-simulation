# Per-Period Room Codes — Design

**Date:** 2026-05-26
**Status:** Approved for implementation planning
**Author:** Shie Benaderet (with Claude)

## Problem

The teacher dashboard at `teacher.html` is showing students who are not in any of Shie's four classes. The current architecture has a single hardcoded room code (`TEACHER_DASHBOARD_ROOM = 'shie-class'` at `js/firebase-leaderboard.js:13`) that all students type into the join form on `index.html`. Because the site is public (GitHub Pages) and the code is a constant in a public repo, anyone who finds the string can join the room and write progress records into the same Firebase tree the dashboard subscribes to.

Browser-side identifiers (IP, geolocation, fingerprinting) were considered and rejected. IPs are not exposed to JavaScript, schools NAT all traffic through shared egress, and IP/geo APIs introduce privacy disclosure burden for a classroom with minors without reliably answering "is this my student."

The room code itself is the identifier. It is just too leaky in its current form.

## Goal

Replace the single shared room code with four per-period codes that:

1. Are not guessable from the public site.
2. Auto-tag each student's period (eliminating the unreliable self-reported period field).
3. Live in a single constants block so future rotation is a trivial edit.
4. Require no changes to handouts (which do not print the code).

## Out of Scope

- Authentication, SSO, or any identity system beyond the code itself.
- Server-side validation of which student belongs to which period.
- Automatic cleanup of the old Firebase tree (done manually in the Firebase console after deploy).
- Removing the period field from the data model. It stays; it just becomes derived from the room code instead of user input.

## Design

### Room codes

Four codes, one per period:

- Period 1: `AMS-p1`
- Period 2: `AMS-p2`
- Period 4: `AMS-p4`
- Period 5: `AMS-p5`

Stored lowercase in Firebase (existing `validateRoom` at `js/firebase-leaderboard.js:71` already calls `.toLowerCase().trim()`, so students typing `AMS-P1`, `ams-p1`, or `Ams-P1` all normalize to `ams-p1`).

### Single source of truth

Add a `ROOM_CODES` constant block at the top of `js/firebase-leaderboard.js`, replacing the current single `TEACHER_DASHBOARD_ROOM` constant:

```js
var ROOM_CODES = {
    '1': 'ams-p1',
    '2': 'ams-p2',
    '4': 'ams-p4',
    '5': 'ams-p5'
};
```

Plus a reverse lookup helper:

```js
function periodForRoom(code) {
    var normalized = String(code || '').toLowerCase().trim();
    for (var p in ROOM_CODES) {
        if (ROOM_CODES[p] === normalized) return p;
    }
    return null;
}
```

`validateRoom` is updated to accept a code only if `periodForRoom(code)` returns a known period. No other codes work. The old `'shie-class'` string is removed.

### Student join flow

`joinRoom()` in `js/ui.js:2655` reads the input, calls `validateRoom`, and on success calls `showJoinedRoom`. No UI restructuring needed. The validation in `validateRoom` now rejects anything not in `ROOM_CODES`.

After a successful join, the period is derived from the code via `periodForRoom()` and stored alongside the room code in `localStorage` (new key `civilWarPeriod`). Every subsequent `writeProgress()` call stamps this derived period onto the progress record. The student never picks their period.

### Period selector in join form

The period selector currently visible in the join form on `index.html` becomes redundant. Hide it via CSS (`display: none`) rather than removing the markup. Keeps the change minimal and reversible. The underlying `period` field in the data model and on progress records is untouched. it just gets its value from the code lookup.

### Teacher dashboard

`teacher.html` currently calls `firebaseLeaderboard.subscribeToProgress(room, callback)` with a single room string from `getTeacherDashboardRoom()`.

Change: dashboard subscribes to all four period rooms in parallel and merges entries into a single in-memory list. Each entry gets its `period` field stamped from the room it came from (overriding whatever the student record claims, which should already match).

Implementation sketch:

```js
var rooms = firebaseLeaderboard.getAllPeriodRooms(); // returns ROOM_CODES
var merged = {};

Object.keys(rooms).forEach(function(period) {
    var code = rooms[period];
    firebaseLeaderboard.subscribeToProgress(code, function(entries, err) {
        if (err) { setStatus(err, true); return; }
        merged[period] = (entries || []).map(function(e) {
            e.period = period;
            return e;
        });
        state.entries = flatten(merged);
        render();
    });
});
```

The existing period filter pills, sort modes, and group views need no changes. The `periodKey()` function in `teacher.html:309` already handles `'1'/'2'/'4'/'5'` correctly.

### Firebase wrapper API changes

In `js/firebase-leaderboard.js`:

- Remove `TEACHER_DASHBOARD_ROOM` constant.
- Add `ROOM_CODES` constant and `periodForRoom()` helper.
- Update `validateRoom` to reject unknown codes (no more "any string accepted if Firebase responds").
- Replace `getTeacherDashboardRoom()` in the exported API (line 236) with `getAllPeriodRooms()` returning a shallow copy of `ROOM_CODES`.
- Optionally expose `periodForRoom()` for `ui.js` to derive the period at join time.

### Old room cleanup

After deploy, Shie deletes `progress/shie-class` and `scores/shie-class` (if present) from the Firebase Realtime Database console manually. No code-side cleanup task.

Anyone with a cached browser tab still pointed at `shie-class` will write to a now-orphan tree that no dashboard reads. Their writes are harmless and decay naturally.

## Data Flow

**Student joins:**

1. Student types `AMS-p2` into join form on `index.html`.
2. `joinRoom()` calls `validateRoom('AMS-p2', cb)`.
3. `validateRoom` normalizes to `ams-p2`, checks against `ROOM_CODES`, accepts.
4. `joinRoom()` calls `periodForRoom('ams-p2')` → `'2'`.
5. Period and room code stored in `localStorage`.
6. All future `writeProgress()` calls include `period: '2'`.

**Teacher dashboard loads:**

1. `teacher.html` calls `getAllPeriodRooms()` → four codes.
2. Subscribes to all four `progress/<code>` paths.
3. As each room's entries arrive, merges them into `state.entries` with `period` overridden by source room.
4. Renders with existing battle/period/name sort modes.

## Error Handling

- Invalid code typed by student: existing error UI in `joinRoom()` (`roomCodeError` element) shows "Room not found." No change needed beyond `validateRoom` rejecting unknown codes.
- Firebase unavailable for one period but not others: dashboard shows entries from the rooms that succeeded, status line flags the failure for the affected period.
- Firebase entirely unavailable: existing "Firebase unavailable" status path in `teacher.html:255` still works.

## Testing

Manual verification on a Chromebook (Shie's classroom environment):

1. Open `index.html`, type `ams-p1`, confirm join succeeds and period auto-tags as Period 1 in the leaderboard.
2. Type `shie-class` (the old code), confirm join is rejected.
3. Type `AMS-P2` (mixed case), confirm it normalizes and succeeds as Period 2.
4. Open `teacher.html`, confirm all four periods' students appear, filter pills work, sort modes work.
5. Confirm "No period" filter pill returns zero students (since period is now always derived).

No automated tests. This is a static site with manual classroom QA.

## Communication of New Codes

Out of scope for the code change. Shie distributes the codes out-of-band (whiteboard, Google Classroom post, slides). Handouts do not currently print any room code (verified by grep of `handouts/`), so they need no update.

## Future Rotation

To rotate codes (e.g. start of next school year, or after a code leaks):

1. Edit the four strings in the `ROOM_CODES` constant at the top of `js/firebase-leaderboard.js`.
2. Deploy.
3. Delete the old `progress/<oldcode>` trees from the Firebase console.
4. Tell students the new codes.

No other files need to change.

## Risks

- **Student already joined with old code:** Their browser has `civilWarRoomCode = 'shie-class'` in `localStorage`. On next load, the saved code is no longer valid against `ROOM_CODES`. The app should treat this the same as "no saved code" and prompt for a new code. Verify the rejoin flow handles this gracefully in `ui.js` (the `restoreRoomCode` path around `ui.js:2714`).
- **One period's code leaks mid-semester:** Mitigation is to rotate just that one period's code (one-line edit). Other periods unaffected.
- **CSS-hidden period selector still receives form events:** Since we hide rather than remove, ensure no submit handler depends on the period value (it should now come from the derived value, not the form).
