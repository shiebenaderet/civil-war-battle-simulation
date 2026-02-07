// App initialization and event wiring for Civil War Battle Simulation v3.1

function boot() {
    cacheScreens();
    setupEventListeners();

    // Show intro splash on first visit, mode selection on return
    var hasSeenIntro = localStorage.getItem('civilWarIntroSeen');
    if (hasSeenIntro) {
        renderModeSelection();
    } else {
        showScreen('introSplash');
    }
}

function setupEventListeners() {
    // Intro splash - proceed to mode selection
    document.getElementById('splashStartBtn').addEventListener('click', function() {
        localStorage.setItem('civilWarIntroSeen', '1');
        renderModeSelection();
    });

    // Mode selection
    document.getElementById('historicalModeCard').addEventListener('click', function() {
        gameState.mode = 'historical';
        renderStudentNameScreen();
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
            renderStudentNameScreen();
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

    // Student name screen - continue button
    document.getElementById('nameContinueBtn').addEventListener('click', function() {
        proceedFromNameScreen();
    });

    // Student name screen - Enter key advances
    document.getElementById('firstNameInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('lastInitialInput').focus();
        }
    });

    document.getElementById('lastInitialInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            proceedFromNameScreen();
        }
    });

    // Back from student name screen
    document.getElementById('backToModeFromName').addEventListener('click', function() {
        renderModeSelection();
    });

    // Difficulty toggle
    var difficultyPills = document.querySelectorAll('.difficulty-pill');
    var difficultyHints = {
        beginner: 'Shorter text, extra help with writing',
        intermediate: 'Standard text, some writing help',
        advanced: 'More detail, deeper questions, full challenge'
    };
    difficultyPills.forEach(function(pill) {
        pill.addEventListener('click', function() {
            difficultyPills.forEach(function(p) {
                p.classList.remove('active');
                p.setAttribute('aria-checked', 'false');
            });
            pill.classList.add('active');
            pill.setAttribute('aria-checked', 'true');
            gameState.difficulty = pill.getAttribute('data-level');
            document.getElementById('difficultyHint').textContent =
                difficultyHints[gameState.difficulty] || '';
        });
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

    // Back to mode selection (from side selection)
    document.getElementById('backToModeBtn').addEventListener('click', function() {
        if (gameState.mode === 'historical') {
            renderStudentNameScreen();
        } else {
            renderModeSelection();
        }
    });

    // Leader letter - begin journey
    document.getElementById('beginJourneyBtn').addEventListener('click', function() {
        renderHistoricalBattle();
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

    // Keyboard: Escape closes modals and tutorial
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            var tutorialOverlay = document.getElementById('tutorialOverlay');
            if (tutorialOverlay && tutorialOverlay.style.display === 'block') {
                endTutorial();
            } else if (screens.campaignLogModal.style.display === 'block') {
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

    // Tutorial / Help
    document.getElementById('helpToggleBtn').addEventListener('click', toggleHelpBar);
    document.getElementById('helpBarClose').addEventListener('click', hideHelpBar);
    document.getElementById('tutorialNext').addEventListener('click', nextTutorialStep);
    document.getElementById('tutorialSkip').addEventListener('click', endTutorial);

    // Credits toggle
    setupCreditsToggle();
}

function proceedFromNameScreen() {
    gameState.studentName = getStudentNameFromForm();
    renderSideSelection();
}

function startWithSide(side) {
    initializeGame(gameState.mode, side);

    if (gameState.mode === 'historical') {
        // Show the leader's letter before diving into battles
        renderLeaderLetter();
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
