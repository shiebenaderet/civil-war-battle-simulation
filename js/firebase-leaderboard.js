// Firebase Class Leaderboard for Civil War Battle Simulation
// Provides shared class leaderboards via Firebase Realtime Database
// Gracefully degrades to local-only scoreboard when offline or blocked

var firebaseLeaderboard = (function() {

    var ROOM_CODE_KEY = 'civilWarRoomCode';
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
            localStorage.setItem(ROOM_CODE_KEY, code.toUpperCase().trim());
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

        var code = roomCode.toUpperCase().trim();
        if (!code || code.length < 3 || code.length > 12) {
            callback(false, 'Enter a valid room code (3-12 characters).');
            return;
        }

        db.ref('rooms/' + code + '/created').once('value')
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

        var code = roomCode.toUpperCase().trim();
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

    // Load leaderboard from a room (top 20 by score)
    function loadLeaderboard(roomCode, callback) {
        if (!isAvailable()) {
            callback(null, 'Class leaderboard is not available offline.');
            return;
        }

        var code = roomCode.toUpperCase().trim();

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

    return {
        init: init,
        isAvailable: isAvailable,
        getSavedRoomCode: getSavedRoomCode,
        saveRoomCode: saveRoomCode,
        clearRoomCode: clearRoomCode,
        validateRoom: validateRoom,
        submitScore: submitScore,
        loadLeaderboard: loadLeaderboard
    };

})();
