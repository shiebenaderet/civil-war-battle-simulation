// UI/DOM manipulation for Civil War Battle Simulation v3
// Handles screen transitions, rendering, and all DOM interactions

// ============================================================
// Screen Management
// ============================================================

const screens = {};

function cacheScreens() {
    screens.modeSelection = document.getElementById('modeSelection');
    screens.sideSelection = document.getElementById('sideSelection');
    screens.historicalScreen = document.getElementById('historicalScreen');
    screens.freeplayBriefing = document.getElementById('freeplayBriefing');
    screens.freeplayResults = document.getElementById('freeplayResults');
    screens.campaignLogModal = document.getElementById('campaignLogModal');
    screens.endGameScreen = document.getElementById('endGameScreen');
}

function showScreen(screenId) {
    Object.values(screens).forEach(function(el) {
        if (el) el.style.display = 'none';
    });
    if (screens[screenId]) {
        screens[screenId].style.display = 'block';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showGameActions(show) {
    var section = document.getElementById('gameActionsSection');
    var divider = document.getElementById('gameActionsDiv');
    if (section) section.style.display = show ? 'block' : 'none';
    if (divider) divider.style.display = show ? 'block' : 'none';
}

function showCampaignLogBtn(show) {
    var btn = document.getElementById('campaignLogNavBtn');
    if (btn) btn.style.display = show ? 'block' : 'none';
}

// ============================================================
// Mode Selection Screen
// ============================================================

function renderModeSelection() {
    var freeplayCard = document.getElementById('freeplayModeCard');
    var freeplayLock = document.getElementById('freeplayLock');
    var unlocked = isHistoricalComplete();

    if (unlocked) {
        freeplayCard.classList.remove('locked');
        freeplayLock.style.display = 'none';
    } else {
        freeplayCard.classList.add('locked');
        freeplayLock.style.display = 'block';
    }

    // Check for saved game
    var saved = loadProgress();
    var resumePrompt = document.getElementById('resumePrompt');
    if (saved && saved.mode && saved.side) {
        resumePrompt.style.display = 'block';
        var modeLabel = saved.mode === 'historical' ? 'Historical Mode' : 'Free-play Mode';
        var sideLabel = saved.side === 'union' ? 'Union' : 'Confederacy';
        var battleNum = (saved.currentBattle || 0) + 1;
        document.querySelector('.resume-text').textContent =
            'You have a saved ' + modeLabel + ' game (' + sideLabel + ', Battle ' + battleNum + ' of 10).';
    } else {
        resumePrompt.style.display = 'none';
    }

    showScreen('modeSelection');
    showGameActions(false);
    showCampaignLogBtn(false);
}

// ============================================================
// Side Selection Screen
// ============================================================

function renderSideSelection() {
    var subtitle = document.getElementById('sideSelectionSubtitle');
    var unionCount = document.getElementById('unionSoldierCount');
    var confCount = document.getElementById('confederacySoldierCount');

    if (gameState.mode === 'historical') {
        subtitle.textContent = 'Experience these battles from the perspective you choose';
        unionCount.textContent = '';
        confCount.textContent = '';
    } else {
        subtitle.textContent = 'Command your chosen side through 10 major battles';
        unionCount.textContent = 'Starting Army: 1,500,000 soldiers';
        confCount.textContent = 'Starting Army: 1,000,000 soldiers';
    }

    showScreen('sideSelection');
}

// ============================================================
// Battle Image Helper
// ============================================================

function renderBattleImage(container, battle) {
    var assets = getAssetManifest();
    var asset = assets.find(function(a) { return a.id === battle.id; });

    if (!asset) {
        asset = assets[gameState.currentBattle] || assets[0];
    }

    if (asset) {
        var fallbackSvg = btoa(
            '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">' +
            '<rect width="400" height="300" fill="#2a2a2a"/>' +
            '<text x="200" y="140" fill="white" text-anchor="middle" font-size="16">' + battle.name + '</text>' +
            '<text x="200" y="170" fill="#aaa" text-anchor="middle" font-size="14">' + battle.date + '</text>' +
            '</svg>'
        );

        container.innerHTML =
            '<img src="' + asset.url + '" alt="' + asset.title + '" loading="lazy" decoding="async" ' +
            'style="width:100%;height:100%;object-fit:cover;" ' +
            'onerror="this.onerror=null;this.src=\'data:image/svg+xml;base64,' + fallbackSvg + '\';">' +
            '<span class="image-credit">' + asset.credit + ' &bull; ' + asset.source + '</span>';
    } else {
        container.innerHTML =
            '<div style="text-align:center;padding:40px;color:var(--color-text-secondary);">' +
            '<div style="font-size:3em;margin-bottom:10px;">&#x2694;&#xFE0F;</div>' +
            '<p>' + battle.name + '</p></div>';
    }
}

// ============================================================
// Historical Mode Screens
// ============================================================

var narrativeStep = 0; // tracks which section is visible (0-3)

function renderHistoricalBattle() {
    var content = getHistoricalContent();
    narrativeStep = 0;

    // Progress
    document.getElementById('historicalProgressLabel').textContent =
        'Battle ' + content.battleNumber + ' of ' + content.totalBattles;
    document.getElementById('historicalProgressFill').style.width =
        (content.battleNumber / content.totalBattles * 100) + '%';

    // Header
    document.getElementById('histBattleName').textContent = content.name;
    document.getElementById('histBattleDate').textContent = content.date;
    document.getElementById('histBattleLocation').textContent = content.location;

    // Image
    renderBattleImage(
        document.getElementById('histBattleImage'),
        battles[gameState.currentBattle]
    );

    // Narrative content
    document.getElementById('histOverview').textContent = content.overview;

    var perspectiveHeading = document.getElementById('perspectiveHeading');
    perspectiveHeading.textContent = gameState.side === 'union'
        ? 'Your Perspective (Union)' : 'Your Perspective (Confederacy)';
    document.getElementById('histPerspective').textContent = content.perspective;

    document.getElementById('histExperience').textContent = content.experience;
    document.getElementById('histAftermath').textContent = content.aftermath;
    document.getElementById('histOutcome').textContent = content.outcome;

    var totalCasualties = content.casualties.union + content.casualties.confederacy;
    document.getElementById('histCasualties').textContent =
        'Casualties: ' + totalCasualties.toLocaleString() +
        ' (Union: ' + content.casualties.union.toLocaleString() +
        ', Confederate: ' + content.casualties.confederacy.toLocaleString() + ')';

    document.getElementById('histKeyFact').textContent = content.keyFact;

    // Reset visibility - only show overview
    document.getElementById('narrativeOverview').style.display = 'block';
    document.getElementById('narrativePerspective').style.display = 'none';
    document.getElementById('narrativeExperience').style.display = 'none';
    document.getElementById('narrativeAftermath').style.display = 'none';

    // Button text
    document.getElementById('narrativeContinueBtn').textContent = 'Continue Reading';

    showScreen('historicalScreen');
    showGameActions(true);
    showCampaignLogBtn(false);
}

function advanceNarrative() {
    narrativeStep++;

    var sections = ['narrativeOverview', 'narrativePerspective', 'narrativeExperience', 'narrativeAftermath'];

    if (narrativeStep < sections.length) {
        // Reveal next section
        var section = document.getElementById(sections[narrativeStep]);
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (narrativeStep === sections.length - 1) {
            // Last section - change button to "Next Battle"
            var isLast = gameState.currentBattle >= battles.length - 1;
            document.getElementById('narrativeContinueBtn').textContent =
                isLast ? 'Complete Historical Mode' : 'Next Battle';
        }
    } else {
        // Done with this battle, advance
        var done = advanceHistorical();
        if (done) {
            renderHistoricalComplete();
        } else {
            renderHistoricalBattle();
        }
    }
}

function renderHistoricalComplete() {
    var endBanner = document.getElementById('endBanner');
    endBanner.className = 'outcome-banner victory-banner';

    document.getElementById('endTitle').textContent = 'Historical Mode Complete!';
    document.getElementById('endSubtitle').textContent =
        'You\'ve experienced all 10 major battles of the Civil War';

    var side = gameState.side;
    var sideLabel = side === 'union' ? 'Union' : 'Confederate';

    document.getElementById('endContent').innerHTML =
        '<div class="end-summary">' +
        '<h3>Your Journey Through History</h3>' +
        '<p>You experienced the Civil War from the <strong>' + sideLabel + '</strong> perspective, ' +
        'following the real events of 10 major battles from 1861 to 1865.</p>' +
        '<div class="historical-timeline-summary">' +
        battles.map(function(b, i) {
            var winnerIcon = b.historical.winner === 'union' ? '&#x1F1FA;&#x1F1F8;'
                : b.historical.winner === 'confederacy' ? '&#x1F3F4;' : '&#x1F91D;';
            return '<div class="timeline-battle-item">' +
                '<span class="timeline-number">' + (i + 1) + '</span>' +
                '<span class="timeline-name">' + b.name + '</span>' +
                '<span class="timeline-year">' + b.year + '</span>' +
                '<span class="timeline-winner">' + winnerIcon + '</span>' +
                '</div>';
        }).join('') +
        '</div>' +
        '<div class="unlock-message">' +
        '<h3>&#x1F513; Free-play Mode Unlocked!</h3>' +
        '<p>Now that you know what really happened, try <strong>Free-play Mode</strong> ' +
        'to make your own strategic decisions and change the course of history!</p>' +
        '</div>' +
        '</div>';

    // Hide scoreboard for historical mode
    document.getElementById('scoreboardSection').style.display = 'none';

    showScreen('endGameScreen');
    showGameActions(false);
    showCampaignLogBtn(false);
}

// ============================================================
// Free-play Mode Screens
// ============================================================

function renderFreeplayBriefing() {
    var battle = battles[gameState.currentBattle];
    var battleNum = gameState.currentBattle + 1;

    // Progress
    document.getElementById('freeplayProgressLabel').textContent =
        'Battle ' + battleNum + ' of ' + battles.length;
    document.getElementById('freeplayProgressFill').style.width =
        (battleNum / battles.length * 100) + '%';

    // Stats
    document.getElementById('statWins').textContent = gameState.wins;
    document.getElementById('statLosses').textContent = gameState.losses;
    document.getElementById('statMomentum').textContent =
        (gameState.momentum >= 0 ? '+' : '') + gameState.momentum;
    document.getElementById('statSoldiers').textContent =
        gameState.soldiers.toLocaleString();

    // Color-code momentum
    var momentumEl = document.getElementById('statMomentum');
    momentumEl.className = 'stat-value' +
        (gameState.momentum > 0 ? ' positive' : gameState.momentum < 0 ? ' negative' : '');

    // Header
    document.getElementById('fpBattleName').textContent = battle.name;
    document.getElementById('fpBattleDate').textContent = battle.date;
    document.getElementById('fpBattleLocation').textContent = battle.location;

    // Image
    renderBattleImage(document.getElementById('fpBattleImage'), battle);

    // Briefing
    document.getElementById('fpBriefing').textContent = battle.freeplay.briefing;

    // Strategies - single click to choose
    var list = document.getElementById('strategyList');
    list.innerHTML = '';

    battle.freeplay.strategies.forEach(function(strategy, index) {
        var card = document.createElement('div');
        card.className = 'strategy-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'Choose strategy: ' + strategy.name);

        card.innerHTML =
            '<div class="strategy-name">' + strategy.name + '</div>' +
            '<div class="strategy-description">' + strategy.description + '</div>' +
            '<div class="strategy-detail">' + strategy.detail + '</div>';

        card.addEventListener('click', function() {
            selectStrategy(index);
        });
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectStrategy(index);
            }
        });

        list.appendChild(card);
    });

    showScreen('freeplayBriefing');
    showGameActions(true);
    showCampaignLogBtn(true);
}

