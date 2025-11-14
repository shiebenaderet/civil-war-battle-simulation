# Battle Rewrite Example: First Battle of Bull Run

This document shows how to rewrite battles with asymmetric, side-specific strategies based on historical context.

## Historical Context

**First Battle of Bull Run (July 21, 1861)**
- First major land battle of the Civil War
- Both armies were inexperienced volunteers
- Union attacked, Confederacy defended
- Confederate victory shocked the North

## Why Asymmetric Strategies?

**Union Position:** Attacking force, overconfident, untrained
**Confederate Position:** Defending home territory, some trained officers

The strategies available to each side should reflect their historical situation.

---

## Example Rewrite: Battle 1

```javascript
{
    name: "First Battle of Bull Run",
    date: "July 21, 1861",
    context: "[... existing ELL-friendly context ...]",
    primarySource: {/* ... existing ... */},
    whatHappened: "[... existing explanation ...]",
    reflectionQuestion: "[... existing question ...]",

    // UNION STRATEGIES (Attacking)
    union_strategies: [
        {
            name: "Overconfident Direct Assault",
            type: "aggressive",
            description: "Your volunteers are eager to fight. March straight at the Confederate lines and overwhelm them with numbers!",
            base_win_chance: 35,       // Low - inexperienced troops attacking
            soldier_cost: 15000,        // High casualties
            morale_change: -5,          // Confidence shaken when reality hits
            resource_cost: 20,          // Supplies used in offensive
            leadership_change: 0
        },
        {
            name: "Cautious Flanking Maneuver",
            type: "tactical",
            description: "Try to go around the enemy's side. Your troops are green, but maybe surprise will help.",
            base_win_chance: 45,        // Slightly better - smarter approach
            soldier_cost: 12000,        // Moderate casualties
            morale_change: 0,           // Neutral
            resource_cost: 25,          // More movement = more supplies
            leadership_change: 0
        },
        {
            name: "Probe and Retreat",
            type: "defensive",
            description: "Test the enemy defenses and pull back if things look bad. Save your army for later.",
            base_win_chance: 20,        // Low chance of winning
            soldier_cost: 5000,         // Low casualties
            morale_change: -10,         // Looks like cowardice
            resource_cost: 10,          // Minimal supplies
            leadership_change: 0
        }
    ],

    // CONFEDERATE STRATEGIES (Defending)
    confederacy_strategies: [
        {
            name: "Hold Henry House Hill",
            type: "defensive",
            description: "Form a defensive line on the high ground. Let the Yankees come to you. This is where Stonewall Jackson earned his nickname!",
            base_win_chance: 70,        // Strong defensive position
            soldier_cost: 8000,         // Defenders have advantage
            morale_change: 10,          // Confidence from good position
            resource_cost: 10,          // Defending uses less
            leadership_change: 0
        },
        {
            name: "Counterattack at the Right Moment",
            type: "aggressive",
            description: "Wait for the Union troops to get tired from attacking uphill, then charge down at them!",
            base_win_chance: 65,        // Risky but historically what happened
            soldier_cost: 10000,        // More casualties from attacking
            morale_change: 15,          // Big morale boost if it works
            resource_cost: 15,          // Active fighting
            leadership_change: 0
        },
        {
            name: "Withdraw to Better Ground",
            type: "tactical",
            description: "You're outnumbered. Fall back to a stronger position and make them chase you.",
            base_win_chance: 40,        // Safer but less effective
            soldier_cost: 5000,         // Minimal fighting
            morale_change: -5,          // Looks like retreating
            resource_cost: 15,          // Movement costs
            leadership_change: 0
        }
    ],

    // Historical event (none for Battle 1)
    historical_event: null,

    results: {
        union_victory: "Against all odds, your inexperienced troops managed to break through Confederate defenses. The rebellion might end quickly after all!",
        union_loss: "Your overconfident volunteers panicked and ran back toward Washington. The North is shocked - this war won't be easy.",
        confederacy_victory: "Your defensive stand broke the Union attack! The Yankees fled in disorder. The South proved it can defend itself.",
        confederacy_defeat: "Despite fighting on your own soil, the massive Union army overwhelmed your defenses. This doesn't bode well for the Confederacy."
    },

    historical_notes: {
        general: "This battle convinced both North and South that the war would last longer than expected. It led to both sides recruiting larger, better-trained armies."
    }
}
```

