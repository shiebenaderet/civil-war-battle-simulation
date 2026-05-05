# Launch Readiness Redesign — Civil War Battle Simulation

**Date:** 2026-05-04
**Author:** Shie Benaderet (with Claude as collaborator)
**Target launch:** 3–4 weeks from spec date
**Current version at spec:** v3.10.0
**Target version at launch:** v4.0.0

---

## 1. Problem Statement

The simulation has reached v3.10 with strong content (three reading levels, side-specific WWYD, diverse primary sources, real reflection scaffolding) but feels clunky, text-heavy, and outdated to its author. More importantly, it does not meet a core learning objective: students do not leave with a real understanding of **what happened in the Civil War as a story** — they leave knowing 13 battles happened in some order.

Students will use the simulation **mostly self-paced in class**, in a **single ~45-minute session** (with some wiggle room). Average 8th grade focus, no headphones, often Chromebook. The teacher launches it and helps when asked but isn't walking everyone through it.

## 2. Diagnosis

Three lenses, summarized.

### Design (visual / interaction)
- **Aesthetic reads as "edtech 2021"** — Nunito + bold rounded cards + vibrant primary blue/purple + emoji-prefixed headings (📋 🗺️ 🤔 📖 💬 🌍 ✍️). Signals "school quiz app," not "history experience."
- **Battle screen is a vertical document, not an experience.** By step 2 of 4, the student is staring at 8–10 stacked cards on one scrolling page (WWYD feedback → outcome → tech → voice quote → bigger picture → did-you-know → perspectives → reflection prompt → scaffolding → textarea).
- **Artwork — the most powerful element — is the smallest.** Currier & Ives lithographs and battlefield photography are tucked into a tab and forgotten.
- **Chrome overload:** step pills + progress bar + battle header + visual tabs + 7 narrative section headings = five layers of UI before the student reads a word.
- **Emoji-as-headings are infantilizing by battle 8.**

### Pedagogy
- **No story of the war.** 13 isolated modules. No "previously on…" recap, no cumulative timeline, no sense of why Vicksburg + Gettysburg in the same week is the turning point. Students get 13 episodes with no season arc.
- **No spatial sense.** Battle maps are tucked behind a tab. The Esri StoryMap is buried in a modal most students will never click. There is no view of the war moving south, the front line shifting, the Confederacy shrinking.
- **No retrieval or synthesis.** Reflections are open-ended writing only. There is no quick recall, no "match the technology to the battle," no end-of-act question requiring connection between battles. We can't tell if students actually got it.
- **WWYD has no downstream consequence in historical mode.** Students pick, get feedback, sim moves on. Choices don't accumulate.
- **Cause→consequence chains are written, not felt.** "Bigger Picture" tells students Antietam led to the Emancipation Proclamation; the next battle's situation doesn't show "now the war is about freedom — that changes things."

### Practical (the average 8th grader)
- **First impression reads as reading homework.** Text in cards.
- **Time pressure is invisible.** A student spending 6 min on Fort Sumter can't finish 13 battles in 45 min and doesn't know it.
- **Reflection textarea is intimidating and ungated** — average student types "I think it was bad" and clicks Continue.
- **5 clicks from open to first battle** (splash → mode → side+name+difficulty → leader letter → battle 1).
- **Free-play mode is well-built but not teaching the stated learning objectives** in the launch path.

## 3. Guiding Principles (the things to protect from scope creep)

1. **Reframe "13 battles" → "4 acts of a war."** Acts give natural pacing breaks, retrieval moments, and the "shape of the war" gap solved structurally instead of with more text.
2. **Aesthetic shift: from quiz app to documentary.** One CSS-token pass + serif headings + give photography weight + remove emoji-as-headings. Same components, different feel.
3. **Move freeplay out of the launch path.** Show it only after historical mode completes.
4. **Fit in 45 minutes.** Anything that adds time per battle gets cut. Anything that adds time *between* acts (10–20 sec) is fair game if it earns it.
5. **No new content writing for the 13 battles.** What's there is good. Restructure delivery, not content.

## 4. Out of Scope (deliberately not on the list)

