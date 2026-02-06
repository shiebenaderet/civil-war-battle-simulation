// App initialization and event wiring for Civil War Battle Simulation

function initializeGame() {
    cacheElements();

    // Check if this is first time playing - show introduction
    const hasSeenIntro = localStorage.getItem('civilWarIntroSeen');

    hideAllScreens();
    elements.sideSelection.style.display = 'block';

    if (!hasSeenIntro) {
        document.getElementById('civilWarIntro').style.display = 'block';
        document.querySelector('.sides-container').style.display = 'none';
        setTimeout(() => {
            updateVocabularyDisplay();
            const introVocabTerms = document.querySelectorAll('#civilWarIntro .vocab-term');
            introVocabTerms.forEach(term => {
                term.style.position = 'relative';
            });
        }, 150);
    }

    setupEventListeners();
    updateVocabularyDisplay();
}

function setupEventListeners() {
    // Side selection
    elements.unionCard.addEventListener('click', () => selectSide('union'));
    elements.confederacyCard.addEventListener('click', () => selectSide('confederacy'));

    // Navigation
    elements.proceedToGame.addEventListener('click', startFirstBattle);
    elements.backToSideBtn.addEventListener('click', showSideSelection);
    elements.continueBattleBtn.addEventListener('click', continueToNextBattle);
    elements.playAgainBtn.addEventListener('click', resetGame);
    if (elements.startOverBtn) {
        elements.startOverBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to start over?')) resetGame();
        });
    }

    // Campaign log
    if (elements.campaignLogBtn) {
        elements.campaignLogBtn.addEventListener('click', showCampaignLog);
    }
    if (elements.closeLogBtn) {
        elements.closeLogBtn.addEventListener('click', closeCampaignLog);
    }

    // Visual toggle controls
    elements.photoToggle.addEventListener('click', () => toggleVisualModeWithAnimation('photo'));
    elements.mapToggle.addEventListener('click', () => toggleVisualModeWithAnimation('map'));

    // Navigation bar controls
    elements.campaignLogNavBtn.addEventListener('click', showCampaignLog);
    elements.startOverNavBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to start over?')) resetGame();
    });
    elements.vocabToggleNav.addEventListener('click', toggleVocabularyHelp);

    // Settings dropdown
    elements.settingsBtn.addEventListener('click', toggleSettingsMenu);

    // Image credits toggle
    const creditsToggle = document.getElementById('creditsToggle');
    const creditsContent = document.getElementById('creditsContent');

    if (creditsToggle && creditsContent) {
        creditsToggle.addEventListener('click', () => {
            const isExpanded = creditsToggle.getAttribute('aria-expanded') === 'true';
            const newState = !isExpanded;

            creditsToggle.setAttribute('aria-expanded', newState);
            creditsContent.setAttribute('aria-hidden', !newState);

            if (newState) {
                creditsContent.classList.add('expanded');
                creditsToggle.querySelector('.credits-text').textContent = 'Hide Image Credits';
            } else {
                creditsContent.classList.remove('expanded');
                creditsToggle.querySelector('.credits-text').textContent = 'View Image Credits';
            }
        });
    }

    // Close settings when clicking outside
    document.addEventListener('click', (e) => {
        if (!elements.settingsBtn.contains(e.target) && !elements.settingsMenu.contains(e.target)) {
            elements.settingsMenu.classList.remove('show');
            elements.settingsBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Close vocabulary sidebar when clicking overlay
    const vocabOverlay = document.getElementById('vocabOverlay');
    if (vocabOverlay) {
        vocabOverlay.addEventListener('click', () => {
            if (settings.vocabHelp) {
                toggleVocabularyHelp();
            }
        });
    }

    // Side selection accessibility - keyboard support
    addSideSelectionListeners();

    // Close modal when clicking outside
    elements.campaignLogModal.addEventListener('click', (e) => {
        if (e.target === elements.campaignLogModal) {
            closeCampaignLog();
        }
    });

    // Keyboard handling for modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (elements.campaignLogModal.style.display === 'block') {
                closeCampaignLog();
            } else if (elements.battleResultsModal.style.display === 'block') {
                closeBattleResultsModal();
            } else if (settings.vocabHelp) {
                toggleVocabularyHelp();
            } else if (elements.settingsMenu.classList.contains('show')) {
                elements.settingsMenu.classList.remove('show');
                elements.settingsBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

function addSideSelectionListeners() {
    const unionCard = document.getElementById('unionCard');
    const confederacyCard = document.getElementById('confederacyCard');

    // Keyboard support for side cards
    unionCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectSide('union');
        }
    });

    confederacyCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectSide('confederacy');
        }
    });

    // Strategy button support
    const unionBtn = unionCard.querySelector('.select-strategy-btn');
    const confederacyBtn = confederacyCard.querySelector('.select-strategy-btn');

    unionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectSide('union');
    });

    confederacyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectSide('confederacy');
    });
}

// Optimized update functions
const debouncedUpdateDisplay = debounce(updateGameDisplay, 100);
const debouncedVocabUpdate = debounce(updateVocabularyDisplay, 150);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}
