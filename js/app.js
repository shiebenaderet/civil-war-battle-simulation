// App initialization and event wiring for Civil War Battle Simulation v3.7

// v3.21: Send Feedback. Prompts for a comment and opens the user's email client
// with the teacher's address, the current screen, and the reading level prefilled,
// so feedback arrives with context. No backend required.
var FEEDBACK_EMAIL = 'benaderets885@edmonds.wednet.edu';
var FEEDBACK_SCREEN_NAMES = {
    modeSelection: 'Mode selection',
    sideSelection: 'Setup / side selection',
    leaderLetterScreen: 'Leader letter',
    actIntroScreen: 'Act introduction',
    historicalScreen: 'Historical battle',
    actRecallScreen: 'Act recall quiz',
    freeplayBriefing: 'Free-play battle briefing',
    freeplayResults: 'Free-play battle result',
    endGameScreen: 'End of game'
};

function sendFeedback() {
    var comment = window.prompt('Your feedback or suggestion (it will be emailed to Mr. B):', '');
    if (comment === null) return; // cancelled
    comment = String(comment).trim();
    if (!comment) return;

    var screenId = (typeof gameState !== 'undefined' && gameState && gameState.currentScreen) || '';
    var screenName = FEEDBACK_SCREEN_NAMES[screenId] || screenId || 'Unknown';
    var level = (typeof gameState !== 'undefined' && gameState && gameState.difficulty) || 'unknown';
    var mode = (typeof gameState !== 'undefined' && gameState && gameState.mode) || 'unknown';

    var body = comment + '\n\n' +
        '----------\n' +
        'Screen: ' + screenName + '\n' +
        'Mode: ' + mode + '\n' +
        'Reading level: ' + level + '\n' +
        'Sent from the Civil War Simulation.';

    var url = 'mailto:' + FEEDBACK_EMAIL +
        '?subject=' + encodeURIComponent('Civil War Simulation Feedback') +
        '&body=' + encodeURIComponent(body);
    window.location.href = url;
}

function boot() {
    cacheScreens();
    wireActReviewOverlay();
    setupEventListeners();

    // Initialize Firebase leaderboard (no-op if SDK didn't load)
    firebaseLeaderboard.init();

    renderModeSelection();

    if (typeof wireNoTeacherBanner === 'function') wireNoTeacherBanner();

    // Clear the class-code "not recognized" warning as soon as the student edits.
    var classCodeInput = document.getElementById('classCodeInput');
    if (classCodeInput && typeof showClassCodeError === 'function') {
        classCodeInput.addEventListener('input', function() { showClassCodeError(false); });
    }
}

