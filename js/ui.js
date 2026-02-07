// UI/DOM manipulation for Civil War Battle Simulation v3.1
// Handles screen transitions, rendering, and all DOM interactions

// ============================================================
// Screen Management
// ============================================================

var screens = {};

function cacheScreens() {
    screens.introSplash = document.getElementById('introSplash');
    screens.modeSelection = document.getElementById('modeSelection');
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
    var title = document.getElementById('sideSelectionTitle');
    var subtitle = document.getElementById('sideSelectionSubtitle');
    var unionCount = document.getElementById('unionSoldierCount');
    var confCount = document.getElementById('confederacySoldierCount');
    var nameSection = document.getElementById('nameInlineSection');
    var difficultySection = document.getElementById('difficultySelectorSection');

    if (gameState.mode === 'historical') {
        title.textContent = 'Set Up Your Journey';
        subtitle.textContent = 'Enter your name, choose a reading level, and pick your side';
        unionCount.textContent = '';
        confCount.textContent = '';
        nameSection.style.display = 'block';
        difficultySection.style.display = '';

        // Clear inputs
        var firstName = document.getElementById('firstNameInput');
        var lastInitial = document.getElementById('lastInitialInput');
        if (firstName) firstName.value = '';
        if (lastInitial) lastInitial.value = '';
        // Auto-focus first name
        if (firstName) setTimeout(function() { firstName.focus(); }, 100);
    } else {
        title.textContent = 'Choose Your Side';
        subtitle.textContent = 'Command your chosen side through ' + battles.length + ' major battles';
        unionCount.textContent = 'Starting Army: 1,500,000 soldiers';
        confCount.textContent = 'Starting Army: 1,000,000 soldiers';
        nameSection.style.display = 'none';
        difficultySection.style.display = 'none';
    }

    showScreen('sideSelection');
}

// ============================================================
// Student Name Screen (Historical Mode)
// ============================================================

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

// Grouped reflections: students reflect every 3-4 battles on bigger themes
var reflectionBattles = [2, 5, 8, 12]; // Shiloh, Chancellorsville, Chickamauga, Appomattox

var groupedReflections = [
    {
        theme: 'The War Begins',
        battleRange: 'Fort Sumter, Bull Run, and Shiloh',
        prompt: {
            beginner: "You've seen the first three battles. At Fort Sumter, both sides said they were just defending themselves. At Bull Run, people thought the war would be quick. By Shiloh, thousands were dying in a single day. Why did the war get so much worse so fast? What changed between the first shots and the bloodbath at Shiloh?",
            intermediate: "From Fort Sumter through Shiloh, the war escalated from a symbolic standoff to massive bloodshed. Both sides initially expected a short war \u2014 civilians even picnicked at Bull Run. What caused this rapid escalation? How did the reality of battle change what people expected and how the war was fought?",
            advanced: "Trace the escalation from Fort Sumter's relatively bloodless standoff through Bull Run's shocking rout to Shiloh's unprecedented carnage. How did each battle reshape assumptions about the war's nature and cost? After Shiloh, Grant concluded that only 'complete conquest' could end the war \u2014 what evidence from these three battles supports or complicates that conclusion?"
        },
        teacherTip: {
            beginner: "Think about what people expected before each battle vs. what actually happened. You could compare the civilians picnicking at Bull Run to the soldiers at Shiloh. What surprised people the most?",
            intermediate: "Consider how expectations changed from battle to battle. What did people assume about war at first? What details from the primary sources proved those assumptions wrong?",
            advanced: "Examine the gap between political rhetoric and battlefield reality. How did each side's justification for war hold up against escalating violence? Use specific evidence from the primary sources."
        }
    },
    {
        theme: 'The Human Cost',
        battleRange: 'Antietam, Fredericksburg, and Chancellorsville',
        prompt: {
            beginner: "Over these three battles, you've seen how the war hurt everyone \u2014 soldiers, nurses, immigrants, and regular families. Clara Barton treated the wounded. Irish soldiers charged a wall 14 times. Lincoln freed enslaved people to help win the war. Pick one person or group and explain how the war changed their life.",
            intermediate: "Antietam through Chancellorsville reveals the war's devastating human toll. The Emancipation Proclamation transformed the war's purpose. Fredericksburg exposed the cost of poor leadership. Chancellorsville showed that even victories have terrible prices. Choose one of these themes and explain how it changed the conflict.",
            advanced: "These three battles illustrate the intersection of military strategy, political calculation, and human suffering. Lincoln weaponized Antietam's outcome for the Emancipation Proclamation. Fredericksburg's futile charges raise questions about command responsibility. Chancellorsville's Pyrrhic victory cost Lee his most irreplaceable general. Drawing on primary sources, analyze how the relationship between military action and political purpose evolved. Who bore the greatest cost?"
        },
        teacherTip: {
            beginner: "Pick one person you read about \u2014 Clara Barton, an Irish soldier, an enslaved person. What was their experience? How was the war personal for them?",
            intermediate: "Think about who had power and who didn't. Who made the big decisions, and who paid the price? The Emancipation Proclamation is a good example \u2014 who did it help, and who was left out?",
            advanced: "Consider whose voices are centered in traditional war narratives and whose are marginalized. How do the primary source quotes complicate simple moral judgments about the war's purpose?"
        }
    },
    {
        theme: 'Turning Points',
        battleRange: 'Vicksburg, Gettysburg, and Chickamauga',
        prompt: {
            beginner: "Vicksburg and Gettysburg happened at almost the same time and changed the whole war. People in Vicksburg hid in caves. At Gettysburg, 12,000 men charged across an open field. What made this the moment the war started to turn? Would you have kept fighting if you were on the losing side?",
            intermediate: "The summer of 1863 \u2014 Vicksburg, Gettysburg, and Chickamauga \u2014 was the war's turning point. The Confederacy was split in two and suffered its worst defeat, yet won one last major victory at Chickamauga. What made these battles decisive? Consider both the military results and the human cost.",
            advanced: "July 1863 represents the war's strategic inflection point. Vicksburg split the Confederacy. Gettysburg ended Lee's offensive capacity. Yet Chickamauga proved the war was far from over. Analyze how these battles collectively transformed the war's trajectory, and examine the ethical questions they raise: civilian suffering at Vicksburg, the futility of Pickett's Charge, and the role of chance at Chickamauga."
        },
        teacherTip: {
            beginner: "What was different about the war before and after these battles? Try comparing who was winning before to who was winning after.",
            intermediate: "A 'turning point' doesn't mean the war was over \u2014 Chickamauga proved that. What changed strategically, and what stayed the same? Think about both sides.",
            advanced: "Interrogate the concept of 'turning point.' Was it the military outcomes, political consequences, or psychological impact that mattered most? Argue your position with evidence."
        }
    },
    {
        theme: "The War's Legacy",
        battleRange: 'Wilderness, Atlanta, Sherman\'s March, and Appomattox',
        prompt: {
            beginner: "The last four battles show how the war ended \u2014 and raise big questions about what came next. Grant kept fighting no matter the cost. Sherman destroyed homes and farms. Then Grant let the Confederates go home in peace, and Lincoln was killed five days later. Was the way the war ended fair? What should happen after a war this terrible?",
            intermediate: "The war's final chapter raises questions that still matter today. Grant's relentless strategy, Sherman's total war, and the generous surrender terms all shaped what came next. Was Grant a hero or a butcher? Was Sherman's destruction justified? How did Lincoln's assassination change Reconstruction?",
            advanced: "The war's endgame crystallizes its most enduring moral questions. Grant accepted devastating casualties for strategic objectives. Sherman deliberately targeted civilian infrastructure. Appomattox embodied reconciliation \u2014 yet Lincoln's assassination five days later derailed that vision. Evaluate the ethical frameworks at work and the tension between reconciliation and justice for four million freed people. How do these unresolved tensions continue to shape American society?"
        },
        teacherTip: {
            beginner: "Think about different people \u2014 a Union soldier, a freed person, a Southern family. How would each of them answer: 'Was the war worth it?'",
            intermediate: "Consider the tension between ending the war quickly and ending it fairly. Were the surrender terms fair to everyone, including the four million freed people?",
            advanced: "How do the decisions from 1864\u20131865 still affect American society? Think about the relationship between the generous surrender terms and the failures of Reconstruction."
        }
    }
];

