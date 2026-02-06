// UI/DOM manipulation for Civil War Battle Simulation

// DOM element references
let elements = {};

// Cache DOM references
function cacheElements() {
    elements = {
        sideSelection: document.getElementById('sideSelection'),
        sideIntroduction: document.getElementById('sideIntroduction'),
        battleBriefing: document.getElementById('battleBriefing'),
        gameScreen: document.getElementById('gameScreen'),
        battleResultsModal: document.getElementById('battleResultsModal'),
        campaignLogModal: document.getElementById('campaignLogModal'),
        endGameSummary: document.getElementById('endGameSummary'),
        unionCard: document.getElementById('unionCard'),
        confederacyCard: document.getElementById('confederacyCard'),
        proceedToGame: document.getElementById('proceedToGame'),
        backToSideBtn: document.getElementById('backToSideBtn'),
        startOverBtn: document.getElementById('startOverBtn'),
        continueBattleBtn: document.getElementById('continueBattleBtn'),
        campaignLogBtn: document.getElementById('campaignLogBtn'),
        closeLogBtn: document.getElementById('closeLogBtn'),
        playAgainBtn: document.getElementById('playAgainBtn'),
        photoToggle: document.getElementById('photoToggle'),
        mapToggle: document.getElementById('mapToggle'),
        briefingImage: document.getElementById('briefingImage'),
        briefingMap: document.getElementById('briefingMap'),
        // Navigation elements
        navbarStats: document.getElementById('navbarStats'),
        navScore: document.getElementById('navScore'),
        navSoldiers: document.getElementById('navSoldiers'),
        navBattleNumber: document.getElementById('navBattleNumber'),
        navWins: document.getElementById('navWins'),
        campaignLogNavBtn: document.getElementById('campaignLogNavBtn'),
        startOverNavBtn: document.getElementById('startOverNavBtn'),
        vocabToggleNav: document.getElementById('vocabToggleNav'),
        settingsBtn: document.getElementById('settingsBtn'),
        settingsMenu: document.getElementById('settingsMenu'),
        vocabStatus: document.getElementById('vocabStatus')
    };
}

// Hide all game screens
function hideAllScreens() {
    elements.sideSelection.style.display = 'none';
    elements.sideIntroduction.style.display = 'none';
    elements.battleBriefing.style.display = 'none';
    elements.gameScreen.style.display = 'none';
    elements.battleResultsModal.style.display = 'none';
    elements.campaignLogModal.style.display = 'none';
    elements.endGameSummary.style.display = 'none';
}