function setupEventListeners() {
    // === v3.15: beforeunload warning when mid-battle ===
    window.addEventListener('beforeunload', function(e) {
        if (typeof gameState !== 'undefined' && gameState && gameState.isInBattle === true) {
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    });

    // Mode selection - both go directly to side selection (name is inline now)
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
                reportProgressToDashboard(false);
                enterBattleScreen();
            } else {
                renderFreeplayBriefing();
            }
        }
    });

    document.getElementById('newGameBtn').addEventListener('click', function() {
        clearSave();
        document.getElementById('resumePrompt').style.display = 'none';
    });

    // Name fields - Enter key moves between fields
    document.getElementById('firstNameInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('lastInitialInput').focus();
        }
    });

    document.getElementById('lastInitialInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Focus blurs to let user pick a side
            this.blur();
        }
    });

    // Difficulty toggle
    var difficultyPills = document.querySelectorAll('.difficulty-pill');
    var difficultyHints = {
        extra: 'Most Support. Easiest reading, lots of writing help.',
        beginner: 'More Support. Shorter text, extra writing help.',
        intermediate: 'Standard. Standard text, some writing help.',
        advanced: 'Extra Challenge. More detail, deeper questions.'
    };
    difficultyPills.forEach(function(pill) {
        pill.addEventListener('click', function() {
            var level = pill.getAttribute('data-level');
            // Route through setReadingLevelEverywhere so navbar pills + Settings
            // stay in sync. Without this, choosing a level on the start screen
            // and then entering a battle leaves the navbar pill showing whatever
            // was last persisted (or default Intermediate).
            if (typeof setReadingLevelEverywhere === 'function') {
                setReadingLevelEverywhere(level);
            } else {
                // Fallback if helper isn't loaded yet
                difficultyPills.forEach(function(p) {
                    p.classList.remove('active');
                    p.setAttribute('aria-checked', 'false');
                });
                pill.classList.add('active');
                pill.setAttribute('aria-checked', 'true');
                gameState.difficulty = level;
            }
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
        renderModeSelection();
    });

    // v3.18: Historical setup -> begin (Union-only; replaces the now-hidden side cards)
    document.getElementById('beginSetupBtn').addEventListener('click', function() {
        startWithSide('union');
    });

    // Leader letter - begin journey
    document.getElementById('beginJourneyBtn').addEventListener('click', function() {
        enterBattleScreen();
    });

    // Historical mode - narrative continue
    document.getElementById('narrativeContinueBtn').addEventListener('click', function() {
        advanceNarrative();
    });

    // Free-play - next battle
    document.getElementById('nextBattleBtn').addEventListener('click', function() {
        proceedFromResults();
    });

    // Campaign log + war map shortcut
    document.getElementById('campaignLogMenuBtn').addEventListener('click', showCampaignLog);
    document.getElementById('warMapMenuBtn').addEventListener('click', showWarMapDirect);

    // Leaderboard (nav menu) — discoverable anytime, not just after a game.
    var leaderboardMenuBtn = document.getElementById('leaderboardMenuBtn');
    if (leaderboardMenuBtn) {
        leaderboardMenuBtn.addEventListener('click', function() {
            var sm = document.getElementById('settingsMenu');
            if (sm) sm.classList.remove('show');
            document.getElementById('settingsBtn').setAttribute('aria-expanded', 'false');
            openLeaderboardModal();
        });
    }
    var closeLeaderboardBtn = document.getElementById('closeLeaderboardBtn');
    if (closeLeaderboardBtn) {
        closeLeaderboardBtn.addEventListener('click', closeLeaderboardModal);
    }
    var leaderboardModal = document.getElementById('leaderboardModal');
    if (leaderboardModal) {
        leaderboardModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLeaderboardModal();
            }
        });
    }
    // v3.18: centered navbar act label opens the campaign log
    var navActLabel = document.getElementById('navbarActLabel');
    if (navActLabel) navActLabel.addEventListener('click', showCampaignLog);
    document.getElementById('closeLogBtn').addEventListener('click', closeCampaignLog);

    // Campaign log tabs (Progress / War Map)
    document.getElementById('logTabProgress').addEventListener('click', function() {
        switchLogTab('progress');
    });
    document.getElementById('logTabWarMap').addEventListener('click', function() {
        switchLogTab('warmap');
    });

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
    document.getElementById('startOverMenuBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to start over? Your progress will be lost.')) {
            resetGameState();
            renderModeSelection();
        }
    });

    // Settings menu
    document.getElementById('settingsBtn').addEventListener('click', toggleSettingsMenu);

    // Handout links: close the menu after clicking (the link still opens in a
    // new tab via target="_blank"; closing the menu prevents it from staying
    // open behind the new tab).
    ['handoutStandardMenuBtn', 'handoutSomeSupportMenuBtn', 'handoutExtraSupportMenuBtn', 'handoutAdvancedMenuBtn', 'emailTeacherMenuBtn'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', function() {
                var sm = document.getElementById('settingsMenu');
                if (sm) sm.classList.remove('show');
                document.getElementById('settingsBtn').setAttribute('aria-expanded', 'false');
            });
        }
    });

    // v3.21: Send Feedback — prompt for a comment, then email it to the teacher
    // with the current screen and reading level so the report has context.
    var feedbackBtn = document.getElementById('sendFeedbackMenuBtn');
    if (feedbackBtn) {
        feedbackBtn.addEventListener('click', function() {
            var sm = document.getElementById('settingsMenu');
            if (sm) sm.classList.remove('show');
            var sb = document.getElementById('settingsBtn');
            if (sb) sb.setAttribute('aria-expanded', 'false');
            sendFeedback();
        });
    }

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

    // Battle revisit (read-only review) modal: close button + backdrop click
    var closeRevisitBtn = document.getElementById('closeRevisitBtn');
    if (closeRevisitBtn) {
        closeRevisitBtn.addEventListener('click', closeBattleRevisit);
    }
    var battleRevisitModal = document.getElementById('battleRevisitModal');
    if (battleRevisitModal) {
        battleRevisitModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeBattleRevisit();
            }
        });
    }

    // Keyboard: Escape closes modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Revisit modal takes priority (it can open on top of the campaign log).
            var revisitModal = document.getElementById('battleRevisitModal');
            var leaderboardModalEl = document.getElementById('leaderboardModal');
            if (revisitModal && revisitModal.style.display === 'block') {
                closeBattleRevisit();
            } else if (leaderboardModalEl && leaderboardModalEl.style.display === 'block') {
                closeLeaderboardModal();
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
    document.getElementById('helpToggleMenuBtn').addEventListener('click', toggleHelpBar);
    document.getElementById('helpBarClose').addEventListener('click', hideHelpBar);

    // Teacher tip toggle
    document.getElementById('teacherTipToggle').addEventListener('click', toggleTeacherTip);

    // Class leaderboard - room code join
    document.getElementById('roomCodeJoinBtn').addEventListener('click', function() {
        joinRoom();
    });
    document.getElementById('roomCodeInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') joinRoom();
        this.style.borderColor = '';
        document.getElementById('roomCodeError').style.display = 'none';
    });
    // Auto-lowercase room code input (Firebase keys are lowercase)
    document.getElementById('roomCodeInput').addEventListener('input', function() {
        this.value = this.value.toLowerCase();
    });
    document.getElementById('leaveRoomBtn').addEventListener('click', function() {
        leaveRoom();
    });

    // Credits toggle
    setupCreditsToggle();

    // v3.19: vocabulary click-to-define tooltips (delegated; bound once)
    if (typeof setupVocabTooltips === 'function') setupVocabTooltips();

    // === v3.15: Accessibility panel (Aa button) ===
    (function wireAccessibilityPanel() {
        const btn = document.getElementById('accessibilityBtn');
        const panel = document.getElementById('accessibilityPanel');
        if (!btn || !panel) return;

        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = !panel.hasAttribute('hidden');
            if (isOpen) {
                panel.setAttribute('hidden', '');
                btn.setAttribute('aria-expanded', 'false');
            } else {
                panel.removeAttribute('hidden');
                btn.setAttribute('aria-expanded', 'true');
            }
        });

        document.addEventListener('click', function(e) {
            if (panel.hasAttribute('hidden')) return;
            if (panel.contains(e.target) || btn.contains(e.target)) return;
            panel.setAttribute('hidden', '');
            btn.setAttribute('aria-expanded', 'false');
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !panel.hasAttribute('hidden')) {
                panel.setAttribute('hidden', '');
                btn.setAttribute('aria-expanded', 'false');
                btn.focus();
            }
        });
    })();

    // === v3.15: Accessibility controls (toggle, size, rate) ===
    (function wireAccessibilityControls() {
        if (typeof Settings === 'undefined') return;
        const settings = Settings.getAll();

        const dToggle = document.getElementById('accDyslexicToggle');
        if (dToggle) {
            dToggle.checked = settings.fontFamily === 'dyslexic';
            dToggle.addEventListener('change', function() {
                Settings.set('fontFamily', dToggle.checked ? 'dyslexic' : 'serif');
            });
        }

        document.querySelectorAll('.size-pill[data-size]').forEach(function(pill) {
            const size = pill.getAttribute('data-size');
            if (size === settings.fontSize) pill.setAttribute('aria-pressed', 'true');
            pill.addEventListener('click', function() {
                document.querySelectorAll('.size-pill[data-size]').forEach(function(p) {
                    p.setAttribute('aria-pressed', p === pill ? 'true' : 'false');
                });
                Settings.set('fontSize', size);
            });
        });

        document.querySelectorAll('.size-pill[data-rate]').forEach(function(pill) {
            const rate = parseFloat(pill.getAttribute('data-rate'));
            if (rate === settings.ttsRate) pill.setAttribute('aria-pressed', 'true');
            pill.addEventListener('click', function() {
                document.querySelectorAll('.size-pill[data-rate]').forEach(function(p) {
                    p.setAttribute('aria-pressed', p === pill ? 'true' : 'false');
                });
                Settings.set('ttsRate', rate);
            });
        });

        // Voice select wiring deferred to T11 (TTS module).
    })();

    // v3.17.1: Print Summary menu item removed; Battle Journal handout is the
    // capture surface. PrintSummary module left in codebase for now; not wired.

    // === v3.15: Reset Battle ===
    (function wireResetBattle() {
        const menuBtn = document.getElementById('resetBattleMenuBtn');
        const modal = document.getElementById('resetBattleConfirm');
        const cancelBtn = document.getElementById('resetBattleCancel');
        const confirmBtn = document.getElementById('resetBattleConfirmBtn');
        const nameEl = document.getElementById('resetBattleName');
        if (!menuBtn || !modal) return;

        menuBtn.addEventListener('click', function() {
            const idx = (typeof gameState !== 'undefined') ? gameState.currentBattle : -1;
            if (idx === undefined || idx < 0 || typeof battles === 'undefined' || !battles[idx]) return;
            if (nameEl) nameEl.textContent = battles[idx].name;
            modal.removeAttribute('hidden');
            const sm = document.getElementById('settingsMenu');
            if (sm) sm.classList.remove('show');
            const sb = document.getElementById('settingsBtn');
            if (sb) sb.setAttribute('aria-expanded', 'false');
        });

        cancelBtn.addEventListener('click', function() { modal.setAttribute('hidden', ''); });

        confirmBtn.addEventListener('click', function() {
            const idx = (typeof gameState !== 'undefined') ? gameState.currentBattle : -1;
            if (idx === undefined || idx < 0 || typeof battles === 'undefined' || !battles[idx]) {
                modal.setAttribute('hidden', '');
                return;
            }

            // Per-battle progress in this codebase lives in two places:
            //  1. gameState.responses[] — only pushed at end of battle (saveHistoricalResponse).
            //     We strip any existing entry for this battle's id (defensive; supports
            //     re-renders where a response was already saved).
            //  2. ui.js module-level vars `narrativeStep` and `wwydSelected` —
            //     renderHistoricalBattle() resets these to 0 / -1 itself.
            const battleId = battles[idx].id;
            if (Array.isArray(gameState.responses)) {
                gameState.responses = gameState.responses.filter(function(r) {
                    return r && r.battleId !== battleId;
                });
            }
            if (typeof saveProgress === 'function') saveProgress();

            modal.setAttribute('hidden', '');

            // Canonical battle re-render (resets narrativeStep, wwydSelected, pills, UI).
            if (typeof renderHistoricalBattle === 'function') {
                renderHistoricalBattle();
            }
        });

        const backdrop = modal.querySelector('.confirm-modal-backdrop');
        if (backdrop) backdrop.addEventListener('click', function() { modal.setAttribute('hidden', ''); });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
                modal.setAttribute('hidden', '');
            }
        });
    })();

    // === v3.17: Teacher Jump-to-Battle (hidden — typed "jump" trigger) ===
    (function wireJumpToBattle() {
        const modal = document.getElementById('jumpToBattleModal');
        const grid = document.getElementById('jumpBattleGrid');
        const cancelBtn = document.getElementById('jumpToBattleCancel');
        const backdrop = document.getElementById('jumpToBattleBackdrop');
        if (!modal || !grid) return;

        const TRIGGER = 'jump';
        const TRIGGER_WINDOW_MS = 1500;
        let buffer = '';
        let lastKeyAt = 0;

        function openJumpModal() {
            if (typeof battles === 'undefined' || !battles.length) return;
            // Build battle list each open so the "current" highlight stays accurate
            while (grid.firstChild) grid.removeChild(grid.firstChild);
            const current = (typeof gameState !== 'undefined') ? (gameState.currentBattle || 0) : -1;
            for (let i = 0; i < battles.length; i++) {
                const btn = document.createElement('button');
                btn.className = 'jump-battle-btn' + (i === current ? ' jump-battle-btn-current' : '');
                btn.setAttribute('data-battle-idx', String(i));
                const num = document.createElement('span');
                num.className = 'jump-battle-num';
                num.textContent = (i + 1) + '.';
                const name = document.createElement('span');
                name.className = 'jump-battle-name';
                name.textContent = battles[i].name;
                btn.appendChild(num);
                btn.appendChild(name);
                btn.addEventListener('click', function() {
                    performJump(i);
                });
                grid.appendChild(btn);
            }
            modal.removeAttribute('hidden');
        }

        function closeJumpModal() {
            modal.setAttribute('hidden', '');
        }

        function performJump(idx) {
            if (typeof gameState === 'undefined' || typeof battles === 'undefined' || !battles[idx]) {
                closeJumpModal();
                return;
            }
            // Force historical mode — this feature is historical-only by design
            gameState.mode = 'historical';
            // If side isn't set, default to union so the game can render
            if (!gameState.side) gameState.side = 'union';
            gameState.currentBattle = idx;
            gameState.isInBattle = false;
            // Truncate responses to only include battles strictly before idx
            if (Array.isArray(gameState.responses)) {
                const keptIds = battles.slice(0, idx).map(function(b) { return b.id; });
                gameState.responses = gameState.responses.filter(function(r) {
                    return r && keptIds.indexOf(r.battleId) !== -1;
                });
            }
            if (typeof saveProgress === 'function') saveProgress();
            if (typeof reportProgressToDashboard === 'function') reportProgressToDashboard(false);

            closeJumpModal();

            if (typeof enterBattleScreen === 'function') {
                enterBattleScreen();
            }
        }

        // Typed-word trigger: "j-u-m-p" within 1.5s, outside text inputs
        document.addEventListener('keydown', function(e) {
            // Ignore if focus is in a typing context
            const target = e.target;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)) {
                return;
            }
            // Only respond to plain letter keys; ignore modifiers
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (e.key.length !== 1) {
                // Allow Escape to close if open
                if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
                    closeJumpModal();
                }
                return;
            }
            const now = Date.now();
            if (now - lastKeyAt > TRIGGER_WINDOW_MS) buffer = '';
            lastKeyAt = now;
            buffer = (buffer + e.key.toLowerCase()).slice(-TRIGGER.length);
            if (buffer === TRIGGER) {
                buffer = '';
                openJumpModal();
            }
        });

        if (cancelBtn) cancelBtn.addEventListener('click', closeJumpModal);
        if (backdrop) backdrop.addEventListener('click', closeJumpModal);
    })();

    // === v3.15: TTS — voice select + per-section play buttons ===
    function populateVoiceSelect() {
        const select = document.getElementById('accVoiceSelect');
        const ttsSection = document.getElementById('accTtsSection');
        const note = document.getElementById('accQualityNote');
        if (!select || !ttsSection) return;

        if (typeof TTS === 'undefined' || !TTS.isAvailable()) {
            ttsSection.style.display = 'none';
            return;
        }
        ttsSection.style.display = '';

        const voices = TTS.getVoices();
        const savedVoice = (typeof Settings !== 'undefined') ? Settings.get('ttsVoice') : null;

        select.textContent = '';
        voices.forEach(function(voice) {
            const opt = document.createElement('option');
            opt.value = voice.name;
            opt.textContent = voice.name + ' (' + voice.lang + ')';
            if (voice.name === savedVoice) opt.selected = true;
            select.appendChild(opt);
        });

        if (!select.dataset.changeWired) {
            select.addEventListener('change', function() {
                if (typeof Settings !== 'undefined') Settings.set('ttsVoice', select.value);
            });
            select.dataset.changeWired = '1';
        }

        if (note) {
            const warning = TTS.qualityWarning();
            if (warning) {
                note.textContent = warning;
                note.removeAttribute('hidden');
            } else {
                note.setAttribute('hidden', '');
            }
        }
    }

    document.addEventListener('tts:voices-updated', populateVoiceSelect);

    (function wireVoiceSelectOnPanelOpen() {
        const accBtn = document.getElementById('accessibilityBtn');
        if (accBtn) {
            accBtn.addEventListener('click', function() { setTimeout(populateVoiceSelect, 0); });
        }
    })();

    function attachTtsButton(targetEl, label) {
        if (!targetEl) return null;
        if (typeof TTS === 'undefined' || !TTS.isAvailable()) return null;
        if (targetEl.querySelector(':scope > .tts-play-btn')) return null;

        const btn = document.createElement('button');
        btn.className = 'tts-play-btn';
        btn.setAttribute('aria-label', 'Read aloud: ' + (label || 'this section'));
        btn.textContent = '▶ Read';
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (btn.getAttribute('data-playing') === 'true') {
                TTS.stop();
                return;
            }
            document.querySelectorAll('.tts-play-btn[data-playing="true"]').forEach(function(other) {
                other.setAttribute('data-playing', 'false');
                other.textContent = '▶ Read';
            });
            // Build the read-aloud text from a clone so we can strip non-narrated
            // bits: the play button itself, and (v3.19) any .vocab-tooltip
            // definitions injected by the glossary auto-linker — otherwise TTS
            // would read each term's definition aloud inline and garble the prose.
            const clone = targetEl.cloneNode(true);
            clone.querySelectorAll('.tts-play-btn, .vocab-tooltip').forEach(function(n) {
                n.parentNode && n.parentNode.removeChild(n);
            });
            const text = (clone.textContent || '').replace(/\s+/g, ' ').trim();
            if (!text) return;
            btn.setAttribute('data-playing', 'true');
            btn.textContent = '■ Stop';
            TTS.speak(text, {
                onEnd: function() {
                    btn.setAttribute('data-playing', 'false');
                    btn.textContent = '▶ Read';
                },
                onError: function() {
                    btn.setAttribute('data-playing', 'false');
                    btn.textContent = '▶ Read';
                }
            });
        });
        targetEl.appendChild(btn);
        return btn;
    }

    function refreshTtsButtons(root) {
        const scope = root || document;
        scope.querySelectorAll('.tts-readable').forEach(function(el) {
            attachTtsButton(el, el.getAttribute('data-tts-label'));
        });
    }

    window.refreshTtsButtons = refreshTtsButtons;

    // MutationObserver: auto-attach play buttons whenever a `.tts-readable`
    // element appears (or has the class added) anywhere under one of the watched
    // containers. This avoids having to call refreshTtsButtons() at every reveal
    // point in ui.js. Every screen/modal that marks reading text as tts-readable
    // must be listed here, or its play buttons won't attach.
    (function observeTtsReadable() {
        if (typeof TTS === 'undefined' || !TTS.isAvailable()) return;
        const targets = [
            document.getElementById('historicalScreen'),
            document.getElementById('actRecallScreen'),
            document.getElementById('leaderLetterScreen'),
            document.getElementById('actIntroScreen'),
            document.getElementById('battleRevisitModal'),
            document.getElementById('freeplayBriefing'),
            document.getElementById('freeplayResults')
        ].filter(Boolean);
        if (!targets.length) return;
        const obs = new MutationObserver(function(mutations) {
            for (let i = 0; i < mutations.length; i++) {
                const m = mutations[i];
                if (m.type === 'attributes' && m.target && m.target.classList && m.target.classList.contains('tts-readable')) {
                    attachTtsButton(m.target, m.target.getAttribute('data-tts-label'));
                }
                if (m.type === 'childList') {
                    // If a readable element's children changed (e.g. textContent
                    // re-assignment wipes the button), re-attach.
                    if (m.target && m.target.classList && m.target.classList.contains('tts-readable')) {
                        attachTtsButton(m.target, m.target.getAttribute('data-tts-label'));
                    }
                    m.addedNodes.forEach(function(node) {
                        if (node.nodeType !== 1) return;
                        if (node.classList && node.classList.contains('tts-readable')) {
                            attachTtsButton(node, node.getAttribute('data-tts-label'));
                        }
                        if (node.querySelectorAll) {
                            node.querySelectorAll('.tts-readable').forEach(function(el) {
                                attachTtsButton(el, el.getAttribute('data-tts-label'));
                            });
                        }
                    });
                }
            }
        });
        targets.forEach(function(t) {
            obs.observe(t, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
        });
    })();
}

