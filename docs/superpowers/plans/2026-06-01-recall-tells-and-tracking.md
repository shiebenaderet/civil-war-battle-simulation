# Recall Tells + Question Tracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the "longest option is correct" tell from all 48 act-review questions, and log each student's first-try result so the teacher dashboard can show which questions are hardest (with named misses).

**Architecture:** Part 1 is a data-only rewrite of the `options` arrays in `js/data/acts.js`, run as a workflow (per-act rewriter + adversarial verifier) and gated by a length-parity assertion. Part 2 adds a `recall` subtree to the existing Firebase room model with three module functions mirroring the `progress` pattern, a fire-and-forget hook in the recall scoring path, matching DB rules, and a fourth "Questions" tab on `teacher.html`.

**Tech Stack:** Vanilla JS (IIFE module pattern), Firebase Realtime Database (compat SDK), static HTML dashboard. No build step, no test runner. Verification by Node assertion scripts + live dashboard check.

---

## Part 1: Distractor rewrite (workflow-driven)

### Task 1: Snapshot the correct answers (regression guard)

**Files:**
- Create: `/tmp/recall-verify/before.json`

- [ ] **Step 1: Extract every question's correct-answer text and correctIndex** so we can prove later that the rewrite never changed a correct answer or its index.

```bash
mkdir -p /tmp/recall-verify
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node -e '
require("./js/data/acts.js"); // sets global `acts`? — if not, eval-extract instead
' 2>/dev/null || true
# acts.js defines a top-level `var acts = [...]`. Load it in a sandbox:
node -e '
const fs=require("fs"),vm=require("vm");
const src=fs.readFileSync("js/data/acts.js","utf8");
const ctx={}; vm.createContext(ctx); vm.runInContext(src+"\nthis.acts=acts;",ctx);
const out=[];
ctx.acts.forEach((act,ai)=>{
  const r=act.recall||{};
  ["extra","beginner","intermediate","advanced"].forEach(tier=>{
    (r[tier]||[]).forEach((q,qi)=>{
      out.push({ai,tier,qi,correctIndex:q.correctIndex,correct:q.options[q.correctIndex],question:q.question});
    });
  });
});
fs.writeFileSync("/tmp/recall-verify/before.json",JSON.stringify(out,null,2));
console.log("snapshot:",out.length,"questions");
'
```

Expected: `snapshot: 48 questions`.

- [ ] **Step 2: Commit nothing yet** (snapshot is a temp artifact). Proceed to Task 2.

### Task 2: Rewrite distractors via workflow

**Files:**
- Modify: `js/data/acts.js` (only the `options` arrays)

- [ ] **Step 1: Run the rewrite workflow.** The workflow rewrites each act's 12 questions grounded in that act's battle facts, then an adversarial agent verifies each for length parity, genuinely-wrong distractors, no accidental second-correct-answer, and reading level. The orchestrator (this session) applies verified `options` arrays into `acts.js` via Edit, one question at a time, leaving `question`, `correctIndex`, `explanation`, `nudge`, `source` untouched. (Workflow script authored at execution time; see "Workflow notes" below.)