function selectStrategy(index) {
    // Confirm before committing
    var battle = battles[gameState.currentBattle];
    var strategy = battle.freeplay.strategies[index];

    // Highlight selected card
    var cards = document.querySelectorAll('.strategy-card');
    cards.forEach(function(c, i) {
        if (i === index) {
            c.classList.add('selected');
        } else {
            c.classList.add('dimmed');
        }
        // Disable further clicks
        c.style.pointerEvents = 'none';
    });

    // Brief delay for visual feedback, then resolve
    setTimeout(function() {
        var result = resolveBattle(index);
        renderFreeplayResults(result);
    }, 400);
}

function renderFreeplayResults(result) {
    // Banner
    var banner = document.getElementById('resultBanner');
    banner.className = result.won ? 'result-banner victory' : 'result-banner defeat';
    document.getElementById('resultTitle').textContent = result.won ? 'VICTORY!' : 'DEFEAT';

    // Outcome text
    document.getElementById('resultOutcome').textContent = result.outcomeText;

    // Stats
    document.getElementById('resultCasualties').textContent =
        result.casualties.toLocaleString() + ' lost';
    document.getElementById('resultScore').textContent =
        gameState.score.toLocaleString() + ' total';
    document.getElementById('resultMomentum').textContent =
        (result.momentumChange >= 0 ? '+' : '') + result.momentumChange;
    document.getElementById('resultArmy').textContent =
        gameState.soldiers.toLocaleString() + ' remain';

    // Color the momentum change
    var momentumEl = document.getElementById('resultMomentum');
    momentumEl.className = 'result-stat-value' +
        (result.momentumChange > 0 ? ' positive' : ' negative');

    // Momentum meter - map momentum to percentage (center = 0, range -25 to +25)
    var markerPos = Math.min(Math.max((gameState.momentum + 25) / 50 * 100, 2), 98);
    document.getElementById('momentumMarker').style.left = markerPos + '%';

    // Button text
    var isLast = gameState.currentBattle >= battles.length - 1;
    document.getElementById('nextBattleBtn').textContent =
        isLast ? 'View Final Results' : 'Continue to Next Battle';

    showScreen('freeplayResults');
}