function getReflectionGroupIndex(battleIndex) {
    if (battleIndex <= 2) return 0;
    if (battleIndex <= 5) return 1;
    if (battleIndex <= 8) return 2;
    return 3;
}

function isReflectionBattle(battleIndex) {
    return reflectionBattles.indexOf(battleIndex) !== -1;
}

function renderHistoricalBattle() {
    var content = getHistoricalContent();
    narrativeStep = 0;
    wwydSelected = -1;

    // Progress
    document.getElementById('historicalProgressLabel').textContent =
        'Battle ' + content.battleNumber + ' of ' + content.totalBattles;
    document.getElementById('historicalProgressFill').style.width =
        (content.battleNumber / content.totalBattles * 100) + '%';

    // Step pills - dynamic based on whether this battle has a reflection
    var stepPillsEl = document.getElementById('stepPills');
    if (isReflectionBattle(gameState.currentBattle)) {
        stepPillsEl.innerHTML =
            '<span class="step-pill active">1. Briefing</span>' +
            '<span class="step-pill">2. Your Call</span>' +
            '<span class="step-pill">3. What Happened</span>' +
            '<span class="step-pill">4. Reflect</span>';
    } else {
        stepPillsEl.innerHTML =
            '<span class="step-pill active">1. Briefing</span>' +
            '<span class="step-pill">2. Your Call</span>' +
            '<span class="step-pill">3. What Happened</span>';
    }
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
    // Reset tabs to show artwork by default; hide Map tab if no map
    var histTabs = document.querySelectorAll('#historicalScreen .visual-tab');
    histTabs.forEach(function(tab) { tab.classList.remove('active'); });
    if (histTabs[0]) histTabs[0].classList.add('active');
    document.getElementById('histArtwork').style.display = 'block';
    document.getElementById('histMap').style.display = 'none';
    var battle = battles[gameState.currentBattle];
    var assets = getAssetManifest();
    var asset = assets.find(function(a) { return a.id === battle.id; }) || assets[gameState.currentBattle];
    var mapTab = document.querySelector('#historicalScreen .visual-tab[data-tab="map"]');
    if (mapTab) mapTab.style.display = (asset && asset.mapUrl) ? '' : 'none';

    // --- Difficulty-based section visibility ---
    var difficulty = gameState.difficulty || 'intermediate';

    // --- Section 1: Intel Report ---
    // Beginner: hide Intel grid (situation text covers what they need)
    var intelSection = document.getElementById('sectionIntel');
    var intelGrid = document.getElementById('histIntelGrid');
    if (difficulty === 'beginner') {
        if (intelSection) intelSection.style.display = 'none';
    } else {
        if (intelSection) intelSection.style.display = '';
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
    }

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
    // Tech Spotlight: hide at beginner to reduce cognitive load
    var techBox = document.getElementById('histTechBox');
    if (techBox) techBox.style.display = (difficulty === 'beginner') ? 'none' : '';

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

    // Key Fact: hide entire box at beginner level to reduce reading
    var keyFactEl = document.getElementById('histKeyFact');
    var keyFactBox = keyFactEl ? keyFactEl.closest('.key-fact-box') : null;
    if (difficulty === 'beginner') {
        if (keyFactBox) keyFactBox.style.display = 'none';
    } else {
        keyFactEl.textContent = content.keyFact;
        if (keyFactBox) keyFactBox.style.display = '';
    }

    // Perspectives: only show at advanced level
    var perspectivesEl = document.getElementById('histPerspectives');
    if (difficulty === 'advanced' && content.perspectives && content.perspectives.length > 0) {
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
    // Intel already hidden at beginner via difficulty logic above
    if (difficulty !== 'beginner') document.getElementById('sectionIntel').style.display = 'block';
    document.getElementById('sectionSituation').style.display = 'block';
    document.getElementById('sectionWWYD').style.display = 'none';
    document.getElementById('wwydFeedback').style.display = 'none';
    document.getElementById('sectionHappened').style.display = 'none';
    document.getElementById('sectionVoice').style.display = 'none';
    document.getElementById('sectionBigPicture').style.display = 'none';
    document.getElementById('sectionReflect').style.display = 'none';
    document.getElementById('teacherTip').style.display = 'none';

    // Button text
    document.getElementById('narrativeContinueBtn').textContent = 'Continue';
    document.getElementById('narrativeContinueBtn').disabled = false;

    showScreen('historicalScreen');
    showGameActions(true);
    showCampaignLogBtn(true);

    // Show tutorial on first battle only
    if (gameState.currentBattle === 0) {
        maybeStartTutorial('historical');
    }
}

function selectWwydOption(idx) {
    wwydSelected = idx;

    // Highlight selected, dim others (reset first so re-selection works)
    var buttons = document.querySelectorAll('#histWWYDOptions .wwyd-option-btn');
    buttons.forEach(function(btn, i) {
        btn.classList.remove('selected', 'dimmed');
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

// ============================================================
// Reflection Scaffolding (Sentence Starters / RACE Reminder)
// ============================================================

var reflectionStarters = {
    beginner: [
        'I think this is important because...',
        'This makes me wonder...',
        'One thing that surprised me was...',
        'If I were there, I would have...',
        'I agree / disagree because...',
        'This reminds me of...'
    ],
    intermediate: [
        'I think...',
        'This shows that...',
        'One reason is...',
        'In my opinion...',
        'The evidence suggests...'
    ]
};

function showReflectScaffolding() {
    var scaffolding = document.getElementById('reflectScaffolding');
    var chipSection = document.getElementById('starterChips');
    var chipList = document.getElementById('starterChipList');
    var raceReminder = document.getElementById('raceReminder');
    var starterLabel = document.getElementById('starterLabel');

    if (!scaffolding) return;

    var difficulty = gameState.difficulty || 'intermediate';

    if (difficulty === 'beginner' || difficulty === 'intermediate') {
        var starters = reflectionStarters[difficulty] || reflectionStarters.intermediate;

        chipList.innerHTML = '';
        starters.forEach(function(text) {
            var chip = document.createElement('button');
            chip.className = 'starter-chip';
            chip.type = 'button';
            chip.textContent = text;
            chip.addEventListener('click', function() {
                insertStarter(text, chip);
            });
            chipList.appendChild(chip);
        });

        starterLabel.textContent = difficulty === 'beginner'
            ? 'Click a sentence starter to begin:'
            : 'Need help getting started?';

        chipSection.style.display = 'block';
        raceReminder.style.display = 'none';
    } else {
        // Advanced: show RACE reminder
        chipSection.style.display = 'none';
        raceReminder.style.display = 'block';
    }

    scaffolding.style.display = 'block';
}

function insertStarter(text, chipEl) {
    var textarea = document.getElementById('histReflectInput');
    if (!textarea) return;

    // Only insert if textarea is empty or has just a starter
    if (textarea.value.trim() === '' || textarea.value.trim().endsWith('...')) {
        textarea.value = text + ' ';
    } else {
        // Append on a new line if there's already content
        textarea.value = textarea.value + '\n' + text + ' ';
    }

    textarea.focus();
    // Move cursor to end
    textarea.selectionStart = textarea.value.length;
    textarea.selectionEnd = textarea.value.length;

    // Mark chip as used
    if (chipEl) chipEl.classList.add('used');
}

// ============================================================
// Grouped Reflection Display
// ============================================================

function showGroupedReflection() {
    var groupIdx = getReflectionGroupIndex(gameState.currentBattle);
    var group = groupedReflections[groupIdx];

    // Build battle review buttons for this group's battles
    buildBattleReview(groupIdx);

    // Set the themed reflection prompt
    var promptEl = document.getElementById('histReflectPrompt');
    promptEl.innerHTML =
        '<span class="reflect-theme">' + escapeHtml(group.theme) + '</span><br>' +
        '<span class="reflect-battles">Thinking across: ' + escapeHtml(group.battleRange) + '</span><br><br>' +
        escapeHtml(getContent(group.prompt));

    // Clear textarea
    document.getElementById('histReflectInput').value = '';

    // Show teacher tip
    var tipSection = document.getElementById('teacherTip');
    var tipText = document.getElementById('teacherTipText');
    var tipContent = document.getElementById('teacherTipContent');
    var tipToggle = document.getElementById('teacherTipToggle');
    if (tipSection && tipText) {
        tipText.textContent = getContent(group.teacherTip);
        tipSection.style.display = 'block';
        tipContent.style.display = 'none';
        tipToggle.setAttribute('aria-expanded', 'false');
    }
}

function toggleTeacherTip() {
    var tipContent = document.getElementById('teacherTipContent');
    var tipToggle = document.getElementById('teacherTipToggle');
    if (!tipContent || !tipToggle) return;

    var expanded = tipToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
        tipContent.style.display = 'none';
        tipToggle.setAttribute('aria-expanded', 'false');
    } else {
        tipContent.style.display = 'block';
        tipToggle.setAttribute('aria-expanded', 'true');
    }
}

// ============================================================
// Battle Review (quick recap buttons in reflection screens)
// ============================================================

function buildBattleReview(groupIdx) {
    var reviewSection = document.getElementById('battleReview');
    var buttonsEl = document.getElementById('battleReviewButtons');
    var panelEl = document.getElementById('battleReviewPanel');
    if (!reviewSection || !buttonsEl || !panelEl) return;

    // Determine battle range for this reflection group
    var ranges = [[0, 2], [3, 5], [6, 8], [9, 12]];
    var range = ranges[groupIdx] || [0, 2];
    var startIdx = range[0];
    var endIdx = range[1];

    buttonsEl.innerHTML = '';
    panelEl.style.display = 'none';
    panelEl.innerHTML = '';

    for (var i = startIdx; i <= endIdx; i++) {
        var battle = battles[i];
        if (!battle) continue;
        var btn = document.createElement('button');
        btn.className = 'battle-review-btn';
        btn.textContent = battle.name.replace('Battle of ', '').replace('Siege of ', '');
        btn.setAttribute('data-battle-idx', i);
        btn.addEventListener('click', (function(idx) {
            return function() {
                toggleBattleReviewPanel(idx, groupIdx);
            };
        })(i));
        buttonsEl.appendChild(btn);
    }

    reviewSection.style.display = 'block';
}

function toggleBattleReviewPanel(battleIdx, groupIdx) {
    var panelEl = document.getElementById('battleReviewPanel');
    var buttons = document.querySelectorAll('.battle-review-btn');
    if (!panelEl) return;

    // If clicking the same battle, toggle off
    if (panelEl.getAttribute('data-showing') === String(battleIdx) && panelEl.style.display === 'block') {
        panelEl.style.display = 'none';
        panelEl.removeAttribute('data-showing');
        buttons.forEach(function(b) { b.classList.remove('active'); });
        return;
    }

    // Highlight active button
    buttons.forEach(function(b) {
        b.classList.toggle('active', b.getAttribute('data-battle-idx') === String(battleIdx));
    });

    var battle = battles[battleIdx];
    var h = battle.historical;

    // Get what happened text (difficulty-resolved)
    var whatHappened = getContent(h.whatHappened);
    var outcome = h.outcome;

    // Find student's response for this battle
    var response = null;
    for (var i = 0; i < gameState.responses.length; i++) {
        if (gameState.responses[i].battleId === battle.id) {
            response = gameState.responses[i];
            break;
        }
    }

    var html = '<div class="review-panel-title">' + escapeHtml(battle.name) +
        ' <span class="review-panel-date">' + escapeHtml(battle.date) + '</span></div>';

    // Student's choice
    if (response) {
        var matchClass = response.wwydMatchedHistory ? 'badge-match' : 'badge-different';
        var matchText = response.wwydMatchedHistory ? 'Matched history' : 'Different path';
        html += '<div class="review-choice">' +
            '<span class="review-choice-label">Your call:</span> ' +
            escapeHtml(response.wwydChoice) +
            ' <span class="review-badge ' + matchClass + '">' + matchText + '</span>' +
            '</div>';
    }

    // What happened summary
    html += '<div class="review-happened">' +
        '<span class="review-happened-label">What happened:</span> ' +
        escapeHtml(whatHappened) +
        '</div>';
    html += '<div class="review-outcome">' + escapeHtml(outcome) + '</div>';

    panelEl.innerHTML = html;
    panelEl.setAttribute('data-showing', String(battleIdx));
    panelEl.style.display = 'block';
}

// ============================================================
// Tutorial / Guided Help System
// ============================================================

var tutorialSteps = {
    historical: [
        {
            target: '.battle-visuals',
            text: 'This is the battle artwork. You can switch between the painting and a tactical battle map using the tabs above it.',
            position: 'below'
        },
        {
            target: '#sectionIntel',
            fallback: '#sectionSituation',
            text: 'This section gives you background on the battle \u2014 the forces, commanders, and advantages on each side. Read it to understand what both sides are facing.',
            position: 'below'
        },
        {
            target: '#sectionSituation',
            text: 'The Situation puts you in the shoes of your chosen side. Read carefully \u2014 you\'ll need to make a decision next!',
            position: 'below'
        },
        {
            target: '#narrativeContinueBtn',
            text: 'Click Continue to move through the steps of each battle. The pills at the top show which step you\'re on.',
            position: 'above'
        },
        {
            target: '.step-pills',
            text: 'These show your progress through each battle: Briefing \u2192 Your Call \u2192 What Happened \u2192 Reflect. You\'ll do this for all 13 battles!',
            position: 'below'
        }
    ],
    freeplay: [
        {
            target: '.battle-visuals',
            text: 'Each battle has artwork and a tactical map. Use the map to help plan your strategy!',
            position: 'below'
        },
        {
            target: '.strategy-cards',
            text: 'Choose one of three strategies for each battle. Each has different strengths \u2014 read the details before picking.',
            position: 'below'
        },
        {
            target: '.momentum-display',
            text: 'Your momentum builds with victories and drops with defeats. Higher momentum gives you a power bonus in future battles!',
            position: 'below'
        }
    ]
};

var helpTips = {
    historical: [
        'Read the intel report and situation, then click Continue.',
        'Choose what YOU would do \u2014 pick an option, then click Continue.',
        'Read what really happened, the primary source quote, and the bigger picture. Take your time!',
        'Write your reflection using the prompt. Use the sentence starters if you need help getting started.'
    ],
    freeplay: [
        'Choose a strategy for this battle. Consider the terrain, your momentum, and the difficulty.'
    ]
};

var currentTutorialStep = 0;
var currentTutorialMode = '';
var previousHighlight = null;

function shouldShowTutorial(mode) {
    var key = 'civilWarTutorial_' + mode;
    return !localStorage.getItem(key);
}

function markTutorialDone(mode) {
    var key = 'civilWarTutorial_' + mode;
    localStorage.setItem(key, 'done');
}

function startTutorial(mode) {
    currentTutorialMode = mode;
    currentTutorialStep = 0;

    var steps = tutorialSteps[mode];
    if (!steps || steps.length === 0) return;

    document.getElementById('tutorialOverlay').style.display = 'block';
    showTutorialStep();
}

function showTutorialStep() {
    var steps = tutorialSteps[currentTutorialMode];
    if (currentTutorialStep >= steps.length) {
        endTutorial();
        return;
    }

    var step = steps[currentTutorialStep];
    var target = document.querySelector(step.target);

    // Try fallback target if primary isn't visible
    if ((!target || target.offsetParent === null || target.style.display === 'none') && step.fallback) {
        target = document.querySelector(step.fallback);
    }

    // Remove previous highlight
    if (previousHighlight) {
        previousHighlight.classList.remove('tutorial-highlight');
    }

    // Update step count
    document.getElementById('tutorialStepCount').textContent =
        'Step ' + (currentTutorialStep + 1) + ' of ' + steps.length;

    // Update text
    document.getElementById('tutorialText').textContent = step.text;

    // Update button text
    var nextBtn = document.getElementById('tutorialNext');
    nextBtn.textContent = (currentTutorialStep === steps.length - 1) ? 'Got It!' : 'Next';

    if (target && target.offsetParent !== null) {
        // Highlight element
        target.classList.add('tutorial-highlight');
        previousHighlight = target;

        // Scroll into view
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Position tooltip near target
        setTimeout(function() {
            positionTooltip(target, step.position || 'below');
        }, 300);
    } else {
        // No visible target - center tooltip
        previousHighlight = null;
        var tooltip = document.getElementById('tutorialTooltip');
        tooltip.style.top = '50%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translate(-50%, -50%)';
    }
}

function positionTooltip(target, position) {
    var tooltip = document.getElementById('tutorialTooltip');
    var rect = target.getBoundingClientRect();
    var tooltipRect = tooltip.getBoundingClientRect();
    var margin = 12;

    tooltip.style.transform = 'none';

    var left = Math.max(margin, Math.min(
        rect.left + (rect.width / 2) - (tooltipRect.width / 2),
        window.innerWidth - tooltipRect.width - margin
    ));

    if (position === 'above') {
        var top = rect.top - tooltipRect.height - margin;
        if (top < margin) top = rect.bottom + margin;
        tooltip.style.top = top + 'px';
    } else {
        var top = rect.bottom + margin;
        if (top + tooltipRect.height > window.innerHeight - margin) {
            top = rect.top - tooltipRect.height - margin;
        }
        tooltip.style.top = top + 'px';
    }

    tooltip.style.left = left + 'px';
}

function nextTutorialStep() {
    currentTutorialStep++;
    showTutorialStep();
}

function endTutorial() {
    document.getElementById('tutorialOverlay').style.display = 'none';

    if (previousHighlight) {
        previousHighlight.classList.remove('tutorial-highlight');
        previousHighlight = null;
    }

    markTutorialDone(currentTutorialMode);
    showHelpBar(currentTutorialMode);
}

// Help Bar (persistent, toggleable)
var helpBarVisible = false;

function showHelpBar(mode) {
    var bar = document.getElementById('helpBar');
    var btn = document.getElementById('helpToggleBtn');

    btn.style.display = '';
    helpBarVisible = true;
    bar.style.display = 'flex';
    btn.classList.add('active');

    updateHelpBarText(mode, narrativeStep);
}

function hideHelpBar() {
    var bar = document.getElementById('helpBar');
    var btn = document.getElementById('helpToggleBtn');

    helpBarVisible = false;
    bar.style.display = 'none';
    btn.classList.remove('active');
}

function toggleHelpBar() {
    if (helpBarVisible) {
        hideHelpBar();
    } else {
        var mode = gameState.mode || 'historical';
        showHelpBar(mode);
    }
}

function updateHelpBarText(mode, step) {
    var tips = helpTips[mode] || helpTips.historical;
    var text = tips[Math.min(step, tips.length - 1)] || tips[0];
    var el = document.getElementById('helpBarText');
    if (el) el.textContent = text;
}

// Initialize tutorial on first battle
function maybeStartTutorial(mode) {
    var btn = document.getElementById('helpToggleBtn');
    btn.style.display = '';

    if (shouldShowTutorial(mode)) {
        setTimeout(function() { startTutorial(mode); }, 600);
    } else if (helpBarVisible) {
        updateHelpBarText(mode, narrativeStep);
    }
}

function advanceNarrative() {
    var continueBtn = document.getElementById('narrativeContinueBtn');

    // FLOW: 3 steps for most battles, 4 steps for reflection battles
    // Step 0: Briefing (Intel + Situation shown)
    // Step 1: Your Call (WWYD - blocks until selection)
    // Step 2: What Happened (feedback + outcome + tech + voice + bigger picture)
    //   Non-reflection: button says "Next Battle", case 3 saves & advances
    //   Reflection: button says "Continue", case 3 shows grouped reflection
    // Step 3: Reflect (grouped prompt, only on battles 3, 6, 9, 13)
    // Step 4: Save & advance (reflection battles only)

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

            // Show redesigned WWYD feedback with choice comparison
            var feedbackEl = document.getElementById('wwydFeedback');
            var content = getHistoricalContent();
            var feedbackList = content.whatWouldYouDo.feedback;
            var optionsList = content.whatWouldYouDo.options;

            if (feedbackList && Array.isArray(feedbackList) && wwydSelected >= 0 && feedbackList[wwydSelected]) {
                // Show student's choice
                var choiceTextEl = document.getElementById('feedbackChoiceText');
                if (choiceTextEl) choiceTextEl.textContent = optionsList[wwydSelected] || '';

                // Comparison badge + historical decision
                var badge = document.getElementById('feedbackBadge');
                var histSection = document.getElementById('feedbackHistorical');
                if (badge && histSection) {
                    if (wwydSelected === 0) {
                        // Matches the historical decision
                        var commanderRaw = battles[gameState.currentBattle].historical.intel[gameState.side].commander;
                        var commander = (typeof commanderRaw === 'string') ? commanderRaw : getContent(commanderRaw);
                        commander = String(commander).split('(')[0].split(',')[0].trim();
                        badge.className = 'feedback-badge badge-match';
                        badge.textContent = '\u2714 Same call as ' + commander;
                        histSection.style.display = 'none';
                    } else {
                        // Different from history
                        badge.className = 'feedback-badge badge-different';
                        badge.textContent = '\u2194 You chose a different path';
                        var histTextEl = document.getElementById('feedbackHistoricalText');
                        if (histTextEl) histTextEl.textContent = optionsList[0] || '';
                        histSection.style.display = 'block';
                    }
                }

                // Detailed feedback text
                var detailEl = document.getElementById('feedbackDetail');
                if (detailEl) detailEl.textContent = feedbackList[wwydSelected];
                feedbackEl.style.display = 'block';
                targetSection = feedbackEl;
            }

            // Progressive reveal: stagger the three sections
            var happened = document.getElementById('sectionHappened');
            var voice = document.getElementById('sectionVoice');
            var bigPicture = document.getElementById('sectionBigPicture');

            // Remove old stagger classes before re-applying
            [happened, voice, bigPicture].forEach(function(el) {
                el.classList.remove('reveal-stagger', 'reveal-stagger-1', 'reveal-stagger-2', 'reveal-stagger-3', 'reveal-stagger-4');
            });

            var staggerIdx = 1;
            if (feedbackEl.style.display === 'block') {
                feedbackEl.classList.add('reveal-stagger', 'reveal-stagger-1');
                staggerIdx = 2;
            }

            happened.classList.add('reveal-stagger', 'reveal-stagger-' + staggerIdx);
            happened.style.display = 'block';
            if (!targetSection) targetSection = happened;

            voice.classList.add('reveal-stagger', 'reveal-stagger-' + (staggerIdx + 1));
            voice.style.display = 'block';

            bigPicture.classList.add('reveal-stagger', 'reveal-stagger-' + (staggerIdx + 2));
            bigPicture.style.display = 'block';

            // At beginner: collapse Voice and Bigger Picture to reduce wall-of-text
            var isBeginner = (gameState.difficulty === 'beginner');
            setupCollapsibleSection('voiceHeading', 'voiceBody', !isBeginner);
            setupCollapsibleSection('bigPictureHeading', 'bigPictureBody', !isBeginner);

            // Set button text: if no reflection follows, go straight to next battle
            if (!isReflectionBattle(gameState.currentBattle)) {
                var isLast = gameState.currentBattle >= battles.length - 1;
                continueBtn.textContent = isLast ? 'Complete Historical Mode' : 'Next Battle \u2192';
            }
            break;

        case 3:
            if (isReflectionBattle(gameState.currentBattle)) {
                // Show grouped reflection
                updateStepPills(3);
                targetSection = document.getElementById('sectionReflect');
                targetSection.style.display = 'block';
                showGroupedReflection();
                showReflectScaffolding();
                var isLast = gameState.currentBattle >= battles.length - 1;
                continueBtn.textContent = isLast ? 'Complete Historical Mode' : 'Next Battle \u2192';
            } else {
                // No reflection for this battle - save WWYD choice and advance
                var wwydChoiceText = '';
                if (wwydSelected >= 0) {
                    var c = getHistoricalContent();
                    var opts = c.whatWouldYouDo.options;
                    if (opts && opts[wwydSelected]) wwydChoiceText = opts[wwydSelected];
                }
                saveHistoricalResponse(wwydChoiceText, '', wwydSelected);
                var done = advanceHistorical();
                if (done) renderHistoricalComplete();
                else renderHistoricalBattle();
                return;
            }
            break;

        case 4:
            // Save response and advance to next battle (reflection battles only)
            var wwydChoiceText = '';
            if (wwydSelected >= 0) {
                var content = getHistoricalContent();
                var opts = content.whatWouldYouDo.options;
                if (opts && opts[wwydSelected]) {
                    wwydChoiceText = opts[wwydSelected];
                }
            }
            var reflectionText = document.getElementById('histReflectInput').value.trim();
            saveHistoricalResponse(wwydChoiceText, reflectionText, wwydSelected);

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

    // Update help bar tip for current step
    if (helpBarVisible) {
        updateHelpBarText('historical', narrativeStep);
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

    // Hide scoreboard and class leaderboard for historical mode
    document.getElementById('scoreboardSection').style.display = 'none';
    document.getElementById('classLeaderboardSection').style.display = 'none';

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
        '.match-badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 0.85em; font-weight: bold; margin-left: 8px; }' +
        '.match-badge.matched { background: #d1fae5; color: #065f46; }' +
        '.match-badge.different { background: #fef3c7; color: #92400e; }' +
        '.summary-box { background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 6px; padding: 12px 16px; margin-bottom: 20px; text-align: center; }' +
        '.summary-stat { display: inline-block; margin: 0 16px; }' +
        '.summary-stat strong { font-size: 1.3em; display: block; }' +
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
        // Summary box: count matches vs. different
        var matchCount = 0;
        var totalChoices = 0;
        responses.forEach(function(resp) {
            if (resp.wwydChoice) {
                totalChoices++;
                if (resp.wwydMatchedHistory) matchCount++;
            }
        });

        if (totalChoices > 0) {
            html += '<div class="summary-box">';
            html += '<div class="summary-stat"><strong>' + totalChoices + '</strong>Decisions Made</div>';
            html += '<div class="summary-stat"><strong>' + matchCount + '</strong>Matched History</div>';
            html += '<div class="summary-stat"><strong>' + (totalChoices - matchCount) + '</strong>Chose Differently</div>';
            html += '</div>';
        }

        responses.forEach(function(resp, i) {
            html += '<div class="battle-entry">';
            html += '<h2>Battle ' + (i + 1) + ': ' + escapeHtml(resp.battleName || resp.battleId || 'Unknown') + '</h2>';

            html += '<span class="label">What Would You Do?';
            if (resp.wwydChoice) {
                if (resp.wwydMatchedHistory) {
                    html += ' <span class="match-badge matched">&#x2714; Same as history</span>';
                } else {
                    html += ' <span class="match-badge different">&#x2194; Different path</span>';
                }
            }
            html += '</span>';

            if (resp.wwydChoice) {
                html += '<div class="response-text">' + escapeHtml(resp.wwydChoice) + '</div>';
            } else {
                html += '<div class="response-text no-response">No choice recorded</div>';
            }

            // Only show reflection for battles that had a reflection prompt
            if (resp.reflectionText) {
                var groupIdx = getReflectionGroupIndex(i);
                var group = groupedReflections[groupIdx];
                html += '<span class="label">Reflection: ' + escapeHtml(group.theme) + ' (' + escapeHtml(group.battleRange) + ')</span>';
                html += '<div class="response-text">' + escapeHtml(resp.reflectionText) + '</div>';
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

    // Show tutorial on first battle only
    if (gameState.currentBattle === 0) {
        maybeStartTutorial('freeplay');
    }
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

    // Historical context
    var histContextBox = document.getElementById('histContextBox');
    if (histContextBox) {
        var battleData = battles[gameState.currentBattle];
        var histOutcome = battleData.historical.outcome;
        var histWinner = battleData.historical.winner;
        var winnerLabel = histWinner === 'union' ? 'Union' : histWinner === 'confederacy' ? 'Confederate' : 'Draw';

        document.getElementById('histContextText').textContent = getContent(battleData.historical.whatHappened);
        document.getElementById('histContextOutcome').textContent =
            'Historical result: ' + histOutcome + ' (' + winnerLabel + ' victory)';
        histContextBox.style.display = 'block';
    }

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
// Scoreboard UI (Local + Firebase Class Leaderboard)
// ============================================================

function renderScoreboardSection() {
    var container = document.getElementById('scoreboardSection');
    if (!container) return;

    var scoreboard = getScoreboard();

    container.innerHTML =
        '<div class="scoreboard-entry-form" id="scoreEntryForm">' +
        '<h3 class="scoreboard-form-title">&#x1F3C6; Save Your Score</h3>' +
        '<div class="scoreboard-input-row">' +
        '<input type="text" id="playerNameInput" class="player-name-input" ' +
        'placeholder="Enter your name (e.g. first name + last initial)" ' +
        'maxlength="20" aria-label="Your name for the scoreboard">' +
        '<button class="save-score-btn" id="saveScoreBtn">Save Score</button>' +
        '</div></div>' +
        '<div class="scoreboard-table-wrapper">' +
        '<h3 class="scoreboard-title">&#x1F4CA; Device Leaderboard</h3>' +
        renderScoreboardTable(scoreboard) +
        (scoreboard.length > 0 ? '<button class="clear-scores-btn" id="clearScoresBtn">Clear All Scores</button>' : '') +
        '</div>';

    wireUpScoreboardEvents();

    // Show class leaderboard section
    showClassLeaderboard();
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
                '<p class="score-saved-msg">&#x2705; Score saved locally!</p>';
            document.querySelector('.scoreboard-table-wrapper').innerHTML =
                '<h3 class="scoreboard-title">&#x1F4CA; Device Leaderboard</h3>' +
                renderScoreboardTable(updated) +
                '<button class="clear-scores-btn" id="clearScoresBtn">Clear All Scores</button>';
            wireUpClearButton();

            // Also submit to Firebase if room code is active
            submitToClassLeaderboard(name);
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
            if (confirm('Clear all scores from the device leaderboard?')) {
                clearScoreboard();
                document.querySelector('.scoreboard-table-wrapper').innerHTML =
                    '<h3 class="scoreboard-title">&#x1F4CA; Device Leaderboard</h3>' +
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

// ============================================================
// Class Leaderboard (Firebase)
// ============================================================

function showClassLeaderboard() {
    var section = document.getElementById('classLeaderboardSection');
    if (!section) return;

    section.style.display = 'block';

    var savedCode = firebaseLeaderboard.getSavedRoomCode();
    if (savedCode && firebaseLeaderboard.isAvailable()) {
        // Already joined a room - show leaderboard directly
        showJoinedRoom(savedCode);
    } else {
        // Show room code entry form
        document.getElementById('roomCodeForm').style.display = 'block';
        document.getElementById('classLeaderboardDisplay').style.display = 'none';

        // Pre-fill saved code if any
        var input = document.getElementById('roomCodeInput');
        if (input && savedCode) input.value = savedCode;

        if (!firebaseLeaderboard.isAvailable()) {
            var errorEl = document.getElementById('roomCodeError');
            if (errorEl) {
                errorEl.textContent = 'Class leaderboard requires an internet connection.';
                errorEl.style.display = 'block';
            }
        }
    }
}

function joinRoom() {
    var input = document.getElementById('roomCodeInput');
    var errorEl = document.getElementById('roomCodeError');
    var joinBtn = document.getElementById('roomCodeJoinBtn');
    if (!input) return;

    var code = input.value.toUpperCase().trim();
    if (!code) {
        input.focus();
        input.style.borderColor = '#dc2626';
        return;
    }

    joinBtn.disabled = true;
    joinBtn.textContent = 'Checking...';
    errorEl.style.display = 'none';

    firebaseLeaderboard.validateRoom(code, function(valid, errMsg) {
        joinBtn.disabled = false;
        joinBtn.textContent = 'Join';

        if (valid) {
            firebaseLeaderboard.saveRoomCode(code);
            showJoinedRoom(code);
        } else {
            errorEl.textContent = errMsg;
            errorEl.style.display = 'block';
            input.style.borderColor = '#dc2626';
        }
    });
}

function showJoinedRoom(roomCode) {
    document.getElementById('roomCodeForm').style.display = 'none';
    document.getElementById('classLeaderboardDisplay').style.display = 'block';
    document.getElementById('classRoomCodeLabel').textContent = roomCode;

    var statusEl = document.getElementById('classLeaderboardStatus');
    statusEl.textContent = 'Loading class scores...';

    firebaseLeaderboard.loadLeaderboard(roomCode, function(entries, errMsg) {
        if (entries) {
            statusEl.textContent = '';
            renderClassLeaderboardTable(entries);
        } else {
            statusEl.textContent = errMsg || 'Could not load leaderboard.';
        }
    });
}

function leaveRoom() {
    firebaseLeaderboard.clearRoomCode();
    document.getElementById('roomCodeForm').style.display = 'block';
    document.getElementById('classLeaderboardDisplay').style.display = 'none';
    document.getElementById('roomCodeInput').value = '';
    document.getElementById('roomCodeError').style.display = 'none';
}

function submitToClassLeaderboard(playerName) {
    var roomCode = firebaseLeaderboard.getSavedRoomCode();
    if (!roomCode || !firebaseLeaderboard.isAvailable()) return;

    var scoreData = {
        name: playerName,
        score: gameState.score,
        side: gameState.side,
        wins: gameState.wins,
        losses: gameState.losses,
        momentum: gameState.momentum,
        victory: gameState.momentum > 0 || (gameState.momentum === 0 && gameState.wins > gameState.losses)
    };

    firebaseLeaderboard.submitScore(roomCode, scoreData, function(success, errMsg) {
        if (success) {
            // Refresh the class leaderboard display
            showJoinedRoom(roomCode);
        }
    });
}

function renderClassLeaderboardTable(entries) {
    var wrapper = document.getElementById('classLeaderboardTable');
    if (!wrapper) return;

    if (!entries || entries.length === 0) {
        wrapper.innerHTML = '<p class="scoreboard-empty">No class scores yet. Save your score above to be the first!</p>';
        return;
    }

    var rows = entries.map(function(entry, i) {
        var medal = i === 0 ? '&#x1F947;' : i === 1 ? '&#x1F948;' : i === 2 ? '&#x1F949;' : (i + 1);
        var sideIcon = entry.side === 'union' ? '&#x1F1FA;&#x1F1F8;' : '&#x1F3F4;';
        var victoryIcon = entry.victory ? '&#x2705;' : '&#x274C;';
        return '<tr class="scoreboard-row' + (i < 3 ? ' top-three' : '') + '">' +
            '<td class="rank-cell">' + medal + '</td>' +
            '<td class="name-cell">' + escapeHtml(String(entry.name || 'Anonymous')) + '</td>' +
            '<td class="score-cell">' + (entry.score || 0).toLocaleString() + '</td>' +
            '<td class="side-cell">' + sideIcon + '</td>' +
            '<td class="record-cell">' + (entry.wins || 0) + 'W-' + (entry.losses || 0) + 'L</td>' +
            '<td class="victory-cell">' + victoryIcon + '</td>' +
            '</tr>';
    }).join('');

    wrapper.innerHTML = '<table class="scoreboard-table"><thead><tr>' +
        '<th>#</th><th>Name</th><th>Score</th><th>Side</th><th>Record</th><th>Won?</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table>';
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================================
// Collapsible Sections (used to reduce wall-of-text at beginner)
// ============================================================

function setupCollapsibleSection(headingId, bodyId, startExpanded) {
    var heading = document.getElementById(headingId);
    var body = document.getElementById(bodyId);
    if (!heading || !body) return;

    // Remove previous listener by cloning
    var newHeading = heading.cloneNode(true);
    heading.parentNode.replaceChild(newHeading, heading);

    var icon = newHeading.querySelector('.collapse-icon');

    function setExpanded(expanded) {
        if (expanded) {
            body.style.display = '';
            newHeading.classList.remove('collapsed');
            newHeading.setAttribute('aria-expanded', 'true');
            if (icon) icon.textContent = '';
        } else {
            body.style.display = 'none';
            newHeading.classList.add('collapsed');
            newHeading.setAttribute('aria-expanded', 'false');
            if (icon) icon.textContent = '(tap to read)';
        }
    }

    setExpanded(startExpanded);
    newHeading.style.cursor = 'pointer';
    newHeading.addEventListener('click', function() {
        var isCollapsed = newHeading.classList.contains('collapsed');
        setExpanded(isCollapsed);
    });
}

// ============================================================
// Campaign Log Modal
// ============================================================

var warmapLoaded = false;

function showCampaignLog() {
    // Populate progress tab
    if (gameState.mode === 'freeplay') {
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
    } else {
        // Historical mode: show progress as battle list
        var progressContent = document.getElementById('logProgressContent');
        var summary = document.querySelector('.campaign-overview');
        if (summary) summary.style.display = 'none';

        var timeline = document.getElementById('logTimeline');
        var completedCount = gameState.responses ? gameState.responses.length : 0;
        var timelineHtml = '';
        for (var i = 0; i < battles.length; i++) {
            var isCompleted = i < completedCount;
            var isCurrent = i === gameState.currentBattle;
            var cssClass = isCompleted ? 'victory' : (isCurrent ? '' : '');
            var status = isCompleted ? '&#x2705; Complete' : (isCurrent ? '&#x25B6; Current' : '&#x23F3; Upcoming');
            timelineHtml += '<div class="timeline-item ' + cssClass + '">' +
                '<div class="timeline-battle">' + (i + 1) + '. ' + battles[i].name + '</div>' +
                '<div class="timeline-details">' + battles[i].date + ' &mdash; ' + status + '</div>' +
                '</div>';
        }
        timeline.innerHTML = timelineHtml;
    }

    // Reset to progress tab
    switchLogTab('progress');

    screens.campaignLogModal.style.display = 'block';
}

function switchLogTab(tabName) {
    var progressTab = document.getElementById('logTabProgress');
    var warMapTab = document.getElementById('logTabWarMap');
    var progressContent = document.getElementById('logProgressContent');
    var warMapContent = document.getElementById('logWarMapContent');

    if (tabName === 'warmap') {
        progressTab.classList.remove('active');
        warMapTab.classList.add('active');
        progressContent.style.display = 'none';
        warMapContent.style.display = 'block';
        loadWarMap();
    } else {
        progressTab.classList.add('active');
        warMapTab.classList.remove('active');
        progressContent.style.display = 'block';
        warMapContent.style.display = 'none';
    }
}

function loadWarMap() {
    if (warmapLoaded) return;

    var wrapper = document.getElementById('warmapFrameWrapper');
    // Check if we're likely online (file:// won't have ArcGIS access)
    if (window.location.protocol === 'file:') {
        wrapper.innerHTML = '<div class="warmap-offline-msg">The interactive war map requires an internet connection.<br>Visit the game on GitHub Pages to use this feature.</div>';
        warmapLoaded = true;
        return;
    }

    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.arcgis.com/apps/Embed/index.html?webmap=bd513e724e0e4a81b09790c6a47a072a&zoom=true&scale=true&legend=true';
    iframe.title = 'Interactive Civil War Battle Map';
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('allowfullscreen', 'true');
    wrapper.innerHTML = '';
    wrapper.appendChild(iframe);
    warmapLoaded = true;
}

function closeCampaignLog() {
    screens.campaignLogModal.style.display = 'none';
    // Restore summary visibility for next open
    var summary = document.querySelector('.campaign-overview');
    if (summary) summary.style.display = '';
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
