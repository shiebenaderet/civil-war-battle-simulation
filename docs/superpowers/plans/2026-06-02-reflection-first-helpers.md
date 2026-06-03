# Reflection-First Flow + Tier-Graduated Helpers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** At each act end, show the reflection prompt with tier-graduated brainstorm helpers BEFORE the comprehension quiz, so students get scaffolded support to write their handout answer before being checked.

**Architecture:** Two changes in `js/ui.js`: (1) flip the act-end order by swapping which screen `case 5` enters and what each screen's Continue does, governed by the unchanged `completedRecalls` guard; (2) add a `helpers` data block to each `groupedReflections` entry and render two bright, tier-resolved helper boxes on the reflect screen. New markup in `index.html`, new CSS in `css/styles.css`. No change to the saved `gameState` shape, so in-progress students are unaffected.

**Tech Stack:** Vanilla JS, no build step, `file://`-safe. Verification via Node logic tests + served-page smoke tests.

---

## CRITICAL: in-progress students must not be affected

A large number of students are mid-game. The saved object (`gameState` in
localStorage key `civilWarSave`) is NOT changed in shape by this plan: no field
is added, removed, renamed, or reinterpreted. The order flip is computed live at
the act-end (`case 5` in `advanceNarrative`) from `currentBattle` +
`completedRecalls`, which already exist in every save. Task 7 explicitly verifies
this. Deploy when no class is mid-act if possible (after school / weekend), since
the only seam is a student sitting exactly on an act-end screen who refreshes
during the deploy.

---

## File structure

- `js/ui.js`: `groupedReflections` gets a `helpers` field per entry (Task 1, content). `showGroupedReflection` renders the helper boxes (Task 4). `case 5` of `advanceNarrative` and the recall `onContinue` swap order (Task 6).
- `index.html`: two helper-box containers in the reflect section (Task 3).
- `css/styles.css`: `.reflect-helper` bright box styles (Task 3).

---

## Task 1: Draft the 32 helper content sets (REVIEW GATE)

**Files:**
- Create: `docs/superpowers/specs/helper-content-draft.md` (for teacher review; not shipped code)

This task produces the helper text for teacher approval BEFORE any of it goes
into code. 4 acts x 2 helpers (`reflection`, `unionWin`) x 4 tiers (`extra`,
`beginner`, `intermediate`, `advanced`) = 32 sets. Graduation by tier:

- `extra` (★ Most Support): ONE near-complete sentence frame with 1-2 `______`
  blanks the student finishes. Supplies the history + structure.
- `beginner` (★★ More Support): a light starter sentence + ONE brainstorm
  question.
- `intermediate` (★★★ Standard): 3-4 brainstorm questions (hypotheticals,
  start-vs-end comparisons, "what changed"). Never the answer, never stems.
- `advanced` (★★★★ Extra Challenge): 3-4 analytical questions pushing toward
  evidence/argument; no frame.

- [ ] **Step 1: Write the draft** to `docs/superpowers/specs/helper-content-draft.md`, grounded in each act's existing `groupedReflections[i].prompt` text and the act's battle facts. Use the teacher's Act I example as the model for the `reflection` helper voice ("If 20,000 Americans were hurt in two days today, how would people react? Would they want revenge? A bigger army? How did the war get worse from the first battle to the third, not just deaths, but cost and fear?"). The `unionWin` helper sparks the handout's "one way this act helped the Union win" line ("What did the North gain this act it didn't have before? A new advantage? A weakness in the South? A reason more people joined?"). Lay it out as a table or per-act sections so the teacher can read all 32 quickly.

- [ ] **Step 2: Teacher review.** Present the draft. Incorporate edits. DO NOT proceed to Task 2 until the teacher approves the wording.

- [ ] **Step 3: Commit the approved draft.**

```bash
git add docs/superpowers/specs/helper-content-draft.md
git commit -m "Helper content: approved draft for reflection + unionWin (all tiers)"
```

## Task 1b: Align the in-game reflection prompt to the handout question

**Files:**
- Modify: `js/ui.js` (`groupedReflections[i].prompt`, the four `prompt` objects)

The in-game reflection prompt and the handout reflection question were different
questions. Since students write on the handout, the on-screen prompt must MATCH
the handout question verbatim per tier, so screen and paper reinforce each other.

