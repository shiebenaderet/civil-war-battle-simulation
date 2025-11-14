# Historical Game Mechanics Design
## Asymmetric Gameplay for Civil War Simulation

---

## Core Philosophy

**Goal:** Each side plays differently based on historical strengths/weaknesses, but both can win through smart strategy.

**Historical Truth:** The Union had more resources but needed total victory. The Confederacy was outmatched but only needed to survive long enough for the North to give up.

---

## Game Variables (Visible to Students)

### 1. **Soldiers** (Manpower)
- **What it means:** How many troops you have left
- **Union starts with:** 1,500,000
- **Confederacy starts with:** 1,000,000
- **Why historically accurate:** Union had 2.1M total soldiers vs Confederacy's 1.1M
- **Game impact:** Run out = instant loss

### 2. **Morale** (Fighting Spirit)
- **What it means:** How motivated your soldiers are to keep fighting
- **Both start with:** 100
- **Range:** 0-150 (can go above 100!)
- **Why historically accurate:** Confederate morale stayed high early (defending home), Union morale fluctuated based on war progress
- **Game impact:**
  - High morale (>100) = Bonus to winning battles
  - Low morale (<50) = Penalty, soldiers desert faster
  - Reaches 0 = Army refuses to fight, instant loss

### 3. **Resources** (Supplies & Equipment)
- **What it means:** Food, ammunition, weapons, medical supplies
- **Union starts with:** 150
- **Confederacy starts with:** 80
- **Why historically accurate:** Union had factories, railroads. South was agricultural with limited industry
- **Game impact:**
  - High resources = Can afford aggressive strategies
  - Low resources = Must fight defensively or risk running out
  - Reaches 0 = Can't resupply, soldiers starve, instant loss

### 4. **Leadership** (General Quality)
- **What it means:** How skilled your commanders are
- **Union starts with:** 70
- **Confederacy starts with:** 95
- **Why historically accurate:** Lee, Jackson, Stuart were brilliant. Union cycled through poor generals (McClellan, Burnside) before finding Grant
- **Game impact:**
  - High leadership = Better strategy outcomes, fewer casualties
  - Low leadership = Worse outcomes, more mistakes
- **Union leadership improves** after Battle 5 (Grant takes command)
- **Confederacy leadership drops** after Battle 6 (Jackson dies at Chancellorsville)

---

## Asymmetric Starting Conditions

| Variable | Union | Confederacy | Historical Reason |
|----------|-------|-------------|-------------------|
| **Soldiers** | 1,500,000 | 1,000,000 | Union had larger population (22M vs 9M, and 3.5M were enslaved) |
| **Morale** | 100 | 100 | Both sides started motivated |
| **Resources** | 150 | 80 | North had 90% of factories, 70% of railroads |
| **Leadership** | 70 | 95 | South had experienced military officers; North had politicians-turned-generals |

---

## Victory Conditions (Asymmetric!)

### Union Victory:
- **Win 6 out of 10 battles** (must dominate)
- **OR** Reduce Confederate soldiers to 0
- **OR** Reduce Confederate morale to 0

**Historical Reasoning:** The North needed total victory to force the South back into the Union. Anything less = political failure.

### Confederate Victory:
- **Win 5 out of 10 battles** (just survive!)
- **OR** Reduce Union morale below 30 (North gives up)
- **OR** Last until Battle 10 with morale >0 and soldiers >0

**Historical Reasoning:** The South didn't need to conquer the North - just fight long enough for Northern voters to elect a peace candidate. Survival = victory.

---

## Side-Specific Strategies

**CRITICAL:** Each side gets DIFFERENT strategy options for each battle based on historical context.

### Example: Battle of Gettysburg

**Union Strategies (Defending high ground):**
1. **Hold Cemetery Ridge** (Defensive)
   - Historical: This is what Meade actually did
   - Impact: -10,000 soldiers, +10 morale, -5 resources
   - Pros: Safe position, enemy attacks uphill
   - Cons: Reactive, enemy chooses when to attack

2. **Counter-attack Little Round Top** (Aggressive)
   - Historical: Joshua Chamberlain's famous bayonet charge
   - Impact: -25,000 soldiers, +20 morale, -15 resources
   - Pros: Heroic, crushes enemy flank
   - Cons: Risky, high casualties

