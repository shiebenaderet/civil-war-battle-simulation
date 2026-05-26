# Per-Period Room Codes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unguarded `'shie-class'` dashboard room with four per-period codes (AMS-p1, AMS-p2, AMS-p4, AMS-p5), gate dashboard writes behind a valid code, and add password-protected delete/clear controls to the teacher dashboard.

**Architecture:** A `ROOM_CODES` map in `js/firebase-leaderboard.js` is the single source of truth. The name-entry form on `index.html` replaces the period dropdown with a class code text input. `app.js:reportProgressToDashboard` derives the room from the saved code and skips the write entirely if the code is invalid. `teacher.html` subscribes to all four rooms in parallel, gates page access with a session password, and exposes per-student delete and clear-all controls.

**Tech Stack:** Vanilla JS (no build step), Firebase Realtime Database (compat SDK 10.14.1), static site on GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-05-26-per-period-room-codes-design.md`

**Testing approach:** No automated tests in this codebase (static site, manual classroom QA). Each task includes manual verification steps. Commit after each task so reverting is granular.

---

## File Structure

**Modified files:**
- `js/firebase-leaderboard.js` — add `ROOM_CODES` constants, `periodForRoom`, `getAllPeriodRooms`, class code localStorage helpers, delete/clear API. Remove `TEACHER_DASHBOARD_ROOM` and `getTeacherDashboardRoom`.
- `index.html` — replace period `<select>` with class code `<input>` (lines 405-414).
- `js/ui.js` — update `getPeriodFromForm` / form helpers (around line 154-184) to read the class code and derive period via lookup. Wire saved-code pre-fill.
- `js/app.js` — update `reportProgressToDashboard` (lines 701-715) to use saved class code with period derivation, skip on invalid.
- `teacher.html` — password gate, subscribe to all four rooms with merge, per-chip delete button, clear-all button.

**No new files.** Banner styles and banner element added inline in `index.html` near existing game UI.

---

## Task 1: Add ROOM_CODES constants and lookup helpers to firebase-leaderboard.js

**Files:**
- Modify: `js/firebase-leaderboard.js`

- [ ] **Step 1: Read current state**

Open `js/firebase-leaderboard.js`. Confirm line 13 reads `var TEACHER_DASHBOARD_ROOM = 'shie-class';` and line 236 reads `getTeacherDashboardRoom: function() { return TEACHER_DASHBOARD_ROOM; }`.

- [ ] **Step 2: Replace TEACHER_DASHBOARD_ROOM with ROOM_CODES + class code key**

Replace the block at lines 7-13 (the constants block and the `TEACHER_DASHBOARD_ROOM` comment + declaration) with:

```js
    var ROOM_CODE_KEY = 'civilWarRoomCode';      // leaderboard feature (unchanged)
    var STUDENT_ID_KEY = 'civilWarStudentId';
    var CLASS_CODE_KEY = 'civilWarClassCode';    // NEW: teacher dashboard gate

    // Per-period room codes for the teacher progress dashboard.
    // To rotate: edit these four strings and delete the old rooms/<oldcode>/progress
    // trees from the Firebase console.
    var ROOM_CODES = {
        '1': 'ams-p1',
        '2': 'ams-p2',
        '4': 'ams-p4',
        '5': 'ams-p5'
    };
