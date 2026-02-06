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