// === v3.15: Reset Battle menu visibility helpers ===
function showResetBattleMenuItem() {
    const item = document.getElementById('resetBattleMenuBtn');
    if (item) item.style.display = '';
}
function hideResetBattleMenuItem() {
    const item = document.getElementById('resetBattleMenuBtn');
    if (item) item.style.display = 'none';
}

function startWithSide(side) {
    // Read student name + period from inline fields (historical mode only)
    if (gameState.mode === 'historical') {
        // A typed-but-invalid class code is almost always a typo. Catch it here
        // and refuse to start so the student isn't silently left untracked.
        // A blank code is allowed (legitimately playing without teacher tracking).
        if (typeof classCodeEntryIsInvalid === 'function' && classCodeEntryIsInvalid()) {
            showClassCodeError(true);
            return;
        }
        showClassCodeError(false);
        gameState.studentName = getStudentNameFromForm();
        gameState.period = getPeriodFromForm();
    }

    initializeGame(gameState.mode, side);

    if (gameState.mode === 'historical') {
        // Write initial progress to the teacher dashboard
        reportProgressToDashboard(false);
        showNoTeacherBannerIfNeeded();
        // Show the leader's letter before diving into battles
        renderLeaderLetter();
    } else {
        renderFreeplayBriefing();
    }
}

