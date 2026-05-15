// v3.15: Print-friendly campaign summary.
// Opens a new tab with formatted HTML via Blob URL (CSP-friendly).
// Auto-prints on load. Captures the data this codebase actually has:
//   - gameState.responses[]: per-battle { battleId, battleName, wwydChoice (text),
//     wwydMatchedHistory (bool), reflectionText }
//   - gameState.completedRecalls: array of completed act indices (no per-question
//     answers are persisted, so we list questions + correct answer only)
//   - gameState.studentName, gameState.side, gameState.difficulty

(function() {
    'use strict';

    function escape(s) {
        if (s === null || s === undefined) return '';
        return String(s).replace(/[&<>"']/g, function(c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // Look up the historical option text for a battle/side/difficulty.
    // The historical-correct option is index 0 of the options array per battles data.
    function getHistoricalOptionText(battle, side, level) {
        try {
            var sideKey = side === 'union' ? 'union' : 'confederacy';
            var wwyd = battle.historical.whatWouldYouDo[sideKey];
            var opts = wwyd.options;
            // options may be {extra,beginner,intermediate,advanced} or a plain array
            if (opts && typeof opts === 'object' && !Array.isArray(opts) &&
                ('extra' in opts || 'beginner' in opts || 'intermediate' in opts || 'advanced' in opts)) {
                if (level === 'extra') {
                    opts = opts.extra || opts.beginner || opts.intermediate || [];
                } else {
                    opts = opts[level] || opts.intermediate || [];
                }
            }
            return (opts && opts[0]) || '';
        } catch (e) {
            return '';
        }
    }

    function findResponse(battleId) {
        if (typeof gameState === 'undefined' || !Array.isArray(gameState.responses)) return null;
        for (var i = 0; i < gameState.responses.length; i++) {
            if (gameState.responses[i].battleId === battleId) return gameState.responses[i];
        }
        return null;
    }

    function buildHtml() {
        var studentName = (typeof gameState !== 'undefined' && gameState.studentName) || 'Student';
        var side = (typeof gameState !== 'undefined' && gameState.side) || 'unknown';
        var level = (typeof gameState !== 'undefined' && gameState.difficulty) || 'intermediate';
        var completedDate = new Date().toLocaleDateString();

        var sideLabel = side ? (side.charAt(0).toUpperCase() + side.slice(1)) : 'Unknown';
        var levelLabel = level === 'extra' ? 'Extra Support'
            : (level ? (level.charAt(0).toUpperCase() + level.slice(1)) : '');

        var parts = [];
        parts.push('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Civil War Simulation Summary - ' + escape(studentName) + '</title>');
        parts.push('<style>');
        parts.push('body{font-family:Georgia,serif;line-height:1.5;max-width:7in;margin:0.5in auto;color:#000;}');
        parts.push('h1{font-size:18pt;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:12px;}');
        parts.push('h2{font-size:14pt;margin-top:24px;border-bottom:1px solid #000;padding-bottom:4px;page-break-before:always;}');
        parts.push('h2:first-of-type{page-break-before:auto;}');
        parts.push('h3{font-size:12pt;margin-top:14px;}');
        parts.push('p,li{font-size:10.5pt;}');
        parts.push('table{border-collapse:collapse;width:100%;margin:8px 0;}');
        parts.push('th,td{border:1px solid #888;padding:4px 6px;font-size:9.5pt;text-align:left;vertical-align:top;}');
        parts.push('th{background:#eee;}');
        parts.push('.meta{font-size:9pt;color:#444;margin-bottom:18px;}');
        parts.push('.reflection{border-left:3px solid #6b1a17;padding:6px 12px;margin:8px 0;background:#faf6ec;font-size:10.5pt;white-space:pre-wrap;}');
        parts.push('.recall-note{font-size:9pt;color:#666;margin:4px 0 8px;font-style:italic;}');
        parts.push('@media print{body{margin:0.5in;}}');
        parts.push('</style>');
        // Inline auto-print bootstrap; split tag so this source file's parser is not confused.
        parts.push('<' + 'script>window.addEventListener("load",function(){setTimeout(function(){window.print();},250);});<' + '/script>');
        parts.push('</head><body>');

        parts.push('<h1>Civil War Simulation</h1>');
        parts.push('<div class="meta">');
        parts.push('<strong>Student:</strong> ' + escape(studentName) + '<br>');
        parts.push('<strong>Side:</strong> ' + escape(sideLabel) + '<br>');
        parts.push('<strong>Reading level:</strong> ' + escape(levelLabel) + '<br>');
        parts.push('<strong>Completed:</strong> ' + escape(completedDate));
        parts.push('</div>');

        if (typeof acts === 'undefined' || !Array.isArray(acts)) {
            parts.push('<p>No act data available.</p></body></html>');
            return parts.join('');
        }

        var completedRecalls = (typeof gameState !== 'undefined' && Array.isArray(gameState.completedRecalls))
            ? gameState.completedRecalls : [];

        acts.forEach(function(act, actIdx) {
            parts.push('<h2>Act ' + escape(act.number) + ' &mdash; ' + escape(act.name) + ' (' + escape(act.years) + ')</h2>');

            // ---- Battles played ----
            parts.push('<h3>Battle Decisions</h3>');
            parts.push('<table><thead><tr><th>Battle</th><th>Date</th><th>Your Decision</th><th>Historical Decision</th><th>Match</th></tr></thead><tbody>');
            var battleIndices = act.battleIndices || [];
            battleIndices.forEach(function(bIdx) {
                if (typeof battles === 'undefined' || !battles[bIdx]) return;
                var battle = battles[bIdx];
                var response = findResponse(battle.id);
                // wwydChoice is stored as the option TEXT (see saveHistoricalResponse in js/game.js).
                var userText = (response && response.wwydChoice) ? response.wwydChoice : 'Not played';
                var histText = getHistoricalOptionText(battle, side, level) || '—';
                var match = '—';
                if (response) {
                    match = response.wwydMatchedHistory ? 'Yes' : 'No';
                }
                parts.push('<tr><td>' + escape(battle.name) + '</td>'
                    + '<td>' + escape(battle.date || '') + '</td>'
                    + '<td>' + escape(userText) + '</td>'
                    + '<td>' + escape(histText) + '</td>'
                    + '<td>' + escape(match) + '</td></tr>');
            });
            parts.push('</tbody></table>');

            // ---- Recall questions ----
            // Per-question answers are not persisted in this codebase; gameState.completedRecalls
            // only records that the student finished an act's recall round. We list the
            // question + correct answer for review/printing purposes.
            var recallQuestions = (act.recall && (act.recall[level] ||
                (level === 'extra' && act.recall.beginner) ||
                act.recall.intermediate)) || [];
            if (recallQuestions.length) {
                parts.push('<h3>Recall Questions</h3>');
                var didRecall = completedRecalls.indexOf(actIdx) !== -1;
                parts.push('<p class="recall-note">' + (didRecall
                    ? 'Recall completed. Per-question answers are not stored; review the correct answers below.'
                    : 'Recall not completed for this act.') + '</p>');
                parts.push('<table><thead><tr><th>Question</th><th>Correct Answer</th></tr></thead><tbody>');
                recallQuestions.forEach(function(q) {
                    var correctAns = (q.options && q.options[q.correctIndex]) || '';
                    parts.push('<tr><td>' + escape(q.question) + '</td>'
                        + '<td>' + escape(correctAns) + '</td></tr>');
                });
                parts.push('</tbody></table>');
            }

            // ---- Reflections (per-battle, gathered for this act) ----
            // No act-level reflection storage exists; we surface each per-battle
            // reflectionText that falls under this act's battles.
            var reflections = [];
            battleIndices.forEach(function(bIdx) {
                if (typeof battles === 'undefined' || !battles[bIdx]) return;
                var battle = battles[bIdx];
                var response = findResponse(battle.id);
                if (response && response.reflectionText) {
                    reflections.push({ name: battle.name, text: response.reflectionText });
                }
            });
            if (reflections.length) {
                parts.push('<h3>Your Reflections</h3>');
                reflections.forEach(function(r) {
                    parts.push('<p><strong>' + escape(r.name) + '</strong></p>');
                    parts.push('<div class="reflection">' + escape(r.text) + '</div>');
                });
            }
        });

        parts.push('</body></html>');
        return parts.join('');
    }

    function generate() {
        var html = buildHtml();
        var blob = new Blob([html], { type: 'text/html' });
        var url = URL.createObjectURL(blob);
        var w = window.open(url, '_blank');
        if (!w) {
            alert('Could not open print window. Please allow popups, or use your browser File > Print.');
            URL.revokeObjectURL(url);
            return;
        }
        // Revoke after the new window has had time to load.
        setTimeout(function() { URL.revokeObjectURL(url); }, 60000);
    }

    window.PrintSummary = { generate: generate };
})();
