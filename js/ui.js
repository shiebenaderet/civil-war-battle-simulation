// UI/DOM manipulation for Civil War Battle Simulation v3.1
// Handles screen transitions, rendering, and all DOM interactions

// ============================================================
// Screen Management
// ============================================================

var screens = {};

function cacheScreens() {
    screens.modeSelection = document.getElementById('modeSelection');
    screens.studentNameScreen = document.getElementById('studentNameScreen');
    screens.sideSelection = document.getElementById('sideSelection');
    screens.leaderLetterScreen = document.getElementById('leaderLetterScreen');
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
            'You have a saved ' + modeLabel + ' game (' + sideLabel + ', Battle ' + battleNum + ' of ' + battles.length + ').';
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
        subtitle.textContent = 'Command your chosen side through ' + battles.length + ' major battles';
        unionCount.textContent = 'Starting Army: 1,500,000 soldiers';
        confCount.textContent = 'Starting Army: 1,000,000 soldiers';
    }

    showScreen('sideSelection');
}

// ============================================================
// Student Name Screen (Historical Mode)
// ============================================================

function renderStudentNameScreen() {
    // Clear any previous values
    var firstName = document.getElementById('firstNameInput');
    var lastInitial = document.getElementById('lastInitialInput');
    if (firstName) firstName.value = '';
    if (lastInitial) lastInitial.value = '';

    showScreen('studentNameScreen');
    // Auto-focus the first name field
    if (firstName) setTimeout(function() { firstName.focus(); }, 100);
}

function getStudentNameFromForm() {
    var first = (document.getElementById('firstNameInput').value || '').trim();
    var last = (document.getElementById('lastInitialInput').value || '').trim().toUpperCase();
    if (!first) return 'Student';
    return last ? first + ' ' + last + '.' : first;
}

// ============================================================
// Leader Letter Screen (Transition into Historical Mode)
// ============================================================

function renderLeaderLetter() {
    var side = gameState.side;
    var studentName = gameState.studentName || 'Student';

    var seal = document.getElementById('letterSeal');
    var from = document.getElementById('letterFrom');
    var date = document.getElementById('letterDate');
    var salutation = document.getElementById('letterSalutation');
    var body = document.getElementById('letterBody');
    var closing = document.getElementById('letterClosing');
    var signature = document.getElementById('letterSignature');
    var title = document.getElementById('letterTitle');

    if (side === 'union') {
        seal.textContent = '\uD83C\uDDFA\uD83C\uDDF8';
        from.textContent = 'Executive Mansion, Washington';
        date.textContent = 'April 1861';
        salutation.textContent = 'Dear ' + escapeHtml(studentName) + ',';
        body.innerHTML =
            '<p>The nation faces its gravest hour. As your President, I write to ask something of you that requires both courage and careful thought.</p>' +
            '<p>I need you on the ground \u2014 someone who can witness the events of this war firsthand, from the first shots at Fort Sumter to whatever end Providence has in store. You will visit <strong>13 battlefields</strong> across our divided nation.</p>' +
            '<p>At each site, you will review the intelligence available to our commanders, weigh the decisions they faced, learn what actually happened, and hear from the people who lived through it. I ask that you record your honest thoughts at every step.</p>' +
            '<p>This will not be easy. War never is. But understanding what happened \u2014 and why \u2014 is the duty of every citizen who wishes to preserve this Union and the idea that all people are created equal.</p>';
        closing.textContent = 'With great confidence in your judgment,';
        signature.textContent = 'Abraham Lincoln';
        title.textContent = 'President of the United States';
    } else {
        seal.textContent = '\uD83C\uDFF4';
        from.textContent = 'Executive Office, Richmond';
        date.textContent = 'April 1861';
        salutation.textContent = 'Dear ' + escapeHtml(studentName) + ',';
        body.innerHTML =
            '<p>The Confederate States of America stand at a crossroads, and I require a trusted correspondent to document what unfolds on our battlefields.</p>' +
            '<p>You will observe <strong>13 pivotal engagements</strong> across the breadth of this war, from the first shots at Fort Sumter to the final chapter at Appomattox Court House.</p>' +
            '<p>At each battlefield, you will study the intelligence available to commanders on both sides, consider the decisions they faced, and record your own reflections on what this war means for the people caught in its path.</p>' +
            '<p>I ask that you witness these events honestly and completely. Your observations will be invaluable to understanding the true cost and meaning of this conflict for all who lived through it.</p>';
        closing.textContent = 'May Providence guide your journey,';
        signature.textContent = 'Jefferson Davis';
        title.textContent = 'President of the Confederate States';
    }

    showScreen('leaderLetterScreen');
}

