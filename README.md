# Civil War Battle Simulation - Educational Edition

An interactive educational game that takes students through 13 major battles of the American Civil War. Designed for 8th grade history classes.

## Play the Game

**Live Demo:** https://shiebenaderet.github.io/civil-war-battle-simulation

## Learning Objectives

1. Compare motivations for fighting across race, class, and region
2. Identify turning-point battles and explain their strategic significance
3. Analyze the advantages and disadvantages that shaped the war
4. Describe lived experiences using primary sources
5. Examine the war across race, gender, social class (54th Massachusetts, women, enslaved people, Indigenous nations, conscription)
6. Evaluate how technology and tactics transformed warfare
7. Assess how battles influenced political decisions and legacy

## Two Game Modes

### Historical Mode (Guided)
Students choose Union or Confederacy, select a reading level (Extra Support / Beginner / Intermediate / Advanced), and experience all 13 battles through a streamlined 4-step flow per battle:
1. **Briefing** - Intel report + situation context shown together
2. **Your Call** - What Would You Do? with personalized feedback after choosing
3. **What Happened** - Historical outcome, Technology Spotlight, A Voice From the War (with plain-English explainer at Beginner level), and The Bigger Picture with Perspectives sidebars
4. **Reflect** - Writing prompt with scaffolding: clickable sentence starters (Beginner), shorter starters (Intermediate), or RACE method reminders (Advanced)

All text content adapts to the selected reading level across all 13 battles. Students receive a personalized letter from Lincoln (Union) or Davis (Confederacy) before their journey begins. At the end, they can export all their responses as a PDF.