- [ ] **Step 2: Length-parity assertion.** After edits, assert no option is a conspicuous outlier and correct answers/indexes are unchanged:

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node -e '
const fs=require("fs"),vm=require("vm");
const src=fs.readFileSync("js/data/acts.js","utf8");
const ctx={}; vm.createContext(ctx); vm.runInContext(src+"\nthis.acts=acts;",ctx);
const before=JSON.parse(fs.readFileSync("/tmp/recall-verify/before.json","utf8"));
let bi=0, fails=[];
ctx.acts.forEach((act,ai)=>{
  const r=act.recall||{};
  ["extra","beginner","intermediate","advanced"].forEach(tier=>{
    (r[tier]||[]).forEach((q,qi)=>{
      const rec=before[bi++];
      // 1. correct answer + index unchanged
      if(q.correctIndex!==rec.correctIndex) fails.push(`${ai}/${tier}/${qi}: correctIndex changed`);
      if(q.options[q.correctIndex]!==rec.correct) fails.push(`${ai}/${tier}/${qi}: correct text changed`);
      // 2. length parity: longest option <= 1.6x shortest, AND correct is not the single longest by >20%
      const lens=q.options.map(o=>o.length);
      const mn=Math.min(...lens), mx=Math.max(...lens);
      if(mx>mn*1.9) fails.push(`${ai}/${tier}/${qi}: length spread ${mn}-${mx} too wide`);
      const correctLen=q.options[q.correctIndex].length;
      const others=lens.filter((_,i)=>i!==q.correctIndex);
      const secondMax=Math.max(...others);
      if(correctLen>secondMax*1.25) fails.push(`${ai}/${tier}/${qi}: correct is ${correctLen} vs next ${secondMax} (still longest tell)`);
    });
  });
});
if(fails.length){console.error("FAILS:\n"+fails.join("\n"));process.exit(1);}
console.log("PASS: 48 questions, no length tell, correct answers preserved");
'
```

Expected: `PASS: 48 questions, no length tell, correct answers preserved`. If any FAIL, fix that question's `options` and re-run.

- [ ] **Step 3: Syntax check acts.js loads.**

```bash
node -e 'const fs=require("fs"),vm=require("vm");const c={};vm.createContext(c);vm.runInContext(fs.readFileSync("js/data/acts.js","utf8")+"\nthis.acts=acts;",c);console.log("acts.js OK,",c.acts.length,"acts");'
```

Expected: `acts.js OK, 4 acts`.

- [ ] **Step 4: Commit.**

```bash
git add js/data/acts.js
git commit -m "Recall: rewrite distractors to remove the longest-answer tell"
```

#### Workflow notes (for Task 2 Step 1)

- `meta.phases`: `Rewrite` (4 agents, one per act), `Verify` (adversarial, per question).
- Rewrite agent prompt includes: the act's 12 questions (all tiers) with their
  correct answers and `source`, the relevant `battles.js` facts, and the rules
  from the spec (length parity, plausible-wrong, one-correct, tier reading
  level). It returns, per question, a new 4-element `options` array preserving
  the correct option text at its existing `correctIndex`.
- Verify agent (per question) is given the rewritten options + correct index and
  must return `{ok:bool, issues:[...]}` checking: lengths within band, each
  distractor historically wrong, no distractor arguably also correct, tier
  reading level. Anything not `ok` is regenerated before applying.
- Orchestrator applies only verified arrays into `acts.js` and then runs the
  Step 2 assertion as the final gate.

---

## Part 2: Question-difficulty tracking

### Task 3: Add recall data functions to firebase-leaderboard.js

**Files:**
- Modify: `js/firebase-leaderboard.js` (add functions before the `return {...}` block at line ~409; export them in that block)

- [ ] **Step 1: Add `writeRecallResult`, `subscribeToRecall`, `clearAllRecall`** after `clearAllProgress` (line ~235). Mirrors `writeProgress`/`subscribeToProgress`/`clearAllProgress` exactly.

```javascript
    // v3.22: record one student's result on one recall question. Keyed by
    // studentId + "<actIndex>_<qIndex>" so each question overwrites in place
    // (we want "did they get it first try", not history). Graceful offline.
    function writeRecallResult(roomCode, actIndex, qIndex, result, callback) {
        if (!isAvailable()) { if (callback) callback(false, 'Offline.'); return; }
        var code = String(roomCode || '').toLowerCase().trim();
        if (!code) { if (callback) callback(false, 'No room code.'); return; }
        var studentId = getStudentId();
        var qKey = String(Number(actIndex) || 0) + '_' + (String(Number(qIndex) || 0));
        var entry = {
            name: String(result.name || 'Student').substring(0, 30),
            period: String(result.period || ''),
            correct: Boolean(result.correct),
            firstTry: Boolean(result.firstTry),
            attempts: Number(result.attempts) || 1,
            lastSeen: firebase.database.ServerValue.TIMESTAMP
        };
        db.ref('rooms/' + code + '/recall/' + studentId + '/' + qKey).set(entry)
            .then(function() { if (callback) callback(true, ''); })
            .catch(function() { if (callback) callback(false, 'Write failed.'); });
    }

    // Subscribe to all recall results for a room. Calls back with a flat array of
    // { studentId, qKey, name, period, correct, firstTry, attempts, lastSeen }.
    function subscribeToRecall(roomCode, callback) {
        if (!isAvailable()) { callback(null, 'Offline.'); return function() {}; }
        var code = String(roomCode || '').toLowerCase().trim();
        if (!code) { callback(null, 'No room code.'); return function() {}; }
        var ref = db.ref('rooms/' + code + '/recall');
        var handler = ref.on('value', function(snapshot) {
            var rows = [];
            snapshot.forEach(function(studentChild) {
                var sid = studentChild.key;
                studentChild.forEach(function(qChild) {
                    var v = qChild.val();
                    if (v) {
                        v.studentId = sid;
                        v.qKey = qChild.key;
                        rows.push(v);
                    }
                });
            });
            callback(rows, '');
        }, function() { callback(null, 'Listener error.'); });
        return function() { ref.off('value', handler); };
    }

    function clearAllRecall(roomCodes, callback) {
        if (!isAvailable()) { if (callback) callback(false, 'Offline.'); return; }
        if (!Array.isArray(roomCodes) || roomCodes.length === 0) {
            if (callback) callback(false, 'No rooms to clear.'); return;
        }
        var promises = roomCodes.map(function(code) {
            var c = String(code || '').toLowerCase().trim();
            if (!c) return Promise.resolve();
            return db.ref('rooms/' + c + '/recall').remove();
        });
        Promise.all(promises)
            .then(function() { if (callback) callback(true, ''); })
            .catch(function() { if (callback) callback(false, 'Clear failed (partial).'); });
    }
