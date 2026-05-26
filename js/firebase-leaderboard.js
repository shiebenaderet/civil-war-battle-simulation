// Firebase Class Leaderboard for Civil War Battle Simulation
// Provides shared class leaderboards via Firebase Realtime Database
// Gracefully degrades to local-only scoreboard when offline or blocked

var firebaseLeaderboard = (function() {

    var ROOM_CODE_KEY = 'civilWarRoomCode';      // leaderboard feature (unchanged)
    var STUDENT_ID_KEY = 'civilWarStudentId';
    var CLASS_CODE_KEY = 'civilWarClassCode';    // NEW: teacher dashboard gate

    // Per-period room codes for the teacher progress dashboard.
    // To rotate: edit these four strings and delete the old rooms/<oldcode>/progress
    // trees from the Firebase console.
    var ROOM_CODES = {
        '1': 'ams-p1',
        '2': 'ams-p2',
        '4': 'ams-p4',
        '5': 'ams-p5'
    };

    // Kept until Tasks 2 and 5 migrate the two callsites that reference it.
    var TEACHER_DASHBOARD_ROOM = 'shie-class';
    var firebaseReady = false;
    var db = null;

    // Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyDceTD9boDvTAEmpaPhwB_cKVeRrlsYcR0",
        authDomain: "civil-war-leaderboard.firebaseapp.com",
        databaseURL: "https://civil-war-leaderboard-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "civil-war-leaderboard",
        storageBucket: "civil-war-leaderboard.firebasestorage.app",
        messagingSenderId: "385676785743",
        appId: "1:385676785743:web:662b8e69b9ceddafb6523a"
    };

    function init() {
        try {
            if (typeof firebase !== 'undefined' && firebase.app) {
                // Check if already initialized
                try { firebase.app(); }
                catch (e) { firebase.initializeApp(firebaseConfig); }
                db = firebase.database();
                firebaseReady = true;
            }
        } catch (e) {
            firebaseReady = false;
        }
    }

    function isAvailable() {
        return firebaseReady && db !== null;
    }

    function getSavedRoomCode() {
        try {
            return localStorage.getItem(ROOM_CODE_KEY) || '';
        } catch (e) {
            return '';
        }
    }

    function saveRoomCode(code) {
        try {
            localStorage.setItem(ROOM_CODE_KEY, code.toLowerCase().trim());
        } catch (e) {
            // ignore
        }
    }

    function clearRoomCode() {
        try {
            localStorage.removeItem(ROOM_CODE_KEY);
        } catch (e) {
            // ignore
        }
    }

    // Validate that a room code exists in Firebase
    function validateRoom(roomCode, callback) {
        if (!isAvailable()) {
            callback(false, 'Class leaderboard is not available offline.');
            return;
        }

        var code = roomCode.toLowerCase().trim();
        if (!code || code.length < 3 || code.length > 12) {
            callback(false, 'Enter a valid room code (3-12 characters).');
            return;
        }

        db.ref('rooms/' + code).once('value')
            .then(function(snapshot) {
                if (snapshot.exists()) {
                    callback(true, '');
                } else {
                    callback(false, 'Room code not found. Check with your teacher.');
                }
            })
            .catch(function(err) {
                callback(false, 'Could not connect. Try again later.');
            });
    }

    // Submit a score to a room
    function submitScore(roomCode, scoreData, callback) {
        if (!isAvailable()) {
            callback(false, 'Offline - score saved locally only.');
            return;
        }

        var code = roomCode.toLowerCase().trim();
        var entry = {
            name: String(scoreData.name || 'Anonymous').substring(0, 30),
            score: Number(scoreData.score) || 0,
            side: scoreData.side === 'union' ? 'union' : 'confederacy',
            wins: Number(scoreData.wins) || 0,
            losses: Number(scoreData.losses) || 0,
            momentum: Number(scoreData.momentum) || 0,
            victory: Boolean(scoreData.victory),
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };

        db.ref('rooms/' + code + '/scores').push(entry)
            .then(function() {
                callback(true, '');
            })
            .catch(function(err) {
                callback(false, 'Could not submit score. Try again.');
            });
    }

    // Stable per-device student ID. Created on first call, reused thereafter.
    function getStudentId() {
        try {
            var existing = localStorage.getItem(STUDENT_ID_KEY);
            if (existing) return existing;
            var rand = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
            localStorage.setItem(STUDENT_ID_KEY, rand);
            return rand;
        } catch (e) {
            return 'anon_' + Math.random().toString(36).slice(2, 10);
        }
    }

    // Write/update a student's current progress for the teacher dashboard.
    // Overwrites prior entry for this studentId — the dashboard wants
    // "where are they now," not history.
    function writeProgress(roomCode, progressData, callback) {
        if (!isAvailable()) {
            if (callback) callback(false, 'Offline.');
            return;
        }
        var code = String(roomCode || '').toLowerCase().trim();
        if (!code) {
            if (callback) callback(false, 'No room code.');
            return;
        }
        var studentId = getStudentId();
        var entry = {
            name: String(progressData.name || 'Student').substring(0, 30),
            period: String(progressData.period || ''),
            currentBattle: Number(progressData.currentBattle) || 0,
            totalBattles: Number(progressData.totalBattles) || 13,
            side: progressData.side === 'union' ? 'union' :
                  progressData.side === 'confederacy' ? 'confederacy' : '',
            finished: Boolean(progressData.finished),
            lastSeen: firebase.database.ServerValue.TIMESTAMP
        };
        db.ref('rooms/' + code + '/progress/' + studentId).set(entry)
            .then(function() { if (callback) callback(true, ''); })
            .catch(function() { if (callback) callback(false, 'Write failed.'); });
    }

    // Subscribe to all student progress entries for a room. The callback
    // fires whenever any student's entry changes. Returns an unsubscribe fn.
    function subscribeToProgress(roomCode, callback) {
        if (!isAvailable()) {
            callback(null, 'Offline.');
            return function() {};
        }
        var code = String(roomCode || '').toLowerCase().trim();
        if (!code) {
            callback(null, 'No room code.');
            return function() {};
        }
        var ref = db.ref('rooms/' + code + '/progress');
        var handler = ref.on('value', function(snapshot) {
            var entries = [];
            snapshot.forEach(function(child) {
                var v = child.val();
                if (v) {
                    v.studentId = child.key;
                    entries.push(v);
                }
            });
            callback(entries, '');
        }, function() {
            callback(null, 'Listener error.');
        });
        return function() { ref.off('value', handler); };
    }

    function deleteProgressEntry(roomCode, studentId, callback) {
        if (!isAvailable()) {
            if (callback) callback(false, 'Offline.');
            return;
        }
        var code = String(roomCode || '').toLowerCase().trim();
        var sid = String(studentId || '').trim();
        if (!code || !sid) {
            if (callback) callback(false, 'Missing code or student id.');
            return;
        }
        db.ref('rooms/' + code + '/progress/' + sid).remove()
            .then(function() { if (callback) callback(true, ''); })
            .catch(function() { if (callback) callback(false, 'Delete failed.'); });
    }

    function clearAllProgress(roomCodes, callback) {
        if (!isAvailable()) {
            if (callback) callback(false, 'Offline.');
            return;
        }
        if (!Array.isArray(roomCodes) || roomCodes.length === 0) {
            if (callback) callback(false, 'No rooms to clear.');
            return;
        }
        var promises = roomCodes.map(function(code) {
            var c = String(code || '').toLowerCase().trim();
            if (!c) return Promise.resolve();
            return db.ref('rooms/' + c + '/progress').remove();
        });
        Promise.all(promises)
            .then(function() { if (callback) callback(true, ''); })
            .catch(function() { if (callback) callback(false, 'Clear failed (partial).'); });
    }

    // Load leaderboard from a room (top 20 by score)
    function loadLeaderboard(roomCode, callback) {
        if (!isAvailable()) {
            callback(null, 'Class leaderboard is not available offline.');
            return;
        }

        var code = roomCode.toLowerCase().trim();

        db.ref('rooms/' + code + '/scores')
            .orderByChild('score')
            .limitToLast(20)
            .once('value')
            .then(function(snapshot) {
                var entries = [];
                snapshot.forEach(function(child) {
                    entries.push(child.val());
                });
                // Sort descending by score (Firebase orderByChild is ascending)
                entries.sort(function(a, b) {
                    return (b.score || 0) - (a.score || 0);
                });
                callback(entries, '');
            })
            .catch(function(err) {
                callback(null, 'Could not load leaderboard. Try again.');
            });
    }

    function periodForRoom(code) {
        var normalized = String(code || '').toLowerCase().trim();
        for (var p in ROOM_CODES) {
            if (Object.prototype.hasOwnProperty.call(ROOM_CODES, p) && ROOM_CODES[p] === normalized) {
                return p;
            }
        }
        return null;
    }

    function getAllPeriodRooms() {
        var copy = {};
        for (var p in ROOM_CODES) {
            if (Object.prototype.hasOwnProperty.call(ROOM_CODES, p)) {
                copy[p] = ROOM_CODES[p];
            }
        }
        return copy;
    }

    function getSavedClassCode() {
        try { return localStorage.getItem(CLASS_CODE_KEY) || ''; }
        catch (e) { return ''; }
    }

    function saveClassCode(code) {
        try { localStorage.setItem(CLASS_CODE_KEY, String(code || '').toLowerCase().trim()); }
        catch (e) {}
    }

    function clearClassCode() {
        try { localStorage.removeItem(CLASS_CODE_KEY); }
        catch (e) {}
    }

    return {
        init: init,
        isAvailable: isAvailable,
        getSavedRoomCode: getSavedRoomCode,
        saveRoomCode: saveRoomCode,
        clearRoomCode: clearRoomCode,
        validateRoom: validateRoom,
        submitScore: submitScore,
        loadLeaderboard: loadLeaderboard,
        getStudentId: getStudentId,
        writeProgress: writeProgress,
        subscribeToProgress: subscribeToProgress,
        deleteProgressEntry: deleteProgressEntry,
        clearAllProgress: clearAllProgress,
        getTeacherDashboardRoom: function() { return TEACHER_DASHBOARD_ROOM; },
        periodForRoom: periodForRoom,
        getAllPeriodRooms: getAllPeriodRooms,
        getSavedClassCode: getSavedClassCode,
        saveClassCode: saveClassCode,
        clearClassCode: clearClassCode
    };

})();