// ============================================================
// Visual Tab Switcher
// ============================================================

function switchVisualTab(clickedTab, showId, hideId) {
    // Update tab states
    var tabs = clickedTab.parentElement.querySelectorAll('.visual-tab');
    tabs.forEach(function(tab) { tab.classList.remove('active'); });
    clickedTab.classList.add('active');

    // Show/hide panels
    document.getElementById(showId).style.display = 'block';
    document.getElementById(hideId).style.display = 'none';
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
// Battle Map Helper
// ============================================================

function renderBattleMap(container, battle) {
    var assets = getAssetManifest();
    var asset = assets.find(function(a) { return a.id === battle.id; });

    if (!asset) {
        asset = assets[gameState.currentBattle] || assets[0];
    }

    if (asset && asset.mapUrl) {
        var credit = escapeHtml(asset.mapCredit || 'Hal Jespersen');
        var license = escapeHtml(asset.mapLicense || 'CC BY 3.0');

        container.innerHTML =
            '<img src="' + asset.mapUrl + '" alt="Tactical map of ' + escapeHtml(battle.name) + '" ' +
            'loading="lazy" decoding="async" ' +
            'onerror="this.parentElement.innerHTML=\'<div class=\\\'map-fallback\\\'>' +
            '<div class=\\\'map-fallback-icon\\\'>&#x1F5FA;&#xFE0F;</div>' +
            '<p>Map loading failed. Check your connection.</p></div>\';">' +
            '<span class="map-credit">' + credit + ' &bull; ' + license + '</span>';
    } else {
        container.innerHTML =
            '<div class="map-fallback">' +
            '<div class="map-fallback-icon">&#x1F5FA;&#xFE0F;</div>' +
            '<p>Tactical map not available for this battle</p></div>';
    }
}

// ============================================================
// Historical Mode Screens
// ============================================================

var narrativeStep = 0;   // 0-7: tracks which section is visible
var wwydSelected = -1;   // tracks which WWYD option the student picked

function renderHistoricalBattle() {
    var content = getHistoricalContent();
    narrativeStep = 0;
    wwydSelected = -1;

    // Progress
    document.getElementById('historicalProgressLabel').textContent =
        'Battle ' + content.battleNumber + ' of ' + content.totalBattles;
    document.getElementById('historicalProgressFill').style.width =
        (content.battleNumber / content.totalBattles * 100) + '%';

    // Step pills - reset to step 0
    updateStepPills(0);

    // Header
    document.getElementById('histBattleName').textContent = content.name;
    document.getElementById('histBattleDate').textContent = content.date;
    document.getElementById('histBattleLocation').textContent = content.location;

    // Image + Map
    renderBattleImage(
        document.getElementById('histArtwork'),
        battles[gameState.currentBattle]
    );
    renderBattleMap(
        document.getElementById('histMap'),
        battles[gameState.currentBattle]
    );
    // Reset tabs to show artwork by default
    var histTabs = document.querySelectorAll('#historicalScreen .visual-tab');
    histTabs.forEach(function(tab) { tab.classList.remove('active'); });
    if (histTabs[0]) histTabs[0].classList.add('active');
    document.getElementById('histArtwork').style.display = 'block';
    document.getElementById('histMap').style.display = 'none';

    // --- Section 1: Intel Report ---
    var intelGrid = document.getElementById('histIntelGrid');
    var intel = content.intel;
    intelGrid.innerHTML =
        '<div class="intel-card union-intel">' +
            '<h4>Union</h4>' +
            '<div>Forces: ' + escapeHtml(intel.union.forces) + '</div>' +
            '<div>Commander: ' + escapeHtml(intel.union.commander) + '</div>' +
            '<div>Advantage: ' + escapeHtml(intel.union.advantage) + '</div>' +
        '</div>' +
        '<div class="intel-card confederacy-intel">' +
            '<h4>Confederacy</h4>' +
            '<div>Forces: ' + escapeHtml(intel.confederacy.forces) + '</div>' +
            '<div>Commander: ' + escapeHtml(intel.confederacy.commander) + '</div>' +
            '<div>Advantage: ' + escapeHtml(intel.confederacy.advantage) + '</div>' +
        '</div>';

    // --- Section 2: The Situation ---
    document.getElementById('histSituation').textContent = content.situation;

    // --- Section 3: What Would You Do? ---
    var wwyd = content.whatWouldYouDo;
    document.getElementById('histWWYDPrompt').textContent = wwyd.prompt;

    var optionsContainer = document.getElementById('histWWYDOptions');
    optionsContainer.innerHTML = '';
    wwyd.options.forEach(function(optionText, idx) {
        var btn = document.createElement('button');
        btn.className = 'wwyd-option-btn';
        btn.textContent = optionText;
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', 'false');
        btn.setAttribute('tabindex', '0');
        btn.addEventListener('click', function() {
            selectWwydOption(idx);
        });
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectWwydOption(idx);
            }
        });
        optionsContainer.appendChild(btn);
    });

    // --- Section 4: What Really Happened ---
    document.getElementById('histWhatHappened').textContent = content.whatHappened;
    document.getElementById('histOutcome').textContent = content.outcome;

    var totalCasualties = content.casualties.union + content.casualties.confederacy;
    document.getElementById('histCasualties').textContent =
        'Casualties: ' + totalCasualties.toLocaleString() +
        ' (Union: ' + content.casualties.union.toLocaleString() +
        ', Confederate: ' + content.casualties.confederacy.toLocaleString() + ')';

    document.getElementById('histTechName').textContent = content.tech.name;
    document.getElementById('histTechDesc').textContent = content.tech.description;

    // --- Section 5: A Voice From the War ---
    document.getElementById('histVoiceQuote').textContent = content.voice.quote;
    document.getElementById('histVoiceAttribution').textContent = '\u2014 ' + content.voice.attribution;
    document.getElementById('histVoiceSource').textContent = content.voice.source;

    // Voice explainer (beginner level)
    var explainerEl = document.getElementById('histVoiceExplainer');
    if (content.voice.explainer && gameState.difficulty === 'beginner') {
        explainerEl.textContent = '\uD83D\uDCA1 In simpler words: ' + content.voice.explainer;
        explainerEl.style.display = 'block';
    } else {
        explainerEl.style.display = 'none';
    }

    // --- Section 6: The Bigger Picture ---
    document.getElementById('histBigPicture').textContent = content.biggerPicture;
    document.getElementById('histKeyFact').textContent = content.keyFact;

    // Perspectives (if available for this battle)
    var perspectivesEl = document.getElementById('histPerspectives');
    if (content.perspectives && content.perspectives.length > 0) {
        var pHtml = '<h4 class="perspectives-heading">Perspectives You Should Know</h4>';
        content.perspectives.forEach(function(p) {
            pHtml +=
                '<div class="perspective-card">' +
                    '<div class="perspective-icon">' + p.icon + '</div>' +
                    '<div class="perspective-content">' +
                        '<div class="perspective-title">' + escapeHtml(p.title) + '</div>' +
                        '<p class="perspective-text">' + escapeHtml(p.text) + '</p>' +
                    '</div>' +
                '</div>';
        });
        perspectivesEl.innerHTML = pHtml;
        perspectivesEl.style.display = 'block';
    } else {
        perspectivesEl.innerHTML = '';
        perspectivesEl.style.display = 'none';
    }

    // --- Section 7: Reflect ---
    document.getElementById('histReflectPrompt').textContent = content.reflection;
    document.getElementById('histReflectInput').value = '';

    // STREAMLINED FLOW: Step 0 shows Intel + Situation together (Briefing)
    document.getElementById('sectionIntel').style.display = 'block';
    document.getElementById('sectionSituation').style.display = 'block';
    document.getElementById('sectionWWYD').style.display = 'none';
    document.getElementById('wwydFeedback').style.display = 'none';
    document.getElementById('sectionHappened').style.display = 'none';
    document.getElementById('sectionVoice').style.display = 'none';
    document.getElementById('sectionBigPicture').style.display = 'none';
    document.getElementById('sectionReflect').style.display = 'none';

    // Button text
    document.getElementById('narrativeContinueBtn').textContent = 'Continue';
    document.getElementById('narrativeContinueBtn').disabled = false;

    showScreen('historicalScreen');
    showGameActions(true);
    showCampaignLogBtn(false);
}