function proceedFromResults() {
    var advancement = advanceFreeplay();

    if (advancement.ended) {
        renderFreeplayEnd(advancement);
    } else {
        renderFreeplayBriefing();
    }
}

function renderFreeplayEnd(advancement) {
    var result = getFreeplayResult();

    // Override with early-end message if applicable
    if (advancement && advancement.reason === 'momentum_victory') {
        result.victory = true;
        result.title = 'DECISIVE VICTORY!';
        result.subtitle = advancement.message;
    } else if (advancement && advancement.reason === 'momentum_defeat') {
        result.victory = false;
        result.title = 'DECISIVE DEFEAT';
        result.subtitle = advancement.message;
    }

    var banner = document.getElementById('endBanner');
    banner.className = result.victory ? 'outcome-banner victory-banner' : 'outcome-banner defeat-banner';
    document.getElementById('endTitle').textContent = result.title;
    document.getElementById('endSubtitle').textContent = result.subtitle;

    var startingSoldiers = gameState.side === 'union' ? 1500000 : 1000000;
    var casualtyRate = Math.round(((startingSoldiers - gameState.soldiers) / startingSoldiers) * 100);
    var sideLabel = gameState.side === 'union' ? 'Union' : 'Confederacy';

    document.getElementById('endContent').innerHTML =
        '<div class="end-summary">' +
        '<h3>Campaign Results</h3>' +
        '<p>' + result.summary + '</p>' +
        '<div class="final-stats">' +
        '<div class="final-stat"><span class="final-stat-label">Side</span><span class="final-stat-value">' + sideLabel + '</span></div>' +
        '<div class="final-stat"><span class="final-stat-label">Final Score</span><span class="final-stat-value">' + gameState.score.toLocaleString() + '</span></div>' +
        '<div class="final-stat"><span class="final-stat-label">Record</span><span class="final-stat-value">' + gameState.wins + 'W - ' + gameState.losses + 'L</span></div>' +
        '<div class="final-stat"><span class="final-stat-label">Final Momentum</span><span class="final-stat-value">' + (gameState.momentum >= 0 ? '+' : '') + gameState.momentum + '</span></div>' +
        '<div class="final-stat"><span class="final-stat-label">Soldiers Lost</span><span class="final-stat-value">' + (startingSoldiers - gameState.soldiers).toLocaleString() + ' (' + casualtyRate + '%)</span></div>' +
        '<div class="final-stat"><span class="final-stat-label">Battles Fought</span><span class="final-stat-value">' + gameState.battleHistory.length + '</span></div>' +
        '</div>' +
        '<h3>Battle History</h3>' +
        '<div class="battle-history-list">' +
        gameState.battleHistory.map(function(b) {
            return '<div class="history-item ' + (b.won ? 'won' : 'lost') + '">' +
                '<span class="history-icon">' + (b.won ? '&#x2705;' : '&#x274C;') + '</span>' +
                '<span class="history-name">' + b.name + '</span>' +
                '<span class="history-strategy">' + b.strategy + '</span>' +
                '<span class="history-momentum">Momentum: ' + (b.momentumAfter >= 0 ? '+' : '') + b.momentumAfter + '</span>' +
                '</div>';
        }).join('') +
        '</div>' +
        '</div>';

    // Show scoreboard
    var scoreboardSection = document.getElementById('scoreboardSection');
    scoreboardSection.style.display = 'block';
    renderScoreboardSection();

    showScreen('endGameScreen');
    showGameActions(false);
    showCampaignLogBtn(false);
}

