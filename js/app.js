// App initialization and event wiring for Civil War Battle Simulation v3.1

function boot() {
    cacheScreens();
    setupEventListeners();
    renderModeSelection();
}

function setupEventListeners() {
    // Mode selection
    document.getElementById('historicalModeCard').addEventListener('click', function() {
        gameState.mode = 'historical';
        renderSideSelection();
    });

    document.getElementById('freeplayModeCard').addEventListener('click', function() {
        if (!isHistoricalComplete()) return; // still locked
        gameState.mode = 'freeplay';
        renderSideSelection();
    });

    // Keyboard support for mode cards
    document.getElementById('historicalModeCard').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            gameState.mode = 'historical';
            renderSideSelection();
        }
    });

    document.getElementById('freeplayModeCard').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!isHistoricalComplete()) return;
            gameState.mode = 'freeplay';
            renderSideSelection();
        }
    });

    // Resume / New game
    document.getElementById('resumeBtn').addEventListener('click', function() {
        var saved = loadProgress();
        if (saved) {
            restoreGameState(saved);
            if (saved.mode === 'historical') {
                renderHistoricalBattle();
            } else {
                renderFreeplayBriefing();
            }
        }
    });

    document.getElementById('newGameBtn').addEventListener('click', function() {
        clearSave();
        document.getElementById('resumePrompt').style.display = 'none';
    });

    // Side selection
    document.getElementById('unionCard').addEventListener('click', function() {
        startWithSide('union');
    });
    document.getElementById('confederacyCard').addEventListener('click', function() {
        startWithSide('confederacy');
    });

    // Keyboard support for side cards
    document.getElementById('unionCard').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            startWithSide('union');
        }
    });
    document.getElementById('confederacyCard').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            startWithSide('confederacy');
        }
    });

    // Back to mode selection
    document.getElementById('backToModeBtn').addEventListener('click', function() {
        renderModeSelection();
    });

    // Historical mode - narrative continue
    document.getElementById('narrativeContinueBtn').addEventListener('click', function() {
        advanceNarrative();
    });

    // Free-play - next battle
    document.getElementById('nextBattleBtn').addEventListener('click', function() {
        proceedFromResults();
    });

    // Campaign log
    document.getElementById('campaignLogNavBtn').addEventListener('click', showCampaignLog);
    document.getElementById('closeLogBtn').addEventListener('click', closeCampaignLog);

    // End game buttons
    document.getElementById('playAgainBtn').addEventListener('click', function() {
        resetGameState();
        renderModeSelection();
    });
    document.getElementById('backToMenuBtn').addEventListener('click', function() {
        resetGameState();
        renderModeSelection();
    });

    // Start over (nav menu)
    document.getElementById('startOverNavBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to start over? Your progress will be lost.')) {
            resetGameState();
            renderModeSelection();
        }
    });

    // Settings menu
    document.getElementById('settingsBtn').addEventListener('click', toggleSettingsMenu);

    // Close settings when clicking outside
    document.addEventListener('click', function(e) {
        var settingsBtn = document.getElementById('settingsBtn');
        var settingsMenu = document.getElementById('settingsMenu');
        if (!settingsBtn.contains(e.target) && !settingsMenu.contains(e.target)) {
            settingsMenu.classList.remove('show');
            settingsBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Close campaign log modal when clicking outside
    document.getElementById('campaignLogModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeCampaignLog();
        }
    });

    // Keyboard: Escape closes modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (screens.campaignLogModal.style.display === 'block') {
                closeCampaignLog();
            } else {
                var settingsMenu = document.getElementById('settingsMenu');
                if (settingsMenu.classList.contains('show')) {
                    settingsMenu.classList.remove('show');
                    document.getElementById('settingsBtn').setAttribute('aria-expanded', 'false');
                }
            }
        }
    });

    // Credits toggle
    setupCreditsToggle();
}

function startWithSide(side) {
    // Capture student name for historical mode PDF export
    var nameInput = document.getElementById('studentNameInput');
    if (nameInput && gameState.mode === 'historical') {
        gameState.studentName = nameInput.value.trim() || 'Student';
    }

    initializeGame(gameState.mode, side);

    if (gameState.mode === 'historical') {
        renderHistoricalBattle();
    } else {
        renderFreeplayBriefing();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