---

## Key Design Principles

### 1. **Different Strategies Per Side**
- Union has attacking-focused strategies
- Confederacy has defensive-focused strategies
- Reflects historical circumstances

### 2. **Balanced Win Chances**
- Union's best strategy: 45% (flanking)
- Confederate's best strategy: 70% (hold high ground)
- This reflects historical reality: Confederates were in a strong position

### 3. **Clear Trade-offs**
- Aggressive = High risk, high morale if it works
- Defensive = Safe, but may look cowardly
- Tactical = Balanced middle ground

### 4. **Variable Costs Reflect Historical Reality**
- Attackers (Union) lose more soldiers
- Defenders (Confederacy) save resources
- Failed attacks hurt morale more than failed defenses

### 5. **Side-Specific Results**
- Four different outcome texts:
  - union_victory
  - union_loss
  - confederacy_victory
  - confederacy_defeat
- Each reflects what that result means for that side

---

## How Variables Affect Outcomes

### Union Player Example:

**Starting State:**
- Soldiers: 1,500,000
- Morale: 100
- Resources: 150
- Leadership: 70

**Chooses:** "Cautious Flanking Maneuver"
- Base Win Chance: 45%
- Leadership Bonus: +5% (leadership 70)
- Morale Modifier: +0% (morale 100)
- Resource Modifier: +5% (resources 150)
- **Total: 55% chance to win**

**If Wins:**
- Soldiers: 1,500,000 - 12,000 = 1,488,000
- Morale: 100 + 0 + 5 (victory) = 105
- Resources: 150 - 25 = 125
- Score: +400

**If Loses:**
- Soldiers: 1,488,000 - 6,000 (extra) = 1,482,000
- Morale: 100 + 0 - 10 (defeat) = 90
- Resources: 150 - 25 = 125
- Score: +100

### Confederate Player Example:

**Starting State:**
- Soldiers: 1,000,000
- Morale: 100
- Resources: 80
- Leadership: 95

**Chooses:** "Hold Henry House Hill"
- Base Win Chance: 70%
- Leadership Bonus: +15% (leadership 95!)
- Morale Modifier: +0% (morale 100)
- Resource Modifier: -10% (resources 80)
- **Total: 75% chance to win**

**If Wins:**
- Soldiers: 1,000,000 - 8,000 = 992,000
- Morale: 100 + 10 + 5 (victory) = 115
- Resources: 80 - 10 = 70
- Score: +400

---

## Pattern for Remaining Battles

### Battle 2: Shiloh (Union attacks, caught by surprise)
- Union: Defensive strategies (reacting to surprise)
- Confederacy: Aggressive strategies (surprise attack)

### Battle 3: Antietam (Union finds Lee's battle plans)
- Union: Advantage, attacking strategies
- Confederacy: Desperate defensive strategies
- **Historical Event:** Emancipation Proclamation announced
  - Union morale +20 ("We're fighting to end slavery!")
  - Confederacy morale -10 (Europe won't help now)

### Battle 4: Gettysburg (Lee invades North)
- Union: Strong defensive position (Cemetery Ridge)
- Confederacy: Terrible attacking position (Pickett's Charge)
- Most asymmetric battle - Confederacy has mostly bad options

### Battle 5: Vicksburg (Grant besieges city)
- Union: Siege strategies
- Confederacy: Breakout attempts
- **Historical Event:** Grant promoted to overall command
  - Union leadership 70 → 90

### Battle 6: Chancellorsville (Lee's greatest victory)
- Union: Larger force but poor leadership
- Confederacy: Brilliant flanking maneuver
- **Historical Event:** Stonewall Jackson dies
  - Confederate leadership 95 → 75

### Battle 7-10: Follow similar patterns

---

## Balance Testing

### Union Path to Victory:
- Needs 6/10 wins (60%)
- Has resource advantage
- Leadership improves over time
- Can afford to lose early battles

### Confederate Path to Victory:
- Needs only 5/10 wins (50%)
- Has leadership advantage early
- Must conserve resources
- Can win by survival (lasting 10 battles with morale > 30)

Both sides can win through smart play!

---

## Next Steps

1. Copy this pattern for Battle 1
2. Adapt for remaining 9 battles based on historical context
3. Test both sides can win
4. Deploy and get student feedback