```

- [ ] **Step 2: Export the three functions** by adding them to the `return {...}` object (after `clearAllProgress: clearAllProgress,` line ~422):

```javascript
        writeRecallResult: writeRecallResult,
        subscribeToRecall: subscribeToRecall,
        clearAllRecall: clearAllRecall,
```

- [ ] **Step 3: Syntax check.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node --check js/firebase-leaderboard.js && echo "firebase-leaderboard.js parses OK"
```

Expected: `firebase-leaderboard.js parses OK`.

- [ ] **Step 4: Commit.**

```bash
git add js/firebase-leaderboard.js
git commit -m "Firebase: add recall result write/subscribe/clear functions"
```

### Task 4: Add the reporter function in app.js

**Files:**
- Modify: `js/app.js` (add after `reportProgressToDashboard`, line ~825)

- [ ] **Step 1: Add `reportRecallResultToDashboard`** mirroring `reportProgressToDashboard` (historical-only, class-code gated):

```javascript
// v3.22: record a recall question result for the teacher's Question-difficulty
// view. Historical mode only, requires a valid saved class code (so strangers
// never write). Fire-and-forget — never blocks or surfaces errors to students.
function reportRecallResultToDashboard(actIndex, qIndex, firstTry, correct, attempts) {
    if (gameState.mode !== 'historical') return;
    if (typeof firebaseLeaderboard === 'undefined' || !firebaseLeaderboard.isAvailable()) return;
    var savedCode = firebaseLeaderboard.getSavedClassCode();
    var period = firebaseLeaderboard.periodForRoom(savedCode);
    if (!period) return;
    firebaseLeaderboard.writeRecallResult(savedCode, actIndex, qIndex, {
        name: gameState.studentName || 'Student',
        period: period,
        correct: !!correct,
        firstTry: !!firstTry,
        attempts: Number(attempts) || 1
    });
}
```

- [ ] **Step 2: Syntax check.**

```bash
node --check js/app.js && echo "app.js parses OK"
```

Expected: `app.js parses OK`.

- [ ] **Step 3: Commit.**

```bash
git add js/app.js
git commit -m "app: add reportRecallResultToDashboard (historical, gated)"
```

### Task 5: Hook the recall scoring path in ui.js

**Files:**
- Modify: `js/ui.js` inside `renderActRecall` -> `onOptionClick` (lines ~1136-1189)

The result must be recorded exactly ONCE per question, on the FIRST answer, with
`firstTry` = whether that first answer was correct. Use the existing
`wrongAttempts` counter and a new `reported` flag.

- [ ] **Step 1: Add a `reported` flag** alongside `wrongAttempts`/`questionResolved`. In `renderQuestion` (line ~1115) where `wrongAttempts = 0; questionResolved = false;` are reset, add:

```javascript
        wrongAttempts = 0;
        questionResolved = false;
        reported = false;
```

And declare `reported` next to the others near line 1076:

```javascript
    var questionIdx = 0;
    var wrongAttempts = 0;
    var questionResolved = false;
    var reported = false;
```

- [ ] **Step 2: Report on the first CORRECT answer.** In `onOptionClick`, inside the `if (optIdx === q.correctIndex)` block (after line 1148 `questionResolved = true;`), add:

