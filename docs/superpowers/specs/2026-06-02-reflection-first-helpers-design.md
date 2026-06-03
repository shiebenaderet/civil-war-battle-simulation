# Reflection-First Flow + Tier-Graduated Brainstorm Helpers

Date: 2026-06-02
Status: Approved, pre-implementation

## Problem

At the end of each act (after the last battle: Shiloh, Chancellorsville,
Chickamauga, Appomattox), the game shows the **comprehension quiz (recall)
first**, then the **reflection prompt** that sends students to write on their
Battle Journal handout. This is backwards: students answer a check-for-
understanding quiz before they have done the synthesis thinking and writing the
reflection is meant to build.

Second, the reflection prompt itself offers no real scaffold on screen. The
screenshot of the live reflect screen shows the **advanced** prompt ("Trace the
escalation... supports or complicates that conclusion?") as a wall of difficult
text. A Most Support student (1st-3rd grade reading level, often ML/IEP) has no
way to start. Existing `teacherTip` and sentence-`starters` data exist in
`groupedReflections` but are hidden (v3.17.1), and even when shown they are the
same kind of help for everyone.

## Goals

1. **Flip the order** so each act ends with: last battle outcome -> reflection
   prompt + helpers (write on the handout) -> comprehension quiz -> next act.
2. Add **tier-graduated brainstorm helpers** on the reflection screen that scale
   support by reading level, so the floor is reachable for the lowest tier and
   the ceiling still pushes the highest. Two helpers per act: one for the act
   reflection question, one for the "one way this act helped the Union win"
   evidence line on the handout.

## Decisions (locked during brainstorming)

- **New order:** reflection + helper box (write on handout) THEN the recall quiz.
- **Two helpers per act**, both tailored to all 4 levels: `reflection` and
  `unionWin`.
- **Hard academic terms appear ONLY at the tier(s) that warrant them, by
  construction.** Each tier's helper is written to scaffold THAT tier's own
  (already-leveled) handout question, so esoteric terms (Pyrrhic victory,
  Clausewitz, friction, apartheid, post-conflict, reconciliation) appear ONLY in
  Extra Challenge. "Reconstruction" / "Andrew Johnson" reach Standard only
  because the Standard handout question itself uses them (appropriate on-grade).
  Most Support and More Support helpers contain NO such terms. The glossary
  linker only scans the text actually rendered for the current tier, so a hard
  term gets a click-to-define tooltip ONLY in the tier where it appears — no
  per-tier tooltip logic is required, and lower tiers never see link-soup.
  IMPLEMENTER CONSTRAINT: do not introduce a hard academic term into a lower
  tier's helper text; keep the graduation the audited content established.
- **Helper content graduates by tier** (this is the key design idea):
  - ★ Most Support (`extra`): a near-complete, correct **sentence frame** with
    1-2 meaningful blanks the student finishes. Supplies the history and the
    sentence structure; the blank requires one real detail/decision that shows
    understanding.
  - ★★ More Support (`beginner`): a **lighter starter sentence + one brainstorm
    question**.
  - ★★★ Standard (`intermediate`): **brainstorm questions** (provoking
    hypotheticals, "how did X change from start to end", compare-two-things).
    Never the answer, never sentence stems.
  - ★★★★ Extra Challenge (`advanced`): **analytical brainstorm questions** that
    push toward evidence and argument; no frame (they should generate fully).
- **Both helper boxes shown**, clearly labeled by handout task ("For your
  reflection answer" / "For the 'how it helped the Union win' line").
- **Always visible**, bright, friendly boxes on the reflect screen, not a
  click-to-open. Updates live when the reading-level pill changes.
- Helper content lives **on screen** in one consistent system across all four
  tiers. The handout keeps its own existing printed stems unchanged.
- The author drafts all content; the teacher reviews the wording in the spec/plan
  before any code ships.

## Architecture

### Order flip

Today (in `js/ui.js`):
- `renderActRecall(actIndex)` shows the quiz; its `onContinue` for the last
  question marks `gameState.completedRecalls` and calls `showReflectionStep()`.
- `showReflectionStep()` -> `showGroupedReflection()` shows the reflection prompt;
  its Continue advances to the next battle.

After the flip:
- The act-end entry point becomes the **reflection** step. The reflection
  screen's Continue launches `renderActRecall(actIndex)`.
- `renderActRecall`'s final Continue marks `completedRecalls` (unchanged
  bookkeeping) and advances to the next battle/act.

Net effect: the two screens swap which one runs first and what each one's
Continue does. Act-end detection (`reflectionBattles`, `shouldShowActRecall`,
`isReflectionBattle`) and the `completedRecalls` re-show guard are unchanged. The
"Review this act + update your journal" link and the handout nudge stay on the
reflection screen.

The exact call-site wiring (which function the after-battle flow calls first at
an act boundary, and the swap of the two Continue handlers) is determined at
implementation time by reading the current `onContinue`/`showReflectionStep`/
`renderActRecall` wiring; the behavior contract above is fixed.

### Helper data

Extend each `groupedReflections[i]` (in `js/ui.js`) with a `helpers` object:

```
helpers: {
  reflection: { extra: [...], beginner: [...], intermediate: [...], advanced: [...] },
  unionWin:   { extra: [...], beginner: [...], intermediate: [...], advanced: [...] }
}
```

Each tier value is an array of 1-4 strings. By tier the strings ARE different
kinds of help (frame vs. question), per the graduation above. The `extra` and
`beginner` frames may contain a visible blank marker (e.g. `______`) that the box
renders literally so the student sees where to add their own words.

This is 4 acts x 2 helpers x 4 tiers = 32 short content sets. Drafted by the
author, grounded in each act's existing prompt/facts and the teacher's examples
(e.g. Act I reflection: "If 20,000 Americans were hurt in two days today, how
would people react? Would they want revenge? A bigger army? How did the war get
worse from the first battle to the third, not just deaths, but cost and fear?").
Reviewed by the teacher before shipping.

### The helper box (UI)

On the reflect screen (`showGroupedReflection`), under the prompt and above/near
the handout nudge, render two bright helper boxes:

- Box 1 label: "For your reflection answer"
- Box 2 label: "For your 'how this act helped the Union win' line"

Each box shows a friendly heading ("Not sure what to write? Think about
these:" for question tiers; "Not sure what to write? Try finishing this:" for
frame tiers) and the current tier's list as bulleted lines. Built with safe DOM
APIs / `textContent` (content is author-authored, but keep the XSS-safe pattern
used elsewhere). The boxes resolve the current reading level via the existing
`resolveDifficulty`/`getContent` mechanism and re-render when the reading pill
changes (hook into the same path that updates the reflection prompt on tier
switch).

New markup: two helper-box containers in the reflect screen section of
`index.html`. New CSS: a bright, brand-accented `.reflect-helper` box style.

### What is NOT changing

- The recall quiz content and the reflection prompt text (only their order).
- The handout (its printed stems stay).
- `teacherTip` / `starters` data — left in place; superseded on screen by the new
  helper but not deleted.
- Scoring, progress, dashboard, guest book.

## Error handling / edge cases

- An act whose `helpers` data is missing a tier: fall back
  extra -> beginner -> intermediate (same chain the app uses elsewhere) so a box
  is never empty; if all missing, hide that box rather than show an empty frame.
- Reading-level switch mid-reflection: helper boxes update live alongside the
  prompt, matching the existing live-update behavior.
- The order flip must not double-fire the quiz or skip the reflection on revisit;
  the `completedRecalls` guard still governs whether the act-end sequence shows.

## Verification

- Order: after the last battle of an act, the reflection screen appears first,
  its Continue launches the recall quiz, and the quiz's Continue advances to the
  next act. Replaying/returning does not re-trigger a completed act-end.
- Helpers: for a given act, switching the reading pill through all four tiers
  shows frame-style help at extra/beginner and question-style at
  intermediate/advanced, for BOTH boxes, updating live.
- Fallback: temporarily removing a tier's helper still shows a non-empty box via
  the fallback chain; removing all hides the box.
- Content review: the teacher approves all 32 helper sets in the spec/plan before
  code ships.
- No regression: handout nudge, "Review this act" link, TTS readability, and the
  campaign-log review still work on the reflect screen.

## Risk

Low-to-medium. The order flip is a small, well-contained wiring change but
touches the act-end state machine, so it needs careful verification against the
`completedRecalls` guard. The helper content is data + a presentational box
following existing tier-resolution patterns. The main effort is writing 32 good
pedagogical helper sets, which the teacher reviews before shipping.