3. **Cavalry Screen & Hold** (Tactical)
   - Historical: Use cavalry to protect flanks
   - Impact: -15,000 soldiers, +5 morale, -10 resources
   - Pros: Balanced approach
   - Cons: Less dramatic impact

**Confederacy Strategies (Attacking into fortified position):**
1. **Pickett's Charge** (Aggressive)
   - Historical: Lee's actual disastrous frontal assault
   - Impact: -50,000 soldiers, -30 morale, -20 resources
   - Pros: If it works, war is over
   - Cons: Suicidal assault uphill against artillery
   - **ALMOST ALWAYS LOSES** (historically accurate!)

2. **Flank Around Big Round Top** (Tactical)
   - Historical: Longstreet's suggested alternative
   - Impact: -30,000 soldiers, +0 morale, -25 resources
   - Pros: Smarter approach, avoids frontal assault
   - Cons: Takes time, Union can react

3. **Withdraw and Regroup** (Defensive)
   - Historical: The smart choice Lee didn't make
   - Impact: -10,000 soldiers, -10 morale, -5 resources
   - Pros: Saves army for another day
   - Cons: Looks like retreat, hurts morale

**See the asymmetry?** Union is in a STRONG position (defending hills). Confederacy has mostly BAD options. This is historically accurate - Gettysburg was a Confederate mistake.

---

## Combat Resolution Formula

### Basic Formula:
```
Win Chance = (Base Chance) + (Leadership Bonus) + (Morale Modifier) + (Resource Modifier)
```

### Components:

1. **Base Chance** (Set per strategy)
   - Defensive strategies: 60-70% base win chance
   - Aggressive strategies: 40-50% base win chance
   - Tactical strategies: 50-60% base win chance

2. **Leadership Bonus**
   - Leadership 90-100: +15% win chance
   - Leadership 70-89: +5% win chance
   - Leadership 50-69: +0% win chance
   - Leadership <50: -10% win chance

3. **Morale Modifier**
   - Morale >100: +10% win chance
   - Morale 80-100: +0% win chance
   - Morale 50-79: -5% win chance
   - Morale <50: -15% win chance

4. **Resource Modifier**
   - Resources >100: +5% win chance
   - Resources 50-100: +0% win chance
   - Resources <50: -10% win chance

### Example Calculation:

**Union at Gettysburg using "Hold Cemetery Ridge":**
- Base Chance: 70% (strong defensive position)
- Leadership: 70 → +5% bonus
- Morale: 95 → +0% modifier
- Resources: 120 → +5% modifier
- **Total Win Chance: 80%**

**Confederacy at Gettysburg using "Pickett's Charge":**
- Base Chance: 20% (suicidal frontal assault)
- Leadership: 95 → +15% bonus
- Morale: 110 → +10% modifier
- Resources: 60 → +0% modifier
- **Total Win Chance: 45%**

Even with Lee's brilliant leadership, Pickett's Charge is still likely to fail. Historically accurate!

---

## Decision-Impact Feedback

**CRITICAL:** Students must understand WHY they won/lost.

### After Each Battle, Show:

```
📊 BATTLE RESULTS

Your Strategy: Hold Cemetery Ridge

🎯 Outcome: VICTORY! (80% chance succeeded)

📉 Variable Changes:
- Soldiers: 1,500,000 → 1,490,000 (-10,000)
  Why: You fought defensively, minimizing casualties

- Morale: 95 → 105 (+10)
  Why: Winning a major battle boosted your troops' confidence!

- Resources: 120 → 115 (-5)
  Why: You used ammunition and supplies defending the ridge

- Leadership: 70 (unchanged)

💡 What This Means:
You played it safe and won! Your soldiers are more confident now,
but you'll need to keep winning to maintain morale.

⚔️ Confederate Impact:
Enemy lost 50,000 soldiers and their morale dropped by 30 points.
They're getting desperate!
```

---

## Historical Events (Scripted Changes)

Certain battles trigger historical events that change variables:

### Battle 3: Antietam
- **After Battle:** Union gains the Emancipation Proclamation
- **Union Effect:** +20 morale ("We're fighting to end slavery!")
- **Confederacy Effect:** -10 morale (European support unlikely now)

### Battle 5: After Gettysburg/Vicksburg
- **Union:** Grant promoted to overall command
- **Union Leadership:** 70 → 90
- **Message:** "Ulysses S. Grant takes command! Leadership improves!"