function selectWwydOption(idx) {
    wwydSelected = idx;

    // Highlight selected, dim others
    var buttons = document.querySelectorAll('#histWWYDOptions .wwyd-option-btn');
    buttons.forEach(function(btn, i) {
        if (i === idx) {
            btn.classList.add('selected');
            btn.setAttribute('aria-checked', 'true');
        } else {
            btn.classList.add('dimmed');
            btn.setAttribute('aria-checked', 'false');
        }
    });

    // If narrative is waiting at step 1 (WWYD), enable the continue button
    var continueBtn = document.getElementById('narrativeContinueBtn');
    if (narrativeStep === 1) {
        continueBtn.disabled = false;
        continueBtn.classList.add('pulse-hint');
    }
}

// Update step indicator pills
function updateStepPills(step) {
    var pills = document.querySelectorAll('.step-pill');
    pills.forEach(function(pill, i) {
        pill.classList.remove('active', 'completed');
        if (i < step) pill.classList.add('completed');
        else if (i === step) pill.classList.add('active');
    });
}

function advanceNarrative() {
    var continueBtn = document.getElementById('narrativeContinueBtn');

    // STREAMLINED 4-STEP FLOW:
    // Step 0: Briefing (Intel + Situation shown)
    // Step 1: Your Call (WWYD - blocks until selection)
    // Step 2: What Happened (outcome + tech + voice + bigger picture - all at once)
    // Step 3: Reflect (writing prompt)
    // Step 4: Save & advance

    // Step 1 is WWYD - block if no option selected
    if (narrativeStep === 1 && wwydSelected === -1) {
        continueBtn.disabled = true;
        return;
    }

    narrativeStep++;
    var targetSection = null;

    switch (narrativeStep) {
        case 1:
            // Show WWYD - block continue until student picks an option
            updateStepPills(1);
            targetSection = document.getElementById('sectionWWYD');
            targetSection.style.display = 'block';
            if (wwydSelected === -1) {
                continueBtn.disabled = true;
            }
            break;

        case 2:
            // THE REVEAL: Show feedback + What Happened + Voice + Bigger Picture
            updateStepPills(2);
            continueBtn.disabled = false;
            continueBtn.classList.remove('pulse-hint');

            // Show WWYD feedback for the student's specific choice
            var feedbackEl = document.getElementById('wwydFeedback');
            var content = getHistoricalContent();
            var feedbackList = content.whatWouldYouDo.feedback;
            if (feedbackList && feedbackList[wwydSelected]) {
                document.getElementById('feedbackIcon').textContent = '\uD83D\uDCAC';
                document.getElementById('feedbackText').textContent = feedbackList[wwydSelected];
                feedbackEl.style.display = 'block';
                targetSection = feedbackEl;
            }

            // Show all three "reveal" sections together
            var happened = document.getElementById('sectionHappened');
            happened.style.display = 'block';
            if (!targetSection) targetSection = happened;

            document.getElementById('sectionVoice').style.display = 'block';
            document.getElementById('sectionBigPicture').style.display = 'block';
            break;

        case 3:
            // Show Reflect, change button text
            updateStepPills(3);
            targetSection = document.getElementById('sectionReflect');
            targetSection.style.display = 'block';
            var isLast = gameState.currentBattle >= battles.length - 1;
            continueBtn.textContent = isLast ? 'Complete Historical Mode' : 'Next Battle \u2192';
            break;

        case 4:
            // Save response and advance to next battle
            var wwydChoiceText = '';
            if (wwydSelected >= 0) {
                var content = getHistoricalContent();
                var opts = content.whatWouldYouDo.options;
                if (opts && opts[wwydSelected]) {
                    wwydChoiceText = opts[wwydSelected];
                }
            }
            var reflectionText = document.getElementById('histReflectInput').value.trim();
            saveHistoricalResponse(wwydChoiceText, reflectionText);

            var done = advanceHistorical();
            if (done) {
                renderHistoricalComplete();
            } else {
                renderHistoricalBattle();
            }
            return; // exit early, no scroll needed
    }

    // Smooth scroll to the newly revealed section
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function renderHistoricalComplete() {
    var endBanner = document.getElementById('endBanner');
    endBanner.className = 'outcome-banner victory-banner';

    document.getElementById('endTitle').textContent = 'Historical Mode Complete!';
    document.getElementById('endSubtitle').textContent =
        'You\'ve experienced all ' + battles.length + ' major battles of the Civil War';

    var side = gameState.side;
    var sideLabel = side === 'union' ? 'Union' : 'Confederate';

    document.getElementById('endContent').innerHTML =
        '<div class="end-summary">' +
        '<h3>Your Journey Through History</h3>' +
        '<p>You experienced the Civil War from the <strong>' + sideLabel + '</strong> perspective, ' +
        'following the real events of ' + battles.length + ' major battles from 1861 to 1865.</p>' +
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

    // Show PDF export section
    var pdfExportSection = document.getElementById('pdfExportSection');
    if (pdfExportSection) {
        pdfExportSection.style.display = 'block';

        // Wire up the export button
        var exportBtn = document.getElementById('exportPdfBtn');
        if (exportBtn) {
            // Remove old listeners by replacing the node
            var newBtn = exportBtn.cloneNode(true);
            exportBtn.parentNode.replaceChild(newBtn, exportBtn);
            newBtn.addEventListener('click', function() {
                generatePdfReport();
            });
        }
    }

    // Hide scoreboard for historical mode
    document.getElementById('scoreboardSection').style.display = 'none';

    showScreen('endGameScreen');
    showGameActions(false);
    showCampaignLogBtn(false);
}

// ============================================================
// PDF Report Generation (Historical Mode)
// ============================================================

function generatePdfReport() {
    var studentName = gameState.studentName || 'Student';
    var sideLabel = gameState.side === 'union' ? 'Union' : 'Confederacy';
    var today = new Date().toLocaleDateString();
    var responses = gameState.responses || [];

    var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">' +
        '<title>Civil War Response Sheet - ' + escapeHtml(studentName) + '</title>' +
        '<style>' +
        'body { font-family: Georgia, "Times New Roman", serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #222; line-height: 1.5; }' +
        'h1 { text-align: center; font-size: 1.6em; margin-bottom: 4px; border-bottom: 2px solid #333; padding-bottom: 8px; }' +
        '.header-info { text-align: center; margin-bottom: 24px; color: #555; font-size: 0.95em; }' +
        '.battle-entry { margin-bottom: 24px; page-break-inside: avoid; border: 1px solid #ccc; border-radius: 6px; padding: 16px; }' +
        '.battle-entry h2 { font-size: 1.15em; margin: 0 0 8px 0; color: #1a3a5c; }' +
        '.label { font-weight: bold; color: #444; margin-top: 8px; display: block; }' +
        '.response-text { background: #f9f9f9; border: 1px solid #ddd; border-radius: 4px; padding: 8px 12px; margin-top: 4px; min-height: 1.5em; white-space: pre-wrap; }' +
        '.no-response { color: #999; font-style: italic; }' +
        '@media print { body { padding: 0; } .battle-entry { border-color: #999; } }' +
        '</style></head><body>';

    html += '<h1>Civil War Battle Simulation - Response Sheet</h1>';
    html += '<div class="header-info">';
    html += '<strong>Student:</strong> ' + escapeHtml(studentName);
    html += ' &nbsp;|&nbsp; <strong>Side:</strong> ' + escapeHtml(sideLabel);
    html += ' &nbsp;|&nbsp; <strong>Date:</strong> ' + escapeHtml(today);
    html += '</div>';

    if (responses.length === 0) {
        html += '<p style="text-align:center;color:#999;">No responses recorded.</p>';
    } else {
        responses.forEach(function(resp, i) {
            html += '<div class="battle-entry">';
            html += '<h2>Battle ' + (i + 1) + ': ' + escapeHtml(resp.battleName || resp.battleId || 'Unknown') + '</h2>';

            html += '<span class="label">What Would You Do?</span>';
            if (resp.wwydChoice) {
                html += '<div class="response-text">' + escapeHtml(resp.wwydChoice) + '</div>';
            } else {
                html += '<div class="response-text no-response">No choice recorded</div>';
            }

            html += '<span class="label">Reflection</span>';
            if (resp.reflectionText) {
                html += '<div class="response-text">' + escapeHtml(resp.reflectionText) + '</div>';
            } else {
                html += '<div class="response-text no-response">No reflection written</div>';
            }

            html += '</div>';
        });
    }

    html += '</body></html>';

    var printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        // Trigger print dialog after content loads
        printWindow.onload = function() {
            printWindow.print();
        };
        // Fallback: try print after a short delay in case onload already fired
        setTimeout(function() {
            try { printWindow.print(); } catch(e) { /* ignore */ }
        }, 500);
    }
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

    // Image + Map
    renderBattleImage(document.getElementById('fpArtwork'), battle);
    renderBattleMap(document.getElementById('fpMap'), battle);
    // Reset tabs to show artwork by default
    var fpTabs = document.querySelectorAll('#freeplayBriefing .visual-tab');
    fpTabs.forEach(function(tab) { tab.classList.remove('active'); });
    if (fpTabs[0]) fpTabs[0].classList.add('active');
    document.getElementById('fpArtwork').style.display = 'block';
    document.getElementById('fpMap').style.display = 'none';

    // Briefing
    document.getElementById('fpBriefing').textContent = battle.freeplay.briefing;

    // Historical event notice
    var histEventNotice = document.getElementById('fpHistEventNotice');
    if (histEventNotice) {
        var histEvt = battle.freeplay.historicalEvent;
        if (histEvt && histEvt.text) {
            document.getElementById('fpHistEventText').textContent = histEvt.text;
            histEventNotice.style.display = 'block';
        } else {
            histEventNotice.style.display = 'none';
        }
    }

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

    // Fog of War / Historical Event display
    var fogSection = document.getElementById('fogOfWarSection');
    if (fogSection) {
        if (result.fogEvent || result.histEvent) {
            fogSection.style.display = 'block';

            // Fog of war event
            var fogDisplay = document.getElementById('fogEventDisplay');
            if (result.fogEvent) {
                document.getElementById('fogEventText').textContent = result.fogEvent.text;
                var fogModStr = result.fogMod >= 0 ? '+' + result.fogMod : '' + result.fogMod;
                document.getElementById('fogEventMod').textContent = fogModStr;
                fogDisplay.style.display = 'flex';
            } else {
                fogDisplay.style.display = 'none';
            }

            // Historical event
            var histDisplay = document.getElementById('histEventDisplay');
            if (result.histEvent && result.histEvent.text) {
                document.getElementById('histEventText').textContent = result.histEvent.text;
                var histModStr = result.histMod >= 0 ? '+' + result.histMod : '' + result.histMod;
                document.getElementById('histEventMod').textContent = histModStr;
                histDisplay.style.display = 'flex';
            } else {
                histDisplay.style.display = 'none';
            }
        } else {
            fogSection.style.display = 'none';
        }
    }

    // Power breakdown
    var powerItems = document.getElementById('powerItems');
    if (powerItems) {
        var breakdownHtml = '';
        breakdownHtml += '<div class="power-item"><span>Strategy Base</span><span>' + result.basePower + '</span></div>';
        breakdownHtml += '<div class="power-item"><span>Momentum Bonus</span><span>' +
            (result.momentumBonus >= 0 ? '+' : '') + result.momentumBonus + '</span></div>';
        if (result.fogEvent) {
            breakdownHtml += '<div class="power-item"><span>Fog of War</span><span>' +
                (result.fogMod >= 0 ? '+' : '') + result.fogMod + '</span></div>';
        }
        if (result.histEvent && result.histMod !== 0) {
            breakdownHtml += '<div class="power-item"><span>Historical Event</span><span>' +
                (result.histMod >= 0 ? '+' : '') + result.histMod + '</span></div>';
        }
        powerItems.innerHTML = breakdownHtml;
    }

    var powerTotal = document.getElementById('powerTotal');
    if (powerTotal) powerTotal.textContent = result.effectivePower;
    var powerDifficulty = document.getElementById('powerDifficulty');
    if (powerDifficulty) powerDifficulty.textContent = result.difficulty;

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

    // Hide PDF export for freeplay
    var pdfExportSection = document.getElementById('pdfExportSection');
    if (pdfExportSection) pdfExportSection.style.display = 'none';

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
