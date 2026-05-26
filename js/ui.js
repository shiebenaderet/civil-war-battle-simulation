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
    screens.actIntroScreen = document.getElementById('actIntroScreen');
    screens.actRecallScreen = document.getElementById('actRecallScreen');
    screens.historicalScreen = document.getElementById('historicalScreen');
    screens.freeplayBriefing = document.getElementById('freeplayBriefing');
    screens.freeplayResults = document.getElementById('freeplayResults');
    screens.campaignLogModal = document.getElementById('campaignLogModal');
    screens.endGameScreen = document.getElementById('endGameScreen');
}

// v3.14: one-time wiring for the act review overlay (close button, backdrop, ESC key).
function wireActReviewOverlay() {
    var closeBtn = document.getElementById('actReviewCloseBtn');
    var backdrop = document.getElementById('actReviewBackdrop');
    if (closeBtn) closeBtn.addEventListener('click', closeActReview);
    if (backdrop) backdrop.addEventListener('click', closeActReview);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            var overlay = document.getElementById('actReviewOverlay');
            if (overlay && overlay.style.display !== 'none') {
                closeActReview();
            }
        }
    });
}

function showScreen(screenId) {
    // v3.15: clear isInBattle when leaving historical battle
    if (typeof gameState !== 'undefined' && gameState && screenId !== 'historicalScreen') {
        gameState.isInBattle = false;
    }
    Object.values(screens).forEach(function(el) {
        if (el) el.style.display = 'none';
    });
    if (screens[screenId]) {
        screens[screenId].style.display = 'block';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // v3.15: track current screen + show/hide navbar reading pills
    if (typeof gameState !== 'undefined' && gameState) {
        gameState.currentScreen = screenId;
    }
    var preGameScreens = ['introSplash', 'modeSelection', 'sideSelection', 'leaderLetterScreen'];
    if (preGameScreens.indexOf(screenId) !== -1) {
        hideNavbarReadingPills();
    } else {
        showNavbarReadingPills();
    }

    // v3.15: "Reset This Battle" menu item — visible only mid-battle.
    if (screenId === 'historicalScreen') {
        if (typeof showResetBattleMenuItem === 'function') showResetBattleMenuItem();
    } else {
        if (typeof hideResetBattleMenuItem === 'function') hideResetBattleMenuItem();
    }
}

function showGameActions(show) {
    var section = document.getElementById('gameActionsSection');
    var divider = document.getElementById('gameActionsDiv');
    var dropdown = document.querySelector('.settings-dropdown');
    if (section) section.style.display = show ? 'block' : 'none';
    if (divider) divider.style.display = show ? 'block' : 'none';
    if (dropdown) dropdown.style.display = show ? '' : 'none';
}

function showCampaignLogBtn(show) {
    var btn = document.getElementById('campaignLogMenuBtn');
    if (btn) btn.style.display = show ? 'block' : 'none';
    var mapBtn = document.getElementById('warMapMenuBtn');
    if (mapBtn) mapBtn.style.display = show ? 'block' : 'none';
}

function showWarMapDirect() {
    showCampaignLog();
    switchLogTab('warmap');
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
        var periodSel = document.getElementById('periodSelect');
        if (periodSel) periodSel.value = '';
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
    // Capitalize first letter of first name
    if (first) first = first.charAt(0).toUpperCase() + first.slice(1);
    if (!first) return 'Student';
    return last ? first + ' ' + last + '.' : first;
}

function getPeriodFromForm() {
    var sel = document.getElementById('periodSelect');
    return sel ? (sel.value || '') : '';
}

// ============================================================
// Leader Letter Screen (Transition into Historical Mode)
// ============================================================

// Leader letter content, keyed by side and difficulty.
// Each value is an array of paragraph strings. ES paragraphs are short
// 1-3rd grade sentences. Beginner/Intermediate/Advanced share the same
// existing copy until per-tier voicing is needed.
var leaderLetterParagraphs = {
    union: {
        extra: [
            "Our country is at war. I need your help.",
            "You will visit 13 famous battles. You will see what happened. You will make choices.",
            "At each battle, you will learn what real generals had to decide. Some choices were hard. Some had a big cost.",
            "War is never easy. But we have to understand it. Our country is fighting to stay together. We are also fighting for the idea that all people are equal."
        ],
        beginner: [
            "The nation faces its gravest hour. As your President, I write to ask something of you that requires both courage and careful thought.",
            "I need you on the ground \u2014 someone who can witness the events of this war firsthand, from the first shots at Fort Sumter to whatever end Providence has in store. You will visit 13 battlefields across our divided nation.",
            "At each site, you will review the intelligence available to our commanders, weigh the decisions they faced, learn what actually happened, and hear from the people who lived through it. I ask that you record your honest thoughts at every step.",
            "This will not be easy. War never is. But understanding what happened \u2014 and why \u2014 is the duty of every citizen who wishes to preserve this Union and the idea that all people are created equal."
        ]
    },
    confederacy: {
        extra: [
            "Our new country needs your help. We are at war with the North.",
            "You will visit 13 big battles. You will see what happened on both sides.",
            "At each battle, you will see what generals had to decide. You will make some of those choices yourself.",
            "Pay close attention. The story of this war will shape our country for a long time."
        ],
        beginner: [
            "The Confederate States of America stand at a crossroads, and I require a trusted correspondent to document what unfolds on our battlefields.",
            "You will observe 13 pivotal engagements across the breadth of this war, from the first shots at Fort Sumter to the final chapter at Appomattox Court House.",
            "At each battlefield, you will study the intelligence available to commanders on both sides, consider the decisions they faced, and record your own reflections on what this war means for the people caught in its path.",
            "I ask that you witness these events honestly and completely. Your observations will be invaluable to understanding the true cost and meaning of this conflict for all who lived through it."
        ]
    }
};

function renderLeaderLetter() {
    var side = gameState.side;
    var studentName = gameState.studentName || 'Student';
    var difficulty = (typeof gameState !== 'undefined' && gameState.difficulty) || 'intermediate';

    var seal = document.getElementById('letterSeal');
    var from = document.getElementById('letterFrom');
    var date = document.getElementById('letterDate');
    var salutation = document.getElementById('letterSalutation');
    var body = document.getElementById('letterBody');
    var closing = document.getElementById('letterClosing');
    var signature = document.getElementById('letterSignature');
    var title = document.getElementById('letterTitle');

    var sideKey = (side === 'union') ? 'union' : 'confederacy';

    // Paragraph fallback chain: extra -> beginner -> intermediate -> advanced
    var sideContent = leaderLetterParagraphs[sideKey] || {};
    var paras = sideContent[difficulty] || sideContent.beginner || sideContent.intermediate ||
                sideContent.advanced || sideContent.extra || [];

    if (sideKey === 'union') {
        seal.textContent = '\uD83C\uDDFA\uD83C\uDDF8';
        from.textContent = 'Executive Mansion, Washington';
        date.textContent = 'April 1861';
        closing.textContent = 'With great confidence in your judgment,';
        signature.textContent = 'Abraham Lincoln';
        title.textContent = 'President of the United States';
    } else {
        seal.textContent = '\uD83C\uDFF4';
        from.textContent = 'Executive Office, Richmond';
        date.textContent = 'April 1861';
        closing.textContent = 'May Providence guide your journey,';
        signature.textContent = 'Jefferson Davis';
        title.textContent = 'President of the Confederate States';
    }
    salutation.textContent = 'Dear ' + studentName + ',';

    // Render paragraphs via DOM (no innerHTML \u2014 security hook + XSS-safe)
    while (body.firstChild) body.removeChild(body.firstChild);
    paras.forEach(function(text) {
        var p = document.createElement('p');
        p.textContent = text;
        body.appendChild(p);
    });

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
            extra: "You saw the first three battles. At Fort Sumter, no one died. At Bull Run, people came to watch like it was a show. At Shiloh, 23,000 soldiers were killed or hurt in two days. The war got much worse very fast. Why? What changed?",
            beginner: "You've seen the first three battles. At Fort Sumter, both sides said they were just defending themselves. At Bull Run, people thought the war would be quick. By Shiloh, thousands were dying in a single day. Why did the war get so much worse so fast? What changed between the first shots and the bloodbath at Shiloh?",
            intermediate: "From Fort Sumter through Shiloh, the war escalated from a symbolic standoff to massive bloodshed. Both sides initially expected a short war \u2014 civilians even picnicked at Bull Run. What caused this rapid escalation? How did the reality of battle change what people expected and how the war was fought?",
            advanced: "Trace the escalation from Fort Sumter's relatively bloodless standoff through Bull Run's shocking rout to Shiloh's unprecedented carnage. How did each battle reshape assumptions about the war's nature and cost? After Shiloh, Grant concluded that only 'complete conquest' could end the war \u2014 what evidence from these three battles supports or complicates that conclusion?"
        },
        teacherTip: {
            extra: "Think about what people expected before the war. Then think about Shiloh. What surprised them most?",
            beginner: "Think about what people expected before each battle vs. what actually happened. You could compare the civilians picnicking at Bull Run to the soldiers at Shiloh. What surprised people the most?",
            intermediate: "Consider how expectations changed from battle to battle. What did people assume about war at first? What details from the primary sources proved those assumptions wrong?",
            advanced: "Examine the gap between political rhetoric and battlefield reality. How did each side's justification for war hold up against escalating violence? Use specific evidence from the primary sources."
        },
        starters: {
            beginner: [
                'The war got worse so fast because...',
                'At Bull Run, people expected..., but by Shiloh...',
                'One thing that changed between the first battle and Shiloh was...',
                'I was surprised that...'
            ],
            intermediate: [
                'The war escalated from Fort Sumter to Shiloh because...',
                'The reality of battle changed expectations when...',
                'One primary source that shows this escalation is...'
            ]
        }
    },
    {
        theme: 'The Human Cost',
        battleRange: 'Antietam, Fredericksburg, and Chancellorsville',
        prompt: {
            extra: "These three battles hurt a lot of people. Soldiers died. Families lost loved ones. Lincoln signed the Emancipation Proclamation to free enslaved people in the South. Pick one person or group from the war. Tell how the war changed their life.",
            beginner: "Over these three battles, you've seen how the war hurt everyone \u2014 soldiers, nurses, immigrants, and regular families. Clara Barton treated the wounded. Irish soldiers charged a wall 14 times. Lincoln freed enslaved people to help win the war. Pick one person or group and explain how the war changed their life.",
            intermediate: "Antietam through Chancellorsville reveals the war's devastating human toll. The Emancipation Proclamation transformed the war's purpose. Fredericksburg exposed the cost of poor leadership. Chancellorsville showed that even victories have terrible prices. Choose one of these themes and explain how it changed the conflict.",
            advanced: "These three battles illustrate the intersection of military strategy, political calculation, and human suffering. Lincoln weaponized Antietam's outcome for the Emancipation Proclamation. Fredericksburg's futile charges raise questions about command responsibility. Chancellorsville's Pyrrhic victory cost Lee his most irreplaceable general. Drawing on primary sources, analyze how the relationship between military action and political purpose evolved. Who bore the greatest cost?"
        },
        teacherTip: {
            extra: "Pick one person from these battles. How was their life changed by the war?",
            beginner: "Pick one person you read about \u2014 Clara Barton, an Irish soldier, an enslaved person. What was their experience? How was the war personal for them?",
            intermediate: "Think about who had power and who didn't. Who made the big decisions, and who paid the price? The Emancipation Proclamation is a good example \u2014 who did it help, and who was left out?",
            advanced: "Consider whose voices are centered in traditional war narratives and whose are marginalized. How do the primary source quotes complicate simple moral judgments about the war's purpose?"
        },
        starters: {
            beginner: [
                'I chose to write about... because...',
                'The war changed their life by...',
                'One detail that showed how the war hurt people was...',
                'Before the war, this person... but after...'
            ],
            intermediate: [
                'The Emancipation Proclamation changed the war because...',
                'One theme that stands out across these battles is...',
                'The human cost is shown by...'
            ]
        }
    },
    {
        theme: 'Turning Points',
        battleRange: 'Vicksburg, Gettysburg, and Chickamauga',
        prompt: {
            extra: "In one week, the war changed. The Union won at Vicksburg. The Union won at Gettysburg. The South was losing. But Chickamauga showed the South could still win. What made these battles so important? Why do people call this the turning point?",
            beginner: "Vicksburg and Gettysburg happened at almost the same time and changed the whole war. People in Vicksburg hid in caves. At Gettysburg, 12,000 men charged across an open field. What made this the moment the war started to turn? Would you have kept fighting if you were on the losing side?",
            intermediate: "The summer of 1863 \u2014 Vicksburg, Gettysburg, and Chickamauga \u2014 was the war's turning point. The Confederacy was split in two and suffered its worst defeat, yet won one last major victory at Chickamauga. What made these battles decisive? Consider both the military results and the human cost.",
            advanced: "July 1863 represents the war's strategic inflection point. Vicksburg split the Confederacy. Gettysburg ended Lee's offensive capacity. Yet Chickamauga proved the war was far from over. Analyze how these battles collectively transformed the war's trajectory, and examine the ethical questions they raise: civilian suffering at Vicksburg, the futility of Pickett's Charge, and the role of chance at Chickamauga."
        },
        teacherTip: {
            extra: "Think about who was winning before these battles and who was winning after.",
            beginner: "What was different about the war before and after these battles? Try comparing who was winning before to who was winning after.",
            intermediate: "A 'turning point' doesn't mean the war was over \u2014 Chickamauga proved that. What changed strategically, and what stayed the same? Think about both sides.",
            advanced: "Interrogate the concept of 'turning point.' Was it the military outcomes, political consequences, or psychological impact that mattered most? Argue your position with evidence."
        },
        starters: {
            beginner: [
                'I think the war started to turn because...',
                'If I were on the losing side, I would have...',
                'The biggest change after these battles was...',
                'What surprised me most about Vicksburg/Gettysburg was...'
            ],
            intermediate: [
                'These battles were decisive because...',
                'Chickamauga shows the war wasn\'t over because...',
                'The military results and human cost connect when...'
            ]
        }
    },
    {
        theme: "The War's Legacy",
        battleRange: 'Wilderness, Atlanta, Sherman\'s March, and Appomattox',
        prompt: {
            extra: "The war is ending. Grant did not stop fighting. Sherman burned farms and cities. Lee surrendered. Then Lincoln was killed. Four million people were now free. Was the way the war ended fair? What should happen after a war this terrible?",
            beginner: "The last four battles show how the war ended \u2014 and raise big questions about what came next. Grant kept fighting no matter the cost. Sherman destroyed homes and farms. Then Grant let the Confederates go home in peace, and Lincoln was killed five days later. Was the way the war ended fair? What should happen after a war this terrible?",
            intermediate: "The war's final chapter raises questions that still matter today. Grant's relentless strategy, Sherman's total war, and the generous surrender terms all shaped what came next. Was Grant a hero or a butcher? Was Sherman's destruction justified? How did Lincoln's assassination change Reconstruction?",
            advanced: "The war's endgame crystallizes its most enduring moral questions. Grant accepted devastating casualties for strategic objectives. Sherman deliberately targeted civilian infrastructure. Appomattox embodied reconciliation \u2014 yet Lincoln's assassination five days later derailed that vision. Evaluate the ethical frameworks at work and the tension between reconciliation and justice for four million freed people. How do these unresolved tensions continue to shape American society?"
        },
        teacherTip: {
            extra: "Think about a soldier, a freed person, and a Southern family. How would each one answer: was the war worth it?",
            beginner: "Think about different people \u2014 a Union soldier, a freed person, a Southern family. How would each of them answer: 'Was the war worth it?'",
            intermediate: "Consider the tension between ending the war quickly and ending it fairly. Were the surrender terms fair to everyone, including the four million freed people?",
            advanced: "How do the decisions from 1864\u20131865 still affect American society? Think about the relationship between the generous surrender terms and the failures of Reconstruction."
        },
        starters: {
            beginner: [
                'I think the way the war ended was fair/unfair because...',
                'After a war this terrible, I think people should...',
                'Grant letting the Confederates go home shows...',
                'Lincoln\'s assassination changed what came next because...'
            ],
            intermediate: [
                'Grant\'s strategy was justified/not justified because...',
                'Sherman\'s destruction raises the question of...',
                'The surrender terms were fair/unfair to... because...'
            ]
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

// ============================================================
// v3.12 - Acts of the War
// ============================================================

var actIntroBattleIndices = [0, 3, 6, 9];

function getActForBattle(battleIndex) {
    if (typeof acts === 'undefined' || !Array.isArray(acts)) return -1;
    for (var i = 0; i < acts.length; i++) {
        if (acts[i].battleIndices && acts[i].battleIndices.indexOf(battleIndex) !== -1) {
            return i;
        }
    }
    return -1;
}

function shouldShowActIntro(battleIndex) {
    if (actIntroBattleIndices.indexOf(battleIndex) === -1) return false;
    var actIdx = getActForBattle(battleIndex);
    if (actIdx === -1) return false;
    var shown = (gameState.shownActIntros || []);
    return shown.indexOf(actIdx) === -1;
}

// v3.12.1: returns a permutation of [0..n-1] used to shuffle WWYD options at
// render time. Deterministic per (battleIndex, side) within a session: a tiny
// seeded RNG derived from those keys plus a randomized session salt (set on
// gameState init) produces the same order every time the same battle re-renders
// in this playthrough, but a different order across playthroughs.
function getWwydDisplayOrder(battleIndex, side, n) {
    if (!gameState.wwydShuffleSalt) {
        gameState.wwydShuffleSalt = Math.floor(Math.random() * 1e9);
        if (typeof saveProgress === 'function') saveProgress();
    }
    // Stable seed: combine battle, side, salt
    var sideKey = (side === 'union') ? 1 : (side === 'confederacy') ? 2 : 0;
    var seed = (gameState.wwydShuffleSalt * 1664525 + battleIndex * 22695477 + sideKey * 1013904223) >>> 0;
    // xorshift32 PRNG
    function rand() {
        seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
        return ((seed >>> 0) / 0x100000000);
    }
    var order = [];
    for (var i = 0; i < n; i++) order.push(i);
    // Fisher-Yates with seeded RNG
    for (var j = n - 1; j > 0; j--) {
        var k = Math.floor(rand() * (j + 1));
        var tmp = order[j]; order[j] = order[k]; order[k] = tmp;
    }
    return order;
}

// v3.14: deterministic recall option shuffle. Same salt as WWYD; salt
// is per-session. Keyed on (actIndex, qIdx) so each question gets its
// own permutation but reroll is stable within a session.
function getRecallDisplayOrder(actIndex, qIdx, n) {
    if (!gameState.wwydShuffleSalt) {
        gameState.wwydShuffleSalt = Math.floor(Math.random() * 1e9);
        if (typeof saveProgress === 'function') saveProgress();
    }
    var seed = (gameState.wwydShuffleSalt * 1664525 + actIndex * 22695477 + qIdx * 1013904223) >>> 0;
    function rand() {
        seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
        return ((seed >>> 0) / 0x100000000);
    }
    var order = [];
    for (var i = 0; i < n; i++) order.push(i);
    for (var j = n - 1; j > 0; j--) {
        var k = Math.floor(rand() * (j + 1));
        var tmp = order[j]; order[j] = order[k]; order[k] = tmp;
    }
    return order;
}

function shouldShowActRecall(battleIndex) {
    if (!isReflectionBattle(battleIndex)) return false;
    var actIdx = getActForBattle(battleIndex);
    if (actIdx === -1) return false;
    var done = (gameState.completedRecalls || []);
    return done.indexOf(actIdx) === -1;
}

function enterBattleScreen() {
    var b = gameState.currentBattle;
    if (shouldShowActIntro(b)) {
        renderActIntro(getActForBattle(b));
        return;
    }
    renderHistoricalBattle();
}

// SVG namespace for createElementNS
var SVG_NS = 'http://www.w3.org/2000/svg';

function makeSvgEl(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    if (attrs) {
        for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) {
            el.setAttribute(k, attrs[k]);
        }
    }
    return el;
}

// Build the act intro map as a real DOM tree (no string injection).
function buildActMapNode(act) {
    if (typeof ACT_MAP_REGIONS === 'undefined' || !Array.isArray(ACT_MAP_REGIONS)) {
        return null;
    }
    var viewBox = (typeof ACT_MAP_VIEWBOX !== 'undefined') ? ACT_MAP_VIEWBOX : '0 0 900 700';
    var svg = makeSvgEl('svg', { viewBox: viewBox, preserveAspectRatio: 'xMidYMid meet', 'aria-hidden': 'true' });

    // Ocean (sits behind everything; overflow clipped by viewBox)
    svg.appendChild(makeSvgEl('rect', { class: 'act-ocean', x: 0, y: 0, width: 900, height: 700 }));

    // States group
    var statesG = makeSvgEl('g', { class: 'act-states' });
    for (var i = 0; i < ACT_MAP_REGIONS.length; i++) {
        var r = ACT_MAP_REGIONS[i];
        statesG.appendChild(makeSvgEl('path', {
            class: 'act-state act-state-' + r.allegiance,
            'data-id': r.id,
            d: r.d
        }));
    }
    svg.appendChild(statesG);

    // Markers group
    var markersG = makeSvgEl('g', { class: 'act-markers' });
    var markers = (act.intro && act.intro.markers) || [];
    for (var j = 0; j < markers.length; j++) {
        var m = markers[j];
        var lb = m.labelBox || { x: m.coords.x - 70, y: m.coords.y + 18, w: 140, h: 18 };
        var lt = m.labelText || { x: m.coords.x, y: m.coords.y + 31 };

        var g = makeSvgEl('g', { class: 'act-marker', 'data-idx': String(j) });
        g.appendChild(makeSvgEl('rect', {
            class: 'act-marker-label-bg',
            x: lb.x, y: lb.y, width: lb.w, height: lb.h
        }));
        var text = makeSvgEl('text', {
            class: 'act-marker-label',
            x: lt.x, y: lt.y
        });
        text.textContent = m.label;  // textContent is XSS-safe
        g.appendChild(text);
        g.appendChild(makeSvgEl('circle', {
            class: 'act-marker-pin-outer',
            cx: m.coords.x, cy: m.coords.y, r: 6.5
        }));
        g.appendChild(makeSvgEl('circle', {
            class: 'act-marker-pin-inner',
            cx: m.coords.x, cy: m.coords.y, r: 2.2
        }));
        markersG.appendChild(g);
    }
    svg.appendChild(markersG);

    return svg;
}

function renderActIntro(actIndex) {
    if (typeof acts === 'undefined' || !acts[actIndex]) {
        gameState.shownActIntros = (gameState.shownActIntros || []);
        if (gameState.shownActIntros.indexOf(actIndex) === -1) {
            gameState.shownActIntros.push(actIndex);
        }
        renderHistoricalBattle();
        return;
    }

    var act = acts[actIndex];
    var difficulty = resolveDifficulty(act.intro && act.intro.positioning);

    showScreen('actIntroScreen');

    var datelineEl = document.getElementById('actIntroDateline');
    var headlineEl = document.getElementById('actIntroHeadline');
    var positioningEl = document.getElementById('actIntroPositioning');
    var mapEl = document.getElementById('actIntroMap');
    var continueBtn = document.getElementById('actIntroContinueBtn');
    var toggleBtn = document.getElementById('actIntroToggleAllegiance');
    var legendEl = document.getElementById('actIntroLegend');

    datelineEl.textContent = 'Act ' + act.number + ' · ' + act.years;
    headlineEl.textContent = act.name;
    positioningEl.textContent = (act.intro.positioning && act.intro.positioning[difficulty]) ||
                                 (act.intro.positioning && act.intro.positioning.intermediate) || '';

    // PAT (Pay Attention To) callout: per-act vocab + journal nudge
    var patEl = document.getElementById('actIntroPat');
    var patList = document.getElementById('actIntroPatList');
    if (patEl && patList) {
        while (patList.firstChild) patList.removeChild(patList.firstChild);
        var patItems = (act.intro && act.intro.pat) || [];
        if (patItems.length) {
            patItems.forEach(function(itemHtml) {
                var li = document.createElement('li');
                // Parse the limited <strong>...</strong> markup into text + bold nodes
                // (no innerHTML — avoids the security hook and any XSS surface)
                var parts = String(itemHtml).split(/(<strong>.*?<\/strong>)/g);
                parts.forEach(function(part) {
                    var m = part.match(/^<strong>(.*?)<\/strong>$/);
                    if (m) {
                        var s = document.createElement('strong');
                        s.textContent = m[1];
                        li.appendChild(s);
                    } else if (part) {
                        li.appendChild(document.createTextNode(part));
                    }
                });
                patList.appendChild(li);
            });
            patEl.style.display = '';
        } else {
            patEl.style.display = 'none';
        }
    }

    // Replace map content via DOM (XSS-safe — no innerHTML)
    while (mapEl.firstChild) mapEl.removeChild(mapEl.firstChild);
    var svgNode = buildActMapNode(act);
    if (svgNode) mapEl.appendChild(svgNode);

    [datelineEl, headlineEl, positioningEl].forEach(function(el) { el.classList.remove('fade-in'); });
    var markers = mapEl.querySelectorAll('.act-marker');
    markers.forEach(function(m) { m.classList.remove('reveal'); });
    continueBtn.style.display = 'none';

    toggleBtn.classList.remove('on');
    legendEl.classList.remove('on');
    toggleBtn.textContent = 'Show political alignment';
    mapEl.querySelectorAll('.act-state').forEach(function(s) { s.classList.remove('allegiance-on'); });

    // Replace toggle handler each render to avoid duplicates
    var newToggle = toggleBtn.cloneNode(true);
    toggleBtn.parentNode.replaceChild(newToggle, toggleBtn);
    newToggle.addEventListener('click', function() {
        var on = newToggle.classList.toggle('on');
        legendEl.classList.toggle('on', on);
        mapEl.querySelectorAll('.act-state').forEach(function(s) {
            s.classList.toggle('allegiance-on', on);
        });
        newToggle.textContent = on ? 'Hide political alignment' : 'Show political alignment';
    });

    var prefersReduced = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var timers = [];
    function later(ms, fn) { timers.push(setTimeout(fn, ms)); }

    if (prefersReduced) {
        datelineEl.classList.add('fade-in');
        headlineEl.classList.add('fade-in');
        positioningEl.classList.add('fade-in');
        markers.forEach(function(m) { m.classList.add('reveal'); });
        later(6000, function() { continueBtn.style.display = ''; });
    } else {
        later(50, function() { datelineEl.classList.add('fade-in'); });
        var markerStart = 800;
        markers.forEach(function(m, i) {
            later(markerStart + i * 700, function() { m.classList.add('reveal'); });
        });
        var afterMarkers = markerStart + markers.length * 700 + 400;
        later(afterMarkers, function() { headlineEl.classList.add('fade-in'); });
        later(afterMarkers + 700, function() { positioningEl.classList.add('fade-in'); });
        later(afterMarkers + 1400, function() { continueBtn.style.display = ''; });
    }

    // Use { once: true } so the handler auto-removes after one click.
    // (Avoids the cloneNode-before-timers bug where timers held a stale reference.)
    continueBtn.addEventListener('click', function onContinue() {
        timers.forEach(function(t) { clearTimeout(t); });
        gameState.shownActIntros = (gameState.shownActIntros || []);
        if (gameState.shownActIntros.indexOf(actIndex) === -1) {
            gameState.shownActIntros.push(actIndex);
        }
        if (typeof saveProgress === 'function') saveProgress();
        renderHistoricalBattle();
    }, { once: true });
}

// ============================================================
// v3.12.1 - Act recall (multiple-choice questions before grouped reflection)
// ============================================================

// Encapsulates the post-recall reflection display so both case 3
// reflection-fire AND renderActRecall's onContinue call into the same flow.
function showReflectionStep() {
    showScreen('historicalScreen');
    if (typeof updateStepPills === 'function') updateStepPills(3);
    var targetSection = document.getElementById('sectionReflect');
    if (targetSection) targetSection.style.display = 'block';
    if (typeof showGroupedReflection === 'function') showGroupedReflection();
    if (typeof showReflectScaffolding === 'function') showReflectScaffolding();
    // v3.14: wire reflection's Review-the-act link
    var reflReviewLink = document.getElementById('histReflectReviewLink');
    if (reflReviewLink) {
        var newReflReviewLink = reflReviewLink.cloneNode(true);
        reflReviewLink.parentNode.replaceChild(newReflReviewLink, reflReviewLink);
        var actIdx = (typeof getActForBattle === 'function') ? getActForBattle(gameState.currentBattle) : -1;
        if (actIdx !== -1) {
            newReflReviewLink.style.display = '';
            newReflReviewLink.addEventListener('click', function() { openActReview(actIdx); });
        } else {
            newReflReviewLink.style.display = 'none';
        }
    }
    var isLast = gameState.currentBattle >= battles.length - 1;
    var continueBtn = document.getElementById('narrativeContinueBtn');
    if (continueBtn) {
        continueBtn.textContent = isLast ? 'Complete Historical Mode' : 'Next Battle →';
    }
    if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// v3.14: populate a note-nudge element from current battle content. If no
// nudge content is authored (Plan B not yet shipped, or this battle has
// no nudge for this sub-step), the slot stays hidden.
function populateNoteNudge(slotId, subStepKey) {
    var slot = document.getElementById(slotId);
    if (!slot) return;
    var battle = battles[gameState.currentBattle];
    var nudgeData = battle && battle.notes && battle.notes[subStepKey];
    if (!nudgeData) {
        slot.style.display = 'none';
        return;
    }
    var difficulty = resolveDifficulty(nudgeData);
    var text = nudgeData[difficulty] || nudgeData.intermediate || '';
    if (!text || !text.trim()) {
        slot.style.display = 'none';
        return;
    }
    while (slot.firstChild) slot.removeChild(slot.firstChild);
    var strong = document.createElement('strong');
    strong.textContent = 'One worth remembering:';
    slot.appendChild(strong);
    slot.appendChild(document.createTextNode(' ' + text));
    slot.style.display = '';
}

// ============================================================
// v3.14 - Act Review Overlay
// ============================================================

function openActReview(actIndex) {
    if (typeof acts === 'undefined' || !acts[actIndex]) return;
    var act = acts[actIndex];
    var difficulty = resolveDifficulty(act.review);
    var overlay = document.getElementById('actReviewOverlay');
    var eyebrow = document.getElementById('actReviewEyebrow');
    var title = document.getElementById('actReviewTitle');
    var thumbs = document.getElementById('actReviewThumbs');
    var body = document.getElementById('actReviewBody');
    if (!overlay || !eyebrow || !title || !thumbs || !body) return;

    eyebrow.textContent = 'Act ' + act.number + ' · ' + act.years;
    title.textContent = act.name;

    // Battle thumbnails
    while (thumbs.firstChild) thumbs.removeChild(thumbs.firstChild);
    var indices = act.battleIndices || [];
    indices.forEach(function(bi) {
        var battle = battles[bi];
        if (!battle) return;
        var thumbDiv = document.createElement('div');
        thumbDiv.className = 'act-review-thumb';
        var img = document.createElement('img');
        img.src = battle.image || '';
        img.alt = battle.name || '';
        img.onerror = function() { thumbDiv.style.display = 'none'; };
        thumbDiv.appendChild(img);
        var caption = document.createElement('div');
        caption.textContent = (battle.name || '').replace(/^(Battle of |First |Siege of |Surrender at )/, '');
        thumbDiv.appendChild(caption);
        thumbs.appendChild(thumbDiv);
    });

    // Body content (markdown-lite to DOM)
    while (body.firstChild) body.removeChild(body.firstChild);

    // Handout nudge: every act review reminds students to fill in their journal.
    var nudge = document.createElement('div');
    nudge.className = 'act-review-handout-nudge';
    var nudgeIcon = document.createElement('span');
    nudgeIcon.className = 'handout-nudge-icon';
    nudgeIcon.textContent = '✎';
    nudge.appendChild(nudgeIcon);
    var nudgeText = document.createElement('span');
    nudgeText.appendChild(document.createTextNode('Battle Journal: now fill in '));
    var actBold = document.createElement('strong');
    actBold.textContent = 'Act ' + act.number;
    nudgeText.appendChild(actBold);
    nudgeText.appendChild(document.createTextNode(' on your handout before continuing.'));
    nudge.appendChild(nudgeText);
    body.appendChild(nudge);

    var content = (act.review && act.review[difficulty]) || (act.review && act.review.intermediate) || '';
    if (!content || !content.trim()) {
        var empty = document.createElement('div');
        empty.className = 'act-review-empty';
        empty.textContent = 'Review content is being prepared. For now, take notes during the battle screens.';
        body.appendChild(empty);
    } else {
        renderActReviewMarkdown(content, body);
    }

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    var closeBtn = document.getElementById('actReviewCloseBtn');
    if (closeBtn) closeBtn.focus();
}

function closeActReview() {
    var overlay = document.getElementById('actReviewOverlay');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
}

// Minimal markdown-to-DOM converter for review content.
// Recognizes: ### Heading, - List item, blank line = paragraph break.
// All text rendered via textContent, no innerHTML.
function renderActReviewMarkdown(text, container) {
    var lines = text.split('\n');
    var currentList = null;
    var currentPara = null;
    function closeList() { currentList = null; }
    function closePara() {
        if (currentPara) container.appendChild(currentPara);
        currentPara = null;
    }
    lines.forEach(function(line) {
        var trimmed = line.trim();
        if (trimmed.indexOf('### ') === 0) {
            closeList(); closePara();
            var h3 = document.createElement('h3');
            h3.textContent = trimmed.substring(4);
            container.appendChild(h3);
        } else if (trimmed.indexOf('- ') === 0) {
            closePara();
            if (!currentList) {
                currentList = document.createElement('ul');
                container.appendChild(currentList);
            }
            var li = document.createElement('li');
            li.textContent = trimmed.substring(2);
            currentList.appendChild(li);
        } else if (trimmed === '') {
            closeList(); closePara();
        } else {
            closeList();
            if (!currentPara) {
                currentPara = document.createElement('p');
                currentPara.textContent = trimmed;
            } else {
                currentPara.textContent = currentPara.textContent + ' ' + trimmed;
            }
        }
    });
    closeList(); closePara();
}

// Renders the act recall screen with question state machine.
// State per question:
//   unanswered -> wrong-once (nudge shown, retry allowed)
//                          -> correct (explanation shown, Continue enabled)
//                          -> wrong-twice (answer revealed; must click correct option to advance)
function renderActRecall(actIndex) {
    if (typeof acts === 'undefined' || !acts[actIndex]) {
        // Data missing — skip recall, advance to reflection
        gameState.completedRecalls = (gameState.completedRecalls || []);
        if (gameState.completedRecalls.indexOf(actIndex) === -1) {
            gameState.completedRecalls.push(actIndex);
        }
        if (typeof saveProgress === 'function') saveProgress();
        showReflectionStep();
        return;
    }

    var act = acts[actIndex];
    var difficulty = resolveDifficulty(act.recall);
    var questions = (act.recall && act.recall[difficulty]) || [];

    if (!questions.length) {
        // No questions authored for this act/level — skip
        gameState.completedRecalls = (gameState.completedRecalls || []);
        if (gameState.completedRecalls.indexOf(actIndex) === -1) {
            gameState.completedRecalls.push(actIndex);
        }
        if (typeof saveProgress === 'function') saveProgress();
        showReflectionStep();
        return;
    }

    showScreen('actRecallScreen');

    document.getElementById('actRecallEyebrow').textContent =
        'Act ' + act.number + ' · ' + act.name;

    // v3.14: wire "Review the act" link (replace handler each render to avoid duplicates)
    var reviewLink = document.getElementById('actRecallReviewLink');
    if (reviewLink) {
        var newReviewLink = reviewLink.cloneNode(true);
        reviewLink.parentNode.replaceChild(newReviewLink, reviewLink);
        newReviewLink.addEventListener('click', function() { openActReview(actIndex); });
    }

    var questionIdx = 0;
    var wrongAttempts = 0;
    var questionResolved = false;

    function renderQuestion() {
        var q = questions[questionIdx];
        document.getElementById('actRecallProgress').textContent =
            'Question ' + (questionIdx + 1) + ' of ' + questions.length;
        var actRecallQuestionEl = document.getElementById('actRecallQuestion');
        actRecallQuestionEl.textContent = q.question;
        // v3.15: TTS — mark the recall question as readable.
        actRecallQuestionEl.classList.add('tts-readable');
        actRecallQuestionEl.setAttribute('data-tts-label', 'Recall question');

        var optionsEl = document.getElementById('actRecallOptions');
        // Clear previous options via DOM API (no innerHTML)
        while (optionsEl.firstChild) optionsEl.removeChild(optionsEl.firstChild);

        var displayOrder = getRecallDisplayOrder(actIndex, questionIdx, q.options.length);
        displayOrder.forEach(function(originalIdx, displayIdx) {
            var optText = q.options[originalIdx];
            var btn = document.createElement('button');
            btn.className = 'act-recall-option';
            btn.textContent = optText;
            btn.setAttribute('data-letter', String.fromCharCode(65 + displayIdx));
            btn.setAttribute('data-original-idx', String(originalIdx));
            btn.addEventListener('click', function() { onOptionClick(originalIdx, btn); });
            optionsEl.appendChild(btn);
        });

        var feedbackEl = document.getElementById('actRecallFeedback');
        feedbackEl.style.display = 'none';
        feedbackEl.textContent = '';
        feedbackEl.className = 'act-recall-feedback';

        var continueBtn = document.getElementById('actRecallContinueBtn');
        continueBtn.disabled = true;
        continueBtn.textContent = (questionIdx < questions.length - 1)
            ? 'Next Question'
            : 'Continue to Reflection';

        wrongAttempts = 0;
        questionResolved = false;
    }

    // Helper: build feedback content with strong + body + optional em (XSS-safe, no innerHTML)
    function setFeedback(el, label, body, hint) {
        // Clear via DOM
        while (el.firstChild) el.removeChild(el.firstChild);
        var strong = document.createElement('strong');
        strong.textContent = label;
        el.appendChild(strong);
        // Body as text node (plain) so any user-authored content can't inject HTML
        el.appendChild(document.createTextNode(body));
        if (hint) {
            var em = document.createElement('em');
            em.textContent = hint;
            el.appendChild(em);
        }
        el.style.display = '';
    }

    function onOptionClick(optIdx, btnEl) {
        if (questionResolved) return;
        var q = questions[questionIdx];
        var feedbackEl = document.getElementById('actRecallFeedback');
        var allOpts = document.querySelectorAll('.act-recall-option');

        if (optIdx === q.correctIndex) {
            // CORRECT
            btnEl.classList.add('selected-correct');
            allOpts.forEach(function(o) { if (o !== btnEl) o.disabled = true; });
            feedbackEl.className = 'act-recall-feedback feedback-correct';
            setFeedback(feedbackEl, 'Right', q.explanation || '', null);
            questionResolved = true;
            document.getElementById('actRecallContinueBtn').disabled = false;
            return;
        }

        // WRONG
        wrongAttempts++;
        btnEl.classList.add('selected-wrong');
        btnEl.disabled = true;

        if (wrongAttempts === 1) {
            // First wrong: nudge, retry allowed
            feedbackEl.className = 'act-recall-feedback feedback-nudge';
            setFeedback(feedbackEl, 'Not quite — try again',
                        q.nudge || 'Think it through once more.', null);
        } else {
            // Second wrong: reveal correct, require click to advance
            feedbackEl.className = 'act-recall-feedback feedback-revealed';
            var displayPos = -1;
            var allOptsList = document.querySelectorAll('.act-recall-option');
            allOptsList.forEach(function(o, oi) {
                if (parseInt(o.getAttribute('data-original-idx'), 10) === q.correctIndex) {
                    displayPos = oi;
                }
            });
            var correctLetter = (displayPos >= 0) ? String.fromCharCode(65 + displayPos) : '';
            setFeedback(feedbackEl,
                        'The answer is ' + correctLetter,
                        q.explanation || '',
                        'Click the highlighted answer to continue.');
            // Lock all options EXCEPT the correct one (which gets revealed-correct styling)
            allOpts.forEach(function(o) {
                var oOrigIdx = parseInt(o.getAttribute('data-original-idx'), 10);
                if (oOrigIdx === q.correctIndex) {
                    o.classList.add('revealed-correct');
                    o.disabled = false;
                } else {
                    o.disabled = true;
                }
            });
        }
    }

    function onContinue() {
        questionIdx++;
        if (questionIdx >= questions.length) {
            // All questions resolved — mark act recall complete
            gameState.completedRecalls = (gameState.completedRecalls || []);
            if (gameState.completedRecalls.indexOf(actIndex) === -1) {
                gameState.completedRecalls.push(actIndex);
            }
            if (typeof saveProgress === 'function') saveProgress();
            showReflectionStep();
        } else {
            renderQuestion();
        }
    }

    // Wire Continue with { once: false } since this fires multiple times per act.
    // But we still need to clean up between renders. Use cloneNode pattern (no
    // pending timers like the intro screen has, so this is safe here).
    var continueBtn = document.getElementById('actRecallContinueBtn');
    var newContinue = continueBtn.cloneNode(true);
    continueBtn.parentNode.replaceChild(newContinue, continueBtn);
    newContinue.addEventListener('click', onContinue);

    renderQuestion();
}

function renderHistoricalBattle() {
    if (typeof gameState !== 'undefined' && gameState) gameState.isInBattle = true;
    var content = getHistoricalContent();
    narrativeStep = 0;
    wwydSelected = -1;

    // v3.15: populate act/year dateline above battle name
    (function populateBattleDateline() {
        const datelines = document.querySelectorAll('.battle-act-dateline');
        if (datelines.length === 0) return;
        const battleIndex = gameState.currentBattle;
        if (typeof battleIndex !== 'number' || !battles[battleIndex]) return;

        let datelineText = '';
        if (typeof getActForBattle === 'function') {
            const actIndex = getActForBattle(battleIndex);
            if (actIndex !== -1 && typeof acts !== 'undefined' && acts[actIndex]) {
                datelineText = 'Act ' + acts[actIndex].number + ' — ' + acts[actIndex].years;
            }
        }
        if (!datelineText) {
            datelineText = String(battles[battleIndex].year || '');
        }

        datelines.forEach(function(el) { el.textContent = datelineText; });
    })();

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
    var isLowReadingTier = (difficulty === 'beginner' || difficulty === 'extra');

    // --- Section 1: Intel Report ---
    // Beginner/ES: hide Intel grid (situation text covers what they need)
    var intelSection = document.getElementById('sectionIntel');
    var intelGrid = document.getElementById('histIntelGrid');
    if (isLowReadingTier) {
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
    var histSituationEl = document.getElementById('histSituation');
    histSituationEl.textContent = content.situation;
    // v3.15: TTS — mark this paragraph as readable. A MutationObserver in app.js
    // attaches a play button when the class is added.
    histSituationEl.classList.add('tts-readable');
    histSituationEl.setAttribute('data-tts-label', 'The Situation');

    // --- Section 3: What Would You Do? ---
    var wwyd = content.whatWouldYouDo;
    var histWWYDPromptEl = document.getElementById('histWWYDPrompt');
    histWWYDPromptEl.textContent = wwyd.prompt;
    histWWYDPromptEl.classList.add('tts-readable');
    histWWYDPromptEl.setAttribute('data-tts-label', 'Your Call prompt');

    // v3.12.1: shuffle option display order so the historical choice (always at
    // index 0 in the data) is not always option A. Internal indices are preserved:
    // selectWwydOption(originalIndex) is still called with the data-file index,
    // so wwydSelected === 0 continues to mean "matched history" everywhere in
    // the codebase (feedback comparison, PDF export, battle review, etc).
    //
    // The shuffle is deterministic per battle per side per playthrough so that
    // navigating back/forward inside one battle does not re-shuffle the options.
    // It IS re-randomized across playthroughs (new gameState = new shuffle).
    var optionsContainer = document.getElementById('histWWYDOptions');
    optionsContainer.innerHTML = '';
    var displayOrder = getWwydDisplayOrder(gameState.currentBattle, gameState.side, wwyd.options.length);
    displayOrder.forEach(function(originalIdx, displayIdx) {
        var optionText = wwyd.options[originalIdx];
        var btn = document.createElement('button');
        btn.className = 'wwyd-option-btn';
        btn.setAttribute('data-letter', String.fromCharCode(65 + displayIdx));
        btn.setAttribute('data-original-idx', String(originalIdx));
        btn.textContent = optionText;
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', 'false');
        btn.setAttribute('tabindex', '0');
        btn.addEventListener('click', function() {
            selectWwydOption(originalIdx);
        });
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectWwydOption(originalIdx);
            }
        });
        optionsContainer.appendChild(btn);
    });

    // --- Section 4: What Really Happened ---
    var histWhatHappenedEl = document.getElementById('histWhatHappened');
    histWhatHappenedEl.textContent = content.whatHappened;
    // v3.15: TTS — mark the outcome narrative as readable.
    histWhatHappenedEl.classList.add('tts-readable');
    histWhatHappenedEl.setAttribute('data-tts-label', 'What Really Happened');
    document.getElementById('histOutcome').textContent = content.outcome;

    var totalCasualties = content.casualties.union + content.casualties.confederacy;
    document.getElementById('histCasualties').textContent =
        'Casualties: ' + totalCasualties.toLocaleString() +
        ' (Union: ' + content.casualties.union.toLocaleString() +
        ', Confederate: ' + content.casualties.confederacy.toLocaleString() + ')';

    document.getElementById('histTechName').textContent = content.tech.name;
    document.getElementById('histTechDesc').textContent = content.tech.description;
    // Tech Spotlight: hide at beginner/ES to reduce cognitive load
    var techBox = document.getElementById('histTechBox');
    if (techBox) techBox.style.display = isLowReadingTier ? 'none' : '';

    // Battlefield Tours: post-battle video card for this battle
    renderBattleVideoCard(battles[gameState.currentBattle].id, 'histBattleVideoSlot');

    // --- Section 5: A Voice From the War ---
    document.getElementById('histVoiceQuote').textContent = content.voice.quote;
    document.getElementById('histVoiceAttribution').textContent = '\u2014 ' + content.voice.attribution;
    document.getElementById('histVoiceSource').textContent = content.voice.source;

    // Voice explainer (beginner/ES level)
    var explainerEl = document.getElementById('histVoiceExplainer');
    if (content.voice.explainer && isLowReadingTier) {
        explainerEl.textContent = '\uD83D\uDCA1 In simpler words: ' + content.voice.explainer;
        explainerEl.style.display = 'block';
    } else {
        explainerEl.style.display = 'none';
    }

    // --- Section 6: The Bigger Picture ---
    var histBigPictureEl = document.getElementById('histBigPicture');
    histBigPictureEl.textContent = content.biggerPicture;
    // v3.15: TTS — mark the reflection-from-history paragraph as readable.
    histBigPictureEl.classList.add('tts-readable');
    histBigPictureEl.setAttribute('data-tts-label', 'The Bigger Picture');

    // Key Fact: hide entire box at beginner/ES to reduce reading
    var keyFactEl = document.getElementById('histKeyFact');
    var keyFactBox = keyFactEl ? keyFactEl.closest('.key-fact-box') : null;
    if (isLowReadingTier) {
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
    // Intel already hidden at beginner/ES via difficulty logic above
    if (!isLowReadingTier) document.getElementById('sectionIntel').style.display = 'block';
    document.getElementById('sectionSituation').style.display = 'block';
    document.getElementById('sectionWWYD').style.display = 'none';
    document.getElementById('wwydFeedback').style.display = 'none';
    document.getElementById('sectionHappened').style.display = 'none';
    document.getElementById('sectionVoice').style.display = 'none';
    document.getElementById('sectionBigPicture').style.display = 'none';
    document.getElementById('sectionReflect').style.display = 'none';
    var nudgeFeedback = document.getElementById('noteNudgeFeedback');
    if (nudgeFeedback) nudgeFeedback.style.display = 'none';
    var nudgeOutcome = document.getElementById('noteNudgeOutcome');
    if (nudgeOutcome) nudgeOutcome.style.display = 'none';
    var nudgeReflection = document.getElementById('noteNudgeReflection');
    if (nudgeReflection) nudgeReflection.style.display = 'none';
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

    // v3.12.1: with display-order shuffle, the clicked option's original (data)
    // index is what matters for state. Match buttons via data-original-idx
    // attribute, not their DOM position, so the right button highlights
    // regardless of shuffle.
    var buttons = document.querySelectorAll('#histWWYDOptions .wwyd-option-btn');
    buttons.forEach(function(btn) {
        btn.classList.remove('selected', 'dimmed');
        var btnOriginalIdx = parseInt(btn.getAttribute('data-original-idx'), 10);
        if (btnOriginalIdx === idx) {
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
// v3.14: maps narrativeStep (0-5 after step-2 split) to pill index (0-3).
// 0 = Briefing, 1 = Your Call, 2/3/4 = What Happened (3 sub-steps), 5 = Reflect.
function narrativeStepToPillIndex(step) {
    if (step <= 1) return step;
    if (step >= 2 && step <= 4) return 2;
    return 3;
}

function updateStepPills(narrStep) {
    var step = narrativeStepToPillIndex(narrStep);
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
    // v3.17.1: Reflection happens on the Battle Journal handout; the textarea
    // and scaffolding (sentence starters, RACE reminder) are hidden in markup.
    // The journal-callout div is the visible reflection surface now.
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

    // v3.17.1: "Need a hint?" tip is hidden — reflection happens on the handout
    // and the handout's own scaffolding covers hint surface area.
    var tipSection = document.getElementById('teacherTip');
    if (tipSection) tipSection.style.display = 'none';
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
        'See how your choice compared to what really happened.',
        'Read what actually unfolded on the battlefield. Take your time!',
        'Hear from someone who was there \u2014 and what it meant in the bigger picture.',
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
    var btn = document.getElementById('helpToggleMenuBtn');

    btn.style.display = '';
    helpBarVisible = true;
    bar.style.display = 'flex';
    btn.classList.add('active');

    updateHelpBarText(mode, narrativeStep);
}

function hideHelpBar() {
    var bar = document.getElementById('helpBar');
    var btn = document.getElementById('helpToggleMenuBtn');

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
    var btn = document.getElementById('helpToggleMenuBtn');
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
            updateStepPills(narrativeStep);
            targetSection = document.getElementById('sectionWWYD');
            targetSection.style.display = 'block';
            if (wwydSelected === -1) {
                continueBtn.disabled = true;
            }
            break;

        case 2:
            // FEEDBACK sub-step: show only WWYD feedback panel.
            updateStepPills(narrativeStep);
            continueBtn.disabled = false;
            continueBtn.classList.remove('pulse-hint');
            continueBtn.textContent = 'Continue';

            var feedbackEl = document.getElementById('wwydFeedback');
            var contentForFeedback = getHistoricalContent();
            var feedbackList = contentForFeedback.whatWouldYouDo.feedback;
            var optionsList = contentForFeedback.whatWouldYouDo.options;

            if (feedbackList && Array.isArray(feedbackList) && wwydSelected >= 0 && feedbackList[wwydSelected]) {
                var choiceTextEl = document.getElementById('feedbackChoiceText');
                if (choiceTextEl) choiceTextEl.textContent = optionsList[wwydSelected] || '';

                var badge = document.getElementById('feedbackBadge');
                var histSection = document.getElementById('feedbackHistorical');
                if (badge && histSection) {
                    if (wwydSelected === 0) {
                        var commanderRaw = battles[gameState.currentBattle].historical.intel[gameState.side].commander;
                        var commander = (typeof commanderRaw === 'string') ? commanderRaw : getContent(commanderRaw);
                        commander = String(commander).split('(')[0].split(',')[0].trim();
                        badge.className = 'feedback-badge badge-match';
                        badge.textContent = 'Same call as ' + commander;
                        histSection.style.display = 'none';
                    } else {
                        badge.className = 'feedback-badge badge-different';
                        badge.textContent = 'You chose a different path';
                        var histTextEl = document.getElementById('feedbackHistoricalText');
                        if (histTextEl) histTextEl.textContent = optionsList[0] || '';
                        histSection.style.display = 'block';
                    }
                }

                var detailEl = document.getElementById('feedbackDetail');
                if (detailEl) {
                    detailEl.textContent = feedbackList[wwydSelected];
                    // v3.15: TTS — read the explanatory feedback paragraph.
                    detailEl.classList.add('tts-readable');
                    detailEl.setAttribute('data-tts-label', 'Choice feedback');
                }
                feedbackEl.style.display = 'block';
                targetSection = feedbackEl;
            }

            // Hide later sub-sections in case they were visible from a prior re-render
            document.getElementById('sectionHappened').style.display = 'none';
            document.getElementById('sectionVoice').style.display = 'none';
            document.getElementById('sectionBigPicture').style.display = 'none';

            populateNoteNudge('noteNudgeFeedback', 'feedback');
            break;

        case 3:
            // OUTCOME sub-step: feedback stays, show What Really Happened + tech.
            updateStepPills(narrativeStep);
            continueBtn.textContent = 'Continue';
            var happened = document.getElementById('sectionHappened');
            happened.style.display = 'block';
            targetSection = happened;
            populateNoteNudge('noteNudgeOutcome', 'outcome');
            break;

        case 4:
            // REFLECTION FROM HISTORY sub-step: show Voice + Bigger Picture.
            updateStepPills(narrativeStep);

            var voice = document.getElementById('sectionVoice');
            var bigPicture = document.getElementById('sectionBigPicture');
            voice.style.display = 'block';
            bigPicture.style.display = 'block';
            targetSection = voice;

            // At beginner/ES: collapse Voice and Bigger Picture
            var isLowReadingTier = (gameState.difficulty === 'beginner' || gameState.difficulty === 'extra');
            setupCollapsibleSection('voiceHeading', 'voiceBody', !isLowReadingTier);
            setupCollapsibleSection('bigPictureHeading', 'bigPictureBody', !isLowReadingTier);

            populateNoteNudge('noteNudgeReflection', 'reflectionFromHistory');

            if (!isReflectionBattle(gameState.currentBattle)) {
                var isLast = gameState.currentBattle >= battles.length - 1;
                continueBtn.textContent = isLast ? 'Complete Historical Mode' : 'Next Battle \u2192';
            } else {
                continueBtn.textContent = 'Continue';
            }
            break;

        case 5:
            // RECALL or REFLECT (formerly case 3 reflection branch).
            if (isReflectionBattle(gameState.currentBattle)) {
                if (typeof shouldShowActRecall === 'function' &&
                    shouldShowActRecall(gameState.currentBattle)) {
                    var actIdx = getActForBattle(gameState.currentBattle);
                    renderActRecall(actIdx);
                    return;
                }
                showReflectionStep();
            } else {
                // Non-reflection battle: save WWYD choice and advance.
                var wwydChoiceText = '';
                if (wwydSelected >= 0) {
                    var c = getHistoricalContent();
                    var opts = c.whatWouldYouDo.options;
                    if (opts && opts[wwydSelected]) wwydChoiceText = opts[wwydSelected];
                }
                saveHistoricalResponse(wwydChoiceText, '', wwydSelected);
                var done = advanceHistorical();
                if (done) renderHistoricalComplete();
                else enterBattleScreen();
                return;
            }
            break;

        case 6:
            // SAVE AND ADVANCE (formerly case 4) - reflection battles only.
            var wwydChoiceText2 = '';
            if (wwydSelected >= 0) {
                var content2 = getHistoricalContent();
                var opts2 = content2.whatWouldYouDo.options;
                if (opts2 && opts2[wwydSelected]) wwydChoiceText2 = opts2[wwydSelected];
            }
            var reflectionText = document.getElementById('histReflectInput').value.trim();
            saveHistoricalResponse(wwydChoiceText2, reflectionText, wwydSelected);

            var done2 = advanceHistorical();
            if (done2) {
                renderHistoricalComplete();
            } else {
                enterBattleScreen();
            }
            return;
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
    // v3.17.1: Print Summary menu item removed; Battle Journal handout is the capture surface.

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
        '<h3>Free-play Mode Unlocked!</h3>' +
        '<p>Now that you know what really happened, try <strong>Free-play Mode</strong> ' +
        'to make your own strategic decisions and change the course of history!</p>' +
        '</div>' +
        '</div>';

    // v3.17.1: PDF export removed. Battle Journal handout is the capture surface.
    // pdfExportSection remains hidden in markup; generatePdfReport() is left intact
    // but no longer reachable from UI.

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
                    html += ' <span class="match-badge matched">Same as history</span>';
                } else {
                    html += ' <span class="match-badge different">Different path</span>';
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

    // v3.15: populate act/year dateline above battle name
    (function populateBattleDateline() {
        const datelines = document.querySelectorAll('.battle-act-dateline');
        if (datelines.length === 0) return;
        const battleIndex = gameState.currentBattle;
        if (typeof battleIndex !== 'number' || !battles[battleIndex]) return;

        let datelineText = '';
        if (typeof getActForBattle === 'function') {
            const actIndex = getActForBattle(battleIndex);
            if (actIndex !== -1 && typeof acts !== 'undefined' && acts[actIndex]) {
                datelineText = 'Act ' + acts[actIndex].number + ' — ' + acts[actIndex].years;
            }
        }
        if (!datelineText) {
            datelineText = String(battles[battleIndex].year || '');
        }

        datelines.forEach(function(el) { el.textContent = datelineText; });
    })();

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
        var sName = getSideText(strategy.name);
        var sDesc = getSideText(strategy.description);
        var sDetail = getSideText(strategy.detail);
        card.setAttribute('aria-label', 'Choose strategy: ' + sName);

        card.innerHTML =
            '<div class="strategy-name">' + sName + '</div>' +
            '<div class="strategy-description">' + sDesc + '</div>' +
            '<div class="strategy-detail">' + sDetail + '</div>';

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
        renderBattleVideoCard(battleData.id, 'fpBattleVideoSlot');
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
        '<h3 class="scoreboard-form-title">Save Your Score</h3>' +
        '<div class="scoreboard-input-row">' +
        '<input type="text" id="playerNameInput" class="player-name-input" ' +
        'placeholder="Enter your name (e.g. first name + last initial)" ' +
        'maxlength="20" aria-label="Your name for the scoreboard">' +
        '<button class="save-score-btn" id="saveScoreBtn">Save Score</button>' +
        '</div></div>' +
        '<div class="scoreboard-table-wrapper">' +
        '<h3 class="scoreboard-title">Device Leaderboard</h3>' +
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
                '<p class="score-saved-msg">Score saved locally!</p>';
            document.querySelector('.scoreboard-table-wrapper').innerHTML =
                '<h3 class="scoreboard-title">Device Leaderboard</h3>' +
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
                    '<h3 class="scoreboard-title">Device Leaderboard</h3>' +
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
                    'Result: ' + (b.won ? 'Victory' : 'Defeat') + '<br>' +
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
            var status = isCompleted ? 'Complete' : (isCurrent ? 'Current' : 'Upcoming');
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
        loadBattlefieldTours();
    } else {
        progressTab.classList.add('active');
        warMapTab.classList.remove('active');
        progressContent.style.display = 'block';
        warMapContent.style.display = 'none';
    }
}

var battlefieldTours = [
    { battleId: 'fort_sumter',     name: 'Fort Sumter',                date: 'April 1861',     youtubeId: 'Hfn5BZZBpoU', type: 'Animated Map', hook: 'The opening shots that started the war.' },
    { battleId: 'bull_run',        name: 'First Bull Run',             date: 'July 1861',      youtubeId: 'vGR02nZ03uY', type: 'Animated Map', hook: 'The day both sides learned the war would not be short.' },
    { battleId: 'shiloh',          name: 'Shiloh',                     date: 'April 1862',     youtubeId: 'Tlhlk3bp-f4', type: 'Animated Map', hook: 'A surprise dawn attack and the bloodiest two days yet.' },
    { battleId: 'antietam',        name: 'Antietam',                   date: 'September 1862', youtubeId: '_8ybkoGmHww', type: 'Animated Map', hook: 'The single bloodiest day in American history.' },
    { battleId: 'fredericksburg',  name: 'Fredericksburg',             date: 'December 1862',  youtubeId: 'nJodzkWBjDk', type: 'Animated Map', hook: 'Wave after wave of Union troops thrown against a stone wall.' },
    { battleId: 'chancellorsville', name: 'Chancellorsville',          date: 'May 1863',       youtubeId: '3o7WcBQ8pYg', type: 'Animated Map', hook: "Lee's boldest gamble and the loss of Stonewall Jackson." },
    { battleId: 'vicksburg',       name: 'Vicksburg',                  date: 'May-July 1863',  youtubeId: '1eSgimZ8GKQ', type: 'Animated Map', hook: 'A 47-day siege that split the Confederacy in two.' },
    { battleId: 'gettysburg',      name: 'Gettysburg',                 date: 'July 1863',      youtubeId: 'DUXpCfcJ7Ng', type: 'Animated Map', hook: 'Three days that decided the fate of the invasion North.' },
    { battleId: 'chickamauga',     name: 'Chickamauga',                date: 'September 1863', youtubeId: 'vlJUuNny9mc', type: 'Animated Map', hook: 'A rare Confederate victory in the Western theater.' },
    { battleId: 'wilderness',      name: 'The Wilderness',             date: 'May 1864',       youtubeId: 'gxJTfwQjixE', type: 'Animated Map', hook: "Grant's Overland Campaign opens in tangled woods and fire." },
    { battleId: 'atlanta',         name: 'Atlanta',                    date: 'July-Sept 1864', youtubeId: 'bh4vSOx2cMI', type: 'Documentary',  hook: 'The campaign that helped reelect Lincoln.' },
    { battleId: 'shermans_march',  name: "Sherman's March to the Sea", date: 'Nov-Dec 1864',   youtubeId: 'FtD787nRFn4', type: 'Documentary',  hook: 'Total war from Atlanta to the sea.' },
    { battleId: 'appomattox',      name: 'Appomattox Court House',     date: 'April 1865',     youtubeId: 'lV3YPw_Mly8', type: 'Documentary',  hook: "Lee's surrender and the end of the Confederacy." }
];

function clearChildren(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
}

function loadBattlefieldTours() {
    if (warmapLoaded) return;

    var grid = document.getElementById('toursGrid');
    if (!grid) return;

    var offline = (window.location.protocol === 'file:');

    for (var i = 0; i < battlefieldTours.length; i++) {
        grid.appendChild(buildTourCard(battlefieldTours[i], offline));
    }
    warmapLoaded = true;
}

function buildTourCard(tour, offline) {
    var card = document.createElement('div');
    card.className = 'tour-card';
    card.setAttribute('data-youtube-id', tour.youtubeId);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'Watch ' + tour.name + ' video');

    var thumb = document.createElement('div');
    thumb.className = 'tour-thumb';
    var img = document.createElement('img');
    img.src = 'https://img.youtube.com/vi/' + tour.youtubeId + '/hqdefault.jpg';
    img.alt = '';
    img.setAttribute('loading', 'lazy');
    thumb.appendChild(img);

    var playIcon = document.createElement('div');
    playIcon.className = 'tour-play-icon';
    playIcon.textContent = '▶';
    thumb.appendChild(playIcon);

    var badge = document.createElement('span');
    badge.className = 'tour-badge tour-badge-' + (tour.type === 'Animated Map' ? 'map' : 'doc');
    badge.textContent = tour.type;
    thumb.appendChild(badge);

    card.appendChild(thumb);

    var body = document.createElement('div');
    body.className = 'tour-body';

    var title = document.createElement('div');
    title.className = 'tour-title';
    title.textContent = tour.name;
    body.appendChild(title);

    var meta = document.createElement('div');
    meta.className = 'tour-meta';
    meta.textContent = tour.date;
    body.appendChild(meta);

    var hook = document.createElement('div');
    hook.className = 'tour-hook';
    hook.textContent = tour.hook;
    body.appendChild(hook);

    var fallback = document.createElement('a');
    fallback.className = 'tour-fallback';
    fallback.href = 'https://www.youtube.com/watch?v=' + tour.youtubeId;
    fallback.target = '_blank';
    fallback.rel = 'noopener';
    fallback.textContent = 'Watch on YouTube';
    body.appendChild(fallback);

    card.appendChild(body);

    var activate = function() { expandTourCard(card, tour, offline); };
    card.addEventListener('click', activate);
    card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activate();
        }
    });

    return card;
}