The 16 verbatim handout questions (4 tiers x 4 acts) are extracted in
`/tmp/handout-questions.json` (re-extract if missing — see the command below).
Replace each `groupedReflections[i].prompt.{extra,beginner,intermediate,advanced}`
with that tier's exact handout reflection question for act `i`.

- [ ] **Step 1: Re-extract the verbatim questions** (idempotent; source of truth is the handouts):

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
python3 -c "
import re, json
files={'extra':'extra-support','beginner':'some-support','intermediate':'standard','advanced':'advanced'}
out={}
for tier,f in files.items():
    s=open('handouts/battle-journal-'+f+'.html').read()
    parts=re.split(r'<div class=\"reflect-box\">', s)[1:]
    out[tier]=[re.findall(r'rtext[^>]*>([^<]+)<', b)[0].strip() for b in parts[:4]]
open('/tmp/handout-questions.json','w').write(json.dumps(out,indent=1))
print('re-extracted', sum(len(v) for v in out.values()), 'questions')
"
```

- [ ] **Step 2: Replace the four `prompt` objects** in `groupedReflections`
(ui.js, the `prompt: { extra/beginner/intermediate/advanced }` blocks at lines
~435, ~464, ~493, ~522). Each tier value becomes the exact string from
`/tmp/handout-questions.json` for that act+tier. (`extra` and `beginner` share the
same question text per act; `intermediate` and `advanced` differ. The strings
contain apostrophes/quotes — JSON-encode or escape them properly in the JS.)

- [ ] **Step 3: Verify the in-game prompts now equal the handout questions.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node -e '
const fs=require("fs"),vm=require("vm");
const c={};vm.createContext(c);vm.runInContext(fs.readFileSync("js/ui.js","utf8")+"\nthis.G=groupedReflections;",c);
const h=JSON.parse(fs.readFileSync("/tmp/handout-questions.json","utf8"));
const tiers=["extra","beginner","intermediate","advanced"];
let fail=[];
c.G.forEach((g,i)=>tiers.forEach(t=>{ if(g.prompt[t]!==h[t][i]) fail.push("act "+i+" "+t+" prompt != handout question"); }));
if(fail.length){console.error("FAILS:\n"+fail.join("\n"));process.exit(1);}
console.log("PASS: all 16 in-game prompts match handout questions verbatim");
'
```

Expected: `PASS: all 16 in-game prompts match handout questions verbatim`.

- [ ] **Step 4: Commit.**

```bash
node --check js/ui.js && echo "ui.js OK"
git add js/ui.js
git commit -m "Reflection: align in-game prompts to handout questions (screen = paper)"
```

## Task 2: Add the helpers data to groupedReflections

**Files:**
- Modify: `js/ui.js` (`groupedReflections`, starts line 431)

