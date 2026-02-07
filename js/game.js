// Game state and core logic for Civil War Battle Simulation v3.1
// Supports Historical Mode (guided narrative) and Free-play Mode (strategic choices)

// ============================================================
// Game State
// ============================================================

let gameState = {
    mode: null,           // 'historical' or 'freeplay'
    side: null,           // 'union' or 'confederacy'
    currentBattle: 0,
    studentName: '',
    // Historical mode - response tracking
    responses: [],        // { battleId, wwydChoice, reflectionText }
    // Free-play specific
    score: 0,
    soldiers: 0,
    wins: 0,
    losses: 0,
    momentum: 0,
    battleHistory: []
};

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
        currentBattle: 0,
        studentName: '',
        responses: [],
        score: 0,
        soldiers: 0,
        wins: 0,
        losses: 0,
        momentum: 0,
        battleHistory: []
    };
    clearSave();
}

function restoreGameState(saved) {
    gameState = saved;
    // Ensure new fields exist for saves from older versions
    if (!gameState.responses) gameState.responses = [];
    if (!gameState.studentName) gameState.studentName = '';
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

    return {
        id: battle.id,
        name: battle.name,
        date: battle.date,
        year: battle.year,
        location: battle.location,
        image: battle.image,
        imageCredit: battle.imageCredit,
        situation: h.situation[side],
        intel: h.intel,
        whatWouldYouDo: h.whatWouldYouDo[side],
        whatHappened: h.whatHappened,
        tech: h.tech,
        voice: h.voice,
        biggerPicture: h.biggerPicture,
        reflection: h.reflection,
        winner: h.winner,
        outcome: h.outcome,
        casualties: h.casualties,
        keyFact: h.keyFact,
        battleNumber: gameState.currentBattle + 1,
        totalBattles: battles.length
    };
}

function saveHistoricalResponse(wwydChoice, reflectionText) {
    const battle = battles[gameState.currentBattle];
    gameState.responses.push({
        battleId: battle.id,
        battleName: battle.name,
        wwydChoice: wwydChoice,
        reflectionText: reflectionText || ''
    });
    saveProgress();
}

function advanceHistorical() {
    gameState.currentBattle++;
    saveProgress();

    if (gameState.currentBattle >= battles.length) {
        markHistoricalComplete();
        clearSave();
        return true; // done
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

    // Fog of war
    var fogEvent = rollFogOfWar(battle);
    var fogMod = fogEvent ? fogEvent.mod : 0;

    // Historical event (side-dependent modifier)
    var histEvent = getHistoricalEvent(battle);
    var histMod = 0;
    if (histEvent) {
        histMod = histEvent.mod[side] || 0;
    }

    const effectivePower = basePower + momentumBonus + fogMod + histMod;
    const won = effectivePower >= battle.freeplay.difficulty;

    // Update state
    const casualties = strategy.casualties[side];
    gameState.soldiers -= casualties;
    gameState.soldiers = Math.max(0, gameState.soldiers);

    if (won) {
        gameState.wins++;
        gameState.momentum += battle.freeplay.momentumValue;
        gameState.score += (basePower * 100) + (battle.freeplay.momentumValue * 50);
    } else {
        gameState.losses++;
        gameState.momentum -= battle.freeplay.momentumValue;
        gameState.score += Math.max(0, basePower * 25);
    }

    gameState.battleHistory.push({
        battleIndex: gameState.currentBattle,
        name: battle.name,
        strategy: strategy.name,
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
        outcomeText: won ? strategy.outcome.win : strategy.outcome.lose,
        momentum: gameState.momentum,
        momentumChange: won ? battle.freeplay.momentumValue : -battle.freeplay.momentumValue,
        fogEvent: fogEvent,
        histEvent: histEvent,
        fogMod: fogMod,
        histMod: histMod,
        basePower: basePower,
        momentumBonus: momentumBonus,
        effectivePower: effectivePower,
        difficulty: battle.freeplay.difficulty
    };
}

// Check if the war should end early
function checkWarEnd() {
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
        return { ended: true, reason: 'all_battles' };
    }

    const warEnd = checkWarEnd();
    if (warEnd.ended) {
        clearSave();
        return warEnd;
    }

    return { ended: false };
}

// Determine final outcome for free-play
function getFreeplayResult() {
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