function expandTourCard(card, tour, offline) {
    if (card.classList.contains('tour-card-expanded')) return;
    card.classList.add('tour-card-expanded');

    var thumb = card.querySelector('.tour-thumb');
    if (!thumb) return;

    if (offline) {
        var msg = document.createElement('div');
        msg.className = 'tour-offline-msg';
        msg.textContent = 'Videos require an internet connection. Use the Watch on YouTube link below.';
        clearChildren(thumb);
        thumb.appendChild(msg);
        return;
    }

    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/' + tour.youtubeId + '?autoplay=1&rel=0';
    iframe.title = tour.name + ' video';
    iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('loading', 'lazy');
    clearChildren(thumb);
    thumb.appendChild(iframe);
}

function findTourForBattle(battleId) {
    for (var i = 0; i < battlefieldTours.length; i++) {
        if (battlefieldTours[i].battleId === battleId) return battlefieldTours[i];
    }
    return null;
}

function renderBattleVideoCard(battleId, slotId) {
    var slot = document.getElementById(slotId);
    if (!slot) return;
    clearChildren(slot);

    var tour = findTourForBattle(battleId);
    if (!tour) return;

    var offline = (window.location.protocol === 'file:');

    var heading = document.createElement('div');
    heading.className = 'battle-video-heading';
    heading.textContent = 'See how it actually unfolded';
    slot.appendChild(heading);

    var card = document.createElement('div');
    card.className = 'battle-video-card';
    card.setAttribute('data-youtube-id', tour.youtubeId);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'Watch ' + tour.name + ' video');

    var thumb = document.createElement('div');
    thumb.className = 'battle-video-thumb';
    var img = document.createElement('img');
    img.src = 'https://img.youtube.com/vi/' + tour.youtubeId + '/hqdefault.jpg';
    img.alt = '';
    img.setAttribute('loading', 'lazy');
    thumb.appendChild(img);

    var playIcon = document.createElement('div');
    playIcon.className = 'battle-video-play';
    playIcon.textContent = '▶';
    thumb.appendChild(playIcon);

    card.appendChild(thumb);

    var meta = document.createElement('div');
    meta.className = 'battle-video-meta';

    var title = document.createElement('div');
    title.className = 'battle-video-title';
    title.textContent = tour.name;
    meta.appendChild(title);

    var sub = document.createElement('div');
    sub.className = 'battle-video-sub';
    sub.textContent = tour.type + ' from the American Battlefield Trust';
    meta.appendChild(sub);

    var fallback = document.createElement('a');
    fallback.className = 'battle-video-fallback';
    fallback.href = 'https://www.youtube.com/watch?v=' + tour.youtubeId;
    fallback.target = '_blank';
    fallback.rel = 'noopener';
    fallback.textContent = 'Watch on YouTube ↗';
    fallback.addEventListener('click', function(e) { e.stopPropagation(); });
    meta.appendChild(fallback);

    card.appendChild(meta);

    var activate = function() { expandBattleVideoCard(card, tour, offline); };
    card.addEventListener('click', activate);
    card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activate();
        }
    });

    slot.appendChild(card);
}