```javascript
            questionResolved = true;
            if (!reported) {
                reported = true;
                if (typeof reportRecallResultToDashboard === 'function') {
                    reportRecallResultToDashboard(actIndex, questionIdx, wrongAttempts === 0, true, wrongAttempts + 1);
                }
            }
            document.getElementById('actRecallContinueBtn').disabled = false;
            return;
```

- [ ] **Step 3: Report on the first WRONG answer.** In the WRONG branch, inside `if (wrongAttempts === 1)` (first wrong, line ~1158), add the report (firstTry=false). This fires once because `reported` guards it:

```javascript
        if (wrongAttempts === 1) {
            // First wrong: nudge, retry allowed
            if (!reported) {
                reported = true;
                if (typeof reportRecallResultToDashboard === 'function') {
                    reportRecallResultToDashboard(actIndex, questionIdx, false, false, 1);
                }
            }
            feedbackEl.className = 'act-recall-feedback feedback-nudge';
            setFeedback(feedbackEl, 'Not quite. Try again.',
                        q.nudge || 'Think it through once more.', null);
        } else {
```

Note: this records first-try outcome only. If they later get it right after a
wrong first try, the entry already has `firstTry=false`; we deliberately do not
overwrite it to `correct=true` because the miss metric is first-try. (Optional
future: a second write updating `correct` once solved — out of scope here.)

- [ ] **Step 4: Syntax check.**

```bash
node --check js/ui.js && echo "ui.js parses OK"
```

Expected: `ui.js parses OK`.

- [ ] **Step 5: Commit.**

```bash
git add js/ui.js
git commit -m "Recall: report first-try result to dashboard on first answer"
```

### Task 6: Add the recall validation rule to database.rules.json

**Files:**
- Modify: `database.rules.json` (add `recall` sibling to `progress` under `rooms/$roomCode`)

- [ ] **Step 1: Add the `recall` node** after the `progress` block (after its closing `},` inside `$roomCode`):

```json
        "recall": {
          ".write": true,
          "$studentId": {
            "$qKey": {
              ".validate": "newData.hasChildren(['name', 'firstTry', 'lastSeen']) && newData.child('name').isString() && newData.child('name').val().length <= 30 && newData.child('firstTry').isBoolean() && newData.child('lastSeen').isNumber()"
            }
          }
        },
```

- [ ] **Step 2: Validate JSON.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node -e 'JSON.parse(require("fs").readFileSync("database.rules.json","utf8")); console.log("rules JSON valid");'
```

Expected: `rules JSON valid`.

- [ ] **Step 3: Commit.** (Note in commit body that rules must be published in Firebase console or via `firebase deploy --only database`.)

```bash
git add database.rules.json
git commit -m "Firebase rules: validate rooms/*/recall node (publish required)"
```

### Task 7: Add the Questions tab to teacher.html

**Files:**
- Modify: `teacher.html` (tab button ~line 404; tab CSS ~line 307; a `#questionsView` main ~line 442; JS: state, subscribe, switchTab, render, clear; load acts.js for labels)

- [ ] **Step 1: Load acts.js for question labels.** Add after the battles.js script tag (line ~458):

```html
    <script src="js/data/acts.js"></script>
```

- [ ] **Step 2: Add the tab button** after the Global button (line ~404):

```html
        <button class="tab-btn" data-tab="questions" type="button">Questions</button>
```

- [ ] **Step 3: Add show/hide CSS** after the global tab block (line ~313):

```css
        #questionsView { display: none; }
        body.tab-questions #questionsView { display: block; }
        body.tab-questions #dashboardMain { display: none; }
        body.tab-questions #sortControlGroup,
        body.tab-questions #clearAllBtn { display: none; }
        .q-act-group { margin: 18px 0 6px; font-weight: 700; color: #333; }
        .q-row { cursor: pointer; }
        .q-miss-hi { color: #b3261e; font-weight: 700; }
        .q-names { font-size: 13px; color: #555; padding: 4px 10px 10px; }
```

- [ ] **Step 4: Add the view container** after `#globalView` (line ~442):

```html
    <main id="questionsView">
        <table class="lb-table" id="questionsTable">
            <thead><tr><th>Question</th><th>Students</th><th>Missed first try</th></tr></thead>
            <tbody id="questionsBody"></tbody>
        </table>
        <p id="questionsEmpty" style="padding:16px;color:#777;display:none;">No recall answers recorded yet.</p>
    </main>
```

