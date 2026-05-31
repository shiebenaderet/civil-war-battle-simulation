// Game state and core logic for Civil War Battle Simulation v3.1
// Supports Historical Mode (guided narrative) and Free-play Mode (strategic choices)

// ============================================================
// Game State
// ============================================================

let gameState = {
    mode: null,           // 'historical' or 'freeplay'
    side: null,           // 'union' or 'confederacy'
    difficulty: 'intermediate', // 'beginner', 'intermediate', 'advanced'
    currentBattle: 0,
    studentName: '',
    period: '',
    isInBattle: false,
    // Historical mode - response tracking
    responses: [],        // { battleId, wwydChoice, reflectionText }
    // Free-play specific
    score: 0,
    soldiers: 0,
    wins: 0,
    losses: 0,
    momentum: 0,
    battleHistory: [],
    // v3.12 - Acts of the War
    shownActIntros: [],   // act indices already shown to this student
    completedRecalls: []  // act indices whose recall is complete
};

// ============================================================
// Difficulty Content Resolver
// ============================================================

// Returns the appropriate text for the current difficulty level.
// If field is a {beginner, intermediate, advanced} object, returns the right level.
// If field is a plain string/array, returns it unchanged (backwards compatible).
// Fallback chain: extra → beginner → intermediate. Anything missing falls
// to the next-easiest tier so partial ES rollout never shows empty content.
function getContent(field) {
    if (field && typeof field === 'object' && !Array.isArray(field) &&
        ('extra' in field || 'beginner' in field || 'intermediate' in field || 'advanced' in field)) {
        var d = gameState.difficulty;
        if (d === 'extra') return field.extra || field.beginner || field.intermediate || '';
        return field[d] || field.intermediate || '';
    }
    return field;
}

// Returns the difficulty key to use when reading from a {extra, beginner,
// intermediate, advanced} field. Use this for callsites that index into
// multi-level objects directly (e.g., act.recall[difficulty]).
function resolveDifficulty(field) {
    var d = gameState.difficulty || 'intermediate';
    if (!field || typeof field !== 'object') return d;
    if (d === 'extra' && !field.extra) {
        if (field.beginner) return 'beginner';
        if (field.intermediate) return 'intermediate';
    }
    if (!field[d] && field.intermediate) return 'intermediate';
    return d;
}

// Resolve side-specific fields: {union: "...", confederacy: "..."} or plain string
function getSideText(field) {
    if (field && typeof field === 'object' && !Array.isArray(field) &&
        ('union' in field || 'confederacy' in field)) {
        var sideVal = field[gameState.side] || field.union || '';
        // v3.20: a side value may itself be a {extra,beginner,intermediate,advanced}
        // reading-tier object (Free-play strategy text). getContent resolves the
        // tier; a plain string passes through unchanged (backward compatible).
        return getContent(sideVal);
    }
    // v3.20: a field with no side keys may still be a shared reading-tier object
    // (strategies whose text is the same for both sides). Resolve the tier here too.
    // getContent returns a plain string/array unchanged, so this is backward compatible.
    return getContent(field);
}

// ============================================================
// Save / Load / Progress
// ============================================================

const SAVE_KEY = 'civilWarSave';
const HISTORICAL_COMPLETE_KEY = 'civilWarHistoricalComplete';
const SCOREBOARD_KEY = 'civilWarScoreboard';
const MAX_SCOREBOARD_ENTRIES = 10;

function saveProgress() {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    } catch (e) {
        // localStorage may be full or unavailable
    }
}