function expandBattleVideoCard(card, tour, offline) {
    if (card.classList.contains('battle-video-expanded')) return;
    card.classList.add('battle-video-expanded');

    var thumb = card.querySelector('.battle-video-thumb');
    if (!thumb) return;

    if (offline) {
        var msg = document.createElement('div');
        msg.className = 'battle-video-offline';
        msg.textContent = 'Videos require an internet connection. Use the Watch on YouTube link.';
        clearChildren(thumb);
        thumb.appendChild(msg);
        return;
    }

    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/' + tour.youtubeId + '?autoplay=1&rel=0';
    iframe.title = tour.name + ' video';
    iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', 'true');
    clearChildren(thumb);
    thumb.appendChild(iframe);
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

// ============================================================
// v3.15: navbar reading-level pills + mid-game re-render
// ============================================================

function initNavbarReadingPills() {
    var pills = document.querySelectorAll('.reading-pills .reading-pill');
    pills.forEach(function(pill) {
        pill.addEventListener('click', function() {
            var level = pill.getAttribute('data-level');
            setReadingLevelEverywhere(level);
        });
    });
}

function setReadingLevelEverywhere(level) {
    if (level !== 'extra' && level !== 'beginner' && level !== 'intermediate' && level !== 'advanced') return;

    if (typeof gameState !== 'undefined' && gameState) {
        gameState.difficulty = level;
    }
    if (typeof Settings !== 'undefined') {
        Settings.set('readingLevel', level);
    }

    // Sync navbar pills (aria-pressed)
    document.querySelectorAll('.reading-pills .reading-pill').forEach(function(p) {
        p.setAttribute('aria-pressed', p.getAttribute('data-level') === level ? 'true' : 'false');
    });

    // Sync start-screen pills (uses .active class + aria-checked per existing convention).
    // No canonical setDifficulty() exists in the codebase — the start-screen handler is
    // an inline closure in app.js's setupEventListeners. Manual sync is the integration point.
    document.querySelectorAll('.difficulty-pill').forEach(function(p) {
        var pillLevel = p.getAttribute('data-level') || p.getAttribute('data-difficulty');
        if (pillLevel === level) {
            p.classList.add('active');
            p.setAttribute('aria-checked', 'true');
            p.setAttribute('aria-pressed', 'true');
        } else {
            p.classList.remove('active');
            p.setAttribute('aria-checked', 'false');
            p.setAttribute('aria-pressed', 'false');
        }
    });

    // Update difficulty hint text on start screen if visible
    var difficultyHints = {
        extra: 'Easiest reading, lots of writing help, fewer choices',
        beginner: 'Shorter text, extra help with writing',
        intermediate: 'Standard text, some writing help',
        advanced: 'More detail, deeper questions, full challenge'
    };
    var hintEl = document.getElementById('difficultyHint');
    if (hintEl) hintEl.textContent = difficultyHints[level] || '';

    rerenderForReadingLevel();
}

function rerenderForReadingLevel() {
    if (typeof gameState === 'undefined' || !gameState) return;

    var screen = gameState.currentScreen;

    // Battle screen (historical mode) — uses gameState.currentBattle internally
    if (screen === 'historicalScreen' && typeof renderHistoricalBattle === 'function') {
        renderHistoricalBattle();
    } else if (screen === 'actIntroScreen' && typeof renderActIntro === 'function' &&
               typeof getActForBattle === 'function') {
        var actIdx = getActForBattle(gameState.currentBattle);
        if (actIdx !== -1) renderActIntro(actIdx);
    } else if (screen === 'actRecallScreen' && typeof renderActRecall === 'function' &&
               typeof getActForBattle === 'function') {
        var aIdx = getActForBattle(gameState.currentBattle);
        if (aIdx !== -1) renderActRecall(aIdx);
    }

    // Act review modal open? Re-render it on top of whatever screen is showing.
    var reviewModal = document.getElementById('actReviewOverlay');
    if (reviewModal &&
        (reviewModal.style.display === 'flex' || reviewModal.style.display === 'block') &&
        typeof openActReview === 'function' &&
        typeof getActForBattle === 'function') {
        var rIdx = getActForBattle(gameState.currentBattle);
        if (rIdx !== -1) openActReview(rIdx);
    }
}

function showNavbarReadingPills() {
    var el = document.getElementById('navbarReadingLevel');
    if (el) el.style.display = '';
}

function hideNavbarReadingPills() {
    var el = document.getElementById('navbarReadingLevel');
    if (el) el.style.display = 'none';
}

// Boot: wire navbar pills + restore saved reading level
function initReadingLevelOnBoot() {
    initNavbarReadingPills();

    if (typeof Settings !== 'undefined') {
        var savedLevel = Settings.get('readingLevel');
        if (savedLevel) {
            if (typeof gameState !== 'undefined' && gameState) {
                gameState.difficulty = savedLevel;
            }
            document.querySelectorAll('.reading-pills .reading-pill').forEach(function(p) {
                p.setAttribute('aria-pressed', p.getAttribute('data-level') === savedLevel ? 'true' : 'false');
            });
            document.querySelectorAll('.difficulty-pill').forEach(function(p) {
                var pillLevel = p.getAttribute('data-level') || p.getAttribute('data-difficulty');
                if (pillLevel === savedLevel) {
                    p.classList.add('active');
                    p.setAttribute('aria-checked', 'true');
                    p.setAttribute('aria-pressed', 'true');
                } else {
                    p.classList.remove('active');
                    p.setAttribute('aria-checked', 'false');
                    p.setAttribute('aria-pressed', 'false');
                }
            });
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReadingLevelOnBoot);
} else {
    initReadingLevelOnBoot();
}