- [ ] **Step 5: Extend state + subscribe.** In the `state` object (line ~492) add `recallRows: {}`. In `init`, alongside the progress subscription loop (line ~522), subscribe to recall per room:

```javascript
            Object.keys(rooms).forEach(function(period) {
                var rcode = rooms[period];
                firebaseLeaderboard.subscribeToRecall(rcode, function(rows, rerr) {
                    if (rerr) return;
                    state.recallRows[period] = (rows || []).map(function(r) { r.period = period; return r; });
                    if (state.tab === 'questions') renderQuestions();
                });
            });
```

- [ ] **Step 6: Extend switchTab** (line ~853) to handle `questions`:

```javascript
        function switchTab(tab) {
            if (tab !== 'leaderboard' && tab !== 'global' && tab !== 'questions') tab = 'progress';
            state.tab = tab;
            document.body.classList.toggle('tab-leaderboard', tab === 'leaderboard');
            document.body.classList.toggle('tab-global', tab === 'global');
            document.body.classList.toggle('tab-questions', tab === 'questions');

            var btns = document.querySelectorAll('#tabBar .tab-btn');
            for (var i = 0; i < btns.length; i++) {
                btns[i].classList.toggle('active', btns[i].dataset.tab === tab);
            }

            if (tab === 'leaderboard') {
                loadLeaderboard();
            } else if (tab === 'global') {
                loadGlobalLeaderboard();
            } else if (tab === 'questions') {
                renderQuestions();
            }
        }
```

- [ ] **Step 7: Add `renderQuestions`** near the other render functions (before `renderCodeChips`, ~line 822). Aggregates by qKey, respects the period filter, worst-first, expandable names. Uses `acts` (loaded in Step 1) for labels via the teacher reference tier `intermediate`.

```javascript
        function questionLabel(qKey) {
            // qKey = "<actIndex>_<qIndex>"
            var parts = qKey.split('_');
            var ai = parseInt(parts[0], 10), qi = parseInt(parts[1], 10);
            try {
                var q = acts[ai].recall.intermediate[qi] ||
                        acts[ai].recall.beginner[qi];
                if (q && q.question) return 'Act ' + acts[ai].number + ' Q' + (qi + 1) + ': ' + q.question;
            } catch (e) {}
            return 'Act ' + (ai + 1) + ' Q' + (qi + 1);
        }

        function renderQuestions() {
            var body = document.getElementById('questionsBody');
            var empty = document.getElementById('questionsEmpty');
            body.innerHTML = '';

            // Flatten rows across periods, applying the active period filter.
            var rows = [];
            Object.keys(state.recallRows).forEach(function(p) {
                if (state.filter !== 'all' && state.filter !== p) return;
                rows = rows.concat(state.recallRows[p] || []);
            });

            if (!rows.length) { empty.style.display = ''; return; }
            empty.style.display = 'none';

            // Aggregate by qKey.
            var agg = {};
            rows.forEach(function(r) {
                var k = r.qKey;
                if (!agg[k]) agg[k] = { total: 0, missed: 0, names: [] };
                agg[k].total++;
                if (r.firstTry === false) {
                    agg[k].missed++;
                    agg[k].names.push(r.name || 'Student');
                }
            });

            // Sort worst-first by miss rate.
            var keys = Object.keys(agg).sort(function(a, b) {
                var ra = agg[a].missed / agg[a].total, rb = agg[b].missed / agg[b].total;
                return rb - ra;
            });

            keys.forEach(function(k) {
                var a = agg[k];
                var rate = Math.round((a.missed / a.total) * 100);

                // Build cells with textContent (no innerHTML) so student-entered
                // names can never inject HTML, matching the app's XSS-safe DOM style.
                var tr = document.createElement('tr');
                tr.className = 'q-row';
                var tdQ = document.createElement('td');
                tdQ.textContent = questionLabel(k);
                var tdN = document.createElement('td');
                tdN.textContent = String(a.total);
                var tdR = document.createElement('td');
                tdR.textContent = rate + '%';
                if (rate >= 40) tdR.className = 'q-miss-hi';
                tr.appendChild(tdQ); tr.appendChild(tdN); tr.appendChild(tdR);

                var namesTr = document.createElement('tr');
                namesTr.style.display = 'none';
                var tdNames = document.createElement('td');
                tdNames.setAttribute('colspan', '3');
                tdNames.className = 'q-names';
                tdNames.textContent = a.names.length
                    ? 'Missed first try: ' + a.names.join(', ')
                    : 'No first-try misses.';
                namesTr.appendChild(tdNames);

                tr.addEventListener('click', function() {
                    namesTr.style.display = (namesTr.style.display === 'none') ? '' : 'none';
                });
                body.appendChild(tr);
                body.appendChild(namesTr);
            });
        }
```

