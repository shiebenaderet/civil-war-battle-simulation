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
Students choose Union or Confederacy and experience all 13 battles through a 7-section interactive narrative:
1. **Intel Report** - Forces, commanders, and advantages on each side
2. **The Situation** - What you're facing, written from your side's perspective
3. **What Would You Do?** - A genuine decision point before learning what really happened
4. **What Really Happened** - The historical outcome, plus a Technology Spotlight
5. **A Voice From the War** - A primary source quote from someone who lived through it
6. **The Bigger Picture** - How this battle changed the war, plus Perspectives sidebars on race, class, gender, and Indigenous experiences
7. **Reflect** - An open-ended writing prompt for Canvas submission

Students receive a personalized letter from Lincoln (Union) or Davis (Confederacy) before their journey begins. At the end, they can export all their responses as a PDF.

### Free-play Mode (Strategic)
Unlocked after completing Historical Mode. Students make strategic choices with real consequences:
- **Momentum system**: victories build power, defeats erode it
- **Fog of war**: random events change battle outcomes unpredictably
- **Historical events**: side-dependent modifiers based on real events (e.g., finding Lee's lost orders at Antietam)
- **Class leaderboard**: top 10 scores saved locally

## For Educators

- Designed for 8th grade history classes (CCSS aligned)
- No installation required - runs in any web browser
- Works offline on classroom tablets and Chromebooks (no server needed)
- Supports 9 languages via Google Translate (Spanish, French, Korean, Chinese, Japanese, Russian, Ukrainian, Portuguese, Arabic)
- Dark/light theme for different classroom environments
- Screen reader support, keyboard navigation, accessibility compliant
- Student responses exportable as PDF for Canvas/LMS submission

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
├── index.html              # Markup, screens, inline theme/translate scripts
├── css/
│   └── styles.css          # Design tokens, components, layouts, themes
├── js/
│   ├── data/
│   │   ├── battles.js      # 13 battles with historical + freeplay data
│   │   ├── leaders.js      # Lincoln & Davis messages
│   │   └── maps.js         # SVG battle maps
│   ├── game.js             # State, save/load, momentum, fog of war, scoreboard
│   ├── ui.js               # Screen management, rendering, DOM
│   └── app.js              # Init, event wiring, screen flow
├── images/                 # Public domain artwork (Library of Congress, National Archives)
└── README.md
```

## Technical Notes

- **No frameworks, no build tools** - pure HTML, CSS, and vanilla JavaScript
- **No ES modules** - works with `file://` protocol for offline classroom use
- **GitHub Pages deployment** - push to main branch to deploy
- **localStorage** for persistence (game saves, leaderboard, theme preference)
- Scripts load in dependency order: data files → game logic → UI → app init

## Version History

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