### Free-play Mode (Strategic)
Unlocked after completing Historical Mode. Students make strategic choices with real consequences:
- **Momentum system**: victories build power, defeats erode it
- **Fog of war**: random events change battle outcomes unpredictably
- **Historical events**: side-dependent modifiers based on real events (e.g., finding Lee's lost orders at Antietam)
- **Class leaderboard**: Firebase-powered shared leaderboard with room codes, plus local top-10 fallback

## For Educators

- Designed for 8th grade history classes (CCSS aligned)
- No installation required - runs in any web browser
- Works offline on classroom tablets and Chromebooks (no server needed)
- Four reading levels (Extra Support, Beginner, Intermediate, Advanced) with adaptive content
- Dark/light theme for different classroom environments
- Screen reader support, keyboard navigation, accessibility compliant
- Student responses exportable as PDF for Canvas/LMS submission
- Printable Battle Journal handout in three differentiation tiers (see below)

## Battle Journal Handout

A printable companion handout students fill in during Historical Mode. Captures battle evidence by act, then scaffolds a thesis-and-evidence response to "How was the Union able to defeat the Confederacy?" Available in three tiers, all large-text, two pages each. Open in a browser and click the Print Handout button at the top.

- **Standard:** [civil.mrbsocialstudies.org/handouts/battle-journal-standard.html](https://civil.mrbsocialstudies.org/handouts/battle-journal-standard.html) — on-grade 8th-grade level, 8 vocabulary terms in Word Bank
- **Some Support:** [civil.mrbsocialstudies.org/handouts/battle-journal-some-support.html](https://civil.mrbsocialstudies.org/handouts/battle-journal-some-support.html) — 5-6th grade level, sentence stems on every prompt
- **Extra Support:** [civil.mrbsocialstudies.org/handouts/battle-journal-extra-support.html](https://civil.mrbsocialstudies.org/handouts/battle-journal-extra-support.html) — 1-3rd grade level, 6 Word Bank terms with plain-language definitions

The in-game Act Review screens (one per act, four total) display a banner reminding students to fill in that act's box before continuing.

## The 13 Battles

| # | Battle | Year | Key Theme |
|---|--------|------|-----------|
| 1 | Fort Sumter | 1861 | The war begins |
| 2 | Bull Run | 1861 | The myth of a short war dies |
| 3 | Shiloh | 1862 | Industrial-scale carnage |
| 4 | Antietam | 1862 | Emancipation Proclamation |
| 5 | Fredericksburg | 1862 | Irish Brigade, class tensions |
| 6 | Chancellorsville | 1863 | Black troops and women serving |
| 7 | Vicksburg | 1863 | The Confederacy split in two |
| 8 | Gettysburg | 1863 | 54th Massachusetts, Draft Riots |
| 9 | Chickamauga | 1863 | The bloodiest day in the West |
| 10 | Wilderness | 1864 | Grant's relentless campaign |
| 11 | Atlanta | 1864 | Lincoln's re-election secured |
| 12 | Sherman's March | 1864 | Total war and its consequences |
| 13 | Appomattox | 1865 | Surrender, assassination, 13th Amendment |

## Primary Source Voices

The game features primary source quotes from diverse perspectives:
- **Chaplain John Eaton** - Freedpeople fleeing to Union lines (Shiloh)
- **Sullivan Ballou** - Union officer's letter to his wife (Bull Run)
- **Clara Barton** - Volunteer nurse on the battlefield (Antietam)
- **Captain William J. Nagle** - Irish Brigade at Fredericksburg
- **Susie King Taylor** - Black nurse and teacher with the 33rd USCT (Chancellorsville)
- **Corporal James Henry Gooding** - 54th Massachusetts, letter to Lincoln demanding equal pay (Wilderness)
- **Sam Watkins** - Confederate enlisted soldier (Chickamauga)
- **Mary Chesnut** - Senator's wife, diarist (Fort Sumter)
- **Dora Miller** - Civilian under siege (Vicksburg)
- **Dolly Sumner Lunt** - Plantation owner during Sherman's March
- And more...

## Project Structure

```
civil-war-battle-simulation/
├── index.html              # Markup, screens, inline theme script
├── css/
│   └── styles.css          # Design tokens, components, layouts, themes
├── js/
│   ├── data/
│   │   ├── battles.js      # 13 battles with historical + freeplay data
│   │   ├── leaders.js      # Lincoln & Davis messages
│   │   └── maps.js         # SVG battle maps
│   ├── firebase-leaderboard.js  # Firebase class leaderboard (room codes, shared scores)
│   ├── game.js             # State, save/load, momentum, fog of war, scoreboard
│   ├── ui.js               # Screen management, rendering, DOM, tutorial, reflections
│   └── app.js              # Init, event wiring, screen flow
├── images/                 # Public domain artwork (Library of Congress, National Archives)
├── handouts/               # Printable Battle Journal in 3 differentiation tiers
└── README.md
```

## Technical Notes

- **No frameworks, no build tools** - pure HTML, CSS, and vanilla JavaScript
- **No ES modules** - works with `file://` protocol for offline classroom use
- **GitHub Pages deployment** - push to main branch to deploy
- **localStorage** for persistence (game saves, leaderboard, theme preference)
- **Firebase Realtime Database** for shared class leaderboards (gracefully degrades to local-only when offline)
- Scripts load in dependency order: data files → game logic → Firebase → UI → app init

## Version History

- **v3.16.0-tier1** - "Extra Support Tier (foundation)": adds a fourth reading level — Extra Support (E) — alongside Beginner / Intermediate / Advanced for ML/IEP students underserved by the Beginner tier. The pill row in the toolbar becomes E/B/I/A and the start-screen difficulty selector adds an Extra Support card with brand-red ink-fill styling. Code-side, getContent() in game.js gets a fallback chain (extra → beginner → intermediate) so partial ES rollout never shows empty content; a new resolveDifficulty() helper handles direct-index callsites. ES mirrors Beginner's hide/show predicates (Intel grid, Tech Spotlight, Voice explainer, Key Fact, collapsible sections) and uses Beginner's reflection sentence-starters. Content-side, all 4 acts ship with ES-tier intros, recall questions (12 total at 1-3rd grade reading level), and review summaries (~600 words). Per-battle gameplay text falls back to Beginner content; per-battle teaching text rewrites are deferred to v3.16-tier2. Print summary, save/load, and TTS work unchanged. Two adjacent UX fixes shipped in this release: "Review the act" link promoted from text-link to prominent brand-red button (was being ignored in the previous design) with explicit journal-update label; and a new PAT (Pay Attention To) callout on the act intro screen that lists per-act vocabulary terms and journal nudges, mirroring the Battle Journal handout's PAT visual style. Note-nudge prompt copy reframed from "Worth writing down:" to "One worth remembering:" — there are 39 nudges in a playthrough but the journal has only 3-5 lines per act, so the original copy implied "transcribe everything" when the pedagogical intent is "select a few".
- **v3.15.1** - "Battle Journal + Confederate Polish": adds a printable two-page Battle Journal handout in three differentiation tiers (Standard, Some Support, Extra Support) following the Unit 9 Field Report design system. Each tier captures evidence by act and scaffolds a thesis-and-evidence response to the unit prompt about how the Union won. Each handout has a sticky Print Handout toolbar that hides on print. The Act Review modal now displays a handout-nudge banner reminding students to fill in that act's box before continuing. Five tonal fixes to Confederate-side battle text: Fredericksburg's "mow them down" / "slaughter" framing replaced with sober description, Chancellorsville's celebratory "greatest victory!" feedback complicated with Jackson's death, Sherman's March now names the enslaved people who fled to Union lines, Chickamauga's "paid off big time" slang replaced, Antietam's European recognition framing now names the slavery dimension Britain and France would have been recognizing. No code changes to game logic, save/load, or content data structure.
- **v3.15.0** - "Launch Polish": classroom-ready release. Toolbar redesigned in Field Report tokens with always-visible reading-level pills (B/I/A) — students can switch reading level mid-battle, mid-recall, or mid-reflection without losing progress; selection persists in localStorage. Accessibility panel (Aa) adds OpenDyslexic font toggle (self-hosted, swaps all text including chrome), font size scale (S/M/L), and read-aloud voice/rate controls using the browser's speech synthesis with quality filtering and per-section play buttons (auto-attached via MutationObserver). Settings menu (⋯) cleanup: Reset This Battle (with confirmation) lets students redo a single battle without nuking progress; Print Summary at end of game produces a printable per-act report of decisions, recall completion, and per-battle reflections (via Blob URL with auto-print). Browser refresh/back/close warning when mid-battle. Subtitle "Act II — 1862" relocated from navbar to battle header dateline to keep navbar single-row on desktop. No changes to battle content; this is the runway-cleanup release.
- **v3.14.0** - "Battle Screen, Reshaped" — full release (code + content): Plan A code refactor plus Plan B content authoring. Per-sub-screen note nudges (Feedback / Outcome / Reflection) for all 13 battles at 3 reading levels (117 nudges total), each citing the source field it summarizes. Act review study guides for all 4 acts at 3 reading levels (12 guides total), organized around each act's synthesis prompts so students reach the recall question with the right framing. Acts II–IV explicitly handle the Emancipation Proclamation arc through to the 13th Amendment to prevent the conflation of Appomattox with full emancipation. No em dashes; teacher's voice throughout.
- **v3.14.0-alpha** - "Battle Screen, Reshaped" Plan A (code refactor): step 2 of the historical battle screen splits into 3 sub-steps (Feedback, Outcome, Reflection from history). Each gets its own Continue button; cascade-reveal stagger animation removed. Recall option display order shuffled (drop-in WWYD pattern, same salt). Review overlay shell added: per-recall-question and per-reflection-textarea "Review the act" link opens a modal with battle thumbnails and act review content (content authored in Plan B). Note-nudge slots added inside step 2 sub-sections (content authored in Plan B). All sub-sections render gracefully when content is empty. No regression of tutorial, help bar, save/resume, PDF export, or step pills.
- **v3.12.1** - "Acts of the War" (recall + WWYD shuffle): adds the recall moment that fires after each act's final battle and before the existing grouped reflection. Three multiple-choice questions per act per reading level (36 questions total) drawn directly from battles.js content with source citations. State machine: first wrong attempt shows a nudge with retry allowed; second wrong attempt reveals the correct answer with explanation and locks all options except the correct one (student must click it to advance, ensuring acknowledgment). Continue button gated until the correct option is selected. Recall completion tracked in gameState.completedRecalls so refreshes do not replay completed recalls. Bonus fix: WWYD options now shuffle their display order so the historically-accurate choice is no longer always option A. Internal index 0 = historical convention preserved everywhere; only the display order changes. Shuffle is deterministic per battle per side per session salt so navigating back inside a battle shows the same A/B/C, but a fresh playthrough re-randomizes.
- **v3.12.0** - "Acts of the War" (intros only): surfaces the existing 4-act story structure that was already implicit in groupedReflections. Adds animated act intro screens before battles 0, 3, 6, and 9 (Fort Sumter, Antietam, Vicksburg, Wilderness). Each intro shows a dateline, an animated states map of the eastern theater (drawn from the studytools 1861 dataset), three or four battle pins fading in sequentially, the act name, and a one-sentence positioning at three reading levels. The map includes a "Show political alignment" toggle that fills states by Union, Confederate, or border-state allegiance. Skippability gate: Continue button appears only after the animation completes; reduced-motion path skips animations and gates Continue at 6 seconds. State persists across save/resume so an intro plays exactly once per playthrough. The recall moment (3 multiple-choice questions per act before each grouped reflection) is deferred to v3.12.1.
- **v3.11.0** - "Documentary Pass": full visual reset from Blooket-inspired aesthetic to Field Report (period-newspaper) aesthetic. New Old Standard TT serif body and Special Elite typewriter chrome accents. Sepia paper palette replaces dark navy. Removed dark/light theme toggle (single sepia theme). Stripped decorative emoji from headings. Battle artwork given period-plate framing with subtle sepia tint. Buttons, inputs, and cards re-rendered as sharp-cornered ink-on-paper. No structural or content changes — same screens, same flow, same content; new worldview.
- **v3.10.0** - Free-play mode overhaul: all 39 freeplay strategies across 13 battles now have side-specific text (name, description, detail, outcome) so Union and Confederate players see historically appropriate choices. Replaced ArcGIS war map with interactive Esri StoryMaps Civil War timeline. Fixed name capitalization bug (first name now auto-capitalizes). Full logic audit confirmed no remaining side-selection bugs.
- **v3.9.0** - Fixed critical WWYD match logic: 7 of 26 battle scenarios had the historical choice at the wrong option index, causing students who picked the actual historical decision to be told "You chose a different path." Reordered options+feedback for Shiloh (CSA), Antietam (Union), Chancellorsville (Union), Vicksburg (both sides), Gettysburg (Union), and Chickamauga (CSA). Sentence starters now specific to each reflection prompt instead of generic. Added Fort Sumter battle map (Charleston Harbor 1861). Added dedicated War Map button in navbar for direct access to ArcGIS interactive map.
- **v3.8.0** - Beginner difficulty polish: fixed blank "Did You Know?" box (label was showing with no content), hidden Tech Spotlight at beginner to reduce reading load, Voice and Bigger Picture sections now collapsible at beginner (start collapsed with "tap to read" hint). Battle review buttons added to grouped reflection screens - students can click any battle in the group to see a quick recap of what happened and what they chose, with match/different badges, helping them reference events while writing reflections.
- **v3.7.1** - Firebase-powered class leaderboard with room codes. Teachers create rooms in Firebase, students enter a code to join and see class-wide rankings. Scores include name, side, win/loss record, and momentum. Graceful offline fallback to device-only leaderboard. ArcGIS interactive war map embedded in Campaign Log modal.
- **v3.7.0** - Progressive reveal animation for What Happened sections (staggered cascade instead of wall of text), PDF export now tracks match history (summary box + per-battle badges), free-play results show historical context ("What Really Happened"), combined name + side + difficulty into single setup screen, comprehensive mobile responsive improvements (step pills, touch targets, button sizing)
- **v3.6.0** - Redesigned WWYD feedback (shows student's choice vs. historical decision with match/different badge), grouped reflections every 3-4 battles around bigger themes (4 reflections instead of 13), expandable "Need a hint?" teacher tips on reflection prompts
- **v3.5.1** - Intro splash screen explaining both game modes and learning objectives (shown on first visit), difficulty level descriptions no longer mention grade levels (avoids stigma)
- **v3.5.0** - Guided tutorial system (auto-plays on first battle, highlights UI elements with explanatory tooltips), toggleable help bar with contextual tips per step, help button in navbar, fixed WWYD re-selection bug (students can now change their choice)
- **v3.4.1** - Fixed broken battle map URLs (Vicksburg, Wilderness, Atlanta, Sherman's March), reduced reading load by difficulty level (beginner hides Intel grid + Key Fact + Perspectives; intermediate hides Perspectives; advanced shows all), removed Fort Sumter map tab (restored in v3.9.0)
- **v3.4.0** - 3-level difficulty system (Beginner/Intermediate/Advanced) with adaptive content for all 13 battles, WWYD personalized feedback, voice explainers for beginners, reflection scaffolding (sentence starters + RACE method reminders), battle maps from Wikimedia Commons (Hal Jespersen), removed Google Translate (non-functional), fixed name entry alignment
- **v3.3.0** - Blooket-inspired UI redesign (Nunito font, vibrant colors, bold rounded cards, pill buttons), streamlined Historical Mode (4 steps per battle instead of 7), step indicator pills
- **v3.2.0** - Diverse primary source voices, Perspectives sidebars (race, class, gender, Indigenous), strengthened reflection prompts
- **v3.1.0** - 13 battles, interactive Historical Mode (7-section narrative), fog of war, PDF export, student response tracking
- **v3.0.0** - Two-mode system (Historical + Free-play), momentum system, complete rebuild
- **v2.0.0** - Modular structure, scoreboard, historical comparison
- **v1.0.0** - Original single-file prototype

## Feedback

This is an educational project in active development.

- **Issues**: Report bugs or suggestions via [GitHub Issues](https://github.com/shiebenaderet/civil-war-battle-simulation/issues)
- **Contact**: shie@benaderet.com

## Sources & Credits

All battles and strategies are based on historical events. Primary source quotes are drawn from the Library of Congress, National Archives, Freedmen and Southern Society Project, and published memoirs. All images are in the public domain.