- [ ] **Step 8: Hook the period filter to also refresh Questions.** In `wireControls`, the filterGroup handler (line ~556) already calls `render()` and conditionally `renderLeaderboard()`. Add:

```javascript
                if (state.tab === 'leaderboard') renderLeaderboard();
                if (state.tab === 'questions') renderQuestions();
```

- [ ] **Step 9: Hook refresh button** (line ~564) to support questions: add an `else if (state.tab === 'questions') { renderQuestions(); }` branch alongside the existing leaderboard/global branches.

- [ ] **Step 10: Validate the HTML loads (no JS syntax error in the inline script).** Extract and parse the inline script:

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node -e '
const fs=require("fs");
const html=fs.readFileSync("teacher.html","utf8");
const m=html.match(/<script>\n([\s\S]*?)<\/script>/);
if(!m){console.error("no inline script found");process.exit(1);}
fs.writeFileSync("/tmp/recall-verify/teacher-inline.js", m[1]);
'
node --check /tmp/recall-verify/teacher-inline.js && echo "teacher.html inline script parses OK"
```

Expected: `teacher.html inline script parses OK`.

- [ ] **Step 11: Commit.**

```bash
git add teacher.html
git commit -m "Dashboard: add Questions tab (first-try miss rate, expandable names)"
```

### Task 8: Manual live verification

- [ ] **Step 1: Serve locally and play through Act I recall.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
python3 -m http.server 8123 >/dev/null 2>&1 &
echo "open http://localhost:8123/  (set a class code AMS-p1..p5 first), play to an Act review, answer recall questions"
```

- [ ] **Step 2: Open the dashboard and confirm.** Open `http://localhost:8123/teacher.html`, password `amsmustangs`, click **Questions**. Confirm: a row per answered question, miss rate %, worst-first order, clicking a row expands the names of first-try missers. Confirm the period filter narrows results. Confirm answering with no class code set produces NO recall row (gating works).

- [ ] **Step 3: Confirm offline safety.** With DevTools offline, answer a recall question; confirm no console error and play continues (graceful degradation).

- [ ] **Step 4: Stop the server.**

```bash
pkill -f "http.server 8123" 2>/dev/null || true
```

---

## Self-review notes

- **Spec coverage:** Part 1 rewrite -> Tasks 1-2 (+ length assertion). Data model -> Task 3 (`recall/<studentId>/<actIndex>_<qIndex>` with name/period/correct/firstTry/attempts/lastSeen). firebase fns -> Task 3. ui.js hook -> Task 5 (reuses existing state machine via `reported` flag, reports first-try). app.js gated reporter -> Task 4. DB rules -> Task 6. Dashboard Questions tab w/ first-try miss rate + per-student names + period filter + worst-first -> Task 7. Verification -> Tasks 2 (assertion) + 8 (live). All spec sections covered.
- **No placeholders:** every code/command step is concrete. Task 2 Step 1 is the one workflow-driven step; its inputs/outputs and the gating assertion (Step 2) are fully specified.
- **Type/name consistency:** `writeRecallResult(roomCode, actIndex, qIndex, result, callback)` with `result={name,period,correct,firstTry,attempts}` is identical in Task 3 (def), Task 4 (call), and the data model. `subscribeToRecall` row shape (`studentId,qKey,name,period,correct,firstTry,attempts,lastSeen`) matches the dashboard's `renderQuestions` usage (`r.qKey`, `r.firstTry`, `r.name`). qKey format `"<actIndex>_<qIndex>"` consistent across write, rules (`$qKey`), and `questionLabel`.
- **Gating:** recall reporter copies `reportProgressToDashboard` gating exactly (historical mode + `getSavedClassCode` -> `periodForRoom`), so no stranger writes — matches the privacy posture of the existing dashboard.
