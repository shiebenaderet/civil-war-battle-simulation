# Recall Questions: Kill Answer Tells + Track Difficulty

Date: 2026-06-01
Status: Approved, pre-implementation

## Problem

The act-review recall questions (48 total: 4 acts x 4 reading tiers x 3
questions, defined in `js/data/acts.js`) have a guessable tell: the correct
answer is almost always the longest, most detailed option. A student can score
without reading by picking the wordiest choice.

Note: the answer *position* tell (41 of 48 have `correctIndex: 0`) is already
neutralized at runtime by the v3.14 deterministic per-session option shuffle
(`getRecallDisplayOrder` in `js/ui.js`). That shuffle reorders options but
cannot change their text, so the *length* tell survives it. The length tell is
the real, unfixed problem.

Second need: the teacher wants to see which questions students struggle with
most, to guide reteaching.

## Goal

1. Remove the length tell on all 48 questions by rewriting the distractors so
   every option sits in a similar length band and reads with equal confidence,
   while staying clearly wrong on the history.
2. Log each student's first-try result per recall question to Firebase and add a
   "Questions" tab to the teacher dashboard showing per-question first-try miss
   rates (grouped by act, sorted worst-first, filterable by period), with the
   ability to expand a question to see which named students missed it.

## Part 1: Distractor rewrite (js/data/acts.js)

For each of the 48 questions, rewrite the 3 incorrect `options` so that:

- **Length parity:** all four options fall within roughly +/-25% of each other's
  character length. No option is conspicuously the longest or shortest.
- **Plausible but wrong:** each distractor is historically wrong in a way a
  student might believe (wrong actor, wrong battle, wrong number, or a real fact
  with the wrong emphasis). No absurd throwaways (e.g. remove
  "A reporter who fired a celebratory shot").
- **Exactly one correct option:** no rewritten distractor may be arguably also
  correct. The correct option's text, `correctIndex`, `explanation`, `nudge`,
  and `source` are unchanged.
- **Reading level preserved per tier:** `extra` keeps the simplest vocabulary
  and short sentences; `beginner` plain; `intermediate` standard; `advanced`
  sophisticated. Distractors match the tier of the question they belong to.
- **Historical accuracy:** verified against the battle facts the question's
  `source` field points to (e.g. `battles[2].historical.keyFact.intermediate`).

Out of scope: question prompts, correct answers, `correctIndex`, explanations,
nudges, sources, the shuffle, scoring, reading-level body text.

### Execution method

Run as a workflow for accuracy at scale:
- One agent per act rewrites that act's 12 questions (all 4 tiers), grounded in
  that act's battle data.
- An independent adversarial agent verifies each rewritten question for: length
  parity, distractors genuinely wrong, no accidental second-correct-answer, and
  reading level. Failures are returned with specifics and fixed before the file
  is edited.
- Only after verification passes are the `options` arrays written into
  `js/data/acts.js`.

## Part 2: Question-difficulty tracking

### Data model (Firebase Realtime Database)

New subtree, one entry per student per question, overwrite-on-update (mirrors
`progress`):

```
rooms/<roomCode>/recall/<studentId>/<actIndex>_<qIndex> = {
    name:      <student name, <= 30 chars>,
    period:    <period string>,
    correct:   <bool, did they ever get it right>,
    firstTry:  <bool, correct on the first attempt>,
    attempts:  <number>,
    lastSeen:  <server timestamp>
}
```

`firstTry === false` is what counts as "missed" for the miss-rate stat.

### firebase-leaderboard.js additions

- `writeRecallResult(roomCode, actIndex, qIndex, result, callback)` where
  `result = {name, period, correct, firstTry, attempts}`. Builds a validated
  entry (clamp/coerce types like `writeProgress` does) and `.set()`s it at
  `rooms/<code>/recall/<studentId>/<actIndex>_<qIndex>`. Graceful offline.
- `subscribeToRecall(roomCode, callback)` returning an unsubscribe fn, mirroring
  `subscribeToProgress`: fires with a flat array of entries (each tagged with
  `studentId` and the `<actIndex>_<qIndex>` key) on every change.
- `clearAllRecall(roomCodes, callback)` mirroring `clearAllProgress`, so the
  teacher can reset between classes.

### ui.js hook

In the recall answer-scoring path, after determining first-attempt correctness,
call `firebaseLeaderboard.writeRecallResult(...)` fire-and-forget (same pattern
and the same graceful-offline contract as the existing `writeProgress` call).
Pass the student name/period already used by `writeProgress`. Track per-question
attempt count in the existing recall state machine
(`unanswered -> wrong-once -> correct`).

### Firebase rules (database.rules.json)

Add a `recall` node under `rooms/$roomCode` mirroring the `progress` validation
style:

```
"recall": {
  ".write": true,
  "$studentId": {
    "$qKey": {
      ".validate": "newData.hasChildren(['name','firstTry','lastSeen']) && newData.child('name').isString() && newData.child('name').val().length <= 30 && newData.child('firstTry').isBoolean() && newData.child('lastSeen').isNumber()"
    }
  }
}
```

### Dashboard (teacher.html)

Add a fourth tab "Questions" to the existing tab bar
(Progress / Leaderboard / Global / Questions):

- Subscribe via `subscribeToRecall` for the active room/period.
- Aggregate per question key `<actIndex>_<qIndex>`: count distinct students who
  have an entry, and how many had `firstTry === false`. Miss rate = wrongFirst /
  total.
- Display grouped by act, each question as a row: question label, N students,
  miss rate %, with worst-first sort. Reuse existing `.lb-table` styling.
- Each row expands to list the named students who missed it on first try
  (per-student detail, like the Progress tab).
- Respect the existing period filter and the dashboard's class-code gate.
- The Questions tab follows the same show/hide pattern as the other tabs
  (`body.tab-questions #questionsView { display:block }` etc.).

Question label source: pull the question text from `acts.js` data already loaded
client-side, keyed by act + question index, using the teacher's own reading tier
(or a fixed reference tier) so labels are human-readable.

## Verification

- Part 1: workflow adversarial pass + a final script that asserts, for every
  question, that option lengths are within the band and `correctIndex` is
  unchanged from the pre-edit file.
- Part 2: load `teacher.html` against the live DB after playing through a couple
  of acts locally; confirm a recall answer produces a `recall` entry and the
  Questions tab shows the miss rate and expandable names. Confirm offline play
  does not error (graceful degradation).

## Risk

Medium. Part 1 is data-only (no logic) but large; the workflow's adversarial
verification mitigates accuracy risk, and a length-parity assertion catches
regressions. Part 2 follows established module/dashboard patterns closely;
main risk is the ui.js hook point, which must reuse the existing recall state
machine rather than duplicate it.