// Show side selection screen
function showSideSelection() {
    gameState.side = null;
    hideAllScreens();
    elements.sideSelection.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show side introduction with leader message
function showSideIntroduction() {
    hideAllScreens();
    elements.sideIntroduction.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Select a side and display leader message
function selectSide(side) {
    gameState.side = side;

    const leader = leaderMessages[side];
    document.getElementById('leaderPortrait').textContent = leader.portrait;
    document.getElementById('leaderName').textContent = leader.name;
    document.getElementById('leaderMessage').innerHTML = leader.message;

    const objectivesList = document.getElementById('objectivesList');
    objectivesList.innerHTML = '';
    leader.objectives.forEach(objective => {
        const item = document.createElement('div');
        item.className = 'objective-item';
        item.textContent = objective;
        objectivesList.appendChild(item);
    });

    showSideIntroduction();
}

// Start the first battle
function startFirstBattle() {
    initializeArmy();
    showBattleBriefing();
}

// Display battle briefing screen
function showBattleBriefing() {
    const battle = battles[gameState.currentBattle];
    const assets = getAssetManifest();

    document.getElementById('briefingTitle').textContent = battle.name;
    document.getElementById('briefingDate').textContent = battle.date;
    document.getElementById('contextText').innerHTML = battle.context;

    // Find matching asset for this battle
    let battleAsset = assets[gameState.currentBattle];

    // If no direct index match, try name matching as fallback
    if (!battleAsset) {
        battleAsset = assets.find(asset => {
            const assetName = asset.id.replace(/_/g, ' ').toLowerCase();
            const battleName = battle.name.toLowerCase();
            return battleName.includes(assetName) ||
                   (assetName.includes('bull') && battleName.includes('bull')) ||
                   (assetName.includes('antietam') && battleName.includes('antietam')) ||
                   (assetName.includes('gettysburg') && battleName.includes('gettysburg'));
        });
    }

    // Final fallback to first asset
    if (!battleAsset) {
        battleAsset = assets[0];
    }

    // Update battle image
    const briefingImage = elements.briefingImage;
    const briefingMap = elements.briefingMap;

    if (!battleAsset) {
        briefingImage.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--color-text-secondary); background: var(--color-surface-secondary); border-radius: var(--radius-xl);">
                <div style="font-size: 3em; margin-bottom: 10px;">&#x274C;</div>
                <p style="font-weight: 600;">No Image Asset Found</p>
                <p style="font-size: 0.9em; margin-top: 5px;">${battle.name}</p>
            </div>
        `;
        return;
    }

    if (battleAsset && briefingImage) {
        // Show loading state
        briefingImage.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--color-text-secondary);">
                <div style="font-size: 2em; margin-bottom: 10px;">&#x1F4F7;</div>
                <p>Loading image...</p>
            </div>
        `;

        const imageUrl = battleAsset.url;
        const fallbackSvg = btoa(`<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#2a2a2a"/><text x="200" y="120" fill="white" text-anchor="middle" font-size="18">Historical Image</text><text x="200" y="150" fill="white" text-anchor="middle" font-size="16">${battle.name}</text><text x="200" y="180" fill="white" text-anchor="middle" font-size="14">${battle.date}</text></svg>`);

        briefingImage.innerHTML = `
            <img src="${imageUrl}"
                 alt="${battleAsset.title}"
                 loading="lazy"
                 decoding="async"
                 style="transition: opacity 0.3s ease; width: 100%; height: 100%; object-fit: cover;"
                 onload="this.style.opacity='1'"
                 onerror="this.onerror=null; this.src='data:image/svg+xml;base64,${fallbackSvg}'; this.style.opacity='1';">
            <span class="image-credit" style="position: absolute; bottom: 8px; left: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">${battleAsset.credit} &bull; ${battleAsset.source}</span>
        `;
    } else {
        briefingImage.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--color-text-secondary);">
                <div style="font-size: 3em; margin-bottom: 10px;">&#x2694;&#xFE0F;</div>
                <p>${battle.name}</p>
                <p style="font-size: 0.9em; margin-top: 5px;">${battle.date}</p>
            </div>
        `;
    }

    // Create and populate battle map
    const battleId = battleAsset ? battleAsset.id : 'generic';
    briefingMap.innerHTML = createBattleMap(battleId);

    // Reset to photo view by default
    toggleVisualModeWithAnimation('photo');

    // Create strategy choices
    const choicesList = document.getElementById('choicesList');
    choicesList.innerHTML = '';

    battle.strategies.forEach((strategy, index) => {
        const choiceDiv = document.createElement('div');
        choiceDiv.className = `choice-option ${index === 0 ? 'aggressive' : index === 1 ? 'defensive' : 'tactical'}`;
        choiceDiv.innerHTML = `
            <div class="choice-header">
                <div class="choice-name">${strategy.name}</div>
                <div class="expand-icon">&#x25BC;</div>
            </div>
            <div class="choice-description">${strategy.description}</div>
            <div class="choice-details">
                <div class="choice-explanation">${strategy.explanation}</div>
                <div class="choice-pros-cons">
                    <div class="pros">
                        <div class="pros-title">&#x2713; Advantages:</div>
                        <ul>
                            ${strategy.pros.map(pro => `<li>${pro}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="cons">
                        <div class="cons-title">&#x2717; Risks:</div>
                        <ul>
                            ${strategy.cons.map(con => `<li>${con}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;

        // Click handler: first click expands, second click decides
        choiceDiv.addEventListener('click', () => {
            const isExpanded = choiceDiv.classList.contains('expanded');

            if (!isExpanded) {
                document.querySelectorAll('.choice-option').forEach(option => {
                    option.classList.remove('expanded');
                });
                choiceDiv.classList.add('expanded');
            } else {
                makeDecision(index);
            }
        });

        choicesList.appendChild(choiceDiv);
    });

    // Add instruction text
    const instructionDiv = document.createElement('div');
    instructionDiv.className = 'click-to-expand';
    instructionDiv.innerHTML = '&#x1F4A1; <strong>How it works:</strong> First click = see details &bull; Second click = make decision';
    choicesList.appendChild(instructionDiv);

    hideAllScreens();
    elements.battleBriefing.style.display = 'block';
    updateGameDisplay();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateVocabularyDisplay();
}

// Process player's strategy decision
function makeDecision(strategyIndex) {
    const { result, strategy } = processDecision(strategyIndex);
    showBattleResults(result, strategy);
}

// Display battle results
function showBattleResults(result, strategy) {
    const battle = battles[gameState.currentBattle];

    // Set outcome
    const outcomeEl = document.getElementById('battleOutcome');
    outcomeEl.textContent = result.win ? 'VICTORY!' : 'DEFEAT';
    outcomeEl.className = result.win ? 'battle-outcome battle-victory' : 'battle-outcome battle-defeat';

    // Set results summary
    document.getElementById('resultIcon').textContent = result.win ? '\u{1F3C6}' : '\u{1F480}';
    document.getElementById('resultText').textContent = result.win ?
        'Your strategy succeeded!' : 'Your strategy was defeated.';

    document.getElementById('casualtiesSummary').textContent = `${result.soldierLoss.toLocaleString()} lost`;
    document.getElementById('scoreSummary').textContent = `+${result.scoreGain} points`;
    document.getElementById('armySummary').textContent = `${gameState.soldiers.toLocaleString()} remain`;

    // Create detailed explanation
    const sideResult = gameState.side === 'union' ?
        (result.win ? 'union_victory' : 'union_loss') :
        (result.win ? 'confederacy_victory' : 'confederacy_defeat');

    const outcomeHighlight = result.win ?
        '<span class="outcome-highlight victory-highlight">\u{1F389} YOU WON THIS BATTLE! \u{1F389}</span>' :
        '<span class="outcome-highlight defeat-highlight">\u{1F494} You lost this battle \u{1F494}</span>';

    document.getElementById('explanationText').innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            ${outcomeHighlight}
        </div>
        <p><strong>Your Strategy:</strong> ${strategy.name}</p>
        <p><strong>What Happened:</strong> ${battle.results[sideResult] || 'The battle outcome was determined by your strategic choice.'}</p>
        <p style="margin-top: 15px;"><strong>Why this happened:</strong> ${strategy.explanation.replace(/<[^>]*>/g, '')}</p>
    `;

    document.getElementById('historicalNote').textContent = battle.historical_notes.general;

    // Historical Mode - show what really happened
    const comparison = getHistoricalComparison(gameState.currentBattle, result.win);
    const historicalSection = document.getElementById('historicalComparison');
    if (historicalSection) {
        const winnerLabel = comparison.historicalWinner === 'union' ? 'Union victory' :
                           comparison.historicalWinner === 'confederacy' ? 'Confederate victory' : 'Draw / Inconclusive';
        const matchIcon = comparison.playerMatchedHistory ? '\u2705' : '\u{1F504}';
        const matchText = comparison.playerMatchedHistory ?
            'Your result matched what really happened!' :
            'In real history, this battle went differently than your game.';

        historicalSection.innerHTML = `
            <div class="history-comparison-header">
                <span class="history-icon">\u{1F4DC}</span> What Really Happened
            </div>
            <div class="history-comparison-body">
                <div class="history-real-outcome">
                    <strong>Real outcome:</strong> ${winnerLabel}
                </div>
                <p class="history-detail">${comparison.historicalOutcome}</p>
                <div class="history-match ${comparison.playerMatchedHistory ? 'matched' : 'different'}">
                    ${matchIcon} ${matchText}
                </div>
            </div>
        `;
        historicalSection.style.display = 'block';
    }

    // Update button text
    if (gameState.currentBattle + 1 >= battles.length || gameState.soldiers <= 0) {
        elements.continueBattleBtn.textContent = 'View Final Results';
    } else {
        elements.continueBattleBtn.textContent = 'Continue to Next Battle';
    }

    updateGameDisplay();

    hideAllScreens();
    elements.gameScreen.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Continue to next battle or end game
function continueToNextBattle() {
    const gameOver = advanceToNextBattle();
    if (gameOver) {
        endGame();
    } else {
        showBattleBriefing();
    }
}

// End the game and show summary
function endGame() {
    const victory = checkVictory();
    showEndGameSummary(victory);
}

// Display end game summary
function showEndGameSummary(victory) {
    hideAllScreens();

    const banner = document.getElementById('outcomeBanner');
    banner.className = victory ? 'outcome-banner victory-banner' : 'outcome-banner defeat-banner';

    document.getElementById('outcomeTitle').textContent = victory ? 'VICTORY!' : 'DEFEAT';
    document.getElementById('outcomeSubtitle').textContent = victory ?
        (gameState.side === 'union' ? 'The Union is Preserved' : 'Confederate Independence Achieved') :
        (gameState.side === 'union' ? 'The Rebellion Continues' : 'The Confederacy Falls');

    const startingSoldiers = getStartingSoldiers(gameState.side);
    const casualtyRate = Math.round(((startingSoldiers - gameState.soldiers) / startingSoldiers) * 100);

    document.getElementById('finalStatsText').innerHTML = `
        <div style="text-align: left; max-width: 600px; margin: 0 auto;">
            <h3 style="color: #ffd700; margin-bottom: 15px;">Your Performance:</h3>
            <p><strong>Final Score:</strong> ${gameState.score.toLocaleString()} points</p>
            <p><strong>Battles Won:</strong> ${gameState.wins} out of ${gameState.currentBattle} fought</p>
            <p><strong>Soldiers Lost:</strong> ${(startingSoldiers - gameState.soldiers).toLocaleString()} (${casualtyRate}% casualty rate)</p>
            <p><strong>Side:</strong> ${gameState.side === 'union' ? '\u{1F1FA}\u{1F1F8} Union' : '\u{1F3F4} Confederacy'}</p>

            <h3 style="color: #ffd700; margin: 20px 0 10px 0;">What You Learned:</h3>
            <p>You experienced the same difficult decisions that real Civil War commanders faced. Each battle presented unique challenges based on terrain, troop positions, and available resources.</p>

            <p style="margin-top: 15px;">
                ${victory ?
                    'Congratulations! Your strategic decisions led to victory. In the real Civil War, these battles helped determine the future of the United States.' :
                    'Although you didn\'t achieve victory, you learned about the challenges of Civil War command. Every battle taught lessons that real generals had to learn the hard way.'
                }
            </p>

            <h3 style="color: #ffd700; margin: 20px 0 10px 0;">Battle Summary:</h3>
            <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px;">
                ${gameState.battleHistory.map(battle =>
                    `<div style="margin: 5px 0; padding: 5px; border-left: 3px solid ${battle.result === 'Victory' ? '#10b981' : '#dc2626'};">
                        <strong>${battle.name}:</strong> ${battle.result === 'Victory' ? '\u2705' : '\u274C'} ${battle.result}
                        (${battle.strategy}, ${battle.casualties.toLocaleString()} casualties)
                    </div>`
                ).join('')}
            </div>
        </div>
    `;

    // Render scoreboard section
    renderScoreboardSection();

    elements.endGameSummary.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Scoreboard UI
function renderScoreboardSection() {
    const container = document.getElementById('scoreboardSection');
    if (!container) return;

    const scoreboard = getScoreboard();

    container.innerHTML = `
        <div class="scoreboard-entry-form" id="scoreEntryForm">
            <h3 class="scoreboard-form-title">\u{1F3C6} Add Your Score to the Leaderboard</h3>
            <div class="scoreboard-input-row">
                <input type="text" id="playerNameInput" class="player-name-input"
                       placeholder="Enter your name (e.g. first name + last initial)"
                       maxlength="20" aria-label="Your name for the scoreboard">
                <button class="save-score-btn" id="saveScoreBtn">Save Score</button>
            </div>
        </div>
        <div class="scoreboard-table-wrapper">
            <h3 class="scoreboard-title">\u{1F4CA} Class Leaderboard</h3>
            ${renderScoreboardTable(scoreboard)}
            ${scoreboard.length > 0 ? '<button class="clear-scores-btn" id="clearScoresBtn">Clear All Scores</button>' : ''}
        </div>
    `;

    // Wire up save button
    const saveBtn = document.getElementById('saveScoreBtn');
    const nameInput = document.getElementById('playerNameInput');
    if (saveBtn && nameInput) {
        saveBtn.addEventListener('click', () => {
            const name = nameInput.value.trim();
            if (!name) {
                nameInput.focus();
                nameInput.style.borderColor = '#dc2626';
                return;
            }
            const updated = saveToScoreboard(name);
            // Hide form, refresh table
            document.getElementById('scoreEntryForm').innerHTML =
                '<p class="score-saved-msg">\u2705 Score saved!</p>';
            document.querySelector('.scoreboard-table-wrapper').innerHTML = `
                <h3 class="scoreboard-title">\u{1F4CA} Class Leaderboard</h3>
                ${renderScoreboardTable(updated)}
                <button class="clear-scores-btn" id="clearScoresBtn">Clear All Scores</button>
            `;
            wireUpClearButton();
        });

        nameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') saveBtn.click();
            nameInput.style.borderColor = '';
        });
    }

    wireUpClearButton();
}

function wireUpClearButton() {
    const clearBtn = document.getElementById('clearScoresBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Clear all scores from the leaderboard?')) {
                clearScoreboard();
                document.querySelector('.scoreboard-table-wrapper').innerHTML = `
                    <h3 class="scoreboard-title">\u{1F4CA} Class Leaderboard</h3>
                    ${renderScoreboardTable([])}
                `;
            }
        });
    }
}

function renderScoreboardTable(scoreboard) {
    if (scoreboard.length === 0) {
        return '<p class="scoreboard-empty">No scores yet. Be the first to play!</p>';
    }

    const rows = scoreboard.map((entry, i) => {
        const medal = i === 0 ? '\u{1F947}' : i === 1 ? '\u{1F948}' : i === 2 ? '\u{1F949}' : (i + 1);
        const sideIcon = entry.side === 'union' ? '\u{1F1FA}\u{1F1F8}' : '\u{1F3F4}';
        const victoryIcon = entry.victory ? '\u2705' : '\u274C';
        return `
            <tr class="scoreboard-row ${i < 3 ? 'top-three' : ''}">
                <td class="rank-cell">${medal}</td>
                <td class="name-cell">${escapeHtml(entry.name)}</td>
                <td class="score-cell">${entry.score.toLocaleString()}</td>
                <td class="side-cell">${sideIcon}</td>
                <td class="record-cell">${entry.wins}W-${entry.losses}L</td>
                <td class="victory-cell">${victoryIcon}</td>
            </tr>
        `;
    }).join('');

    return `
        <table class="scoreboard-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Side</th>
                    <th>Record</th>
                    <th>Won?</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update game display stats
function updateGameDisplay() {
    const scoreEl = document.getElementById('score');
    const soldiersEl = document.getElementById('soldiers');
    const winsEl = document.getElementById('wins');
    const battleNumberEl = document.getElementById('battleNumber');

    if (scoreEl) scoreEl.textContent = gameState.score.toLocaleString();
    if (soldiersEl) soldiersEl.textContent = gameState.soldiers.toLocaleString();
    if (winsEl) winsEl.textContent = gameState.wins;
    if (battleNumberEl) battleNumberEl.textContent = gameState.currentBattle + 1;

    // Show/hide navbar stats during gameplay
    const isInGame = gameState.currentBattle > 0 || gameState.side;
    if (isInGame) {
        if (elements.campaignLogNavBtn) elements.campaignLogNavBtn.style.display = 'block';
        const gameActionsSection = document.getElementById('gameActionsSection');
        const gameActionsDiv = document.getElementById('gameActionsDiv');
        if (gameActionsSection) gameActionsSection.style.display = 'block';
        if (gameActionsDiv) gameActionsDiv.style.display = 'block';
    } else {
        if (elements.campaignLogNavBtn) elements.campaignLogNavBtn.style.display = 'none';
        const gameActionsSection = document.getElementById('gameActionsSection');
        const gameActionsDiv = document.getElementById('gameActionsDiv');
        if (gameActionsSection) gameActionsSection.style.display = 'none';
        if (gameActionsDiv) gameActionsDiv.style.display = 'none';
    }
}

// Visual mode toggles
function toggleVisualMode(mode) {
    const photoToggle = elements.photoToggle;
    const mapToggle = elements.mapToggle;
    const briefingImage = elements.briefingImage;
    const briefingMap = elements.briefingMap;

    if (mode === 'photo') {
        photoToggle.classList.add('active');
        mapToggle.classList.remove('active');
        briefingImage.style.display = 'flex';
        briefingMap.style.display = 'none';
    } else if (mode === 'map') {
        photoToggle.classList.remove('active');
        mapToggle.classList.add('active');
        briefingImage.style.display = 'none';
        briefingMap.style.display = 'flex';
    }
}

function toggleVisualModeWithAnimation(mode) {
    const photoToggle = elements.photoToggle;
    const mapToggle = elements.mapToggle;
    const briefingImage = elements.briefingImage;
    const briefingMap = elements.briefingMap;

    if (mode === 'photo') {
        photoToggle.classList.add('active');
        mapToggle.classList.remove('active');
        briefingMap.style.display = 'none';
        briefingImage.style.display = 'flex';
        briefingImage.classList.add('animate-scale-in');
    } else if (mode === 'map') {
        photoToggle.classList.remove('active');
        mapToggle.classList.add('active');
        briefingImage.style.display = 'none';
        briefingMap.style.display = 'flex';
        briefingMap.classList.add('animate-scale-in');
    }

    // Clean up animation classes
    setTimeout(() => {
        briefingImage.classList.remove('animate-scale-in');
        briefingMap.classList.remove('animate-scale-in');
    }, 500);
}

// Screen transitions with animation
function showScreenWithAnimation(screenElement, animationType) {
    animationType = animationType || 'fadeIn';
    if (!screenElement) return;

    hideAllScreens();
    screenElement.style.display = 'block';
    screenElement.classList.add('animate-' + animationType);

    const animatableElements = screenElement.querySelectorAll('.side-card, .choice-option, .summary-stat, .timeline-item');
    animatableElements.forEach((el, index) => {
        el.style.animationDelay = (index * 0.1) + 's';
        el.classList.add('animate-slide-in-left');
    });

    setTimeout(() => {
        screenElement.classList.remove('animate-' + animationType);
        animatableElements.forEach(el => {
            el.classList.remove('animate-slide-in-left');
            el.style.animationDelay = '';
        });
    }, 800);
}

// Focus trap for modal accessibility
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });

    if (firstFocusable) firstFocusable.focus();
}