// ============================================================
// Scoreboard UI
// ============================================================

function renderScoreboardSection() {
    var container = document.getElementById('scoreboardSection');
    if (!container) return;

    var scoreboard = getScoreboard();

    container.innerHTML =
        '<div class="scoreboard-entry-form" id="scoreEntryForm">' +
        '<h3 class="scoreboard-form-title">&#x1F3C6; Add Your Score to the Leaderboard</h3>' +
        '<div class="scoreboard-input-row">' +
        '<input type="text" id="playerNameInput" class="player-name-input" ' +
        'placeholder="Enter your name (e.g. first name + last initial)" ' +
        'maxlength="20" aria-label="Your name for the scoreboard">' +
        '<button class="save-score-btn" id="saveScoreBtn">Save Score</button>' +
        '</div></div>' +
        '<div class="scoreboard-table-wrapper">' +
        '<h3 class="scoreboard-title">&#x1F4CA; Class Leaderboard</h3>' +
        renderScoreboardTable(scoreboard) +
        (scoreboard.length > 0 ? '<button class="clear-scores-btn" id="clearScoresBtn">Clear All Scores</button>' : '') +
        '</div>';

    wireUpScoreboardEvents();
}

function wireUpScoreboardEvents() {
    var saveBtn = document.getElementById('saveScoreBtn');
    var nameInput = document.getElementById('playerNameInput');
    if (saveBtn && nameInput) {
        saveBtn.addEventListener('click', function() {
            var name = nameInput.value.trim();
            if (!name) {
                nameInput.focus();
                nameInput.style.borderColor = '#dc2626';
                return;
            }
            var updated = saveToScoreboard(name);
            document.getElementById('scoreEntryForm').innerHTML =
                '<p class="score-saved-msg">&#x2705; Score saved!</p>';
            document.querySelector('.scoreboard-table-wrapper').innerHTML =
                '<h3 class="scoreboard-title">&#x1F4CA; Class Leaderboard</h3>' +
                renderScoreboardTable(updated) +
                '<button class="clear-scores-btn" id="clearScoresBtn">Clear All Scores</button>';
            wireUpClearButton();
        });

        nameInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') saveBtn.click();
            nameInput.style.borderColor = '';
        });
    }

    wireUpClearButton();
}

