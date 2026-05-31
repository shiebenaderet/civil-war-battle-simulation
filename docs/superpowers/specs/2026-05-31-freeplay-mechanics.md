# Free-play mechanics overhaul (FP-3 through FP-6)

**Date:** 2026-05-31. From the Free-play audit + teacher direction ("use your judgment"). Makes Free-play more realistic, less punishing of early stumbles, and more rewarding to finish. All decisions are the agent's sensible defaults, to be tuned after review.

## Shared context (current engine, do not break)
- `resolveBattle(strategyIndex)` (game.js ~283): `effectivePower = basePower + floor(momentum/5) + fogMod + histMod`; `won = effectivePower >= difficulty`. On win: momentum += momentumValue, score up. On loss: momentum -= momentumValue. Soldiers reduced by strategy casualties, clamped at 0 (currently cosmetic).
- `checkWarEnd()` (game.js ~353): after >= 8 battles, momentum thresholds end the war early (union win >=20 / loss <=-15; confederacy win >=15 / loss <=-20).
- `advanceFreeplay()` (game.js ~393): increments battle, calls checkWarEnd, ends after 13 battles.
- `getFreeplayResult()` (game.js ~412): final victory/defeat by momentum sign.
- `renderFreeplayResults(result)` (ui.js ~2252) per-battle result screen; `renderFreeplayEnd(advancement)` (ui.js ~2368) end screen with scoreboard + class leaderboard.
- Starting soldiers: Union 1,500,000 / Confederacy 1,000,000 (game.js:129).

## FP-3: Soften the momentum death spiral (underdog comeback bonus)

**Goal:** an early stumble shouldn't be mathematically fatal, but a deficit should still hurt.

**Change in resolveBattle:** add an `underdogBonus` to effectivePower when the player's momentum is negative:
```
underdogBonus = (momentum < 0) ? Math.min(2, Math.floor(-momentum / 5)) : 0
```
So at momentum -5 to -9 → +1, at -10 or worse → +2 (capped at +2). This gives a losing player a fighting chance to climb back without making comebacks trivial. Add `underdogBonus` to the effectivePower sum and include it in the returned result object (so the UI can surface it, like fogMod/histMod). Keep the existing momentum bonus `floor(momentum/5)` (which is 0 or negative when behind) — the underdog bonus partially offsets the negative momentum penalty, softening but not erasing the deficit.

**Net effect:** at momentum 0, no change. At momentum +10, no change (underdog bonus 0). At momentum -10: momentum bonus is -2, underdog bonus +2, net 0 instead of -2 — a real lifeline. Tune the cap/divisor later if too strong/weak.

## FP-4: Troop counts matter (soldiers become a loss condition)

**Goal:** the soldiers stat (currently cosmetic) becomes a real way to lose, adding realism: bleed your army dry and you can't continue.

**Historically-grounded floors** (roughly where the real armies could no longer sustain the war, scaled to the game's starting numbers):
- Union floor: 400,000 (started 1.5M)
- Confederacy floor: 250,000 (started 1.0M)

**Change in checkWarEnd (and/or resolveBattle):** after applying casualties, if `gameState.soldiers <= floor[side]`, the war ends in DEFEAT regardless of momentum, with a reason `'attrition_defeat'` and a message like: "Your army has been bled white. With too few soldiers left to continue the fight, you are forced to surrender." This check should fire from advanceFreeplay/checkWarEnd (not only at >= 8 battles — attrition can end it anytime, since losing your army is always terminal). Add an attrition check that runs every battle (before the 8-battle momentum gate). 

**getFreeplayResult** must report attrition defeat distinctly (so the end screen and history overview can mention it). Pass the war-end reason through.

**Balance note:** casualties per battle are 0-70k. To hit the Union 400k floor (1.1M in losses) a player must take heavy-casualty strategies repeatedly across many battles — it's a real risk for reckless play, not a constant threat. Tune floors after playtest.

## FP-5: "Did you change history?" end overview

**Goal:** a reflection panel on the end screen comparing the player's run to the actual Civil War.

**Real-history reference data** (compute from battles.js where possible; hardcode the war-level facts):
- Real war: 13 battles fought to the end (1861-1865), ~620,000 total deaths, Union won.
- Per battle, `battles[i].winner` ('union'/'confederacy') and `battles[i].casualties` (union/confederacy numbers) already exist in the data (historical object). Use them for the per-battle comparison.

**Comparisons to show** (build a `getHistoryComparison()` in game.js returning structured data; render on the end screen):
1. **Who won:** player's side + whether they won vs. the real outcome (Union won the real war). "You won as the Confederacy. History went the other way." or "You led the Union to victory, as in real life, but..."
2. **Length:** how many battles the player's war lasted (early end via momentum/attrition) vs. the real 13. "Your war ended at battle 9. The real war went the full distance."
3. **Casualties:** player's total soldiers lost vs. a scaled reference. Frame simply: "Your campaign cost X soldiers" and compare to whether they were more/less reckless than history. (Use casualtyRate already computed.)
4. **Divergence highlight:** the most notable way they changed history (won as the losing side / ended it far quicker / minimal casualties / lost the war the winning side historically won).

Keep it SHORT and student-readable, tier-aware if easy (use plain language). This is a reflection moment, not a data dump. Render as a clear panel on `endGameScreen` above or below the scoreboard.

## FP-6: Victory rating + final-battle decider

**Victory rating** (on the end screen, prominent): classify the outcome by momentum magnitude (and attrition):
- momentum >= 15: "Crushing Victory"
- +5 to +14: "Clear Victory"
- +1 to +4: "Narrow Victory"
- 0: "Stalemate"
- attrition defeat: "Costly Defeat" (army destroyed)
- -1 to -14: "Defeat"
- <= -15: "Decisive Defeat"
Show it as a badge/title on the end screen. Reuse the existing momentum-summary text under it.

**Final-battle decider:** when the player reaches the LAST battle (battle 13) AND momentum is within a close band (e.g. |momentum| <= 4, i.e. not already decided), frame battle 13 as a "decider": show a banner on the briefing ("This is the decisive battle. The war hangs in the balance.") and DOUBLE that battle's momentumValue so the final choice carries real weight. Only when close; if the war's already lopsided it's not a fake decider. Implement as: in renderFreeplayBriefing, if currentBattle === last && Math.abs(momentum) <= 4, show the decider banner; in resolveBattle, if it's the last battle and was close at entry, apply a 2x momentum swing. (Capture "close at entry" carefully so it's consistent between the banner and the resolution.)

## Build order (dependency-aware)
1. FP-3 + FP-4 (game.js resolution + war-end engine) together — they both change resolveBattle/checkWarEnd. Verify the engine still produces valid, winnable, non-broken outcomes.
2. FP-6 victory rating + FP-5 history comparison (game.js result functions) — read the FP-3/FP-4 state.
3. UI: surface underdog bonus + attrition + victory rating + history overview + decider banner on the result/end screens (ui.js).
4. FP-2 tiering (separate content task): 13x4 briefing strings.

## Hard rules
- Do not break Historical Mode (these touch freeplay paths + shared game.js, but resolveBattle/checkWarEnd/getFreeplayResult are freeplay-only).
- No em dashes in any new user-facing string.
- All new state must survive save/load (restoreGameState) — but most of this is derived at result time, not new persistent state. The decider "close at entry" may need a transient flag; prefer deriving it from battleHistory/momentum rather than new persisted state if possible.
- node --check must pass; verify the engine with traced examples (winnable, attrition reachable but not constant, underdog bonus offsets correctly, victory ratings map correctly).
