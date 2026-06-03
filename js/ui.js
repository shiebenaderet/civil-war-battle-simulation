// UI/DOM manipulation for Civil War Battle Simulation v3.1
// Handles screen transitions, rendering, and all DOM interactions

// ============================================================
// Screen Management
// ============================================================

var screens = {};

function cacheScreens() {
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
    var preGameScreens = ['modeSelection', 'sideSelection', 'leaderLetterScreen'];
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

    // v3.18: navbar act label lives on the battle screens (historical + freeplay
    // briefing). Those renderers show it; hide it everywhere else so it never lingers.
    if (screenId !== 'historicalScreen' && screenId !== 'freeplayBriefing') {
        var navActLabel = document.getElementById('navbarActLabel');
        if (navActLabel) navActLabel.style.display = 'none';
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
    var unionCardEl = document.getElementById('unionCard');
    var confedCardEl = document.getElementById('confederacyCard');
    var startActions = document.getElementById('setupStartActions');

    if (gameState.mode === 'historical') {
        // v3.18: Historical Mode is Union-only — hide the side picker, auto-select Union.
        // The hidden side cards used to be the only way to start, so we show an
        // explicit Begin button instead.
        title.textContent = 'Welcome, Commander';
        subtitle.textContent = 'You will lead the Union through the war. Enter your name and choose your reading level.';
        unionCount.textContent = '';
        confCount.textContent = '';
        nameSection.style.display = 'block';
        difficultySection.style.display = '';
        if (unionCardEl) unionCardEl.style.display = 'none';
        if (confedCardEl) confedCardEl.style.display = 'none';
        if (startActions) startActions.style.display = '';
        gameState.side = 'union';

        // Clear inputs
        var firstName = document.getElementById('firstNameInput');
        var lastInitial = document.getElementById('lastInitialInput');
        if (firstName) firstName.value = '';
        if (lastInitial) lastInitial.value = '';
        var codeInput = document.getElementById('classCodeInput');
        if (codeInput) {
            var saved = firebaseLeaderboard.getSavedClassCode();
            if (saved) codeInput.value = saved.toUpperCase();
        }
        // Auto-focus first name
        if (firstName) setTimeout(function() { firstName.focus(); }, 100);
    } else {
        title.textContent = 'Choose Your Side';
        subtitle.textContent = 'Command your chosen side through ' + battles.length + ' major battles';
        unionCount.textContent = 'Starting Army: 1,500,000 soldiers';
        confCount.textContent = 'Starting Army: 1,000,000 soldiers';
        nameSection.style.display = 'none';
        difficultySection.style.display = 'none';
        if (unionCardEl) unionCardEl.style.display = '';
        if (confedCardEl) confedCardEl.style.display = '';
        if (startActions) startActions.style.display = 'none';
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
    var input = document.getElementById('classCodeInput');
    if (!input) return '';
    var code = String(input.value || '').toLowerCase().trim();
    var period = firebaseLeaderboard.periodForRoom(code);
    if (!period) return '';
    // Side effect: persist the validated code so app.js can use it for writes.
    firebaseLeaderboard.saveClassCode(code);
    return period;
}

// True only when the student TYPED something that is not a valid class code.
// A blank field is NOT invalid (playing untracked is allowed); a typo IS.
function classCodeEntryIsInvalid() {
    var input = document.getElementById('classCodeInput');
    if (!input) return false;
    var code = String(input.value || '').trim();
    if (!code) return false; // blank is fine
    return !firebaseLeaderboard.periodForRoom(code.toLowerCase());
}

// Toggle the inline "code not recognized" message under the class-code box.
function showClassCodeError(show) {
    var err = document.getElementById('classCodeError');
    if (err) err.style.display = show ? 'block' : 'none';
    var input = document.getElementById('classCodeInput');
    if (input) {
        input.classList.toggle('input-error', !!show);
        if (show) { try { input.focus(); } catch (e) {} }
    }
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
            "I need you on the ground, someone who can witness the events of this war firsthand, from the first shots at Fort Sumter to whatever end Providence has in store. You will visit 13 battlefields across our divided nation.",
            "At each site, you will review the intelligence available to our commanders, weigh the decisions they faced, learn what actually happened, and hear from the people who lived through it. I ask that you record your honest thoughts at every step.",
            "This will not be easy. War never is. But understanding what happened, and why, is the duty of every citizen who wishes to preserve this Union and the idea that all people are created equal."
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

    // v3.20: TTS — read-aloud the full commander's letter (high value for struggling readers).
    body.classList.add('tts-readable');
    body.setAttribute('data-tts-label', 'Letter from your commander');

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

// 3-way tab switch for the post-battle "Learn More" panel.
function switchLearnTab(clickedTab, showId) {
    var tabs = clickedTab.parentElement.querySelectorAll('.visual-tab');
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
    clickedTab.classList.add('active');
    var bodies = ['learnBigPicture', 'learnVoice', 'learnTech'];
    for (var j = 0; j < bodies.length; j++) {
        var el = document.getElementById(bodies[j]);
        if (el) el.style.display = (bodies[j] === showId) ? '' : 'none';
    }
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
            extra: "After Shiloh, Grant said the only way to save the country was to completely beat the South, not just win one battle. Why do you think seeing so much fighting changed how he thought about the war?",
            beginner: "After Shiloh, Grant said the only way to save the country was to completely beat the South, not just win one battle. Why do you think seeing so much fighting changed how he thought about the war?",
            intermediate: "After Shiloh, Grant wrote that he gave up all hope of saving the Union except by 'complete conquest.' Why do you think such a terrible battle changed his thinking about how the war needed to be fought?",
            advanced: "After Shiloh, Grant wrote that he abandoned all hope of saving the Union 'except by complete conquest.' How did the unprecedented scale of violence at Shiloh reshape military thinking about the war's nature? What does Grant's evolution from expecting a short war to embracing 'complete conquest' reveal about how warfare transforms those who wage it?"
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
        },
        helpers: {"reflection":{"extra":["Grant saw so many soldiers hurt at Shiloh that it made him feel ______, so he decided the only way to win was to ______."],"beginner":["At Shiloh, Grant saw fighting that was much worse than he expected, and afterward he wanted to beat the whole South, not just win one battle.","What might Grant have seen or felt at Shiloh that made him decide one small win would not be enough to end the war?"],"intermediate":["Before Shiloh, how did many people think the war would go, and how was the real battle different?","How might seeing a battle that bloody change what a general believes is needed to actually win?","What is the difference between winning one battle and completely beating the other side, and why might Shiloh push Grant toward the second idea?","If a quick, easy victory was no longer possible, what would the Union have to be willing to do instead?"],"advanced":["What evidence from Shiloh (its casualties, its surprise, its scale) best explains why Grant abandoned hope of an easy, limited victory?","Grant shifted from expecting a short war to demanding 'complete conquest.' What specific realization could justify such a dramatic change in strategy?","How might 'complete conquest' as a goal change not just battles, but how the entire war was fought and who it affected?","Does Grant's change show clear-eyed realism, hardening from trauma, or both, and what evidence would you use to argue your view?","Stuck? Pick ONE question, take a clear position on whether Shiloh changed Grant, and back it with one specific detail (the casualties, the surprise attack, or his own words about \"complete conquest\")."]},"unionWin":{"extra":["One way Act I helped the Union win was that the North saw the war would be ______, so it used its bigger ______ to slowly beat the South."],"beginner":["In Act I, the North learned the hard way that the war would be long and bloody, which made them get more serious about winning.","What did the Union have more of (like people, factories, or supplies) that would help them more in a long war than a short one?"],"intermediate":["How could learning early that the war would be long actually help the Union in the end?","Why might the Union's larger population and industry matter more in a long war than in a quick one?","How did the shock of Shiloh change the way Union leaders planned to fight, and how could that lead to victory later?","If the South could not win one big quick battle to end things, why did time start to favor the Union?"],"advanced":["Why might the painful lessons of Bull Run and Shiloh have strengthened the Union's long-term path to victory rather than weakened it?","How did the Union's advantages in population and industry become decisive only once both sides accepted the war would be long?","What is the connection between Grant's turn toward 'complete conquest' and the kind of war the Union would need to fight to win?","Which Act I event do you think most shaped the Union's eventual victory, and what evidence supports choosing it over the others?","Stuck? Name ONE Union advantage (people, industry, or the lesson that the war would be long), then explain with a specific reason how it would matter more over time."]}}
    },
    {
        theme: 'The Human Cost',
        battleRange: 'Antietam, Fredericksburg, and Chancellorsville',
        prompt: {
            extra: "Lee won a huge battle, but he lost his best general, Stonewall Jackson. Was this victory worth it? When can winning still feel like losing?",
            beginner: "Lee won a huge battle, but he lost his best general, Stonewall Jackson. Was this victory worth it? When can winning still feel like losing?",
            intermediate: "Lee's greatest victory cost him Stonewall Jackson. When is a victory not worth the price?",
            advanced: "Chancellorsville is often called Lee's masterpiece, yet it cost him Jackson, arguably the Confederacy's single most irreplaceable asset. How do we evaluate a tactical triumph that inflicts strategic damage on the victor? Consider the concept of a 'Pyrrhic victory': when does the cost of winning exceed the benefit?"
        },
        teacherTip: {
            extra: "Pick one person from these battles. How was their life changed by the war?",
            beginner: "Pick one person you read about: Clara Barton, an Irish soldier, an enslaved person. What was their experience? How was the war personal for them?",
            intermediate: "Think about who had power and who didn't. Who made the big decisions, and who paid the price? The Emancipation Proclamation is a good example: who did it help, and who was left out?",
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
        },
        helpers: {"reflection":{"extra":["Lee won the battle but lost Stonewall Jackson, so I think the victory was ______ because ______."],"beginner":["At Chancellorsville, Lee won the battle, but his best general, Stonewall Jackson, was shot by his own men and died. To start your answer, you could write: \"Lee's victory was worth it / not worth it because ______.\" Brainstorm: if you won a game but your best teammate got hurt so badly they could never play again, would that win still feel like a win to you?"],"intermediate":["How did losing Stonewall Jackson change what Lee could do in the battles that came AFTER Chancellorsville?","Lee called Jackson his 'right arm.' What does a general lose when he loses someone he trusts that much?","Compare two things: the land or battle Lee gained at Chancellorsville versus the general he lost. Which one is harder to replace?","When you weigh a victory, should you only count what you won that day, or also what you'll be missing tomorrow?"],"advanced":["Chancellorsville gained Lee no territory he kept and no destroyed enemy army, yet cost him his most irreplaceable commander. By what measure can we still call it a 'masterpiece,' and by what measure is it a defeat?","A 'Pyrrhic victory' is a win whose cost outweighs its reward. What specific evidence from the months after Chancellorsville (think Gettysburg) would you use to argue Jackson's loss was that costly?","Tactical success means winning the battle; strategic damage means weakening your whole war effort. How can the same event be both at once, and which one decides the war?","If you were Lee's advisor, how would you measure whether a single soldier's life and skill 'outweighs' capturing a battlefield? What standard would you set?","Stuck? Decide whether you think Chancellorsville was worth it, then defend it with one concrete consequence  -  for example, what Lee could no longer do without Jackson at Gettysburg two months later."]},"unionWin":{"extra":["One way Act II helped the Union win was the Battle of Antietam, because it let President Lincoln issue the ______, which changed the war to also be about ending ______.","After the Emancipation Proclamation, the Union got stronger because ______ could now join the army."],"beginner":["After Antietam, Lincoln issued the Emancipation Proclamation, which added ending slavery as a reason for the war.","How could giving the war a bigger purpose, and letting freed people join the army, make the Union stronger?"],"intermediate":["How did the Emancipation Proclamation change WHY the North was fighting, not just whether it was winning battles?","Once Black soldiers could join the Union army, how did that change the size and strength of the North's forces?","Britain and France were thinking about helping the South. After the war became about ending slavery, why would those countries back away?","Which matters more for winning a long war: capturing land, or changing what the war stands for? Why?"],"advanced":["Antietam was barely a Union victory on the battlefield, yet it produced the Emancipation Proclamation. How can a militarily weak win still be a strategic turning point?","Evaluate three effects of the Proclamation, new soldiers, a moral cause, and blocked foreign help. Which one did the most to push the Union toward winning?","The Proclamation reframed the war as a fight against slavery. Why did that make it politically impossible for Britain and France to support the Confederacy?","Some say the North could have won by force alone. Use the foreign-policy and manpower consequences of Antietam to argue whether the Proclamation was necessary, not just helpful.","Stuck? Pick ONE effect of the Emancipation Proclamation (new soldiers, a moral cause, or blocking foreign help) and argue why that one did the most to help the Union win."]}}
    },
    {
        theme: 'Turning Points',
        battleRange: 'Vicksburg, Gettysburg, and Chickamauga',
        prompt: {
            extra: "One mixed-up order created the gap that lost the whole battle. How much of war comes down to luck or mistakes versus actual skill and planning?",
            beginner: "One mixed-up order created the gap that lost the whole battle. How much of war comes down to luck or mistakes versus actual skill and planning?",
            intermediate: "A simple miscommunication created the gap that lost the battle. How much of war depends on luck versus skill?",
            advanced: "A single miscommunicated order created the gap that enabled the Confederate breakthrough. To what extent does this illustrate the role of chance versus planning in warfare? The Prussian theorist Clausewitz called this 'friction': the unpredictable factors that make real war chaotic. How do modern militaries attempt to reduce the impact of such friction?"
        },
        teacherTip: {
            extra: "Think about who was winning before these battles and who was winning after.",
            beginner: "What was different about the war before and after these battles? Try comparing who was winning before to who was winning after.",
            intermediate: "A 'turning point' doesn't mean the war was over. Chickamauga proved that. What changed strategically, and what stayed the same? Think about both sides.",
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
        },
        helpers: {"reflection":{"extra":["I think war comes down more to ______ than to ______, because at this battle one mixed-up order accidentally ______."],"beginner":["At Chickamauga, one mixed-up order opened a gap in the line, and the Confederates poured through it.","Do you think a battle should be decided by one small mistake like that, or should skill and planning matter more?"],"intermediate":["The gap at Chickamauga came from a mistaken order, not a bad plan. How does that change who you think 'deserved' to win?","If a general plans carefully but one messenger gets the order wrong, how much of the outcome was really up to him?","Think of a time a small mistake in a game or sport changed everything. How is war similar to or different from that?","Which do you think a general can control more: luck, or the quality of their planning?"],"advanced":["Clausewitz called the chaos of real war 'friction.' What evidence from Chickamauga shows friction at work rather than a flaw in either side's plan?","Could better planning have prevented the mixed-up order, or are some mistakes simply unavoidable once thousands of people are involved? Defend your position.","Historians debate whether to credit Confederate skill or Union error for the breakthrough. Which interpretation does the evidence support more strongly, and why?","Modern militaries use redundant communication, clear chains of command, and rehearsals to fight friction. Which of these would have most likely prevented the Chickamauga gap, and could it have worked?","Stuck? Take a side on luck versus skill, then anchor it in the Chickamauga evidence  -  was the gap caused by a mistake no plan could prevent, or by a failure that better planning would have caught?"]},"unionWin":{"extra":["One way this act helped the Union win was capturing ______, which gave the Union control of the ______ River and split the Confederacy in two."],"beginner":["At Vicksburg the Union took control of the Mississippi River, and at Gettysburg they stopped Lee from invading the North.","Why would controlling a huge river or stopping an invasion give the Union a big advantage?"],"intermediate":["The Union won at both Vicksburg and Gettysburg in the same week. How might two wins so close together affect each side's confidence?","Vicksburg cut the Confederacy in two along the Mississippi. How would splitting an enemy in half make it harder for them to fight?","Before Gettysburg, Lee was on the attack in the North. How does forcing an enemy to stop attacking change the war?","Which do you think mattered more for the Union: the river at Vicksburg or stopping Lee at Gettysburg? Why?"],"advanced":["Vicksburg and Gettysburg are often called the war's turning point. What specific evidence shows momentum actually shifted to the Union after them?","Vicksburg split the Confederacy geographically while Gettysburg ended Lee's offensive power. Which type of advantage was harder for the South to recover from, and why?","Could the Confederacy have realistically won the war after losing both battles in July 1863? Build an argument using their resources and options.","Battles can have military effects and morale effects. For Vicksburg and Gettysburg, which kind of effect did the most to help the Union win in the long run?","Stuck? Choose Vicksburg OR Gettysburg, state what advantage it gave the Union (control of the Mississippi, or ending Lee's invasions), and explain why the South could not recover from it."]}}
    },
    {
        theme: "The War's Legacy",
        battleRange: 'Wilderness, Atlanta, Sherman\'s March, and Appomattox',
        prompt: {
            extra: "Grant let the Confederate soldiers go home in peace. Five days later, Lincoln was killed. How might things have been different if Lincoln had lived? When a war ends, what does a country owe to the people who suffered?",
            beginner: "Grant let the Confederate soldiers go home in peace. Five days later, Lincoln was killed. How might things have been different if Lincoln had lived? When a war ends, what does a country owe to the people who suffered?",
            intermediate: "Grant offered generous surrender terms: Confederates could go home and would not be prosecuted. Five days later, Lincoln was assassinated. How might Reconstruction have been different if Lincoln had lived? What responsibilities does a nation have to its people when a war ends?",
            advanced: "Grant's generous terms embodied Lincoln's vision of reconciliation: 'with malice toward none, with charity for all.' Five days later, Lincoln's assassination placed Reconstruction in the hands of Andrew Johnson, a figure far less sympathetic to Black rights. How might Reconstruction have differed under Lincoln's leadership? More broadly, how do nations balance the competing imperatives of reconciliation with former enemies and justice for those who suffered? Consider modern examples of post-conflict societies grappling with these same questions."
        },
        teacherTip: {
            extra: "Think about a soldier, a freed person, and a Southern family. How would each one answer: was the war worth it?",
            beginner: "Think about different people: a Union soldier, a freed person, a Southern family. How would each of them answer: 'Was the war worth it?'",
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
        },
        helpers: {"reflection":{"extra":["Lincoln was killed just ______ days after the South gave up. If Lincoln had lived, I think the freed people would have been treated more ______, and a country owes the people who suffered ______."],"beginner":["Grant let the beaten Confederate soldiers go home in peace, the way Lincoln wanted. Then Lincoln was shot, and a new president took over.","If Lincoln had stayed alive to lead the country, what is one thing he might have done differently for the people leaving slavery, and what do you think a country owes the people who suffered most in a war?"],"intermediate":["Lincoln wanted to forgive the South gently, and Grant followed that at Appomattox. How might the years after the war (Reconstruction) have gone differently if Lincoln, not Andrew Johnson, had been making the decisions?","Four million people had just been freed from slavery. When a war ends, what should a nation do for the people who suffered the most during it?","Compare two goals that pulled against each other: making peace with the South, and getting justice for formerly enslaved people. Can a country fully do both at the same time?","Grant offered soldiers mercy and a way home. Does mercy toward the people who started a war make a lasting peace more likely, or does it let old problems survive?"],"advanced":["Lincoln spoke of 'malice toward none, with charity for all,' yet Andrew Johnson resisted protecting Black rights. What evidence from the surrender terms and from Lincoln's stated vision would support an argument that Reconstruction would have been more just under Lincoln, and what evidence might cut against that?","Reconciliation with former enemies and justice for the people who suffered can be competing goals. Make an argument about which one a nation should prioritize first when a war ends, and defend it.","How much did one man's death actually change history here, versus the larger forces (a hostile Congress, Southern resistance, Northern fatigue) that would have shaped Reconstruction no matter who was president?","Pick a modern post-conflict society (for example South Africa after apartheid, or postwar Germany). What does its attempt to balance reconciliation and justice reveal about whether Lincoln's approach could have succeeded?","Stuck? Take a position on whether Lincoln's death changed history, then support it with one specific contrast between Lincoln's stated vision (\"malice toward none\") and what Andrew Johnson actually did."]},"unionWin":{"extra":["One way this act helped the Union win: General ______ kept attacking and never let the South rest, and Sherman ______ the South's farms and supplies so its army could not keep ______."],"beginner":["In the last year of the war, Grant kept up the pressure while Sherman marched through the South destroying the food, railroads, and supplies the Confederate army needed.","Out of Grant's nonstop fighting, Sherman's destruction, or the fall of Atlanta helping Lincoln get re-elected, which one would you pick as the way this act helped the Union win, and why?"],"intermediate":["Grant kept attacking even after heavy losses instead of retreating. How did refusing to pull back wear the South down over time?","Sherman destroyed farms, railroads, and factories on his march. How does wrecking supplies hurt an army that still has soldiers willing to fight?","Atlanta fell right before the 1864 election and helped Lincoln win. Why did keeping Lincoln in office matter for finishing the war?","Of Grant's pressure, Sherman's destruction, and Lincoln's re-election, which one do you think mattered most to the Union victory, and what makes you say so?"],"advanced":["Grant traded huge casualties for constant pressure on Lee. Build an argument for why that grinding strategy, rather than a single decisive battle, is what actually broke the Confederacy.","Sherman's 'total war' targeted the South's ability to supply its army, not just its troops. Evaluate the claim that destroying an enemy's resources can matter more than winning battles.","Atlanta's fall secured Lincoln's re-election over a peace candidate. Make the case that this political result was as important to Union victory as any military one.","Weigh military causes (Grant, Sherman) against political ones (the election) for the Union's win in this act. Which kind of cause was more decisive, and what evidence supports your judgment?","Stuck? Pick ONE cause  -  Grant's pressure, Sherman's destruction, or Atlanta's fall helping Lincoln win re-election  -  take a side on which mattered most, and back it with a specific result."]}}
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

    // v3.20: TTS — read-aloud the act setup narration (independent of the fade-in below).
    positioningEl.classList.add('tts-readable');
    positioningEl.setAttribute('data-tts-label', 'Act introduction');

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

// v3.18: Always-visible key-idea takeaway, shown to EVERY tier in sectionHappened.
// Sources the per-tier keyIdea (the battle's real significance, the same field the
// handout "why it mattered" box expects), so the takeaway is never hidden -- fixing
// the old gap where low tiers never saw it.
function populateKeyIdeaCallout() {
    var callout = document.getElementById('keyIdeaCallout');
    var textEl = document.getElementById('keyIdeaText');
    if (!callout || !textEl) return;
    var content = getHistoricalContent();
    var keyIdea = content && content.keyIdea;
    if (!keyIdea || !String(keyIdea).trim()) {
        callout.style.display = 'none';
        return;
    }
    applyGlossary(textEl, keyIdea);
    callout.style.display = '';
    // TTS: make the key idea readable aloud, consistent with other narrative text.
    textEl.classList.add('tts-readable');
    textEl.setAttribute('data-tts-label', 'Key idea');
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
    var reported = false;

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
        reported = false;
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
            // v3.22: record first-try outcome once per question for the teacher's
            // Question-difficulty view. firstTry is true only if no prior wrong answer.
            if (!reported) {
                reported = true;
                if (typeof reportRecallResultToDashboard === 'function') {
                    reportRecallResultToDashboard(actIndex, questionIdx, wrongAttempts === 0, true, wrongAttempts + 1);
                }
            }
            document.getElementById('actRecallContinueBtn').disabled = false;
            return;
        }

        // WRONG
        wrongAttempts++;
        btnEl.classList.add('selected-wrong');
        btnEl.disabled = true;

        if (wrongAttempts === 1) {
            // First wrong: nudge, retry allowed.
            // v3.22: record the first-try miss once for the Question-difficulty view.
            if (!reported) {
                reported = true;
                if (typeof reportRecallResultToDashboard === 'function') {
                    reportRecallResultToDashboard(actIndex, questionIdx, false, false, 1);
                }
            }
            feedbackEl.className = 'act-recall-feedback feedback-nudge';
            setFeedback(feedbackEl, 'Not quite. Try again.',
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
    // v3.18: also drive the centered navbar act label (separator is a middot, not an em dash)
    (function populateBattleDateline() {
        const battleIndex = gameState.currentBattle;
        if (typeof battleIndex !== 'number' || !battles[battleIndex]) return;

        let datelineText = '';
        if (typeof getActForBattle === 'function') {
            const actIndex = getActForBattle(battleIndex);
            if (actIndex !== -1 && typeof acts !== 'undefined' && acts[actIndex]) {
                datelineText = 'Act ' + acts[actIndex].number + ' · ' + acts[actIndex].years;
            }
        }
        if (!datelineText) {
            datelineText = String(battles[battleIndex].year || '');
        }

        // v3.18: navbar act label (centered, opens campaign log on click)
        var navAct = document.getElementById('navbarActLabel');
        if (navAct) {
            navAct.textContent = datelineText;
            navAct.style.display = datelineText ? '' : 'none';
        }

        // Legacy in-battle datelines (markup removed in v3.18; early-return if absent)
        const datelines = document.querySelectorAll('.battle-act-dateline');
        if (datelines.length === 0) return;
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
    applyGlossary(histSituationEl, content.situation);
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
    applyGlossary(histWhatHappenedEl, content.whatHappened);
    // v3.15: TTS — mark the outcome narrative as readable.
    histWhatHappenedEl.classList.add('tts-readable');
    histWhatHappenedEl.setAttribute('data-tts-label', 'What Really Happened');
    document.getElementById('histOutcome').textContent = content.outcome;

    var totalCasualties = content.casualties.union + content.casualties.confederacy;
    document.getElementById('histCasualties').textContent =
        'Casualties: ' + totalCasualties.toLocaleString() +
        ' (Union: ' + content.casualties.union.toLocaleString() +
        ', Confederate: ' + content.casualties.confederacy.toLocaleString() + ')';

    // Technology Spotlight now lives in the Learn More tab panel — shown for all tiers.
    var techNameEl = document.getElementById('histTechName');
    if (techNameEl) techNameEl.textContent = content.tech.name;
    var techDescEl = document.getElementById('histTechDesc');
    if (techDescEl) {
        applyGlossary(techDescEl, content.tech.description);
        // v3.20: TTS — read-aloud the technology spotlight description.
        techDescEl.classList.add('tts-readable');
        techDescEl.setAttribute('data-tts-label', 'Technology spotlight');
    }

    // Battlefield Tours: post-battle video card for this battle
    renderBattleVideoCard(battles[gameState.currentBattle].id, 'histBattleVideoSlot');

    // --- Section 5: A Voice From the War ---
    applyGlossary(document.getElementById('histVoiceQuote'), content.voice.quote);
    // v3.20: TTS \u2014 read-aloud this primary-source quote (glossary spans are stripped before reading).
    var histVoiceQuoteEl = document.getElementById('histVoiceQuote');
    if (histVoiceQuoteEl) {
        histVoiceQuoteEl.classList.add('tts-readable');
        histVoiceQuoteEl.setAttribute('data-tts-label', 'Voice from the war');
    }
    document.getElementById('histVoiceAttribution').textContent = '- ' + content.voice.attribution;
    document.getElementById('histVoiceSource').textContent = content.voice.source;

    // Voice explainer (beginner/ES level)
    var explainerEl = document.getElementById('histVoiceExplainer');
    if (content.voice.explainer && isLowReadingTier) {
        explainerEl.textContent = '\uD83D\uDCA1 In simpler words: ' + content.voice.explainer;
        explainerEl.style.display = 'block';
        // v3.20: TTS \u2014 read-aloud the plain-English version (only in the branch where it's shown).
        explainerEl.classList.add('tts-readable');
        explainerEl.setAttribute('data-tts-label', 'In simpler words');
    } else {
        explainerEl.style.display = 'none';
    }

    // --- Section 6: The Bigger Picture (now a Learn More tab) ---
    var histBigPictureEl = document.getElementById('histBigPicture');
    applyGlossary(histBigPictureEl, content.biggerPicture);
    // v3.15: TTS — mark the reflection-from-history paragraph as readable.
    histBigPictureEl.classList.add('tts-readable');
    histBigPictureEl.setAttribute('data-tts-label', 'The Bigger Picture');

    // v3.19: "Did You Know" key-fact box removed — the Key Idea callout carries the takeaway.

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
    document.getElementById('sectionLearnMore').style.display = 'none';
    document.getElementById('sectionReflect').style.display = 'none';
    var nudgeFeedback = document.getElementById('noteNudgeFeedback');
    if (nudgeFeedback) nudgeFeedback.style.display = 'none';
    var nudgeOutcome = document.getElementById('noteNudgeOutcome');
    if (nudgeOutcome) nudgeOutcome.style.display = 'none';
    var nudgeReflection = document.getElementById('noteNudgeReflection');
    if (nudgeReflection) nudgeReflection.style.display = 'none';
    var keyIdeaCalloutReset = document.getElementById('keyIdeaCallout');
    if (keyIdeaCalloutReset) keyIdeaCalloutReset.style.display = 'none';
    document.getElementById('teacherTip').style.display = 'none';

    // Button text
    document.getElementById('narrativeContinueBtn').textContent = 'Continue';
    document.getElementById('narrativeContinueBtn').disabled = false;

    showScreen('historicalScreen');
    showGameActions(true);
    showCampaignLogBtn(true);

    // Show the help bar on first battle
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

// Render one tier-graduated helper box. helperData is a per-helper object
// { extra:[...], beginner:[...], intermediate:[...], advanced:[...] }.
function renderReflectHelper(boxId, helperData) {
    var box = document.getElementById(boxId);
    if (!box) return;
    var headEl = box.querySelector('.reflect-helper-head');
    var listEl = box.querySelector('.reflect-helper-list');
    if (!headEl || !listEl || !helperData) { box.style.display = 'none'; return; }

    var tier = (typeof resolveDifficulty === 'function') ? resolveDifficulty(helperData) : 'intermediate';
    var lines = helperData[tier] || helperData.extra || helperData.beginner || helperData.intermediate;
    if (!lines || !lines.length) { box.style.display = 'none'; return; }

    // Frame tiers (extra/beginner) get "try this"; question tiers get "think about these".
    var isFrame = (tier === 'extra' || tier === 'beginner');
    headEl.textContent = isFrame
        ? 'Not sure what to write? Try this:'
        : 'Not sure what to write? Think about these:';

    // Clear the list AND any prior Stuck footer (re-render safe).
    while (listEl.firstChild) listEl.removeChild(listEl.firstChild);
    var oldStuck = box.querySelector('.reflect-helper-stuck');
    if (oldStuck) oldStuck.parentNode.removeChild(oldStuck);

    lines.forEach(function(line) {
        if (/^Stuck\?/.test(line)) {
            // The Extra Challenge thinking-move footer: set apart, not a bullet.
            var foot = document.createElement('div');
            foot.className = 'reflect-helper-stuck';
            applyGlossary(foot, line);
            box.appendChild(foot);
            return;
        }
        var li = document.createElement('li');
        applyGlossary(li, line);
        listEl.appendChild(li);
    });
    box.style.display = '';
}

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

    var helpers = group.helpers || {};
    renderReflectHelper('reflectHelperReflection', helpers.reflection);
    renderReflectHelper('reflectHelperUnion', helpers.unionWin);

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
// Guided Help System (help bar)
// ============================================================


var helpTips = {
    historical: [
        'Read the intel report and situation, then click Continue.',
        'Choose what YOU would do: pick an option, then click Continue.',
        'See how your choice compared to what really happened.',
        'Read what actually unfolded on the battlefield. Take your time!',
        'Hear from someone who was there, and what it meant in the bigger picture.',
        'Write your reflection using the prompt. Use the sentence starters if you need help getting started.'
    ],
    freeplay: [
        'Choose a strategy for this battle. Consider the terrain, your momentum, and the difficulty.'
    ]
};


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

// v3.18: tutorial overlay removed — first battle just shows the lightweight help bar.
function maybeStartTutorial(mode) {
    showHelpBar(mode);
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
                    applyGlossary(detailEl, feedbackList[wwydSelected]);
                    // v3.15: TTS — read the explanatory feedback paragraph.
                    detailEl.classList.add('tts-readable');
                    detailEl.setAttribute('data-tts-label', 'Choice feedback');
                }
                feedbackEl.style.display = 'block';
                targetSection = feedbackEl;
            }

            // Hide later sub-sections in case they were visible from a prior re-render
            document.getElementById('sectionHappened').style.display = 'none';
            document.getElementById('sectionLearnMore').style.display = 'none';

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
            populateKeyIdeaCallout();
            break;

        case 4:
            // REFLECTION FROM HISTORY sub-step: show the tabbed Learn More panel.
            updateStepPills(narrativeStep);

            var learnMore = document.getElementById('sectionLearnMore');
            learnMore.style.display = 'block';
            targetSection = learnMore;

            // Reset to the default tab (The Bigger Picture) for each battle.
            var lmTabs = learnMore.querySelectorAll('.visual-tab');
            for (var li = 0; li < lmTabs.length; li++) lmTabs[li].classList.remove('active');
            if (lmTabs[0]) lmTabs[0].classList.add('active');
            document.getElementById('learnBigPicture').style.display = '';
            document.getElementById('learnVoice').style.display = 'none';
            document.getElementById('learnTech').style.display = 'none';

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

    // Visitor guest book. Students with a valid class code are already located
    // for the teacher via the dashboard, so they see the world map but get no
    // sign form (no redundant pin). Untracked players get the full sign form.
    var gbSection = document.getElementById('guestbookSection');
    if (gbSection && typeof buildGuestbookForm === 'function') {
        var hasClassCode = false;
        if (typeof firebaseLeaderboard !== 'undefined') {
            hasClassCode = !!firebaseLeaderboard.periodForRoom(firebaseLeaderboard.getSavedClassCode());
        }
        buildGuestbookForm(gbSection, !hasClassCode);
    }

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
                datelineText = 'Act ' + acts[actIndex].number + ' · ' + acts[actIndex].years;
            }
        }
        if (!datelineText) {
            datelineText = String(battles[battleIndex].year || '');
        }

        datelines.forEach(function(el) { el.textContent = datelineText; });

        // v3.20: also drive the persistent navbar act label (shown in Historical;
        // was blank in Free-play). Clicking it opens the campaign log, same as Historical.
        var navAct = document.getElementById('navbarActLabel');
        if (navAct) {
            navAct.textContent = datelineText;
            navAct.style.display = datelineText ? '' : 'none';
        }
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

    // FP-6: final-battle decider banner. Only on the LAST battle, and only
    // when the war is still close (not already decided). Presentation only:
    // the 2x momentum swing is a deferred game.js change (see report).
    var deciderBanner = document.getElementById('fpDeciderBanner');
    if (deciderBanner) {
        var isLastBattle = gameState.currentBattle === battles.length - 1;
        var warIsClose = Math.abs(gameState.momentum) <= 4;
        if (isLastBattle && warIsClose) {
            document.getElementById('fpDeciderBannerText').textContent =
                'This is the decisive battle. The war hangs in the balance, and this choice could decide everything.';
            deciderBanner.style.display = 'block';
        } else {
            deciderBanner.style.display = 'none';
        }
    }

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
    var fpBriefingEl = document.getElementById('fpBriefing');
    applyGlossary(fpBriefingEl, getContent(battle.freeplay.briefing));
    // v3.20: read-aloud parity with Historical Mode
    if (fpBriefingEl) {
        fpBriefingEl.classList.add('tts-readable');
        fpBriefingEl.setAttribute('data-tts-label', 'Battle briefing');
    }

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

        // Name + description are escaped (controlled data, but stay safe). The
        // detail (densest reading) gets vocabulary tooltips via applyGlossary,
        // which escapes internally. v3.20: glossary now reaches Free-play strategy text.
        card.innerHTML =
            '<div class="strategy-name">' + escapeHtml(sName) + '</div>' +
            '<div class="strategy-description">' + escapeHtml(sDesc) + '</div>' +
            '<div class="strategy-detail"></div>';
        applyGlossary(card.querySelector('.strategy-detail'), sDetail);

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

    // Show the help bar on first battle
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
    var resultOutcomeEl = document.getElementById('resultOutcome');
    applyGlossary(resultOutcomeEl, result.outcomeText); // v3.20: vocabulary tooltips
    // v3.20: read-aloud parity with Historical Mode
    resultOutcomeEl.classList.add('tts-readable');
    resultOutcomeEl.setAttribute('data-tts-label', 'Battle result');

    // Fog of War / Historical Event display
    // FP-3: an underdog rally bonus (when the player fought while behind) also
    // surfaces in this section, alongside fog/historical modifiers.
    var hasUnderdogBonus = result.underdogBonus && result.underdogBonus > 0;
    var fogSection = document.getElementById('fogOfWarSection');
    if (fogSection) {
        if (result.fogEvent || result.histEvent || hasUnderdogBonus) {
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

            // FP-3: underdog rally bonus (only when behind, bonus > 0)
            var underdogDisplay = document.getElementById('underdogBonusDisplay');
            if (underdogDisplay) {
                if (hasUnderdogBonus) {
                    document.getElementById('underdogBonusText').textContent =
                        'Your troops fought harder while behind.';
                    document.getElementById('underdogBonusMod').textContent =
                        '+' + result.underdogBonus;
                    underdogDisplay.style.display = 'flex';
                } else {
                    underdogDisplay.style.display = 'none';
                }
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
        if (hasUnderdogBonus) {
            breakdownHtml += '<div class="power-item"><span>Underdog Rally</span><span>+' +
                result.underdogBonus + '</span></div>';
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

        applyGlossary(document.getElementById('histContextText'), getContent(battleData.historical.whatHappened)); // v3.20: vocabulary tooltips
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
    // FP-4: pass the war-end reason so an attrition defeat is reflected as a
    // forced defeat (getFreeplayResult handles 'attrition_defeat' distinctly).
    var warEndReason = advancement && advancement.reason;
    var result = getFreeplayResult(warEndReason);

    // Override with early-end message if applicable
    if (advancement && advancement.reason === 'momentum_victory') {
        result.victory = true;
        result.title = 'DECISIVE VICTORY!';
        result.subtitle = advancement.message;
    } else if (advancement && advancement.reason === 'momentum_defeat') {
        result.victory = false;
        result.title = 'DECISIVE DEFEAT';
        result.subtitle = advancement.message;
    } else if (advancement && advancement.reason === 'attrition_defeat') {
        // FP-4: army destroyed. result is already a forced defeat from
        // getFreeplayResult('attrition_defeat'); override the framing.
        result.victory = false;
        result.title = 'ARMY DESTROYED';
        result.subtitle = advancement.message || result.subtitle;
    }

    // FP-6: victory rating; FP-5: "did you change history?" comparison.
    var rating = getVictoryRating(warEndReason);
    var hist = getHistoryComparison(warEndReason);

    var banner = document.getElementById('endBanner');
    // v3.20: the banner IS the rating. The precise grade (Crushing Victory,
    // Narrow Victory, Stalemate, Defeat, Costly Defeat...) is the headline, so we
    // no longer show a generic "DEFEAT" title AND a separate "Defeat" badge below
    // it. Banner tone follows the rating, so a Stalemate reads neutral, not red.
    var bannerTone = rating.tone === 'victory' ? 'victory-banner'
        : rating.tone === 'defeat' ? 'defeat-banner'
        : 'neutral-banner';
    banner.className = 'outcome-banner ' + bannerTone;
    document.getElementById('endTitle').textContent = rating.label;
    // Subtitle: the in-character outcome line, then the rating note on its own line.
    document.getElementById('endSubtitle').innerHTML =
        '<span class="end-subtitle-main">' + escapeHtml(result.subtitle) + '</span>' +
        '<span class="end-subtitle-note">' + escapeHtml(rating.note) + '</span>';

    var startingSoldiers = gameState.side === 'union' ? 1500000 : 1000000;
    var casualtyRate = Math.round(((startingSoldiers - gameState.soldiers) / startingSoldiers) * 100);
    var sideLabel = gameState.side === 'union' ? 'Union' : 'Confederacy';

    // FP-5: "Did you change history?" comparison panel.
    var histRowsHtml = hist.points.map(function(p) {
        var marker = p.changed
            ? '<span class="hist-compare-tag changed">CHANGED</span>'
            : '<span class="hist-compare-tag matched">SAME AS HISTORY</span>';
        return '<div class="hist-compare-row ' + (p.changed ? 'is-changed' : 'is-matched') + '">' +
            '<div class="hist-compare-head">' +
            '<span class="hist-compare-label">' + escapeHtml(p.label) + '</span>' +
            marker +
            '</div>' +
            '<p class="hist-compare-you"><span class="hist-compare-who">You:</span> ' + escapeHtml(p.playerText) + '</p>' +
            '<p class="hist-compare-history"><span class="hist-compare-who">History:</span> ' + escapeHtml(p.historyText) + '</p>' +
            '</div>';
    }).join('');
    var historyPanelHtml =
        '<div class="history-compare-panel">' +
        '<h3>Did You Change History?</h3>' +
        '<p class="history-compare-highlight">' + escapeHtml(hist.highlight) + '</p>' +
        '<div class="hist-compare-rows">' + histRowsHtml + '</div>' +
        '</div>';

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
        '</div>' +
        historyPanelHtml +
        '<div class="end-summary">' +
        '<h3>Battle History</h3>' +
        '<div class="battle-history-list">' +
        gameState.battleHistory.map(function(b) {
            return '<div class="history-item ' + (b.won ? 'won' : 'lost') + '">' +
                '<span class="history-icon">' + (b.won ? '&#x2705;' : '&#x274C;') + '</span>' +
                '<span class="history-name">' + escapeHtml(b.name) + '</span>' +
                '<span class="history-strategy">' + escapeHtml(b.strategy) + '</span>' +
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
            // v3.21: an empty name no longer blocks the save. The global leaderboard
            // is meant to include anonymous players, so default to "Anonymous"
            // instead of refusing to record the score.
            var name = nameInput.value.trim() || 'Anonymous';
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
            // v3.21: and to the global leaderboard (works without a class code,
            // so anyone who finishes a game can appear).
            submitToGlobalLeaderboard(name);
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

// v3.21: Render the GLOBAL leaderboard table (view-only, in-game modal). Names
// here come from anonymous global players, so every dynamic string field is run
// through escapeHtml before it reaches innerHTML. No delete/rename controls:
// students only view this board (moderation lives in the teacher dashboard).
function renderGlobalLeaderboardTable(entries) {
    if (!entries || entries.length === 0) {
        return '<p class="scoreboard-empty">No global scores yet.</p>';
    }

    var rows = entries.map(function(entry, i) {
        var medal = i === 0 ? '&#x1F947;' : i === 1 ? '&#x1F948;' : i === 2 ? '&#x1F949;' : (i + 1);
        var sideIcon = entry.side === 'union' ? '&#x1F1FA;&#x1F1F8;' : '&#x1F3F4;';
        var victoryIcon = entry.victory ? '&#x2705;' : '&#x274C;';
        return '<tr class="scoreboard-row' + (i < 3 ? ' top-three' : '') + '">' +
            '<td class="rank-cell">' + medal + '</td>' +
            '<td class="name-cell">' + escapeHtml(String(entry.name || 'Anonymous')) + '</td>' +
            '<td class="score-cell">' + (Number(entry.score) || 0).toLocaleString() + '</td>' +
            '<td class="side-cell">' + sideIcon + '</td>' +
            '<td class="record-cell">' + (Number(entry.wins) || 0) + 'W-' + (Number(entry.losses) || 0) + 'L</td>' +
            '<td class="victory-cell">' + victoryIcon + '</td>' +
            '</tr>';
    }).join('');

    return '<table class="scoreboard-table"><thead><tr>' +
        '<th>#</th><th>Name</th><th>Score</th><th>Side</th><th>Record</th><th>Won?</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table>';
}

// ============================================================
// Visitor Guest Book + Map
// ============================================================

// Compact profanity deterrent. Not exhaustive — the teacher dashboard is the
// authoritative moderation surface. Whole-word, case-insensitive.
var GUESTBOOK_BANNED = ['fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'piss', 'bastard', 'slut', 'whore', 'nigger', 'faggot', 'retard'];

function cleanSchoolName(raw) {
    var s = String(raw == null ? '' : raw).replace(/[<>]/g, '').trim();
    if (!s) return { ok: false, cleaned: '', reason: 'Enter your school name.' };
    if (s.length > 60) s = s.substring(0, 60);
    var lower = s.toLowerCase();
    for (var i = 0; i < GUESTBOOK_BANNED.length; i++) {
        var re = new RegExp('\\b' + GUESTBOOK_BANNED[i] + '\\b', 'i');
        if (re.test(lower)) return { ok: false, cleaned: s, reason: "Let's keep it school-appropriate." };
    }
    return { ok: true, cleaned: s, reason: '' };
}

// Render guest entries as pins on the bundled world map into `container`.
// entries: [{ school, label, lat, lng, _key }]. highlightKey optional.
// XSS-safe: the only innerHTML is the trusted bundled GEO_WORLD_SVG constant;
// all entry text reaches the DOM via textContent.
function renderVisitorMap(container, entries, highlightKey) {
    if (!container) return;
    if (typeof GEO_WORLD_SVG === 'undefined') { container.textContent = 'Map unavailable.'; return; }
    var vb = (typeof GEO_WORLD_VIEWBOX !== 'undefined') ? GEO_WORLD_VIEWBOX : '0 0 1000 500';
    container.innerHTML = '';

    var SVG = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('viewBox', vb);
    svg.setAttribute('class', 'visitor-map');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Map of where players are from');

    var land = document.createElementNS(SVG, 'g');
    land.innerHTML = GEO_WORLD_SVG; // trusted constant from geo.js, not user data
    svg.appendChild(land);

    var popup = document.createElementNS(SVG, 'text');
    popup.setAttribute('class', 'visitor-map-popup');
    popup.setAttribute('text-anchor', 'middle');
    popup.style.display = 'none';

    (entries || []).forEach(function(e) {
        if (!isFinite(e.lat) || !isFinite(e.lng)) return;
        var p = geoProject(e.lat, e.lng);
        var seed = 0, key = String(e._key || (e.lat + '' + e.lng));
        for (var i = 0; i < key.length; i++) seed = (seed * 31 + key.charCodeAt(i)) >>> 0;
        var jx = ((seed % 100) / 100 - 0.5) * 10;
        var jy = (((seed >> 8) % 100) / 100 - 0.5) * 10;
        var px = p.x + jx, py = p.y + jy;
        var isHi = highlightKey && e._key === highlightKey;
        var dot = document.createElementNS(SVG, 'circle');
        dot.setAttribute('cx', px.toFixed(1));
        dot.setAttribute('cy', py.toFixed(1));
        dot.setAttribute('r', isHi ? '7' : '4');
        dot.setAttribute('class', 'visitor-pin' + (isHi ? ' visitor-pin-new' : ''));
        var labelText = (e.school ? e.school + ' — ' : '') + (e.label || '');
        dot.addEventListener('click', function() {
            popup.textContent = labelText; // textContent: XSS-safe
            popup.setAttribute('x', px.toFixed(1));
            popup.setAttribute('y', (py - 10).toFixed(1));
            popup.style.display = '';
        });
        svg.appendChild(dot);
    });
    svg.appendChild(popup);
    container.appendChild(svg);
}

// Build the "Sign the Guest Book" card on the Historical finish screen.
// Build the guest book section on the Historical finish screen.
// includeForm=true: full "Sign the Guest Book" form + map (untracked players).
// includeForm=false: map only with a heading (students with a class code —
// the teacher already knows where they are, so they view the world map but
// don't add a redundant pin).
function buildGuestbookForm(container, includeForm) {
    if (!container || typeof GEO_COUNTRIES === 'undefined') return;
    container.style.display = '';

    if (!includeForm) {
        container.innerHTML =
            '<div class="guestbook-card">' +
            '<h3 class="guestbook-title">Where Players Are From</h3>' +
            '<p class="guestbook-sub">Schools around the world that have played.</p>' +
            '</div>' +
            '<div id="guestbookMapMount" class="guestbook-map-mount"></div>';
        var mapOnly = container.querySelector('#guestbookMapMount');
        if (mapOnly && firebaseLeaderboard.isAvailable()) {
            mapOnly.textContent = 'Loading map…';
            firebaseLeaderboard.loadGuestbook(500, function(entries, err) {
                if (err || !entries || !entries.length) { mapOnly.textContent = ''; return; }
                renderVisitorMap(mapOnly, entries, null);
            });
        }
        return;
    }

    var countryOpts = GEO_COUNTRIES.map(function(c) {
        return '<option value="' + escapeHtml(c.code) + '">' + escapeHtml(c.name) + '</option>';
    }).join('');
    var stateOpts = '<option value="">Select state…</option>' + GEO_US_STATES.map(function(s) {
        return '<option value="' + escapeHtml(s.code) + '">' + escapeHtml(s.name) + '</option>';
    }).join('');
    container.innerHTML =
        '<div class="guestbook-card" id="guestbookCard">' +
        '<h3 class="guestbook-title">Sign the Guest Book</h3>' +
        '<p class="guestbook-sub">Add your school to the map of everyone who has played.</p>' +
        '<input type="text" id="gbSchool" class="guestbook-input" maxlength="60" placeholder="Your school name">' +
        '<select id="gbCountry" class="guestbook-input">' + countryOpts + '</select>' +
        '<select id="gbState" class="guestbook-input">' + stateOpts + '</select>' +
        '<div id="gbError" class="guestbook-error" style="display:none;"></div>' +
        '<button type="button" id="gbSubmit" class="guestbook-btn">Add me to the map</button>' +
        '</div>' +
        '<div id="guestbookMapMount" class="guestbook-map-mount"></div>';
    wireGuestbookForm(container);
    // Show the existing world map immediately, even before this student signs.
    var mapMount = container.querySelector('#guestbookMapMount');
    if (mapMount && firebaseLeaderboard.isAvailable()) {
        firebaseLeaderboard.loadGuestbook(500, function(entries, err) {
            if (err || !entries || !entries.length) return;
            renderVisitorMap(mapMount, entries, null);
        });
    }
}

function wireGuestbookForm(container) {
    var countrySel = container.querySelector('#gbCountry');
    var stateSel = container.querySelector('#gbState');
    var schoolEl = container.querySelector('#gbSchool');
    var errEl = container.querySelector('#gbError');
    var submitBtn = container.querySelector('#gbSubmit');
    var card = container.querySelector('#guestbookCard');
    var mapMount = container.querySelector('#guestbookMapMount');
    if (!countrySel || !stateSel || !schoolEl || !submitBtn) return;

    function syncStateVisibility() {
        stateSel.style.display = (countrySel.value === 'US') ? '' : 'none';
    }
    syncStateVisibility();
    countrySel.addEventListener('change', syncStateVisibility);

    var submitted = false;
    submitBtn.addEventListener('click', function() {
        if (submitted) return;
        var filt = cleanSchoolName(schoolEl.value);
        if (!filt.ok) { errEl.textContent = filt.reason; errEl.style.display = 'block'; return; }
        if (countrySel.value === 'US' && !stateSel.value) {
            errEl.textContent = 'Pick your state.'; errEl.style.display = 'block'; return;
        }
        var loc = geoLookup(countrySel.value, stateSel.value);
        if (!loc) { errEl.textContent = 'Pick your country.'; errEl.style.display = 'block'; return; }
        if (!firebaseLeaderboard.isAvailable()) {
            errEl.textContent = 'You need an internet connection to add to the map.';
            errEl.style.display = 'block'; return;
        }
        errEl.style.display = 'none';
        submitted = true;
        submitBtn.disabled = true;
        var countryName = '';
        for (var i = 0; i < GEO_COUNTRIES.length; i++) {
            if (GEO_COUNTRIES[i].code === countrySel.value) { countryName = GEO_COUNTRIES[i].name; break; }
        }
        var entry = {
            school: filt.cleaned,
            countryName: countryName,
            regionName: (stateSel.value && countrySel.value === 'US') ? stateSel.options[stateSel.selectedIndex].text : '',
            lat: loc.lat, lng: loc.lng, label: loc.label
        };
        firebaseLeaderboard.submitGuestEntry(entry, function() {
            if (card) {
                // Thank-you built with textContent so nothing user-entered is injected as HTML.
                while (card.firstChild) card.removeChild(card.firstChild);
                var h = document.createElement('h3'); h.className = 'guestbook-title'; h.textContent = 'Thanks for signing!';
                var p = document.createElement('p'); p.className = 'guestbook-sub'; p.textContent = 'You are on the map: ' + loc.label;
                card.appendChild(h); card.appendChild(p);
            }
            firebaseLeaderboard.loadGuestbook(500, function(entries) {
                if (entries && mapMount) {
                    var hi = null;
                    for (var j = entries.length - 1; j >= 0; j--) {
                        if (entries[j].label === loc.label && entries[j].school === entry.school) { hi = entries[j]._key; break; }
                    }
                    renderVisitorMap(mapMount, entries, hi);
                }
            });
        });
    });
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

// v3.21: post the finished game to the GLOBAL leaderboard. No room code needed,
// so anonymous visitors appear too. Best-effort: silently no-ops when offline.
function submitToGlobalLeaderboard(playerName) {
    if (!firebaseLeaderboard.isAvailable()) return;
    firebaseLeaderboard.submitGlobalScore({
        name: playerName,
        score: gameState.score,
        side: gameState.side,
        wins: gameState.wins,
        losses: gameState.losses,
        momentum: gameState.momentum,
        victory: gameState.momentum > 0 || (gameState.momentum === 0 && gameState.wins > gameState.losses)
    }, function(success, err) {
        // Surface a failed global write in the console so a rejected write
        // (e.g. a rules validation mismatch) is diagnosable instead of silent.
        if (!success && typeof console !== 'undefined') {
            console.warn('Global leaderboard submit failed:', err);
        }
    });
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

// ------------------------------------------------------------
// Leaderboard modal (menu-discoverable, view-only device board)
// ------------------------------------------------------------
// The end-of-game flow already builds the device + class leaderboards inside
// #endGameScreen. To make them reachable from the menu ANYTIME, this modal:
//   1. Renders the device top-10 into its own container (view-only: no
//      Save-Score form, since saving only makes sense right after a game).
//   2. MOVES the single #classLeaderboardSection node into the modal so the
//      live join/leave + class board works here too (showClassLeaderboard()
//      operates on it by id regardless of where it lives in the DOM).
//   3. On close, RESTORES #classLeaderboardSection to its original parent and
//      position so the end-of-game screen still shows it correctly.
// We capture the original parent + next sibling before moving so restore is
// exact even if siblings change.

var _leaderboardClassSectionHome = null; // { parent, nextSibling }

function openLeaderboardModal() {
    // 1. Device leaderboard (read-only, no save form)
    var deviceMount = document.getElementById('menuLeaderboardDeviceTable');
    if (deviceMount && typeof getScoreboard === 'function' && typeof renderScoreboardTable === 'function') {
        deviceMount.innerHTML = renderScoreboardTable(getScoreboard());
    }

    // 1b. Global leaderboard (read-only, view-only). Untrusted anonymous names
    //     are escaped inside renderGlobalLeaderboardTable. Offline -> message.
    var globalMount = document.getElementById('menuLeaderboardGlobalTable');
    if (globalMount) {
        globalMount.innerHTML = '<p class="scoreboard-empty">Loading...</p>';
        if (firebaseLeaderboard.isAvailable()) {
            firebaseLeaderboard.loadGlobalLeaderboard(50, function(entries, err) {
                if (err || !entries) {
                    globalMount.innerHTML = '<p class="scoreboard-empty">Global leaderboard unavailable.</p>';
                    return;
                }
                globalMount.innerHTML = renderGlobalLeaderboardTable(entries);
            });
        } else {
            globalMount.innerHTML = '<p class="scoreboard-empty">Global leaderboard needs an internet connection.</p>';
        }
    }

    // 1c. Visitor map (where players are from). Untrusted entry text is rendered
    //     via textContent inside renderVisitorMap. Offline -> message.
    var mapMount = document.getElementById('menuLeaderboardMapMount');
    if (mapMount) {
        if (firebaseLeaderboard.isAvailable()) {
            mapMount.textContent = 'Loading map…';
            firebaseLeaderboard.loadGuestbook(500, function(entries, err) {
                if (err || !entries) { mapMount.textContent = 'Map needs an internet connection.'; return; }
                if (!entries.length) { mapMount.textContent = 'No guest book signatures yet.'; return; }
                renderVisitorMap(mapMount, entries, null);
            });
        } else {
            mapMount.textContent = 'Map needs an internet connection.';
        }
    }

    // 2. Relocate the class leaderboard section into the modal, remembering home.
    //    Guard against a double-open overwriting the captured home with the modal
    //    mount (which would strand the section in the modal on the next close).
    var classSection = document.getElementById('classLeaderboardSection');
    var mount = document.getElementById('menuLeaderboardClassMount');
    if (classSection && mount && !_leaderboardClassSectionHome) {
        _leaderboardClassSectionHome = {
            parent: classSection.parentNode,
            nextSibling: classSection.nextSibling
        };
        mount.appendChild(classSection);
        if (typeof showClassLeaderboard === 'function') {
            showClassLeaderboard();
        }
    }

    var modal = document.getElementById('leaderboardModal');
    if (modal) modal.style.display = 'block';
}

function closeLeaderboardModal() {
    // Restore #classLeaderboardSection to its original parent/position so the
    // end-of-game leaderboard flow keeps working exactly as before.
    var classSection = document.getElementById('classLeaderboardSection');
    if (classSection && _leaderboardClassSectionHome && _leaderboardClassSectionHome.parent) {
        var home = _leaderboardClassSectionHome;
        if (home.nextSibling && home.nextSibling.parentNode === home.parent) {
            home.parent.insertBefore(classSection, home.nextSibling);
        } else {
            home.parent.appendChild(classSection);
        }
        // The end screen controls its own visibility; hide it again here so it
        // does not flash on the end screen before that flow re-shows it.
        classSection.style.display = 'none';
    }
    _leaderboardClassSectionHome = null;

    var modal = document.getElementById('leaderboardModal');
    if (modal) modal.style.display = 'none';
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================================
// v3.19: Vocabulary auto-linker (applyGlossary) + click-to-define tooltips
// ============================================================
//
// applyGlossary(el, text) takes a DOM element and a PLAIN-TEXT string, finds
// glossary terms (from the global `glossary` array in js/data/glossary.js),
// and wraps matches in clickable .vocab-term spans, then sets el.innerHTML.
// This REPLACES `el.textContent = text` at the substantive reading-text render
// points (situation, what-happened, key idea, bigger picture, voice quote,
// tech description, choice feedback, freeplay briefing, battle revisit).
//
// SAFETY: `text` is escaped FIRST (so the base is injection-proof), then only
// our own known-safe <span> markup is inserted for matched terms. Term text and
// definitions are escaped too. Nothing from the data reaches innerHTML un-escaped.
//
// ALGORITHM (interval selection — immune to position-shift bugs):
//   1. Escape the full text ONCE up front. All matching runs against this
//      immutable escaped string, so character positions never drift.
//   2. Build a flat match list of {matchText, termObj} from every term + alias.
//      For each, run a whole-word regex `(^|[^A-Za-z0-9])(ESCAPED_TERM)(?![A-Za-z0-9])`
//      against the escaped text and record every hit as a candidate interval
//      {start, end, length, termObj}.
//   3. Sort candidates by start ASC, ties by length DESC (so "Robert E. Lee"
//      beats "Lee" and "Battle of Gettysburg" beats "Gettysburg" at the same
//      anchor). Greedily accept a candidate only if start >= lastAcceptedEnd —
//      this is the anti-nesting / anti-overlap guarantee (a shorter term inside
//      an already-accepted span is skipped).
//   4. TIER: 'common' terms are accepted only ONCE per call (first occurrence
//      across the term and all its aliases, since they share one termObj).
//      'distinctive' terms are accepted at every non-overlapping occurrence.
//   5. Stitch: concatenate the escaped slices between accepted spans with the
//      generated span HTML. No string mutation, so no offset drift.

// Cache the flattened+sorted match list so we don't rebuild it on every render.
var _glossaryMatchCache = null;

function buildGlossaryMatchList() {
    if (_glossaryMatchCache) return _glossaryMatchCache;
    var list = [];
    for (var i = 0; i < glossary.length; i++) {
        var t = glossary[i];
        if (!t || !t.term) continue;
        list.push({ matchText: t.term, termObj: t });
        if (t.aliases && t.aliases.length) {
            for (var a = 0; a < t.aliases.length; a++) {
                if (t.aliases[a]) list.push({ matchText: t.aliases[a], termObj: t });
            }
        }
    }
    // Longest matchText first so multi-word / longer terms win over substrings.
    list.sort(function(x, y) { return y.matchText.length - x.matchText.length; });
    _glossaryMatchCache = list;
    return list;
}

// Escape a string for safe use inside a RegExp (literal match of periods, etc).
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function applyGlossary(el, text) {
    if (!el) return el;
    text = (text === null || text === undefined) ? '' : String(text);

    // Fallback: no glossary loaded -> behave like textContent (no crash).
    if (typeof glossary === 'undefined' || !glossary || !glossary.length) {
        el.textContent = text;
        return el;
    }

    var matchList = buildGlossaryMatchList();

    // Escape the FULL text ONCE so the base is injection-proof. ALL term matching
    // and final stitching happens against this single immutable escaped string —
    // we never mutate it, so positions stay valid throughout (no shift bugs).
    var escaped = escapeHtml(text);

    function makeSpan(matchedText, termObj) {
        // matchedText is the captured substring from the ALREADY-escaped source,
        // so it is HTML-safe to drop straight into element content. The definition
        // is raw glossary data -> escape it. The aria-label sits inside double
        // quotes, so also neutralize any double-quote (escapeHtml does not touch
        // quotes) to keep the attribute well-formed even if a future definition
        // contains one.
        var def = escapeHtml(termObj.definition);
        var label = (matchedText + ': ' + def).replace(/"/g, '&quot;');
        return '<span class="vocab-term" tabindex="0" role="button" aria-label="' +
            label + '">' + matchedText +
            '<span class="vocab-tooltip"><span class="vocab-definition">' + def +
            '</span></span></span>';
    }

    // --- Pass 1: collect EVERY candidate match across all term/alias variants ---
    // Whole-word regex: leading boundary is start-of-string or a non-alphanumeric
    // char (captured, group 1) so it is preserved; trailing boundary is a
    // lookahead so it is not consumed (lets adjacent matches share a separator).
    // matchCase terms (USCT) omit the 'i' flag. Periods in "Robert E. Lee" are
    // made literal by escapeRegExp.
    var candidates = [];
    for (var m = 0; m < matchList.length; m++) {
        var matchText = matchList[m].matchText;
        var termObj = matchList[m].termObj;
        var escapedTerm = escapeHtml(matchText);
        var pattern = '(^|[^A-Za-z0-9])(' + escapeRegExp(escapedTerm) + ')(?![A-Za-z0-9])';
        var re = new RegExp(pattern, termObj.matchCase ? 'g' : 'gi');
        var hit;
        while ((hit = re.exec(escaped)) !== null) {
            var boundaryLen = hit[1].length;          // 0 (start) or 1
            var start = hit.index + boundaryLen;       // term start (excl. boundary)
            var captured = hit[2];                     // the matched term text
            candidates.push({
                start: start,
                end: start + captured.length,
                length: captured.length,
                captured: captured,
                termObj: termObj
            });
            if (re.lastIndex === hit.index) re.lastIndex++; // guard zero-width
        }
    }

    if (!candidates.length) {
        el.innerHTML = escaped;
        return el;
    }

    // --- Pass 2: choose non-overlapping winners, left-to-right, longest-first ---
    // Sort by start ascending; ties resolved by LENGTH descending so a longer
    // term ("Robert E. Lee") beats a contained shorter one ("Lee") at the same
    // anchor. Then greedily accept a candidate only if it starts at or after the
    // end of the last accepted span — this prevents nesting/overlap entirely.
    candidates.sort(function(a, b) {
        if (a.start !== b.start) return a.start - b.start;
        return b.length - a.length;
    });

    var accepted = [];
    var lastEnd = 0;
    var usedCommon = []; // common termObjs already linked this screen (first-occ rule)
    for (var c = 0; c < candidates.length; c++) {
        var cand = candidates[c];
        if (cand.start < lastEnd) continue; // overlaps an accepted span -> skip
        if (cand.termObj.tier === 'common') {
            // First occurrence only, per underlying term (canonical + aliases share
            // one budget). Because we walk left-to-right, the first accepted is the
            // textually-earliest occurrence of any of the term's variants.
            if (usedCommon.indexOf(cand.termObj) !== -1) continue;
            usedCommon.push(cand.termObj);
        }
        accepted.push(cand);
        lastEnd = cand.end;
    }

    // --- Pass 3: stitch plain escaped text + accepted spans (no string mutation) ---
    var out = '';
    var cursor = 0;
    for (var a = 0; a < accepted.length; a++) {
        var acc = accepted[a];
        if (acc.start > cursor) out += escaped.slice(cursor, acc.start);
        out += makeSpan(acc.captured, acc.termObj);
        cursor = acc.end;
    }
    if (cursor < escaped.length) out += escaped.slice(cursor);

    el.innerHTML = out;
    return el;
}

// Delegated click / keyboard handler for vocab tooltips. Bound ONCE; survives
// innerHTML rebuilds because it listens at the document level.
var _vocabListenersBound = false;

function setupVocabTooltips() {
    if (_vocabListenersBound) return;
    _vocabListenersBound = true;

    function closeAllExcept(keep) {
        var open = document.querySelectorAll('.vocab-term.open');
        for (var i = 0; i < open.length; i++) {
            if (open[i] !== keep) open[i].classList.remove('open');
        }
    }

    // Click (also handles tap on mobile). Toggle the clicked term; close others.
    document.addEventListener('click', function(e) {
        var term = e.target.closest ? e.target.closest('.vocab-term') : null;
        if (term) {
            // Toggle this term; the outside-click branch below handles closing
            // when the click is NOT on a term. (Modal backdrops use an
            // e.target === backdrop guard, so they ignore these descendant clicks.)
            var wasOpen = term.classList.contains('open');
            closeAllExcept(term);
            if (wasOpen) {
                term.classList.remove('open');
            } else {
                term.classList.add('open');
            }
            return;
        }
        // Click outside any term closes all open tooltips.
        closeAllExcept(null);
    });

    // Keyboard: Enter/Space toggles a focused term; Escape closes everything.
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            closeAllExcept(null);
            return;
        }
        var term = (document.activeElement && document.activeElement.classList &&
            document.activeElement.classList.contains('vocab-term'))
            ? document.activeElement : null;
        if (term && (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar')) {
            e.preventDefault();
            var wasOpen = term.classList.contains('open');
            closeAllExcept(term);
            if (wasOpen) {
                term.classList.remove('open');
            } else {
                term.classList.add('open');
            }
        }
    });
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
            // Completed battles are clickable to open a read-only review.
            // Current/Upcoming battles are NOT clickable.
            var clickAttrs = isCompleted
                ? ' timeline-clickable" data-battle-index="' + i + '" role="button" tabindex="0"'
                : '"';
            var reviewHint = isCompleted ? ' <span class="timeline-review-hint">Review &rsaquo;</span>' : '';
            timelineHtml += '<div class="timeline-item ' + cssClass + clickAttrs + '>' +
                '<div class="timeline-battle">' + (i + 1) + '. ' + battles[i].name + '</div>' +
                '<div class="timeline-details">' + battles[i].date + ' &mdash; ' + status + reviewHint + '</div>' +
                '</div>';
        }
        timeline.innerHTML = timelineHtml;

        // Wire revisit clicks via delegation. innerHTML is rebuilt each open,
        // so a single delegated listener on the timeline container is robust.
        // Guard against attaching more than once.
        if (!timeline.dataset.revisitWired) {
            timeline.dataset.revisitWired = '1';
            timeline.addEventListener('click', function(e) {
                var item = e.target.closest ? e.target.closest('.timeline-clickable') : null;
                if (!item) return;
                var idx = parseInt(item.getAttribute('data-battle-index'), 10);
                if (!isNaN(idx)) openBattleRevisit(idx);
            });
            timeline.addEventListener('keydown', function(e) {
                if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
                var item = e.target.closest ? e.target.closest('.timeline-clickable') : null;
                if (!item) return;
                e.preventDefault();
                var idx = parseInt(item.getAttribute('data-battle-index'), 10);
                if (!isNaN(idx)) openBattleRevisit(idx);
            });
        }
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
// Battle Revisit (READ-ONLY review of a completed battle)
// ------------------------------------------------------------
// Opened from the campaign log when a student clicks a COMPLETED battle.
// HARD RULE: this is a pure READ view. It must NOT mutate game state
// (gameState.currentBattle, narrativeStep, gameState.responses, etc.) and
// must NOT call any advancing/rendering function (renderHistoricalBattle,
// advanceNarrative, enterBattleScreen, saveHistoricalResponse). It only reads
// battles[index] and gameState.responses[index] and writes display markup.
// ============================================================

function openBattleRevisit(index) {
    if (typeof battles === 'undefined' || !battles[index]) return;
    var battle = battles[index];
    var h = battle.historical || {};
    var resp = (gameState.responses && gameState.responses[index]) ? gameState.responses[index] : null;
    var body = document.getElementById('revisitBody');
    var title = document.getElementById('revisitTitle');
    if (!body || !title) return;

    title.textContent = battle.name;

    // All student-derived text (wwydChoice) is escaped via escapeHtml before
    // being placed into the HTML string. getContent() resolves the student's
    // tier (reads gameState.difficulty). h.outcome is a plain string.
    var html = '';
    html += '<div class="revisit-date">' + escapeHtml(battle.date) + '</div>';

    if (resp) {
        var matched = resp.wwydMatchedHistory;
        html += '<div class="revisit-choice">';
        html += '<div class="revisit-label">What you picked</div>';
        html += '<p>' + escapeHtml(resp.wwydChoice || '(no choice recorded)') + '</p>';
        html += '<div class="revisit-badge ' + (matched ? 'matched' : 'different') + '">' +
                (matched ? 'Matched history' : 'You chose a different path') + '</div>';
        html += '</div>';
    }

    // v3.19: whatHappened / keyIdea / biggerPicture get ids and are filled via
    // applyGlossary AFTER body.innerHTML is set (raw text in, applyGlossary
    // escapes once — so we must NOT pre-escape these three or they'd double-escape).
    // wwydChoice and h.outcome remain escaped inline as before.
    var rawWhatHappened = getContent(h.whatHappened);
    var rawKeyIdea = getContent(h.keyIdea);
    var rawBiggerPicture = getContent(h.biggerPicture);

    html += '<div class="revisit-section"><div class="revisit-label">What really happened</div><p id="revisitWhatHappened"></p>';
    if (h.outcome) html += '<p class="revisit-outcome">' + escapeHtml(h.outcome) + '</p>';
    html += '</div>';

    html += '<div class="revisit-keyidea"><div class="revisit-label">Key idea</div><p id="revisitKeyIdea"></p></div>';

    html += '<div class="revisit-section"><div class="revisit-label">The bigger picture</div><p id="revisitBiggerPicture"></p></div>';

    // Explicit, obvious way back to the battle list (the small X alone wasn't clear).
    html += '<div class="revisit-actions">' +
            '<button type="button" class="btn-secondary revisit-back-btn" id="revisitBackBtn">← Back to battle list</button>' +
            '</div>';

    body.innerHTML = html;

    // v3.19: fill the three reading-text paragraphs through the glossary linker
    // (raw text -> applyGlossary escapes once). Tooltips work via the delegated
    // listener already bound at init.
    var revisitWhatHappenedEl = document.getElementById('revisitWhatHappened');
    var revisitKeyIdeaEl = document.getElementById('revisitKeyIdea');
    var revisitBiggerPictureEl = document.getElementById('revisitBiggerPicture');
    applyGlossary(revisitWhatHappenedEl, rawWhatHappened);
    applyGlossary(revisitKeyIdeaEl, rawKeyIdea);
    applyGlossary(revisitBiggerPictureEl, rawBiggerPicture);

    // v3.20: TTS — read-aloud the three revisit reading paragraphs (glossary spans stripped before reading).
    if (revisitWhatHappenedEl) {
        revisitWhatHappenedEl.classList.add('tts-readable');
        revisitWhatHappenedEl.setAttribute('data-tts-label', 'What really happened');
    }
    if (revisitKeyIdeaEl) {
        revisitKeyIdeaEl.classList.add('tts-readable');
        revisitKeyIdeaEl.setAttribute('data-tts-label', 'Key idea');
    }
    if (revisitBiggerPictureEl) {
        revisitBiggerPictureEl.classList.add('tts-readable');
        revisitBiggerPictureEl.setAttribute('data-tts-label', 'The bigger picture');
    }

    var backBtn = document.getElementById('revisitBackBtn');
    if (backBtn) backBtn.addEventListener('click', closeBattleRevisit);

    var modal = document.getElementById('battleRevisitModal');
    if (modal) modal.style.display = 'block';
}

function closeBattleRevisit() {
    var m = document.getElementById('battleRevisitModal');
    if (m) m.style.display = 'none';
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
        extra: 'Most Support. Easiest reading, lots of writing help.',
        beginner: 'More Support. Shorter text, extra writing help.',
        intermediate: 'Standard. Standard text, some writing help.',
        advanced: 'Extra Challenge. More detail, deeper questions.'
    };
    var hintEl = document.getElementById('difficultyHint');
    if (hintEl) hintEl.textContent = difficultyHints[level] || '';

    rerenderForReadingLevel();
}

function rerenderForReadingLevel() {
    if (typeof gameState === 'undefined' || !gameState) return;

    var screen = gameState.currentScreen;

    // Reflect step (grouped reflection) lives on historicalScreen at narrativeStep 5
    // with #sectionReflect visible. The full battle re-render below would reset to
    // Briefing and hide the reflect prompt (kicking the student out and wiping their
    // typed answer). Instead, re-render JUST the reflect prompt at the new tier and
    // preserve what they've typed.
    var reflectSection = document.getElementById('sectionReflect');
    var onReflectStep = screen === 'historicalScreen' && narrativeStep === 5 &&
                        reflectSection && reflectSection.style.display !== 'none';
    if (onReflectStep) {
        var reflectInput = document.getElementById('histReflectInput');
        var typed = reflectInput ? reflectInput.value : '';
        if (typeof showGroupedReflection === 'function') {
            showGroupedReflection(); // rebuilds the prompt at the current tier (and clears the textarea)
        }
        if (reflectInput) reflectInput.value = typed; // restore what the student wrote
        return;
    }

    // Battle screen (historical mode) — uses gameState.currentBattle internally
    if (screen === 'historicalScreen' && typeof renderHistoricalBattle === 'function') {
        // Preserve the student's place in the battle's reveal sequence.
        // renderHistoricalBattle() resets narrativeStep to 0 and wwydSelected to
        // -1 (back to Briefing), so capture both BEFORE re-rendering, then replay
        // the DISPLAY-ONLY reveals up to where the student was — never the terminal
        // save/advance steps.
        //
        // Step map (see advanceNarrative): 0 Briefing, 1 Your Call (WWYD),
        // 2 feedback, 3 What Happened, 4 Learn More — all reveal UI only.
        // Steps 5/6 SAVE the response and advance to the next battle (or reflect/
        // recall). SAFE_MAX is the last display-only step (4 = Learn More); the
        // replay must never reach 5/6, or changing difficulty would save a
        // duplicate response or jump to the next battle.
        var savedStep = narrativeStep;
        var savedSel = wwydSelected;
        var SAFE_MAX = 4; // last display-only reveal step (Learn More)

        renderHistoricalBattle(); // resets narrativeStep = 0, wwydSelected = -1

        if (savedStep > 0) {
            // Restore the WWYD selection (state + button highlight) so the
            // step-1 guard (wwydSelected === -1 blocks advancing) doesn't stall
            // the replay and the student's pick stays visible. selectWwydOption
            // only touches the continue button when narrativeStep === 1, which is
            // 0 here, so it has no terminal side effects.
            if (savedSel >= 0 && typeof selectWwydOption === 'function') {
                selectWwydOption(savedSel);
            }
            // Clamp to SAFE_MAX so the loop can never call advanceNarrative() once
            // narrativeStep reaches 4 — it therefore never enters case 5/6
            // (saveHistoricalResponse / advanceHistorical / enterBattleScreen /
            // renderHistoricalComplete). If the student was on a terminal step,
            // we re-show the last visible content (Learn More) and do NOT re-save
            // or re-advance.
            var replayTarget = Math.min(savedStep, SAFE_MAX);
            while (narrativeStep < replayTarget) {
                advanceNarrative();
            }
        }
    } else if (screen === 'actIntroScreen' && typeof renderActIntro === 'function' &&
               typeof getActForBattle === 'function') {
        var actIdx = getActForBattle(gameState.currentBattle);
        if (actIdx !== -1) renderActIntro(actIdx);
    } else if (screen === 'actRecallScreen' && typeof renderActRecall === 'function' &&
               typeof getActForBattle === 'function') {
        var aIdx = getActForBattle(gameState.currentBattle);
        if (aIdx !== -1) renderActRecall(aIdx);
    } else if (screen === 'freeplayBriefing' && typeof renderFreeplayBriefing === 'function') {
        renderFreeplayBriefing();
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

// ============================================================
// "Teacher won't see you" banner (no valid class code saved)
// ============================================================

var NO_TEACHER_BANNER_SKIP_KEY = 'noTeacherBannerSkipped';

function shouldShowNoTeacherBanner() {
    if (gameState.mode !== 'historical') return false;
    if (typeof firebaseLeaderboard === 'undefined') return false;
    try {
        if (sessionStorage.getItem(NO_TEACHER_BANNER_SKIP_KEY) === '1') return false;
    } catch (e) {}
    var saved = firebaseLeaderboard.getSavedClassCode();
    var period = firebaseLeaderboard.periodForRoom(saved);
    return !period;
}

function showNoTeacherBannerIfNeeded() {
    var banner = document.getElementById('noTeacherBanner');
    if (!banner) return;
    banner.style.display = shouldShowNoTeacherBanner() ? 'flex' : 'none';
}

function wireNoTeacherBanner() {
    var openBtn = document.getElementById('noTeacherBannerOpenBtn');
    var skipBtn = document.getElementById('noTeacherBannerSkipBtn');
    var saveBtn = document.getElementById('noTeacherBannerSaveBtn');
    var form = document.getElementById('noTeacherBannerForm');
    var input = document.getElementById('noTeacherBannerInput');
    var errorEl = document.getElementById('noTeacherBannerError');
    var banner = document.getElementById('noTeacherBanner');
    if (!openBtn || !skipBtn || !saveBtn || !form || !input || !errorEl || !banner) return;

    openBtn.addEventListener('click', function() {
        form.style.display = 'flex';
        input.focus();
    });

    skipBtn.addEventListener('click', function() {
        try { sessionStorage.setItem(NO_TEACHER_BANNER_SKIP_KEY, '1'); } catch (e) {}
        banner.style.display = 'none';
    });

    saveBtn.addEventListener('click', function() {
        var raw = String(input.value || '').toLowerCase().trim();
        var period = firebaseLeaderboard.periodForRoom(raw);
        if (!period) {
            errorEl.style.display = 'block';
            return;
        }
        errorEl.style.display = 'none';
        firebaseLeaderboard.saveClassCode(raw);
        gameState.period = period;
        banner.style.display = 'none';
        if (typeof reportProgressToDashboard === 'function') {
            reportProgressToDashboard(false);
        }
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') saveBtn.click();
    });
}
