(function() {
    'use strict';

    let allVoices = [];
    let usableVoices = [];
    let currentUtterance = null;
    let initialized = false;

    function isUsable(voice) {
        if (!voice || !voice.lang) return false;
        if (!voice.lang.toLowerCase().startsWith('en')) return false;
        const name = (voice.name || '').toLowerCase();
        if (name.indexOf('espeak') !== -1) return false;
        return true;
    }

    function refreshVoices() {
        if (!('speechSynthesis' in window)) return;
        allVoices = window.speechSynthesis.getVoices();
        usableVoices = allVoices.filter(isUsable);
    }

    function init() {
        if (initialized) return;
        if (!('speechSynthesis' in window)) { initialized = true; return; }
        refreshVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = function() {
                refreshVoices();
                document.dispatchEvent(new CustomEvent('tts:voices-updated'));
            };
        }
        initialized = true;
    }

    function getVoices() { return usableVoices.slice(); }
    function isAvailable() { return usableVoices.length > 0; }

    function qualityWarning() {
        if (!isAvailable()) return null;
        const allRemote = usableVoices.every(function(v) { return v.localService === false; });
        if (allRemote) return 'Quality varies by device.';
        const allGeneric = usableVoices.every(function(v) { return /^(en|english)$/i.test(v.name || ''); });
        if (allGeneric) return 'Quality varies by device.';
        return null;
    }

    function getVoiceByName(name) {
        for (let i = 0; i < usableVoices.length; i++) {
            if (usableVoices[i].name === name) return usableVoices[i];
        }
        return null;
    }

    function speak(text, opts) {
        if (!isAvailable()) return;
        opts = opts || {};
        stop();
        const u = new SpeechSynthesisUtterance(text);
        const voiceName = opts.voice || (window.Settings && Settings.get('ttsVoice'));
        const voice = voiceName ? getVoiceByName(voiceName) : null;
        if (voice) u.voice = voice;
        u.rate = opts.rate || (window.Settings && Settings.get('ttsRate')) || 1.0;
        u.pitch = 1.0;
        u.onend = function() {
            currentUtterance = null;
            if (typeof opts.onEnd === 'function') opts.onEnd();
        };
        u.onerror = function() {
            currentUtterance = null;
            if (typeof opts.onError === 'function') opts.onError();
        };
        currentUtterance = u;
        window.speechSynthesis.speak(u);
    }

    function stop() {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        currentUtterance = null;
    }

    function isSpeaking() {
        return currentUtterance !== null && window.speechSynthesis.speaking;
    }

    init();

    window.TTS = {
        init: init, getVoices: getVoices, isAvailable: isAvailable,
        qualityWarning: qualityWarning, speak: speak, stop: stop, isSpeaking: isSpeaking
    };
})();