// Campaign log
function showCampaignLog() {
    updateCampaignLog();
    elements.campaignLogModal.style.display = 'block';

    setTimeout(() => {
        trapFocus(elements.campaignLogModal);
    }, 100);
}

function closeCampaignLog() {
    elements.campaignLogModal.style.display = 'none';
}

function closeBattleResultsModal() {
    elements.battleResultsModal.style.display = 'none';
    elements.battleResultsModal.classList.remove('show');
}

function updateCampaignLog() {
    document.getElementById('battlesCompleted').textContent = gameState.battleHistory.length;
    document.getElementById('winsCount').textContent = gameState.wins;
    document.getElementById('currentScore').textContent = gameState.score.toLocaleString();

    const requiredWins = getRequiredWins(gameState.side);
    const progressPercent = Math.min((gameState.wins / requiredWins) * 100, 100);
    document.getElementById('victoryFill').style.width = progressPercent + '%';
    document.getElementById('victoryText').textContent = `${gameState.wins} of ${requiredWins} wins needed`;

    const timelineContainer = document.getElementById('timelineContainer');
    timelineContainer.innerHTML = '';

    if (gameState.battleHistory.length === 0) {
        timelineContainer.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">No battles fought yet.</p>';
    } else {
        gameState.battleHistory.forEach(battle => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item ' + battle.result.toLowerCase();
            timelineItem.innerHTML = `
                <div class="timeline-battle">Battle ${battle.battleNumber}: ${battle.name}</div>
                <div class="timeline-details">
                    Strategy: ${battle.strategy}<br>
                    Result: ${battle.result === 'Victory' ? '\u2705' : '\u274C'} ${battle.result}<br>
                    Casualties: ${battle.casualties.toLocaleString()} soldiers
                </div>
            `;
            timelineContainer.appendChild(timelineItem);
        });
    }

    updateStrategyAnalysis();
}