```

- [ ] **Step 3: Add lookup helpers above the `return {` block**

Just before the `return {` exports object (around line 224), add:

```js
    function periodForRoom(code) {
        var normalized = String(code || '').toLowerCase().trim();
        for (var p in ROOM_CODES) {
            if (Object.prototype.hasOwnProperty.call(ROOM_CODES, p) && ROOM_CODES[p] === normalized) {
                return p;
            }
        }
        return null;
    }

    function getAllPeriodRooms() {
        var copy = {};
        for (var p in ROOM_CODES) {
            if (Object.prototype.hasOwnProperty.call(ROOM_CODES, p)) {
                copy[p] = ROOM_CODES[p];
            }
        }
        return copy;
    }

    function getSavedClassCode() {
        try { return localStorage.getItem(CLASS_CODE_KEY) || ''; }
        catch (e) { return ''; }
    }

    function saveClassCode(code) {
        try { localStorage.setItem(CLASS_CODE_KEY, String(code || '').toLowerCase().trim()); }
        catch (e) {}
    }

    function clearClassCode() {
        try { localStorage.removeItem(CLASS_CODE_KEY); }
        catch (e) {}
    }
```

- [ ] **Step 4: Update exports**

Replace the export object at lines 224-237. Remove `getTeacherDashboardRoom`, add the new functions:

```js
    return {
        init: init,
        isAvailable: isAvailable,
        getSavedRoomCode: getSavedRoomCode,
        saveRoomCode: saveRoomCode,
        clearRoomCode: clearRoomCode,
        validateRoom: validateRoom,
        submitScore: submitScore,
        loadLeaderboard: loadLeaderboard,
        getStudentId: getStudentId,
        writeProgress: writeProgress,
        subscribeToProgress: subscribeToProgress,
        periodForRoom: periodForRoom,
        getAllPeriodRooms: getAllPeriodRooms,
        getSavedClassCode: getSavedClassCode,
        saveClassCode: saveClassCode,
        clearClassCode: clearClassCode
    };
```

- [ ] **Step 5: Manual smoke test in browser console**

Open `index.html` in a browser. In DevTools console:

```js
firebaseLeaderboard.getAllPeriodRooms()
// → {'1':'ams-p1', '2':'ams-p2', '4':'ams-p4', '5':'ams-p5'}

firebaseLeaderboard.periodForRoom('AMS-P1')
// → '1'

firebaseLeaderboard.periodForRoom('shie-class')
// → null

firebaseLeaderboard.saveClassCode('AMS-P2')
firebaseLeaderboard.getSavedClassCode()
// → 'ams-p2'
```

Expected: all return values match. App still loads (nothing else in the codebase referenced `getTeacherDashboardRoom` yet — we'll fix the two callsites in the next tasks).

- [ ] **Step 6: Commit**

```bash
git add js/firebase-leaderboard.js
git commit -m "Add ROOM_CODES map and class code helpers to firebase wrapper"
```

---

## Task 2: Update app.js to gate dashboard writes on saved class code

**Files:**
- Modify: `js/app.js` (lines 701-715)

- [ ] **Step 1: Read current state**

Open `js/app.js`. Confirm `reportProgressToDashboard` at line 701 currently calls `firebaseLeaderboard.getTeacherDashboardRoom()`.

- [ ] **Step 2: Replace reportProgressToDashboard**

Replace the entire function body (lines 701-715) with:

```js
// Writes the current student's progress to the teacher dashboard.
// Historical mode only. Requires a valid saved class code (AMS-p1..p5).
// No code = no write, so strangers never appear in the dashboard.
function reportProgressToDashboard(finished) {
    if (gameState.mode !== 'historical') return;
    if (typeof firebaseLeaderboard === 'undefined' || !firebaseLeaderboard.isAvailable()) return;

    var savedCode = firebaseLeaderboard.getSavedClassCode();
    var period = firebaseLeaderboard.periodForRoom(savedCode);
    if (!period) return;

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

- [ ] **Step 3: Grep for other getTeacherDashboardRoom callers**

```bash
grep -rn "getTeacherDashboardRoom" js/ teacher.html index.html
```

Expected: zero matches. If any remain, fix them — they're broken now.

- [ ] **Step 4: Manual test — no code = no write**

Open `index.html`. In DevTools console, confirm no saved class code:

```js
firebaseLeaderboard.clearClassCode()
```

Pick historical mode, fill in name, click Begin. In the Firebase console (Realtime DB), confirm NO new entry appeared under `rooms/ams-p1/progress` (or any other room). The write should have silently skipped.

- [ ] **Step 5: Manual test — valid code writes correctly**

In DevTools console:

```js
firebaseLeaderboard.saveClassCode('ams-p1')
```

Reload, play historical mode through to the first battle. In Firebase console under `rooms/ams-p1/progress/<some-studentId>`, confirm a record exists with `period: "1"`.

- [ ] **Step 6: Commit**

```bash
git add js/app.js
git commit -m "Gate dashboard writes behind valid class code"
```

---

## Task 3: Replace period dropdown with class code input on name entry form

**Files:**
- Modify: `index.html` (lines 405-414)
- Modify: `js/ui.js` (around lines 154 and 184)

- [ ] **Step 1: Read current state**

Read `index.html` lines 395-416. Confirm the `<select id="periodSelect">` block at lines 407-413.

Read `js/ui.js` lines 145-200 to see both helpers that touch `periodSelect` (around 154 and 184).

- [ ] **Step 2: Replace the period dropdown markup in index.html**

Replace lines 405-414 (the `<div class="name-field name-field-period">` block) with:

```html
                    <div class="name-field name-field-period">
                        <label for="classCodeInput" class="name-field-label">Class Code</label>
                        <input type="text" id="classCodeInput" class="name-field-input"
                               placeholder="AMS-p1" maxlength="12" autocomplete="off"
                               aria-label="Class code from your teacher">
                    </div>
```

Keep the same outer div class (`name-field name-field-period`) so existing CSS layout still applies.

- [ ] **Step 3: Update the period-reading helper in ui.js**

In `js/ui.js`, find `getPeriodFromForm` (look near line 184). Replace it entirely with:

```js
function getPeriodFromForm() {
    var input = document.getElementById('classCodeInput');
    if (!input) return '';
    var code = String(input.value || '').toLowerCase().trim();
    var period = firebaseLeaderboard.periodForRoom(code);
    if (!period) return '';
    // Side effect: persist the validated code so app.js can use it for writes.
    firebaseLeaderboard.saveClassCode(code);
    return period;
}
```

- [ ] **Step 4: Update the pre-fill helper in ui.js**

Find the other reference to `periodSelect` near line 154 (the pre-fill / initialization helper). Replace the line(s) that touch `periodSelect` with class code pre-fill:

```js
var codeInput = document.getElementById('classCodeInput');
if (codeInput) {
    var saved = firebaseLeaderboard.getSavedClassCode();
    if (saved) codeInput.value = saved.toUpperCase();
}
```

(If the original used `periodSel.value = gameState.period` or similar, swap to the snippet above. If you see any leftover `periodSel` / `periodSelect` references, remove them.)

- [ ] **Step 5: Grep to confirm no orphaned periodSelect references remain**

```bash
grep -rn "periodSelect\|periodSel" js/ index.html
```

Expected: zero matches.

- [ ] **Step 6: Manual test — form flow**

Open `index.html`. Pick historical mode. The Class Code input should appear where the dropdown was. Type `ams-p2`, fill in name, click Begin. In DevTools console:

```js
firebaseLeaderboard.getSavedClassCode()
// → 'ams-p2'

gameState.period
// → '2'
```

Reload the page. Pick historical mode. The Class Code input should pre-fill with `AMS-P2`.

- [ ] **Step 7: Manual test — invalid code**

Clear the saved code (`firebaseLeaderboard.clearClassCode()`), reload. Type `garbage` into the class code input. Click Begin. Confirm `gameState.period === ''` and no dashboard write fires (check Firebase console).

- [ ] **Step 8: Commit**

```bash
git add index.html js/ui.js
git commit -m "Replace period dropdown with class code text input"
```

---

## Task 4: Add "teacher won't see you" banner with inline code entry

**Files:**
- Modify: `index.html` (add banner markup + minimal inline CSS)
- Modify: `js/ui.js` (banner show/hide logic, called from historical-mode battle render)
- Modify: `js/app.js` (trigger banner check after `startWithSide` in historical mode)

- [ ] **Step 1: Add banner markup to index.html**

Find a stable anchor inside the historical-mode game UI (search for `id="battleScreen"` or the main game container). Just before that container, add:

```html
            <div id="noTeacherBanner" class="no-teacher-banner" style="display:none;" role="status">
                <span class="no-teacher-banner-icon" aria-hidden="true">⚠</span>
                <span class="no-teacher-banner-text">Your teacher won't see your progress.</span>
                <button type="button" id="noTeacherBannerOpenBtn" class="no-teacher-banner-link">Enter class code</button>
                <button type="button" id="noTeacherBannerSkipBtn" class="no-teacher-banner-skip" aria-label="Dismiss">✕</button>
                <div id="noTeacherBannerForm" class="no-teacher-banner-form" style="display:none;">
                    <input type="text" id="noTeacherBannerInput" placeholder="AMS-p1" maxlength="12" autocomplete="off" aria-label="Class code">
                    <button type="button" id="noTeacherBannerSaveBtn">Save</button>
                    <div id="noTeacherBannerError" class="no-teacher-banner-error" style="display:none;">Code not recognized. Check with your teacher.</div>
                </div>
            </div>
```

- [ ] **Step 2: Add banner CSS**

In `index.html` inside the existing `<style>` block (or in `css/style.css` if you prefer keeping CSS out of HTML — match whatever the rest of the file does), add:

```css
.no-teacher-banner {
    background: #fef3c7;
    border: 1px solid #f59e0b;
    color: #78350f;
    padding: 10px 14px;
    border-radius: 6px;
    margin: 12px auto;
    max-width: 720px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}
.no-teacher-banner-icon { font-size: 18px; }
.no-teacher-banner-text { flex: 1; }
.no-teacher-banner-link,
.no-teacher-banner-skip,
.no-teacher-banner-form button {
    background: #92400e;
    color: #fff;
    border: none;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
}
.no-teacher-banner-skip { background: transparent; color: #78350f; padding: 4px 6px; font-size: 16px; }
.no-teacher-banner-form { width: 100%; display: flex; gap: 6px; align-items: center; margin-top: 6px; }
.no-teacher-banner-form input { flex: 1; padding: 6px 8px; border: 1px solid #f59e0b; border-radius: 4px; font-size: 14px; }
.no-teacher-banner-error { width: 100%; color: #b91c1c; font-size: 13px; }
```

- [ ] **Step 3: Add banner logic to ui.js**

Add a new section near the other dashboard helpers in `js/ui.js`:

```js
// ============================================================
// "Teacher won't see you" banner (no valid class code saved)
// ============================================================

var NO_TEACHER_BANNER_SKIP_KEY = 'noTeacherBannerSkipped';

function shouldShowNoTeacherBanner() {
    if (gameState.mode !== 'historical') return false;
    if (typeof firebaseLeaderboard === 'undefined') return false;
    if (sessionStorage.getItem(NO_TEACHER_BANNER_SKIP_KEY) === '1') return false;
    var saved = firebaseLeaderboard.getSavedClassCode();
    var period = firebaseLeaderboard.periodForRoom(saved);
    return !period;
}

function showNoTeacherBannerIfNeeded() {
    var banner = document.getElementById('noTeacherBanner');
    if (!banner) return;
    banner.style.display = shouldShowNoTeacherBanner() ? 'flex' : 'none';
}

function wireNoTeacherBanner() {
    var openBtn = document.getElementById('noTeacherBannerOpenBtn');
    var skipBtn = document.getElementById('noTeacherBannerSkipBtn');
    var saveBtn = document.getElementById('noTeacherBannerSaveBtn');
    var form = document.getElementById('noTeacherBannerForm');
    var input = document.getElementById('noTeacherBannerInput');
    var errorEl = document.getElementById('noTeacherBannerError');
    var banner = document.getElementById('noTeacherBanner');
    if (!openBtn || !skipBtn || !saveBtn || !form || !input || !errorEl || !banner) return;

    openBtn.addEventListener('click', function() {
        form.style.display = 'flex';
        input.focus();
    });

    skipBtn.addEventListener('click', function() {
        try { sessionStorage.setItem(NO_TEACHER_BANNER_SKIP_KEY, '1'); } catch (e) {}
        banner.style.display = 'none';
    });

    saveBtn.addEventListener('click', function() {
        var raw = String(input.value || '').toLowerCase().trim();
        var period = firebaseLeaderboard.periodForRoom(raw);
        if (!period) {
            errorEl.style.display = 'block';
            return;
        }
        errorEl.style.display = 'none';
        firebaseLeaderboard.saveClassCode(raw);
        gameState.period = period;
        banner.style.display = 'none';
        if (typeof reportProgressToDashboard === 'function') {
            reportProgressToDashboard(false);
        }
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') saveBtn.click();
    });
}
```

- [ ] **Step 4: Wire banner into app boot**

In `js/app.js`, find the `boot()` function (or `DOMContentLoaded` handler at line 718). Add a call to `wireNoTeacherBanner()` once on boot. Then, in `startWithSide` (line 680), after the historical-mode `reportProgressToDashboard(false)` call (line 691), add:

```js
        showNoTeacherBannerIfNeeded();
```

So that block becomes:

```js
    if (gameState.mode === 'historical') {
        reportProgressToDashboard(false);
        showNoTeacherBannerIfNeeded();
        renderLeaderLetter();
    } else {
        renderFreeplayBriefing();
    }
```

- [ ] **Step 5: Manual test — banner appears without code**

```js
firebaseLeaderboard.clearClassCode()
sessionStorage.removeItem('noTeacherBannerSkipped')
```

Reload, pick historical mode, fill in name only (leave class code blank), click Begin. Banner should appear at the top of the game area.

- [ ] **Step 6: Manual test — banner save flow**

Click "Enter class code" on the banner. Type `garbage`, Save → error shows. Clear, type `AMS-p4`, Save → banner disappears, Firebase console shows new entry under `rooms/ams-p4/progress/<studentId>`.

- [ ] **Step 7: Manual test — skip flow**

Reload again with no saved code, banner reappears (sessionStorage was cleared by reload? — sessionStorage persists across reloads within a tab; close and reopen the tab to clear). Click ✕. Banner gone. Reload tab → still gone (session active). Close tab, reopen → banner returns.

- [ ] **Step 8: Commit**

```bash
git add index.html js/ui.js js/app.js
git commit -m "Add 'teacher won't see you' banner with inline code entry"
```

---

## Task 5: Update teacher.html to subscribe to all four period rooms

**Files:**
- Modify: `teacher.html` (the inline script block starting at line 240)

- [ ] **Step 1: Read current state**

Read `teacher.html` lines 240-280. The current `init()` calls `firebaseLeaderboard.getTeacherDashboardRoom()` then subscribes to one room.

- [ ] **Step 2: Replace init() to subscribe to all four rooms**

Replace `init()` (lines 250-273) with:

```js
        function init() {
            firebaseLeaderboard.init();

            if (!firebaseLeaderboard.isAvailable()) {
                setStatus('Firebase unavailable. Check your internet connection.', true);
                return;
            }

            var rooms = firebaseLeaderboard.getAllPeriodRooms();
            document.getElementById('roomLabel').textContent =
                Object.keys(rooms).map(function(p) { return 'P' + p; }).join(', ');

            state.perRoom = {};

            setStatus('Listening for student progress…');
            Object.keys(rooms).forEach(function(period) {
                var code = rooms[period];
                firebaseLeaderboard.subscribeToProgress(code, function(entries, err) {
                    if (err) {
                        setStatus('Period ' + period + ': ' + err, true);
                        return;
                    }
                    state.perRoom[period] = (entries || []).map(function(e) {
                        e.period = period;
                        e._sourceRoom = code;
                        return e;
                    });
                    state.entries = Object.keys(state.perRoom).reduce(function(acc, p) {
                        return acc.concat(state.perRoom[p]);
                    }, []);
                    state.lastUpdate = Date.now();
                    render();
                    setStatus('Updated ' + new Date().toLocaleTimeString() +
                              ' · ' + state.entries.length + ' student' +
                              (state.entries.length === 1 ? '' : 's'));
                });
            });

            wireControls();
        }
```

- [ ] **Step 3: Add `perRoom` to state initializer**

Lines 243-248 declare `state`. Update to include `perRoom`:

```js
        var state = {
            sort: 'battle',
            filter: 'all',
            entries: [],
            perRoom: {},
            lastUpdate: 0
        };
```

- [ ] **Step 4: Manual test — multi-room subscribe**

Open `teacher.html` in browser. The room label in the header should show `P1, P2, P4, P5`. Open Firebase console, manually add a fake progress entry under `rooms/ams-p1/progress/test123` with `{name: "Test Kid", currentBattle: 3, lastSeen: 1735000000000}`. The dashboard should show "Test Kid" in the Period 1 column within ~1 second.

Add another fake entry under `rooms/ams-p4/progress/test456`. Both appear. Filter to "P1" — only test123. Delete the fake entries from Firebase when done.

- [ ] **Step 5: Commit**

```bash
git add teacher.html
git commit -m "Teacher dashboard subscribes to all four period rooms"
```

---

## Task 6: Add password gate to teacher dashboard

**Files:**
- Modify: `teacher.html` (inline script)

- [ ] **Step 1: Add auth constants and helper at top of IIFE**

In the inline `<script>` block in `teacher.html`, just inside the `(function() {` (around line 241), add:

```js
        var DASHBOARD_PASSWORD = 'amsmustangs';
        var SESSION_AUTH_KEY = 'teacherDashboardAuthed';

        function requireAuth() {
            try {
                if (sessionStorage.getItem(SESSION_AUTH_KEY) === '1') return true;
            } catch (e) {}
            var entered = window.prompt('Teacher password:');
            if (entered === DASHBOARD_PASSWORD) {
                try { sessionStorage.setItem(SESSION_AUTH_KEY, '1'); } catch (e) {}
                return true;
            }
            var deny = document.createElement('div');
            deny.style.cssText = 'padding:40px;text-align:center;font-family:sans-serif;font-size:18px;color:#666';
            deny.textContent = 'Access denied.';
            document.body.replaceChildren(deny);
            return false;
        }
```

- [ ] **Step 2: Gate init()**

At the very top of `init()`, before the `firebaseLeaderboard.init()` line, add:

```js
            if (!requireAuth()) return;
```

- [ ] **Step 3: Manual test — wrong password**

Open a fresh incognito window. Navigate to `teacher.html`. Prompt appears. Type `wrong`, Enter. Page shows "Access denied" and nothing else loads.

- [ ] **Step 4: Manual test — right password**

Reload incognito tab. Prompt appears. Type `amsmustangs`, Enter. Dashboard loads normally. Reload again — no prompt this time (session cached). Close the tab, reopen — prompt returns.

- [ ] **Step 5: Commit**

```bash
git add teacher.html
git commit -m "Password-gate teacher dashboard on page load"
```

---

## Task 7: Add per-student delete button on chips

**Files:**
- Modify: `js/firebase-leaderboard.js` (add `deleteProgressEntry`)
- Modify: `teacher.html` (chip rendering + CSS)

- [ ] **Step 1: Add deleteProgressEntry to firebase-leaderboard.js**

In `js/firebase-leaderboard.js`, just below `subscribeToProgress` (around line 193), add:

```js
    function deleteProgressEntry(roomCode, studentId, callback) {
        if (!isAvailable()) {
            if (callback) callback(false, 'Offline.');
            return;
        }
        var code = String(roomCode || '').toLowerCase().trim();
        var sid = String(studentId || '').trim();
        if (!code || !sid) {
            if (callback) callback(false, 'Missing code or student id.');
            return;
        }
        db.ref('rooms/' + code + '/progress/' + sid).remove()
            .then(function() { if (callback) callback(true, ''); })
            .catch(function() { if (callback) callback(false, 'Delete failed.'); });
    }
```

Then add `deleteProgressEntry: deleteProgressEntry,` to the export object.

- [ ] **Step 2: Add CSS for delete button**

In `teacher.html` `<style>` block, add:

```css
.student-chip-delete {
    margin-left: 4px;
    background: transparent;
    border: none;
    color: #b91c1c;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    padding: 0 2px;
    opacity: 0.4;
}
.student-chip:hover .student-chip-delete { opacity: 1; }
```

- [ ] **Step 3: Update chip() to add the delete button**

In `teacher.html`, find `chip(entry)` (around line 330). Just before the `return c;` line at the end, add:

```js
            var del = document.createElement('button');
            del.type = 'button';
            del.className = 'student-chip-delete';
            del.textContent = '✕';
            del.title = 'Delete ' + (entry.name || 'this student') + ' from dashboard';
            del.addEventListener('click', function(ev) {
                ev.stopPropagation();
                if (!window.confirm('Delete ' + (entry.name || 'this student') + ' from the dashboard?')) return;
                var sourceCode = entry._sourceRoom;
                if (!sourceCode) {
                    var rooms = firebaseLeaderboard.getAllPeriodRooms();
                    sourceCode = rooms[entry.period];
                }
                if (!sourceCode || !entry.studentId) return;
                firebaseLeaderboard.deleteProgressEntry(sourceCode, entry.studentId, function(ok, errMsg) {
                    if (!ok) setStatus(errMsg || 'Delete failed.', true);
                });
            });
            c.appendChild(del);
```

- [ ] **Step 4: Manual test**

Open `teacher.html` (authenticate), put a fake entry in Firebase under `rooms/ams-p1/progress/testkid` with `{name:"Test", currentBattle:1, lastSeen:Date.now()}`. The chip should appear with a faint ✕ on hover.

Click ✕ on the Test chip. Confirm dialog. OK. The chip disappears within ~1s, and Firebase console shows the entry is gone.

- [ ] **Step 5: Commit**

```bash
git add js/firebase-leaderboard.js teacher.html
git commit -m "Add per-student delete button on dashboard chips"
```

---

## Task 8: Add "Clear all" button on dashboard

**Files:**
- Modify: `js/firebase-leaderboard.js` (add `clearAllProgress`)
- Modify: `teacher.html` (button + handler)

- [ ] **Step 1: Add clearAllProgress to firebase-leaderboard.js**

Just below `deleteProgressEntry`, add:

```js
    function clearAllProgress(roomCodes, callback) {
        if (!isAvailable()) {
            if (callback) callback(false, 'Offline.');
            return;
        }
        if (!Array.isArray(roomCodes) || roomCodes.length === 0) {
            if (callback) callback(false, 'No rooms to clear.');
            return;
        }
        var promises = roomCodes.map(function(code) {
            var c = String(code || '').toLowerCase().trim();
            if (!c) return Promise.resolve();
            return db.ref('rooms/' + c + '/progress').remove();
        });
        Promise.all(promises)
            .then(function() { if (callback) callback(true, ''); })
            .catch(function() { if (callback) callback(false, 'Clear failed (partial).'); });
    }
```

Add `clearAllProgress: clearAllProgress,` to the export object.

- [ ] **Step 2: Add Clear All button to controls row**

In `teacher.html`, find the controls row that contains the Refresh button (around line 222). Just before the closing `</div>` of `.controls`, add:

```html
        <button class="refresh-btn" id="clearAllBtn" style="border-color:#b91c1c;color:#b91c1c;">Clear all</button>
```

- [ ] **Step 3: Wire Clear All in wireControls()**

In `teacher.html`'s `wireControls()` (around line 275), add at the end of the function:

```js
            document.getElementById('clearAllBtn').addEventListener('click', function() {
                if (!window.confirm('Delete ALL student progress from ALL four periods? This cannot be undone.')) return;
                var rooms = firebaseLeaderboard.getAllPeriodRooms();
                var codes = Object.keys(rooms).map(function(p) { return rooms[p]; });
                firebaseLeaderboard.clearAllProgress(codes, function(ok, errMsg) {
                    if (!ok) setStatus(errMsg || 'Clear failed.', true);
                });
            });
```

- [ ] **Step 4: Manual test**

Put 2-3 fake entries across different period rooms in Firebase. Open `teacher.html`, authenticate. Confirm chips appear. Click "Clear all". Confirm dialog. OK. All chips vanish within ~1s, all `rooms/ams-pN/progress` trees are empty in Firebase console.

- [ ] **Step 5: Commit**

```bash
git add js/firebase-leaderboard.js teacher.html
git commit -m "Add 'Clear all' button to teacher dashboard"
```

---

## Task 9: End-to-end verification + Firebase cleanup

**Files:** none (verification only)

- [ ] **Step 1: Clear localStorage/sessionStorage**

In both `index.html` and `teacher.html` tabs:

```js
localStorage.clear()
sessionStorage.clear()
```

- [ ] **Step 2: Full student flow — code path**

1. Open `index.html`. Pick historical mode.
2. Type name + `AMS-p2` in class code field. Click Begin.
3. In Firebase console, confirm new entry under `rooms/ams-p2/progress/<studentId>` with `period: "2"`.
4. Open `teacher.html`, authenticate with `amsmustangs`. Confirm the new student appears under Period 2.

- [ ] **Step 3: Full student flow — banner path**

1. New incognito window. Open `index.html`. Pick historical mode.
2. Type name only. Leave class code blank. Begin.
3. Banner appears. Click "Enter class code". Type `AMS-p4`. Save.
4. Confirm banner dismisses and the student appears in the open `teacher.html` tab under Period 4.

- [ ] **Step 4: Full student flow — no code, skip banner**

1. New incognito window. Open `index.html`. Pick historical mode. Begin without code.
2. Click ✕ on banner. Banner dismisses.
3. Confirm Firebase shows no new entry. Student plays normally but is absent from dashboard. (This is the "kid at home on Saturday" case.)

- [ ] **Step 5: Delete + clear-all sanity**

In `teacher.html`, delete one student via ✕. Confirm in Firebase console. Then click Clear all, confirm, and verify all four `rooms/ams-pN/progress` trees are empty.

- [ ] **Step 6: Old room cleanup (Firebase console, manual)**

In the Firebase console, navigate to `rooms/shie-class/progress`. Delete this entire subtree. (Leave `rooms/shie-class/scores` — old leaderboard entries are harmless and may have nostalgia value.)

This step happens once, after the code is deployed. Note in the commit message that the cleanup was completed.

- [ ] **Step 7: Grep one more time for old constants**

```bash
grep -rn "TEACHER_DASHBOARD_ROOM\|getTeacherDashboardRoom\|shie-class\|periodSelect" js/ teacher.html index.html
```

Expected: zero matches in code (the spec doc may still reference `shie-class` for historical context — that's fine).

- [ ] **Step 8: Final commit (if any cleanup edits surfaced)**

```bash
git status
# if anything is dirty:
git add -A
git commit -m "Cleanup: remove final references to old TEACHER_DASHBOARD_ROOM"
```

---

## Rollback Plan

If something breaks in classroom use:

1. **Revert to pre-feature state:** `git revert` the commits from Tasks 1-8 in reverse order, or `git checkout main~9 -- js/firebase-leaderboard.js js/app.js js/ui.js index.html teacher.html` to restore the old files in one shot, then commit.
2. **Restore old dashboard room:** Old `rooms/shie-class` writes will resume automatically since the code reverts to the constant. The deleted `progress` subtree comes back as students play.
3. No Firebase rules changes were made by this plan, so no rules rollback is needed.

---

## Out of Scope (Confirmed)

- Authentication / SSO beyond the client-side password.
- Firebase security rules (writes to `rooms/<code>/progress/*` continue to be open from any client; the gate is purely in `app.js` skipping the write).
- Handout updates (none reference any code string).
- Migration of `civilWarPeriod` from older versions (key never existed; nothing to migrate).
- Per-period password (one password gates the whole dashboard).