function loadProgress() {
    try {
        const data = localStorage.getItem(SAVE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        return null;
    }
}

function clearSave() {
    localStorage.removeItem(SAVE_KEY);
}

function isHistoricalComplete() {
    try {
        return localStorage.getItem(HISTORICAL_COMPLETE_KEY) === 'true';
    } catch (e) {
        return false;
    }
}

function markHistoricalComplete() {
    try {
        localStorage.setItem(HISTORICAL_COMPLETE_KEY, 'true');
    } catch (e) {
        // ignore
    }
}

// ============================================================
// Initialization
// ============================================================

function initializeGame(mode, side) {
    gameState.mode = mode;
    gameState.side = side;
    gameState.currentBattle = 0;
    gameState.responses = [];

    if (mode === 'freeplay') {
        gameState.soldiers = side === 'union' ? 1500000 : 1000000;
        gameState.score = 0;
        gameState.wins = 0;
        gameState.losses = 0;
        gameState.momentum = 0;
        gameState.battleHistory = [];
    }

    saveProgress();
}

function resetGameState() {
    gameState = {
        mode: null,
        side: null,
        difficulty: 'intermediate',
        currentBattle: 0,
        studentName: '',
        responses: [],
        score: 0,
        soldiers: 0,
        wins: 0,
        losses: 0,
        momentum: 0,
        battleHistory: [],
        shownActIntros: [],
        completedRecalls: []
    };
    clearSave();
}

function restoreGameState(saved) {
    gameState = saved;
    // Ensure new fields exist for saves from older versions
    if (!gameState.responses) gameState.responses = [];
    if (!gameState.studentName) gameState.studentName = '';
    if (!gameState.period) gameState.period = '';
    if (!gameState.difficulty) gameState.difficulty = 'intermediate';
    // v3.15: isInBattle is session state, not persisted across reloads.
    // A reload mid-battle shows the resume prompt; the user opts in via Resume,
    // which re-renders the battle and re-sets the flag in renderHistoricalBattle.
    gameState.isInBattle = false;
    // v3.18: Historical Mode is Union-only. Coerce any legacy Confederate historical save.
    if (gameState.mode === 'historical' && gameState.side !== 'union') {
        gameState.side = 'union';
    }
}

// ============================================================
// Historical Mode
// ============================================================

function getHistoricalBattle() {
    return battles[gameState.currentBattle];
}

function getHistoricalContent() {
    const battle = battles[gameState.currentBattle];
    const side = gameState.side;
    const h = battle.historical;

    // Resolve the WWYD block for the current side
    var wwydRaw = h.whatWouldYouDo[side];
    var wwydResolved = {
        prompt: getContent(wwydRaw.prompt),
        options: getContent(wwydRaw.options),
        feedback: wwydRaw.feedback ? getContent(wwydRaw.feedback) : []
    };

    return {
        id: battle.id,
        name: battle.name,
        date: battle.date,
        year: battle.year,
        location: battle.location,
        image: battle.image,
        imageCredit: battle.imageCredit,
        situation: getContent(h.situation[side]),
        intel: h.intel,
        whatWouldYouDo: wwydResolved,
        whatHappened: getContent(h.whatHappened),
        tech: {
            name: h.tech.name,
            description: getContent(h.tech.description)
        },
        voice: {
            quote: h.voice.quote,
            attribution: h.voice.attribution,
            source: h.voice.source,
            explainer: h.voice.explainer ? getContent(h.voice.explainer) : ''
        },
        biggerPicture: getContent(h.biggerPicture),
        reflection: getContent(h.reflection),
        winner: h.winner,
        outcome: h.outcome,
        casualties: h.casualties,
        keyFact: getContent(h.keyFact),
        keyIdea: getContent(h.keyIdea),
        perspectives: h.perspectives || [],
        battleNumber: gameState.currentBattle + 1,
        totalBattles: battles.length
    };
}

function saveHistoricalResponse(wwydChoice, reflectionText, wwydIndex) {
    const battle = battles[gameState.currentBattle];
    gameState.responses.push({
        battleId: battle.id,
        battleName: battle.name,
        wwydChoice: wwydChoice,
        wwydMatchedHistory: wwydIndex === 0,
        reflectionText: reflectionText || ''
    });
    saveProgress();
    if (typeof gameState !== 'undefined' && gameState) gameState.isInBattle = false;
}

function advanceHistorical() {
    gameState.currentBattle++;
    saveProgress();

    var done = gameState.currentBattle >= battles.length;
    if (typeof reportProgressToDashboard === 'function') {
        reportProgressToDashboard(done);
    }

    if (done) {
        markHistoricalComplete();
        clearSave();
        return true;
    }
    return false;
}

// ============================================================
// Free-play Mode - Momentum + Fog of War System
// ============================================================

// Roll a random fog-of-war event for a battle
function rollFogOfWar(battle) {
    var events = battle.freeplay.fogOfWar;
    if (!events || events.length === 0) return null;
    var idx = Math.floor(Math.random() * events.length);
    return events[idx];
}

// Get the historical event for a battle (predetermined, side-dependent)
function getHistoricalEvent(battle) {
    var evt = battle.freeplay.historicalEvent;
    if (!evt) return null;
    return evt;
}

// Determine if player wins a battle based on strategy + momentum + fog-of-war
function resolveBattle(strategyIndex) {
    const battle = battles[gameState.currentBattle];
    const strategy = battle.freeplay.strategies[strategyIndex];
    const side = gameState.side;

    const basePower = strategy.power[side];
    const momentumBonus = Math.floor(gameState.momentum / 5);

    // FP-3: underdog comeback bonus. When momentum is negative, give a small
    // boost (max +2) that partially offsets the negative momentumBonus, so an
    // early stumble isn't mathematically fatal. 0 when momentum >= 0.
    var underdogBonus = (gameState.momentum < 0) ? Math.min(2, Math.floor(-gameState.momentum / 5)) : 0;

    // Fog of war
    var fogEvent = rollFogOfWar(battle);
    var fogMod = fogEvent ? fogEvent.mod : 0;

    // Historical event (side-dependent modifier)
    var histEvent = getHistoricalEvent(battle);
    var histMod = 0;
    if (histEvent) {
        histMod = histEvent.mod[side] || 0;
    }

    const effectivePower = basePower + momentumBonus + fogMod + histMod + underdogBonus;
    const won = effectivePower >= battle.freeplay.difficulty;

    // FP-6: final-battle decider. On the LAST battle, if the war is still close
    // (|momentum| <= 4 at entry, matching the briefing's decider banner), this
    // battle carries double weight, so the final choice actually decides the war.
    var isDecider = (gameState.currentBattle === battles.length - 1) &&
                    (Math.abs(gameState.momentum) <= 4);
    var momentumSwing = battle.freeplay.momentumValue * (isDecider ? 2 : 1);

    // Update state
    const casualties = strategy.casualties[side];
    gameState.soldiers -= casualties;
    gameState.soldiers = Math.max(0, gameState.soldiers);

    if (won) {
        gameState.wins++;
        gameState.momentum += momentumSwing;
        gameState.score += (basePower * 100) + (momentumSwing * 50);
    } else {
        gameState.losses++;
        gameState.momentum -= momentumSwing;
        gameState.score += Math.max(0, basePower * 25);
    }

    gameState.battleHistory.push({
        battleIndex: gameState.currentBattle,
        name: battle.name,
        strategy: getSideText(strategy.name),
        won: won,
        casualties: casualties,
        momentumAfter: gameState.momentum,
        fogEvent: fogEvent,
        histEvent: histEvent
    });

    saveProgress();

    return {
        won: won,
        strategy: strategy,
        battle: battle,
        casualties: casualties,
        outcomeText: won ? getSideText(strategy.outcome.win) : getSideText(strategy.outcome.lose),
        momentum: gameState.momentum,
        momentumChange: won ? momentumSwing : -momentumSwing,
        isDecider: isDecider,
        fogEvent: fogEvent,
        histEvent: histEvent,
        fogMod: fogMod,
        histMod: histMod,
        underdogBonus: underdogBonus,
        basePower: basePower,
        momentumBonus: momentumBonus,
        effectivePower: effectivePower,
        difficulty: battle.freeplay.difficulty
    };
}

// FP-4: troop floors below which the army can no longer sustain the war.
// Scaled to starting numbers (Union 1.5M, Confederacy 1.0M).
var ATTRITION_FLOOR = { union: 400000, confederacy: 250000 };

// Check if the war should end early
function checkWarEnd() {
    // FP-4: attrition check runs EVERY battle, before the 8-battle gate.
    // Bleeding your army below its floor is always terminal, no matter how
    // few battles have been fought. gameState.soldiers has already been
    // reduced by the battle just resolved (in resolveBattle).
    var floor = gameState.side === 'union' ? ATTRITION_FLOOR.union : ATTRITION_FLOOR.confederacy;
    if (gameState.soldiers <= floor) {
        return {
            ended: true,
            reason: 'attrition_defeat',
            message: 'Your army has been bled white. With too few soldiers left to continue the fight, you are forced to surrender.'
        };
    }

    const battleNum = gameState.currentBattle + 1;

    // Always play at least 8 battles (adjusted for 13-battle campaign)
    if (battleNum < 8) return { ended: false };

    if (gameState.side === 'union' && gameState.momentum >= 20) {
        return {
            ended: true,
            reason: 'momentum_victory',
            message: 'The Confederacy collapses! Your overwhelming victories have broken Southern will to fight. The war ends early with a decisive Union triumph.'
        };
    }
    if (gameState.side === 'confederacy' && gameState.momentum >= 15) {
        return {
            ended: true,
            reason: 'momentum_victory',
            message: 'The North loses the will to fight! Your string of victories convinces the Union to negotiate peace. Confederate independence is achieved!'
        };
    }

    if (gameState.side === 'union' && gameState.momentum <= -15) {
        return {
            ended: true,
            reason: 'momentum_defeat',
            message: 'Northern morale collapses. After so many defeats, the Union public demands peace negotiations. The war ends in Union failure.'
        };
    }
    if (gameState.side === 'confederacy' && gameState.momentum <= -20) {
        return {
            ended: true,
            reason: 'momentum_defeat',
            message: 'The Confederacy is overwhelmed. Union victories have destroyed your army\'s ability to fight. Surrender is inevitable.'
        };
    }

    return { ended: false };
}

// Advance to next free-play battle
function advanceFreeplay() {
    gameState.currentBattle++;
    saveProgress();

    if (gameState.currentBattle >= battles.length) {
        clearSave();
        // FP-4: an army wiped out on the final battle is still an attrition defeat,
        // not a normal completion. checkWarEnd's attrition test runs every battle,
        // but the all-battles branch returns before it, so check the floor here too.
        var attritionFloor = gameState.side === 'union' ? ATTRITION_FLOOR.union : ATTRITION_FLOOR.confederacy;
        if (gameState.soldiers <= attritionFloor) {
            return {
                ended: true,
                reason: 'attrition_defeat',
                message: 'Your army has been bled white. With too few soldiers left to continue the fight, you are forced to surrender.'
            };
        }
        return { ended: true, reason: 'all_battles' };
    }

    const warEnd = checkWarEnd();
    if (warEnd.ended) {
        clearSave();
        return warEnd;
    }

    return { ended: false };
}

// Determine final outcome for free-play.
// FP-4: optional warEndReason lets the caller force a distinct attrition
// outcome. When reason === 'attrition_defeat' the war is ALWAYS a defeat,
// regardless of momentum sign (a reckless player can win battles yet bleed
// their army dry). Param is optional; without it, the legacy momentum logic
// runs unchanged for backward compatibility.
function getFreeplayResult(warEndReason) {
    if (warEndReason === 'attrition_defeat') {
        return {
            victory: false,
            title: 'DEFEAT',
            subtitle: gameState.side === 'union'
                ? 'The Union Army is Bled White'
                : 'The Confederate Army is Bled White',
            summary: 'You won battles but spent soldiers recklessly. With too few troops left to keep fighting, your army collapsed and the war was lost to attrition.'
        };
    }
    if (gameState.momentum > 0) {
        return {
            victory: true,
            title: 'VICTORY!',
            subtitle: gameState.side === 'union'
                ? 'The Union is Preserved!'
                : 'Confederate Independence Achieved!',
            summary: getMomentumSummary(true)
        };
    } else if (gameState.momentum < 0) {
        return {
            victory: false,
            title: 'DEFEAT',
            subtitle: gameState.side === 'union'
                ? 'The Rebellion Continues...'
                : 'The Confederacy Falls...',
            summary: getMomentumSummary(false)
        };
    } else {
        const won = gameState.wins > gameState.losses;
        return {
            victory: won,
            title: won ? 'NARROW VICTORY' : 'STALEMATE',
            subtitle: won
                ? 'A hard-fought win by the narrowest of margins.'
                : 'Neither side could achieve a decisive result.',
            summary: 'The war ground to an exhausting conclusion with both sides nearly equal. History could have gone either way.'
        };
    }
}

function getMomentumSummary(victory) {
    const m = Math.abs(gameState.momentum);
    if (m >= 15) return 'A decisive, overwhelming campaign. Your strategic choices dominated the war.';
    if (m >= 10) return 'A strong campaign with clear momentum in your favor. Your decisions consistently outmatched the enemy.';
    if (m >= 5) return 'A solid but hard-fought campaign. Your choices made the difference, but it was closer than it might seem.';
    return 'An extremely close campaign that could have gone either way. Every decision mattered.';
}

// ============================================================
// FP-6: Victory rating + FP-5: "Did you change history?" overview
// Both are derived at result time from gameState (momentum, side,
// battleHistory, soldiers) plus the war-end reason. They add NO new
// persisted state and do NOT touch Historical Mode. The UI (next task)
// calls them; they return plain data only.
// ============================================================

// FP-6: classify the final outcome into a rating label + styling tone.
// Pass the war-end reason so an attrition defeat overrides momentum.
// tone is for UI styling only ('victory' | 'defeat' | 'neutral').
function getVictoryRating(warEndReason) {
    if (warEndReason === 'attrition_defeat') {
        return {
            label: 'Costly Defeat',
            tone: 'defeat',
            note: 'Your army was destroyed before the war could be won.'
        };
    }
    var m = gameState.momentum;
    if (m >= 15) return { label: 'Crushing Victory', tone: 'victory', note: 'You dominated the war from start to finish. The enemy never recovered.' };
    if (m >= 5)  return { label: 'Clear Victory', tone: 'victory', note: 'A strong campaign. Your choices kept you ahead through the hard battles.' };
    if (m >= 1)  return { label: 'Narrow Victory', tone: 'victory', note: 'You won, but only just. A few different choices and it could have gone the other way.' };
    if (m === 0) {
        // At dead-even momentum, tiebreak on the win/loss record so this badge
        // agrees with getFreeplayResult (which calls a wins>losses edge a narrow win).
        if (gameState.wins > gameState.losses) {
            return { label: 'Narrow Victory', tone: 'victory', note: 'You won, but only just. A few different choices and it could have gone the other way.' };
        }
        return { label: 'Stalemate', tone: 'neutral', note: 'Neither side could break the other. The war ground to an even, exhausting halt.' };
    }
    if (m <= -15) return { label: 'Decisive Defeat', tone: 'defeat', note: 'The enemy outfought you at nearly every turn. There was no way back.' };
    return { label: 'Defeat', tone: 'defeat', note: 'You lost more ground than you gained. The war slipped away from you.' };
}

// FP-5: structured comparison of the player's run to the real Civil War.
// Returns a small array of comparison points plus one overall divergence
// highlight. The UI renders this into a "Did you change history?" panel.
// Real-history reference: the Union won, the war was fought all 13 battles
// (1861-1865), and about 620,000 Americans died.
function getHistoryComparison(warEndReason) {
    var side = gameState.side;
    var playerIsUnion = side === 'union';
    // An attrition defeat is never a win, no matter the momentum sign.
    var playerWon = warEndReason !== 'attrition_defeat' && gameState.momentum > 0;

    var startingSoldiers = playerIsUnion ? 1500000 : 1000000;
    var lost = Math.max(0, startingSoldiers - gameState.soldiers);
    var rate = Math.round((lost / startingSoldiers) * 100);

    var battlesPlayed = gameState.battleHistory.length;
    var realBattles = 13;

    var points = [];

    // 1. Who won, vs the real outcome (the Union won the real war).
    var whoWon;
    if (playerIsUnion && playerWon) {
        whoWon = { label: 'Who won', playerText: 'You led the Union to victory, as in real history.', historyText: 'The Union won the real Civil War.', changed: false };
    } else if (playerIsUnion && !playerWon) {
        whoWon = { label: 'Who won', playerText: 'You could not save the Union. History went the other way.', historyText: 'The Union won the real Civil War.', changed: true };
    } else if (!playerIsUnion && playerWon) {
        whoWon = { label: 'Who won', playerText: 'You won independence for the Confederacy. In real life, the Confederacy lost.', historyText: 'The Confederacy lost the real Civil War.', changed: true };
    } else {
        whoWon = { label: 'Who won', playerText: 'The Confederacy fell, as it did in real history.', historyText: 'The Confederacy lost the real Civil War.', changed: false };
    }
    points.push(whoWon);

    // 2. Length: how long the player's war lasted vs the real 13 battles.
    var length;
    if (battlesPlayed < realBattles) {
        length = {
            label: 'How long it lasted',
            playerText: 'Your war ended early, at battle ' + battlesPlayed + '. The real war was fought all the way to battle 13.',
            historyText: 'The real war ran all 13 battles, from 1861 to 1865.',
            changed: true
        };
    } else {
        length = {
            label: 'How long it lasted',
            playerText: 'You fought all 13 battles, like the real war.',
            historyText: 'The real war ran all 13 battles, from 1861 to 1865.',
            changed: false
        };
    }
    points.push(length);

    // 3. Casualties: framed around the player's choices, not raw history.
    var casualties;
    if (rate >= 50) {
        casualties = {
            label: 'The cost in lives',
            playerText: 'You lost over half your army (' + rate + '% casualties). A brutal, costly campaign.',
            historyText: 'About 620,000 Americans died in the real war.',
            changed: true
        };
    } else if (rate <= 20) {
        casualties = {
            label: 'The cost in lives',
            playerText: playerWon
                ? 'You won with light losses (' + rate + '% casualties), far more careful than the real generals.'
                : 'You kept losses light (' + rate + '% casualties), far more careful than the real generals.',
            historyText: 'About 620,000 Americans died in the real war.',
            changed: true
        };
    } else {
        casualties = {
            label: 'The cost in lives',
            playerText: 'Your campaign cost a serious number of soldiers (' + rate + '% casualties), about what such a war demands.',
            historyText: 'About 620,000 Americans died in the real war.',
            changed: false
        };
    }
    points.push(casualties);

    // 4. Divergence highlight: pick ONE, in priority order.
    var highlight;
    if (!playerIsUnion && playerWon) {
        highlight = 'You changed history: the Confederacy won the war.';
    } else if (playerIsUnion && !playerWon) {
        highlight = 'History diverged: the Union failed to hold the nation together.';
    } else if (battlesPlayed <= 9) {
        highlight = 'You ended the war far faster than the four years it really took.';
    } else if (rate <= 20) {
        highlight = 'You won with remarkably few lives lost.';
    } else {
        highlight = 'Your campaign followed the broad arc of history.';
    }

    return {
        points: points,
        highlight: highlight
    };
}

// ============================================================
// Scoreboard
// ============================================================

function getScoreboard() {
    try {
        const data = localStorage.getItem(SCOREBOARD_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function saveToScoreboard(playerName) {
    const scoreboard = getScoreboard();
    const startingSoldiers = gameState.side === 'union' ? 1500000 : 1000000;

    const entry = {
        name: playerName,
        score: gameState.score,
        side: gameState.side,
        wins: gameState.wins,
        losses: gameState.losses,
        momentum: gameState.momentum,
        battlesPlayed: gameState.battleHistory.length,
        soldiersRemaining: gameState.soldiers,
        casualtyRate: Math.round(((startingSoldiers - gameState.soldiers) / startingSoldiers) * 100),
        victory: gameState.momentum > 0 || (gameState.momentum === 0 && gameState.wins > gameState.losses),
        date: new Date().toLocaleDateString()
    };

    scoreboard.push(entry);
    scoreboard.sort(function(a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return a.casualtyRate - b.casualtyRate;
    });

    if (scoreboard.length > MAX_SCOREBOARD_ENTRIES) {
        scoreboard.length = MAX_SCOREBOARD_ENTRIES;
    }

    try {
        localStorage.setItem(SCOREBOARD_KEY, JSON.stringify(scoreboard));
    } catch (e) {
        // ignore
    }

    return scoreboard;
}

function clearScoreboard() {
    localStorage.removeItem(SCOREBOARD_KEY);
}

// ============================================================
// Utilities
// ============================================================

function getAssetManifest() {
    const manifestScript = document.getElementById('assetManifest');
    if (manifestScript) {
        return JSON.parse(manifestScript.textContent);
    }
    return [];
}