function wireUpClearButton() {
    var clearBtn = document.getElementById('clearScoresBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Clear all scores from the leaderboard?')) {
                clearScoreboard();
                document.querySelector('.scoreboard-table-wrapper').innerHTML =
                    '<h3 class="scoreboard-title">&#x1F4CA; Class Leaderboard</h3>' +
                    renderScoreboardTable([]);
            }
        });
    }
}

function renderScoreboardTable(scoreboard) {
    if (scoreboard.length === 0) {
        return '<p class="scoreboard-empty">No scores yet. Be the first to play!</p>';
    }

    var rows = scoreboard.map(function(entry, i) {
        var medal = i === 0 ? '&#x1F947;' : i === 1 ? '&#x1F948;' : i === 2 ? '&#x1F949;' : (i + 1);
        var sideIcon = entry.side === 'union' ? '&#x1F1FA;&#x1F1F8;' : '&#x1F3F4;';
        var victoryIcon = entry.victory ? '&#x2705;' : '&#x274C;';
        return '<tr class="scoreboard-row' + (i < 3 ? ' top-three' : '') + '">' +
            '<td class="rank-cell">' + medal + '</td>' +
            '<td class="name-cell">' + escapeHtml(entry.name) + '</td>' +
            '<td class="score-cell">' + entry.score.toLocaleString() + '</td>' +
            '<td class="side-cell">' + sideIcon + '</td>' +
            '<td class="record-cell">' + entry.wins + 'W-' + entry.losses + 'L</td>' +
            '<td class="victory-cell">' + victoryIcon + '</td>' +
            '</tr>';
    }).join('');

    return '<table class="scoreboard-table"><thead><tr>' +
        '<th>#</th><th>Name</th><th>Score</th><th>Side</th><th>Record</th><th>Won?</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table>';
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================================
// Campaign Log Modal
// ============================================================

function showCampaignLog() {
    document.getElementById('logBattlesFought').textContent = gameState.battleHistory.length;
    document.getElementById('logWins').textContent = gameState.wins;
    document.getElementById('logScore').textContent = gameState.score.toLocaleString();
    document.getElementById('logMomentum').textContent =
        (gameState.momentum >= 0 ? '+' : '') + gameState.momentum;

    var timeline = document.getElementById('logTimeline');
    if (gameState.battleHistory.length === 0) {
        timeline.innerHTML = '<p style="text-align:center;color:#888;padding:20px;">No battles fought yet.</p>';
    } else {
        timeline.innerHTML = gameState.battleHistory.map(function(b) {
            return '<div class="timeline-item ' + (b.won ? 'victory' : 'defeat') + '">' +
                '<div class="timeline-battle">Battle ' + (b.battleIndex + 1) + ': ' + b.name + '</div>' +
                '<div class="timeline-details">' +
                'Strategy: ' + b.strategy + '<br>' +
                'Result: ' + (b.won ? '&#x2705; Victory' : '&#x274C; Defeat') + '<br>' +
                'Casualties: ' + b.casualties.toLocaleString() + '<br>' +
                'Momentum: ' + (b.momentumAfter >= 0 ? '+' : '') + b.momentumAfter +
                '</div></div>';
        }).join('');
    }

    screens.campaignLogModal.style.display = 'block';
}

function closeCampaignLog() {
    screens.campaignLogModal.style.display = 'none';
}

// ============================================================
// Settings Menu
// ============================================================

function toggleSettingsMenu() {
    var menu = document.getElementById('settingsMenu');
    var btn = document.getElementById('settingsBtn');
    var isOpen = menu.classList.contains('show');

    if (isOpen) {
        menu.classList.remove('show');
        btn.setAttribute('aria-expanded', 'false');
    } else {
        menu.classList.add('show');
        btn.setAttribute('aria-expanded', 'true');
    }
}

// ============================================================
// Credits Toggle
// ============================================================

function setupCreditsToggle() {
    var toggle = document.getElementById('creditsToggle');
    var content = document.getElementById('creditsContent');
    if (!toggle || !content) return;

    toggle.addEventListener('click', function() {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !expanded);
        content.setAttribute('aria-hidden', expanded);
        if (!expanded) {
            content.classList.add('expanded');
            toggle.querySelector('.credits-text').textContent = 'Hide Image Credits';
        } else {
            content.classList.remove('expanded');
            toggle.querySelector('.credits-text').textContent = 'View Image Credits';
        }
    });
}