- [ ] **Step 1: Add a `helpers` key to each of the 4 entries** using the approved
Task 1 text. Shape (shown for Act I; repeat structurally for all four with that
act's approved content):

```javascript
        helpers: {
            reflection: {
                extra: [
                    "The war got worse fast. At Fort Sumter, nobody died. But at Shiloh, 23,000 soldiers were hurt or killed in two days. This made people feel ______ because ______."
                ],
                beginner: [
                    "At first people thought the war would be quick and easy. By Shiloh, that was clearly wrong.",
                    "Think about: if thousands of people got hurt this fast, would people want revenge, a bigger army, or to stop fighting?"
                ],
                intermediate: [
                    "If 20,000 Americans were hurt in two days today, how would people react?",
                    "Would they want revenge? A bigger army? To give up?",
                    "How did the war get worse from the first battle to the third, not just in deaths, but in cost and fear?"
                ],
                advanced: [
                    "What specific evidence from Fort Sumter, Bull Run, and Shiloh shows assumptions about the war changing?",
                    "Was the escalation driven more by choices people made or by forces no one controlled?",
                    "Does the evidence support Grant's 'complete conquest' conclusion, or complicate it?"
                ]
            },
            unionWin: {
                extra: [
                    "This act helped the Union because it learned ______. One thing that got stronger for the North was ______."
                ],
                beginner: [
                    "Think about what the North learned or gained in these three battles.",
                    "Did the Union realize it needed a bigger army? A different plan? More time?"
                ],
                intermediate: [
                    "What did the North gain this act that it didn't have at the start?",
                    "Did the Union learn something about how long or hard the war would be?",
                    "How could realizing the war would be long actually help the Union later?"
                ],
                advanced: [
                    "How did the shock of Shiloh reshape Union strategy in a way that helped them win the long war?",
                    "What advantage did the North have that mattered more as the war got longer and bloodier?",
                    "How does an early, painful lesson sometimes strengthen the side that survives it?"
                ]
            }
        },
```

(Acts II-IV use their own approved content from Task 1, same structure. The
`extra`/`beginner` entries may contain `______` blanks rendered literally.)

- [ ] **Step 2: Syntax check + commit.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node --check js/ui.js && echo "ui.js parses OK"
git add js/ui.js
git commit -m "Reflection helpers: add tier-graduated helper data to all 4 acts"
```

## Task 3: Helper-box markup + CSS

**Files:**
- Modify: `index.html` (reflect section), `css/styles.css`

- [ ] **Step 1: Find the reflect section** and the prompt element. The reflect
prompt is `#histReflectPrompt` (set in `showGroupedReflection`). Locate it:

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
grep -n 'id="histReflectPrompt"\|id="sectionReflect"\|id="histReflectReviewLink"' index.html
```

- [ ] **Step 2: Add the two helper-box containers** immediately AFTER the
`#histReflectPrompt` element in `index.html`:

```html
                <div id="reflectHelperReflection" class="reflect-helper" style="display:none;">
                    <div class="reflect-helper-label">For your reflection answer</div>
                    <div class="reflect-helper-head"></div>
                    <ul class="reflect-helper-list"></ul>
                </div>
                <div id="reflectHelperUnion" class="reflect-helper" style="display:none;">
                    <div class="reflect-helper-label">For your "how this act helped the Union win" line</div>
                    <div class="reflect-helper-head"></div>
                    <ul class="reflect-helper-list"></ul>
                </div>
```

- [ ] **Step 3: Add CSS** (append to `css/styles.css`):

```css
/* Reflection brainstorm helpers (tier-graduated) */
.reflect-helper {
    background: #fbf3d9;
    border: 2px solid var(--color-accent, #6b2419);
    border-left-width: 6px;
    padding: var(--space-3) var(--space-4);
    margin: var(--space-3) 0;
    border-radius: 3px;
}
.reflect-helper-label {
    font-family: 'Special Elite', monospace;
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-accent, #6b2419);
    margin-bottom: var(--space-1);
}
.reflect-helper-head { font-weight: 700; margin-bottom: var(--space-2); }
.reflect-helper-list { margin: 0; padding-left: 1.2em; }
.reflect-helper-list li { margin-bottom: var(--space-1); line-height: 1.5; }
```

- [ ] **Step 4: Verify markup + commit.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
grep -c 'id="reflectHelperReflection"' index.html
grep -c 'reflect-helper' css/styles.css
git add index.html css/styles.css
git commit -m "Reflection helpers: bright helper-box markup + CSS"
```

## Task 3b: Glossary tooltips for academic terms in helpers

**Files:**
- Modify: `js/data/glossary.js` (add entries), `js/ui.js` (`renderReflectHelper` applies the glossary linker)

The helpers introduce academic/specialized terms ("Pyrrhic victory", "Clausewitz",
"friction" in the military sense, "Reconstruction", "reconciliation", "complete
conquest", "tactical"/"strategic", etc.) that are NOT in the current glossary.
Any term hard enough to need explaining MUST be click-to-define, at EVERY tier
(an advanced reader is still an 8th grader). The exact term list comes from the
content audit (its `hardTerms` output).

- [ ] **Step 1: Add a glossary entry per audited hard term** to `js/data/glossary.js`,
following the existing entry shape (`{ term, tier: 'distinctive', aliases?, definition }`)
with a plain-language, 8th-grade definition. Use the audit's `hardTerms` list as the
authoritative set. Example entries:

```javascript
    { term: "Pyrrhic victory", tier: "distinctive",
      definition: "A victory that costs the winner so much that it almost feels like a defeat. Named after King Pyrrhus, who won battles but lost so many soldiers he could not keep fighting." },

    { term: "Reconstruction", tier: "distinctive",
      definition: "The period after the Civil War (1865-1877) when the United States tried to rebuild the South and decide the rights of newly freed people." },

    { term: "reconciliation", tier: "distinctive",
      definition: "Bringing two sides back together peacefully after a conflict, instead of punishing the losing side." },

    { term: "friction", tier: "distinctive",
      definition: "A military idea (from the thinker Clausewitz) that real war is full of small accidents, confusion, and mistakes that no plan can fully control." },

    { term: "Clausewitz", tier: "distinctive",
      definition: "Carl von Clausewitz, a famous Prussian military thinker who wrote about how chaos and chance shape real wars." }
```

(Add every term the audit flagged; the five above are illustrative. Match the
file's comment style and ordering convention.)

- [ ] **Step 2: Apply the glossary linker when rendering helpers.** In
`renderReflectHelper` (Task 4), instead of `li.textContent = line`, use the same
`applyGlossary` path the game uses for reading text, so the new terms become
clickable `.vocab-term` tooltips. Find the signature:

```bash
grep -n "function applyGlossary" js/ui.js
```

Use it on each `li` (it handles safe DOM insertion). If `applyGlossary(el, text)`
sets the element's content from `text`, replace the `textContent` assignment in
Task 4's loop with `applyGlossary(li, line)`.

- [ ] **Step 3: Verify** the glossary loads and the new terms are present.

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node --check js/data/glossary.js && echo "glossary.js OK"
node -e '
const fs=require("fs"),vm=require("vm");const c={};vm.createContext(c);
vm.runInContext(fs.readFileSync("js/data/glossary.js","utf8")+"\nthis.g=glossary;",c);
const have=c.g.map(e=>e.term.toLowerCase());
["pyrrhic victory","reconstruction","reconciliation","friction"].forEach(t=>{
  console.log((have.includes(t)?"OK ":"MISSING ")+t);
});
'
```

- [ ] **Step 4: Commit.**

```bash
git add js/data/glossary.js
git commit -m "Glossary: add academic terms used in reflection helpers (tooltips)"
```

## Task 4: Render the helper boxes (tier-resolved, live-updating)

**Files:**
- Modify: `js/ui.js` (`showGroupedReflection`, ~line 1613; add a helper-render fn)

- [ ] **Step 1: Add a render function** near `showGroupedReflection`. It resolves
the current tier with the same `resolveDifficulty` the app uses, applies the
extra->beginner->intermediate fallback, and fills a box via `textContent` (XSS-safe).

```javascript
// Render one tier-graduated helper box. `helperData` is the per-helper object
// { extra:[...], beginner:[...], intermediate:[...], advanced:[...] }.
function renderReflectHelper(boxId, helperData) {
    var box = document.getElementById(boxId);
    if (!box) return;
    var headEl = box.querySelector('.reflect-helper-head');
    var listEl = box.querySelector('.reflect-helper-list');
    if (!headEl || !listEl) { box.style.display = 'none'; return; }

    // Resolve tier with fallback chain (extra -> beginner -> intermediate).
    var tier = (typeof resolveDifficulty === 'function') ? resolveDifficulty(helperData) : 'intermediate';
    var lines = helperData && (helperData[tier]
        || helperData.extra || helperData.beginner || helperData.intermediate);
    if (!lines || !lines.length) { box.style.display = 'none'; return; }

    // Frame tiers (extra/beginner with a blank) get a "try finishing this" head;
    // question tiers get "think about these".
    var isFrame = (tier === 'extra' || tier === 'beginner');
    headEl.textContent = isFrame
        ? 'Not sure what to write? Try this:'
        : 'Not sure what to write? Think about these:';

    while (listEl.firstChild) listEl.removeChild(listEl.firstChild);
    lines.forEach(function(line) {
        // A line beginning with "Stuck?" is the Extra Challenge thinking-move
        // footer: render it set apart from the question bullets, not as a bullet.
        if (/^Stuck\?/.test(line)) {
            var foot = document.createElement('div');
            foot.className = 'reflect-helper-stuck';
            applyGlossary(foot, line); // glossary-linked like the rest (Task 3b)
            listEl.parentNode.appendChild(foot);
            return;
        }
        var li = document.createElement('li');
        applyGlossary(li, line); // Task 3b: glossary tooltips; replaces textContent
        listEl.appendChild(li);
    });
    box.style.display = '';
}
```

Add CSS (with the Task 3 styles) for the set-apart footer:

```css
.reflect-helper-stuck {
    margin-top: var(--space-2);
    padding-top: var(--space-2);
    border-top: 1px dashed var(--color-accent, #6b2419);
    font-style: italic;
    font-size: var(--font-size-sm);
}
```

- [ ] **Step 2: Call it from `showGroupedReflection`.** After the prompt is set
(after the `promptEl.innerHTML = ...` block, ~line 1625), add:

```javascript
    var helpers = group.helpers || {};
    renderReflectHelper('reflectHelperReflection', helpers.reflection);
    renderReflectHelper('reflectHelperUnion', helpers.unionWin);
```

- [ ] **Step 3: Live update on reading-level switch.** Find where the reflect
prompt re-renders when the reading pill changes (the same path that re-runs
`showGroupedReflection` or updates `#histReflectPrompt` on tier change):

```bash
grep -n "showGroupedReflection\|histReflectPrompt\|sectionReflect" js/ui.js
```

Confirm the tier-switch handler re-invokes `showGroupedReflection` (which now
re-renders the helpers). If the tier-switch path updates the prompt WITHOUT
calling `showGroupedReflection`, add the two `renderReflectHelper` calls there too
so the boxes update live. (Determine the exact handler at implementation time;
the requirement is: switching tiers on the reflect screen updates both boxes.)

- [ ] **Step 4: Syntax check + commit.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node --check js/ui.js && echo "ui.js parses OK"
git add js/ui.js
git commit -m "Reflection helpers: render tier-resolved boxes, live tier switch"
```

## Task 5: Verify helper rendering logic

**Files:**
- Test: inline Node script

- [ ] **Step 1: Run the logic test** (mirrors `renderReflectHelper`'s resolution).

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node -e '
const fs=require("fs"),vm=require("vm");
const c={}; vm.createContext(c); vm.runInContext(fs.readFileSync("js/ui.js","utf8")+"\nthis.G=groupedReflections;this.rd=resolveDifficulty;",c);
const G=c.G;
let fail=[];
if(G.length!==4) fail.push("expected 4 reflection groups, got "+G.length);
G.forEach((g,i)=>{
  if(!g.helpers) { fail.push("act "+i+" missing helpers"); return; }
  ["reflection","unionWin"].forEach(h=>{
    const hd=g.helpers[h];
    if(!hd){fail.push("act "+i+" missing helpers."+h);return;}
    ["extra","beginner","intermediate","advanced"].forEach(t=>{
      if(!Array.isArray(hd[t])||!hd[t].length) fail.push("act "+i+" "+h+"."+t+" empty");
    });
    // frame tiers should contain a blank marker
    if(!/_{3,}/.test(hd.extra.join(""))) fail.push("act "+i+" "+h+".extra has no ______ blank");
  });
});
if(fail.length){console.error("FAILS:\n"+fail.join("\n"));process.exit(1);}
console.log("PASS: 4 acts x 2 helpers x 4 tiers present; extra tiers have blanks");
'
```

Expected: `PASS: 4 acts x 2 helpers x 4 tiers present; extra tiers have blanks`.

- [ ] **Step 2: Commit** (only if Task 2 content needed a fix).

## Task 6: Flip the act-end order

**Files:**
- Modify: `js/ui.js` (`case 5` in `advanceNarrative` ~line 1936; recall `onContinue` ~line 1229; `showReflectionStep` Continue text ~line 874)

Behavior contract (fixed): act end is `reflection -> quiz -> next`. The
`completedRecalls` guard still controls whether the act-end shows at all.

- [ ] **Step 1: `case 5` enters reflection first.** Change the reflection-battle
branch (ui.js ~1938) so it ALWAYS shows the reflection step first (the quiz is now
launched from the reflection screen's Continue):

```javascript
        case 5:
            // RECALL or REFLECT — v3.24: reflection now comes BEFORE the quiz.
            if (isReflectionBattle(gameState.currentBattle)) {
                showReflectionStep();
            } else {
                // Non-reflection battle: save WWYD choice and advance. (unchanged)
                var wwydChoiceText = '';
                if (wwydSelected >= 0) {
                    var c = getHistoricalContent();
                    var opts = c.whatWouldYouDo.options;
                    if (opts && opts[wwydSelected]) wwydChoiceText = opts[wwydSelected];
                }
                saveHistoricalResponse(wwydChoiceText, '', wwydSelected);
```

(Keep the rest of the `else` branch as-is.)

- [ ] **Step 2: Reflection's Continue launches the quiz when due.** The reflect
screen's Continue calls `advanceNarrative()` (app.js), which will run a NEXT
`case`. The cleanest, lowest-risk approach: in `showReflectionStep`, after wiring
the Review link, override the Continue button to branch into the quiz when an
act-end quiz is still pending. Replace the existing `continueBtn` text block in
`showReflectionStep` (ui.js ~874-878) with a cloned-button handler:

```javascript
    var isLast = gameState.currentBattle >= battles.length - 1;
    var continueBtn = document.getElementById('narrativeContinueBtn');
    if (continueBtn) {
        // v3.24: from the reflection screen, Continue goes to the act quiz first
        // (if not already done), THEN advances. Use a cloned button so this
        // handler does not stack with the global advanceNarrative listener.
        var actIdx2 = (typeof getActForBattle === 'function') ? getActForBattle(gameState.currentBattle) : -1;
        var quizPending = (typeof shouldShowActRecall === 'function') && shouldShowActRecall(gameState.currentBattle);
        var fresh = continueBtn.cloneNode(true);
        continueBtn.parentNode.replaceChild(fresh, continueBtn);
        fresh.disabled = false;
        if (quizPending && actIdx2 !== -1) {
            fresh.textContent = 'Continue to Quick Check →';
            fresh.addEventListener('click', function() { renderActRecall(actIdx2); });
        } else {
            fresh.textContent = isLast ? 'Complete Historical Mode' : 'Next Battle →';
            fresh.addEventListener('click', function() { advanceNarrative(); });
        }
    }
```

Note: cloning `narrativeContinueBtn` removes the global app.js click listener for
THIS render only; the explicit `advanceNarrative()` handler above preserves the
normal advance. On the next battle screen the button is re-rendered by the normal
flow, so the global listener path resumes. Verify in Task 7 that a normal
(non-act-end) reflection still advances correctly — non-reflection battles never
enter `showReflectionStep`, so only the four act-end battles use this path.

- [ ] **Step 3: Quiz's final Continue advances instead of showing reflection.**
In `renderActRecall`'s `onContinue` (ui.js ~1229), the all-questions-done branch
currently calls `showReflectionStep()`. Change it to advance to the next battle,
since reflection already happened:

```javascript
    function onContinue() {
        questionIdx++;
        if (questionIdx >= questions.length) {
            // All questions resolved — mark act recall complete, then advance.
            gameState.completedRecalls = (gameState.completedRecalls || []);
            if (gameState.completedRecalls.indexOf(actIndex) === -1) {
                gameState.completedRecalls.push(actIndex);
            }
            if (typeof saveProgress === 'function') saveProgress();
            // v3.24: reflection already happened before the quiz — go to next battle.
            advanceNarrative();
        } else {
            renderQuestion();
        }
    }
```

Caveat to verify: `advanceNarrative()` is step-based (`narrativeStep`). After the
quiz, `narrativeStep` is still at the act-end value (5). Confirm in Task 7 that
calling `advanceNarrative()` here lands on the next battle. If `narrativeStep`
state makes that unreliable, replace `advanceNarrative()` with the direct
next-battle call the non-reflection path uses (read `case 5`'s `else` branch and
the `saveHistoricalResponse(...)` + advance it performs, and mirror its advance
step). The behavior contract is: quiz Continue -> next battle (or Complete on the
last act).

- [ ] **Step 4: Update the two `showReflectionStep` callers that ALSO exist** at
ui.js ~1063 and ~1078 (the data-missing / no-questions skip branches in
`renderActRecall`). Those call `showReflectionStep()` when recall is skipped. With
the flip, the recall is now reached FROM reflection, so a skip should advance, not
loop back to reflection. Change both skip branches in `renderActRecall` from
`showReflectionStep();` to `advanceNarrative();` (same advance the onContinue now
uses), keeping the `completedRecalls` marking above them.

- [ ] **Step 5: Syntax check + commit.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
node --check js/ui.js && echo "ui.js parses OK"
git add js/ui.js
git commit -m "Act end: reflection before the comprehension quiz (v3.24)"
```

## Task 7: Verify order flip + save compatibility (manual)

- [ ] **Step 1: Save-shape check.** Confirm no field added/removed from the saved
object. The flip reads existing fields only:

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
grep -n "gameState = {" js/game.js
# Confirm no new persisted field was introduced by this change:
git diff 199c813 -- js/game.js | grep -E "^\+|^-" || echo "game.js unchanged by this feature (expected)"
```

Expected: `game.js` has no feature changes (save shape untouched).

- [ ] **Step 2: Manual playthrough.** Serve locally; play to the last battle of
Act I (Shiloh). Confirm the sequence is now: outcome -> **reflection screen with
two bright helper boxes** -> click Continue -> **comprehension quiz** -> finish
quiz -> **Act II's first battle**. Switch the reading pill on the reflect screen
through all four tiers and confirm both helper boxes change (frame at ★/★★,
questions at ★★★/★★★★) and update live.

```bash
python3 -m http.server 8134 >/dev/null 2>&1 &
echo "open http://localhost:8134/ , play Historical Mode to Shiloh"
# pkill -f 'http.server 8134' when done
```

- [ ] **Step 3: Mid-game compatibility.** In DevTools, set a save mid-game to
simulate an in-progress student, e.g.:

```js
localStorage.setItem('civilWarSave', JSON.stringify({mode:'historical', currentBattle:4, completedRecalls:[0], difficulty:'intermediate', side:'union', responses:[]}));
```

Reload, resume, and confirm the student continues normally (no reset, no error,
lands at battle 5 with Act I recall still marked done).

- [ ] **Step 4: Replay guard.** Reach an act end, complete reflection + quiz, then
open the campaign log and revisit a battle. Confirm the completed act-end does NOT
re-trigger (the `completedRecalls` guard holds).

## Task 8: Version bump + docs

**Files:**
- Modify: `index.html` (version), `README.md`

- [ ] **Step 1: Bump version** in `index.html` from v3.23.0 to v3.24.0.

```bash
grep -n "Civil War Battle Simulation v3.23.0" index.html
```
Change to `v3.24.0`.

- [ ] **Step 2: README version-history entry** at the top of the history list:

```markdown
- **v3.24.0** - Reflection before the quiz, with brainstorm helpers. Each act now ends with the reflection prompt first (so students write their handout answer), then the comprehension quiz as a check. Two bright "Not sure what to write?" helper boxes scaffold the writing and scale by reading level: a sentence frame to finish at Most Support, a light starter plus a question at More Support, brainstorm questions at Standard, and analytical questions at Extra Challenge. One helper for the act reflection, one for the "how this act helped the Union win" line.
```

- [ ] **Step 3: Commit + (teacher) deploy note.**

```bash
git add index.html README.md
git commit -m "Docs: reflection-first + helpers, bump to v3.24.0"
```

Remind the teacher: deploy (push reaches GitHub Pages) is safe for in-progress
students per Task 7, but ideally push when no class is mid-act.

---

## Self-review notes

- **Spec coverage:** order flip -> Task 6 (case 5 + both Continue handlers + skip branches). Tier-graduated helpers data -> Tasks 1-2. Two labeled boxes, always visible, bright -> Task 3. Tier resolution + live update -> Task 4. Fallback chain + hide-when-empty -> Task 4 (renderReflectHelper) + Task 5 assertion. Content review gate -> Task 1 Step 2. Save compatibility -> Task 7. No teacherTip/starters deletion -> not touched. Version/docs -> Task 8. All spec sections covered.
- **No placeholders:** every code step shows the code. The two intentional "determine at implementation time" notes (Task 4 Step 3 tier-switch handler; Task 6 Step 3 advance mechanism) each state a FIXED behavior contract and a concrete fallback, and are gated by Task 7 manual verification — not vague TODOs.
- **Type/name consistency:** `helpers.reflection` / `helpers.unionWin` with `extra/beginner/intermediate/advanced` arrays identical across Tasks 1, 2, 4, 5. `renderReflectHelper(boxId, helperData)` and the box IDs `reflectHelperReflection` / `reflectHelperUnion` match between Task 3 (markup) and Task 4 (render). `resolveDifficulty` is the existing tier resolver used everywhere.
- **Risk:** the order flip touches the act-end state machine; Task 7 manually verifies the three transitions (reflection->quiz, quiz->next, skip->next) and the `completedRecalls` guard, plus mid-game save compatibility — the user's explicit concern.