### Battle 6: Chancellorsville
- **Confederacy:** Stonewall Jackson dies
- **Confederate Leadership:** 95 → 75
- **Message:** "General Jackson has died. Your leadership suffers."

### Battle 9: Sherman Takes Atlanta
- **Union:** +30 morale (Lincoln wins re-election!)
- **Confederacy:** -20 morale (South realizes defeat is inevitable)

---

## Balancing Philosophy

**Problem:** Historically, the Union won. How do we make it a game where both sides can win?

**Solution:**

1. **Union Player Must Earn It**
   - Even with more resources, bad strategy = loss
   - Must win 6/10 battles (60% win rate)
   - Can still lose if morale collapses from defeats

2. **Confederacy Player Can Win Strategically**
   - Only needs 5/10 victories (50% win rate)
   - Can win by outlasting Union morale
   - Smart defensive play conserves resources
   - Lee's leadership gives early advantage

3. **Skill Matters**
   - Students who understand variables will do better
   - Aggressive play = high risk, high reward
   - Defensive play = safe, slow progress
   - Tactical play = balanced

4. **Learning from Mistakes**
   - Lose a battle? You see exactly why (variables changed)
   - Next battle, adjust strategy accordingly
   - Example: Low morale? Pick a morale-boosting strategy

---

## Student-Friendly Complexity

### What Students See:
- 4 simple variables (Soldiers, Morale, Resources, Leadership)
- Clear numbers that go up/down
- Simple explanations for each change
- Visual progress bars

### What They DON'T Need to Know:
- Exact percentage calculations
- Complex RNG systems
- Behind-the-scenes balancing

### Example of Student Thought Process:
```
"My morale is at 45... that's low!
This strategy says '+20 morale' but costs a lot of soldiers.
I need the morale boost, so I'll risk it.

*Wins battle*

Nice! My morale went to 65 and I won the battle!
But I lost 30,000 soldiers... I need to be more careful next battle."
```

**This is the learning we want!** Strategy, trade-offs, cause-and-effect.

---

## Implementation Summary

### Code Changes Needed:

1. **New Game State Variables:**
   ```javascript
   gameState = {
       side: 'union' or 'confederacy',
       currentBattle: 0,
       soldiers: 1500000 or 1000000,
       morale: 100,
       resources: 150 or 80,
       leadership: 70 or 95,
       wins: 0,
       losses: 0
   }
   ```

2. **Battle Data Structure:**
   ```javascript
   {
       name: "Battle of Gettysburg",
       union_strategies: [...], // Different from confederacy!
       confederacy_strategies: [...],
       historical_event: { ... } // Triggered after battle
   }
   ```

3. **Strategy Impact Structure:**
   ```javascript
   {
       name: "Hold Cemetery Ridge",
       description: "...",
       base_win_chance: 70,
       soldier_cost: 10000,
       morale_change: 10,
       resource_cost: 5,
       leadership_impact: 0
   }
   ```

4. **Combat Resolution Function:**
   ```javascript
   function resolveBattle(strategy) {
       // Calculate win chance from all variables
       // Apply variable changes
       // Show clear feedback
       // Trigger historical events
   }
   ```

---

## Educational Value

### Students Learn:

1. **Historical Context**
   - Why the Union had advantages (industry, population)
   - Why the Confederacy fought well anyway (leadership, motivation)
   - How specific battles played out differently for each side

2. **Strategic Thinking**
   - Trade-offs (spend soldiers now or save for later?)
   - Resource management (can I afford aggressive play?)
   - Risk assessment (high morale boost but risky?)

3. **Cause and Effect**
   - "I chose aggressive strategy → I lost more soldiers → Now I have fewer for next battle"
   - "I won this battle → My morale increased → Next battle will be easier"

4. **Historical Empathy**
   - "Now I understand why Lee made that risky choice at Gettysburg!"
   - "The Union's resource advantage wasn't as simple as just 'having more stuff'"

---

## Next Steps

1. Implement new game state structure
2. Rewrite all 10 battles with side-specific strategies
3. Create combat resolution system with clear feedback
4. Add historical event triggers
5. Balance-test both sides to ensure both can win
6. Deploy and test with students

**This design makes the game historically accurate, strategically interesting, and educationally valuable!**