function updateStrategyAnalysis() {
    const strategyStats = document.getElementById('strategyStats');

    if (gameState.battleHistory.length === 0) {
        strategyStats.innerHTML = '<p style="text-align: center; color: #888;">Strategy analysis will appear after battles.</p>';
        return;
    }

    const strategies = {
        aggressive: { count: 0, wins: 0 },
        defensive: { count: 0, wins: 0 },
        tactical: { count: 0, wins: 0 }
    };

    gameState.battleHistory.forEach(battle => {
        const strategyType = categorizeStrategy(battle.strategy);
        strategies[strategyType].count++;
        if (battle.result === 'Victory') {
            strategies[strategyType].wins++;
        }
    });

    strategyStats.innerHTML = `
        <div class="strategy-type">
            <div class="strategy-name">Aggressive</div>
            <div class="strategy-count" style="color: #dc2626;">${strategies.aggressive.count}</div>
            <div class="strategy-success">${strategies.aggressive.count > 0 ? Math.round((strategies.aggressive.wins / strategies.aggressive.count) * 100) : 0}% success rate</div>
        </div>
        <div class="strategy-type">
            <div class="strategy-name">Defensive</div>
            <div class="strategy-count" style="color: #3b82f6;">${strategies.defensive.count}</div>
            <div class="strategy-success">${strategies.defensive.count > 0 ? Math.round((strategies.defensive.wins / strategies.defensive.count) * 100) : 0}% success rate</div>
        </div>
        <div class="strategy-type">
            <div class="strategy-name">Tactical</div>
            <div class="strategy-count" style="color: #7c3aed;">${strategies.tactical.count}</div>
            <div class="strategy-success">${strategies.tactical.count > 0 ? Math.round((strategies.tactical.wins / strategies.tactical.count) * 100) : 0}% success rate</div>
        </div>
    `;
}

