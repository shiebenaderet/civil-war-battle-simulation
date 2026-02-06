// Game state and core logic for Civil War Battle Simulation

// Game State
let gameState = {
    side: null,
    currentBattle: 0,
    score: 0,
    soldiers: 0,
    wins: 0,
    losses: 0,
    battleHistory: []
};

// Settings
let settings = {
    vocabHelp: true
};

// Load asset manifest from embedded JSON
function getAssetManifest() {
    const manifestScript = document.getElementById('assetManifest');
    if (manifestScript) {
        return JSON.parse(manifestScript.textContent);
    }
    return [];
}

// Initialize soldiers based on side choice
function initializeArmy() {
    gameState.soldiers = gameState.side === 'union' ? 1500000 : 1000000;
    gameState.currentBattle = 0;
    gameState.score = 0;
    gameState.wins = 0;
    gameState.losses = 0;
    gameState.battleHistory = [];
}

// Process a strategy decision and update game state
function processDecision(strategyIndex) {
    const battle = battles[gameState.currentBattle];
    const strategy = battle.strategies[strategyIndex];
    const result = strategy[gameState.side];

    if (result.win) {
        gameState.wins++;
    } else {
        gameState.losses++;
    }

    gameState.soldiers -= result.soldierLoss;
    gameState.soldiers = Math.max(0, gameState.soldiers);
    gameState.score += result.scoreGain;

    gameState.battleHistory.push({
        battleNumber: gameState.currentBattle + 1,
        name: battle.name,
        strategy: strategy.name,
        result: result.win ? 'Victory' : 'Defeat',
        casualties: result.soldierLoss
    });

    return { result, strategy, battle };
}

// Determine if the game should end
function shouldEndGame() {
    const requiredWins = gameState.side === 'union' ? 6 : 5;
    const battlesRemaining = battles.length - gameState.currentBattle;

    // End if we've won enough battles
    if (gameState.wins >= requiredWins) return true;

    // End if we can't possibly win even by winning all remaining battles
    if (gameState.wins + battlesRemaining < requiredWins) return true;

    // End if we've run out of soldiers
    if (gameState.soldiers <= 0) return true;

    return false;
}

// Advance to the next battle, returns true if game should end
function advanceToNextBattle() {
    gameState.currentBattle++;
    return gameState.currentBattle >= battles.length || gameState.soldiers <= 0 || shouldEndGame();
}

// Check if the player achieved victory
function checkVictory() {
    const requiredWins = gameState.side === 'union' ? 6 : 5;
    return gameState.wins >= requiredWins && gameState.soldiers > 0;
}

// Get starting soldier count for a side
function getStartingSoldiers(side) {
    return side === 'union' ? 1500000 : 1000000;
}

// Get required wins for a side
function getRequiredWins(side) {
    return side === 'union' ? 6 : 5;
}

// Reset game state
function resetGameState() {
    gameState = {
        side: null,
        currentBattle: 0,
        score: 0,
        soldiers: 0,
        wins: 0,
        losses: 0,
        battleHistory: []
    };
}

// Categorize a strategy name into a type
function categorizeStrategy(strategyName) {
    const aggressiveStrategies = [
        'Direct Attack', 'Immediate Counterattack', 'Coordinated Assault',
        'Attack the Center', 'Direct Assault', 'Exploit the Gap',
        'Push Through Despite Losses', 'Aggressive Field Battle', 'Fight to the End'
    ];
    const defensiveStrategies = [
        'Defensive Position', 'Form Defensive Lines', 'Hold the High Ground',
        'Artillery Bombardment First', 'Hold Defensive Positions', 'Steady Pressure',
        'Defensive Stand', 'Wait for Better Terrain', 'Defend the City'
    ];

    if (aggressiveStrategies.includes(strategyName)) return 'aggressive';
    if (defensiveStrategies.includes(strategyName)) return 'defensive';
    return 'tactical';
}

// Scoreboard - persistent high scores using localStorage
const SCOREBOARD_KEY = 'civilWarScoreboard';
const MAX_SCOREBOARD_ENTRIES = 10;

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
    const startingSoldiers = getStartingSoldiers(gameState.side);

    const entry = {
        name: playerName,
        score: gameState.score,
        side: gameState.side,
        wins: gameState.wins,
        losses: gameState.losses,
        battlesPlayed: gameState.battleHistory.length,
        soldiersRemaining: gameState.soldiers,
        casualtyRate: Math.round(((startingSoldiers - gameState.soldiers) / startingSoldiers) * 100),
        victory: checkVictory(),
        date: new Date().toLocaleDateString()
    };

    scoreboard.push(entry);

    // Sort by score descending, then by fewer casualties
    scoreboard.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.casualtyRate - b.casualtyRate;
    });

    // Keep only top entries
    if (scoreboard.length > MAX_SCOREBOARD_ENTRIES) {
        scoreboard.length = MAX_SCOREBOARD_ENTRIES;
    }

    try {
        localStorage.setItem(SCOREBOARD_KEY, JSON.stringify(scoreboard));
    } catch (e) {
        // localStorage may be full or unavailable
    }

    return scoreboard;
}

function clearScoreboard() {
    localStorage.removeItem(SCOREBOARD_KEY);
}

// Historical Mode - track whether the player's choice matched history
function getHistoricalComparison(battleIndex, playerWon) {
    const battle = battles[battleIndex];
    const historicalWinner = battle.historicalWinner;

    let playerMatchedHistory = false;

    if (gameState.side === 'union') {
        const unionWonHistorically = (historicalWinner === 'union');
        playerMatchedHistory = (playerWon === unionWonHistorically);
    } else {
        const confWonHistorically = (historicalWinner === 'confederacy');
        playerMatchedHistory = (playerWon === confWonHistorically);
    }

    // For draws, the player's outcome is always "different" from history
    if (historicalWinner === 'draw') {
        playerMatchedHistory = false;
    }

    return {
        historicalWinner: historicalWinner,
        historicalOutcome: battle.historicalOutcome,
        playerMatchedHistory: playerMatchedHistory
    };
}

// Performance utilities
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function measurePerformance(name, fn) {
    if ('performance' in window && 'mark' in performance) {
        performance.mark(`${name}-start`);
        const result = fn();
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        return result;
    }
    return fn();
}