// Writes the current student's progress to the teacher dashboard.
// Historical mode only. Requires a valid saved class code (AMS-p1..p5).
// No code = no write, so strangers never appear in the dashboard.
function reportProgressToDashboard(finished) {
    if (gameState.mode !== 'historical') return;
    if (typeof firebaseLeaderboard === 'undefined' || !firebaseLeaderboard.isAvailable()) return;

    var savedCode = firebaseLeaderboard.getSavedClassCode();
    var period = firebaseLeaderboard.periodForRoom(savedCode);
    if (!period) return;

    firebaseLeaderboard.writeProgress(
        savedCode,
        {
            name: gameState.studentName || 'Student',
            period: period,
            currentBattle: gameState.currentBattle || 0,
            totalBattles: (typeof battles !== 'undefined' ? battles.length : 13),
            side: gameState.side || '',
            finished: !!finished
        }
    );
}

// v3.22: record a recall question result for the teacher's Question-difficulty
// view. Historical mode only, requires a valid saved class code (so strangers
// never write). Fire-and-forget — never blocks or surfaces errors to students.
function reportRecallResultToDashboard(actIndex, qIndex, firstTry, correct, attempts) {
    if (gameState.mode !== 'historical') return;
    if (typeof firebaseLeaderboard === 'undefined' || !firebaseLeaderboard.isAvailable()) return;
    var savedCode = firebaseLeaderboard.getSavedClassCode();
    var period = firebaseLeaderboard.periodForRoom(savedCode);
    if (!period) return;
    firebaseLeaderboard.writeRecallResult(savedCode, actIndex, qIndex, {
        name: gameState.studentName || 'Student',
        period: period,
        correct: !!correct,
        firstTry: !!firstTry,
        attempts: Number(attempts) || 1
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
