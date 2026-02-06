# Civil War Battle Simulation - Educational Edition

An interactive strategy game for learning about Civil War history through tactical decision-making. Designed for 8th grade history classes.

## Play the Game

**Live Demo:** https://shiebenaderet.github.io/civil-war-battle-simulation

## Educational Goals

- Learn major Civil War battles and their strategic significance
- Understand military decision-making and its consequences
- Experience the challenges faced by historical commanders
- Build vocabulary around military and historical terms

## For Educators

- Designed for middle school history classes (8th grade)
- Supports multiple languages (Spanish, French, Korean, Chinese, Japanese, Russian, Ukrainian, Portuguese, Arabic)
- Includes vocabulary tooltips and historical context
- No installation required - runs in any web browser
- Takes about 15-20 minutes to complete
- Works on classroom tablets and Chromebooks

## Features

- **10 Historical Battles**: From Bull Run to Appomattox
- **Side Selection**: Play as Union or Confederacy with different win conditions
- **Strategy Choices**: 3 approaches per battle with pros/cons analysis
- **Historical Context**: Real battle descriptions and educational notes
- **Vocabulary Support**: Toggleable sidebar with key term definitions
- **Campaign Log**: Track your battle history and strategy analysis
- **Dark/Light Theme**: Adjustable for classroom environments
- **Accessibility**: Screen reader support, keyboard navigation, reduced motion

## Project Structure

```
civil-war-battle-simulation/
├── index.html              # HTML markup and page structure
├── css/
│   └── styles.css          # Design tokens, components, layouts, themes
├── js/
│   ├── data/
│   │   ├── battles.js      # 10 battle definitions with strategies & outcomes
│   │   ├── leaders.js      # Lincoln & Davis messages and objectives
│   │   └── maps.js         # SVG battle maps for visual display
│   ├── game.js             # Game state, scoring logic, win conditions
│   ├── ui.js               # DOM manipulation, screen transitions, modals
│   └── app.js              # Initialization and event wiring
├── images/                 # Public domain battle artwork (Library of Congress)
│   ├── battle_of_bull_run.jpg
│   ├── battle_of_shiloh.jpg
│   ├── battle_of_antietam.jpg
│   ├── battle_of_gettysburg.jpg
│   ├── battle_of_fredericksburg.jpg
│   ├── battle_of_chancellorsville.jpg
│   ├── battle_of_chickamauga.jpg
│   ├── battle_of_the_wilderness.jpg
│   ├── battle_of_atlanta.jpg
│   └── surrender_appomattox.jpg
└── README.md
```

## Game Mechanics

| Side | Starting Army | Wins Needed | Guaranteed Wins | Swing Battles |
|------|--------------|-------------|-----------------|---------------|
| Union | 1,500,000 | 6 of 10 | 4 (Antietam, Gettysburg, Atlanta, Appomattox) | Shiloh, Chancellorsville, Wilderness |
| Confederacy | 1,000,000 | 5 of 10 | 3 (Bull Run, Fredericksburg, Chickamauga) | Shiloh, Chancellorsville, Wilderness |

The Union must win all 3 swing battles (choosing the right strategy). The Confederacy needs 2 of 3. This creates meaningful strategic tension while keeping outcomes historically grounded.

## Development Roadmap

### Phase 1: Core Improvements (Current)
- [x] Separate monolithic HTML into modular files (CSS, JS data, game logic, UI)
- [x] Fix `shouldEndGame()` off-by-one bug in remaining battles calculation
- [ ] Add a persistent scoreboard using localStorage for classroom competition
- [ ] Add a "Historical Mode" that reveals what actually happened after each choice

### Phase 2: Classroom Features
- [ ] **Teacher Dashboard**: Simple page showing class-wide statistics (most popular strategies, average win rates per side)
- [ ] **Difficulty Levels**: "Explorer" mode (hints + easier win conditions) and "Commander" mode (current difficulty)
- [ ] **Reflection Prompts**: After each battle, ask students "Why do you think this strategy worked/failed?" with text input they can print or submit
- [ ] **Print-friendly Summary**: Generate a one-page report card of the student's campaign for grading

### Phase 3: Enhanced Learning
- [ ] **Battle Maps for All 10 Battles**: Currently only Bull Run, Gettysburg, and Antietam have SVG maps
- [ ] **Primary Source Integration**: Add quotes from soldiers' letters and commander reports
- [ ] **Timeline View**: Visual timeline showing how battles connect to larger war events
- [ ] **Cause and Effect**: Show how each battle's outcome affected the next battle's conditions

### Phase 4: Engagement
- [ ] **Sound Effects**: Optional battle sounds and period music (with mute button for classrooms)
- [ ] **Animated Transitions**: Battle outcome animations to increase engagement
- [ ] **Achievement System**: Unlock "historian badges" for learning milestones
- [ ] **Multiplayer Mode**: Two students play opposing sides simultaneously

## Technical Notes

- **No build tools required** - pure HTML, CSS, and vanilla JavaScript
- **No external dependencies** - works offline after initial page load
- **GitHub Pages deployment** - push to main branch to deploy
- Scripts load in order: data files → game logic → UI → app initialization

## Feedback Welcome

This is an educational project in active development. Feedback from educators and students is greatly appreciated!

- **Issues**: Report bugs or suggestions using GitHub Issues
- **Contact**: shie@benaderet.com

## Historical Note

All battles and strategies are based on historical events. The game aims to help students understand the complexity of military decision-making during the American Civil War (1861-1865). Image sources include the Library of Congress and National Archives, all in the public domain.