- New battle content. The writing is good as-is.
- Music / ambient sound. Real classrooms can't use it (35 students, no headphones, distraction).
- Video. Production cost too high for budget; conflicts with offline-classroom constraint.
- New game modes beyond freeplay (which stays as an unlock).
- Teacher dashboard / live class view. Worth doing eventually; separate project.
- Framework rebuild. Vanilla JS + no-build is a virtue (file:// protocol, GitHub Pages, no toolchain). Preserved.

## 5. The Versioned Roadmap

Each version is shippable on its own — if any version slips or proves harder than estimated, the previous version is still a valid release.

### v3.11 — "Documentary Pass" (~3 days)
**Goal:** Make the project *look* like history, not a quiz app. No structural change.

**Changes:**
- Replace Nunito-everywhere with a serif/sans pairing that reads as historical (e.g., Crimson Pro for headings — already loaded — and a more neutral sans like IBM Plex Sans or Inter for body).
- Mute the palette. Replace `--color-primary: #4361EE` (vibrant blue) and `--color-secondary: #7C3AED` (vibrant purple) with restrained, slightly desaturated tones. Union/Confederacy keep their identifying colors but the *chrome* gets muted.
- Remove emoji from narrative section headings (📋 🗺️ 🤔 📖 💬 🌍 ✍️). Keep functional emoji only (e.g., navigation icons where they aid scanability).
- Give battle artwork a hero treatment: full-bleed at top of briefing, with a real period-appropriate caption.
- Soften card chrome: less border-radius, less shadow, more typography-driven hierarchy.
- Set up a Visual Companion (browser preview) at the start of this version so direction can be approved before CSS commits.

**Risk:** subjective taste. Mitigation = mockups before code.

**Done when:** open the splash screen and the gut reaction is "this looks like a documentary," not "this looks like Blooket."

---

### v3.12 — "Acts of the War" (~4–5 days) — HIGHEST LEVERAGE
**Goal:** Solve the "shape of the war" pedagogy gap structurally.

**Structure:**
- **Act I: The War Begins (1861)** — Fort Sumter, Bull Run
- **Act II: A Long, Hard War (1862)** — Shiloh, Antietam, Fredericksburg
- **Act III: The Turning Point (1863)** — Chancellorsville, Vicksburg, Gettysburg, Chickamauga
- **Act IV: Total War and the End (1864–65)** — Wilderness, Atlanta, Sherman's March, Appomattox

**Per-act components:**
- **Act intro (~30 sec):** cinematic interstitial. Animated map showing where the war stands at start of act, key dates appearing in sequence, one sentence of context. Skippable but defaulted to play.
- **Act outro (~60 sec):** 3 quick-recall questions about that act (multiple choice or drag-to-match — fast, tactile, low-friction). Then the existing grouped reflection.
- **Existing grouped reflections** (battles 3, 6, 9, 13) re-scoped to align with act boundaries.

**Risk:** highest-leverage version is also the riskiest. Mitigation: prototype Act I intro first (one day), get approval, then build the other three.

**Done when:** a student watching can describe the war as four phases with distinct character, not 13 isolated events.

---

### v3.13 — "The Map" (~3 days)
**Goal:** Give the war a permanent geographic frame.

**Changes:**
- Build a simple SVG strategic map of eastern + western theaters as a persistent UI element (slim sidebar on desktop, collapsible drawer on mobile).
- Current battle highlighted; previous battles dimmed; future battles invisible.
- Front line (or Anaconda Plan progress) shifts visibly between acts.
- Demote the Esri StoryMap from primary war-map to "explore more" link.

**Constraint:** no external map dependencies on the critical path. Must work offline.

**Done when:** at any point in the simulation, a student can see *where* on the continent they are and what's already happened.

---

### v3.14 — "The Battle Screen, Reshaped" (~3 days)
**Goal:** Same content, less scrolling, more focus.

**Changes:**
- Briefing → WWYD → What Happened → Reflect become **separate screens**, not stacked sections in one scrolling page.
- Voice quote and Bigger Picture move into "What Happened" but as **toggles or tabs** within that screen, not stacked cards.
- Artwork gets a hero treatment on briefing screen (full-bleed, with caption).
- Reflection textarea: reflection scaffolding (sentence starters / RACE) shown by default at appropriate difficulty, not behind a click.
- Pacing indicator: show estimated minutes remaining, not just "battle X of 13."

**Risk:** changes muscle memory; students used to scrolling won't scroll. Test with at least one real 8th grader before committing.

**Done when:** a student on any screen sees one focused thing, not a stack.

---

### v3.15 — "Launch Polish" (~2 days)
**Goal:** Ship.

**Changes:**
- Compress splash → mode → side+name+difficulty → leader letter from 5 screens to ~2. Specific proposal: one combined "Welcome + Set Up" screen, then leader letter (kept — it's good — but tightened).
- Hide freeplay mode card behind historical-mode completion. No visible "locked" state on first visit; reveal as a reward at end-of-historical screen.
- Final QA pass: 3 reading levels × 2 sides × 4 acts × 13 battles. Spot-check, not exhaustive.
- PDF export prompt becomes more visible (currently easy to miss).

**Done when:** a fresh student opens the URL and is in Battle 1 of Act I within 60 seconds.

---

### v4.0.0 — Launch with students.

## 6. Success Criteria for Launch

A student in the target audience (average 8th grader, 45 min, mostly self-paced) should:

1. Finish all 13 battles within the time budget.
2. Be able to describe the war as a sequence of 4 acts with distinct character.
3. Be able to point to roughly where each battle happened on a map.
4. Demonstrate retention via the per-act recall questions (target: median 2/3 correct).
5. Submit a PDF reflection sheet to Canvas.
6. Self-report (informally) that the simulation felt "like history," not "like a quiz."

## 7. Risks and Open Questions

- **Aesthetic direction (v3.11) is subjective.** Mitigation: Visual Companion mockups before CSS commits.
- **Acts interstitial (v3.12) might not land.** Mitigation: prototype Act I first; get approval before building the other three.
- **One-screen-per-step (v3.14) breaks scrolling muscle memory.** Mitigation: test with one real 8th grader before committing the pattern.
- **Time budget across 5 versions in 3–4 weeks is tight.** If anything slips, the cut order is: v3.15 polish → v3.13 map → v3.14 reshape. v3.11 (documentary) and v3.12 (acts) are the load-bearing versions; the rest are additive.

## 8. What This Spec Is Not

This is a roadmap-level design, not an implementation plan. Each version (v3.11 through v3.15) gets its own implementation plan (via the writing-plans skill) before any code is written for that version. This document exists to align on direction and sequencing before we start.