// Settings menu toggle
function toggleSettingsMenu() {
    const menu = elements.settingsMenu;
    const btn = elements.settingsBtn;
    const isOpen = menu.classList.contains('show');

    if (isOpen) {
        menu.classList.remove('show');
        btn.setAttribute('aria-expanded', 'false');
    } else {
        menu.classList.add('show');
        btn.setAttribute('aria-expanded', 'true');
    }
}

// Vocabulary help
function toggleVocabularyHelp() {
    settings.vocabHelp = !settings.vocabHelp;

    const vocabStatus = document.getElementById('vocabStatus');
    if (vocabStatus) {
        vocabStatus.textContent = settings.vocabHelp ? 'ON' : 'OFF';
        vocabStatus.classList.toggle('active', settings.vocabHelp);
    }

    if (elements.vocabToggleNav) {
        elements.vocabToggleNav.setAttribute('aria-pressed', settings.vocabHelp.toString());
        elements.vocabToggleNav.style.background = settings.vocabHelp ? 'var(--color-primary-alpha)' : '';
    }

    const sidebar = document.getElementById('vocabSidebar');
    const overlay = document.getElementById('vocabOverlay');

    if (sidebar) {
        if (settings.vocabHelp) {
            document.body.classList.add('vocab-open');
            sidebar.style.display = 'block';
            sidebar.classList.add('show');

            if (overlay) {
                overlay.classList.add('show');
            }

            if (elements.settingsMenu) {
                elements.settingsMenu.classList.remove('show');
                elements.settingsBtn.setAttribute('aria-expanded', 'false');
            }
        } else {
            document.body.classList.remove('vocab-open');
            sidebar.classList.remove('show');

            if (overlay) {
                overlay.classList.remove('show');
            }

            setTimeout(() => {
                if (!settings.vocabHelp) {
                    sidebar.style.display = 'none';
                }
            }, 300);
        }
    }

    updateVocabularyDisplay();
}

function updateVocabularyDisplay() {
    const vocabTerms = document.querySelectorAll('.vocab-term');
    vocabTerms.forEach(term => {
        if (settings.vocabHelp) {
            term.style.borderBottom = '2px dotted #ffd700';
            term.style.cursor = 'help';
        } else {
            term.style.borderBottom = 'none';
            term.style.cursor = 'inherit';
        }
    });
}

// Introduction screen
function hideIntroduction() {
    localStorage.setItem('civilWarIntroSeen', 'true');
    document.getElementById('civilWarIntro').style.display = 'none';
    document.querySelector('.sides-container').style.display = 'flex';
    updateVocabularyDisplay();
}

// Reset game
function resetGame() {
    resetGameState();
    showSideSelection();
}

// For testing - reset introduction flag
function resetIntroduction() {
    localStorage.removeItem('civilWarIntroSeen');
    location.reload();
}
